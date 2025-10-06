/**
 * Global test setup and fixtures
 * Provides common configuration and utilities for all tests
 */
import { test as base } from '@playwright/test';

/**
 * Extended test fixture with custom utilities
 */
export const test = base.extend({
  /**
   * Auto-wait for page to be fully loaded before each test
   */
  page: async ({ page }, use) => {
    // Set up page event listeners for better debugging
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });
    
    // Optionally filter console errors from known external sources
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Only log if it's not from known external sources
        if (!text.includes('cloud.businessinfinity') && !text.includes('Failed to load resource')) {
          console.error('Console error:', text);
        }
      }
    });
    
    await use(page);
  },
  
  /**
   * Utility to navigate and wait for page to be ready
   */
  gotoAndWait: async ({ page }, use) => {
    const gotoAndWait = async (url, options = {}) => {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        ...options 
      });
      await page.waitForLoadState('networkidle');
    };
    await use(gotoAndWait);
  },
});

export { expect } from '@playwright/test';
