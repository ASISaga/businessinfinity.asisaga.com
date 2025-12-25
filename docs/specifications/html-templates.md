# HTML & Liquid Templates Specification

## Overview

Business Infinity uses Jekyll with Liquid templating for dynamic HTML generation. Templates follow semantic HTML5 standards with strong accessibility requirements and integration with the shared theme.

## Template Hierarchy

### Layouts
Layouts define the overall page structure and are inherited from the theme repository.

- **default**: Standard page layout with header, navigation, main content, footer
- **app**: Application layout for interactive pages (boardroom, dashboard)
- **minimal**: Simplified layout for focused experiences

### Layout Usage
```liquid
---
layout: default
title: Page Title
description: Page description for SEO
---

<!-- Page content here -->
```

## Liquid Templating

### Variable Access

#### Site Variables
```liquid
{{ site.title }}              # Site title from _config.yml
{{ site.description }}        # Site description
{{ site.url }}               # Site base URL
{{ site.data.nav.navigation }} # Navigation from _data/nav.json
```

#### Page Variables
```liquid
{{ page.title }}             # Page-specific title
{{ page.description }}       # Page description
{{ page.layout }}            # Current layout
{{ page.url }}              # Page URL path
```

#### Data Files
```liquid
{% assign product = site.data.business_infinity %}
{{ product.title }}          # Access YAML data
{{ product.features[0].title }} # Access array items
```

### Control Flow

#### Conditionals
```liquid
{% if page.boardroom.show_avatar %}
  <img src="{{ avatar_url }}" alt="User avatar">
{% endif %}

{% unless page.hide_footer %}
  {% include footer.html %}
{% endunless %}
```

#### Loops
```liquid
{% for item in product.features %}
  <div class="feature">
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
  </div>
{% endfor %}
```

#### Case Statements
```liquid
{% case page.layout %}
  {% when 'default' %}
    <!-- Default layout content -->
  {% when 'app' %}
    <!-- App layout content -->
  {% else %}
    <!-- Fallback content -->
{% endcase %}
```

### Filters

#### String Manipulation
```liquid
{{ page.title | upcase }}           # UPPERCASE
{{ page.title | downcase }}         # lowercase
{{ page.title | capitalize }}       # Capitalize first letter
{{ page.description | truncate: 160 }} # Limit length
{{ content | strip_html }}          # Remove HTML tags
```

#### URL Handling
```liquid
{{ "/assets/js/app.js" | relative_url }} # Add base URL
{{ page.url | absolute_url }}            # Full URL with domain
```

#### Array Operations
```liquid
{{ site.pages | where: "layout", "default" }} # Filter pages
{{ product.features | sort: "title" }}        # Sort items
{{ items | first }}                           # Get first item
{{ items | last }}                            # Get last item
```

## Include System

### Basic Includes
```liquid
{% include header.html %}
{% include components/card.html %}
```

### Includes with Parameters
```liquid
{% include components/button.html
  text="Click Me"
  url="/dashboard"
  style="primary"
%}
```

### Cached Includes
```liquid
{% include_cached navigation.html %}
```
Note: Use for expensive operations that don't change per page.

## Component Includes

### Boardroom Components

#### Chat Area
```liquid
{% include boardroom/chat-area.html %}
```

**Location**: `_includes/boardroom/chat-area.html`

**Sub-components**:
- `boardroom/chat-area/header.html` - Chat header with title and status
- `boardroom/chat-area/footer.html` - Message input and controls
- `boardroom/chat-area/empty-state.html` - No messages placeholder

#### Members Sidebar
```liquid
{% include boardroom/members-sidebar.html %}
```

**Location**: `_includes/boardroom/members-sidebar.html`

**Sub-components**:
- `boardroom/members-sidebar/header.html` - Sidebar header
- `boardroom/members-sidebar/search-form.html` - Member search
- `boardroom/members-sidebar/empty-state.html` - No members placeholder

#### Toggle Strip
```liquid
{% include boardroom/toggle-strip.html %}
```

**Location**: `_includes/boardroom/toggle-strip.html`

**Purpose**: Control visibility of sidebar and other UI elements

### Index Page Components

#### Hero Section
```liquid
{% include index/hero.html %}
```

**Purpose**: Landing page hero with title, description, CTA

#### Features Section
```liquid
{% include index/features.html %}
```

**Purpose**: Feature grid from `site.data.business_infinity.features`

#### Quick Links
```liquid
{% include index/quick-links.html %}
```

**Purpose**: Navigation shortcuts to key sections

#### Use Cases
```liquid
{% include index/use_cases.html %}
```

**Purpose**: Display target audience segments

#### Testimonials
```liquid
{% include index/testimonials.html %}
```

**Purpose**: Customer testimonials and reviews

#### Call to Action
```liquid
{% include index/cta.html %}
```

**Purpose**: Conversion-focused section with button

## Semantic HTML5 Structure

### Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} | {{ site.title }}</title>
  <meta name="description" content="{{ page.description }}">
</head>
<body>
  <header>
    <nav aria-label="Main navigation">
      <!-- Navigation -->
    </nav>
  </header>
  
  <main id="main-content">
    <!-- Page content -->
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Semantic Elements

#### Sectioning
- `<header>`: Page or section header
- `<nav>`: Navigation menus
- `<main>`: Primary page content
- `<section>`: Thematic grouping of content
- `<article>`: Self-contained composition
- `<aside>`: Tangentially related content
- `<footer>`: Page or section footer

#### Grouping
- `<div>`: Generic container (when semantic element doesn't fit)
- `<ul>`, `<ol>`, `<li>`: Lists
- `<figure>`, `<figcaption>`: Images with captions
- `<blockquote>`: Quotations

#### Text
- `<h1>` to `<h6>`: Headings (hierarchical)
- `<p>`: Paragraphs
- `<strong>`: Strong importance
- `<em>`: Emphasis
- `<code>`: Code snippets
- `<pre>`: Preformatted text

## Accessibility Requirements

### ARIA Landmarks
```html
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main role="main" id="main-content">
  <!-- Main content -->
</main>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

### ARIA Labels
```html
<!-- Descriptive labels for screen readers -->
<button aria-label="Close dialog">×</button>
<input type="search" aria-label="Search members">

<!-- Label associations -->
<label for="username">Username:</label>
<input type="text" id="username" name="username">

<!-- Required fields -->
<input type="email" aria-required="true" required>
```

### ARIA States
```html
<!-- Expanded/collapsed state -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<div id="menu" aria-hidden="true">
  <!-- Menu content -->
</div>

<!-- Selected state -->
<li role="option" aria-selected="true">Selected Item</li>

<!-- Disabled state -->
<button aria-disabled="true" disabled>Disabled Button</button>
```

### Keyboard Navigation
```html
<!-- Focus management -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Tab order -->
<button tabindex="0">First</button>
<button tabindex="0">Second</button>

<!-- Focus trap in modals -->
<div role="dialog" aria-modal="true">
  <!-- Modal content -->
</div>
```

### Image Accessibility
```html
<!-- Decorative images -->
<img src="decoration.svg" alt="" role="presentation">

<!-- Informative images -->
<img src="chart.png" alt="Sales increased 40% in Q3">

<!-- Complex images -->
<figure>
  <img src="infographic.png" alt="Business growth infographic">
  <figcaption>Detailed description of the infographic data...</figcaption>
</figure>
```

## Form Patterns

### Basic Form
```html
<form method="post" action="/api/submit">
  <fieldset>
    <legend>Contact Information</legend>
    
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <button type="submit">Submit</button>
  </fieldset>
</form>
```

### Form Validation
```html
<form novalidate>
  <label for="username">Username:</label>
  <input 
    type="text" 
    id="username" 
    name="username"
    required
    pattern="[a-zA-Z0-9]{3,16}"
    aria-describedby="username-help"
  >
  <span id="username-help" class="help-text">
    3-16 alphanumeric characters
  </span>
  <span class="error" role="alert"></span>
</form>
```

## Web Components Integration

### Custom Element Usage
```html
<!-- Boardroom Chat Component -->
<boardroom-chat
  boardroom-id="business-infinity"
  conversation-id="default"
  api-host="https://cloud.businessinfinity.asisaga.com"
></boardroom-chat>

<!-- Dashboard Component -->
<mcp-dashboard
  role="CMO"
  scope="local"
></mcp-dashboard>

<!-- Boardroom App Container -->
<boardroom-app
  title="Boardroom"
  show-avatar
  show-toolbar
  auto-refresh
  refresh-interval="3000"
>
  <!-- Nested content -->
</boardroom-app>
```

### Component Attributes
- **Boolean attributes**: Presence indicates `true`
- **String attributes**: Pass data as strings
- **Kebab-case**: Use for multi-word attributes
- **Data attributes**: Prefix with `data-` for custom data

## SEO & Meta Tags

### Required Meta Tags
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} | Business Infinity</title>
  <meta name="description" content="{{ page.description }}">
  <meta name="keywords" content="{{ page.keywords }}">
  <link rel="canonical" href="{{ page.url | absolute_url }}">
</head>
```

### Open Graph Tags
```html
<meta property="og:type" content="website">
<meta property="og:title" content="{{ page.title }}">
<meta property="og:description" content="{{ page.description }}">
<meta property="og:image" content="{{ page.image | absolute_url }}">
<meta property="og:url" content="{{ page.url | absolute_url }}">
```

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ page.title }}">
<meta name="twitter:description" content="{{ page.description }}">
<meta name="twitter:image" content="{{ page.image | absolute_url }}">
```

## Forbidden Patterns

### ❌ Inline Styles
```html
<!-- DON'T -->
<div style="color: red; margin: 10px;">Content</div>

<!-- DO -->
<div class="alert-danger">Content</div>
```

### ❌ Inline Scripts
```html
<!-- DON'T -->
<script>
  function doSomething() { /* ... */ }
</script>

<!-- DO -->
<script src="/assets/js/app.js" defer></script>
```

### ❌ Inline Event Handlers
```html
<!-- DON'T -->
<button onclick="handleClick()">Click Me</button>

<!-- DO -->
<button class="action-button" data-action="submit">Click Me</button>
<!-- Event listener in external JS file -->
```

### ❌ Non-semantic Markup
```html
<!-- DON'T -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- DO -->
<header>
  <nav>...</nav>
</header>
```

## Best Practices

### Keep Templates Thin
- Minimal logic in templates
- Complex operations in data files or JavaScript
- Use includes for reusable components

### Consistent Naming
- Lowercase with hyphens for files: `chat-area.html`
- Descriptive names: `boardroom-toggle-strip.html`
- Group related includes in directories

### Documentation
- Comment complex Liquid logic
- Document include parameters
- Maintain README in include directories

### Performance
- Use `include_cached` for expensive operations
- Minimize nested includes
- Lazy load heavy components

### Accessibility First
- Semantic HTML by default
- ARIA only when necessary
- Test with screen readers
- Ensure keyboard navigation
