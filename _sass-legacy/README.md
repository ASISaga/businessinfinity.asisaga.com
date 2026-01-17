# Legacy SCSS Files (Non-Compliant)

These files contain raw CSS that violates the Genesis Ontological Design System architecture.

## Files

- `_website.scss` (540 violations) - Business Infinity marketing website
- `_pitch.scss` (53 violations) - Pitch page styling
- `_pitch1.scss` (67 violations) - Alternate pitch page
- `_startup1.scss` (108 violations) - Startup page styling

## Status

These files have been **disabled** and moved out of the active `_sass/` directory because they contain extensive raw CSS properties instead of using Genesis ontological mixins.

## Impact

Pages using these styles may not display correctly:
- `pitch3/index.html` - Uses _website.scss for marketing site
- `pitch/index.html` - Uses _pitch.scss
- `startup/index.html` - Uses _startup1.scss

## Next Steps

1. **Theme Enhancement**: Submit PR to `ASISaga/theme.asisaga.com` with new ontological variants for marketing pages (see `../theme-enhancements/marketing-website-styling.md`)
2. **Migration**: Once theme is updated, migrate these files to use ontological mixins
3. **Alternative**: Consider deprecating these pages or moving to separate repositories

## Do Not

- Do not re-enable these files by adding them back to `_sass/_main.scss`
- Do not copy raw CSS from these files into compliant SCSS files
- Do not use these as templates for new pages

## Architecture Compliance

The Genesis Ontological Design System requires:
- **Zero raw CSS** in subdomain SCSS files
- All styling via ontological mixins: `@include genesis-environment()`, `@include genesis-entity()`, etc.
- Semantic class names that describe WHAT, not HOW

These files violate all three principles and require extensive refactoring or removal.
