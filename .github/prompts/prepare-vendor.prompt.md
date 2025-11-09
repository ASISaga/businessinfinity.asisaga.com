Title: Prepare vendor artifacts (prepare_vendor)

tool: prepare_vendor

Purpose
- Copy the minimal set of vendor assets (SCSS, JS, CSS, fonts) from `node_modules` into the theme vendor area so GitHub Pages can build without Node. This prompt provides a schema and MCP call example for automation.

Input schema
```json
{
  "type": "object",
  "properties": {
    "nodeModulesPath": { "type": "string", "description": "Path to node_modules (optional, defaults to process.cwd()/node_modules)" },
    "packageName": { "type": "string", "description": "Package name to copy (default: 'bootstrap')" },
    "dest": { "type": "string", "description": "Destination directory (required)" }
  },
  "required": ["dest"]
}
```

Example payload
```json
{
  "nodeModulesPath": "c:/Development/ASISaga/Website/node_modules",
  "packageName": "bootstrap",
  "dest": "c:/Development/ASISaga/Website/theme.asisaga.com/assets/vendor"
}
```

Example MCP call
```json
{
  "name": "prepare_vendor",
  "arguments": {
    "nodeModulesPath": "c:/Development/ASISaga/Website/node_modules",
    "packageName": "bootstrap",
    "dest": "c:/Development/ASISaga/Website/theme.asisaga.com/assets/vendor"
  }
}
```

Expected output (example)
```json
{
  "success": true,
  "message": "Copied vendor files from bootstrap to c:/Development/ASISaga/Website/theme.asisaga.com/assets/vendor",
  "source": "c:/Development/ASISaga/Website/node_modules/bootstrap/dist",
  "dest": "c:/Development/ASISaga/Website/theme.asisaga.com/assets/vendor"
}
```

Notes
- `dest` is required. Review the copied files before committing to the theme repository.
- Recommended timeout: 30-120s depending on package size.
- The tool is conservative: it copies distributable folders (dist/build/lib) and may miss nonstandard layouts. Inspect `source` in the result.

