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

// Step 1: Check for uncommitted/unpushed changes and push or make mock change
function ensurePush() {
    const status = run('git status --porcelain');
    const local = run('git rev-parse @');
    const remote = run('git rev-parse @{u}');
    if (status.length > 0 || local !== remote) {
        console.log('Pushing real changes...');
        run('git add -A');
        run('git commit -m "chore: deploy businessinfinity changes"');
        run('git push');
        return true;
    } else {
        console.log('No real changes, making mock change...');
        const file = path.join(process.cwd(), '.theme-rebuild-trigger');
        fs.writeFileSync(file, `Theme rebuild trigger: ${new Date().toISOString()}\n`);
        run('git add .theme-rebuild-trigger');
        run('git commit -m "chore: trigger rebuild for new theme release [skip ci]"');
        run('git push');
        return false;
    }
}

// Step 2: Get latest pages-build-deployment workflow run
async function getLatestWorkflowRun() {
    // Use only the workflow file name for GitHub API lookup
    const workflowFile = 'pages-build-deployment.yml';
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${encodeURIComponent(workflowFile)}/runs?branch=${BRANCH}&per_page=1`;
    const resp = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!resp.data.workflow_runs.length) throw new Error('No workflow runs found');
    return resp.data.workflow_runs[0];
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
    // 1. Ensure a push (real or mock)
    ensurePush();

    // 2. List all workflows to help select the correct one
    await listAllWorkflows();
    // Comment out the rest for now to focus on workflow discovery
    // // 2. Get latest workflow run
    // console.log('Fetching latest workflow run...');
    // const run = await getLatestWorkflowRun();
    // console.log(`Latest run: #${run.run_number} (${run.status})`);

    // // 3. Wait for workflow to finish
    // const conclusion = await waitForWorkflow(run.id);
    // if (conclusion !== 'success') {
    //     // 4. Download logs
    //     console.log('Downloading workflow logs...');
    //     const logContent = await downloadLogs(run.id);
    //     // 5. Analyze with MCP
    //     console.log('Analyzing logs with MCP server...');
    //     const mcpResult = await analyzeWithMCP(logContent);
    //     // 6. Show results
    //     console.log('--- MCP Analysis Result ---');
    //     console.log(JSON.stringify(mcpResult, null, 2));
    //     // 7. Optionally, prompt for next steps or loop
    //     // (You can add code here to auto-fix, open Copilot, or prompt user)
    // } else {
    //     console.log('Workflow succeeded! No errors detected.');
    // }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
