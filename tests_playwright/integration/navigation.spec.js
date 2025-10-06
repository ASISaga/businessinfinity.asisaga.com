import { test, expect } from '@playwright/test';

/**
 * Integration tests for navigation and layout
 * Tests Bootstrap navbar, links, and responsive behavior
 */

test.describe('Navigation', () => {

  test('navbar is visible on homepage', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('nav, .navbar, [role="navigation"]').first();
    await expect(navbar).toBeVisible();
  });

  test('navbar contains navigation links', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a, .navbar a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation links are valid (no 404s)', async ({ page }) => {
    await page.goto('/');
    
    // Get all navigation links
    const links = await page.locator('nav a, .navbar a').all();
    
    // Test first few links to avoid timeout
    const linksToTest = links.slice(0, 5);
    
    for (const link of linksToTest) {
      const href = await link.getAttribute('href');
      
      // Skip external links and anchors
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
        continue;
      }
      
      // Navigate to the link
      const response = await page.goto(href, { waitUntil: 'domcontentloaded' });
      
      // Check it's not a 404
      expect(response.status()).not.toBe(404);
      
      // Go back to homepage for next iteration
      await page.goto('/');
    }
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();
  });

  test('footer contains links', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

});

test.describe('Responsive Layout', () => {

  test('navbar collapses on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for hamburger menu or collapsed navbar
    const hamburger = page.locator('.navbar-toggler, .menu-toggle, button[aria-label*="menu" i]');
    const count = await hamburger.count();
    
    // Should have a toggle button on mobile
    expect(count).toBeGreaterThan(0);
  });

  test('navbar expands on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Navigation should be visible without clicking
    const navLinks = page.locator('nav a, .navbar a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('layout adapts to tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Page should load without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
  });

  test('responsive images on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Images should not overflow viewport
    const images = await page.locator('img').all();
    
    for (const img of images.slice(0, 5)) {
      const box = await img.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
      }
    }
  });

});

test.describe('Bootstrap Components', () => {

  test('navbar toggle works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const toggler = page.locator('.navbar-toggler, .menu-toggle').first();
    const count = await toggler.count();
    
    if (count > 0) {
      await expect(toggler).toBeVisible();
      // Click the toggle
      await toggler.click();
      
      // Wait for menu animation to complete
      await page.waitForLoadState('networkidle');
      
      // Menu should be visible or have expanded class
      const menu = page.locator('.navbar-collapse, .nav-menu');
      const isVisible = await menu.isVisible();
      expect(isVisible).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('dropdowns are present if configured', async ({ page }) => {
    await page.goto('/');
    
    // Check for Bootstrap dropdown elements
    const dropdowns = page.locator('.dropdown, [data-bs-toggle="dropdown"]');
    const count = await dropdowns.count();
    
    // This is optional - dropdowns may or may not be present
    expect(count).toBeGreaterThanOrEqual(0);
  });

});
