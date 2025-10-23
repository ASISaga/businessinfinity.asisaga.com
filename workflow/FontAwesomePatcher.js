import fs from 'fs';
import path from 'path';

/**
 * FontAwesomePatcher applies compatibility patches to FontAwesome SCSS files for Jekyll builds.
 * - patchVariables: Sets $fw-width to 1.25em for Jekyll compatibility.
 * - patchMixins: Converts @use syntax and variable references to Jekyll-compatible @import and $var forms.
 */
export class FontAwesomePatcher {
    /**
     * Sets $fw-width to 1.25em in _variables.scss for Jekyll compatibility.
     * @param {string} variablesPath - Path to FontAwesome _variables.scss
     */
    patchVariables(variablesPath) {
        if (!fs.existsSync(variablesPath)) return;
        let content = fs.readFileSync(variablesPath, 'utf8');
        content = content.replace(/\$fw-width\s*:\s*[^;]+;/, '$fw-width              : 1.25em !default; // 20/16 = 1.25');
        fs.writeFileSync(variablesPath, content);
        console.log('[PATCH] Font Awesome _variables.scss $fw-width set to 1.25em for Jekyll compatibility.');
    }

    /**
     * Converts @use syntax and variable references in _mixins.scss to Jekyll-compatible @import and $var forms.
     * @param {string} mixinsPath - Path to FontAwesome _mixins.scss
     */
    patchMixins(mixinsPath) {
        if (!fs.existsSync(mixinsPath)) return;
        let content = fs.readFileSync(mixinsPath, 'utf8');
        content = content.replace(/@use 'variables' as v;/g, '@import "variables";');
        content = content.replace(/v\.\$([a-zA-Z0-9_-]+)/g, '$$$1');
        content = content.replace(/#\{v\.\$([a-zA-Z0-9_-]+)\}/g, '#{$$$1}');
        fs.writeFileSync(mixinsPath, content);
        console.log('[PATCH] Font Awesome _mixins.scss fully patched for Jekyll compatibility.');
    }
}
