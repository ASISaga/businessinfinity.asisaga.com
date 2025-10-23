import axios from 'axios';

/**
 * WorkflowManager interacts with GitHub Actions API for workflow monitoring and listing.
 * - getLatestRunNumber: Gets latest workflow run number for a given workflow ID.
 * - listAllWorkflows: Lists all workflows in the repository.
 */
export class WorkflowManager {
    /**
     * Initializes WorkflowManager with repo details and GitHub token.
     * @param {string} repoOwner - Repository owner
     * @param {string} repoName - Repository name
     * @param {string} branch - Branch name
     * @param {string} githubToken - GitHub token for API access
     */
    constructor(repoOwner, repoName, branch, githubToken) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.branch = branch;
        this.githubToken = githubToken;
    }

    /**
     * Gets the latest workflow run number for a given workflow ID.
     * @param {string|number} workflowId - Workflow ID
     * @returns {Promise<number>} - Latest run number
     */
    async getLatestRunNumber(workflowId) {
        const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/actions/workflows/${workflowId}/runs?branch=${this.branch}&per_page=1`;
        const resp = await axios.get(url, {
            headers: { Authorization: `token ${this.githubToken}` }
        });
        if (!resp.data.workflow_runs.length) throw new Error('No workflow runs found');
        return resp.data.workflow_runs[0].run_number;
    }

    /**
     * Lists all workflows in the repository and prints their details.
     * @returns {Promise<Array>} - Array of workflow objects
     */
    async listAllWorkflows() {
        const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/actions/workflows`;
        const resp = await axios.get(url, {
            headers: { Authorization: `token ${this.githubToken}` }
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
}
