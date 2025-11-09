---

description: Run Playwright integration tests for BusinessInfinity via Buddhi MCP server
mode: agent
tools: ['buddhi-mcp/run_playwright_tests']
---

Run Playwright E2E tests for the BusinessInfinity website (https://businessinfinity.asisaga.com).

Call Buddhi MCP tool `buddhi-mcp/run_playwright_tests` with:
```json
{
  "testType": "all"
}
```

Available test types:
- `"all"` - Run all tests (default)
- `"accessibility"` - Run accessibility-focused tests
- `"navigation"` - Run navigation and routing tests
- `"forms"` - Run form validation and submission tests
- `"integration"` - Run integration tests

To test a different URL:
```json
{
  "url": "https://businessinfinity.asisaga.com",
  "testType": "accessibility"
}
```
