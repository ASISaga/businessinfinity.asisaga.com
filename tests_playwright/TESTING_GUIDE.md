# Playwright Testing Guide

## Best Practices & Standards

This guide outlines the testing standards and best practices for the Business Infinity project when using Playwright for web testing.

## Core Principles

### 1. Test Independence
Each test should run independently and not rely on the state from other tests.

```javascript
// ✅ Good - Independent test
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

// ❌ Bad - Depends on previous test state
test('user can view profile', async ({ page }) => {
  // Assumes user is already logged in
  await page.goto('/profile');
});
```

### 2. Auto-Waiting
Playwright has built-in auto-waiting. Avoid manual waits.

```javascript
// ✅ Good - Uses auto-waiting
test('button appears', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button')).toBeVisible();
  await page.locator('button').click();
});

// ❌ Bad - Manual timeout
test('button appears', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2000);
  await page.click('button');
});
```

### 3. Meaningful Selectors
Use semantic selectors that reflect user intent.

```javascript
// ✅ Good - Semantic selectors
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');
await page.getByText('Welcome').isVisible();

// ❌ Bad - Brittle CSS selectors
await page.locator('.btn.btn-primary.submit-btn').click();
await page.locator('#input-field-123').fill('test@example.com');
```

### 4. Descriptive Test Names
Test names should clearly describe what is being tested.

```javascript
// ✅ Good - Clear description
test('user can submit contact form with valid email', async ({ page }) => {
  // ...
});

// ❌ Bad - Vague description
test('test1', async ({ page }) => {
  // ...
});
```

### 5. Proper Error Messages
Include meaningful error messages in assertions.

```javascript
// ✅ Good - Helpful error message
expect(count, `Expected at least one button, found ${count}`).toBeGreaterThan(0);

// ❌ Bad - No context
expect(count).toBeGreaterThan(0);
```

## Testing Patterns

### Using test.beforeEach for Setup

```javascript
test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup for all tests in this describe block
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('shows user name', async ({ page }) => {
    await expect(page.locator('.user-name')).toBeVisible();
  });

  test('shows user stats', async ({ page }) => {
    await expect(page.locator('.user-stats')).toBeVisible();
  });
});
```

### Conditional Test Skipping

```javascript
test('optional feature works', async ({ page }) => {
  await page.goto('/');
  
  const featureExists = await page.locator('.optional-feature').count() > 0;
  
  if (!featureExists) {
    test.skip();
  }
  
  // Test the feature
  await expect(page.locator('.optional-feature')).toBeVisible();
});
```

### Using Page Objects

```javascript
// page-objects.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// test file
import { LoginPage } from './page-objects.js';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('test@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### Testing Accessibility

```javascript
test('page is keyboard accessible', async ({ page }) => {
  await page.goto('/');
  
  // Tab through focusable elements
  await page.keyboard.press('Tab');
  
  const focusedElement = await page.evaluate(() => document.activeElement.tagName);
  expect(focusedElement, 'Focus should move to interactive element').not.toBe('BODY');
});

test('buttons have accessible labels', async ({ page }) => {
  await page.goto('/');
  
  const buttons = await page.locator('button').all();
  
  for (const button of buttons) {
    const text = await button.textContent();
    const ariaLabel = await button.getAttribute('aria-label');
    
    expect(
      text || ariaLabel,
      'Button should have visible text or aria-label'
    ).toBeTruthy();
  }
});
```

### Testing Responsive Design

```javascript
test.describe('Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('mobile menu is visible', async ({ page }) => {
    await page.goto('/');
    const mobileMenu = page.locator('.mobile-menu-toggle');
    await expect(mobileMenu).toBeVisible();
  });
});

test.describe('Desktop Layout', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });
  
  test('desktop navigation is visible', async ({ page }) => {
    await page.goto('/');
    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).toBeVisible();
  });
});
```

### Testing Performance

```javascript
test('page loads within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/', { waitUntil: 'networkidle' });
  
  const loadTime = Date.now() - startTime;
  
  expect(loadTime, `Page loaded in ${loadTime}ms`).toBeLessThan(3000);
});
```

### Testing API Integration

```javascript
test('handles API errors gracefully', async ({ page }) => {
  // Mock API failure
  await page.route('**/api/data', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    });
  });
  
  await page.goto('/');
  
  // Verify error handling
  await expect(page.locator('.error-message')).toBeVisible();
});
```

## MCP Server Compatibility

### Running Tests via MCP Server

The tests are optimized for MCP server execution:

1. **Single Browser Mode**: Tests run on Chromium by default
2. **Flexible Base URL**: Set via `BASE_URL` environment variable
3. **Proper Timeouts**: Configured for reliable execution
4. **Minimal Retries**: Retries only on CI, not locally

### Example MCP Server Usage

```bash
# Set base URL if needed
export BASE_URL=http://localhost:4000

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests_playwright/integration/core-pages.spec.js

# Run with UI mode (great for debugging)
npx playwright test --ui

# Run in debug mode
npx playwright test --debug
```

## Common Anti-Patterns to Avoid

### 1. Don't Use waitForTimeout

```javascript
// ❌ Bad
await page.waitForTimeout(2000);

// ✅ Good
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

### 2. Don't Check Count Before Asserting

```javascript
// ❌ Bad
const count = await element.count();
if (count > 0) {
  await expect(element).toBeVisible();
}

// ✅ Good
await expect(element).toBeVisible();
// OR for optional elements:
const count = await element.count();
if (count === 0) {
  test.skip();
}
await expect(element).toBeVisible();
```

### 3. Don't Ignore Errors Silently

```javascript
// ❌ Bad
const count = await element.count();
if (count > 0) {
  // Test something
}
// Test passes even if element doesn't exist

// ✅ Good
const count = await element.count();
if (count === 0) {
  test.skip();
}
// OR assert that element exists
await expect(element).toBeVisible();
```

### 4. Don't Use Brittle Selectors

```javascript
// ❌ Bad
await page.locator('div > div > button.class1.class2').click();

// ✅ Good
await page.getByRole('button', { name: 'Submit' }).click();
```

## Debugging Tests

### Using Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests_playwright/integration/core-pages.spec.js:10 --debug
```

### Using UI Mode

```bash
# Run in UI mode for interactive debugging
npx playwright test --ui
```

### Screenshots on Failure

Screenshots are automatically captured on failure and saved to `test-results/`.

### Video Recording

Videos are automatically recorded on failure and saved to `test-results/`.

### Trace Files

Trace files are captured on first retry and can be viewed with:

```bash
npx playwright show-trace trace.zip
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Locators](https://playwright.dev/docs/locators)
- [Auto-Waiting](https://playwright.dev/docs/actionability)
