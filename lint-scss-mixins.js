// Node.js script to lint SCSS files for missing mixins and fatal errors using Dart Sass
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const scssDirs = [
    path.resolve(__dirname, '../theme.asisaga.com/_sass'),
    path.resolve(__dirname, './_sass'),
];
let errors = [];

// Collect all mixin names defined in all SCSS files
function getAllMixinNames(dirs) {
    const mixinNames = new Set();
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.scss'));
        for (const file of files) {
            const filePath = path.join(dir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const mixinRegex = /@mixin\s+([\w-]+)/g;
            let match;
            while ((match = mixinRegex.exec(content)) !== null) {
                mixinNames.add(match[1]);
            }
        }
    }
    return mixinNames;
}

// Scan for @include statements and check if mixin exists
function checkIncludeMixins(dirs, mixinNames) {
    const missingMixins = [];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.scss'));
        for (const file of files) {
            const filePath = path.join(dir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const includeRegex = /@include\s+([\w-]+)/g;
            let match;
            while ((match = includeRegex.exec(content)) !== null) {
                if (!mixinNames.has(match[1])) {
                    missingMixins.push(`${file}: @include ${match[1]} (no matching @mixin)`);
                }
            }
        }
    }
    return missingMixins;
}

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

// Proactive check for missing mixins in @include statements
const mixinNames = getAllMixinNames(scssDirs);
const missingMixins = checkIncludeMixins(scssDirs, mixinNames);
if (missingMixins.length > 0) {
    errors.push(...missingMixins);
}

if (errors.length > 0) {
    console.error('SCSS errors found:');
    errors.forEach(err => console.error(err));
    process.exit(1);
} else {
    console.log('No missing mixins or fatal SCSS errors detected.');
    process.exit(0);
}
