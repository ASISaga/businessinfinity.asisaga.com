# Boardroom Interface (Version 2 - Web Component)

This directory contains a web component-based implementation of the boardroom interface.

## Status
- **Active**: Experimental (uses web components)
- **Purpose**: Alternative boardroom implementation
- **Primary Version**: `/boardroom/` uses Jekyll includes

## Implementation

This version uses modern web components:
- Custom element: `<boardroom/>`
- Module-based JavaScript: `/assets/js/Boardroom.js`
- Client-side rendering
- Component-based architecture

### Features
- Self-contained web component
- Modular JavaScript (ES6 modules)
- Can be embedded in any page
- Better for client-side state management

## Preservation Rationale

This experimental implementation is preserved because:
1. Demonstrates modern web component architecture
2. May be useful for embedding boardroom in other contexts
3. Provides alternative to Jekyll-based approach
4. Could be the future direction for the application
5. Supports reusability across different pages/frameworks

## vs /boardroom/

The primary `/boardroom/` directory uses Jekyll includes:
- Server-side rendering with Jekyll
- Template-based architecture
- Better integration with Jekyll layouts
- More traditional approach

**Trade-offs**:
- `/boardroom/` - Easier to theme, better SEO, server-rendered
- `/boardroom2/` - More dynamic, better for SPAs, client-side state

## Usage

Not currently the primary boardroom interface. Access via:
- Direct URL: `/boardroom2/`
- Can be embedded using `<boardroom/>` component
- Requires loading `Boardroom.js` module

## Technical Notes

### Web Component
```html
<boardroom/>
<script type="module" src="/assets/js/Boardroom.js"></script>
```

### Benefits
- Encapsulated functionality
- Reusable across pages
- Standard web components API
- No framework dependencies

### Considerations
- Requires module support in browser
- May need polyfills for older browsers
- Client-side rendering implications for SEO

## Migration Path

If moving to this architecture:
1. Ensure `Boardroom.js` implements all features from Jekyll version
2. Test thoroughly in all supported browsers
3. Consider SEO implications
4. Update all links to `/boardroom2/`
5. Deprecate `/boardroom/` after migration

## Files

- `index.html` - Minimal HTML with web component
- Dependencies: `/assets/js/Boardroom.js`

## Last Updated
2025-01-10
