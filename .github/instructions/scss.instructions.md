---
applyTo: "**/_sass/**,**/*.scss,**/_sass/**/_*.scss"
description: "SCSS guidance for subdomain: partial locations, import chains, theming, variables, vendor handling, and accessibility color rules."
---

# SCSS File Locations & Structure
- Subdomain SCSS lives under `/_sass/`.
- Component partials: `/_sass/components/`.
- Page-specific styles: `/_sass/pages/`.
- Vendor partials: `/_sass/vendor/` — keep vendor code isolated and document the vendor source and version.

# Import Chain & Entry Points
- The theme's `style.scss` is the canonical entry. It should import the theme `_common.scss` first, then the subdomain entry `_main.scss`.
- Keep imports at the top level minimal. Prefer small, focused partials that are imported by `_main.scss`.

# Theming & Variables
- Use theme tokens when available. Introduce new tokens only when necessary; document new tokens and provide migration notes.
- Color variables must meet WCAG AA contrast. When adding color tokens, include example usage and contrast checks.

# Best Practices
- Do not edit compiled CSS files. Edit SCSS partials only.
- Favor utility classes and variables over deep selector specificity.
- Keep component styles scoped to logical classes; avoid global side effects.

# Vendor & Third-party CSS
- Vendors should be placed in `/_sass/vendor/` and imported from `_main.scss` after theme imports but before local overrides.
- Verify vendor license and document the origin in a comment at the top of the vendor partial.

# Automation & Linting
- Run stylelint in CI with the shared config. Fixable issues can be surfaced as suggested edits, but require maintainer approval before committing.

# Do Not
- Do not copy theme `_sass` files wholesale into the subdomain. Prefer upstream fixes in the theme repository.
