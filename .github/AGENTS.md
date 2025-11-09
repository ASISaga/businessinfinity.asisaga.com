# Copilot Agent Procedural Rules for businessinfinity.asisaga.com

## Agent Responsibilities
- Enforce accessibility-first development (WCAG AA, semantic HTML, ARIA)
- Ensure mobile-first, responsive design for all UI
- Validate all color and contrast rules for new components/pages
- Require one custom SCSS class per element, kebab-case naming
- Require matching SCSS partials for every custom include/component
- Require JS modules to import theme's `common.js` first, then subdomain JS
- Require descriptive comments and JSDoc for all JS/SCSS
- Require event delegation and accessibility for interactive JS
- Require all interactive elements to have minimum 44px touch targets
- Require all images to have meaningful alt attributes
- Require all form inputs to have associated labels
- Require skip navigation as first focusable element
- Require focus indicators for all interactive elements
- Require no horizontal scrolling at any breakpoint
- Require font sizes >= 16px
- Require no use of @extend in SCSS
- Require all grid containers to be responsive
- Require all layout containers to use CSS containment and isolation

## Agent Workflow
1. For every new UI component, check for matching SCSS partial and accessibility compliance
2. For every new JS module, check import chain and event delegation
3. For every new page, validate main/banner/footer landmarks and skip navigation
4. For every color/contrast change, verify WCAG AA compliance
5. For every structure change, update `website_structure.json`
6. For every Copilot Agent run, review and improve AGENTS.md as needed


## Agent Enforcement
- Block changes that violate accessibility, responsive, or theme inheritance rules
- Flag missing SCSS partials, JS import chains, or accessibility violations
- Require descriptive comments and documentation for all new code
- Block changes that override theme head, navigation, or footer unless necessary
- Block direct CSS edits (require SCSS partials)
- Block unnecessary copying of theme files
