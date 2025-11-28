---
applyTo: "**/_sass/**,**/*.scss,**/_sass/**/_*.scss"
description: "SCSS guidance for subdomain: partial locations, import chains, theming, variables, vendor handling, and accessibility color rules."
---

# Import Chain & Entry Points
- The canonical theme lives in `Website/theme.asisaga.com` locally, and `ASISaga/theme.asisaga.com` repository on GitHub.
- The theme supplies shared `_sass`, and `assets` for all subdomains, which the GitHub Pages merges the theme into the subdomain at build time.
- The theme's `/assets/css/style.scss` is the canonical entry. It imports the `_sass/_common.scss` from theme first, then the subdomain specific `_sass/_main.scss`.
- Keep imports at the top level minimal. Prefer small, focused partials that are imported by `_main.scss`.

# SCSS File Locations & Structure
- Subdomain SCSS lives under `/_sass/`.
- Component partials: `/_sass/components/`.
- Page-specific styles: `/_sass/pages/`.
- Vendor partials: `/_sass/vendor/` — keep vendor code isolated and document the vendor source and version.

# Component SCSS mapping
- For each `_includes/components/<name>.html` create a corresponding `/_sass/components/_<name>.scss` partial.

# Theming & Variables
- Use theme tokens when available. Introduce new tokens only when necessary; document new tokens and provide migration notes.
- Color variables must meet WCAG AA contrast. When adding color tokens, include example usage and contrast checks.

# Best Practices
- Do not use CSS files. Edit SCSS partials only.
- Favor utility classes and variables over deep selector specificity.
- Keep component styles scoped to logical classes; avoid global side effects.

# Vendor & Third-party CSS
- Vendors should be placed in `/_sass/vendor/` and imported from `_main.scss` after theme imports but before local overrides.
- Verify vendor license and document the origin in a comment at the top of the vendor partial.

# Do Not
- Do not copy theme `_sass` files wholesale into the subdomain. Prefer upstream fixes in the theme repository.

## Structural Checks & SCSS Scans
- **Component partial mapping:** Ensure each `_includes/components/<name>.html` has a corresponding `/_sass/components/_<name>.scss`. Missing partials should be explained in the include header.
- **Avoid deep specificity:** Warn on deeply-nested selectors (>4 levels) and global element selectors in component partials.
- **`@extend` policy (warn):** Use `@extend` sparingly. If used, document rationale in the partial header so reviewers can assess maintainability impact. CI may flag `@extend` usages for review.

