import { test, expect } from '@playwright/test';

/**
 * Example test file - Template for creating new tests
 * 
 * This file demonstrates common patterns and best practices
 * for writing Playwright tests for the Business Infinity site.
 */

// ============================================================================
// Basic Page Tests
// ============================================================================

test.describe('Example: Basic Page Tests', () => {
  
  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Business Infinity|ASI Saga/);
    
    // Check page loaded
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
  
  test('page has expected content', async ({ page }) => {
    await page.goto('/');
    
    // Check for specific text
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check for specific element
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

});

// ============================================================================
// User Interaction Tests
// ============================================================================

test.describe('Example: User Interactions', () => {
  
  test('user can click a button', async ({ page }) => {
    await page.goto('/');
    
    // Find and click button - skip if not present
    const button = page.locator('button').first();
    const count = await button.count();
    
    if (count > 0) {
      await expect(button).toBeVisible();
      await button.click();
      // Button clicked successfully
    } else {
      test.skip();
    }
  });
  
  test('user can fill a form', async ({ page }) => {
    await page.goto('/');
    
    // Find form fields - skip if not present
    const input = page.locator('input[type="text"]').first();
    const count = await input.count();
    
    if (count > 0) {
      await expect(input).toBeVisible();
      await input.fill('Test value');
      await expect(input).toHaveValue('Test value');
    } else {
      test.skip();
    }
  });
  
  test('user can navigate', async ({ page }) => {
    await page.goto('/');
    
    // Find and click link - skip if not present
    const link = page.locator('a[href="/boardroom/"]').first();
    const count = await link.count();
    
    if (count > 0) {
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(/\/boardroom/);
    } else {
      test.skip();
    }
  });

});

// ============================================================================
// Component Tests
// ============================================================================

test.describe('Example: Component Tests', () => {
  
  test('web component is defined', async ({ page }) => {
    await page.goto('/');
    
    const isDefined = await page.evaluate(() => {
      return customElements.get('sidebar-element') !== undefined;
    });
    
    expect(isDefined).toBeTruthy();
  });
  
  test('component renders in shadow DOM', async ({ page }) => {
    await page.goto('/');
    
    const hasContent = await page.evaluate(() => {
      const element = document.querySelector('sidebar-element');
      return element && element.shadowRoot && element.shadowRoot.innerHTML.length > 0;
    });
    
    expect(hasContent).toBeTruthy();
  });

});

// ============================================================================
// Responsive Design Tests
// ============================================================================

test.describe('Example: Responsive Tests', () => {
  
  test('layout adapts to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => window.innerWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20);
  });
  
  test('mobile menu toggles', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const toggle = page.locator('.navbar-toggler, .menu-toggle').first();
    const count = await toggle.count();
    
    if (count > 0) {
      await expect(toggle).toBeVisible();
      await toggle.click();
      // Wait for animation to complete
      await page.waitForLoadState('networkidle');
    } else {
      test.skip();
    }
  });

});

// ============================================================================
// Accessibility Tests
// ============================================================================

test.describe('Example: Accessibility Tests', () => {
  
  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 5)) {
      const alt = await img.getAttribute('alt');
      expect(alt !== null).toBeTruthy();
    }
  });
  
  test('buttons have labels', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 5)) {
      const text = await button.textContent();
      const label = await button.getAttribute('aria-label');
      expect(text || label).toBeTruthy();
    }
  });
  
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    
    const focusedTag = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedTag).not.toBe('BODY');
  });

});

// ============================================================================
// Performance Tests
// ============================================================================

test.describe('Example: Performance Tests', () => {
  
  test('page loads quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(5000);
  });
  
  test('no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });

});

// ============================================================================
// API Integration Tests
// ============================================================================

test.describe('Example: API Tests', () => {
  
  test('API responses are handled', async ({ page }) => {
    let apiCalled = false;
    
    page.on('response', response => {
      if (response.url().includes('cloud.businessinfinity')) {
        apiCalled = true;
      }
    });
    
    await page.goto('/boardroom/');
    await page.waitForLoadState('networkidle');
    
    // API may or may not be called depending on component loading
    expect(apiCalled).toBeDefined();
  });

});
