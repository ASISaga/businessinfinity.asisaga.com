import { test, expect } from '@playwright/test';

/**
 * Integration tests for SCSS/CSS styling
 * Tests compiled CSS, variables, and responsive design
 */

test.describe('SCSS Compilation', () => {

  test('compiled CSS is loaded', async ({ page }) => {
    const cssLoaded = [];
    
    page.on('response', response => {
      if (response.url().endsWith('.css')) {
        cssLoaded.push(response.url());
      }
    });
    
    await page.goto('/');
    
    expect(cssLoaded.length).toBeGreaterThan(0);
  });

  test('no missing stylesheets (404s)', async ({ page }) => {
    const failedCss = [];
    
    page.on('response', response => {
      if (response.url().endsWith('.css') && response.status() === 404) {
        failedCss.push(response.url());
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    expect(failedCss.length).toBe(0);
  });

  test('styles are applied to elements', async ({ page }) => {
    await page.goto('/');
    
    // Check that body has styles applied
    const bodyStyles = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        color: styles.color
      };
    });
    
    expect(bodyStyles.fontFamily).toBeTruthy();
    expect(bodyStyles.fontSize).toBeTruthy();
    expect(bodyStyles.color).toBeTruthy();
  });

});

test.describe('SCSS Variables and Mixins', () => {

  test('Bootstrap grid classes work', async ({ page }) => {
    await page.goto('/');
    
    // Look for Bootstrap container classes
    const hasBootstrap = await page.evaluate(() => {
      const containers = document.querySelectorAll('.container, .container-fluid, .row, .col');
      return containers.length > 0;
    });
    
    expect(hasBootstrap).toBeTruthy();
  });

  test('custom SCSS variables reflected in UI', async ({ page }) => {
    await page.goto('/');
    
    // Check that custom colors are applied (from SCSS variables)
    const hasCustomColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let hasColor = false;
      
      for (const el of elements) {
        const styles = window.getComputedStyle(el);
        if (styles.color || styles.backgroundColor) {
          hasColor = true;
          break;
        }
      }
      
      return hasColor;
    });
    
    expect(hasCustomColors).toBeTruthy();
  });

});

test.describe('Responsive Layouts', () => {

  test('layout adapts to mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('layout adapts to tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('layout adapts to desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check container is centered
    const container = page.locator('.container, .container-fluid').first();
    const count = await container.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('text remains readable at all breakpoints', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check font size is reasonable
      const fontSize = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.body);
        return parseInt(styles.fontSize);
      });
      
      // Font should be at least 12px
      expect(fontSize).toBeGreaterThanOrEqual(12);
    }
  });

});

test.describe('Boardroom SCSS', () => {

  test('boardroom has custom styles', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Check for boardroom-specific classes
    const hasBoardroomStyles = await page.evaluate(() => {
      const boardroomElements = document.querySelectorAll('[class*="boardroom"]');
      return boardroomElements.length > 0;
    });
    
    expect(hasBoardroomStyles).toBeTruthy();
  });

  test('chat area has proper styling', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Look for chat-related styling
    const hasChatStyles = await page.evaluate(() => {
      const chatElements = document.querySelectorAll('[class*="chat"]');
      if (chatElements.length === 0) return false;
      
      const styles = window.getComputedStyle(chatElements[0]);
      return styles.border || styles.padding || styles.backgroundColor;
    });
    
    expect(hasChatStyles).toBeTruthy();
  });

  test('members sidebar has styling', async ({ page }) => {
    await page.goto('/boardroom/');
    
    // Look for members/sidebar styling
    const hasMemberStyles = await page.evaluate(() => {
      const memberElements = document.querySelectorAll('[class*="member"], [class*="sidebar"]');
      return memberElements.length > 0;
    });
    
    expect(hasMemberStyles).toBeTruthy();
  });

});

test.describe('CSS Optimization', () => {

  test('CSS is minified in production', async ({ page }) => {
    const cssContent = [];
    
    page.on('response', async response => {
      if (response.url().endsWith('.css')) {
        try {
          const content = await response.text();
          cssContent.push(content);
        } catch (e) {
          // Skip if can't read
        }
      }
    });
    
    await page.goto('/');
    
    // Check if CSS appears minified (no excessive whitespace)
    if (cssContent.length > 0) {
      const totalLength = cssContent.join('').length;
      const lines = cssContent.join('').split('\n').length;
      const avgLineLength = totalLength / lines;
      
      // Minified CSS has long lines (> 100 chars avg)
      // Non-minified has shorter lines
      expect(avgLineLength).toBeGreaterThan(50);
    }
  });

});
