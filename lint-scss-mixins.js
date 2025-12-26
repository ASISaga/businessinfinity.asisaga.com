// Node.js script to lint SCSS files for missing mixins and fatal errors using Dart Sass

import * as sass from 'sass';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// For __dirname in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            sass.compile(filePath, { loadPaths: scssDirs, quietDeps: true, quiet: true });
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

// (Removed manual @include scan; rely on Dart Sass for missing mixin detection)

// --- Additional proactive lint checks ---
function getAllScssContents(dirs) {
    let contents = [];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.scss'));
        for (const file of files) {
            const filePath = path.join(dir, file);
            contents.push({ file, content: fs.readFileSync(filePath, 'utf8') });
        }
    }
    return contents;
}

const allScss = getAllScssContents(scssDirs);

// 1. Math operations involving strings or non-numeric values
const mathOpRegex = /([\$\w-]+)\s*([+\-*/%])\s*([\$\w-]+|['"][^'"]+['"])/g;
const stringVarRegex = /([\$\w-]+)\s*:\s*['"][^'"]+['"]/g;
const nilVarRegex = /([\$\w-]+)\s*:\s*(nil|null)/gi;
let stringVars = new Set();
let nilVars = new Set();
let definedVars = new Set();

// Collect all string and nil/null variable assignments, and all defined variables
for (const { file, content } of allScss) {
    let m;
    while ((m = stringVarRegex.exec(content)) !== null) {
        stringVars.add(m[1]);
    }
    while ((m = nilVarRegex.exec(content)) !== null) {
        nilVars.add(m[1]);
        errors.push(`${file}: Variable ${m[1]} assigned to nil/null`);
    }
    // Collect all defined variables
    const varDefRegex = /([\$\w-]+)\s*:/g;
    while ((m = varDefRegex.exec(content)) !== null) {
        definedVars.add(m[1]);
    }
}

// --- Enhancement: Check for all undefined variable usages ---
function stripComments(scss) {
    // Remove /* ... */ block comments
    scss = scss.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove // ... line comments
    scss = scss.replace(/(^|[^:])\/\/.*$/gm, '$1');
    return scss;
}

for (const { file, content } of allScss) {
    const cleanContent = stripComments(content);
    // Find all $variable usages (not followed by a colon, to avoid double-counting definitions)
    const varUseRegex = /\$[\w-]+/g;
    let match;
    while ((match = varUseRegex.exec(cleanContent)) !== null) {
        const varName = match[0];
        // If not defined anywhere, and not a built-in (e.g., $color), report as error
        if (!definedVars.has(varName)) {
            errors.push(`${file}: Usage of undefined variable ${varName}`);
        }
    }
}

// 2. Math operations checks
for (const { file, content } of allScss) {
    let m;
    while ((m = mathOpRegex.exec(content)) !== null) {
        const left = m[1], op = m[2], right = m[3];
        // If either side is a string literal or a string variable
        if (/['"]/.test(left) || stringVars.has(left)) {
            errors.push(`${file}: Math operation ${left} ${op} ${right} (left operand is string)`);
        }
        if (/['"]/.test(right) || stringVars.has(right)) {
            errors.push(`${file}: Math operation ${left} ${op} ${right} (right operand is string)`);
        }
        // If either side is a nil/null variable
        if (nilVars.has(left)) {
            errors.push(`${file}: Math operation ${left} ${op} ${right} (left operand is nil/null)`);
        }
        if (nilVars.has(right)) {
            errors.push(`${file}: Math operation ${left} ${op} ${right} (right operand is nil/null)`);
        }
        // If either side is an undefined variable
        if ((left.startsWith('$') && !definedVars.has(left)) || (right.startsWith('$') && !definedVars.has(right))) {
            errors.push(`${file}: Math operation ${left} ${op} ${right} (undefined variable)`);
        }
    }
}

// 3. Bootstrap variables set to null used in math
const bootstrapNullVars = new Set();
for (const { file, content } of allScss) {
    if (!file.includes('bootstrap')) continue;
    let m;
    while ((m = nilVarRegex.exec(content)) !== null) {
        bootstrapNullVars.add(m[1]);
    }
}
for (const { file, content } of allScss) {
    let m;
    while ((m = mathOpRegex.exec(content)) !== null) {
        const left = m[1], right = m[3];
        if (bootstrapNullVars.has(left)) {
            errors.push(`${file}: Math operation uses Bootstrap null variable ${left}`);
        }
        if (bootstrapNullVars.has(right)) {
            errors.push(`${file}: Math operation uses Bootstrap null variable ${right}`);
        }
    }
}
// --- End additional lint checks ---
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
