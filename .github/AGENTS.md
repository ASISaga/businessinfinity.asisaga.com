# Copilot Agent Procedural Rules — businessinfinity.asisaga.com

Purpose: provide a concise, machine-friendly reference for automated checks the Copilot Agent runs on PRs and local changes.

---

## Metadata
- applyTo: Website/businessinfinity.asisaga.com/
- alsoAffects: Website/theme.asisaga.com/

## High-level responsibilities
- Accessibility-first: enforce WCAG AA where applicable (semantic HTML, keyboard/focus, ARIA where needed).
- Repo layout & mapping: ensure `_includes` ↔ `/_sass/components` mapping and asset/entry invariants.
- JS ordering: require theme-level `common.js` to be imported before subdomain/component scripts.
- SCSS conventions: prefer mixins & variables; flag raw property blocks and risky constructs like `@extend` for review.
- Forbidden patterns: detect and block inline `<style>`/`<script>`, inline event handlers (`on*=`), `innerHTML`/template-literal HTML generation in JS, and committed `node_modules`.

## Checks (run on PRs and on-demand)
1. Fast linters
	- ESLint, Stylelint, HTMLHint. Report failures as PR annotations.

2. Structural checks (repo rules)
	- For each `_includes/components/<name>.html` expect `/_sass/components/_<name>.scss`, or require a documented exception in the include header.
	- Ensure `assets/js/script.js` or equivalent entry exists and imports `assets/js/common.js` first.

3. Pattern scans (source-level)
	- Inline assets: fail on `<\\s*style`, `<\\s*script`, `\\s(on\\w+)\\s*=`, or `style=\"` inside `_includes/` and `_layouts/`.
	- HTML-in-JS: fail on `innerHTML\\s*=`, `insertAdjacentHTML\\s*\\(`, or template literals that contain `<[^>]+>` in `assets/js`.
	- SCSS scans: warn on `@extend` (require header rationale), warn on raw property blocks in component partials.

4. Accessibility smoke tests
	- Run axe-core or headless Lighthouse/Playwright on critical pages; report top-level violations (blocking if severe).

5. Vendor/idempotency checks
	- Run vendor prepare (e.g., `npm run vendor:prepare`). If the vendor step produces uncommitted changes, fail the check and require commit or update PR.

## Enforcement levels
- Hard block (CI failure): inline `<style>`/`<script>` in templates, inline event handlers (`on*=`), committed `node_modules`, uncommitted vendor-prepare output.
- Soft block (PR annotation/action required): missing SCSS partial for an include, missing JS entry/import order, `innerHTML` or HTML template-literal usage in JS.
- Flag-for-review (warning): `@extend` without documented rationale, deeply-nested selectors (>4 levels), global element selectors in component partials.
 

## Example rule patterns (regex-friendly)
- Inline assets (fail): /<\\s*style[\\s>]/i, /<\\s*script[\\s>]/i, /\\s(on\\w+)\\s*=/i, /style=\"/i
- HTML-in-JS (fail): /innerHTML\\s*=/, /insertAdjacentHTML\\s*\\(/, /`[\\s\\S]*<[^>]+>[\\s\\S]*`/
- SCSS `@extend` (warn): /@extend\\s+/

 

## Escalation & exceptions
- False positive workflow: open a PR comment describing the rationale and tag maintainers. A human reviewer can approve an exception; the agent records overrides in PR metadata.
- Theme overrides: for cross-repo changes (subdomain + theme), block automatic merges and require a coordination issue linking both PRs.

## Maintenance
- Keep this document machine-parseable: prefer top-level headers, short bullet lists, and regex examples.
- When changing rules that affect check scripts, update corresponding scripts under `scripts/` and the examples above.

---

Last updated: (update via PR) — this file is authoritative for the Copilot Agent's local checks.