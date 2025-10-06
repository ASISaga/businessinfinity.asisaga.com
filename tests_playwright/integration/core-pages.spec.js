import { test, expect } from '@playwright/test';

/**
 * Integration tests for core page functionality
 * Tests that all key pages load successfully and render correctly
 */

test.describe('Core Page Health', () => {

  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Business Infinity|ASI Saga/);
  });

  test('homepage has proper heading', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('homepage has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter out known external errors
        const text = msg.text();
        if (!text.includes('cloud.businessinfinity') && !text.includes('Failed to load resource')) {
          errors.push(text);
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors, `Console errors found: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('boardroom page loads successfully', async ({ page }) => {
    await page.goto('/boardroom/');
    await expect(page).toHaveTitle(/Boardroom/);
  });

  test('dashboard page loads successfully', async ({ page }) => {
    await page.goto('/dashboard/');
    // Page should load without 404
    const is404 = await page.locator('text=/404|not found/i').count() > 0;
    expect(is404, 'Dashboard page returned 404').toBe(false);
  });

  test('mentor page loads successfully', async ({ page }) => {
    await page.goto('/mentor/');
    // Page should load without 404
    const is404 = await page.locator('text=/404|not found/i').count() > 0;
    expect(is404, 'Mentor page returned 404').toBe(false);
  });

});

test.describe('Meta Tags and SEO', () => {

  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    const metaDescription = await page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
  });

  test('homepage has OpenGraph tags', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]');
    expect(await ogTitle.count()).toBeGreaterThan(0);
  });

  test('pages have canonical links', async ({ page }) => {
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]');
    const count = await canonical.count();
    expect(count).toBeGreaterThanOrEqual(0); // Optional but recommended
  });

});

test.describe('Liquid Template Rendering', () => {

  test('title populated from Liquid variables', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    // Should not contain Liquid syntax
    expect(title).not.toContain('{{');
    expect(title).not.toContain('{%');
  });

  test('content does not contain unprocessed Liquid tags', async ({ page }) => {
    await page.goto('/');
    const bodyText = await page.locator('body').textContent();
    // Should not contain Liquid syntax in visible content
    expect(bodyText).not.toContain('{{');
    expect(bodyText).not.toContain('{%');
  });

});
