import fs from 'fs';
import path from 'path';

/**
 * ScssCopier handles selective copying of SCSS files from npm packages (Bootstrap, FontAwesome) to theme _sass directories.
 * - copyBootstrap: Recursively copies all imported Bootstrap SCSS files and subfolders.
 * - copyFontAwesomeScss: Copies all FontAwesome SCSS files and subfolders, cleaning destination first.
 * Internal helper _getAllScssImports resolves all @import dependencies for accurate copying.
 */
export class ScssCopier {
    /**
     * Recursively copies all imported Bootstrap SCSS files and subfolders from srcDir to destDir.
     * @param {string} entryScss - Entry point SCSS file (usually bootstrap.scss)
     * @param {string} srcDir - Source directory for Bootstrap SCSS
     * @param {string} destDir - Destination directory in theme _sass
     */
    copyBootstrap(entryScss, srcDir, destDir) {
        const loadPaths = [srcDir];
        const allImports = this._getAllScssImports(entryScss, loadPaths);
        allImports.push(entryScss);
        for (const absPath of new Set(allImports)) {
            const relPath = path.relative(srcDir, absPath);
            const destPath = path.join(destDir, relPath);
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(absPath, destPath);
        }
        const subfolders = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());
        for (const subfolder of subfolders) {
            const srcSub = path.join(srcDir, subfolder);
            const destSub = path.join(destDir, subfolder);
            fs.mkdirSync(destSub, { recursive: true });
            const scssFiles = fs.readdirSync(srcSub).filter(f => f.endsWith('.scss'));
            for (const file of scssFiles) {
                const srcFile = path.join(srcSub, file);
                const destFile = path.join(destSub, file);
                fs.copyFileSync(srcFile, destFile);
            }
        }
        console.log('[STAGE 1] Selective SCSS copy complete.');
    }

    /**
     * Resolves all @import dependencies for a given SCSS file, recursively.
     * @param {string} filePath - SCSS file to analyze
     * @param {string[]} loadPaths - SCSS load paths
     * @param {Set<string>} seen - Tracks already visited files
     * @returns {string[]} - List of absolute paths to all imported SCSS files
     */
    _getAllScssImports(filePath, loadPaths, seen = new Set()) {
        if (seen.has(filePath)) return [];
        seen.add(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const importRegex = /@import\s+["']([^"']+)["']/g;
        let match;
        let imports = [];
        while ((match = importRegex.exec(content)) !== null) {
            let importPath = match[1];
            let candidates = [
                importPath + '.scss',
                '_' + importPath + '.scss',
                importPath,
                '_' + importPath
            ];
            let resolved = null;
            for (let candidate of candidates) {
                for (let loadPath of loadPaths) {
                    let fullPath = path.join(loadPath, candidate);
                    if (fs.existsSync(fullPath)) {
                        resolved = fullPath;
                        break;
                    }
                }
                if (resolved) break;
            }
            if (resolved) {
                imports.push(resolved);
                imports = imports.concat(this._getAllScssImports(resolved, loadPaths, seen));
                if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
                    const files = fs.readdirSync(resolved).filter(f => f.endsWith('.scss'));
                    for (const file of files) {
                        const nestedFile = path.join(resolved, file);
                        if (!seen.has(nestedFile)) {
                            imports.push(nestedFile);
                            imports = imports.concat(this._getAllScssImports(nestedFile, loadPaths, seen));
                        }
                    }
                }
            }
        }
        return imports;
    }

    /**
     * Copies all FontAwesome SCSS files and subfolders from faSrcDir to faDestDir, cleaning destination first.
     * @param {string} faSrcDir - Source directory for FontAwesome SCSS
     * @param {string} faDestDir - Destination directory in theme _sass
     */
    copyFontAwesomeScss(faSrcDir, faDestDir) {
        console.log(`[DEBUG] alwaysCopyFontAwesomeScss running. Source: ${faSrcDir}`);
        if (!fs.existsSync(faSrcDir)) {
            console.warn(`[STAGE 1] Font Awesome SCSS source not found: ${faSrcDir}`);
            return;
        }
        const allFaFiles = fs.readdirSync(faSrcDir);
        console.log(`[DEBUG] Font Awesome SCSS source contents:`, allFaFiles);
        fs.mkdirSync(faDestDir, { recursive: true });
        for (const file of fs.readdirSync(faDestDir)) {
            fs.unlinkSync(path.join(faDestDir, file));
        }
        const rootFiles = allFaFiles.filter(f => f.endsWith('.scss'));
        console.log(`[DEBUG] Font Awesome root SCSS files:`, rootFiles);
        for (const file of rootFiles) {
            const srcFile = path.join(faSrcDir, file);
            const destFile = path.join(faDestDir, file);
            fs.copyFileSync(srcFile, destFile);
        }
        const subfolders = allFaFiles.filter(f => fs.statSync(path.join(faSrcDir, f)).isDirectory());
        console.log(`[DEBUG] Font Awesome SCSS subfolders:`, subfolders);
        for (const subfolder of subfolders) {
            const srcSub = path.join(faSrcDir, subfolder);
            const destSub = path.join(faDestDir, subfolder);
            fs.mkdirSync(destSub, { recursive: true });
            const scssFiles = fs.readdirSync(srcSub).filter(f => f.endsWith('.scss'));
            for (const file of scssFiles) {
                const srcFile = path.join(srcSub, file);
                const destFile = path.join(destSub, file);
                fs.copyFileSync(srcFile, destFile);
            }
        }
    }
}
