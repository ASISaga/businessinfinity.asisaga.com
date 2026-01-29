---
layout: docs
title: Architecture Specification
description: System architecture, technology stack, and deployment overview
search: true
breadcrumbs:
  - title: Docs
    url: /docs/
  - title: Specifications
    url: /docs/specifications/
next:
  title: HTML & Templates
  url: /docs/specifications/html-templates.html
---

## Overview

Business Infinity is a Jekyll-based static site deployed on GitHub Pages, integrated with Azure Functions backend services. The architecture follows a modern JAMstack approach with clear separation between presentation (static site) and business logic (serverless functions).

## Technology Stack

### Static Site Generation
- **Jekyll 4.x**: Static site generator with Liquid templating
- **GitHub Pages**: Hosting and deployment platform
- **Remote Theme**: `ASISaga/theme.asisaga.com` for shared components

### Frontend Technologies
- **HTML5**: Semantic, accessible markup
- **SCSS/CSS3**: Modular styling with Bootstrap framework
- **JavaScript ES6+**: Modern, module-based scripting
- **Web Components**: Custom elements with Shadow DOM
- **Bootstrap 5.x**: Responsive grid and UI components

### Backend Integration
- **Azure Functions**: Serverless backend at `cloud.businessinfinity.asisaga.com`
- **OpenAPI 3.0**: API specification and documentation
- **Azure AD**: Authentication and authorization
- **REST API**: RESTful endpoints for data operations

### Testing & Quality
- **Playwright**: Browser automation and testing
- **Node.js**: Development tooling and build processes
- **GitHub Actions**: CI/CD automation

## Repository Structure

```
businessinfinity.asisaga.com/
├── _config.yml                 # Jekyll configuration
├── _data/                      # YAML/JSON data files
│   ├── business_infinity.yml   # Product content
│   ├── nav.json               # Navigation structure
│   └── products.yml           # Product catalog
├── _includes/                  # Reusable Liquid snippets
│   ├── boardroom/             # Boardroom components
│   ├── index/                 # Homepage sections
│   ├── startup2/              # Startup page sections
│   └── [other sections]/      # Feature-specific includes
├── _sass/                      # SCSS modules
│   ├── _main.scss             # Main SCSS entry point
│   ├── components/            # Component styles
│   │   ├── boardroom/         # Boardroom-specific styles
│   │   ├── ui-utilities.scss  # Utility classes
│   │   └── quick-links.scss   # Quick links component
│   ├── pages/                 # Page-specific styles
│   │   ├── _boardroom.scss    # Boardroom page
│   │   ├── _dashboard.scss    # Dashboard page
│   │   └── [other pages]      # Additional page styles
│   └── sections/              # Section styles
├── assets/                     # Static assets
│   ├── css/                   # Compiled CSS output
│   ├── data/                  # Static JSON data
│   │   ├── conversation.json  # Sample conversation data
│   │   ├── members.json       # Boardroom members
│   │   └── openapi.json       # OpenAPI specification cache
│   ├── js/                    # JavaScript modules
│   │   ├── boardroom/         # Boardroom logic
│   │   ├── dashboard/         # Dashboard functionality
│   │   ├── mentor/            # Mentor mode
│   │   ├── network/           # Network features
│   │   ├── framework/         # Decision framework
│   │   ├── apiRoutes.js       # API routing helpers
│   │   ├── config.js          # Configuration
│   │   └── openapi-loader.js  # OpenAPI spec loader
│   └── svg/                   # SVG icons and graphics
├── client/                     # Standalone web components
│   ├── BoardroomChat.js       # Chat component
│   ├── McpDashboard.js        # Dashboard component
│   ├── AmlDemo.js             # Azure ML demo
│   └── main.js                # Component registration
├── components/                 # Web component templates
├── docs/                       # Documentation
│   ├── specifications/        # Detailed specifications
│   └── [other docs]           # Additional documentation
├── [page directories]/         # Content pages
│   ├── boardroom/
│   ├── dashboard/
│   ├── mentor/
│   └── [others]/
├── .github/                    # GitHub configuration
│   ├── instructions/          # Coding guidelines
│   │   ├── architecture.instructions.md
│   │   ├── html.instructions.md
│   │   ├── scss.instructions.md
│   │   └── js.instructions.md
│   └── workflows/             # CI/CD workflows
└── package.json               # Node.js dependencies
```

## Theme Integration

### Remote Theme Usage
- **Theme Repository**: `ASISaga/theme.asisaga.com`
- **Integration Method**: Jekyll remote theme plugin
- **Shared Components**: Layouts, includes, base SCSS, common assets

### Subdomain Customization
- **Override Pattern**: Local files override theme files with same path
- **Custom Includes**: Subdomain-specific components in `_includes/`
- **Custom SCSS**: Additional styles in `_sass/` imported after theme
- **Asset Override**: Local assets take precedence over theme assets

### Theme Coordination
- **Breaking Changes**: Require coordinated PRs across repositories
- **Version Management**: Theme changes documented in changelog
- **Migration Path**: Gradual deprecation with compatibility notes

## Build & Deployment

### Local Development
```bash
# Install dependencies
bundle install
npm install

# Start Jekyll server
bundle exec jekyll serve

# Site available at http://localhost:4000
```

### Production Build
```bash
# Jekyll builds automatically on GitHub Pages
# Triggered by push to main branch
# Build configuration in _config.yml
```

### CI/CD Pipeline
1. **Code Push**: Developer pushes to feature branch
2. **GitHub Actions**: Automated tests run (Playwright suite)
3. **Pull Request**: Code review and approval
4. **Merge to Main**: Automatic deployment to GitHub Pages
5. **DNS**: CNAME record points to GitHub Pages

## API Integration Architecture

### Backend Services
- **Host**: `cloud.businessinfinity.asisaga.com`
- **Protocol**: HTTPS with Azure AD authentication
- **Specification**: OpenAPI 3.0 at `/openapi.json`
- **Operations**: Dynamic resolution by `operationId`

### Frontend API Layer
- **OpenAPI Loader**: Fetches and caches API specification
- **API Routes Helper**: Builds URLs from spec and operation IDs
- **Auth Helper**: Manages Azure AD tokens and headers
- **Error Handling**: Graceful degradation on API failures

### Data Flow
1. **Page Load**: Web component initializes
2. **Spec Load**: OpenAPI specification fetched if not cached
3. **Operation Resolve**: `operationId` mapped to endpoint path
4. **Request Build**: URL constructed with parameters
5. **Auth**: Azure AD token added to headers
6. **Fetch**: HTTP request sent to backend
7. **Response**: Data parsed and rendered in component
8. **Error**: Fallback UI shown on failure

## Web Components Architecture

### Component Structure
- **Custom Elements**: Extend `HTMLElement` with Shadow DOM
- **Template Loading**: HTML templates fetched from `/components/`
- **Style Encapsulation**: Scoped styles within Shadow DOM
- **Event Handling**: Lifecycle hooks for initialization and cleanup

### Component Registry
- `<boardroom-chat>`: Real-time chat with message polling
- `<mcp-dashboard>`: Role-based dashboard with dynamic forms
- `<aml-demo>`: Azure ML integration component
- `<boardroom-app>`: Main boardroom application container
- `<sidebar-element>`: Collapsible sidebar navigation
- `<dashboard-panel>`: Dashboard panel container
- `<mentor-element>`: Mentor content display

### Lifecycle Management
```javascript
// Component lifecycle
connectedCallback()    // Called when element added to DOM
disconnectedCallback() // Called when element removed from DOM
attributeChangedCallback() // Called when attributes change
```

## Security Architecture

### Frontend Security
- **XSS Prevention**: HTML escaping in all user-generated content
- **CSP Headers**: Content Security Policy via GitHub Pages
- **HTTPS Only**: All connections encrypted
- **Input Validation**: Client-side validation before API calls

### API Security
- **Authentication**: Azure AD OAuth 2.0 tokens
- **Authorization**: Role-based access control (RBAC)
- **CORS**: Configured for subdomain access only
- **Rate Limiting**: Backend throttling for abuse prevention

### Data Security
- **No Secrets**: No API keys or secrets in frontend code
- **Secure Storage**: Tokens in session/local storage with expiry
- **GDPR Compliance**: Privacy policy and data handling guidelines
- **Audit Logging**: Backend logs all critical operations

## Performance Architecture

### Optimization Strategies
- **Static Generation**: Pre-built HTML for fast initial load
- **Code Splitting**: Modular JavaScript with ES6 imports
- **CSS Minification**: SCSS compiled and compressed
- **Asset Caching**: Long-lived cache headers for static assets
- **Lazy Loading**: Images and components loaded on demand
- **CDN**: Bootstrap and icons from CDN (jsDelivr, Bootstrap CDN)

### Performance Targets
- **Initial Load**: < 2 seconds on 3G connection
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1 second
- **Lighthouse Score**: > 90 for Performance, Accessibility, Best Practices

## Scalability Considerations

### Frontend Scalability
- **Static Site**: Scales infinitely via GitHub Pages CDN
- **Component Reusability**: Shared components across pages
- **Modular Architecture**: Independent feature development
- **Progressive Enhancement**: Core functionality without JavaScript

### Backend Scalability
- **Serverless Functions**: Auto-scaling Azure Functions
- **Database**: Managed services with automatic scaling
- **Caching**: Redis cache for frequent queries
- **Load Balancing**: Azure Traffic Manager for global distribution

## Quality Covenant

### Code Quality
- **Legibility**: Clear, maintainable code with comments
- **Accessibility**: WCAG AA compliance required
- **Resilience**: Graceful degradation and error handling
- **Consistency**: Follow established patterns and conventions

### Development Standards
- **Code Review**: All changes require PR review
- **Testing**: Automated tests for all features
- **Documentation**: Updated with code changes
- **Version Control**: Semantic versioning for releases
