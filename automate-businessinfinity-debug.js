// --- SELECTIVE SCSS COPY ---
// Recursively copy only imported SCSS files from npm packages to _sass dirs
function getScssImports(filePath, seen = new Set()) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /@import\s+["']([^"']+)["']/g;
    let match;
    const imports = [];
    while ((match = importRegex.exec(content))) {
        let imp = match[1];
        // Remove file extension and leading underscores
        imp = imp.replace(/\.scss$/, '').replace(/^_/, '');
        imports.push(imp);
    }
    return imports;
}

function resolveScssDeps(entryFile, scssRoot, destRoot, copied = new Set()) {
    const entry = path.resolve(scssRoot, entryFile);
    if (!fs.existsSync(entry)) return;
    if (copied.has(entry)) return;
    copied.add(entry);
    // Copy file
    const relPath = path.relative(scssRoot, entry);
    const destPath = path.join(destRoot, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(entry, destPath);
    // Parse imports
    const imports = getScssImports(entry);
    for (const imp of imports) {
        // Try _imp.scss, imp.scss, imp/index.scss
        const candidates = [
            path.join(scssRoot, `_${imp}.scss`),
            path.join(scssRoot, `${imp}.scss`),
            path.join(scssRoot, imp, 'index.scss')
        ];
        for (const cand of candidates) {
            if (fs.existsSync(cand)) {
                resolveScssDeps(path.relative(scssRoot, cand), scssRoot, destRoot, copied);
                break;
            }
        }
    }
}

function selectiveCopyAllScss() {
    // Bootstrap
    const bootstrapEntry = 'bootstrap.scss';
    // Use node_modules in the Website directory (parent of businessinfinity.asisaga.com)
    const bootstrapSrc = path.join(__dirname, '..', 'node_modules', 'bootstrap', 'scss');
    const bootstrapDest = path.resolve(__dirname, '../theme.asisaga.com/_sass/bootstrap');
    // Copy Bootstrap's vendor/rfs.scss to _sass/vendor/rfs.scss for Jekyll compatibility
    // Use _rfs.scss as the source file
    // Copy _rfs.scss to _sass/vendor/_rfs.scss for Jekyll compatibility with @import "vendor/rfs"
    const rfsSrc = path.join(__dirname, '..', 'node_modules', 'bootstrap', 'scss', 'vendor', '_rfs.scss');
    const rfsDest = path.join(__dirname, '..', 'theme.asisaga.com', '_sass', 'vendor', '_rfs.scss');
    console.log(`[DEBUG] RFS: srcFile=${rfsSrc}, destFile=${rfsDest}`);
    if (fs.existsSync(rfsSrc)) {
        fs.mkdirSync(path.dirname(rfsDest), { recursive: true });
        fs.copyFileSync(rfsSrc, rfsDest);
        console.log(`[DEBUG] Copied: ${rfsSrc} -> ${rfsDest}`);
    } else {
        console.warn(`[DEBUG] Source file does not exist: ${rfsSrc}`);
    }
    // Always copy critical Bootstrap files
    const criticalBootstrap = [
        '_functions.scss',
        '_variables.scss',
        '_variables-dark.scss',
        '_mixins.scss',
        '_root.scss'
    ];
    for (const file of criticalBootstrap) {
        const srcFile = path.join(bootstrapSrc, file);
        const destFile = path.join(bootstrapDest, file);
        console.log(`[DEBUG] Bootstrap: srcFile=${srcFile}, destFile=${destFile}`);
        if (fs.existsSync(srcFile)) {
            fs.mkdirSync(path.dirname(destFile), { recursive: true });
            fs.copyFileSync(srcFile, destFile);
            console.log(`[DEBUG] Copied: ${srcFile} -> ${destFile}`);
        } else {
            console.warn(`[DEBUG] Source file does not exist: ${srcFile}`);
        }
    }
    resolveScssDeps(bootstrapEntry, bootstrapSrc, bootstrapDest);
    // Font Awesome
    const faEntry = 'fontawesome.scss';
    const faSrc = path.resolve(__dirname, '../../node_modules/@fortawesome/fontawesome-free/scss');
    const faDest = path.resolve(__dirname, '../theme.asisaga.com/_sass/fontawesome');
    resolveScssDeps(faEntry, faSrc, faDest);
    // Optionally, add more entries as needed
    console.log('Selective SCSS copy complete.');
}
// Utility: Get the latest workflow run number
async function getLatestRunNumber() {
    const workflowId = '171259422';
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${workflowId}/runs?branch=${BRANCH}&per_page=1`;
    const resp = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!resp.data.workflow_runs.length) throw new Error('No workflow runs found');
    return resp.data.workflow_runs[0].run_number;
}
// Utility: List all workflows for the repo
async function listAllWorkflows() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows`;
    const resp = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!resp.data.workflows || !resp.data.workflows.length) {
        console.log('No workflows found.');
        return [];
    }
    console.log('--- Available Workflows ---');
    resp.data.workflows.forEach(wf => {
        console.log(`- Name: ${wf.name}\n  ID: ${wf.id}\n  File: ${wf.path}`);
    });
    return resp.data.workflows;
}
// automate-businessinfinity-debug.js
// Hybrid automation for iterative debugging of businessinfinity.asisaga.com
// Uses: GitHub API for repo/workflow, MCP server for log intelligence

// Prerequisites: Node.js, git, axios, MCP server running
// Auth: Set GITHUB_TOKEN as an environment variable OR in a local .env file (never commit .env)
// Usage: node automate-businessinfinity-debug.js


// Load .env if present (for GITHUB_TOKEN convenience)
try { require('dotenv').config(); } catch (e) { /* dotenv not installed */ }
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// --- CONFIG ---
const REPO_OWNER = 'ASISaga';
const REPO_NAME = 'businessinfinity.asisaga.com';
const BRANCH = 'main';
const MCP_SERVER = 'https://api.githubcopilot.com/mcp/'; // Updated to use github-mcp-server endpoint
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) throw new Error('Set GITHUB_TOKEN env var or add it to a .env file (GITHUB_TOKEN=...)');

// --- UTILS ---
function run(cmd) {
    return execSync(cmd, { encoding: 'utf8' }).trim();
}


// Step 1: Push changes to theme repo, then businessinfinity
function pushThemeFirstThenBusinessInfinity() {
    // 1. Push theme repo
    const themeDir = path.resolve(__dirname, '../theme.asisaga.com');
    const businessDir = process.cwd();
    let themePushed = false;
    try {
        process.chdir(themeDir);
        const status = run('git status --porcelain');
        const local = run('git rev-parse @');
        const remote = run('git rev-parse @{u}');
        if (status.length > 0 || local !== remote) {
            console.log('[Theme] Pushing real changes...');
            run('git add -A');
            run('git commit -m "chore: deploy theme changes for businessinfinity"');
            run('git push');
            themePushed = true;
        } else {
            console.log('[Theme] No real changes, making mock change...');
            const file = path.join(themeDir, '.theme-rebuild-trigger');
            fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
            run('git add .theme-rebuild-trigger');
            run('git commit -m "chore: trigger theme rebuild [skip ci]"');
            run('git push');
            themePushed = true;
        }
    } catch (e) {
        console.error('[Theme] Error pushing theme repo:', e.message);
    } finally {
        process.chdir(businessDir);
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
            const status = run('git status --porcelain');
            const local = run('git rev-parse @');
            const remote = run('git rev-parse @{u}');
            if (status.length > 0 || local !== remote) {
                console.log('[BusinessInfinity] Pushing real changes...');
                run('git add -A');
                run('git commit -m "chore: deploy businessinfinity changes"');
                run('git push');
                return true;
            } else {
                console.log('[BusinessInfinity] No real changes, making mock change...');
                const file = path.join(businessDir, '.theme-rebuild-trigger');
                fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
                run('git add .theme-rebuild-trigger');
                run('git commit -m "chore: trigger rebuild for new theme release [skip ci]"');
                run('git push');
                return false;
            }
        });
    } else {
        // If theme not pushed, still push businessinfinity
        const status = run('git status --porcelain');
        const local = run('git rev-parse @');
        const remote = run('git rev-parse @{u}');
        if (status.length > 0 || local !== remote) {
            console.log('[BusinessInfinity] Pushing real changes...');
            run('git add -A');
            run('git commit -m "chore: deploy businessinfinity changes"');
            run('git push');
            return true;
        } else {
            console.log('[BusinessInfinity] No real changes, making mock change...');
            const file = path.join(businessDir, '.theme-rebuild-trigger');
            fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
            run('git add .theme-rebuild-trigger');
            run('git commit -m "chore: trigger rebuild for new theme release [skip ci]"');
            run('git push');
            return false;
        }
    }
}

// Step 2: Get latest pages-build-deployment workflow run
async function getWorkflowRun(runNumber = null) {
    // Use the workflow ID as per GitHub API documentation
    const workflowId = '171259422';
    let url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${workflowId}/runs?branch=${BRANCH}&per_page=10`;
    const resp = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!resp.data.workflow_runs.length) throw new Error('No workflow runs found');
    if (runNumber) {
        const match = resp.data.workflow_runs.find(r => r.run_number === runNumber);
        if (!match) throw new Error(`Run number ${runNumber} not found in recent runs.`);
        return match;
    }
    return resp.data.workflow_runs[0]; // latest
}

// Step 3: Wait for workflow run to complete
async function waitForWorkflow(runId) {
    let status = 'in_progress';
    let conclusion = null;
    while (status === 'in_progress' || status === 'queued') {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs/${runId}`;
        const resp = await axios.get(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        status = resp.data.status;
        conclusion = resp.data.conclusion;
        process.stdout.write(`Workflow status: ${status}\r`);
        if (status === 'completed') break;
        await new Promise(r => setTimeout(r, 15000)); // Wait 15s
    }
    console.log(`\nWorkflow completed with conclusion: ${conclusion}`);
    return conclusion;
}

// Step 4: Download workflow logs
async function downloadLogs(runId) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs/${runId}/logs`;
    const resp = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
        responseType: 'arraybuffer'
    });
    const zipPath = path.join(process.cwd(), 'workflow-logs.zip');
    fs.writeFileSync(zipPath, resp.data);
    // Unzip and return first log file content (requires unzip CLI)
    run(`powershell -Command "Expand-Archive -Path workflow-logs.zip -DestinationPath workflow-logs -Force"`);
    const files = fs.readdirSync('workflow-logs');
    const logFile = files.find(f => f.endsWith('.txt'));
    if (!logFile) throw new Error('No log file found in logs');
    const logContent = fs.readFileSync(path.join('workflow-logs', logFile), 'utf8');
    return logContent;
}

// Step 5: Send logs to MCP server for error extraction/intelligence
async function analyzeWithMCP(logContent) {
    const resp = await axios.post(MCP_SERVER, {
        tool: 'github_actions_log_analysis',
        repo: `${REPO_OWNER}/${REPO_NAME}`,
        log: logContent
    });
    return resp.data;
}

// Step 6: Present results and optionally loop for fixes
async function main() {

    // 1. Get latest run number before push
    console.log('Fetching latest workflow run number before push...');
    const beforeRunNumber = await getLatestRunNumber();
    console.log(`Latest run number before push: #${beforeRunNumber}`);

    // 2. Ensure a push (theme first, then businessinfinity)
    await pushThemeFirstThenBusinessInfinity();

    // 3. Wait for a new run to appear
    let afterRunNumber = beforeRunNumber;
    let attempts = 0;
    while (afterRunNumber <= beforeRunNumber && attempts < 20) {
        await new Promise(r => setTimeout(r, 5000)); // Wait 5s
        afterRunNumber = await getLatestRunNumber();
        attempts++;
    }
    if (afterRunNumber <= beforeRunNumber) {
        throw new Error('No new workflow run detected after push.');
    }
    console.log(`Latest run number after push: #${afterRunNumber}`);

    // 4. Get the new workflow run
    const run = await getWorkflowRun(afterRunNumber);
    console.log(`Selected run: #${run.run_number} (${run.status})`);

    // 3. Wait for workflow to finish
    const conclusion = await waitForWorkflow(run.id);
    if (conclusion !== 'success') {
        // 4. Download logs
        console.log('Downloading workflow logs...');
        await downloadLogs(run.id); // Unzips all logs
        // 5. Scan all log files for errors
        const fs = require('fs');
        const logDir = './workflow-logs';
        const logFiles = fs.readdirSync(logDir).filter(f => f.endsWith('.txt'));
        const patterns = [
            /error/i,
            /failed/i,
            /exception/i,
            /traceback/i,
            /not found/i,
            /no such file/i,
            /cannot/i,
            /undefined/i,
            /Conversion error/i,
            /Sass::SyntaxError/i,
            /Undefined mixin/i,
            /Jekyll::Converters::Scss/i
        ];
        const stripAnsi = s => s.replace(/\x1b\[[0-9;]*m/g, '');
        let foundAny = false;
        for (const file of logFiles) {
            const content = fs.readFileSync(`${logDir}/${file}`, 'utf8');
            const lines = content.split('\n');
            let found = false;
            for (let i = 0; i < lines.length; i++) {
                const clean = stripAnsi(lines[i]);
                if (patterns.some(p => p.test(clean))) {
                    if (!found) {
                        console.log(`\n--- Errors in ${file} ---`);
                        found = true;
                        foundAny = true;
                    }
                    const start = Math.max(0, i - 2);
                    const end = Math.min(lines.length, i + 3);
                    for (let j = start; j < end; j++) {
                        console.log(stripAnsi(lines[j]));
                    }
                    console.log('---');
                }
            }
        }
        if (!foundAny) {
            console.log('No obvious error lines found in any log file.');
        }
        // Optionally, print a summary or next steps
    } else {
        console.log('Workflow succeeded! No errors detected.');
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
// Selectively copy only needed SCSS files from npm packages
try {
    selectiveCopyAllScss();
    console.log('Linting SCSS for missing mixins and fatal errors...');
    execSync(`node ${path.resolve(__dirname, 'lint-scss-mixins.js')}`, { stdio: 'inherit' });
    console.log('SCSS lint passed. Proceeding with push.');
} catch (e) {
    console.error('SCSS lint failed. Aborting push.');
    process.exit(1);
}
