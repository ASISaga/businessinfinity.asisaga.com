# SCSS Dependency Management

This document explains how SCSS dependencies are validated and managed in this subdomain.

## Overview

This repository uses a shared theme from [ASISaga/theme.asisaga.com](https://github.com/ASISaga/theme.asisaga.com) which provides:
- Bootstrap framework mixins and variables
- Common SCSS utilities and functions
- Base styling and design tokens
- Shared layout components

The subdomain's SCSS files in `_sass/` extend and customize the theme.

## Dependency Validation

### Automated Validation

Every PR that modifies SCSS files triggers automated validation via GitHub Actions (`.github/workflows/validate-scss.yml`):

1. **Theme checkout**: The theme repository is checked out alongside this repository
2. **Dependency scan**: All SCSS files are scanned for missing dependencies
3. **Error reporting**: Any missing mixins, variables, or functions are reported

### Manual Validation

Before committing SCSS changes, run the validator locally:

```bash
npm install sass js-yaml
node lint-scss-mixins.js
```

This will:
- Check all SCSS files for compilation errors
- Detect undefined mixins and functions
- Validate all variable references
- Identify invalid math operations
- Flag null/nil variable usage in calculations

## What the Validator Checks

### 1. Missing Mixins
```scss
// ❌ FAIL: Mixin not defined in theme or subdomain
.my-component {
  @include undefined-mixin();
}

// ✅ PASS: Mixin exists in theme
.my-component {
  @include make-container();
}
```

### 2. Undefined Variables
```scss
// ❌ FAIL: Variable not defined
.my-component {
  padding: $undefined-var;
}

// ✅ PASS: Variable from theme
.my-component {
  padding: $spacer;
}
```

### 3. Invalid Math Operations
```scss
// ❌ FAIL: Math on string or null
$my-var: null;
.my-component {
  width: $my-var + 10px;
}

// ✅ PASS: Valid math
.my-component {
  width: $spacer * 2;
}
```

### 4. Type Errors
```scss
// ❌ FAIL: Null variable in calculation
$bootstrap-var: null;
.my-component {
  margin: $bootstrap-var / 2;
}

// ✅ PASS: Proper value
.my-component {
  margin: $spacer / 2;
}
```

## Failsafe Mechanisms

### When Adding New SCSS Code

1. **Verify dependencies exist**: Before using any mixin or variable, check that it's defined in:
   - Theme repository: `ASISaga/theme.asisaga.com/_sass/`
   - Subdomain: `_sass/`
   
2. **Run local validation**: Test your changes with `node lint-scss-mixins.js`

3. **Handle missing dependencies**:
   - **Preferred**: Submit a PR to theme repository to add the missing dependency
   - **Alternative**: Create a local definition in `_sass/` with clear documentation
   - **Workaround**: Use a different approach that doesn't require the dependency

### When Dependencies Are Missing

If the validator reports missing dependencies:

1. **Check theme repository**: Verify if the mixin/variable should exist in the theme
   - Browse: https://github.com/ASISaga/theme.asisaga.com/tree/main/_sass

2. **Coordinate with theme maintainers**:
   - For shared functionality → Add to theme
   - For subdomain-specific needs → Add locally

3. **Document decisions**: Add comments explaining:
   - Why a local definition was needed
   - Any coordination with theme maintainers
   - Migration plans if temporary

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/validate-scss.yml`) runs on:
- Every PR that modifies SCSS files
- Every push to main branch with SCSS changes

### Workflow Steps:
1. Checkout this repository
2. Checkout theme repository to `theme.asisaga.com/`
3. Install Node.js and dependencies
4. Run `lint-scss-mixins.js`
5. Report results (pass/fail)

### Fixing CI Failures:

If the CI check fails:
1. Review the error output in GitHub Actions logs
2. Identify missing dependencies
3. Fix by either:
   - Adding dependency to theme (coordinate with team)
   - Creating local definition with documentation
   - Using alternative implementation
4. Push fix and re-run CI

## Best Practices

### DO:
✅ Use theme variables and mixins whenever possible
✅ Run `node lint-scss-mixins.js` before committing
✅ Document any local mixins/variables added
✅ Keep SCSS files modular and focused
✅ Follow the import chain: theme → subdomain

### DON'T:
❌ Copy theme files into subdomain
❌ Use undefined mixins/variables
❌ Commit SCSS with validation errors
❌ Skip local testing before pushing
❌ Use magic values instead of theme tokens

## Common Theme Dependencies

### Bootstrap Mixins (from theme)
- `@include make-container()`
- `@include make-row()`
- `@include button-size()`
- `@include d-flex`, `@include flex-direction()`, etc.

### Theme Variables (from theme)
- `$spacer` - Base spacing unit
- `$border-color` - Border color token
- `$muted-color` - Muted text color
- `$sp-1`, `$sp-2`, `$sp-3`, etc. - Spacing scale

### Bootstrap Utilities (from theme)
- Typography: `@include h1`, `@include h2`, etc.
- Text: `@include text-center`, `@include fw-bold`, etc.
- Display: `@include d-flex`, `@include d-none`, etc.
- Spacing: `@include mb-0`, `@include p-3`, etc.

## Troubleshooting

### "Theme SCSS not found" Warning

This warning appears when running the validator locally without the theme repository checked out:

```
⚠ Theme SCSS not found at: ../theme.asisaga.com/_sass
```

**Solution**: This is normal for local development. The CI environment will have the theme checked out.

### "Undefined mixin" Error

```
Error: Undefined mixin.
  @include my-mixin();
```

**Solutions**:
1. Check if mixin exists in theme repository
2. Add mixin to theme (submit PR)
3. Create local mixin with documentation
4. Use alternative approach

### "Undefined variable" Error

```
Error: Undefined variable.
  $my-variable
```

**Solutions**:
1. Use theme variable if appropriate
2. Define variable locally with documentation
3. Use hard-coded value with comment explaining why

## Additional Resources

- [SCSS Instructions](.github/instructions/scss.instructions.md) - Detailed SCSS guidelines
- [Theme Repository](https://github.com/ASISaga/theme.asisaga.com) - Shared theme source
- [Sass Documentation](https://sass-lang.com/documentation) - Official Sass docs
- [Bootstrap SCSS](https://getbootstrap.com/docs/5.3/customize/sass/) - Bootstrap customization guide
