# SCSS Validation Quick Reference

## Quick Commands

### Install Dependencies
```bash
npm install
```

### Run All Validations
```bash
npm run validate
```

### Run Individual Validators
```bash
npm run lint:scss          # Dependency validation
npm run lint:scss:style    # Style linting (stylelint)
npm run lint:scss:raw-css  # Raw CSS detection
npm run sass:compile       # Compilation testing
```

## What Each Validator Checks

### 1. Stylelint (`lint:scss:style`)
- ✅ Modern SCSS syntax
- ✅ Consistent color notation
- ✅ Proper selector patterns
- ✅ No duplicate selectors
- ✅ Code formatting

### 2. Raw CSS Detector (`lint:scss:raw-css`)
- ✅ No raw CSS properties (margin, padding, color, etc.)
- ✅ Only Genesis Ontological mixins allowed
- ✅ Zero raw CSS compliance

### 3. SCSS Compiler (`sass:compile`)
- ✅ All SCSS files compile without errors
- ✅ Syntax validity
- ✅ No compilation errors

### 4. Dependency Validator (`lint:scss`)
- ✅ All mixins exist in theme
- ✅ All variables are defined
- ✅ No type errors
- ⚠️ Requires theme to be checked out (CI only)

## Genesis Ontological Mixins

All styling MUST use these six categories:

1. **genesis-environment($logic)** - Layout
   - `'distributed'`, `'focused'`, `'associative'`, `'chronological'`, `'manifest'`

2. **genesis-entity($nature)** - Visual Presence
   - `'primary'`, `'secondary'`, `'imperative'`, `'latent'`, `'aggregate'`, `'ancestral'`

3. **genesis-cognition($intent)** - Typography
   - `'axiom'`, `'discourse'`, `'protocol'`, `'gloss'`, `'motive'`, `'quantum'`

4. **genesis-synapse($vector)** - Interaction
   - `'navigate'`, `'execute'`, `'inquiry'`, `'destructive'`, `'social'`

5. **genesis-state($condition)** - State
   - `'stable'`, `'evolving'`, `'deprecated'`, `'locked'`, `'simulated'`

6. **genesis-atmosphere($vibe)** - Texture
   - `'neutral'`, `'ethereal'`, `'void'`, `'vibrant'`

## Example Usage

❌ **WRONG** (Raw CSS):
```scss
.my-card {
  padding: 2rem;
  background: #1a1a2e;
  border-radius: 12px;
}
```

✅ **CORRECT** (Genesis Ontological):
```scss
.my-card {
  @include genesis-entity('primary');
}
```

## CI/CD Integration

GitHub Actions workflow automatically runs on:
- Pull requests modifying SCSS files
- Pushes to main branch with SCSS changes

**File**: `.github/workflows/validate-scss.yml`

## Bootstrap Status

✅ **COMPLETELY REMOVED**
- No npm dependencies
- No CDN links
- No SCSS imports
- No JavaScript references

## Files & Documentation

- `.stylelintrc.json` - Stylelint configuration
- `lint-scss-mixins.js` - Dependency validator
- `compile-scss.js` - SCSS compiler with stub mixins
- `detect-raw-css.js` - Raw CSS detector
- `SCSS_DEPENDENCY_MANAGEMENT.md` - Full documentation
- `SCSS_VALIDATION_AND_BOOTSTRAP_REMOVAL.md` - Implementation summary
- `.github/instructions/scss.instructions.md` - Complete SCSS guidelines

## Troubleshooting

### "Undefined mixin" Error
- Check if mixin exists in theme: `ASISaga/theme.asisaga.com/_sass/ontology/`
- Use only Genesis Ontological mixins
- Submit Ontological Proposition PR for new variants

### "Raw CSS detected" Error
- Remove all raw CSS properties
- Use Genesis ontological mixins instead
- See `.github/instructions/scss.instructions.md` for guidance

### Compilation Errors
- Check SCSS syntax
- Verify all imports are correct
- Run `npm run sass:compile` for details

## Need Help?

1. Check `.github/instructions/scss.instructions.md`
2. Review `SCSS_DEPENDENCY_MANAGEMENT.md`
3. See `SCSS_VALIDATION_AND_BOOTSTRAP_REMOVAL.md`
4. Consult theme repository: `ASISaga/theme.asisaga.com`
