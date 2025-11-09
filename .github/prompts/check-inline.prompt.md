Title: Run inline assets scan (check_inline_assets)

tool: check_inline_assets

Purpose
- Scan `_includes`, `_layouts`, and other template directories for forbidden inline patterns (inline `<style>`, `<script>`, `style=`, `on*=` attributes). This prompt includes an input schema and MCP call envelope for automation.

Input schema (JSON Schema)
```json
{
  "type": "object",
  "properties": {
    "root": { "type": "string", "description": "Repository root to scan (optional, defaults to process.cwd())" },
    "targetPaths": { "type": "array", "items": { "type": "string" }, "description": "Relative directories to scan (defaults: ['_includes','_layouts','assets','docs'])" }
  }
}
```

Example payload
```json
{
  "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
  "targetPaths": ["_includes", "_layouts", "assets"]
}
```

Example MCP call
```json
{
  "name": "check_inline_assets",
  "arguments": {
    "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
    "targetPaths": ["_includes", "_layouts", "assets"]
  }
}
```

Expected output (example)
```json
{
  "success": true,
  "findings": [
    { "file": "_includes/header.html", "findings": [{"line": 12, "match": "<style>", "rule": "inline-style-tag"}] }
  ]
}
```

Notes
- Use this prompt in PR reviews that touch includes/layouts.
- Recommended timeout: 20-60s depending on repo size.

