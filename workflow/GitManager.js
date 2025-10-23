import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * GitManager handles all git operations, workflow monitoring, and log analysis for BusinessInfinity automation.
 * - pushThemeFirstThenBusinessInfinity: Pushes theme repo, waits, then pushes businessinfinity repo.
 * - getWorkflowRun: Gets latest or specific workflow run from GitHub Actions.
 * - waitForWorkflow: Waits for workflow run to complete.
 * - downloadLogs: Downloads and unzips workflow logs.
 * - analyzeWithMCP: Sends logs to MCP server for error extraction/intelligence.
 * - Designed for robust, modular automation and CI/CD integration.
 */
export class GitManager {
    /**
     * Initializes GitManager with theme and business repo directories.
     * @param {string} themeDir - Path to theme directory
     * @param {string} businessDir - Path to businessinfinity repo directory
     */
    constructor(themeDir, businessDir) {
        this.themeDir = themeDir;
        this.businessDir = businessDir;
    }

    /**
     * Runs a shell command synchronously and returns trimmed output.
     * @param {string} cmd
     * @returns {string}
     */
    /**
     * Runs a shell command synchronously and returns trimmed output.
     * @param {string} cmd - Shell command to execute
     * @returns {string} - Command output
     */
    run(cmd) {
        return execSync(cmd, { encoding: 'utf8' }).trim();
    }

    /**
     * Pushes theme repo, waits for remote update, then pushes businessinfinity repo.
     * Handles mock changes if no real changes detected.
     * @returns {Promise<boolean>} - True if real changes pushed, false if mock change
     */
    pushThemeFirstThenBusinessInfinity() {
        let themePushed = false;
        try {
            process.chdir(this.themeDir);
            const status = this.run('git status --porcelain');
            const local = this.run('git rev-parse @');
            const remote = this.run('git rev-parse @{u}');
            if (status.length > 0 || local !== remote) {
                console.log('[Theme] Pushing real changes...');
                this.run('git add -A');
                this.run('git commit -m "chore: deploy theme changes for businessinfinity"');
                this.run('git push');
                themePushed = true;
            } else {
                console.log('[Theme] No real changes, making mock change...');
                const file = path.join(this.themeDir, '.theme-rebuild-trigger');
                fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
                this.run('git add .theme-rebuild-trigger');
                this.run('git commit -m "chore: trigger theme rebuild [skip ci]"');
                this.run('git push');
                themePushed = true;
            }
        } catch (e) {
            console.error('[Theme] Error pushing theme repo:', e.message);
        } finally {
            process.chdir(this.businessDir);
        }
        // 2. Wait for remote theme update
        if (themePushed) {
            console.log('Waiting 3 seconds for remote theme update...');
            const countdown = async () => {
                for (let i = 3; i > 0; i--) {
                    process.stdout.write(`${i}.. `);
                    await new Promise(r => setTimeout(r, 1000));
                }
                console.log();
            };
            return countdown().then(() => {
                // 3. Push businessinfinity repo
                const status = this.run('git status --porcelain');
                const local = this.run('git rev-parse @');
                const remote = this.run('git rev-parse @{u}');
                if (status.length > 0 || local !== remote) {
                    console.log('[BusinessInfinity] Pushing real changes...');
                    this.run('git add -A');
                    this.run('git commit -m "chore: deploy businessinfinity changes"');
                    this.run('git push');
                    return true;
                } else {
                    console.log('[BusinessInfinity] No real changes, making mock change...');
                    const file = path.join(this.businessDir, '.theme-rebuild-trigger');
                    fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
                    this.run('git add .theme-rebuild-trigger');
                    this.run('git commit -m "chore: trigger rebuild for new theme release [skip ci]"');
                    this.run('git push');
                    return false;
                }
            });
        } else {
            // If theme not pushed, still push businessinfinity
            const status = this.run('git status --porcelain');
            const local = this.run('git rev-parse @');
            const remote = this.run('git rev-parse @{u}');
            if (status.length > 0 || local !== remote) {
                console.log('[BusinessInfinity] Pushing real changes...');
                this.run('git add -A');
                this.run('git commit -m "chore: deploy businessinfinity changes"');
                this.run('git push');
                return true;
            } else {
                console.log('[BusinessInfinity] No real changes, making mock change...');
                const file = path.join(this.businessDir, '.theme-rebuild-trigger');
                fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
                this.run('git add .theme-rebuild-trigger');
                this.run('git commit -m "chore: trigger rebuild for new theme release [skip ci]"');
                this.run('git push');
                return false;
            }
        }
    }

    /**
     * Gets latest or specific workflow run from GitHub Actions.
     * @param {number|null} runNumber - Run number to fetch, or null for latest
     * @returns {Promise<Object>} - Workflow run object
     */
    async getWorkflowRun(runNumber = null) {
        const workflowId = '171259422';
        let url = `https://api.github.com/repos/ASISaga/businessinfinity.asisaga.com/actions/workflows/${workflowId}/runs?branch=main&per_page=10`;
        const resp = await import('axios').then(ax => ax.default.get(url, {
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        }));
        if (!resp.data.workflow_runs.length) throw new Error('No workflow runs found');
        if (runNumber) {
            const match = resp.data.workflow_runs.find(r => r.run_number === runNumber);
            if (!match) throw new Error(`Run number ${runNumber} not found in recent runs.`);
            return match;
        }
        return resp.data.workflow_runs[0]; // latest
    }

    /**
     * Waits for workflow run to complete and returns its conclusion.
     * @param {number|string} runId - Workflow run ID
     * @returns {Promise<string>} - Workflow conclusion ('success', 'failure', etc.)
     */
    async waitForWorkflow(runId) {
        let status = 'in_progress';
        let conclusion = null;
        while (status === 'in_progress' || status === 'queued') {
            const url = `https://api.github.com/repos/ASISaga/businessinfinity.asisaga.com/actions/runs/${runId}`;
            const resp = await import('axios').then(ax => ax.default.get(url, {
                headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            }));
            status = resp.data.status;
            conclusion = resp.data.conclusion;
            process.stdout.write(`Workflow status: ${status}\r`);
            if (status === 'completed') break;
            await new Promise(r => setTimeout(r, 15000)); // Wait 15s
        }
        console.log(`\nWorkflow completed with conclusion: ${conclusion}`);
        return conclusion;
    }

    /**
     * Downloads and unzips workflow logs for a given run ID.
     * @param {number|string} runId - Workflow run ID
     * @returns {Promise<string>} - Log file content
     */
    async downloadLogs(runId) {
        const url = `https://api.github.com/repos/ASISaga/businessinfinity.asisaga.com/actions/runs/${runId}/logs`;
        const resp = await import('axios').then(ax => ax.default.get(url, {
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
            responseType: 'arraybuffer'
        }));
        const zipPath = path.join(process.cwd(), 'workflow-logs.zip');
        fs.writeFileSync(zipPath, resp.data);
        this.run(`powershell -Command "Expand-Archive -Path workflow-logs.zip -DestinationPath workflow-logs -Force"`);
        const files = fs.readdirSync('workflow-logs');
        const logFile = files.find(f => f.endsWith('.txt'));
        if (!logFile) throw new Error('No log file found in logs');
        const logContent = fs.readFileSync(path.join('workflow-logs', logFile), 'utf8');
        return logContent;
    }

    /**
     * Sends logs to MCP server for error extraction/intelligence.
     * @param {string} logContent - Workflow log content
     * @returns {Promise<Object>} - MCP analysis result
     */
    async analyzeWithMCP(logContent) {
        const resp = await import('axios').then(ax => ax.default.post('https://api.githubcopilot.com/mcp/', {
            tool: 'github_actions_log_analysis',
            repo: 'ASISaga/businessinfinity.asisaga.com',
            log: logContent
        }));
        return resp.data;
    }
}
