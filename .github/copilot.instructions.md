---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "UI, SCSS, and JS design guidance for this subdomain. Applies to all HTML, SCSS, JS, and Liquid files in this repo."
---


businessinfinity.asisaga.com — Custom Website Instructions

## Structure & Jekyll Conventions
- This instructions file applies to the businessinfinity.asisaga.com subdomain of asisaga.com.
- The theme is inherited from theme.asisaga.com. Do not copy theme files here.
- The site head (meta tags, CSS/JS includes, etc.) is managed in the theme repo and applies to all subdomains. Do not override or duplicate the head in subdomain repos.
- All subdomain-specific HTML, SCSS, and JS MUST be placed in this repo's folders.
- Structure MUST be documented in `website_structure.json` and kept up to date.

## Jekyll & Liquid
- Use Jekyll with Liquid templating.
- Place reusable UI components in `_includes`.
- Use `{% include component.html param="value" %}` for parameterized includes.
- Use semantic HTML5 elements for accessibility and SEO.
- Break complex UI into small, reusable partials.
- Each UI component in `_includes` MUST have a matching SCSS partial in `/_sass/components/`.
- Each HTML page MUST have a matching SCSS file in `/_sass/pages/`.
- Each HTML element in a component/page MUST have exactly one SCSS class in its respective file.

## JavaScript
- All subdomain JS MUST go in `/assets/js`.
- The main entry point for JS is `/assets/js/script.js` in each subdomain. This file MUST import the shared `/assets/js/common.js` from the theme first, then load any subdomain-specific JS.
- Shared JS is in the theme's `/assets/js/common.js` — always import it, never duplicate.
- Use ES6 modules and import/export syntax.
- Use semantic, kebab-case file names for scripts.
- Page-specific JS: name after the page (e.g., `boardroom.js`).
- Lint all JS and follow a consistent code style.
- Add descriptive comments and JSDoc for functions and modules.
- Use `defer` or `type="module"` for scripts.
- Use data/ARIA attributes for DOM hooks, not class names.
- Avoid inline JS in HTML/Liquid; keep logic in external files.
- Initialize interactive components in `DOMContentLoaded` or `defer` scripts.
- Use event delegation for dynamic content.
- Ensure all interactive elements are accessible.

## SCSS
- All subdomain SCSS MUST be in `/_sass`.
- The main entry point for CSS is `/assets/css/style.scss` (in the theme). This file is compiled by GitHub Pages/Jekyll into `style.css` and included in the site head.
- `style.scss` MUST import `_common.scss` from the theme's root `_sass` (shared styles), then `_main.scss` from the subdomain's root `_sass` (subdomain-specific styles).
- All further style additions or overrides MUST be made in SCSS files only, never in CSS files. Do not add or edit CSS directly; always use SCSS partials and structure.
- Do not edit or add SCSS in `/assets/css` except for `style.scss` imports.
- Use Bootstrap v5.3.5 (from theme) and prioritize its utilities/components.
- Customize Bootstrap via SCSS variables, not direct overrides.
- Use mobile-first, responsive design.
- Each component/page MUST have a matching SCSS partial.
- Use one custom class per element, kebab-case naming.
- Use parent selector `&` for pseudo-classes/modifiers.
- Limit nesting to 3-4 levels.
- Use `@extend`, `@include`, or Bootstrap utilities in component/page SCSS.
- Add descriptive comments in SCSS and HTML.

## Best Practices
- Keep partials focused on a single concern/component.
- Use semantic HTML and ARIA for accessibility.
- Update `website_structure.json` for any structure changes.
- Do not copy theme files into this repo; update the theme for shared changes.
- After each Copilot Agent run, review and improve this file as needed.
