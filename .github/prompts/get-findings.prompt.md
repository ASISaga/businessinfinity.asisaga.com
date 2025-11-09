Title: Query persisted findings (get_findings)

tool: get_findings

Purpose
- Return persisted findings stored by Buddhi rule tools in `.buddhi/findings.json`. Useful for aggregating rule outputs, building remediation reports, and feeding the learning system.

Input schema
```json
{
  "type": "object",
  "properties": {
    "tool": { "type": "string", "description": "Optional tool name to filter (e.g., 'check_inline_assets')" },
    "since": { "type": "string", "description": "Optional ISO timestamp (e.g., 2025-11-09T00:00:00Z) to return findings since this time" }
  }
}
```

Example payload
```json
{
  "tool": "check_inline_assets",
  "since": "2025-11-01T00:00:00.000Z"
}
```

Example MCP call (outer envelope)
```json
{
  "name": "get_findings",
  "arguments": {
    "tool": "check_inline_assets",
    "since": "2025-11-01T00:00:00.000Z"
  }
}
```

Expected output (example)
```json
{
  "success": true,
  "findings": [
    {
      "id": "check_inline_assets-1600000000000-1234",
      "tool": "check_inline_assets",
      "ts": "2025-11-09T12:34:56.789Z",
      "root": "c:/Development/ASISaga/Website/businessinfinity.asisaga.com",
      "payload": [ /* rule-specific findings */ ]
    }
  ]
}
```

Notes
- The tool reads `.buddhi/findings.json` in the server's current working directory. When calling from automation, ensure the server's cwd is the repository root or pass absolute paths in rule runs so stored `root` values are meaningful.
- Pagination: the current implementation returns all matching entries; for large histories, consider limiting results by `since` or adding `limit`/`offset` parameters.
- This prompt is safe to include in PR checks and can be used by Copilot/agents to assemble aggregated remediation reports.
