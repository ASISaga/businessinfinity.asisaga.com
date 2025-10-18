import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

/**
 * SCSS Build Test: Fails if any missing mixins or SCSS compilation errors are found.
 * This test runs the Jekyll build and parses output for 'Undefined mixin' and other SCSS errors.
 */
test('SCSS build should not have missing mixins or fatal errors', async () => {
    let output = '';
    let error = '';
    try {
        // Run Jekyll build and capture output
        output = execSync('bundle exec jekyll build', { encoding: 'utf8', stdio: 'pipe' });
    } catch (e) {
        // Capture error output if build fails
        error = e.stdout ? e.stdout.toString() : '';
        error += e.stderr ? e.stderr.toString() : '';
    }

    // Combine output and error
    const buildLog = output + error;

    // Check for undefined mixin errors
    const mixinError = /Undefined mixin ['"][^'"]+['"]/i;
    const fatalError = /(Sass::SyntaxError|SCSS|Conversion error|Fatal error)/i;

    // Fail if any mixin or fatal SCSS errors are found
    expect(buildLog).not.toMatch(mixinError);
    expect(buildLog).not.toMatch(fatalError);
});
