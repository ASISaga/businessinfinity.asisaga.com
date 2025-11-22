---
applyTo: "**/*.{js,ts,py,md,html,scss,liquid}"
description: "Testing philosophy, conventions, CI hooks, accessibility checks, and artifact storage for the website and theme."
---

See `.github/instructions/architecture.instructions.md` for the canonical companion file codex (companion file roles and locations).

# Testing guidance and conventions

Test platform & policy

- All testing tools and runners for this repository are provided through the Buddhi MCP server that runs in this workspace and are executed by Copilot. Do not add standalone local test runners, new CI workflows, or repository-level test services here. Any additional automated tests or test runners must be added to the Buddhi MCP server project and invoked via the Copilot/MCP interfaces.

This file defines testing responsibilities for agents and maintainers. Keep tests small, deterministic, and automated where possible.

## MCP prompts (how Copilot invokes tests)

- Generic test implementations live on the Buddhi MCP server and are shared across all subdomains.
- Subdomain repositories provide Copilot prompt files under `.github/prompts/` which supply the subdomain-specific parameters (paths, URLs, include lists, etc.). Examples present in this repo include:
	- `.github/prompts/check-inline.prompt.md`
	- `.github/prompts/check-scss-partials.prompt.md`
	- `.github/prompts/prepare-vendor.prompt.md`
	- `.github/prompts/runPlaywright.prompt.md`
- Copilot uses these prompt files to call the MCP server, passing the subdomain context so the centralized tests run with the correct inputs and return artifacts to the PR.
- Do not duplicate generic test logic in this repo; instead add or update the relevant prompt in `.github/prompts/` to adjust how the MCP test runs for this subdomain.

## MCP prompt contract (inputs / outputs)

- Contract: prompts are the sole mechanism for providing subdomain-specific inputs to generic MCP tests. A prompt should declare the input keys the MCP test expects and provide values or clear placeholders.
- Typical input keys (recommended):
	- subdomain: repository folder name (for example `businessinfinity.asisaga.com`)
	- baseUrl: preview URL or local dev URL used by Playwright checks (optional for static-only checks)
	- includePaths: glob or list of `_includes` paths to scan
	- scssPaths: glob for `/_sass` partials
	- assetsDir: path to `assets/` for JS/compiled assets
	- vendorDir: path to prepared vendor artifacts (theme vendor path)
	- gitRef: PR branch or commit to use for reproducible runs
	- extraFlags: free-form flags the MCP runner can interpret

- Expected outputs from MCP tests (agent should capture and surface):
	- status: pass|warn|fail
	- summary: concise text summary of findings
	- artifacts: list of report files (paths/URLs) such as HTML reports, JSON results, screenshots
	- findings: optional structured findings (file, line, rule, message) for PR annotations

## Prompt template (recommended)

Use a short, consistent template when creating or updating prompt files under `.github/prompts/`. Keep prompts declarative (no embedded test logic):

- name: check-inline
- description: "Check for inline assets and forbidden patterns in subdomain includes"
- inputs:
	subdomain: businessinfinity.asisaga.com
	includePaths: _includes/**/*.html
	scssPaths: _sass/components/**/*.scss
	gitRef: ${{PR_HEAD}}

Tip: keep prompts small and focused; large orchestration should remain on the MCP server.

## Artifacts & reporting

- Artifact naming: use the convention `{subdomain}-{check-name}-{gitRef}-{timestamp}.{ext}`. Example: `businessinfinity-check-inline-pr123-20251112T1530.json`.
- Storage: MCP tests should upload important artifacts (axe/lighthouse HTML, Playwright screenshots, JSON findings) to the MCP artifact store and return URLs in the test output. For long-term records of gated failures, copy artifacts into `a11y-reports/` via a maintainer-approved process.
- PR annotations: when MCP returns structured findings, Copilot should annotate the PR with file/line links and a short remediation suggestion. Warnings should not block merges unless surfaced as `fail` by the MCP test.

## Agent behavior & error handling (agent guidance)

For agent-facing behavior relating to MCP/test runs (severity mapping, retries, and PR annotation conventions), see the agent guidance file: `.github/agents/test-agent.md`.

## Registration, versioning & lifecycle

- Test registration: each generic test on MCP should be registered with a stable name and semantic version (for example `check-inline@1.0.0`). Prompts should reference the test name/version when possible to ensure reproducible runs.
- Version bumps: when a generic test changes behavior, bump the MCP test version and update prompt examples and documentation in this repo.
- Deprecation: mark old MCP tests as deprecated in MCP metadata and provide migration guidance in `testing.instructions.md`.

## Quick author checklist (adding/updating a prompt)

1. Identify the MCP generic test name and version to invoke.
2. Create or update a file under `.github/prompts/` with the required input keys and clear values/placeholders.
3. Run the MCP test via Copilot (or request a run) and inspect returned artifacts and PR annotations.
4. If the test needs new inputs or edge-case handling, prefer updating the MCP test (on Buddhi) and keep prompt changes minimal.
5. Document prompt changes in the PR body and reference `testing.instructions.md`.



## Standard website tests & best practices (what to run)

The following is a comprehensive list of tests and checks that should be part of a website quality pipeline. Implementations live on the Buddhi MCP server; include or reference these checks from prompts so Copilot can run them for this subdomain.

- Static analysis / linters (every PR)
	- HTMLHint, Stylelint, ESLint. Catch syntax issues, forbidden patterns (inline styles/scripts), and coding-style violations.

- Unit tests (fast, every PR)
	- JS/TS unit tests and small Python tests for build scripts. Focus on pure logic and helpers.

- Integration tests (PR or merge)
	- Template compile checks, SCSS compilation, asset pipeline smoke tests, and basic data render checks (liquid includes render without errors).

- End-to-end (E2E) functional tests (merge / scheduled)
	- Playwright flows covering top user journeys, form submissions, navigation, authentication flows (if applicable), and critical user path assertions.

- Accessibility audits (PR + nightly)
	- axe-core checks, Lighthouse accessibility audits, keyboard/focus behavior, ARIA usage, contrast checks. Report results and flag regressions. Use automated failures only for severe issues.

- Visual regression / snapshot testing (scheduled or on PR for visual changes)
	- Pixel or DOM snapshot comparisons for key components and pages (Percy, Playwright snapshots). Fail only on meaningful diffs and surface screenshots in artifacts.

- Performance audits (scheduled / merge)
	- Lighthouse performance audits (TTI, LCP, CLS, FCP) and bundle size analysis. Record trends historically; do not necessarily block PRs unless regressions exceed thresholds.

- SEO & metadata checks (PR)
	- Validate title/meta tags, canonical URLs, robots/sitemap presence, structured data (schema.org), hreflang where applicable.

- Security & dependency checks (every PR / scheduled)
	- Dependency vulnerability scans (Snyk/OWASP/OSV), CSP header checks, and basic XSS/CSRF pattern scans in templates and JS.

- Link & content integrity checks (PR / scheduled)
	- Broken link finder across site, image alt text presence, missing assets, or 4xx/5xx link discovery.

- Mobile/responsive checks (PR / scheduled)
	- Viewport checks, breakpoint rendering tests, touch-interaction smoke tests.

- Form & input validation tests (PR)
	- Verify client/server validation paths, proper error messaging, and accessibility of form controls.

- Data/privacy checks (PR)
	- Ensure analytics scripts and trackers are present/absent per privacy settings, and PII is not logged or embedded in client-side artifacts.

- Artifact & reporting (always)
	- All checks should produce structured artifacts (JSON, HTML, screenshots). Artifacts must be uploaded to the MCP artifact store and returned as URLs in the MCP output.

For each check above, prompts should declare the test name/version to run on MCP and provide the necessary input keys described in the "MCP prompt contract" section.

## File & test locations
- Unit tests: repository root (`test_*.py`) or `tests/` / `tests/unit/` when present. Keep unit tests close to the package they exercise.
- Integration / E2E: `tests_playwright/` (Playwright suites) or `tests/e2e/` where used. Place small example pages and fixtures in `tests_playwright/fixtures/` or `examples/`.
- Accessibility reports and long-term artifacts: `a11y-reports/` at the repository root (store axe/lighthouse outputs, screenshots, remediation notes).

## CI conventions

- Required checks: linting (JS/SCSS), unit tests, and the repository procedural checks defined in the instruction files under `.github/instructions/` (for example `html.instructions.md`, `js.instructions.md`, `scss.instructions.md`, and `testing.instructions.md`) must be configured as required checks in GitHub Actions. These checks should be driven by the Buddhi MCP server and invoked via Copilot prompts where possible.
- E2E and heavy accessibility audits may run on a schedule or on merge to main to keep PR feedback fast; schedule and retention are controlled through MCP.
	- Artifact storage: keep test artifacts (screenshots, reports) attached to MCP/CI runs and copy them into `a11y-reports/` only when they represent a gated failure or long-term record and after maintainer approval.

## Repository pattern scans & enforcement

- **Forbidden patterns (scan targets):** The following checks should be provided as MCP tests and used in CI prompts for PR validation:
	- Inline assets in templates: detect `<\s*style` and `<\s*script` inside `_includes/`, `_layouts/`, or content pages. Example regex: `/<\\s*style[\\s>]/i`, `/<\\s*script[\\s>]/i`.
	- Inline event handlers: detect `\s(on\w+)\s*=` usage (e.g. `onclick=`). Example regex: `/\\s(on\\w+)\\s*=/i`.
	- Inline style attributes: detect `style="` attributes in templates. Example regex: `/style=\"/i`.
	- HTML-in-JS patterns: detect assignments to `innerHTML`, `insertAdjacentHTML`, or template literals that contain HTML tags. Example regexes: `/innerHTML\\s*=/`, `/insertAdjacentHTML\\s*\\(/`, /`[\\s\\S]*<[^>]+>[\\s\\S]*`/.
	- SCSS `@extend` usage: flag occurrences for review. Example regex: `/@extend\\s+/`.

- **Structural checks:** Validate component mapping and asset ordering:
	- For each `_includes/components/<name>.html` expect `/_sass/components/_<name>.scss` (or a documented exception in the include header).
	- Ensure `assets/js/script.js` (or repo entry) imports `assets/js/common.js` before subdomain scripts.

- **Vendor/idempotency checks:** The vendor-prep step (for example `prepare-vendor` or a similar build step) must be run in CI; if it produces uncommitted changes relative to the PR branch, the MCP test should fail the PR until artifacts are checked in.

## Enforcement levels (mapped to MCP test outcomes)

- **Hard block (CI failure):** Inline `<style>`/`<script>` in templates, inline event handlers (`on*=`), committed `node_modules`, uncommitted vendor-prepare output — these should map to MCP `fail` and block merges.
- **Soft block (PR annotation/action required):** Missing SCSS partials for an include, missing JS entry/import order, minor HTML-in-JS patterns that are likely accidental — map to MCP `warn` and annotate PR.
- **Flag-for-review (warning):** `@extend` without rationale, deeply-nested selectors (>4 levels), global element selectors in component partials — map to MCP `warn` or `pass` with a structured advisory.



## Playwright & visual testing

 - Maintain small example pages under `tests_playwright/` (or `tests_playwright/fixtures/`) that render components in isolation for visual regression. Do not assume local execution; invoke visual/E2E runs via MCP so screenshots and diffs are recorded centrally.
- Use Percy or Playwright snapshot comparisons via the MCP runner where available; fail PRs only when MCP signals a `fail` status.

Notes: do NOT add or document local test commands in this repository; all execution flows for tests must be routed through the Buddhi MCP server and Copilot prompts as described above.

## Agent responsibilities (testing)

For operational and runtime responsibilities that Copilot/agents must follow when invoking or reporting MCP test results, see: `.github/agents/test-agent.md`.

## Maintenance
- Keep test fixtures and example pages up to date with design tokens and theme mixins. If a fixture becomes stale, update or archive it with a short note.

