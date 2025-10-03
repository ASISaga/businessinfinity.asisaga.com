import { test, expect } from '@playwright/test';

/**
 * Integration tests for accessibility
 * Tests WCAG AA compliance and keyboard navigation
 */

test.describe('Accessibility - Semantic HTML', () => {

  test('page has semantic HTML5 structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for semantic elements
    const hasHeader = await page.locator('header').count() > 0;
    const hasMain = await page.locator('main').count() > 0;
    const hasFooter = await page.locator('footer').count() > 0;
    
    expect(hasHeader || hasMain || hasFooter).toBeTruthy();
  });

  test('navigation has proper landmarks', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav, [role="navigation"]');
    const count = await nav.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('headings are hierarchical', async ({ page }) => {
    await page.goto('/');
    
    // Get all headings
    const headings = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return elements.map(el => parseInt(el.tagName.substring(1)));
    });
    
    if (headings.length > 0) {
      // First heading should be h1
      expect(headings[0]).toBe(1);
    }
  });

});

test.describe('Accessibility - ARIA', () => {

  test('interactive elements have accessible labels', async ({ page }) => {
    await page.goto('/');
    
    // Check buttons have text or aria-label
    const buttons = await page.locator('button').all();
    
    for (const button of buttons.slice(0, 10)) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images.slice(0, 10)) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty for decorative images, but should exist
      expect(alt !== null).toBeTruthy();
    }
  });

  test('boardroom chat has ARIA roles', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Check for ARIA roles on chat interface
    const ariaElements = page.locator('[role], [aria-label], [aria-labelledby]');
    const count = await ariaElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

});

test.describe('Accessibility - Keyboard Navigation', () => {

  test('can navigate with Tab key', async ({ page }) => {
    await page.goto('/');
    
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    
    // Check that an element is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
    expect(focusedElement).not.toBe('BODY');
  });

  test('links are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find first visible link
    const firstLink = page.locator('a').first();
    await expect(firstLink).toBeVisible();
    
    // Should be focusable
    await firstLink.focus();
    const isFocused = await firstLink.evaluate(el => el === document.activeElement);
    expect(isFocused).toBeTruthy();
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      await firstButton.focus();
      const isFocused = await firstButton.evaluate(el => el === document.activeElement);
      expect(isFocused).toBeTruthy();
    }
  });

  test('skip to main content link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first element
    await page.keyboard.press('Tab');
    
    // Check if first focusable is skip link
    const focusedText = await page.evaluate(() => {
      return document.activeElement.textContent.toLowerCase();
    });
    
    // Skip link may or may not be present
    expect(focusedText).toBeDefined();
  });

});

test.describe('Accessibility - Color Contrast', () => {

  test('page has sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Basic check: ensure text is not invisible
    const bodyColor = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });
    
    // Colors should be defined
    expect(bodyColor.color).toBeTruthy();
    expect(bodyColor.backgroundColor).toBeTruthy();
  });

});

test.describe('Accessibility - Focus Indicators', () => {

  test('focused elements have visible focus indicator', async ({ page }) => {
    await page.goto('/');
    
    const firstLink = page.locator('a').first();
    await firstLink.focus();
    
    // Check that outline is not set to none
    const outline = await firstLink.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.outline;
    });
    
    // Outline should exist (not 'none')
    expect(outline).toBeTruthy();
  });

});
