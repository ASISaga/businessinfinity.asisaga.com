---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "Unified UI, SCSS, and JS design guidance for all subdomains of asisaga.com and its shared theme. Applies to all HTML, SCSS, JS, and Liquid files in this repo and the shared theme."
---

See `.github/instructions/architecture.instructions.md` for the canonical companion file codex (companion file roles and locations).

## Website structure and shared theme repository

- `Website/` — top-level folder containing all subdomain sites of 'asisaga.com', and a local clone of the shared theme.
- `Website/<subdomain>.asisaga.com/` — Subdomain specific content, includes, `_sass`, `assets`, and scripts. Name of the repo should match the subdomain (e.g., `businessinfinity.asisaga.com`).
- `Website/theme.asisaga.com` - Local clone of the shared Jekyll theme 'ASISaga/theme.asisaga.com' used for all subdomains of the website, for local development; the canonical source for `_layouts`, `_includes`, `_sass`, and theme `assets` for all subdomains of asisaga.com.
- HTML head elements, meta tags, and shared scripts/styles for all subdomains are managed in the theme repo layouts and includes.
- HTML Header and footer markup  for all subdomains is managed in the theme repo layouts and includes.
- HTML navigation structures (menus, breadcrumbs)  for all subdomains are managed in the theme repo includes and `_data` files.

## Vendor packages (npm → theme)

- Vendor packages are installed locally in the Website directory (`npm install`) in the workspace.
- Prepared SCSS, assets, and JS are copied into `Website/theme.asisaga.com/_sass/vendor` and `Website/theme.asisaga.com/assets/js/vendor`.
- Commit prepared vendor files to the theme repo so GitHub Pages can build without Node.

<!-- RATIONALE [vendor]: Copying prepared vendor artifacts into the theme ensures builds on GitHub Pages (which run without Node) remain reproducible and avoids exposing build-time dependencies in the published site. -->


## HTML & accessibility

- Enforce semantic HTML5 and non-invasive ARIA via linters and code review. Use HTMLHint rules and automated accessibility checks (axe-core or similar) in CI to detect regressions.
- Ensure pages meet WCAG AA contrast and keyboard/focus requirements — map any design token or color changes back to the UX doc for approval.
- Do not include inline `<style>` or `<script>` blocks, `style=` attributes, inline event handlers in html/templates; keep styles in SCSS partials, and behavior in JS modules.
- Keep one root class or `data-` attribute per component for scoping (e.g., `<header class="hero" data-hero>`). Use `data-` attributes for modifiers/variants (e.g., `data-variant="primary"`), JS hooks, and behavioral flags.
<!-- RATIONALE [html-accessibility]: Avoiding inline styles and handlers keeps markup semantic, improves caching, simplifies accessibility auditing, and makes it easier to apply global design tokens and CSP policies. -->

## Jekyll, liquid, and partials

- Use Jekyll with Liquid templating for reusable components. Prefer `{% include %}` for parameterized partials.
- Separation of concerns:
  - Page metadata: front matter (keep minimal and declarative).
  - Structured/shared datasets: `_data/*.json` (prefer JSON over YAML for `_data`).
  - Markup: `_includes/*` and layouts; keep them small and idempotent.
- Partials best practices:
  - Kebab-case filenames, document parameters at top of partial as an HTML comment.
<!-- RATIONALE [partials]: Kebab-case is consistent with component naming in SCSS/HTML and avoids case-sensitivity issues across filesystems; documenting parameters at the top makes includes self-describing and easier for automation tools to parse. -->
- `_includes/` — Jekyll includes for components and small templates; use kebab-case and group by component.
- `_data/` — shared structured data (prefer JSON for `_data` files).
- Keep front matter minimal and declarative. Use consistent keys (lower_snake_case). Avoid large blobs or secrets.
- Prefer `_data/*.json` for shared datasets (navigation, people, menus). Access via `site.data.name`.

## SCSS & styling

- `/_sass/` — SCSS partials for this subdomain. 
- `theme.asisaga.com/_sass/base/` Theme-level shared assets (variables, mixins, functions, utilities).
- `assets/css/style.scss` in 'theme.asisaga.com' is the compiled entry included by the theme head.
- Subdomain SCSS: `/_sass` with `_main.scss` importing component and page partials.
- Mirror liquid include structure under `/_sass/components/` and `/_sass/pages/`. Mirror convention: `_includes/components/foo.html` → `/_sass/components/_foo.scss`. Each components folder should expose `_index.scss` that aggregates imports for stable ordering.
- Prefer `@import` usage in subdomain partials for GitHub Pages compatibility.
- `@extend` is allowed only with documented rationale and centralized placeholder selectors in the theme; flag via Stylelint/CI for review.
- Subdomain SCSS partials (/_sass/components, /_sass/pages) must NOT emit raw CSS property declarations. They import theme variables/mixins, set component-scoped variables, and call a mixin that emits the CSS.

<!-- RATIONALE [scss]: Keeping raw CSS property declarations out of subdomain partials centralizes style emission in the theme's mixins and design tokens, ensuring consistent styling across sites, simplifying accessibility and theming updates, reducing duplication, and making automated linting and maintenance more reliable. -->
- Component/page partials MUST NOT contain raw CSS property declarations. They should:
  1. `@import` (Pages-compatible) shared variables/mixins defined in 'theme.asisaga.com/_sass/base' from the theme repo.
  2. Set component-scoped configuration variables.
  3. Call a theme mixin that emits the final CSS.
- If a required output cannot be expressed via existing mixins, create a new theme mixin in the theme repo rather than adding raw CSS to the subdomain partial.

## JavaScript
- `assets/js/` — subdomain JS entry (`script.js`), component scripts, and any prepared vendor JS for local testing. Theme-level shared runtime lives at `/assets/js/common.js` in the theme clone.
- Entry: `assets/js/script.js` (type=module). Pattern: import theme runtime (`/assets/js/common.js`) then subdomain `main.js`.
<!-- RATIONALE [js]: Using ES modules keeps the runtime modular, enables tree-shaking and native browser loading where supported, and clarifies dependency ordering between the theme runtime and subdomain code. -->

## Web Components

- Use ES modules, class-based components (one class per file). Expose small public API (init/destroy) and use `data-` attributes for element roots.
- Prefer server-rendered fallback HTML in `_includes` and use `<template>` elements for Shadow DOM cloning. Avoid building large HTML strings in JS—CI should flag `innerHTML`, `insertAdjacentHTML`, and template-literal markup.
<!-- RATIONALE [web-components]: Server-rendered fallbacks improve initial render performance and SEO, and using `<template>` with Shadow DOM preserves progressive enhancement while keeping runtime JS simpler and safer. -->

## Assets
- `assets/images/` — component and page imagery.
