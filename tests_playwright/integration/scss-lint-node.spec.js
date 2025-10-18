const { test, expect } = require('@playwright/test');
const sass = require('sass');
const fs = require('fs');
const path = require('path');

/**
 * Node-only SCSS lint test: Fails if any missing mixins or SCSS compilation errors are found.
 * Compiles all SCSS entry points using Dart Sass and parses output for 'Undefined mixin' and other errors.
 */
test('SCSS files should not have missing mixins or fatal errors (Node/Dart Sass)', async () => {
    // Find all SCSS entry points (files ending with .scss in theme/businessinfinity folders)
    const scssDirs = [
        path.resolve(__dirname, '../../theme.asisaga.com/_sass'),
        path.resolve(__dirname, '../_sass'),
    ];
    let errors = [];

    for (const dir of scssDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.scss'));
        for (const file of files) {
            const filePath = path.join(dir, file);
            try {
                sass.compile(filePath);
            } catch (e) {
                const msg = e.message || '';
                // Check for undefined mixin or fatal errors
                if (/Undefined mixin/i.test(msg) || /SassError|SyntaxError|fatal/i.test(msg)) {
                    errors.push(`${file}: ${msg}`);
                }
            }
        }
    }

    // Fail if any errors found
    expect(errors.length, `SCSS errors found: ${errors.join('\n')}`).toBe(0);
});
