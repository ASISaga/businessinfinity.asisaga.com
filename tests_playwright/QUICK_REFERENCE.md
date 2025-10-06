# Quick Reference - Playwright Tests

## Running Tests

```bash
# Install dependencies (first time only)
npm install
npx playwright install

# Run all tests
npm test

# Run specific file
npx playwright test tests_playwright/integration/core-pages.spec.js

# Run with UI mode (interactive)
npm run test:ui

# Run in debug mode
npm run test:debug

# View test report
npm run test:report
```

## MCP Server Execution

```bash
# Run via MCP server (default config)
npx playwright test

# With custom base URL
BASE_URL=http://localhost:3000 npx playwright test

# List all tests
npx playwright test --list
```

## File Structure

```
tests_playwright/
├── 📚 Documentation
│   ├── README.md              - Main overview
│   ├── TESTING_GUIDE.md       - Comprehensive guide (8.9 KB)
│   ├── TEMPLATE.spec.js       - Test template (5.0 KB)
│   └── ENHANCEMENTS.md        - Change summary (8.1 KB)
│
├── 🔧 Fixtures & Utilities
│   ├── fixtures/
│   │   ├── helpers.js         - Legacy helpers (preserved)
│   │   ├── test-setup.js      - Test fixtures (NEW)
│   │   ├── page-objects.js    - Page models (NEW)
│   │   └── test-utils.js      - 30+ utilities (NEW)
│
├── ✅ Integration Tests
│   ├── integration/
│   │   ├── accessibility.spec.js
│   │   ├── boardroom.spec.js
│   │   ├── core-pages.spec.js
│   │   ├── navigation.spec.js
│   │   ├── performance.spec.js
│   │   └── styling.spec.js
│
└── 🧪 Unit Tests
    └── unit/
        ├── boardroom-chat.spec.js
        └── web-components.spec.js
```

## Common Patterns

### Basic Test
```javascript
test('descriptive name', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('selector')).toBeVisible();
});
```

### Using Page Objects
```javascript
import { HomePage } from '../fixtures/page-objects.js';

test('test with page object', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  expect(await homePage.hasNavigation()).toBeTruthy();
});
```

### Using Utilities
```javascript
import { navigateAndWait, elementExists } from '../fixtures/test-utils.js';

test('test with utilities', async ({ page }) => {
  await navigateAndWait(page, '/');
  const exists = await elementExists(page, 'button');
  expect(exists).toBeTruthy();
});
```

### Conditional Test
```javascript
test('optional feature', async ({ page }) => {
  await page.goto('/');
  
  const featureExists = await page.locator('.feature').count() > 0;
  if (!featureExists) {
    test.skip();
  }
  
  // Test the feature
});
```

### Accessibility Test
```javascript
test('keyboard accessible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  
  const focused = await page.evaluate(() => document.activeElement.tagName);
  expect(focused, 'Element should be focusable').not.toBe('BODY');
});
```

## Best Practices Checklist

- ✅ Use semantic selectors (getByRole, getByLabel, getByText)
- ✅ Add meaningful error messages to assertions
- ✅ Avoid waitForTimeout() - use waitForLoadState()
- ✅ Use test.skip() for conditional tests
- ✅ Keep tests independent
- ✅ Test user behavior, not implementation
- ✅ Use page objects for reusability
- ✅ Test accessibility (ARIA, keyboard navigation)

## Anti-Patterns to Avoid

- ❌ `await page.waitForTimeout(2000)`
- ❌ `await page.locator('.btn.class1.class2').click()`
- ❌ `if (count > 0) { /* test */ }` without skip
- ❌ `expect(value).toBe(true)` without error message
- ❌ Testing implementation details

## Common Selectors

```javascript
// ✅ Recommended - Semantic
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByText('Welcome')
page.getByPlaceholder('Enter email')

// ✅ Acceptable - CSS with semantic meaning
page.locator('nav a')
page.locator('button[type="submit"]')
page.locator('[aria-label="Close"]')

// ❌ Avoid - Brittle class-based
page.locator('.btn.btn-primary.submit-btn')
page.locator('#input-field-123')
```

## Resources

- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Full testing guide
- [TEMPLATE.spec.js](TEMPLATE.spec.js) - Test template
- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)

## Support

For issues or questions:
- Check TESTING_GUIDE.md for detailed examples
- Use TEMPLATE.spec.js as starting point
- Review existing tests for patterns
- Consult Playwright documentation
