# Business Infinity

Frontend for the Business Infinity app - A conversational boardroom interface for AI-powered business governance.

## Overview

This repository hosts the Business Infinity website, deployed on GitHub Pages and integrated with backend services on Azure Functions. The site serves as both a documentation hub and the Boardroom interface where onboarding, governance, and collaboration occur.

## Technology Stack

- **Static Site Generator**: Jekyll (Liquid templates, Markdown content)
- **Markup**: HTML5 (semantic, accessible structure)
- **Styling**: Genesis Ontological SCSS Design System (from ASI Saga theme)
- **Legacy Support**: Bootstrap compatibility layer (gradual migration)
- **JavaScript**: ES6+ (modular, standards-compliant)
- **Components**: Web Components (chat, dashboard, agents)
- **Testing**: Playwright (unit and integration tests)
- **Deployment**: GitHub Pages + Azure Functions

## SCSS Design System Migration

This repository uses the **Genesis Ontological SCSS Design System** from the [ASI Saga theme](https://github.com/ASISaga/theme.asisaga.com).

**Current Status**: ✅ Ontology system configured and ready for use

- ✅ Ontology system imported in `_sass/_main.scss`
- ✅ Instructions updated for ontological patterns
- ✅ Migration guide available: [ONTOLOGY_MIGRATION_GUIDE.md](ONTOLOGY_MIGRATION_GUIDE.md)
- ✅ Example components: `_sass/components/_example-ontology.scss`
- 🔄 Existing SCSS files use Bootstrap mixins (backward compatible)
- 🎯 All new development must use ontological mixins exclusively

**For Developers**: 
- Review [ONTOLOGY_MIGRATION_GUIDE.md](ONTOLOGY_MIGRATION_GUIDE.md) for complete migration workflow
- See `.github/instructions/scss.instructions.md` for ontological system rules
- Existing Bootstrap-based SCSS continues to work (backward compatible)

## Documentation

- **[Ontology Migration Guide](ONTOLOGY_MIGRATION_GUIDE.md)** - Complete guide to Genesis Ontological SCSS Design System migration
- **[SCSS Validation Implementation](SCSS_VALIDATION_IMPLEMENTATION.md)** - Guide to stylelint, sass compilation, and SCSS validation tools
- [SCSS Dependency Management](SCSS_DEPENDENCY_MANAGEMENT.md) - Guide to SCSS validation and theme dependencies
- [Backend Integration Guide](docs/backend-integration.md) - Complete guide to the Business Infinity backend
- [Specifications](docs/specifications.md) - High-level technical specifications and architecture
- [Detailed Specifications](docs/specifications/) - Comprehensive technical documentation:
  - [Architecture](docs/specifications/architecture.md) - System design and structure
  - [HTML & Liquid Templates](docs/specifications/html-templates.md) - Template patterns and accessibility
  - [SCSS & Styling](docs/specifications/scss-styling.md) - Styling architecture and theming
  - [JavaScript & Web Components](docs/specifications/javascript-components.md) - JS modules and components
  - [API Integration](docs/specifications/api-integration.md) - Backend API and authentication
  - [Data Structures](docs/specifications/data-structures.md) - Schemas and state management
- [Test Plan](docs/test-plan.md) - Comprehensive test coverage plan
- [Test Suite README](tests_playwright/README.md) - Testing setup and guidelines

## Getting Started

### Prerequisites

- Ruby 3.x
- Node.js 16+
- Bundler
- npm or yarn

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

4. Validate SCSS dependencies:
```bash
npm run validate
```

5. Install Playwright browsers:
```bash
npx playwright install
```

### Development

Run the Jekyll development server:
```bash
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`

### Testing

**SCSS Validation** (New as of 2026-01):

Run all SCSS validation tools:
```bash
npm run validate
```

This runs:
- `lint:scss` - Validates theme dependencies (mixins, variables)
- `lint:scss:style` - Style linting with stylelint
- `sass:compile` - Test SCSS compilation

Run individual validation:
```bash
npm run lint:scss         # Dependency validation
npm run lint:scss:style   # Style linting
npm run sass:compile      # Compilation test
```

Auto-fix style issues:
```bash
npx stylelint "_sass/**/*.scss" --fix
```

**Playwright Tests**:

Run all tests:
```bash
npm test
```

Run tests in UI mode:
```bash
npm run test:ui
```

See [tests_playwright/README.md](tests_playwright/README.md) for detailed testing documentation.

## Project Structure

```
.
├── _includes/          # Reusable Liquid snippets
├── _sass/              # SCSS modules and components
├── assets/             # JavaScript, CSS, images
│   └── js/             # ES6 modules
│       ├── boardroom/  # Boardroom-specific logic
│       ├── dashboard/  # Dashboard functionality
│       └── mentor/     # Mentor mode
├── client/             # Standalone web components
├── components/         # HTML templates for web components
├── docs/               # Documentation
├── tests_playwright/   # Playwright test suite
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── fixtures/       # Test helpers
└── .github/            # GitHub Actions workflows
```

## Key Features

### Boardroom Chat Interface
- Real-time messaging with 5-second polling
- Role-based agent interactions
- Schema-validated covenant compliance
- Threading for sagas and arbitration

### Web Components
- `<boardroom-chat>` - Real-time chat with message polling
- `<mcp-dashboard>` - Role-based dashboard with dynamic forms
- `<aml-demo>` - Azure ML integration
- `<sidebar-element>`, `<dashboard-panel>`, `<mentor-element>`, `<boardroom-app>`

### Backend Integration
- **Backend Repository**: [ASISaga/BusinessInfinity](https://github.com/ASISaga/BusinessInfinity)
- **Infrastructure**: [ASISaga/AgentOperatingSystem](https://github.com/ASISaga/AgentOperatingSystem)
- **Backend API**: `cloud.businessinfinity.asisaga.com`
- **OpenAPI Specification**: `/api/openapi.json`
- **Authentication**: Azure AD (Entra ID)
- **Features**: Strategic decisions, workflows, trust & compliance, agent management
- See [Backend Integration Guide](docs/backend-integration.md) for complete documentation

## Quality Covenant

Every contribution must uphold:
- **Legibility**: Clear and maintainable code
- **Accessibility**: WCAG AA compliance
- **Resilience**: Graceful degradation
- **Consistency**: SCSS variables, Bootstrap conventions
- **Covenant Compliance**: Schema-validated interactions

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Ensure documentation is updated
5. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues or questions, open an issue on GitHub.