---
applyTo: "Website/*.{scss,html,liquid},Website/*/**/*.{scss,html,liquid,js}"
description: "UI design guidance for Copilot when generating ASI Saga’s SCSS styles and Jekyll Liquid templates for the theme and all subdomains in the Website folder. Applies generically to all current and future subdomains."
---


# Website Structure & Jekyll Conventions

## Website Structure
- asisaga.com is organized into multiple subdomains, each as a submodule in the `Website` folder
- The Jekyll theme is in `theme.asisaga.com` and applied to all subdomains at build time
- The structure is documented in `website_structure.json` (update for any changes)
- businessinfinity.asisaga.com is a subdomain of asisaga.com


## Jekyll Structure & Components
- Use Jekyll with Liquid templating
- Create reusable UI components in `_includes` folder (only if not in theme)
- Use `{% include component.html param="value" %}` for parameterized includes
- Use semantic HTML5 elements (header, nav, main, section, etc.) for accessibility and SEO
- Follow component-based architecture: isolated, reusable, maintainable elements
- Break complex UI patterns into smaller, reusable partials
- JavaScript: Place in `/assets/js` folder (entry: `script.js`)
- Each Jekyll UI component in `_includes` must have a matching SCSS partial in `/_sass/components/`
- Each HTML page must have a matching SCSS file in `/_sass/pages/` directory
- Each HTML element in a Jekyll UI component or HTML page must have exactly one SCSS class in its respective SCSS file
- **Theme merging:** The `_layouts`, `_includes`, `_sass`, and `assets` directories from the `theme.asisaga.com` theme are automatically merged into each subdomain site during the Jekyll site build by GitHub Pages. Do not manually copy these folders into subdomains; update or add components, layouts, styles, or assets in the theme and all subdomains will inherit them on the next build.
# Additional Static Context

## Build & Inheritance
- Theme files are injected at build; do not duplicate/override unless necessary
- To override a theme file, add a file with the same name in this repo
- Prefer extending via subdomain-specific files

## Responsive & Accessibility Context
- Mobile-first, responsive design is required
- Semantic HTML and ARIA are required for accessibility
- All color variables and layouts must meet WCAG AA standards

## JS & SCSS Import Chains
- JS entry: `/assets/js/script.js` imports theme's `common.js` first, then subdomain JS
- SCSS entry: theme's `style.scss` imports theme `_common.scss` first, then subdomain `_main.scss`

## Do Not
- Do not override theme head, navigation, or footer unless necessary
- Do not edit CSS directly; use SCSS partials
- Do not copy theme files unless absolutely necessary

# JavaScript Structure & Conventions

## JavaScript Organization
- Each subdomain site must have a `/assets/js/script.js` file, even if only to import shared logic. The `<head>` element in the theme assumes this file exists.
- Shared JavaScript (including Bootstrap logic and utilities) must be placed in the theme's `/assets/js/common.js` file. **Always add new shared scripts to `common.js` in the theme, not directly to HTML files.**
- In each subdomain, `script.js` must import `common.js` from the theme (e.g., `import '/assets/js/common.js'`). Do not duplicate shared JS in subdomains; always import from the theme.
- Place all subdomain-specific JavaScript in the subdomain's `/assets/js` folder, organized by feature or component, using one file per logical unit.
- Use ES6 modules and import/export syntax for modularity and maintainability.
- Use semantic, kebab-case file names for scripts (e.g., `chat-area.js`, `toggle-strip.js`).
- Place page-specific JS in a file named after the page (e.g., `boardroom.js` for the boardroom page).
- All JavaScript must be linted and follow a consistent code style (e.g., StandardJS or Prettier).
- Add descriptive comments and JSDoc for functions and modules.

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

### Component & Page Styling
- Each Jekyll UI component must have a matching SCSS partial in `/_sass/components/`
- Each HTML page must have a matching SCSS file in `/_sass/pages/` directory
- Nest SCSS classes to match HTML structure hierarchy (applies specifically to page and component SCSS files)
- Use the SCSS parent selector (`&`) appropriately for pseudo-classes and modifier classes
- Limit nesting depth to 3-4 levels to avoid overly specific selectors
- Structure component and page-specific SCSS files to visually represent the DOM hierarchy
- Page-specific and component-specific SCSS should only include or extend Bootstrap code or custom partials, not contain direct CSS property definitions
- Use `@extend`, `@include`, or Bootstrap utility classes within component and page SCSS files rather than writing custom property declarations

### Best Practices
- Keep partials focused on a single concern or component
- Add descriptive comments in SCSS and HTML

# Make improvements to this file after each run of copilot agent.

---