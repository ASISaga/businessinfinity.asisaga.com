---
layout: docs
title: SCSS & Styling Specification
description: SCSS architecture, Genesis Ontological Design System, and styling conventions
search: true
breadcrumbs:
  - title: Docs
    url: /docs/
  - title: Specifications
    url: /docs/specifications/
prev:
  title: HTML & Templates
  url: /docs/specifications/html-templates.html
next:
  title: JavaScript & Components
  url: /docs/specifications/javascript-components.html
---

## Overview

Business Infinity uses SCSS (Sass) for styling, compiled to CSS3. The styling architecture is modular, maintainable, and follows Bootstrap conventions with custom theming.

## SCSS Architecture

### Import Chain

#### Entry Point
**File**: `/assets/css/style.scss`

This is the canonical entry point managed by the theme. The theme imports:
1. Theme common styles (`_sass/_common.scss` from theme)
2. Subdomain-specific styles (`_sass/_main.scss` from subdomain)

#### Subdomain Main Entry
**File**: `/_sass/_main.scss`

```scss
// Main entry point for all SCSS styles
// This file imports all component and page-specific styles

// Components
@import "components/ui-utilities";
@import "components/boardroom/main";
@import "components/boardroom-new";
@import "components/quick-links";

// Pages
@import "pages/index";
@import "pages/boardroom";
@import "pages/boardroom2";
@import "pages/dashboard";
@import "pages/mentor";
@import "pages/features";
@import "pages/enterprise";
// ... other pages

// Sections
@import "sections/business-infinity";
```

### Directory Structure

```
_sass/
├── _main.scss                 # Main entry (imports all modules)
├── components/                # Reusable component styles
│   ├── _ui-utilities.scss     # Utility classes
│   ├── _quick-links.scss      # Quick links component
│   ├── _boardroom-new.scss    # New boardroom styles
│   └── boardroom/             # Boardroom component group
│       └── _main.scss         # Boardroom main import
├── pages/                     # Page-specific styles
│   ├── README.md             # Page styles documentation
│   ├── _index.scss           # Homepage
│   ├── _boardroom.scss       # Boardroom page
│   ├── _boardroom2.scss      # Boardroom v2 page
│   ├── _dashboard.scss       # Dashboard page
│   ├── _mentor.scss          # Mentor page
│   ├── _features.scss        # Features page
│   ├── _enterprise.scss      # Enterprise page
│   ├── _about.scss           # About page
│   ├── _trust.scss           # Trust page
│   ├── _network.scss         # Network page
│   ├── _pitch.scss           # Pitch tools page
│   ├── _startup.scss         # Startup page
│   └── [other pages]         # Additional page styles
├── sections/                  # Section-specific styles
│   └── _business-infinity.scss
└── vendor/                    # Third-party CSS (if needed)
```

## Component-Include Mapping

### Principle
For each `_includes/components/<name>.html`, create a corresponding `/_sass/components/_<name>.scss` partial.

### Examples

#### Component Include
**File**: `_includes/boardroom/chat-area.html`
**Style**: `_sass/components/boardroom/_chat-area.scss`

#### Component Include
**File**: `_includes/components/card.html`
**Style**: `_sass/components/_card.scss`

### Naming Convention
- Use underscore prefix for partials: `_component-name.scss`
- Match include filename exactly (except `.html` vs `.scss`)
- Use kebab-case: `chat-area`, not `chatArea` or `chat_area`

## Theme Variables & Tokens

### Using Theme Tokens
```scss
// Theme provides variables for consistency
@import "theme/variables";

.custom-component {
  // Use theme colors
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  
  // Use theme spacing
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
  
  // Use theme typography
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
}
```

### Creating New Tokens
When introducing new design tokens:

1. **Document the token** in component/page header
2. **Provide use cases** and examples
3. **Include contrast checks** for color tokens
4. **Consider theme addition** if widely reusable

```scss
// New color token
// Use case: Alert danger state
// Contrast: 7.2:1 (AAA) against white background
$color-alert-danger: #dc3545;

// Usage
.alert-danger {
  color: $color-alert-danger;
}
```

## Color System

### Color Variables
```scss
// Primary palette (from theme)
$primary: #0066cc;
$secondary: #6c757d;
$success: #28a745;
$danger: #dc3545;
$warning: #ffc107;
$info: #17a2b8;

// Grayscale
$white: #ffffff;
$gray-100: #f8f9fa;
$gray-200: #e9ecef;
$gray-300: #dee2e6;
$gray-400: #ced4da;
$gray-500: #adb5bd;
$gray-600: #6c757d;
$gray-700: #495057;
$gray-800: #343a40;
$gray-900: #212529;
$black: #000000;

// Semantic colors
$color-text-primary: $gray-900;
$color-text-secondary: $gray-600;
$color-bg-primary: $white;
$color-bg-secondary: $gray-100;
$color-border: $gray-300;
```

### WCAG AA Contrast Requirements

All color combinations must meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text** (18pt+ or 14pt+ bold): 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

```scss
// Example: Verify contrast
// Background: #ffffff (white)
// Foreground: #6c757d (gray-600)
// Contrast: 4.54:1 ✓ Passes AA for normal text

.compliant-text {
  color: #6c757d;      // gray-600
  background: #ffffff;  // white
}
```

### Contrast Testing
When adding new color tokens, include contrast test results:

```scss
// Token: $color-link-hover
// Value: #0052a3
// Background: #ffffff
// Contrast: 7.2:1 (AAA)
// Test: https://webaim.org/resources/contrastchecker/
```

## Typography

### Font Families
```scss
// From theme
$font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                   "Helvetica Neue", Arial, sans-serif;
$font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, 
                        "Liberation Mono", "Courier New", monospace;

// Headings
$headings-font-family: $font-family-base;
$headings-font-weight: 600;
```

### Font Sizes
```scss
$font-size-base: 1rem;        // 16px
$font-size-lg: 1.25rem;       // 20px
$font-size-sm: 0.875rem;      // 14px
$font-size-xs: 0.75rem;       // 12px

$h1-font-size: 2.5rem;        // 40px
$h2-font-size: 2rem;          // 32px
$h3-font-size: 1.75rem;       // 28px
$h4-font-size: 1.5rem;        // 24px
$h5-font-size: 1.25rem;       // 20px
$h6-font-size: 1rem;          // 16px
```

### Line Heights
```scss
$line-height-base: 1.5;
$line-height-sm: 1.25;
$line-height-lg: 1.75;

$headings-line-height: 1.2;
```

## Spacing System

### Spacing Scale
```scss
$spacer: 1rem; // 16px

$spacers: (
  0: 0,
  1: ($spacer * 0.25),  // 4px
  2: ($spacer * 0.5),   // 8px
  3: $spacer,           // 16px
  4: ($spacer * 1.5),   // 24px
  5: ($spacer * 3),     // 48px
  6: ($spacer * 4),     // 64px
  7: ($spacer * 5),     // 80px
);
```

### Utility Classes
```scss
// Margin utilities
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 1rem; }

// Padding utilities
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }

// Directional spacing
.mt-3 { margin-top: 1rem; }
.mb-3 { margin-bottom: 1rem; }
.pt-3 { padding-top: 1rem; }
.pb-3 { padding-bottom: 1rem; }
```

## Responsive Design

### Breakpoints
```scss
// Bootstrap breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### Media Queries
```scss
// Mobile-first approach
.component {
  // Base styles (mobile)
  padding: 1rem;
  
  // Tablet and up
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  // Desktop and up
  @media (min-width: 992px) {
    padding: 3rem;
  }
}
```

### Bootstrap Mixins
```scss
// Using Bootstrap breakpoint mixins
@import "bootstrap/scss/mixins/breakpoints";

.component {
  @include media-breakpoint-up(sm) {
    // Styles for small screens and up
  }
  
  @include media-breakpoint-down(md) {
    // Styles for medium screens and down
  }
  
  @include media-breakpoint-between(md, lg) {
    // Styles for medium to large screens only
  }
}
```

## Component Styling Patterns

### BEM Methodology
```scss
// Block
.card {
  border: 1px solid $gray-300;
  border-radius: 0.25rem;
  
  // Element
  &__header {
    padding: 1rem;
    border-bottom: 1px solid $gray-300;
  }
  
  &__body {
    padding: 1rem;
  }
  
  &__footer {
    padding: 1rem;
    border-top: 1px solid $gray-300;
  }
  
  // Modifier
  &--highlighted {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }
}
```

### Scoped Component Styles
```scss
// Keep component styles scoped to logical classes
.boardroom-chat {
  // Component container styles
  
  .chat-message {
    // Child element specific to this component
  }
  
  .chat-input {
    // Another child element
  }
}

// Avoid global selectors in component files
// ❌ BAD
p { color: red; }

// ✓ GOOD
.boardroom-chat p { color: $gray-900; }
```

### Utility Classes
```scss
// Prefer utility classes over custom styles
// utilities.scss

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }

.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }

.flex-column { flex-direction: column; }
.flex-row { flex-direction: row; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }
```

## Page-Specific Styles

### Page Partial Pattern
Each page directory should have a corresponding SCSS partial.

**File**: `_sass/pages/_boardroom.scss`

```scss
// Boardroom page styles
.boardroom-page {
  // Page-specific container styles
  
  .boardroom-header {
    // Header styles specific to boardroom page
  }
  
  .boardroom-main-row {
    // Main layout row
    display: flex;
    gap: 1rem;
    
    @include media-breakpoint-down(md) {
      flex-direction: column;
    }
  }
}
```

### Page Class Naming
- Prefix with page identifier: `.boardroom-page`, `.dashboard-page`
- Avoid generic names: `.container`, `.header`, `.main`
- Be specific to avoid conflicts

## Vendor Styles

### Vendor Directory
**Location**: `_sass/vendor/`

Place third-party CSS/SCSS here, isolated from custom styles.

### Vendor Import Pattern
```scss
// _main.scss
// Import vendors after theme but before local overrides
@import "vendor/plugin-name";
```

### Vendor Documentation
Document vendor files with:
- Source URL
- Version number
- License information
- Last updated date

```scss
/**
 * Plugin Name v1.2.3
 * Source: https://example.com/plugin
 * License: MIT
 * Last Updated: 2024-01-15
 */
```

## Mixins & Functions

### Common Mixins
```scss
// Clearfix
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

// Truncate text
@mixin text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Custom scrollbar
@mixin custom-scrollbar($width: 8px, $track-color: $gray-200, $thumb-color: $gray-400) {
  &::-webkit-scrollbar {
    width: $width;
  }
  &::-webkit-scrollbar-track {
    background: $track-color;
  }
  &::-webkit-scrollbar-thumb {
    background: $thumb-color;
    border-radius: $width / 2;
  }
}
```

### Using Mixins
```scss
.component {
  @include clearfix;
  
  .scrollable {
    @include custom-scrollbar(10px, $gray-100, $primary);
  }
}
```

## Best Practices

### Selector Specificity
- Keep specificity low (avoid deep nesting)
- Prefer classes over IDs
- Avoid `!important` (except for utilities)
- Maximum nesting depth: 3-4 levels

```scss
// ❌ Too specific
.page .container .row .col .card .header .title { }

// ✓ Better
.card__header-title { }
```

### Avoid Deep Nesting
```scss
// ❌ BAD (> 4 levels deep)
.boardroom {
  .chat {
    .message {
      .content {
        .text {
          color: $gray-900;
        }
      }
    }
  }
}

// ✓ GOOD (flat structure)
.boardroom-message-text {
  color: $gray-900;
}
```

### Use Variables
```scss
// ❌ Magic numbers
.component {
  padding: 16px;
  margin: 24px;
  border-radius: 8px;
}

// ✓ Variables
.component {
  padding: $spacer;
  margin: $spacer * 1.5;
  border-radius: $border-radius;
}
```

### Mobile-First Approach
```scss
// ✓ Mobile-first (recommended)
.component {
  // Base mobile styles
  font-size: 14px;
  
  @include media-breakpoint-up(md) {
    // Tablet styles
    font-size: 16px;
  }
  
  @include media-breakpoint-up(lg) {
    // Desktop styles
    font-size: 18px;
  }
}
```

### Avoid @extend
Use `@extend` sparingly. It can lead to bloated CSS and maintainability issues.

```scss
// ⚠️ Use with caution
.btn {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.btn-primary {
  @extend .btn;  // Document rationale in header
  background-color: $primary;
  color: $white;
}

// ✓ Better: Use mixins or utility classes
@mixin btn-base {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.btn-primary {
  @include btn-base;
  background-color: $primary;
  color: $white;
}
```

## Forbidden Patterns

### ❌ Inline Styles
Never use inline styles in HTML. All styling in SCSS files.

### ❌ Global Element Selectors in Components
```scss
// ❌ Don't style global elements in component files
p { color: red; }
a { text-decoration: none; }

// ✓ Scope to component
.boardroom-chat p { color: $gray-900; }
.boardroom-chat a { text-decoration: none; }
```

### ❌ CSS Files
Don't create `.css` files. Use `.scss` only.

### ❌ Important Overuse
```scss
// ❌ Avoid
.component {
  color: red !important;
  margin: 10px !important;
}

// ✓ Fix specificity instead
.component {
  color: red;
  margin: 10px;
}
```

## Performance Optimization

### Minimize Output
- Remove unused styles
- Combine similar rules
- Use shorthand properties

### CSS Compilation
- Jekyll compiles SCSS automatically
- Minification in production
- Source maps for development

### File Organization
- One concern per file
- Related partials in directories
- Import order matters (cascade)

## Documentation

### File Headers
```scss
/**
 * Boardroom Chat Component
 * 
 * Styles for the real-time chat interface in the boardroom.
 * Includes message bubbles, input area, and sidebar.
 * 
 * Dependencies:
 * - Bootstrap grid
 * - Theme variables
 * 
 * @since 1.0.0
 */
```

### Comment Complex Logic
```scss
// Calculate responsive padding based on viewport
// Uses viewport width units for fluid scaling
.component {
  padding: calc(1rem + 1vw);
}
```

### Maintain README
Each major directory (`components/`, `pages/`) should have a `README.md` explaining the structure and conventions.
