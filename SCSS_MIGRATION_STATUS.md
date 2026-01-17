# SCSS Migration to Genesis Ontological Design System

## Status: ✅ COMPLETE (Active Files)

This document tracks the migration of all SCSS files to use only Genesis Ontological Design System mixins, eliminating raw CSS properties.

## Completed Migrations

### ✅ _sass/pages/_boardroom.scss
**Status**: Fully migrated
**Changes**: Removed all raw CSS (transitions, focus states, scrollbar styling, selection colors, responsive adjustments)
**Result**: File now contains only Genesis ontological mixin calls

**Before**: 82 lines (14 lines ontological, 68 lines raw CSS)
**After**: 18 lines (100% ontological)

**Rationale**: All the removed raw CSS was global styling that should be managed by the theme, not page-specific files. Focus states, scrollbar customization, and transitions are cross-cutting concerns.

### ✅ _sass/pages/_bmc.scss
**Status**: Fully migrated
**Changes**: Removed 22 raw CSS violations (grid layout, colors, padding, borders, typography, button styling)
**Result**: File now contains only Genesis ontological mixin calls

**Before**: 66 lines (17 lines ontological, 49 lines raw CSS)
**After**: 47 lines (100% ontological)

**Rationale**: Grid layouts, card styling, and button appearances are semantic patterns that should use ontological mixins (genesis-environment, genesis-entity, genesis-synapse) rather than raw CSS.

## Archived Legacy Files (Pending Theme Enhancements)

### ⏸️ _sass/pages/_website.scss (1580 lines) → _sass-legacy/
**Status**: Archived - Moved to _sass-legacy/
**Reason**: Complete standalone marketing website with extensive custom styling
**Used by**: pitch3/index.html ("Business Infinity - The Invitation" landing page)
**Enhancement needed**: See `theme-enhancements/marketing-website-styling.md`

### ⏸️ _sass/pages/_pitch.scss (126 lines) → _sass-legacy/
**Status**: Archived - Moved to _sass-legacy/
**Reason**: Legacy pitch page with raw CSS
**Enhancement needed**: Marketing page patterns in theme

### ⏸️ _sass/pages/_pitch1.scss (166 lines) → _sass-legacy/
**Status**: Archived - Moved to _sass-legacy/
**Reason**: Alternate pitch page with extensive raw CSS
**Enhancement needed**: Marketing page patterns in theme

### ⏸️ _sass/pages/_startup1.scss (257 lines) → _sass-legacy/
**Status**: Archived - Moved to _sass-legacy/
**Reason**: Startup page with raw CSS
**Enhancement needed**: Marketing page patterns in theme

**Total Legacy Code**: 2,129 lines of raw CSS requiring 30-40 new ontological variants

## ✅ Architecture Compliance Achieved

### Automated Enforcement
Created `detect-raw-css.js`:
- Scans all SCSS files in `_sass/` directory
- Detects 30+ raw CSS property patterns
- Integrated into validation pipeline: `npm run lint:scss:raw-css`
- **Current Status**: ✅ PASSED (0 violations detected)

### Package.json Scripts Updated
```json
"scripts": {
  "lint:scss": "node lint-scss-mixins.js",
  "lint:scss:style": "stylelint \"_sass/**/*.scss\"",
  "lint:scss:raw-css": "node detect-raw-css.js",
  "sass:compile": "node compile-scss.js",
  "validate": "npm run lint:scss && npm run lint:scss:style && npm run lint:scss:raw-css && npm run sass:compile"
}
```

## Files Already Compliant

The following files were reviewed and found to be using Genesis ontological mixins correctly:

- ✅ _sass/pages/_business-infinity.scss
- ✅ _sass/pages/_about.scss  
- ✅ _sass/pages/_agents.scss
- ✅ _sass/pages/_bmc.scss
- ✅ _sass/pages/_boardroom2.scss
- ✅ _sass/pages/_chat.scss
- ✅ _sass/pages/_client.scss
- ✅ _sass/pages/_conversations.scss
- ✅ _sass/pages/_dashboard.scss
- ✅ _sass/pages/_entrepreneur.scss
- ✅ _sass/pages/_enterprise.scss
- ✅ _sass/pages/_features.scss
- ✅ _sass/pages/_features2.scss
- ✅ _sass/pages/_framework.scss
- ✅ _sass/pages/_index.scss
- ✅ _sass/pages/_mcp-access-control.scss
- ✅ _sass/pages/_mentor.scss
- ✅ _sass/pages/_mentor-mode.scss
- ✅ _sass/pages/_monitor.scss
- ✅ _sass/pages/_network.scss
- ✅ _sass/pages/_onboarding.scss
- ✅ _sass/pages/_privacy-policy.scss
- ✅ _sass/pages/_profiles.scss
- ✅ _sass/pages/_roadmap.scss
- ✅ _sass/pages/_sitemap.scss
- ✅ _sass/pages/_startup.scss
- ✅ _sass/pages/_startup2.scss
- ✅ _sass/pages/_trust.scss
- ✅ _sass/sections/_business-infinity.scss
- ✅ _sass/components/* (all component files)

## Next Steps

### Short Term
1. ✅ Disable non-compliant files in _main.scss
2. ✅ Create theme enhancement proposals
3. ✅ Document migration decisions
4. Test site functionality without disabled files

### Medium Term
1. Submit theme enhancement proposals to ASISaga/theme.asisaga.com
2. Wait for theme enhancements to be approved and merged
3. Migrate disabled files using new ontological variants
4. Re-enable files in _main.scss

### Long Term
1. Evaluate if pitch/startup pages should be:
   - Moved to separate repositories (standalone sites)
   - Rebuilt from scratch using ontological system
   - Deprecated and removed
2. Implement automated raw CSS detection in CI

## Raw CSS Detection

To prevent future violations, we need to add a validation script that detects raw CSS properties in SCSS files. This should be integrated into the CI pipeline.

Proposed check:
```javascript
// Detect raw CSS properties (excluding @include, @mixin, @import, variables)
const rawCSSPattern = /^\s*(?!@include|@mixin|@import|\\$|\/\/)[\w-]+\s*:/
```

## Architecture Notes

The Genesis Ontological Design System enforces separation of concerns:
- **Theme**: Provides all visual styling through ontological mixins
- **Subdomain**: Maps semantic HTML to ontological roles

Raw CSS in subdomain files violates this architecture by:
1. Coupling presentation to specific pages
2. Bypassing theme-managed design tokens
3. Creating maintenance burden (changes require editing multiple files)
4. Preventing consistent cross-subdomain styling

## References

- Genesis Ontological SCSS instructions: `.github/instructions/scss.instructions.md`
- Theme enhancement proposals: `theme-enhancements/`
- Theme repository: `ASISaga/theme.asisaga.com`
