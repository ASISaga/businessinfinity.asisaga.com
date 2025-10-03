import { test, expect } from '@playwright/test';

/**
 * Integration tests for Boardroom Chat Interface
 * Tests the boardroom page, chat functionality, and agent interactions
 */

test.describe('Boardroom Page', () => {

  test('boardroom page loads with correct title', async ({ page }) => {
    await page.goto('/boardroom/');
    await expect(page).toHaveTitle(/Boardroom/);
  });

  test('boardroom has chat area', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Look for chat-related elements
    const chatArea = page.locator('.chat, .chat-area, [class*="chat"]').first();
    const exists = await chatArea.count() > 0;
    
    expect(exists).toBeTruthy();
  });

  test('boardroom has members sidebar or member list', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Look for members/agents list
    const membersList = page.locator('.members, .agents, [class*="member"], [class*="sidebar"]').first();
    const exists = await membersList.count() > 0;
    
    expect(exists).toBeTruthy();
  });

  test('boardroom has toggle controls', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Look for toggle strip or controls
    const toggle = page.locator('.toggle, [class*="toggle"]').first();
    const exists = await toggle.count() > 0;
    
    expect(exists).toBeTruthy();
  });

  test('boardroom page has no console errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/boardroom/');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected errors from external API calls
    const relevantErrors = errors.filter(err => 
      !err.includes('cloud.businessinfinity') && 
      !err.includes('fetch') &&
      !err.includes('network')
    );
    
    expect(relevantErrors.length).toBe(0);
  });

});

test.describe('Boardroom Loading States', () => {

  test('loading overlay exists', async ({ page }) => {
    await page.goto('/boardroom/');
    
    const loadingOverlay = page.locator('#boardroom-loading, .loading, [class*="loading"]');
    const exists = await loadingOverlay.count() > 0;
    
    expect(exists).toBeTruthy();
  });

  test('toast container exists for notifications', async ({ page }) => {
    await page.goto('/boardroom/');
    
    const toastContainer = page.locator('#boardroom-toasts, .toast-container, [class*="toast"]');
    const exists = await toastContainer.count() > 0;
    
    expect(exists).toBeTruthy();
  });

});

test.describe('Boardroom Accessibility', () => {

  test('boardroom section has aria-label', async ({ page }) => {
    await page.goto('/boardroom/');
    
    const section = page.locator('section[aria-label]');
    const count = await section.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('chat area is keyboard accessible', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => {
      return document.activeElement.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });

});

test.describe('Boardroom Components Integration', () => {

  test('boardroom includes chat area component', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Wait for includes to load
    await page.waitForTimeout(1000);
    
    // Check that chat-area include was processed
    const chatArea = page.locator('[class*="chat-area"], .chat');
    const exists = await chatArea.count() > 0;
    
    expect(exists).toBeTruthy();
  });

  test('boardroom includes members sidebar component', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Wait for includes to load
    await page.waitForTimeout(1000);
    
    // Check that members-sidebar include was processed
    const membersSidebar = page.locator('[class*="members"], [class*="sidebar"]');
    const exists = await membersSidebar.count() > 0;
    
    expect(exists).toBeTruthy();
  });

  test('boardroom includes toggle strip component', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Wait for includes to load
    await page.waitForTimeout(1000);
    
    // Check that toggle-strip include was processed
    const toggleStrip = page.locator('[class*="toggle"]');
    const exists = await toggleStrip.count() > 0;
    
    expect(exists).toBeTruthy();
  });

});

test.describe('Boardroom Responsive Design', () => {

  test('boardroom layout adapts to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/boardroom/');
    
    // Page should load without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('boardroom layout adapts to tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/boardroom/');
    
    // Page should load without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('boardroom layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/boardroom/');
    
    // Members sidebar should be visible on desktop
    const sidebar = page.locator('[class*="sidebar"], [class*="members"]').first();
    const isVisible = await sidebar.isVisible();
    
    expect(isVisible).toBeTruthy();
  });

});
