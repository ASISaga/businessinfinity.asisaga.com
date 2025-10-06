# Playwright Test Suite

This directory contains unit and integration tests for the Business Infinity website using Playwright.

## Overview

The test suite validates:
- Core page functionality
- Navigation and layout
- Web components
- Accessibility (WCAG AA compliance)
- Performance metrics
- Boardroom chat interface
- API integration

## MCP Server Compatibility

These tests are designed to work with the Playwright MCP server in VS Code and with GitHub Copilot coding agents:

- **Single Browser**: Tests run on Chromium by default to optimize for MCP server performance
- **Flexible Base URL**: Tests work with any base URL via `BASE_URL` environment variable
- **Comprehensive Timeouts**: Proper timeout configurations for reliable execution
- **Error Filtering**: Known external errors are filtered to reduce noise
- **Test Isolation**: Each test is independent and can run in isolation
- **Best Practices**: Following Playwright best practices for maintainability

## Directory Structure

```
tests_playwright/
├── unit/                  # Unit tests for individual components
│   ├── boardroom-chat.spec.js
│   └── web-components.spec.js
├── integration/           # Integration tests for user flows
│   ├── core-pages.spec.js
│   ├── navigation.spec.js
│   ├── accessibility.spec.js
│   ├── performance.spec.js
│   └── boardroom.spec.js
└── fixtures/              # Test fixtures and helpers
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Jekyll (for local development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests_playwright/unit/boardroom-chat.spec.js
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run test:report
```

## Test Configuration

Tests are configured in `playwright.config.js`:

- **Base URL**: `http://localhost:4000` (Jekyll dev server)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

## Writing Tests

### Using Test Utilities

The `fixtures/test-utils.js` file provides helper functions for common testing patterns:

```javascript
import { test, expect } from '@playwright/test';
import { navigateAndWait, checkAccessibility, elementExists } from '../fixtures/test-utils.js';

test('example using utilities', async ({ page }) => {
  await navigateAndWait(page, '/');
  
  if (await elementExists(page, 'button.submit')) {
    const accessibility = await checkAccessibility(page, 'button.submit');
    expect(accessibility.isAccessible).toBeTruthy();
  }
});
```

### Using Page Objects

The `fixtures/page-objects.js` file provides page object models:

```javascript
import { test, expect } from '@playwright/test';
import { HomePage, BoardroomPage } from '../fixtures/page-objects.js';

test('navigate using page objects', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  
  expect(await homePage.hasNavigation()).toBeTruthy();
  
  const boardroom = new BoardroomPage(page);
  await boardroom.navigate();
  expect(await boardroom.hasChatInterface()).toBeTruthy();
});
```

### Unit Tests

Unit tests focus on individual components:

```javascript
import { test, expect } from '@playwright/test';

test('component renders correctly', async ({ page }) => {
  await page.goto('/');
  const component = page.locator('my-component');
  await expect(component).toBeVisible();
});
```

### Integration Tests

Integration tests validate user flows:

```javascript
import { test, expect } from '@playwright/test';

test('user can navigate to boardroom', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/boardroom/"]');
  await expect(page).toHaveURL(/\/boardroom/);
});
```

## Best Practices

1. **Use descriptive test names**: Clearly describe what is being tested
2. **Keep tests independent**: Each test should work in isolation
3. **Use proper selectors**: Prefer semantic selectors (role, label) over CSS classes
4. **Wait appropriately**: Use Playwright's auto-waiting, avoid fixed timeouts with `waitForTimeout()`
5. **Test user behavior**: Focus on what users do, not implementation details
6. **Clean up**: Tests should not leave side effects
7. **Mock external APIs**: Use fixtures for API responses when needed
8. **Use test.skip()**: Skip tests conditionally instead of silently passing
9. **Add meaningful assertions**: Include error messages in expect() calls
10. **Leverage page objects**: Use page object model for reusable page interactions

### Anti-Patterns to Avoid

❌ **Don't use `page.waitForTimeout()`** - Use proper waits like `waitForLoadState()` or `waitFor()`
❌ **Don't check count before asserting** - Use `expect().toBeVisible()` directly
❌ **Don't ignore errors silently** - Use `test.skip()` or proper error handling
❌ **Don't use brittle selectors** - Use semantic HTML and ARIA attributes
❌ **Don't test implementation details** - Test user-visible behavior

### Recommended Patterns

✅ **Use `test.beforeEach()`** for common setup
✅ **Use page objects** for complex page interactions
✅ **Use fixtures** for reusable test data and helpers
✅ **Use auto-waiting** built into Playwright
✅ **Filter console errors** for known external issues

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch commits

CI configuration:
- Runs on GitHub Actions
- Tests all browsers
- Generates HTML report
- Uploads artifacts on failure

## Test Coverage

Current test coverage:

- ✅ Core page health
- ✅ Navigation and layout
- ✅ Styling and SCSS
- ✅ JavaScript (ES6)
- ✅ Web components
- ✅ Boardroom chat interface
- ✅ Accessibility
- ✅ Performance
- ⚠️ API integration (mocked)
- ⚠️ Visual regression (baseline needed)

## Known Limitations

1. **API Tests**: Tests expect backend at `cloud.businessinfinity.asisaga.com` to be running or mocked
2. **Jekyll Server**: Tests require Jekyll dev server for local runs
3. **Network Errors**: Some tests may fail if external resources are unavailable
4. **Visual Tests**: Visual regression tests require baseline images to be captured

## Troubleshooting

### Tests fail to start

- Ensure Jekyll server is running: `bundle exec jekyll serve`
- Check that port 4000 is available
- Install Playwright browsers: `npx playwright install`

### Tests timeout

- Increase timeout in config: `timeout: 30000`
- Check network connectivity
- Verify Jekyll is serving files correctly

### Browser crashes

- Update Playwright: `npm update @playwright/test`
- Reinstall browsers: `npx playwright install --force`

### API errors in console

- These are expected if backend is not running
- Tests filter out known external API errors
- Mock API responses for stable testing

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Test Generator](https://playwright.dev/docs/codegen)
- [Testing Guide](TESTING_GUIDE.md) - Comprehensive guide to testing best practices
- [Test Template](TEMPLATE.spec.js) - Template for creating new tests

## Quick Start

1. Install dependencies: `npm install`
2. Install browsers: `npx playwright install`
3. Run tests: `npm test`
4. View report: `npm run test:report`

For detailed guidance on writing tests, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Support

For issues or questions:
- Open an issue on GitHub
- Check the test plan: `docs/test-plan.md`
- Review specifications: `docs/specifications.md`
