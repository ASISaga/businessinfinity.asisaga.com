# Copilot Agent Procedural Rules (businessinfinity.asisaga.com)

Purpose: define the agent's responsibilities, checks, and enforcement actions in a concise, machine-friendly format. This file is the source of truth for automated checks the Copilot Agent runs against PRs and local changes.

## Scope
- Applies to changes in `Website/businessinfinity.asisaga.com/` and to contributions touching the local theme clone at `Website/theme.asisaga.com/`.

## Agent responsibilities (summarized)
- Enforce accessibility-first development (WCAG AA targets, semantic HTML, keyboard + focus behavior).
- Enforce repository layout and mapping rules (includes ↔ SCSS partials, assets, `_data`).
- Enforce JS import chain: theme `common.js` must be imported before subdomain `main`/component modules.
- Enforce SCSS partial rules: component partials must be mixin-driven (no raw property blocks) and must reference theme variables/mixins.
- Flag risky SCSS constructs (for example `@extend`) and require documented rationale; do not block `@extend` automatically but require human review.
- Block or warn on forbidden patterns: inline `<style>`/`<script>`, inline event handlers (`on*=`), `innerHTML` or template-literal HTML building in JS, and committing `node_modules`.

## Agent workflow (checks performed on PRs and on demand)
1. Linting stage (fast): run ESLint, Stylelint, HTMLHint. Report failures as PR annotations.
2. Structural checks (repo rules): verify mapping between `_includes` and `/_sass/components` (one-to-one expectation), ensure `assets/js/script.js` exists and imports `/assets/js/common.js` first.
3. Pattern scans: run scripts to detect inline assets, `innerHTML` usage, multi-line HTML template literals, and `@extend` usage. Emit errors for forbidden patterns and warnings for flagged constructs.
4. Accessibility smoke tests: run axe-core (or headless Lighthouse/Playwright checks) on critical pages and report top-level violations.
5. Vendor sanity: run `npm run vendor:prepare` and ensure it is idempotent (no uncommitted diff) — fail if changes are produced but not committed.

## Enforcement actions (how the agent reacts)
- Hard block (CI failure): inline `<style>`/`<script>` in templates, inline event handlers (`on*=`), committing `node_modules`, & uncommitted vendor-prepare output.
- Soft block (PR annotation, requires address): missing SCSS partial for an include, missing `script.js` entry, `innerHTML` or template-literal HTML usage found in JS.
- Flag-for-review (warning): `@extend` usage, deeply-nested selectors (>4 levels), use of global element selectors in component partials.
- Auto-fix proposals: trivial fixes (move inline style to a class, replace `onclick` with event listener pattern) are suggested as patch suggestions where safe.

## Example checks & rule patterns
- Inline assets (fail): regex scan for `<\s*style[\s>]` or `<\s*script[\s>]`, `\s(on\w+)\s*=`, or `style=\"` in `_includes/` and `_layouts/`.
- HTML-in-JS (fail): detect `innerHTML\s*=`, `insertAdjacentHTML\s*\(`, or template literals containing `<[^>]+>` across `assets/js`.
- `@extend` (warn): scan SCSS for `@extend` occurrences and require a header comment documenting the rationale; if none present, annotate PR and require author to explain or migrate to mixin.
- Include/SCSS mapping (warn/error): for each file in `_includes/components/*.html`, require a matching `/_sass/components/_<name>.scss` or document in the include header why it's intentionally absent.

## Integration points (how to run checks locally)
- Run linters locally:
	- `npm run lint:js` (ESLint)
	- `npm run lint:scss` (Stylelint)
- Run repo checks (scripts are expected under `scripts/`):
	- `node scripts/check-inline-assets.js` — fails on inline style/script/handlers
	- `node scripts/check-scss-partials.js` — warns on raw properties and `@extend`
	- `node scripts/prepare-vendor.js --src node_modules/bootstrap --dest Website/theme.asisaga.com/_sass/vendor/bootstrap`

## Escalation & exceptions
- If the agent flags an issue that the contributor believes is a false positive, open a PR comment explaining the rationale and tag the repository maintainers. The agent will record the override in PR metadata when a human reviewer approves the exception.
- For necessary theme overrides (for example an urgent header fix that must land in a subdomain), the agent should block automatic merges and require a coordination issue linking the subdomain PR and a matching PR in the theme repo.

## Maintenance
- Update this file when rules change. The agent will re-run a static check of `AGENTS.md` to ensure its rules stay machine-parseable (simple header/value pairs and bullet lists preferred).