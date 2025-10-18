// Node.js script to lint SCSS files for missing mixins and fatal errors using Dart Sass
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const scssDirs = [
    path.resolve(__dirname, '../theme.asisaga.com/_sass'),
    path.resolve(__dirname, './_sass'),
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
            // Check for undefined mixin, fatal errors, or mixin argument mismatch
            if (
                /Undefined mixin/i.test(msg) ||
                /SassError|SyntaxError|fatal/i.test(msg) ||
                /Mixin [^ ]+ takes \d+ arguments but \d+ (was|were) passed/i.test(msg)
            ) {
                errors.push(`${file}: ${msg}`);
            }
        }
    }
}

if (errors.length > 0) {
    console.error('SCSS errors found:');
    errors.forEach(err => console.error(err));
    process.exit(1);
} else {
    console.log('No missing mixins or fatal SCSS errors detected.');
    process.exit(0);
}
