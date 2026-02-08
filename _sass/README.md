# Genesis Ontological SCSS Design System

This repository uses the **Genesis Ontological SCSS Design System (v4.0)** — a zero-raw-CSS approach where all styling is defined through semantic mixins.

## Entry Point

**`_main.scss`** — Main entry point that imports the ontology system and semantic component/page mappings.

## Core Architecture

### 1. Ontology System (Remote Theme)
The Genesis Ontological SCSS Design System is provided by the remote theme `ASISaga/theme.asisaga.com` and imported via:
```scss
@import "ontology/index";
```

This provides six foundational mixins that map semantic intent to visual styling:
- `genesis-environment` — Layout and spatial organization
- `genesis-entity` — Core element semantics
- `genesis-cognition` — Typography and content hierarchy
- `genesis-synapse` — Interactive behavior
- `genesis-state` — State management
- `genesis-atmosphere` — Visual mood and decoration

### 2. Semantic Mappings (This Repository)
All local SCSS files map domain concepts to ontological roles using **only** the six mixins above.

**Directory Structure:**
```
_sass/
├── _main.scss                    # Entry point
├── _example-ontology.scss        # Reference guide (not imported)
├── ontology/                     # From remote theme
├── components/                   # Shared UI patterns
│   ├── _ui-utilities.scss
│   ├── _boardroom-new.scss
│   ├── _quick-links.scss
│   ├── _backend-features.scss
│   └── boardroom/
│       └── _main.scss            # Boardroom component aggregator
├── pages/                        # Per-page styles
│   ├── _index.scss
│   ├── _boardroom.scss
│   ├── _business-infinity.scss
│   ├── _entrepreneur.scss
│   ├── _startup.scss
│   ├── _startup2.scss
│   └── ...                       # See _main.scss for full list
└── sections/                     # Reusable section styles
    └── _business-infinity.scss
```

## Zero Raw CSS Policy

**No raw CSS properties are allowed.** All styling must use ontological mixins.

❌ **Forbidden:**
```scss
.my-element {
  display: flex;
  color: #333;
}
```

✅ **Required:**
```scss
.my-element {
  @include genesis-environment("flex-container");
  @include genesis-cognition("body-text");
}
```

## Reference Guide

See `_example-ontology.scss` for comprehensive examples of correct mixin usage patterns.
