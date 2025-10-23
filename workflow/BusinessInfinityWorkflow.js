
// BusinessInfinityWorkflow orchestrates hybrid automation for iterative debugging of businessinfinity.asisaga.com
// Uses: GitHub API for repo/workflow, MCP server for log intelligence
// Prerequisites: Node.js, git, axios, MCP server running
// Auth: Set GITHUB_TOKEN as an environment variable OR in a local .env file (never commit .env)
// Usage: node automate-businessinfinity-debug.js

import { ScssCopier } from './ScssCopier.js';
import { FontAwesomePatcher } from './FontAwesomePatcher.js';
import { BootstrapJsCopier } from './BootstrapJsCopier.js';
import { WorkflowManager } from './WorkflowManager.js';
import { GitManager } from './GitManager.js';
import { ErrorExtractor } from './ErrorExtractor.js';
import fs from 'fs';
import path from 'path';

/**
 * BusinessInfinityWorkflow orchestrates hybrid automation for iterative debugging and deployment of businessinfinity.asisaga.com.
 * - Copies SCSS, FontAwesome, and Bootstrap JS assets using dedicated classes.
 * - Pushes theme and businessinfinity repos using GitManager.
 * - Monitors GitHub Actions workflow, downloads logs, and extracts errors using ErrorExtractor.
 * - Designed for maintainable, modular automation and error handling.
 */
export class BusinessInfinityWorkflow {
    /**
     * Initializes BusinessInfinityWorkflow with theme and business repo directories.
     * @param {string} themeDir - Path to theme directory
     * @param {string} businessDir - Path to businessinfinity repo directory
     */
    constructor(themeDir, businessDir) {
        this.themeDir = themeDir;
        this.businessDir = businessDir;
        this.gitManager = new GitManager(themeDir, businessDir);
    }

    /**
     * Runs the full automation workflow:
     * 1. Copies SCSS, FontAwesome, and Bootstrap JS assets.
     * 2. Pushes theme and businessinfinity repos.
     * 3. Monitors workflow, downloads logs, and extracts errors.
     */
    async run() {
        // --- STAGE 1: Dart Sass Dependency Resolution & Selective Copy ---
        // Recursively copy only imported SCSS files from npm packages to _sass dirs
        const scssCopier = new ScssCopier();
        scssCopier.copyBootstrap(
            path.join(this.businessDir, '..', 'node_modules', 'bootstrap', 'scss', 'bootstrap.scss'),
            path.join(this.businessDir, '..', 'node_modules', 'bootstrap', 'scss'),
            path.join(this.themeDir, '_sass', 'bootstrap')
        );
        scssCopier.copyFontAwesomeScss(
            path.resolve(this.businessDir, '../node_modules/font-awesome/scss'),
            path.resolve(this.themeDir, '_sass/fontawesome')
        );
        const faPatcher = new FontAwesomePatcher();
        faPatcher.patchVariables(path.resolve(this.themeDir, '_sass/fontawesome/_variables.scss'));
        faPatcher.patchMixins(path.resolve(this.themeDir, '_sass/fontawesome/_mixins.scss'));
        const jsCopier = new BootstrapJsCopier();
        jsCopier.copyBootstrapJs(
            path.join(this.businessDir, '..', 'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.esm.js'),
            path.join(this.themeDir, 'assets/js/vendor/bootstrap.esm.js')
        );
        // 2. Git push and workflow
        const beforeRun = await this.gitManager.getWorkflowRun();
        const beforeRunNumber = beforeRun.run_number;
        await this.gitManager.pushThemeFirstThenBusinessInfinity();
        let afterRunNumber = beforeRunNumber;
        let attempts = 0;
        while (afterRunNumber <= beforeRunNumber && attempts < 20) {
            await new Promise(r => setTimeout(r, 5000));
            const afterRun = await this.gitManager.getWorkflowRun();
            afterRunNumber = afterRun.run_number;
            attempts++;
        }
        if (afterRunNumber <= beforeRunNumber) throw new Error('No new workflow run detected after push.');
        const run = await this.gitManager.getWorkflowRun(afterRunNumber);
        const conclusion = await this.gitManager.waitForWorkflow(run.id);
        if (conclusion !== 'success') {
            await this.gitManager.downloadLogs(run.id);
            const logDir = './workflow-logs';
            const logFiles = fs.readdirSync(logDir).filter(f => f.endsWith('.txt'));
            let foundAny = false;
            for (const file of logFiles) {
                const errorExtractor = new ErrorExtractor(path.join(logDir, file));
                const error = errorExtractor.extractFirstError();
                if (error) {
                    console.log(error);
                    foundAny = true;
                    break;
                }
            }
            if (!foundAny) console.log('No errors detected in any workflow log file.');
        } else {
            console.log('Workflow succeeded! No errors detected.');
        }
    }
}
