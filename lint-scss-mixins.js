// Node.js script to lint SCSS files for missing mixins and fatal errors using Dart Sass

import * as sass from 'sass';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// For __dirname in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Command line flags
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');

// Read _config.yml for include paths and theme
const configPath = path.resolve(__dirname, '_config.yml');
let config = {};
if (fs.existsSync(configPath)) {
    config = yaml.load(fs.readFileSync(configPath, 'utf8')) || {};
}
const loadPaths = (config.sass && config.sass.load_paths) ? config.sass.load_paths : ['_sass'];
const theme = config.remote_theme || '';

console.log('🔍 SCSS Dependency Validator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Resolve include paths relative to project root
const scssDirs = loadPaths.map(p => path.resolve(__dirname, p));
if (theme) {
    // Try to add theme's _sass dir if present
    const themeSass = path.resolve(__dirname, `../${theme.split('/').pop()}/_sass`);
    if (fs.existsSync(themeSass)) {
        scssDirs.push(themeSass);
        console.log(`✓ Theme SCSS found: ${themeSass}`);
    } else {
        console.log(`⚠ Theme SCSS not found at: ${themeSass}`);
        console.log(`  Theme: ${theme}`);
        console.log(`  This may cause validation errors if theme dependencies are used.`);
    }
}

console.log(`✓ Scanning directories: ${scssDirs.join(', ')}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let errors = [];


// Recursively collect all .scss files in a directory
function getAllScssFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllScssFiles(filePath));
        } else if (file.endsWith('.scss')) {
            results.push(filePath);
        }
    }
    return results;
}

// Collect all mixin names defined in all SCSS files (recursively)
function getAllMixinNames(dirs) {
    const mixinNames = new Set();
    for (const dir of dirs) {
        const files = getAllScssFiles(dir);
        for (const filePath of files) {
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


// Compile all SCSS files to detect undefined mixins, variables, and other errors
for (const dir of scssDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = getAllScssFiles(dir);
    for (const filePath of files) {
        const relativePath = path.relative(__dirname, filePath);
        try {
            // Use verbose mode if --verbose flag is passed, otherwise suppress dependency warnings
            const compileOptions = { 
                loadPaths: scssDirs, 
                quietDeps: !VERBOSE,
                verbose: VERBOSE
            };
            sass.compile(filePath, compileOptions);
        } catch (e) {
            const msg = e.message || '';
            // Check for undefined mixin, fatal errors, undefined variable, or mixin argument mismatch
            if (
                /Undefined mixin/i.test(msg) ||
                /Undefined variable/i.test(msg) ||
                /SassError|SyntaxError|fatal/i.test(msg) ||
                /Mixin [^ ]+ takes \d+ arguments but \d+ (was|were) passed/i.test(msg)
            ) {
                errors.push(`${relativePath}: ${msg}`);
            }
        }
    }
}

if (errors.length > 0) {
    console.error('\n❌ SCSS VALIDATION FAILED');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`Found ${errors.length} error(s):\n`);
    errors.forEach(err => console.error(`  ✗ ${err}`));
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('💡 Troubleshooting:');
    console.error('  1. Check if mixins/variables exist in theme repository');
    console.error('  2. Verify _config.yml has correct remote_theme setting');
    console.error('  3. Review .github/instructions/scss.instructions.md');
    console.error('  4. Ensure theme is checked out in CI (see validate-scss.yml)');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
} else {
    console.log('✅ SCSS VALIDATION PASSED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('No missing mixins or fatal SCSS errors detected.');
    console.log('All dependencies are properly defined.\n');
    process.exit(0);
}
