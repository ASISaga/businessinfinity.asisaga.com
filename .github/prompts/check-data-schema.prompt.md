Title: Validate _data JSON schema (check_data_schema)

tool: check_data_schema

Purpose
- Validate JSON files in `_data/` for parseability and presence of required keys. This prompt is machine-friendly and includes the input schema and an MCP call example.

Input schema (JSON Schema)
```json
{
  "type": "object",
  "properties": {
    "root": { "type": "string", "description": "Repository root to scan (optional, defaults to process.cwd())" },
    "dataDir": { "type": "string", "description": "Relative data directory (default: _data)" },
    "requiredKeys": { "type": "array", "items": { "type": "string" }, "description": "List of keys required in each JSON file" }
  }
}
```

Example payload (exact JSON)
```json
{
  "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
  "dataDir": "_data",
  "requiredKeys": ["title", "url"]
}
```

Example MCP call (outer envelope)
```json
{
  "name": "check_data_schema",
  "arguments": {
    "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
    "dataDir": "_data",
    "requiredKeys": ["title", "url"]
  }
}
```

Expected output (example)
```json
{
  "success": true,
  "findings": [
    { "file": "_data/navigation.json", "missingKeys": ["url"] },
    { "file": "_data/team.json", "parseError": "Unexpected token < in JSON at position 0" }
  ]
}
```

Notes & best practices
- `dataDir` defaults to `_data` when omitted.
- Paths in examples use forward slashes (Windows `c:/...` style) to avoid escaping issues in JSON strings; the tool accepts both absolute Windows and POSIX paths.
- If you call this from automation, validate payload against the input schema before invoking the MCP tool to avoid wasted runs.
- Recommended timeout for large sites: 30s-120s depending on number of files.

