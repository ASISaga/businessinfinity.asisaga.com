# Business Infinity

Frontend for the Business Infinity app - A conversational boardroom interface for AI-powered business governance.

## Overview

This repository hosts the **businessinfinity.asisaga.com** subdomain, deployed on GitHub Pages and integrated with backend services on Azure Functions. The site serves as both a documentation hub and the Boardroom interface where onboarding, governance, and collaboration occur.

## Technology Stack

- **Static Site Generator**: Jekyll (Liquid templates, Markdown content)
- **Remote Theme**: [ASISaga/theme.asisaga.com](https://github.com/ASISaga/theme.asisaga.com) v4.0 "Ontological Transcendence"
- **Design System**: Genesis Ontological SCSS - 100% ontological mixins, ZERO raw CSS
- **JavaScript**: ES6+ modules and Web Components
- **Backend**: Azure Functions at cloud.businessinfinity.asisaga.com
- **Deployment**: GitHub Pages

## Genesis Ontological SCSS Design System

This repository uses the **Genesis Ontological SCSS Design System** exclusively (v4.0 - "Ontological Transcendence").

**Status**: ✅ Fully migrated - Bootstrap removed, 100% ontological

### Core Ontological Mixins

- `genesis-environment()` - Container and layout structures
- `genesis-entity()` - Individual UI elements (buttons, cards, inputs)
- `genesis-cognition()` - Typography and text hierarchies
- `genesis-synapse()` - Interactions and transitions
- `genesis-state()` - State-based styling (hover, active, disabled)
- `genesis-atmosphere()` - Color themes and moods

### v4.0 Variants (Ontological Transcendence)

New variants: `transcendent`, `testimony`, `oracle`, `ephemeral`, `emerging`, `invoke`, `consent`, `sacred`, `convergent`

All SCSS uses ontological mixins exclusively - no raw CSS properties allowed.

## Theme Integration

The remote theme (`ASISaga/theme.asisaga.com`) provides:

### Shared Layouts
- `default`, `app`, `landing`, `article`, `dashboard`, `chatroom`, `form`, `search`, `profile`, `gallery`, `minimal`, `docs`, `faq`

### Shared Includes
- **Landing components**: `hero.html`, `cta.html`, `section-header.html`, `feature-grid.html`, `testimonial.html`
- **Chatroom components**: `chatroom/*`
- **UI components**: `components/*` (card, alert, breadcrumb, pagination, stat, tag-list, etc.)

### Page-Specific Includes (in this subdomain)
- `_includes/about/`, `_includes/features/`, `_includes/trust/`, `_includes/startup2/`, `_includes/boardroom/`, `_includes/index/`

## Web Components

Custom elements for dynamic functionality:
- `<boardroom-app>` - Complete boardroom application
- `<system-monitor>` - Real-time system monitoring
- `<agent-chat>` - Agent chat interface
- `<aos-status>` - Agent Operating System status
- `<boardroom-dashboard>` - Boardroom dashboard interface

## Documentation

- [Backend Integration Guide](docs/backend-integration.md) - Complete guide to the Business Infinity backend
- [Specifications](docs/specifications.md) - High-level technical specifications and architecture

## Getting Started

### Prerequisites

- Ruby 3.x
- Node.js 16+
- Bundler
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ASISaga/businessinfinity.asisaga.com.git
cd businessinfinity.asisaga.com
```

2. Install Ruby dependencies:
```bash
bundle install
```

3. Install Node dependencies:
```bash
npm install
```

4. Validate SCSS:
```bash
npm run validate
```

### Development

Run the Jekyll development server:
```bash
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`

### Validation

Run all SCSS validation tools:
```bash
npm run validate
```

This runs:
- `lint:scss` - Validates ontological mixin usage
- `lint:scss:style` - Style linting with stylelint
- `lint:scss:raw-css` - Ensures ZERO raw CSS properties
- `sass:compile` - Test SCSS compilation

Run individual validation:
```bash
npm run lint:scss           # Ontological mixin validation
npm run lint:scss:style     # Style linting
npm run lint:scss:raw-css   # Raw CSS detection
npm run sass:compile        # Compilation test
```

## Project Structure

```
.
├── _includes/          # Page-specific Liquid snippets
├── _sass/              # Ontological SCSS modules
├── assets/             # JavaScript, CSS, images
│   └── js/             # ES6 modules
│       ├── boardroom/  # Boardroom-specific logic
│       ├── dashboard/  # Dashboard functionality
│       └── mentor/     # Mentor mode
├── client/             # Standalone web components
├── components/         # HTML templates for web components
├── docs/               # Documentation and specifications
└── .github/            # GitHub Actions workflows
```

## Backend Integration

- **Backend Repository**: [ASISaga/BusinessInfinity](https://github.com/ASISaga/BusinessInfinity)
- **Infrastructure**: [ASISaga/AgentOperatingSystem](https://github.com/ASISaga/AgentOperatingSystem)
- **Backend API**: `cloud.businessinfinity.asisaga.com`
- **OpenAPI Specification**: `/api/openapi.json`
- **Authentication**: Azure AD (Entra ID)
- See [Backend Integration Guide](docs/backend-integration.md) for complete documentation

## Quality Covenant

Every contribution must uphold:
- **Ontological Purity**: 100% ontological mixins, ZERO raw CSS
- **Legibility**: Clear and maintainable code
- **Accessibility**: WCAG AA compliance
- **Resilience**: Graceful degradation
- **Consistency**: Genesis Design System patterns
- **Covenant Compliance**: Schema-validated interactions

## Contributing

1. Create a feature branch
2. Make your changes using ontological mixins only
3. Run validation: `npm run validate`
4. Ensure documentation is updated
5. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues or questions, open an issue on GitHub.