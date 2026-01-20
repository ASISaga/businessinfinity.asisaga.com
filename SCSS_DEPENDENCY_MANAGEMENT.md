# SCSS Dependency Management

This document explains how SCSS dependencies are validated and managed in this subdomain.

## Overview

This repository uses a shared theme from [ASISaga/theme.asisaga.com](https://github.com/ASISaga/theme.asisaga.com) which provides:
- **Genesis Ontological SCSS Design System** - Six ontological categories for semantic styling
- Common SCSS utilities and functions
- Base styling and design tokens (150+ CSS custom properties)
- Shared layout components

The subdomain's SCSS files in `_sass/` use only ontological mixins - no raw CSS properties are allowed.

## Dependency Validation

### Automated Validation

Every PR that modifies SCSS files triggers automated validation via GitHub Actions (`.github/workflows/validate-scss.yml`):

1. **Theme checkout**: The theme repository is checked out alongside this repository
2. **Dependency scan**: All SCSS files are scanned for missing dependencies
3. **Error reporting**: Any missing mixins, variables, or functions are reported

### Manual Validation

Before committing SCSS changes, install dependencies and run all validators:

```bash
npm install
npm run validate
```

This runs all validation tools:
- `lint:scss` - Dependency validation (lint-scss-mixins.js)
- `lint:scss:style` - Style linting (stylelint)
- `lint:scss:raw-css` - Raw CSS detection (detect-raw-css.js)
- `sass:compile` - Compilation testing (compile-scss.js)

For individual validators:

```bash
# Dependency validation
npm run lint:scss

# Style linting
npm run lint:scss:style

# Raw CSS detection
npm run lint:scss:raw-css

# Compilation testing
npm run sass:compile
```

This will:
- Check all SCSS files for compilation errors
- Detect undefined mixins and functions
- Validate all variable references
- Identify invalid math operations
- Flag null/nil variable usage in calculations

## What the Validators Check

### 1. Missing Mixins (lint-scss-mixins.js)
```scss
// ❌ FAIL: Mixin not defined in theme or subdomain
.my-component {
  @include undefined-mixin();
}

// ✅ PASS: Genesis Ontological mixin from theme
.my-component {
  @include genesis-environment('distributed');
  @include genesis-entity('primary');
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

### 4. Type Errors (lint-scss-mixins.js)
```scss
// ❌ FAIL: Null variable in calculation
$undefined-var: null;
.my-component {
  margin: $undefined-var / 2;
}

// ✅ PASS: Use ontological mixins instead of raw CSS
.my-component {
  @include genesis-entity('primary');  // All spacing from theme engine
}
```

### 5. Raw CSS Properties (detect-raw-css.js)
```scss
// ❌ FAIL: Raw CSS properties violate Genesis Ontological system
.my-component {
  padding: 2rem;
  background: #1a1a2e;
  color: white;
}

// ✅ PASS: Only ontological mixins
.my-component {
  @include genesis-entity('primary');  // All styling from theme engine
}
```

### 6. Code Style (stylelint)
- Modern SCSS syntax
- Consistent color notation
- Proper selector patterns
- No duplicate selectors
- Consistent formatting

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

## Genesis Ontological SCSS Design System

The theme provides six ontological categories for all styling. **All subdomain SCSS must use only these mixins - no raw CSS properties.**

### 1. genesis-environment($logic) - Layout Organization
- `'distributed'` - Bento grid layout (auto-fit, responsive)
- `'focused'` - Single column for reading (max 70ch, centered)
- `'associative'` - Network layout (flexbox wrap)
- `'chronological'` - Time-linear vertical stream
- `'manifest'` - High-density dashboard (12-column grid)

### 2. genesis-entity($nature) - Visual Presence
- `'primary'` - Main content (glassmorphism, elevated)
- `'secondary'` - Supporting content (lighter glass)
- `'imperative'` - Urgent signal (pulsing neon)
- `'latent'` - Inactive content (dimmed)
- `'aggregate'` - Container styling
- `'ancestral'` - Archived data (muted)

### 3. genesis-cognition($intent) - Information Type
- `'axiom'` - Headlines (2-3.5rem, bold)
- `'discourse'` - Body prose (1-1.125rem, serif)
- `'protocol'` - Code/technical (monospace)
- `'gloss'` - Annotations (0.8-0.875rem, muted)
- `'motive'` - Persuasive text (semibold, accent)
- `'quantum'` - Tags/chips (tiny, uppercase)

### 4. genesis-synapse($vector) - Interaction
- `'navigate'` - Portal to different page
- `'execute'` - Local state change (button)
- `'inquiry'` - Request more data (search)
- `'destructive'` - Permanent removal (danger)
- `'social'` - Social sharing

### 5. genesis-state($condition) - Temporal State
- `'stable'` - Normal state
- `'evolving'` - Being updated (progress)
- `'deprecated'` - No longer verified
- `'locked'` - Immutable (blur)
- `'simulated'` - Projection (dashed)

### 6. genesis-atmosphere($vibe) - Sensory Texture
- `'neutral'` - Standard transparency
- `'ethereal'` - Light-based (bright)
- `'void'` - Deep-space (dark, immersive)
- `'vibrant'` - High-energy (colorful)

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
- [Genesis Ontological System](https://github.com/ASISaga/theme.asisaga.com/blob/main/GENOME.md) - Ontology variants and evolution
