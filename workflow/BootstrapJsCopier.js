import fs from 'fs';
import path from 'path';

/**
 * BootstrapJsCopier copies Bootstrap JS ES module to theme assets directory.
 * - copyBootstrapJs: Copies JS file to assets/js/vendor, creating directories as needed.
 */
export class BootstrapJsCopier {
    /**
     * Copies Bootstrap JS ES module from src to dest, creating directories as needed.
     * @param {string} src - Source JS file path
     * @param {string} dest - Destination JS file path in theme assets
     */
    copyBootstrapJs(src, dest) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        console.log('[STAGE 1] Bootstrap JS ES module (non-minified) copied to assets/js/vendor.');
    }
}
