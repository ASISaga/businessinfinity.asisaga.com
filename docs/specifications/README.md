# Technical Specifications

This directory contains detailed technical specifications for the Business Infinity platform. Each specification document provides comprehensive information about a specific aspect of the architecture, implementation, and best practices.

## Specification Documents

### [Architecture Specification](./architecture.md)
**Overview of the entire system architecture**

- Technology stack and frameworks
- Repository structure and organization
- Theme integration and coordination
- Build and deployment processes
- API integration architecture
- Web components architecture
- Security architecture
- Performance optimization
- Scalability considerations
- Quality covenant

### [HTML & Liquid Templates](./html-templates.md)
**HTML structure and Liquid templating**

- Template hierarchy (layouts, includes)
- Liquid templating syntax and patterns
- Variable access and data files
- Control flow and filters
- Include system and component mapping
- Semantic HTML5 structure
- Accessibility requirements (WCAG AA)
- ARIA landmarks and labels
- SEO and meta tags
- Forbidden patterns and best practices

### [SCSS & Styling](./scss-styling.md)
**SCSS architecture and styling conventions**

- SCSS architecture and import chain
- Directory structure and organization
- Component-include mapping
- Theme variables and design tokens
- Color system with WCAG compliance
- Typography and spacing system
- Responsive design and breakpoints
- Component styling patterns (BEM)
- Page-specific styles
- Vendor styles management
- Mixins and functions
- Performance optimization

### [JavaScript & Web Components](./javascript-components.md)
**JavaScript modules and web components**

- JavaScript module system (ES6+)
- Entry points and directory structure
- Web component architecture
- Registered components:
  - BoardroomChat
  - McpDashboard
  - AmlDemo
  - BoardroomApp
  - SidebarElement
- Shadow DOM encapsulation
- API integration patterns
- Boardroom-specific logic
- Idempotent initialization
- Security patterns (XSS prevention)
- Forbidden patterns
- Vendor library management
- Performance optimization
- Error handling

### [API Integration](./api-integration.md)
**Backend API integration and communication**

- Backend architecture (Azure Functions)
- OpenAPI specification usage
- API operations:
  - Message operations
  - Agent operations
  - Dashboard operations
- Authentication (Azure AD OAuth 2.0)
- Role-based access control (RBAC)
- Request/response patterns
- Error handling
- Rate limiting
- Caching strategy
- Polling patterns
- Retry logic with exponential backoff
- WebSocket support (future)
- API testing and mocking

### [Data Structures](./data-structures.md)
**Data formats, schemas, and state management**

- Configuration data (Jekyll, navigation, products)
- Boardroom data (members, conversations, messages)
- API data structures (OpenAPI, dashboard UI schemas)
- Page front matter
- Component data attributes
- Application state management
- Local storage schema
- API request/response formats
- Validation schemas
- Constants and enumerations
- Runtime type checking

## Quick Reference

### File Organization
```
docs/specifications/
├── README.md                    # This file
├── architecture.md              # System architecture
├── html-templates.md            # HTML and Liquid
├── scss-styling.md              # SCSS and styling
├── javascript-components.md     # JavaScript and components
├── api-integration.md           # API integration
└── data-structures.md           # Data formats and schemas
```

### Key Concepts

#### Architecture Patterns
- **JAMstack**: Static site + serverless backend
- **Remote Theme**: Shared theme from `ASISaga/theme.asisaga.com`
- **Web Components**: Custom elements with Shadow DOM
- **ES6 Modules**: Modern JavaScript module system
- **OpenAPI**: API specification and documentation

#### Coding Standards
- **HTML**: Semantic HTML5, WCAG AA accessibility
- **SCSS**: BEM methodology, mobile-first, WCAG AA colors
- **JavaScript**: ES6+, no HTML-in-JS, XSS prevention
- **API**: RESTful, Azure AD auth, error handling

#### Best Practices
- **Accessibility**: WCAG AA compliance required
- **Security**: XSS prevention, input validation, HTTPS only
- **Performance**: < 2s load time, code splitting, caching
- **Testing**: Automated tests, visual regression, API tests
- **Documentation**: Code comments, JSDoc, README files

## Usage Guidelines

### For Developers

When working on the codebase:

1. **Choose the right specification**: Find the document that covers your area of work
2. **Follow the patterns**: Use the examples and patterns provided
3. **Check forbidden patterns**: Avoid anti-patterns explicitly called out
4. **Validate compliance**: Ensure your code meets the requirements
5. **Update documentation**: Keep specifications current with changes

### For Code Reviewers

When reviewing pull requests:

1. **Reference specifications**: Check code against relevant specs
2. **Verify patterns**: Ensure proper patterns are followed
3. **Check accessibility**: Validate WCAG AA compliance
4. **Security review**: Look for XSS vulnerabilities and security issues
5. **Performance check**: Ensure performance best practices

### For New Team Members

When onboarding:

1. **Start with architecture**: Understand the overall system
2. **Read relevant specs**: Focus on areas you'll work on
3. **Review examples**: Study code examples in specifications
4. **Ask questions**: Clarify anything unclear in specs
5. **Practice**: Apply patterns in small changes first

## Specification Updates

These specifications should be updated when:

- New patterns or conventions are established
- Technology stack changes
- Breaking changes are introduced
- Best practices evolve
- Common issues are identified

### Update Process

1. **Identify change**: Document what needs to update
2. **Draft update**: Write the specification change
3. **Review**: Get team approval
4. **Merge**: Update the specification
5. **Communicate**: Notify team of changes

## Related Documentation

### Project Documentation
- [Main README](../../README.md) - Project overview and setup
- [Test Plan](../test-plan.md) - Testing strategy and coverage
- [Agent Guide](../agent-guide.md) - AI agent development guide

### External Documentation
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Liquid Templating](https://shopify.github.io/liquid/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [OpenAPI Specification](https://swagger.io/specification/)

## Contributing

When contributing to these specifications:

1. **Be comprehensive**: Cover all aspects of the topic
2. **Provide examples**: Include code examples for patterns
3. **Show anti-patterns**: Document what NOT to do
4. **Be consistent**: Match the format and style of existing specs
5. **Keep current**: Update as implementation evolves

## Questions or Feedback

If you have questions about these specifications or suggestions for improvements:

1. Open an issue in the repository
2. Tag it with `documentation` label
3. Reference the specific specification document
4. Provide specific examples or use cases

---

**Last Updated**: 2024-12-25  
**Version**: 1.0.0  
**Maintainers**: ASI Saga Development Team
