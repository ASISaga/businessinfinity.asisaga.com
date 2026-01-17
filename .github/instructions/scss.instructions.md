---
applyTo: "**/_sass/**,**/*.scss,**/_sass/**/_*.scss"
description: "SCSS guidance for subdomain: Genesis Ontological SCSS Design System compliance, partial locations, import chains, theming, and accessibility."
---

# 🌟 PRIMARY METHOD: Genesis Ontological SCSS Design System

**For ALL new development and refactoring, use the Genesis Ontological SCSS Design System exclusively.**

The Genesis Semantic Engine is the **required interface** for styling. It provides a three-tier architecture that separates content semantics from visual presentation.

## Quick Start (REQUIRED)

```scss
---
---
@import "ontology/index";  // MUST be first import in _main.scss

.my-component {
  @include genesis-environment('distributed');  // Layout logic
  @include genesis-entity('primary');           // Visual presence
  
  .title {
    @include genesis-cognition('axiom');        // Typography
  }
  
  .action-button {
    @include genesis-synapse('execute');        // Interaction
  }
}
```

**Golden Rule**: NEVER use raw CSS properties (margin, padding, color, font-size, etc.) in subdomain SCSS files. All styling comes from ontological mixins.

## Import Chain & Entry Points

- The canonical theme lives in `ASISaga/theme.asisaga.com` repository on GitHub.
- The theme supplies the **Genesis Ontological SCSS Design System** via shared `_sass/ontology/` for all subdomains.
- GitHub Pages merges the theme into the subdomain at build time.
- The subdomain's `_sass/_main.scss` is the entry point. It MUST import `@import "ontology/index";` as the first import.
- Keep imports at the top level minimal. Prefer small, focused partials that are imported by `_main.scss`.

## SCSS File Locations & Structure

- Subdomain SCSS lives under `/_sass/`.
- **Main entry**: `_sass/_main.scss` - imports ontology and subdomain partials
- Component partials: `/_sass/components/` - semantic mappings only (no raw CSS)
- Page-specific styles: `/_sass/pages/` - semantic mappings only (no raw CSS)
- Section styles: `/_sass/sections/` - semantic mappings only (no raw CSS)
- Vendor partials: `/_sass/vendor/` — keep vendor code isolated and document the vendor source and version

## Component SCSS Mapping

- For each `_includes/components/<name>.html` create a corresponding `/_sass/components/_<name>.scss` partial.
- Each partial should contain ONLY ontological mixin calls - NO raw CSS properties.

## Ontological System - Zero Raw CSS

**MANDATORY**: Subdomain SCSS files MUST NOT contain raw CSS properties:
- ❌ `margin`, `padding`, `display`, `color`, `font-size`, `background`
- ❌ Any unit values: `px`, `rem`, `em`, `%`
- ❌ Any color values: `#hex`, `rgb()`, `oklch()`
- ❌ Any raw CSS properties whatsoever

**Only use ontological mixins** - All styling comes from the theme engine.

❌ **WRONG:**
```scss
.my-card {
  padding: 2rem;
  background: #1a1a2e;
  border-radius: 12px;
  color: white;
}
```

✅ **CORRECT:**
```scss
.my-card {
  @include genesis-entity('primary');  // All styling from theme engine
}
```

## Six Ontological Categories (Complete API)

### 1. `genesis-environment($logic)` - Layout Organization
Defines spatial arrangement and layout logic:
- `'distributed'` - Autonomous entities in Bento grid (auto-fit, responsive)
- `'focused'` - Single column for deep reading (max 70ch, centered)
- `'associative'` - Network layout (flexbox wrap)
- `'chronological'` - Time-linear vertical stream (timeline, feed)
- `'manifest'` - High-density dashboard (12-column grid)

### 2. `genesis-entity($nature)` - Visual Presence
Defines glassmorphism and visual weight:
- `'primary'` - Main content object (glassmorphism, elevated)
- `'secondary'` - Supporting contextual data (lighter glass)
- `'imperative'` - System-critical urgent signal (pulsing neon border)
- `'latent'` - Dormant/inactive content (dimmed, grayscale)
- `'aggregate'` - Container for multiple items (wrapper styling)
- `'ancestral'` - Archived/historical data (muted appearance)

### 3. `genesis-cognition($intent)` - Information Type
Defines typography based on semantic meaning:
- `'axiom'` - Foundational headlines (2-3.5rem, bold)
- `'discourse'` - Standard body prose (1-1.125rem, serif, readable)
- `'protocol'` - Technical/code content (monospace)
- `'gloss'` - Minor annotations/citations (0.8-0.875rem, muted)
- `'motive'` - Persuasive/instructional text (semibold, accent)
- `'quantum'` - Tags/chips/micro-content (tiny, uppercase)

### 4. `genesis-synapse($vector)` - Interaction
Defines navigation and action patterns:
- `'navigate'` - Portal to different page (link, underline on hover)
- `'execute'` - Local state change/command (primary action button)
- `'inquiry'` - Request for more data (search, expand, secondary action)
- `'destructive'` - Permanent removal (danger button, red tones)
- `'social'` - Neural link to other observers (social sharing button)

### 5. `genesis-state($condition)` - Temporal State
Defines system condition:
- `'stable'` - System is in equilibrium (normal state)
- `'evolving'` - Content is being updated/streamed (animated progress)
- `'deprecated'` - Information no longer verified (strikethrough, warning)
- `'locked'` - Data is immutable (blur effect, lock icon)
- `'simulated'` - Data is a projection (dashed border, diagonal stripes)

### 6. `genesis-atmosphere($vibe)` - Sensory Texture
Defines emotional tone:
- `'neutral'` - Standard system transparency
- `'ethereal'` - High-transparency, light-based focus (bright, minimal)
- `'void'` - Deep-space, high-contrast (dark, immersive)
- `'vibrant'` - High-energy, data-saturated (colorful, energetic)

## Theming & Design Tokens

- When using ontology mixins, you DO NOT reference tokens directly - the engine handles all token usage.
- The ontology engine uses 150+ CSS custom properties from the theme.
- DO NOT introduce new tokens in subdomain SCSS - all tokens are managed in theme.
- Color compliance (WCAG AA) is enforced by the theme engine.

## Best Practices

- Do not use CSS files. Edit SCSS partials only.
- Use semantic class names that describe WHAT something is, not HOW it looks.
- Keep component styles scoped to logical classes; avoid global side effects.
- SCSS nesting should perfectly mirror HTML DOM hierarchy.
- Apply one primary mixin from each category as needed.

## Vendor & Third-party CSS

- Vendors should be placed in `/_sass/vendor/` and imported from `_main.scss` after ontology import.
- Verify vendor license and document the origin in a comment at the top of the vendor partial.

## Do Not

- Do not copy theme `_sass` files wholesale into the subdomain. Prefer upstream fixes in the theme repository.
- Do not use raw CSS properties - use ontological mixins exclusively.

## Structural Checks & SCSS Scans

- **Component partial mapping:** Ensure each `_includes/components/<name>.html` has a corresponding `/_sass/components/_<name>.scss`. Missing partials should be explained in the include header.
- **Avoid deep specificity:** Warn on deeply-nested selectors (>4 levels) and global element selectors in component partials.
- **Zero raw CSS enforcement:** All subdomain SCSS must use only ontological mixins. No raw CSS properties allowed.

## Dependency Validation & Failsafe Mechanisms

- **Theme dependency validation:** All SCSS files must only use mixins from:
  1. The theme's ontology system (`ASISaga/theme.asisaga.com/_sass/ontology/`)
  2. Standard Sass built-in modules
- **Ontology compliance:** Before committing SCSS changes:
  1. Verify all styling uses ontological mixins (genesis-environment, genesis-entity, etc.)
  2. Ensure no raw CSS properties are present
  3. Confirm semantic class names describe WHAT, not HOW
- **CI enforcement:** GitHub Actions workflow validates SCSS on every PR to prevent merging non-compliant code.
- **Failsafe rules when adding new SCSS:**
  1. Always use ontological mixins - never use raw CSS properties
  2. Map HTML semantics to ontological roles
  3. If a required variant is missing from ontology, submit an Ontological Proposition PR to theme repository
  4. Document any temporary workarounds with clear migration path
- **Evolutionary system:** The Genesis Ontology is a Living Genome that grows through semantic propositions:
  - Found a semantic gap? Submit an Ontological Proposition PR to theme repository
  - Review existing variants first (31 total across 6 categories)
  - Consult theme's `GENOME.md` for variant history
  - See theme's `.github/prompts/subdomain-evolution-agent.prompt.md` for guidance

## Structural Checks & SCSS Scans
- **Component partial mapping:** Ensure each `_includes/components/<name>.html` has a corresponding `/_sass/components/_<name>.scss`. Missing partials should be explained in the include header.
- **Avoid deep specificity:** Warn on deeply-nested selectors (>4 levels) and global element selectors in component partials.
- **`@extend` policy (warn):** Use `@extend` sparingly. If used, document rationale in the partial header so reviewers can assess maintainability impact. CI may flag `@extend` usages for review.

## Dependency Validation & Failsafe Mechanisms
- **Theme dependency validation:** All SCSS files must only use mixins, functions, and variables that are defined in either:
  1. The theme repository (`ASISaga/theme.asisaga.com`)
  2. The subdomain's own `_sass` directory
  3. Standard Sass built-in modules
- **Missing dependency detection:** Before committing SCSS changes, run `node lint-scss-mixins.js` to detect:
  - Undefined mixins and functions
  - Undefined variables
  - Invalid math operations
  - Type errors (e.g., using null/nil in calculations)
- **CI enforcement:** GitHub Actions workflow validates SCSS on every PR to prevent merging code with missing dependencies.
- **Failsafe rules when adding new SCSS:**
  1. Never use `@include` or `@mixin` calls without verifying the mixin exists in theme or subdomain
  2. Never reference variables (e.g., `$spacer`, `$border-color`) without confirming they're defined in theme's `_common.scss`
  3. Document any new mixins or variables added to subdomain in comments
  4. If a required mixin/variable is missing from theme, either:
     - Submit a PR to theme repository to add it
     - Create a local fallback in subdomain with clear documentation
     - Use alternative approach that doesn't require the missing dependency
- **Automated checks:** The linter performs these checks:
  - Scans for undefined mixin calls
  - Validates all variable references
  - Detects math operations on incompatible types
  - Ensures no Bootstrap/theme variables are set to null before use
- **Error handling:** If validation fails:
  1. Review the error output to identify missing dependencies
  2. Check if dependency should exist in theme (coordinate with theme maintainers)
  3. Add fallback or alternative implementation in subdomain if appropriate
  4. Document the decision and rationale in code comments

