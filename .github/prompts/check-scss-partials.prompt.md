Title: Scan SCSS partials for raw declarations and @extend (check_scss_partials)

tool: check_scss_partials

Purpose
- Heuristically scan `/_sass` partials for raw CSS property declarations (which should be avoided) and flag `@extend` usage for review. Includes input schema and examples for automation.

Input schema
```json
{
  "type": "object",
  "properties": {
    "root": { "type": "string" },
    "sassDirs": { "type": "array", "items": { "type": "string" }, "description": "Directories to scan (default: ['_sass'])" }
  }
}
```

Example payload
```json
{
  "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
  "sassDirs": ["_sass"]
}
```

Example MCP call
```json
{
  "name": "check_scss_partials",
  "arguments": {
    "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
    "sassDirs": ["_sass"]
  }
}
```

Expected output (example)
```json
{
  "success": true,
  "findings": [
    { "file": "_sass/_card.scss", "issues": { "rawDeclarations": [{"line": 8, "text": "padding: 8px;"}], "extendUses": [{"line": 20, "text": "@extend .sr-only;"}] } }
  ]
}
```

Notes
- This is heuristic and may report false positives. Use findings to guide human review and request authors to move declarations into theme mixins where appropriate.
- Recommended timeout: 10-60s depending on project size.

