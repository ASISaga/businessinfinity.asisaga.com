---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "Unified UI, SCSS, and JS design guidance for businessinfinity.asisaga.com and its shared theme. Applies to all HTML, SCSS, JS, and Liquid files in this repo and the shared theme."
---
---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "Unified UI, SCSS, JS and Jekyll guidance for businessinfinity.asisaga.com and the shared theme. Organized for contributors and CI enforcement."
---

## Overview

This document is the canonical contributor guide for the BusinessInfinity subdomain and how it uses the shared theme (ASISaga/theme.asisaga.com). It covers Jekyll, HTML, SCSS, JavaScript, vendor handling, CI checks, and the recommended local/CI workflows. The goal is consistency, accessibility, and GitHub Pages compatibility.

### How this file is organized

- Theme & contribution workflow
- HTML & accessibility
- Jekyll, data, and partials
- SCSS & styling (structure, partials, mixins)
- JavaScript & Web Components
- Vendor workflow & build compatibility
- Developer quickstart and CI/tooling
- Examples & helper scripts
- Do Not (rules at a glance)

## Repository layout (where things live)

This section describes the canonical repository layout and where contributors should add files.

- `Website/` — top-level folder containing subdomain sites and a local clone of the shared theme for previews.
  - `Website/businessinfinity.asisaga.com/` — this subdomain's content, includes, `_sass`, `assets`, and subdomain-specific scripts.
  - `Website/theme.asisaga.com/` — local clone of the shared theme; the canonical source for `_layouts`, `_includes`, `_sass`, and theme `assets`.
- `_includes/` — Jekyll includes for components and small templates; use kebab-case and group by component.
- `/_sass/` — SCSS partials for this subdomain. Mirror include structure under `/_sass/components/` and `/_sass/pages/`.
- `assets/js/` — subdomain JS entry (`script.js`), component scripts, and any prepared vendor JS for local testing. Theme-level shared runtime lives at `/assets/js/common.js` in the theme clone.
- `assets/images/` — component and page imagery.
- `_data/` — shared structured data (prefer JSON for `_data` files).
- `scripts/` — helper scripts (vendor prepare, checks). Keep small, well-documented Node scripts here.
- `.github/instructions/` — authoritative project-facing guidance files (`ux.instructions.md`, `website.instructions.md`, etc.).
- `.github/AGENTS.md` — agent procedural rules and enforcement policies (see AGENTS.md for details).
- `tests/`, `playwright/`, `a11y-reports/` — testing and report artifacts.

Guidelines:
- Always update the theme clone when changing shared assets, then open a PR to `ASISaga/theme.asisaga.com` for production changes. Do not rely on local-only theme edits for production.
- Keep vendor `node_modules` out of the repo. Use `scripts/prepare-vendor.js` to copy minimal vendor artifacts into the theme clone and commit those prepared files to the theme.

## Theme & contribution workflow

The shared Jekyll theme lives at `ASISaga/theme.asisaga.com` and is cloned into this workspace at `Website/theme.asisaga.com` for local development and previews.
- Local edits to `Website/theme.asisaga.com` are allowed for development and testing, but ALL production changes to the shared theme MUST be submitted as a PR to the canonical theme repository (`ASISaga/theme.asisaga.com`). Typical workflow:
  1. Edit & validate locally in `Website/theme.asisaga.com`.
 2. Push a branch and open a PR against `ASISaga/theme.asisaga.com` for review.
 3. After merge, update the subdomain to point to the new theme commit (submodule update or copy) and open a subdomain PR if necessary.

## HTML & accessibility (implementation)

High-level UX and accessibility guidance lives in `.github/instructions/ux.instructions.md`; that document describes design rationale, tone, and UX patterns. This file is implementation-focused. Concretely:

- Enforce semantic HTML5 and non-invasive ARIA via linters and code review. Use HTMLHint rules and automated accessibility checks (axe-core or similar) in CI to detect regressions.
- Ensure pages meet WCAG AA contrast and keyboard/focus requirements — map any design token or color changes back to the UX doc for approval.
- Implementation rule: do not include inline `<style>` or `<script>` blocks in templates; keep styles in SCSS partials and behavior in JS modules. CI should fail on detected inline style/script occurrences.

## Jekyll, data, and partials

- Use Jekyll with Liquid templating. Prefer `{% include %}` for parameterized partials.
- Separation of concerns:
  - Page metadata: front matter (keep minimal and declarative).
  - Shared datasets: `_data/*.json` (prefer JSON over YAML for `_data`).
  - Markup: `_includes/*` and layouts; keep them small and idempotent.
- Partials best practices:
  - Kebab-case filenames, document parameters at top of partial as an HTML comment.
  - Use `data-` attributes for JS hooks and behavioral flags.
  - Provide a small example usage comment at top of the partial.
  - Avoid heavy logic in Liquid; prepare complex data in front matter or `_data`.

## SCSS & styling

This section defines how SCSS is organized, where variables/mixins live, and how component partials should be written.

### Structure & locations

- Theme-level shared assets: `theme.asisaga.com/_sass/assets/` (variables, mixins, functions, utilities).
- Theme `assets/css/style.scss` is the compiled entry included by the theme head.
- Subdomain SCSS: `/_sass` with `_main.scss` importing component and page partials.
- Mirror convention: `_includes/components/foo.html` → `/_sass/components/_foo.scss`.

### SCSS partial content rules (enforced)

- Component/page partials MUST NOT contain raw CSS property declarations. They should:
  1. `@import` (Pages-compatible) shared variables/mixins from the theme.
  2. Set component-scoped configuration variables.
  3. Call a theme mixin that emits the final CSS.

Example (Pages-compatible, note Pages may not support `@use`):
```scss
// File: /_sass/components/_chat-area.scss
@import '../assets/variables';
@import '../assets/mixins';

$chat-padding: $spacing-lg;
$chat-variant: 'compact';

// No raw property declarations here — mixin will emit styles.
@include chat-area($padding: $chat-padding, $variant: $chat-variant);
```

- Rationale: centralizing CSS generation in mixins ensures consistency and makes global changes safe.
- If a required output cannot be expressed via existing mixins, request a new theme mixin via a PR to the theme repo rather than adding raw CSS to the subdomain partial.

### `@extend` policy (compatibility note)

- GitHub Pages' bundled Sass may not support modern module features. Also, `@extend` creates implicit coupling. Policy: allow `@extend` only with documented rationale and centralized placeholder selectors in the theme. Tooling should flag `@extend` usages for review rather than automatically disallowing them.

### Naming and scoping

- Prefer a single root class or `data-` attribute per component for scoping (e.g., `<div class="hero" data-hero>`).
- Variants/modifiers in markup must be expressed via `data-` attributes (for example `<button class="button" data-variant="primary">`). Do NOT add modifier classes in markup like `button--primary`.

## JavaScript & Web Components

This project uses ES modules and native Web Components where needed. We avoid framework bundling for core component APIs to keep things Pages-friendly.

### Loading pattern (Pages-friendly — no bundler)

- Entry point: `/assets/js/script.js` in each subdomain. This file must exist and is loaded via `<script type="module" src="/assets/js/script.js"></script>` in the theme head.
- `script.js` should import the theme-provided runtime first (absolute path) and then the subdomain entry:
```javascript
// assets/js/script.js (subdomain)
import '/assets/js/common.js'; // theme-provided shared runtime
import './main.js'; // subdomain-specific entry
```
- `assets/js/common.js` (theme) imports vendor JS and initializes theme-level behaviors. `main.js` (subdomain) imports and instantiates component classes.

### ES6 + class-based organization

- Use ES6 modules, `const`/`let`, arrow functions, async/await.
- Structure UI logic as classes (one class per file, PascalCase for class names). Expose a small public API (init/destroy). Use `data-` attributes to pass element roots.

### Web Components

- Prefer Custom Elements and Shadow DOM for reusable widgets. When used, provide server-side fallback markup in `_includes` and place templates in includes for cloning by components.

### Enforcement

- Add a CI scan to flag uses of string-based HTML building (`innerHTML`, template literals with markup, `insertAdjacentHTML`) and require migration to Jekyll-managed templates.

## Vendor workflow & build compatibility

### Vendor flow (npm → theme)

Latest vendor packages (e.g., Bootstrap) are installed into `Website/node_modules` and then the required subset is copied into the theme via `scripts/prepare-vendor.js`.
Typical targets in the theme:
- `_sass/vendor/<package>` for SCSS partials
- `assets/vendor/<package>` for fonts/icons
- `assets/js/vendor/<package>` for vendor JS (prefer minified / ESM bundle)

Automate `vendor:prepare` in CI and commit the prepared vendor files to the theme so GitHub Pages builds without Node on the server.

## Developer quickstart

1. Install Ruby & Bundler; install `github-pages` to preview with the Pages-compatible Jekyll version.
   - `gem install bundler github-pages`
2. Install Node (LTS) and run `npm ci` if the subdomain has a `package.json`.
3. Prepare vendor assets: `npm run vendor:prepare` (if present).
4. Serve locally: `bundle exec jekyll serve --config _config.yml --livereload`.

## Tooling & CI checklist

- Linters: ESLint + Prettier, Stylelint (flag `@extend`, disallow global selectors), HTMLHint.
- CI steps for PRs (recommended):
  1. `npm ci`
  2. `npm run lint:js`
  3. `npm run lint:scss`
  4. `npm run check:inline` (scan for inline `<script|style|on*=`)
  5. `npm run vendor:prepare` and fail if it produces uncommitted changes.
  6. Optionally run `bundle exec jekyll build --safe` to verify Pages build.

## Example helper scripts (suggested)

- `scripts/prepare-vendor.js` — copies minimal vendor files from `node_modules` into theme vendor folders.
- `scripts/check-inline-assets.js` — scans `_includes`, `_layouts`, and templates for forbidden inline patterns.
- `scripts/check-scss-partials.js` — scans SCSS partials for raw property declarations and flags `@extend`.
- `scripts/check-data-schema.js` — validates `_data/*.json` against a schema.

## Contributor partial header snippet

Add at the top of new includes and matching SCSS partials:
```html
<!--
  Include: `_includes/components/<component>.html`
  SCSS: `/_sass/components/_<component>.scss`
  Usage: `{% include components/<component>.html param=value %}`
  Data attributes: `data-<component>`
  JS: `assets/js/components/<component>.js` (exports class / custom element)
-->
```

## Do Not (quick reference)

- Do not commit permanent overrides of theme files inside subdomains; follow the theme PR workflow.
- Do not include inline `<style>`/`<script>` or inline event handlers in templates.
- Do not commit `node_modules`.

## Migration notes & rationale

- Prefer `@import` in partial examples to stay compatible with GitHub Pages' Sass. If you adopt `@use`/`@forward`, add a CI precompile step that runs Dart Sass and commits compiled outputs into the theme.

---
If you'd like, I can now:
- scaffold the CI helper scripts (e.g., `scripts/check-scss-partials.js`) and a sample `.stylelintrc.json`, or
- run a repository scan to list files that currently violate the new rules (partials with raw CSS, includes with modifier classes, JS building HTML strings).
Tell me which and I'll proceed.

      }
    }
    customElements.define('bf-chat-area', BfChatArea);
    ```

  - Documentation & discoverability: for every Web Component, add a short README or header comment describing usage, attributes, events, theming tokens (CSS variables), and the matching include/SCSS partial path (remember SCSS partials should configure and call mixins, not declare raw styles).

  ### Component HTML & templates (Jekyll-managed only)

  - All component markup must be authored and managed by Jekyll — use includes/templates under `_includes` or static HTML files that Jekyll renders. Do NOT construct or embed large HTML fragments inside JavaScript (for example via string template literals, `innerHTML`, `insertAdjacentHTML`, or similar DOM-building via JS strings).
  - Preferred patterns:
    - Server-render the basic HTML structure for the component in a Jekyll include (for example `_includes/components/chat-area.html`). The include should contain semantic HTML and any required data attributes or slots for progressive enhancement.
    - The component's JavaScript should enhance or hydrate the existing DOM (attach behaviors, add event listeners, wire up state) instead of creating the HTML structure itself.
    - When using Shadow DOM, prefer placing a small <template> element in the include and cloning it inside the component rather than building HTML strings in JS. Example include pattern:

      ```html
      <!-- _includes/components/chat-area.html -->
      <template id="tpl-chat-area">
        <div class="chat-area" data-chat>
          <div class="chat-area__messages"></div>
          <form class="chat-area__form">...</form>
        </div>
      </template>
      <div class="chat-area" data-chat>
        <!-- server-side fallback markup for SEO/SSR -->
      </div>
      ```

    - In JS: `const tpl = document.getElementById('tpl-chat-area'); const instance = tpl.content.cloneNode(true); this.shadowRoot.appendChild(instance);`

  - Rationale: keeping HTML in Jekyll ensures pages have usable server-rendered content (SEO, accessibility, users with JS off) and avoids mixing markup generation into JS where it's harder to review and localize.

  - Enforcement: add a CI scan that flags uses of `innerHTML`, template-literal HTML patterns, `insertAdjacentHTML`, or multi-line HTML strings in `assets/js` files. Prefer reporting or failing CI for such patterns and require migration to include-based templates.

  - If components require dynamic HTML (for example different variants or content sections generated per-instance), place those HTML templates in external files managed by Jekyll (for example `_includes/components/chat-area-variant.html` or a `/_includes/templates/` folder). Load or reference those templates from the rendered page (for example using `<template id="tpl-chat-area-variant">` placed by Jekyll) and have the component JavaScript clone and use them. Do NOT fetch remote HTML fragments at runtime or construct markup strings in JavaScript.

    - Example: create `_includes/components/chat-area-variant.html` and include it in the page where needed so the template is part of the static build. The web component can then `document.getElementById('tpl-chat-area-variant')` and clone its content.

    - Rationale: external templates keep markup under version control, allow Jekyll preprocessing, make localization and review straightforward, and preserve server-rendered fallbacks.


## Jekyll front matter best practices

- Keep front matter minimal and strictly declarative. Front matter is metadata for the page and should not contain large blobs of content or secrets.
- Use consistent, lower_snake_case keys (for example `last_modified_at`, `canonical_url`) across the site for predictability.
- Common recommended keys and their purpose:
  - `layout` — the layout to use (e.g., `page`, `post`, `landing`).
  - `title` — human readable title used in the page and meta tags.
  - `description` — short summary for meta description / social cards.
  - `permalink` — explicit URL path when required.
  - `date` — ISO 8601 datetime for posts/pages when ordering is required (e.g., `2025-11-09T12:00:00Z`).
  - `last_modified_at` — ISO 8601 datetime when the content was last updated (useful for caches and last-modified headers).
  - `author` — author identifier or display name.
  - `tags`, `categories` — arrays for taxonomy.
  - `image` — relative path to a social/og image.
  - `canonical_url` — canonical page URL for SEO.
  - `publish` or `draft` — boolean flags to control site inclusion (document how your build treats these).
  - `lang` — optional language code for the page (e.g., `en`, `fr`).

- Use `front matter defaults` in `_config.yml` for layout, author, and other common keys to avoid repetition. For example:

  ```yaml
  defaults:
    - scope:
        path: ""
        type: "posts"
      values:
        layout: "post"
        author: "Team"
  ```

- Do not store large arrays or complex objects in front matter. If data is shared across pages, prefer `_data/*.yml` or JSON files.
- Avoid embedding HTML or Liquid-heavy logic inside front matter values. Keep the YAML clean and simple.
- Sanitize inputs: do not commit secrets (API keys, credentials) into front matter. Treat front matter as public repo content.
- Dates: use ISO 8601 and include timezone (UTC) to avoid ordering surprises across environments.
- Provide sensible defaults within templates using Liquid's `default` filter so pages without optional front matter still render correctly: `{{ page.title | default: site.title }}`.
- Document required front matter per layout: for each layout (for example `landing`), include a short section in the repo README or in the layout's include file that lists required and optional keys and their types.
- Front matter validation: consider adding a small CI check or Node/Python script to validate required keys, types, and date formats for new pages. A simple YAML schema or a script using `js-yaml` / `PyYAML` can be used.
- Example minimal front matter header:

  ```yaml
  ---
  title: "How to design accessible components"
  layout: "guide"
  description: "Practical guidance for building accessible UI components."
  date: 2025-11-09T12:34:00Z
  tags: [accessibility, design]
  publish: true
  ---
  ```

- Use `last_modified_at` or a similar explicit field to drive cache-busting or display 'updated' timestamps rather than relying on commit timestamps.
- When localizing content, keep language-specific fields minimal in front matter and prefer structured data files for translations.
- Keep front matter keys stable over time; when migrating keys, provide a compatibility step or fallback logic in templates to read the old and new key names.

## Separation of concerns — data belongs in `_data` or front matter

- Do not embed content/data directly in HTML/Liquid templates. Templates should render or format data; they should not be the canonical source for structured data used across pages.
- Use front matter for page-specific metadata and `_data/*.json` for shared datasets (navigation, people, sponsors, feature lists, menu structures, etc.). Prefer JSON over YAML for `_data` files to keep parsing consistent and avoid YAML-specific pitfalls.
- Access `_data` in Liquid with `site.data.filename` (for example `site.data.navigation.header`). Prefer structured keys and avoid deeply nested anonymous arrays—name collections clearly.
- Example: move a repeated navigation definition from many includes into `_data/navigation.yml`:

  ```json
  // File: _data/navigation.json
  {
    "header": [
      { "title": "Home", "url": "/" },
      { "title": "Docs", "url": "/docs/" }
    ],
    "footer": [
      { "title": "Privacy", "url": "/privacy/" }
    ]
  }
  ```

  Then in the include: `{% for item in site.data.navigation.header %}<a href="{{ item.url }}">{{ item.title }}</a>{% endfor %}`

- For larger or frequently-changing datasets, consider storing them as JSON/YAML in `_data` and driving content generation from that data rather than editing HTML includes directly.
- Avoid storing presentation markup in `_data` (no raw HTML in data files); keep `_data` as structured content and let includes/templates handle rendering.
- Validate `_data` formats where possible (a small CI script can assert required keys/types for important data files).
- When migrating data out of templates, add a short migration note in the include's comment and update documentation so contributors know to edit `_data` instead of includes.

## JavaScript & Jekyll Integration

- Use `defer` or `type="module"` when including scripts in HTML for non-blocking loading.
- Use data attributes and ARIA attributes for DOM hooks instead of relying on class names.
- Avoid inline JavaScript in HTML or Liquid templates; keep logic in external JS files.
- For interactive UI components, initialize them in a `DOMContentLoaded` or `defer` script block.
- Use event delegation for dynamic content and to minimize event listeners.
- Ensure all interactive elements are accessible (keyboard, ARIA, focus management).

# SCSS Structure & Components

## Bootstrap Integration

- Bootstrap v5.3.5 with dependencies in `/_sass/bootstrap`in the theme submodule
- Prioritize Bootstrap utilities and components over custom CSS
- Mobile-first: Utilize Bootstrap's responsive grid and utility classes
- Encapsulate Bootstrap inside custom classes in SCSS files
- Customize Bootstrap via SCSS variables rather than overriding styles directly
- Maintain consistent typography and color schemes site-wide
- Follow accessibility guidelines (alt text, ARIA labels, color contrast, etc.)

### Vendor packages (npm -> theme vendor)

Latest vendor packages (for example Bootstrap) are installed via npm into `Website/node_modules` and then converted/packaged into the theme format consumed by GitHub Pages. The canonical flow is:
  1. Install/update vendor packages in the subdomain repository (e.g., run `npm install bootstrap` in `Website/businessinfinity.asisaga.com`).
  2. Run a small conversion/copy step (script) that extracts only the required SCSS, assets, and JS from `node_modules` and copies them into the shared theme's vendor area. Typical target locations inside the theme are:
    - SCSS/partials: `Website/theme.asisaga.com/_sass/vendor/<package>`
    - Fonts/icons/assets: `Website/theme.asisaga.com/assets/vendor/<package>`
    - Vendor JavaScript: `Website/theme.asisaga.com/assets/js/vendor/<package>` (ship production/minified or a small ESM bundle)
  3. For JavaScript specifically, prefer copying the minified production builds or an optimized ESM bundle into `/assets/js/vendor` in the theme so pages can reference a stable vendor path (for example `/assets/js/vendor/bootstrap/bootstrap.min.js`).
  4. Commit the converted vendor files in the theme submodule (not `node_modules`) so GitHub Pages receives the compiled vendor SCSS/assets and vendor JS at build time.

- Guidelines and best practices:
  - Do NOT commit `node_modules` to the repo. `node_modules` is a local install location only used to fetch vendor sources.
  - Add a reproducible npm script (example: `npm run vendor:prepare`) in the subdomain `package.json` that performs the conversion/copy step. Document this script in the README.
  - Keep the vendor directory in the theme focused and minimal: only the SCSS partials, fonts, icons, and JS that are actually used by the sites.
  - If any vendor SCSS needs to be adapted (variable names, partials path), do this in the theme `_sass/vendor` copy — treat `node_modules` as read-only source.
  - Include a short checksum or version file in the vendor copy (for example `_sass/vendor/bootstrap.VERSION`) so reviewers can easily see what version is deployed to the theme.
  - Automate the prepare step in CI when possible so theme vendor is kept up to date with minimal manual steps.

- Example `package.json` scripts (suggested):
  - `"vendor:install": "npm install bootstrap@5.3.5 --no-audit --no-fund"`
  - `"vendor:prepare": "node ./scripts/prepare-vendor.js --src node_modules/bootstrap --dest ../theme.asisaga.com/_sass/vendor/bootstrap"`

- Rationale: GitHub Pages builds static sites from the repository content; copying the minimal, converted vendor files into the theme ensures consistent builds across environments and avoids shipping the entire `node_modules` to the theme or GitHub Pages.

## SCSS Organization & Hierarchy

- Naming: Use kebab-case for single, descriptive custom classes per element
- Preserve required Jekyll Markdown header in style.scss
- Common SCSS for the theme is kept in the theme's `_sass` directory, with `_common.scss` as the entry point for shared styles.
- Each subdomain maintains its own SCSS in its respective `_sass` directory, with `_main.scss` as the entry point for subdomain-specific styles.
- The theme provides a `style.scss` file in `assets/css`, which is included in the HTML `<head>`.
- `style.scss` loads `_common.scss` from the theme and `_main.scss` from the respective subdomain, ensuring both shared and subdomain-specific styles are applied.
- **All SCSS updates must be made in the appropriate `_sass` directory for the theme or subdomain. Do not edit or add SCSS directly in `assets/css` except for the `style.scss` import file.**

### Partials & Directory Structure

- Name partials with underscore prefix: `_partial-name.scss`
- Organize partials in logical folder hierarchy:
  - `/_sass/assets/base/`: Core theme related styling (variables, typography, utilities)
  - `/_sass/assets/components/`: Reusable UI component styles
  - `/_sass/assets/pages/`: Page-specific layouts
 - Required base partials:
  - `_variables.scss`: Define colors, breakpoints, spacing values
  - `_typography.scss`: Font families, sizes, weights, styles
  - `_mixins.scss`: Reusable style patterns and functions
  - `_utilities.scss`: Helper classes that apply single-purpose styling
- Import all partials into `style.scss` in order of dependency
- Group imports by type (base, components, pages) with clear comments
- Import base styles first, then components, then page-specific styles

## Mirror SCSS partials to Jekyll includes

- Keep SCSS partials organized to mirror the Jekyll `_includes` structure so it's trivial to find a component's styles from its include and vice-versa. This makes reviews, maintenance, and on-boarding faster. Key rules:
  - Directory mapping:
    - `_includes/components/*`  → `/_sass/components/*`
    - `_includes/pages/*`       → `/_sass/pages/*`
    - `_includes/layouts/*`     → `/_sass/layouts/*` (if you place layout-specific includes)
    - Theme-level common assets live under `/_sass/assets/*` as before.
  - File mapping:
    - Jekyll include `_includes/components/hero.html` should have its styles in `/_sass/components/_hero.scss` (kebab-case file names, underscore-prefixed partials).
    - If an include has variants (for example `_includes/components/hero-compact.html`), create matching partials (`_hero-compact.scss`).
  - Index imports:
    - Each components folder should expose an `_index.scss` that aggregates and documents imports for that folder. For example `/_sass/components/_index.scss` imports `_hero.scss`, `_card.scss`, etc. Then `/_sass/_main.scss` imports the folder `_index.scss` files in a stable order.
  - Partial header comment:
    - Begin each SCSS partial with a short comment that references the include path and expected data attributes, e.g. `// Styles for _includes/components/hero.html — data attributes: data-hero`.
  - Keep presentation selectors localized and prefer a single root class or data attribute selector per component, matching the include's root element (for example `.hero` or `[data-hero]`).
  - Example mapping:
    - `_includes/components/chat-area.html` → `/_sass/components/_chat-area.scss`
    - `_includes/pages/boardroom.html` → `/_sass/pages/_boardroom.scss`

- Benefits & best practices:
  - When a reviewer opens `_includes/components/foo.html` they can open `/_sass/components/_foo.scss` immediately to review styles.
  - Reduce selector drift: keep component styles scoped to the component's root to avoid leaking styles across unrelated parts of the site.
  - Encourage component authors to add a short usage example comment to both the include and its SCSS partial.

- Tooling & enforcement:
  - Add a simple repo lint/check script that warns when an include lacks a matching SCSS partial (or vice versa). This can be a small Node script that scans `_includes` and `_sass` for name matches.
  - Document the mapping conventions in this instructions file (done) so contributors know where to add styles when creating a new include.

### Component & Page Styling

 - Each Jekyll UI component must have a matching SCSS partial in `/_sass/components/`.
 - Each HTML page must have a matching SCSS file in `/_sass/pages/` directory.
 - Nest SCSS classes in partials to reflect the HTML structure for readability, but treat these as **illustrative structure only** — component partials must not emit raw CSS properties. Use the nesting pattern in comments or as a guide and implement the actual output via theme mixins (see "SCSS partial content rules").
 - Use the SCSS parent selector (`&`) appropriately for pseudo-classes and modifier selectors in mixins and theme utilities, not to write raw property blocks in subdomain partials.
 - Limit nesting depth to 3-4 levels to avoid overly specific selectors.
 - Structure component and page-specific SCSS partials to represent the DOM hierarchy, but keep them thin: set component-scoped variables and call a mixin that emits styles.
 - Page-specific and component-specific SCSS must not contain direct CSS property declarations. Instead, partials should set configuration variables and call mixins from the theme (for example `@include mixins.chat-area(...)`). If a component needs unique output that cannot be expressed with existing mixins, request a new mixin in the theme via a PR rather than adding raw properties locally.
 - Prefer `@include` and Bootstrap utility classes within mixin implementations rather than writing custom property declarations in partials. `@extend` may be used only sparingly and with documented rationale; prefer mixins and centralized placeholders in the theme.

### Best Practices

- Keep partials focused on a single concern or component
- Add descriptive comments in SCSS and HTML

## SCSS usage in HTML / Liquid templates

- Do not include raw SCSS or style blocks inside HTML or Liquid templates. All styling must live in `_sass` partials and be imported via the SCSS entry points. Inline styles and embedded SCSS make reviews and builds error-prone.
- Use only one custom SCSS class per HTML element. This keeps markup predictable and styles easy to trace. Examples:
  - Good: `<header class="hero" data-hero>` — the element has one custom class (`hero`) and a `data-` hook for JS.
 - Use only one custom SCSS class per HTML element. This keeps markup predictable and styles easy to trace. Examples:
   - Good: `<header class="hero" data-hero>` — the element has one custom class (`hero`) and a `data-` hook for JS.
   - Bad: `<header class="hero hero--large text-center">` — multiple custom classes for styling fragments make it harder to find the authoritative style.
 - Exception: vendor classes required by package JavaScript (for example Bootstrap's `navbar`, `dropdown`, or data-* classes required by Bootstrap JS) are allowed on elements when the vendor's JS requires them. When using vendor classes, prefer wrapping vendor markup with a single custom root class so your own styles remain scoped, e.g. `<nav class="site-nav"><div class="navbar navbar-expand">…</div></nav>`.
 - Require `data-` attributes for component variants/modifiers instead of adding modifier classes in markup. For example prefer:

   `<button class="button" data-variant="primary">` 

   Do NOT use modifier classes in markup like `<button class="button button--primary">`. Component SCSS partials may define BEM-style modifier selectors (for example `.button--primary`) but variants must be expressed via `data-` attributes in markup so behavior and styling remain declarative and reviewable.
 - Use `data-` attributes for JavaScript hooks and behavioral flags instead of extra CSS classes. This separates behavior from presentation and keeps SCSS focused on layout and appearance.
 - Avoid inline `style` attributes. If a one-off visual tweak is required, add a specific modifier in the SCSS partial and document it in the include's usage example.
 - Keep utility classes (e.g., Bootstrap utilities) predictable; prefer theme-level utility classes over ad-hoc inline styles or repeated custom classes.

This approach ensures all SCSS is encapsulated inside custom classes and prevents style leakage across the site. To reinforce encapsulation:

- Scope every selector to the component root (for example, `.hero { ... }`, not `header.hero h1 { ... }` unless necessary).
- Avoid global element selectors (for example, do not style `h1`, `p`, or `a` globally in component partials).
- Keep component variables and mixins namespaced where appropriate (for example `$hero-padding`), or define component-level variables inside the component partial.
 - Prefer nested selectors only under the root selector to make the relationship explicit. Do not place raw property declarations in partials; the example below is structural only — actual CSS must be emitted by theme mixins:
  ```scss
  // Illustrative structure only — do not add raw properties here in partials.
  .chat-area {
    // structural selectors (actual styles emitted by mixins)
    &__message { /* structure only */ }
  }
  ```
- Add a Stylelint configuration rule set (recommended) to disallow global element selectors in component partials and to warn on overly-specific selectors — this helps automate enforcement.

## No inline CSS or JavaScript in templates (strict)

- Do NOT include inline `<style>` blocks or `<script>` blocks inside HTML or Liquid templates. All CSS must be authored in `_sass` partials and compiled into `assets/css/style.scss`, and all JavaScript must live in `assets/js` as ES modules or prepared vendor bundles.
- Do NOT use inline `style="..."` attributes or inline event handlers (for example `onclick`, `onchange`). These are forbidden. Use documented modifier classes, data attributes, or component APIs for behavior and styling.
- Exceptions: none (except critical vendor-required attributes like `data-bs-toggle` used by vendor JS where needed). In those cases, wrap vendor markup with a single custom root class and avoid adding other inline styles or scripts.
- Use `defer` or `type="module"` when including external scripts in the theme/head to ensure proper loading. Keep script initialization in modules, not inline script tags.
- Enforcement: add an HTML/Liquid scanner in CI to fail on `/<style|<script|style=|on\w+=/i` occurrences inside templates, or integrate with existing linters to report violations. Provide an auto-fix workflow where feasible (for example, move inline styles to a mixin and replace the template with a class + data attribute).

## SCSS partial content rules (mixins & variables only)

- SCSS partials that mirror Jekyll includes (those under `/_sass/components`, `/_sass/pages`, etc.) must not contain raw CSS property declarations. Instead they should:
  - Import shared variables and mixins (from `/_sass/assets/_variables.scss` and `/_sass/assets/_mixins.scss`).
  - Set component-scoped variables or maps and then call a mixin that outputs the component CSS.

- Rationale: keeping raw declarations inside mixins centralizes style logic, ensures consistent naming, and makes it trivial to change output across multiple components by editing the mixin in one place.

- Example pattern (component partial only contains variable settings and mixin call):

  ```scss
  // File: /_sass/components/_chat-area.scss
  // NOTE: GitHub Pages' current Sass processor may not support the modern
  // `@use`/`@forward` module system. For maximum compatibility with Pages
  // prefer `@import` in examples and in partials that are built by Pages.
  // Use `@use` in the theme only if you precompile with Dart Sass in CI
  // and commit the compiled outputs for Pages to consume.

  // Compatible (Pages-friendly) pattern using @import:
  @import '../assets/variables';
  @import '../assets/mixins';

  $chat-padding: $spacing-lg;
  $chat-variant: 'compact';

  // No raw property declarations here — mixin will emit styles.
  @include chat-area($padding: $chat-padding, $variant: $chat-variant);
  ```

- Mixins should be responsible for creating the selectors and rules and must accept configuration so the partial files remain thin and declarative.

 - Use `@extend` only in narrowly-scoped, documented cases (for example placeholder selectors in the theme `_utilities.scss` that are intentionally shared across many components). In most cases prefer mixins and `@include` to produce output. When `@extend` is used, document the reason in the partial's header comment and centralize placeholder selectors in the theme so reviewers can assess coupling and specificity.
  - Tooling: add a Stylelint rule or CI warning to flag `@extend` usage by default. Require an explicit review/approval for PRs that introduce new `@extend` usages; prefer migrating the pattern to a mixin if review finds coupling risks.

- If you must create small helpers, use functions or mixins in `/_sass/assets` and import them; avoid ad-hoc helper declarations in component partials.

- Enforcement: add Stylelint rules or a small Node script that warns when a component partial contains raw property declarations or `@extend` usage. Example Stylelint plugin rules can detect `@extend` and flag it (emit a warning) so the PR author documents the rationale and reviewers can evaluate coupling risks.

## Where to define variables & mixins

- All shared variables, maps, functions, and mixins MUST live in the theme repository under `theme.asisaga.com/_sass/assets/` (for example `/_sass/assets/_variables.scss`, `_mixins.scss`, `_functions.scss`). The theme is the single source of truth for design tokens and reusable mixins.
- Subdomain repositories (like `businessinfinity.asisaga.com`) may set component-scoped variables in their component partials only to configure mixins (for example `$chat-padding: vars.$spacing-lg;`) but must NOT define new global variables, maps, functions, or mixins in subdomain `_sass` files.
- Rationale: centralizing variables and mixins prevents divergence, ensures consistent theming across subdomains, and makes updates and audits straightforward.
- If a subdomain requires a new mixin or variable, submit a PR against the shared theme with the rationale, examples, and automated visual test if possible. Do not define the mixin locally in the subdomain as a temporary workaround.
- Namespacing: theme-level variables/mixins should use a clear naming convention to avoid collisions. When using the modern Sass module system (`@use` / `@forward`) prefer namespacing (for example `vars.$spacing-lg` or `mixins.chat-area()`); when using legacy `@import` (GitHub Pages compatibility) expose clear, well-documented global variable and mixin names (for example `$spacing-lg` and `@mixin chat-area`) and document them in the theme `_sass/assets` README.

### Sass compatibility and migration notes

- GitHub Pages currently uses a Sass implementation that may not support `@use`/`@forward`. To remain compatible with Pages builds, prefer `@import` in examples and avoid relying on `@use` unless you precompile with Dart Sass in CI and commit compiled assets to the theme.
- If your team prefers the modern `@use` workflow, add a CI job that runs Dart Sass to compile SCSS and commits the resulting `_sass`/`assets` outputs into the theme before Pages builds run. Example (CI step outline):

  1. Install Node and Dart Sass in CI (or use the Dart Sass executable).
  2. Run the build/compile step: `sass --no-source-map _sass:assets/css` (or your preferred compile target).
  3. Verify compiled assets differ and commit/push or open an automated PR to update the theme submodule.

- Provide both `@import` (Pages-compatible) and `@use` examples in the theme documentation so contributors understand the migration path and tooling required.
- Versioning: when adding or changing variables/mixins in the theme, increment a vendor/version file (for example `_sass/vendor/THEME.VERSION`) and document the migration steps for subdomains if variable names or signatures change.



# Make improvements to this file after each run of copilot agent.

## Developer Quickstart

- Clone the repo and the theme submodule, install developer tools where required. Minimal local steps:

  1. Install Ruby and Bundler to run Jekyll previews (use the same versions as GitHub Pages):

     - Install Ruby and then run: `gem install bundler github-pages`

  2. Install Node (LTS) for local tooling and vendor management. Use `nvm` to manage versions if necessary.

  3. Install Node dependencies (if this repo has package.json):

     - `npm ci` or `npm install`

  4. Prepare vendor assets (if you maintain vendor locally):

     - `npm run vendor:prepare` (this should copy required SCSS/assets/js from node_modules into the theme vendor folders)

  5. Serve locally with the GitHub Pages gem to emulate Pages behavior:

     - `bundle exec jekyll serve --config _config.yml --livereload`

  6. Run linters and checks (see Recommended toolchain below).

## Recommended toolchain & configs

- Linters and formatters to include in the repo (suggested):
  - ESLint (ES6+ rules) + Prettier for JavaScript: enforce `no-var`, `prefer-const`, `ecmaVersion: 2020+`.
  - Stylelint for SCSS with rules to disallow global element selectors in component partials and to flag `@extend` usage (prefer warning + PR review) rather than an outright block.
  - HTMLHint for HTML/Liquid file checks (can be tuned to ignore Liquid-specific constructs).
  - A small custom script to check for inline `<style>`, `<script>`, `style=` and `on*=` usages in `_includes` and templates.

- Suggested config files to add to repo (examples):
  - `.eslintrc.json` — ES6 rules and module support
  - `.prettierrc` — formatting rules
  - `.stylelintrc.json` — Stylelint rules (flag `@extend` usage, disallow global selectors)
  - `htmlhint.json` — HTMLHint rules

## CI checklist & automation

- Recommended CI steps for PRs:
  1. `npm ci` (install Node deps)
  2. Run JS lint: `npm run lint:js` (ESLint)
  3. Run Stylelint: `npm run lint:scss`
  4. Run custom checks: `npm run check:inline`, `npm run check:scss-partials`, `npm run check:data`
  5. Run `npm run vendor:prepare` in a job and fail if it produces changes that aren't committed (or open an automated PR pushing vendor updates to the theme repo).
  6. Optionally run a Jekyll build using the `github-pages` gem to ensure the site builds as expected: `bundle exec jekyll build --safe`.

## Example helper scripts (descriptions)

- `scripts/prepare-vendor.js` — copies required files from `node_modules/<pkg>` into `theme.asisaga.com/_sass/vendor/<pkg>` and `theme.asisaga.com/assets/js/vendor/<pkg>`. It should accept `--src` and `--dest` args and only copy minimal files needed (SCSS partials, fonts, icons, minified JS).

- `scripts/check-inline-assets.js` — scans `_includes`, `_layouts`, and HTML/Liquid templates for forbidden patterns (`<style`, `<script`, `style=`, `on\w+=`) and returns non-zero exit code on violations.

- `scripts/check-scss-partials.js` — scans `/_sass/components` and `/_sass/pages` for raw property declarations outside mixin calls and flags `@extend` usage. The script should report violations for raw property declarations and emit warnings (not hard failures) for `@extend` occurrences that must be reviewed.

- `scripts/check-data-schema.js` — validates `_data/*.json` files against a small JSON schema for required keys and types.

## Contributor partial header snippet

Add the following header comment at the top of every new include and its matching SCSS partial to improve discoverability:

  <!--
    Include: `_includes/components/<component>.html`
    SCSS: `/_sass/components/_<component>.scss`
    Usage: `{% include components/<component>.html param=value %}`
    Data attributes: `data-<component>`
    JS: `assets/js/components/<component>.js` (exports class / custom element)
  -->


## GitHub Pages compatibility

- Keep the repository content and the theme layout compatible with GitHub Pages' build environment. Practical rules:
  - Do not rely on arbitrary Jekyll plugins that are not supported by GitHub Pages. Check the current GitHub Pages supported plugins list before adding a dependency; when in doubt, prefer server-side or build-time transformations in CI and commit the generated output.
  - Avoid relying on runtime Node-based build steps during GitHub Pages' build. Instead, precompile or prepare assets (CSS/JS/vendor) in CI or locally and commit the compiled assets into the theme's `assets` and `_sass` folders so GitHub Pages can build the site without Node.
  - SCSS: GitHub Pages can process SCSS via Jekyll. Keep SCSS partials in `_sass` and import via `assets/css/style.scss`. If you use PostCSS, webpack, or other Node tooling, run them in CI and commit final assets to the repo/theme.
  - Vendor JS/CSS: place prepared/minified vendor files under `theme.asisaga.com/assets/js/vendor` and `theme.asisaga.com/assets/vendor` so GitHub Pages serves them directly.
  - Avoid using unsupported Liquid tags or custom plugins that require GitHub Actions to build; either move that processing into CI or implement it as a pre-build step and commit outputs.
  - If you require complex build steps (bundling, transpilation), add a documented CI workflow (GitHub Actions) that runs `npm install` and your `vendor:prepare` scripts, then commits the prepared assets into the theme subdirectory. Use a bot account or `GITHUB_TOKEN` with appropriate permissions; document the workflow in `.github/workflows/`.

- Testing & local previews:
  - Test builds locally with the same Jekyll version GitHub Pages uses. Use `bundle exec jekyll serve --livereload` and the `github-pages` gem when possible to emulate Pages behavior.
  - Prefer previewing changes via a branch GitHub Pages deploy or using a GitHub Actions preview deploy step rather than relying on a developer's local Node environment for final validation.

- CI & automation recommendations:
  - Provide an automated `vendor:prepare` step and run it in CI. The workflow should commit prepared assets to the theme and optionally open a PR or push to the main branch depending on your release model.
  - Keep the CI step idempotent and safe: only commit when prepared assets differ from what's in the theme to avoid noisy commits.

- Documentation & notes:
  - Clearly document in the repo README that GitHub Pages is the canonical build target and describe the pre-build steps required to prepare the theme's vendor assets.
  - When making breaking changes to theme variables/mixins, provide a migration note and avoid changing names without compatibility measures.