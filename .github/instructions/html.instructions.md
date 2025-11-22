---
applyTo: "**/*.html,**/*.liquid,**/*.md,_includes/**,_layouts/**"
description: "HTML and Jekyll/Liquid guidance for businessinfinity.asisaga.com: templates, includes, accessibility, and site-level coordination."
---

# Subdomain & Theme Structure
- This repo is the `businessinfinity.asisaga.com` subdomain. The canonical theme lives in `Website/theme.asisaga.com` and supplies `_layouts`, `_includes`, `_sass`, and shared `assets`.
- Theme-provided head, navigation, and footer are authoritative across subdomains. Only override them when strictly necessary and documented.

# File Locations & Conventions (HTML/Liquid)
- Custom partials / UI components: place under `_includes/` only if they are subdomain-specific and not available in the theme.
- Page templates and layouts: use `_layouts/` and keep layout logic minimal — prefer includes for repeatable fragments.
- Content files: place markdown or HTML pages at the repository root or under collections per the site's `website_structure.json`.

# Build & Inheritance
- GitHub Pages merges the theme into the subdomain at build time. Do not duplicate theme files unless you must override a specific behavior.
- To override a theme file, add a file with the exact same path/name in this repo and document the reason in a PR description.

# Accessible Markup & Patterns
- Mobile-first, semantic markup is required.
- Use ARIA only when necessary; prefer native semantic elements first (buttons, nav, main, header, footer, form controls).
- Ensure interactive patterns are keyboard-accessible and that landmarks are present for screen readers.

# Color & Contrast
- Color tokens and layout variables must meet WCAG AA contrast for normal text. If a new token is added, document use-cases and include contrast test results.

# Jekyll & Liquid Guidance
- Use Liquid includes: `{% include 'name.html' %}` for small partials and `{% include_cached %}` if available in the theme for expensive fragments.
- Keep logic thin in templates; heavy logic belongs in data files or build-time processing.

# Integration & Coordination (High-level)
- Theme changes that add or rename tokens, variables, mixins, or includes require coordinated PRs: open a PR in `Website/theme.asisaga.com` and link the subdomain PR.
- For breaking or cross-repo changes, create a coordination issue and assign reviewers from theme and subdomain teams.

# CI, Testing & Buddhi Responsibilities
- CI should run static checks (HTML validation, link checkers) and accessibility audits (axe, Lighthouse) for PRs.
- Offload heavier, cross-site audits to the Buddhi MCP server (Playwright/Lighthouse full runs, vulnerability scans). Provide a prompt artifact under `.github/prompts/` when invoking Buddhi tools.

# Do Not
- Do not override global theme head, navigation, or footer unless approved and documented.
- Do not add build-time logic in templates; keep Liquid simple and testable.

## Pattern Scans & Forbidden Patterns
- **Inline assets (fail):** Do not commit inline `<style>` or `<script>` tags inside `_includes/`, `_layouts/`, or content files. Use the theme or component partials instead.
- **Inline event handlers (fail):** Avoid `on*=` attributes in templates (e.g., `onclick=`). Prefer unobtrusive event binding in `assets/js`.
- **Example regexes:** Use these patterns in CI scans for template-level violations:
	- Inline style/script: `/<\\s*style[\\s>]/i`, `/<\\s*script[\\s>]/i`
	- Inline event handlers: `/\\s(on\\w+)\\s*=/i`, `/style=\"/i`

## Structural Checks (component mapping)
- **Component SCSS mapping:** For each `_includes/components/<name>.html` expect a corresponding `/_sass/components/_<name>.scss` partial. If a component intentionally has no partial, document the exception in the include header comment and PR description.

## Accessibility Smoke Tests
- **Run smoke audits:** CI should run lightweight accessibility audits (axe-core or headless Lighthouse) for critical pages and report top-level violations. Severe issues should block merges.
- **Escalation:** For heavier cross-site audits, coordinate with Buddhi/MCP tooling and provide an invocation artifact under `.github/prompts/` when needed.
