# Ontological Enhancement Proposal: Marketing Website Styling

## Current Issue

The `_sass/pages/_website.scss` file (1580 lines) contains extensive raw CSS for a standalone marketing website ("Business Infinity - The Invitation"). This violates the Genesis Ontological Design System's "zero raw CSS" principle.

## Files Affected

- `_sass/pages/_website.scss` - Complete marketing website styling
- `_sass/pages/_pitch.scss` - Pitch page styling  
- `_sass/pages/_pitch1.scss` - Alternate pitch page styling
- `_sass/pages/_startup1.scss` - Startup page styling

## Semantic Patterns Needed

### 1. Marketing Hero Sections
**Current**: Raw CSS with gradients, overlays, positioning
**Needed**: `genesis-entity('hero')` or `genesis-atmosphere('marketing-hero')`

### 2. Call-to-Action Buttons
**Current**: Raw CSS with specific colors, shadows, hover states
**Needed**: Enhanced `genesis-synapse('cta-primary')`, `genesis-synapse('cta-secondary')`

### 3. Section Transitions (Pain → Transformation)
**Current**: Raw CSS color variables and gradients for narrative flow
**Needed**: `genesis-atmosphere('pain')`, `genesis-atmosphere('transformation')`

### 4. Navigation Bars
**Current**: Raw CSS for fixed navigation with glassmorphism
**Needed**: `genesis-entity('navigation')` with sticky/fixed variants

### 5. Modal Overlays
**Current**: Raw CSS for contact modals
**Needed**: `genesis-entity('modal')` or `genesis-state('modal-open')`

### 6. Scrollbar Styling
**Current**: Raw webkit-scrollbar CSS
**Needed**: Theme-level scrollbar customization

### 7. Focus States
**Current**: Raw box-shadow for accessibility focus rings
**Needed**: Theme-level focus state management

## Recommendation

These files represent complete standalone marketing pages that may not belong in the subdomain at all. Consider:

1. **Move to separate repository** - These could be standalone sites
2. **Move to theme as templates** - If reusable across subdomains
3. **Complete rewrite** - Rebuild using only Genesis ontological mixins
4. **Delete** - If pages are deprecated/unused

## Migration Path

If keeping these pages:

1. Theme repository needs extensive enhancements for marketing page patterns
2. 30-40 new ontological variants required
3. Estimated effort: 2-3 weeks of theme development
4. Alternative: Accept these as "legacy exceptions" documented in `_sass/README.md`

## Temporary Solution

For immediate compliance:
1. Comment out imports in `_main.scss`
2. Document as technical debt in architecture notes
3. Schedule proper migration or deprecation
