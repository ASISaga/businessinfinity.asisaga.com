# Genesis Ontological SCSS Design System - Migration Guide

## Overview

This guide explains how to migrate existing Bootstrap-based SCSS to the Genesis Ontological SCSS Design System used by the ASI Saga theme.

## Migration Status

- ✅ **Ontology system imported**: `_sass/_main.scss` now imports `@import "ontology/index";`
- ✅ **Instructions updated**: All `.github/instructions/*.md` files reflect ontological requirements
- 🔄 **Legacy SCSS files**: Existing Bootstrap-based SCSS remains functional (backward compatible)
- 🎯 **Target**: All new SCSS development uses ontological mixins exclusively

## Backward Compatibility

The theme provides **full backward compatibility** for existing code:
- Bootstrap mixins continue to work (e.g., `@include make-container()`, `@include d-flex`)
- Legacy Bento Engine classes remain functional
- Material Primitive classes continue to work
- No breaking changes to existing implementations

This allows for **gradual migration** rather than a complete rewrite.

## Three-Tier Architecture

The Genesis Semantic Engine separates concerns into three distinct layers:

### Tier 1: Content (HTML)
**Responsibility**: Defines WHAT the data is  
**Constraint**: Semantic HTML5 with meaningful class names

```html
<!-- ✅ GOOD: Semantic class names -->
<article class="blog-post">
  <h1 class="post-title">Understanding AI</h1>
  <p class="post-content">...</p>
  <a href="#" class="read-more-link">Read more</a>
</article>

<!-- ❌ BAD: Visual/presentational class names -->
<div class="blue-box">
  <h1 class="big-bold-text">Understanding AI</h1>
  <p class="gray-text">...</p>
  <a href="#" class="rounded-button">Read more</a>
</div>
```

### Tier 2: Interface (SCSS with Ontological Mixins)
**Responsibility**: Defines the ROLE of the content  
**Constraint**: NO raw CSS properties - only ontological mixins

```scss
// ✅ GOOD: Ontological mixins only
.blog-post {
  @include genesis-environment('focused');  // Reading-optimized layout
  @include genesis-atmosphere('ethereal');   // Light, peaceful vibe
  
  .post-title {
    @include genesis-cognition('axiom');     // Large headline
  }
  
  .post-content {
    @include genesis-cognition('discourse'); // Body text
  }
  
  .read-more-link {
    @include genesis-synapse('navigate');    // Navigation link
  }
}

// ❌ BAD: Raw CSS properties
.blog-post {
  max-width: 70ch;
  margin: 0 auto;
  padding: 2rem;
  background: oklch(0.98 0.01 200 / 0.95);
  
  .post-title {
    font-size: 3rem;
    font-weight: bold;
  }
}
```

### Tier 3: Engine (Theme Repository)
**Responsibility**: Defines the LOOK (OKLCH colors, Bento layouts, Glassmorphism)  
**Constraint**: The ONLY place for raw CSS properties  
**Location**: Theme repository `_sass/ontology/_engines.scss`

**Note**: Subdomain developers NEVER touch this layer.

## Six Ontological Categories

### 1. `genesis-environment($logic)` - Layout Organization
Use for containers and page layouts:

| Variant | Use Case | Bootstrap Equivalent |
|---------|----------|---------------------|
| `'distributed'` | Card grids, product catalogs | `.row` + `.col-auto` with grid |
| `'focused'` | Blog posts, articles, reading | `.container` + max-width |
| `'associative'` | Tag clouds, networks | `.d-flex.flex-wrap` |
| `'chronological'` | Feeds, timelines | `.d-flex.flex-column` |
| `'manifest'` | Dashboards, admin panels | `.row` + 12-column grid |

**Migration example**:
```scss
// BEFORE (Bootstrap)
.boardroom-container {
  @include make-container();
}

// AFTER (Ontology)
.boardroom-container {
  @include genesis-environment('manifest');  // Dashboard layout
}
```

### 2. `genesis-entity($nature)` - Visual Presence
Use for cards, panels, containers:

| Variant | Use Case | Bootstrap Equivalent |
|---------|----------|---------------------|
| `'primary'` | Main cards, hero sections | `.card` + elevated styling |
| `'secondary'` | Sidebars, supporting content | `.card.bg-light` |
| `'imperative'` | Alerts, urgent notifications | `.alert.alert-danger` |
| `'latent'` | Disabled/inactive content | `.disabled`, `.text-muted` |
| `'aggregate'` | Container for multiple items | `.card-deck`, `.list-group` |
| `'ancestral'` | Archived/historical data | `.text-muted` + archival styling |

**Migration example**:
```scss
// BEFORE (Bootstrap)
.boardroom-members-sidebar {
  @include bg-light;
  @include d-flex;
  @include flex-direction(column);
  padding: 0;
}

// AFTER (Ontology)
.boardroom-members-sidebar {
  @include genesis-entity('secondary');        // Supporting content
  @include genesis-environment('chronological'); // Vertical list
}
```

### 3. `genesis-cognition($intent)` - Typography
Use for all text elements:

| Variant | Use Case | Bootstrap Equivalent |
|---------|----------|---------------------|
| `'axiom'` | Page titles, headlines | `.display-*`, `h1` |
| `'discourse'` | Body text, paragraphs | `.lead`, `p` |
| `'protocol'` | Code, technical content | `<code>`, `<pre>` |
| `'gloss'` | Captions, footnotes | `.small`, `.text-muted` |
| `'motive'` | CTAs, persuasive text | `.lead.font-weight-semibold` |
| `'quantum'` | Tags, badges, chips | `.badge` |

**Migration example**:
```scss
// BEFORE (Bootstrap)
.boardroom-members-title {
  @include h5;
  @include mb-0;
}

// AFTER (Ontology)
.boardroom-members-title {
  @include genesis-cognition('axiom');  // Headline typography
}
```

### 4. `genesis-synapse($vector)` - Interactions
Use for buttons, links, interactive elements:

| Variant | Use Case | Bootstrap Equivalent |
|---------|----------|---------------------|
| `'navigate'` | Links to other pages | `<a>`, `.btn-link` |
| `'execute'` | Primary action buttons | `.btn.btn-primary` |
| `'inquiry'` | Search, expand, secondary actions | `.btn.btn-outline-secondary` |
| `'destructive'` | Delete, remove actions | `.btn.btn-danger` |
| `'social'` | Share, like, social actions | `.btn.btn-info` with icons |

**Migration example**:
```scss
// BEFORE (Bootstrap)
.boardroom-invite-member-btn {
  @include button-size(0.375rem, 0.75rem, 1rem, 0.25rem);
  @include btn-primary;
}

// AFTER (Ontology)
.boardroom-invite-member-btn {
  @include genesis-synapse('execute');  // Primary action
}
```

### 5. `genesis-state($condition)` - Temporal State
Use for dynamic content states:

| Variant | Use Case | Bootstrap Equivalent |
|---------|----------|---------------------|
| `'stable'` | Normal state | No modifier |
| `'evolving'` | Loading, updating | `.spinner-border`, progress bars |
| `'deprecated'` | Outdated information | `.text-decoration-line-through` |
| `'locked'` | Restricted access | `.disabled` + lock icon |
| `'simulated'` | Preview/draft content | `.border-dashed` |

### 6. `genesis-atmosphere($vibe)` - Sensory Texture
Use for page-level mood/tone:

| Variant | Use Case |
|---------|----------|
| `'neutral'` | Standard pages |
| `'ethereal'` | Light, minimal pages (blogs, reading) |
| `'void'` | Dark, immersive pages (code editors) |
| `'vibrant'` | High-energy pages (dashboards, analytics) |

## Migration Workflow

### Step 1: Identify Component Type
Look at the component's purpose and semantic meaning:
- Is it a layout container? → `genesis-environment`
- Is it a visual card/panel? → `genesis-entity`
- Is it text content? → `genesis-cognition`
- Is it interactive? → `genesis-synapse`
- Does it have a state? → `genesis-state`
- Does the page have a mood? → `genesis-atmosphere`

### Step 2: Map Bootstrap Patterns to Ontology

Common patterns:

```scss
// PATTERN: Layout container
// BEFORE
.container {
  @include make-container();
}
// AFTER
.container {
  @include genesis-environment('focused');  // or 'manifest', 'distributed', etc.
}

// PATTERN: Flex layout
// BEFORE
.flex-container {
  @include d-flex;
  @include flex-direction(column);
  @include align-items(center);
}
// AFTER
.flex-container {
  @include genesis-environment('chronological');  // or 'associative', etc.
}

// PATTERN: Card/panel
// BEFORE
.card {
  @include bg-light;
  padding: map-get($spacers, 3);
  border-radius: 0.5rem;
}
// AFTER
.card {
  @include genesis-entity('primary');  // or 'secondary', etc.
}

// PATTERN: Heading
// BEFORE
.title {
  @include h3;
  @include fw-bold;
}
// AFTER
.title {
  @include genesis-cognition('axiom');
}

// PATTERN: Button
// BEFORE
.action-btn {
  @include btn-primary;
  @include button-size(...);
}
// AFTER
.action-btn {
  @include genesis-synapse('execute');
}
```

### Step 3: Combine Mixins When Needed

You can apply multiple ontological mixins to the same element:

```scss
.live-dashboard-panel {
  @include genesis-entity('imperative');      // Urgent visual weight
  @include genesis-state('evolving');         // Currently updating
  @include genesis-atmosphere('vibrant');     // High-energy vibe
  
  .panel-title {
    @include genesis-cognition('axiom');      // Large headline
  }
  
  .refresh-button {
    @include genesis-synapse('execute');      // Primary action
  }
}
```

### Step 4: Remove All Raw CSS Properties

After applying ontological mixins, remove ALL raw CSS:
- Delete `padding`, `margin`, `color`, `font-size`, etc.
- Delete Bootstrap variable references like `map-get($spacers, 3)`
- Let the ontology engine handle all visual styling

```scss
// BEFORE: Mixed ontology + raw CSS (WRONG)
.card {
  @include genesis-entity('primary');
  padding: 2rem;  // ❌ Remove this
  margin-bottom: 1rem;  // ❌ Remove this
}

// AFTER: Pure ontology (CORRECT)
.card {
  @include genesis-entity('primary');  // ✅ Engine handles all styling
}
```

## Migration Priority

### High Priority (Do First)
1. **New components**: All new SCSS MUST use ontology exclusively
2. **Frequently updated components**: Migrate active development areas
3. **Page-level layouts**: Top-level containers and environments

### Medium Priority
4. **Existing components**: Gradual migration as you touch files
5. **Utility classes**: Can remain as Bootstrap for now (backward compatible)

### Low Priority (Can Wait)
6. **Vendor code**: Leave vendor SCSS unchanged
7. **One-off styles**: Rarely-used components can migrate gradually

## Testing Migration

After migrating a component:

1. **Build the site**: `bundle exec jekyll serve`
2. **Visual inspection**: Verify the component looks correct
3. **Responsive check**: Test at 375px, 768px, 1440px viewports
4. **Accessibility**: Verify contrast, focus states, keyboard navigation
5. **Compare**: Ensure visual appearance matches pre-migration

## Example: Complete Migration

### Before (Bootstrap-based)
```scss
// _sass/components/_card.scss
.product-card {
  @include make-col(12);
  @include make-col-md(6);
  @include make-col-lg(4);
  @include bg-white;
  padding: map-get($spacers, 4);
  border-radius: 0.5rem;
  box-shadow: $box-shadow-sm;
  
  .card-title {
    @include h4;
    @include mb-3;
    color: $dark;
  }
  
  .card-description {
    @include text-muted;
    @include mb-3;
    font-size: $font-size-base;
  }
  
  .card-price {
    @include h3;
    @include mb-3;
    color: $primary;
  }
  
  .buy-button {
    @include btn-primary;
    @include w-100;
  }
}
```

### After (Ontology-based)
```scss
// _sass/components/_card.scss
.product-card {
  @include genesis-entity('primary');  // Main card with glassmorphism
  
  .card-title {
    @include genesis-cognition('motive');  // Persuasive headline
  }
  
  .card-description {
    @include genesis-cognition('discourse');  // Body text
  }
  
  .card-price {
    @include genesis-cognition('axiom');  // Prominent price
  }
  
  .buy-button {
    @include genesis-synapse('execute');  // Primary action
  }
}
```

**Benefits**:
- ✅ Significant code reduction (from 18 mixin/property calls to 5 semantic mappings)
- ✅ No raw CSS properties to maintain
- ✅ Semantic clarity (code expresses intent, not implementation)
- ✅ Single source of truth (visual changes happen in theme engine)
- ✅ System-wide visual updates without touching subdomain code

## Common Questions

### Q: Can I still use Bootstrap classes in HTML?
**A**: Yes, for now. The theme provides backward compatibility. However, prefer semantic class names mapped to ontology in SCSS.

### Q: What if I need a style not covered by ontology?
**A**: 
1. First, try combining existing mixins
2. Check theme's `GENOME.md` for all 31 variants
3. If truly needed, submit an Ontological Proposition PR to theme repository
4. DO NOT add raw CSS as a workaround

### Q: Do I have to migrate all files at once?
**A**: No. Gradual migration is supported. Old Bootstrap-based SCSS continues to work.

### Q: How do I know which ontological mixin to use?
**A**: Ask semantic questions:
- "What IS this element?" (not "how should it look?")
- "What's its ROLE in the UI?"
- "What's the user's INTENT when interacting with it?"

### Q: Can I mix ontology and Bootstrap in the same file?
**A**: Technically yes (backward compatible), but strongly discouraged. Prefer full migration per component for clarity.

## Resources

- **Theme repository**: https://github.com/ASISaga/theme.asisaga.com
- **Complete API reference**: Theme's `_sass/ontology/INTEGRATION-GUIDE.md`
- **Variant history**: Theme's `GENOME.md`
- **Architecture**: Theme's `_sass/ontology/Readme.md`
- **Instructions**: `.github/instructions/scss.instructions.md`

## Getting Help

1. Review theme's `INTEGRATION-GUIDE.md` for examples
2. Check theme's `GENOME.md` for variant explanations
3. Submit questions as GitHub issues
4. For new variants, use Ontological Proposition PR template

---

**Remember**: The goal is semantic clarity. Think about WHAT things ARE, not HOW they LOOK. The visual appearance is handled by the theme engine.
