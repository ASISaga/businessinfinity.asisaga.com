// Entry point for BusinessInfinity automation.
// Minimal runner that delegates all work to BusinessInfinityWorkflow and its helper classes.
// Prerequisites: Node.js, git. Set GITHUB_TOKEN in env or provide via .env.

import path from 'path';
import { BusinessInfinityWorkflow } from './BusinessInfinityWorkflow.js';

// Support legacy .env files for convenience during development
try { (await import('dotenv')).config(); } catch (e) { /* optional */ }

// Main IIFE: construct workflow and run
(async () => {
    const themeDir = path.resolve(process.cwd(), '../theme.asisaga.com');
    const businessDir = process.cwd();
    const workflow = new BusinessInfinityWorkflow(themeDir, businessDir);
    try {
        await workflow.run();
        console.log('BusinessInfinity workflow completed.');
        process.exit(0);
    } catch (err) {
        console.error('BusinessInfinity workflow failed:', err && err.message ? err.message : err);
        process.exit(1);
    }
})();

