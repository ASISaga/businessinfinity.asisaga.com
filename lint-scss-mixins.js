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

// Collect all string and nil/null variable assignments
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
    console.error('SCSS errors found:');
    errors.forEach(err => console.error(err));
    process.exit(1);
} else {
    console.log('No missing mixins or fatal SCSS errors detected.');
    process.exit(0);
}
