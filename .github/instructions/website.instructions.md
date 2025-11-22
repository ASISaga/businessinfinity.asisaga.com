---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "UI, SCSS, and JS design guidance for this subdomain. Applies to all HTML, SCSS, JS, and Liquid files in this repo."
---



# Static Context for businessinfinity.asisaga.com

## Subdomain & Theme Structure
- This repo is for the businessinfinity.asisaga.com subdomain of asisaga.com.
- theme.asisaga.com provides shared Jekyll theme (layouts, includes, SCSS, JS) for all subdomains
- At build time, GitHub Pages merges the theme into this subdomain, injecting `_layouts`, `_includes`, `_sass`, and `assets` from the theme.
- Site head, navigation, and footer are managed in the theme and apply to all subdomains.
- Shared includes/assets are defined in the theme; override only if necessary by matching filename

## File Locations & Conventions
- Custom UI components: `_includes` (only if not in theme)
- Custom SCSS: `/_sass/components/` for components, `/_sass/pages/` for pages
- Subdomain JS: `/assets/js` (entry: `script.js`)
- All subdomain SCSS: `/_sass` (entry: theme's `style.scss`)
- Bootstrap v5.3.5 and shared utilities provided by the theme

## Build & Inheritance
- Theme files are injected at build; do not duplicate/override unless necessary
- To override a theme file, add a file with the same name in this repo
- Prefer extending via subdomain-specific files

## Responsive & Accessibility Context
- Mobile-first, responsive design is required
- Semantic HTML and ARIA are required for accessibility
- All color variables/layouts must meet WCAG AA standards

## Jekyll & Liquid
- Use Jekyll with Liquid templating
- Use `{% include %}` for partials
- Update `website_structure.json` for structure changes

## JS & SCSS Import Chains
- JS entry: `/assets/js/script.js` imports theme's `common.js` first, then subdomain JS
- SCSS entry: theme's `style.scss` imports theme `_common.scss` first, then subdomain `_main.scss`

## Do Not
- Do not override theme head, navigation, or footer unless necessary
- Do not edit CSS directly; use SCSS partials
- Do not copy theme files unless absolutely necessary

## Reference
- For shared changes, update the theme repo
- For subdomain-specific changes, update this repo


# Companion File Structure

This repository uses a layered companion file system to guide both humans and Copilot agents:

- **README.md** — Human‑facing entry point. Quick start, project overview, and contribution guide.
- **.github/instructions/website.instructions.md** — Agent‑facing Site‑level conventions (SCSS/JS), layout rules, and UX implementation guidance.
- **.github/instructions/ux.instructions.md** — Agent‑facing High‑level UX philosophy, accessibility rationale, tone, and design patterns.
- **.github/instructions/architecture.instructions.md** — Agent‑facing System architecture, repo layout, and integration points.
- **.github/instructions/testing.instructions.md** — Agent‑facing Testing philosophy, conventions, and CI/CD hooks.
- **.github/AGENTS.md** — Agent‑facing procedural rules, enforcement policies, and error handling.

Each file is atomic: it covers one domain of guidance. Together, they form a codex that balances human narrative, design rationale, technical conventions, and agent execution.

## Repository layout (how agents should interpret structure)

- `Website/` — contains all subdomain sites and a local clone of the shared theme. Agents should treat `Website/` as the root for site-level checks.
- `Website/<subdomain>.asisaga.com/` — subdomain content: `_includes`, `_layouts`, `_sass`, `assets`, `scripts`, and CI hooks.
- `Website/theme.asisaga.com/` — canonical theme source; changes here usually require coordinated PRs across subdomains.

## Integration points

- Theme coordination: when an implementation requires new variables, mixins, or a layout change, open a PR in `Website/theme.asisaga.com` and link it from the subdomain PR. The agent should block merges until both PRs are linked and at least one maintainer approves.
- Vendor flow: vendor artifacts are prepared locally and copied into the theme's `_sass/vendor` and `assets/js/vendor` for GitHub Pages compatibility. Agents must verify vendor idempotency.
- CI hooks: all automated checks referenced in `AGENTS.md` must be wired into the repo's CI (GitHub Actions) as required checks.

## Buddhi MCP responsibilities

- Centralize proactive quality and maintenance tasks on the Buddhi MCP server instead of running them locally or duplicating logic per-subdomain. Recommended responsibilities to route through Buddhi include:
	- Python static analysis and type checking.
	- Web quality audits (Playwright, Lighthouse, axe).
	- Security and vulnerability scanning.
	- Code pattern analysis and automated suggestions.
	- Quality scoring and reporting.
	- Bug tracking and learning pipeline.
	- Complexity analysis and refactoring guidance.
	- Artifact preparation and safe automated fixes where applicable — these tools should be conservative and require maintainer approval for committing changes
	- Orchestrated install/run helpers.

- Why centralize on Buddhi?
	- Single authoritative implementation: fixes, rules, and versions live in one place and are available to all subdomains.
	- Reproducible runs: prompts include `subdomain` and `gitRef` to produce traceable artifacts tied to PRs.
	- Artifact storage and historical trends: Buddhi can persist findings, metrics, and quality reports centrally.
	- Safe automation: Buddhi can offer conservative autofixes that require maintainer review before committing.

- How agents and maintainers should interact:
	- Subdomain repos must provide small, declarative prompt files under `.github/prompts/` that declare the inputs Buddhi tools need (see `testing.instructions.md` for the prompt contract).
	- Prompts should not contain execution logic or shell commands — they are a parameter envelope for Buddhi tools.
	- For any operation that may modify files (e.g., `fix_stylelint_violations`), Buddhi should return a staging artifact (zip or branch diff) and a human reviewer must approve applying changes.
	- Use versioned MCP tool names (e.g., `check_python_quality@1.2.0`) or include an explicit `testVersion` key in the prompt to ensure reproducible runs.


## Agent responsibilities (architecture-specific)

- Validate that changes to `_includes` have matching SCSS partials in `/_sass/components` (or documented exception).
- Ensure theme imports and asset ordering follow the policy in `website.instructions.md` (e.g., `assets/js/common.js` before subdomain entries).
- Detect cross-repo changes that require coordinated deployments and annotate PRs with instructions.

## Change coordination guidance

- For breaking changes to tokens, mixins, or shared components: create a coordination issue, link PRs across theme and subdomain repos, and assign reviewers from both teams.
- Prefer additive changes in the theme (new tokens/mixins) and deprecate old tokens gradually with a clear migration path.

