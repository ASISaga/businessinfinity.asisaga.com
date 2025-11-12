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
