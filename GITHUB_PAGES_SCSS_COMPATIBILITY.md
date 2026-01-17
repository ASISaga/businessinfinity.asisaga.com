# GitHub Pages SCSS Compatibility Guide

## Issue: Modern CSS Color Syntax Not Supported

### Problem
GitHub Pages uses Jekyll with `jekyll-sass-converter` 1.5.2 and Sass 3.7.4, which **do not support** the modern CSS Color Module Level 4 syntax for color functions.

### Incompatible Syntax (Modern - DO NOT USE)
```scss
// ❌ WRONG - Will fail on GitHub Pages
.element {
  background: rgb(0 0 0 / 0.5);           // Space-separated values with slash
  box-shadow: 0 0 10px rgb(255 0 0 / 0.3);
}
```

### Compatible Syntax (Legacy - REQUIRED)
```scss
// ✅ CORRECT - Works on GitHub Pages
.element {
  background: rgba(0, 0, 0, 0.5);         // Comma-separated values
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}
```

## Error Message
When using modern syntax, GitHub Pages build fails with:
```
Conversion error: Jekyll::Converters::Scss encountered an error while converting 'assets/css/style.scss':
wrong number of arguments (1 for 3) for `rgb' on line X
```

## Stylelint Configuration

Our `.stylelintrc.json` is configured to use **legacy** color notation to maintain compatibility:

```json
{
  "rules": {
    "color-function-notation": "legacy",  // MUST be "legacy" for GitHub Pages
    "alpha-value-notation": "number"
  }
}
```

### Why "legacy"?
- **"modern"**: Stylelint auto-fixes to `rgb(0 0 0 / 0.5)` - breaks GitHub Pages
- **"legacy"**: Stylelint enforces/auto-fixes to `rgba(0, 0, 0, 0.5)` - works on GitHub Pages

## Testing Before Push

### Local Validation
Run these commands to ensure SCSS is compatible:

```bash
# Lint SCSS files (checks for undefined mixins)
npm run lint:scss

# Check style with stylelint (will auto-fix to legacy if needed)
npm run lint:scss:style

# Test SCSS compilation with modern Sass
npm run sass:compile

# Run all validations
npm run validate
```

### Important Notes
1. **Local validation uses Sass 1.97+** which supports both modern and legacy syntax
2. **GitHub Pages uses Sass 3.7.4** which only supports legacy syntax
3. Local tests may pass even with incompatible syntax
4. Always use `"color-function-notation": "legacy"` in stylelint config

## Migration Guide

If you accidentally introduce modern syntax:

1. **Update stylelint config** (if not already set):
   ```json
   "color-function-notation": "legacy"
   ```

2. **Auto-fix with stylelint**:
   ```bash
   npx stylelint "_sass/**/*.scss" --fix
   ```

3. **Or manually convert**:
   - Find: `rgb((\d+)\s+(\d+)\s+(\d+)\s*/\s*([\d.]+))`
   - Replace: `rgba($1, $2, $3, $4)`

## References
- [Sass 3.7.4 Documentation](https://sass-lang.com/documentation) (GitHub Pages version)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) (Modern syntax - not supported)
- [Stylelint color-function-notation rule](https://stylelint.io/user-guide/rules/color-function-notation)

## Summary
**Always use `rgba(r, g, b, a)` syntax** for colors with transparency in SCSS files to ensure GitHub Pages compatibility. Configure stylelint with `"color-function-notation": "legacy"` to prevent auto-fixing to incompatible modern syntax.
