---
applyTo: "*.*,_*/*.*,_*/*/*.*,_*/*/*/*.*"
description: "UI, SCSS, and JS design guidance for this subdomain. Applies to all HTML, SCSS, JS, and Liquid files in this repo."
---

businessinfinity.asisaga.com — Custom Website Instructions

**Note:** `businessinfinity.asisaga.com` is a subdomain of `asisaga.com`. The `theme.asisaga.com` repository provides the common Jekyll theme (layouts, includes, SCSS, and JS) for all subdomains of `asisaga.com`.

## Jekyll Theme Inheritance & Build Process
All Jekyll layouts—including the HTML header, navigation, footer, and many shared includes—are defined in the `theme.asisaga.com` theme. At build time, GitHub Pages automatically merges the theme into this subdomain:
- The `_layouts`, `_includes`, `_sass`, and `assets` directories from the theme are injected into the subdomain site during the build. Any updates to the theme are reflected in all subdomains on the next build.
- The site head (meta tags, CSS/JS includes, etc.), navigation, and footer are managed in the theme repo and apply to all subdomains. **Do not override or duplicate these in subdomain repos.**
- Many shared includes are also defined in the theme. Only override a theme file in this repo if absolutely necessary, and only by adding a file with the same name as the theme file you wish to replace. Prefer extending via subdomain-specific files and avoid duplication.

## Jekyll & Liquid
- Use Jekyll with Liquid templating.
- Place reusable UI components in `_includes` **only if not already provided by the theme**.
- Use `{% include component.html param="value" %}` for parameterized includes.
- Use semantic HTML5 elements for accessibility and SEO.
- Break complex UI into small, reusable partials.
- Each UI component in `_includes` (if custom) MUST have a matching SCSS partial in `/_sass/components/`.
- Each HTML page MUST have a matching SCSS file in `/_sass/pages/`.
- Each HTML element in a component/page MUST have exactly one SCSS class in its respective file.

## JavaScript
- All subdomain JS MUST go in `/assets/js`.
- The main entry point for JS is `/assets/js/script.js`. This file MUST import the shared `/assets/js/common.js` from the theme first (available at build time), then load any subdomain-specific JS.
- Shared JS is in the theme's `/assets/js/common.js` — always import it, never duplicate or override unless absolutely necessary.
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

#### JavaScript Import Chain Example

- `/assets/js/script.js` (subdomain entry point)
	- imports `/assets/js/common.js` (from theme, injected at build)
		- imports `/assets/js/common/bootstrap.js` (from theme)
			- imports and initializes Bootstrap modules

All subdomain-specific JS should be imported after `common.js` in `script.js`.

## SCSS
- All subdomain SCSS MUST be in `/_sass`.
- The main entry point for CSS is `/assets/css/style.scss` (in the theme). This file is compiled by GitHub Pages/Jekyll into `style.css` and included in the site head.
- `style.scss` MUST import `_common.scss` from the theme's root `_sass` (shared styles), then `_main.scss` from the subdomain's root `_sass` (subdomain-specific styles).
- All further style additions or overrides MUST be made in SCSS files only, never in CSS files. Do not add or edit CSS directly; always use SCSS partials and structure.
- Do not edit or add SCSS in `/assets/css` except for `style.scss` imports.
- Use Bootstrap v5.3.5 (from theme) and prioritize its utilities/components.
- Customize Bootstrap via SCSS variables, not direct overrides.
- Use mobile-first, responsive design.
- Each component/page (if custom) MUST have a matching SCSS partial.
- Use one custom class per element, kebab-case naming.
- Use parent selector `&` for pseudo-classes/modifiers.
- Limit nesting to 3-4 levels.
- Use `@include` or Bootstrap utilities in component/page SCSS (do not use `@extend` in Jekyll SCSS).
- Add descriptive comments in SCSS and HTML.

## Accessibility-First Development (MANDATORY)
### Semantic HTML Requirements
- NEVER nest landmark elements (header, main, nav, footer, aside, section, article)
- Each page MUST have exactly ONE main landmark with id="skip-target"
- Each page MUST have exactly ONE banner (header) and ONE contentinfo (footer)
- Use aria-label for duplicate landmarks: `<header aria-label="Site header">` vs `<header aria-label="Page header">`
- ALL interactive elements MUST have minimum 44px touch targets
- ALL text MUST meet WCAG AA contrast ratios (4.5:1 for normal, 3:1 for large)
- NEVER use text-shadow without verifying contrast impact
- ALL images MUST have meaningful alt attributes (empty for decorative: `alt=""`)
- ALL form inputs MUST have associated labels
- Skip navigation MUST be first focusable element: `<a href="#skip-target" class="sr-only focus-visible">Skip to main content</a>`

### Layout & CSS Requirements
- ALL layout containers MUST use CSS containment: `contain: layout style; isolation: isolate;`
- NEVER use @extend in Jekyll SCSS (causes build errors) - use actual CSS properties instead
- ALL grid containers MUST be responsive: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- NEVER allow horizontal overflow - use `overflow-x: hidden` on body if needed
- ALL interactive elements MUST have focus indicators: `outline: 3px solid #0066cc; outline-offset: 2px;`
- Colors with opacity < 0.9 are FORBIDDEN for text (accessibility violation)
- ALL buttons/links MUST have hover states with transform/elevation effects

### Color & Contrast Rules
- Text colors MUST be solid, high-contrast: #212529 on #ffffff minimum
- NEVER use rgba() with opacity < 0.9 for text
- Footer/header text MUST be white (#ffffff) on dark backgrounds
- Muted text MUST have opacity >= 0.95: `rgba(255, 255, 255, 0.95)`
- ALL color variables MUST be tested for WCAG AA compliance
- Text-shadow is FORBIDDEN unless contrast is verified

### Responsive Design Requirements
- Mobile-first approach MANDATORY
- Test ALL viewports: 375px, 768px, 1440px minimum
- NO horizontal scrolling at any breakpoint
- Touch targets MUST be 44px minimum on mobile
- Font sizes MUST be 16px minimum (never smaller)

### Jekyll-Specific Rules
- NEVER use @extend in SCSS files (causes Jekyll build failures)
- Use direct CSS properties instead: `contain: layout style; isolation: isolate;`
- Import order: theme common.scss FIRST, then subdomain main.scss
- Only add includes or overrides if not already provided by the theme. All custom includes MUST have matching SCSS partials.

## Best Practices
- Keep partials focused on a single concern/component.
- Use semantic HTML and ARIA for accessibility.
- Update `website_structure.json` for any structure changes.
- Do not copy or override theme files into this repo unless absolutely necessary; update the theme for shared changes.
- After each Copilot Agent run, review and improve this file as needed.
