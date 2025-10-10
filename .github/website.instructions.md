---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "UI, SCSS, and JS design guidance for this subdomain. Applies to all HTML, SCSS, JS, and Liquid files in this repo."
---

businessinfinity.asisaga.com — Custom Website Instructions

## Structure & Jekyll Conventions
- This repo is a Jekyll subdomain site for businessinfinity.asisaga.com.
- The theme is inherited from theme.asisaga.com (do not copy theme files here).
- All subdomain-specific HTML, SCSS, and JS must be placed in this repo's folders.
- Structure is documented in `website_structure.json` — keep it updated.

## Jekyll & Liquid
- Use Jekyll with Liquid templating.
- Place reusable UI components in `_includes`.
- Use `{% include component.html param="value" %}` for parameterized includes.
- Use semantic HTML5 elements for accessibility and SEO.
- Break complex UI into small, reusable partials.
- Each UI component in `_includes` must have a matching SCSS partial in `/_sass/components/`.
- Each HTML page must have a matching SCSS file in `/_sass/pages/`.
- Each HTML element in a component/page must have exactly one SCSS class in its respective file.

## JavaScript
- All subdomain JS goes in `/assets/js`.
- Each subdomain must have `/assets/js/script.js` (even if only to import shared logic).
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
- All subdomain SCSS is in `/_sass`.
- Entry point: `/_sass/_main.scss`.
- Theme provides `_common.scss` (shared) and `style.scss` (entry point in `/assets/css`).
- `style.scss` loads both `_common.scss` (theme) and `_main.scss` (subdomain).
- Do not edit or add SCSS in `/assets/css` except for `style.scss` imports.
- Use Bootstrap v5.3.5 (from theme) and prioritize its utilities/components.
- Customize Bootstrap via SCSS variables, not direct overrides.
- Use mobile-first, responsive design.
- Each component/page must have a matching SCSS partial.
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
