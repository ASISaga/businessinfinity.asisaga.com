import fs from 'fs';
import path from 'path';

/**
 * ErrorExtractor scans workflow log files for error lines and extracts concise error summaries.
 * - extractFirstError: Finds first error line and next two non-empty lines for context.
 */
export class ErrorExtractor {
    /**
     * Initializes ErrorExtractor with path to log file.
     * @param {string} logPath - Path to workflow log file
     */
    constructor(logPath) {
        this.logPath = logPath;
    }

    /**
     * Finds the first error line in the log and returns it with next two non-empty lines for context.
     * @returns {string|null} - Error summary or null if no error found
     */
    extractFirstError() {
        if (!fs.existsSync(this.logPath)) {
            throw new Error(`Log file not found: ${this.logPath}`);
        }
        const log = fs.readFileSync(this.logPath, 'utf8');
        const lines = log.split(/\r?\n/);
        let errorLine = null;
        let errorIdx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (/error/i.test(lines[i])) {
                errorLine = lines[i];
                errorIdx = i;
                break;
            }
        }
        if (errorLine === null) {
            return null;
        }
        // Get next two non-empty lines
        let nextLines = [];
        let j = errorIdx + 1;
        while (nextLines.length < 2 && j < lines.length) {
            if (lines[j] && lines[j].trim().length > 0) {
                nextLines.push(lines[j]);
            }
            j++;
        }
        return [errorLine, ...nextLines].join('\n');
    }
}
