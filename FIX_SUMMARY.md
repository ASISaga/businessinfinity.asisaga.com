# GitHub Pages SCSS Conversion Error - Fix Summary

## Issue
GitHub Pages build was failing with:
```
Conversion error: Jekyll::Converters::Scss encountered an error while converting 'assets/css/style.scss':
wrong number of arguments (1 for 3) for `rgb' on line 37
```

## Root Cause
- **Stylelint** was configured with `"color-function-notation": "modern"`
- When running `stylelint --fix`, it auto-converted color functions to modern CSS syntax
- GitHub Pages uses **Sass 3.7.4** which doesn't support modern syntax
- Modern syntax: `rgb(0 0 0 / 0.5)` (space-separated with slash)
- Legacy syntax: `rgba(0, 0, 0, 0.5)` (comma-separated)

## Before (Broken)
```scss
.element {
  box-shadow: 0 0 0 3px rgb(0 123 255 / 0.25);     // ❌ Breaks GitHub Pages
  background: rgb(0 0 0 / 0.5);                    // ❌ Breaks GitHub Pages
}
```

## After (Fixed)
```scss
.element {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);   // ✅ Works on GitHub Pages
  background: rgba(0, 0, 0, 0.5);                  // ✅ Works on GitHub Pages
}
```

## Changes Made

### 1. Updated Stylelint Configuration
**File**: `.stylelintrc.json`
```diff
- "color-function-notation": "modern",
+ "color-function-notation": "legacy",
```

### 2. Converted All SCSS Files
Automatically converted 61 occurrences across 5 files:
- `_sass/pages/_boardroom.scss` - 2 conversions
- `_sass/pages/_pitch.scss` - 3 conversions
- `_sass/pages/_pitch1.scss` - 4 conversions
- `_sass/pages/_startup1.scss` - 9 conversions
- `_sass/pages/_website.scss` - 43 conversions

### 3. Created Documentation
**New File**: `GITHUB_PAGES_SCSS_COMPATIBILITY.md`
- Explains the incompatibility
- Provides migration guide
- Documents testing procedures
- Prevents future occurrences

## Testing

### Before Fix
```bash
$ git push
# GitHub Pages build fails with rgb() argument error
```

### After Fix
```bash
$ npm run lint:scss:style
# ✅ Passes - no errors

$ npx stylelint "_sass/**/*.scss" --fix
# ✅ No changes - already in correct format
```

## Prevention
The updated stylelint configuration ensures:
1. Future auto-fixes will use legacy syntax
2. Developers can safely run `stylelint --fix`
3. CI/CD will catch any manual modern syntax usage
4. GitHub Pages builds will succeed

## Compatibility Matrix

| Sass Version | Modern Syntax | Legacy Syntax |
|--------------|---------------|---------------|
| Sass 3.7.4 (GitHub Pages) | ❌ Not Supported | ✅ Supported |
| Sass 1.97+ (Local) | ✅ Supported | ✅ Supported |

## References
- GitHub Pages uses jekyll-sass-converter 1.5.2 with Sass 3.7.4
- Modern syntax requires Sass 1.50+ or DartSass
- See `GITHUB_PAGES_SCSS_COMPATIBILITY.md` for full details
