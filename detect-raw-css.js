#!/usr/bin/env node
/**
 * Raw CSS Detector for Genesis Ontological SCSS Design System
 * 
 * Scans SCSS files for raw CSS properties that violate the "zero raw CSS" rule.
 * All styling should come from Genesis ontological mixins.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns that indicate raw CSS properties
const RAW_CSS_PATTERNS = [
  // Color properties
  /^\s+color:/,
  /^\s+background(?:-color)?:/,
  /^\s+border-color:/,
  
  // Box model
  /^\s+margin(?:-\w+)?:/,
  /^\s+padding(?:-\w+)?:/,
  /^\s+width:/,
  /^\s+height:/,
  /^\s+min-(?:width|height):/,
  /^\s+max-(?:width|height):/,
  
  // Layout
  /^\s+display:/,
  /^\s+position:/,
  /^\s+flex(?:-\w+)?:/,
  /^\s+grid(?:-\w+)?:/,
  
  // Typography (excluding CSS variables)
  /^\s+font-(?:size|weight|family):/,
  /^\s+line-height:/,
  /^\s+text-(?:align|decoration|transform):/,
  
  // Effects
  /^\s+box-shadow:/,
  /^\s+text-shadow:/,
  /^\s+opacity:/,
  /^\s+transform:/,
  /^\s+transition:/,
  /^\s+animation:/,
  
  // Border
  /^\s+border(?:-\w+)?:/,
  /^\s+border-radius:/,
  /^\s+outline:/,
  
  // Other common properties
  /^\s+overflow(?:-\w+)?:/,
  /^\s+z-index:/,
  /^\s+cursor:/,
  /^\s+visibility:/,
];

// Exceptions - lines that are allowed despite matching patterns
const EXCEPTIONS = [
  /\/\//,  // Comments
  /^\s*@/,  // At-rules (@include, @mixin, etc.)
  /^\s*\$/,  // Variables
  /^\s*\/\*/,  // Block comment start
  /^\s*\*\//,  // Block comment end
  /var\(/,  // CSS custom properties
];

function isException(line) {
  return EXCEPTIONS.some(pattern => pattern.test(line));
}

function detectRawCSS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  
  lines.forEach((line, index) => {
    if (isException(line)) return;
    
    for (const pattern of RAW_CSS_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          line: index + 1,
          content: line.trim()
        });
        break;  // Only report once per line
      }
    }
  });
  
  return violations;
}

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

console.log('🔍 Raw CSS Detector');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Scanning for raw CSS properties in SCSS files...\n');

const scssDir = path.resolve(__dirname, '_sass');
const files = getAllScssFiles(scssDir);

let totalViolations = 0;
const violationsByFile = {};

files.forEach(file => {
  const violations = detectRawCSS(file);
  if (violations.length > 0) {
    const relativePath = path.relative(__dirname, file);
    violationsByFile[relativePath] = violations;
    totalViolations += violations.length;
  }
});

if (totalViolations === 0) {
  console.log('✅ NO RAW CSS DETECTED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('All SCSS files use only Genesis ontological mixins.');
  console.log('Architecture compliance: PASSED\n');
  process.exit(0);
} else {
  console.error('❌ RAW CSS VIOLATIONS DETECTED');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`Found ${totalViolations} raw CSS property usage(s) in ${Object.keys(violationsByFile).length} file(s):\n`);
  
  for (const [file, violations] of Object.entries(violationsByFile)) {
    console.error(`  ✗ ${file} (${violations.length} violation${violations.length > 1 ? 's' : ''}):`);
    violations.slice(0, 5).forEach(v => {
      console.error(`    Line ${v.line}: ${v.content}`);
    });
    if (violations.length > 5) {
      console.error(`    ... and ${violations.length - 5} more`);
    }
    console.error('');
  }
  
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('💡 How to fix:');
  console.error('  1. Replace raw CSS with Genesis ontological mixins');
  console.error('  2. Use @include genesis-environment(), genesis-entity(), etc.');
  console.error('  3. See .github/instructions/scss.instructions.md for guidance');
  console.error('  4. If semantic variant is missing, submit theme enhancement proposal');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}
