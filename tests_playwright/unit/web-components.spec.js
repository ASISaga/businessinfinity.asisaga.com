import { test, expect } from '@playwright/test';

/**
 * Unit tests for Web Component Infrastructure
 * Tests sidebar, dashboard, mentor, and boardroom app components
 */

test.describe('SidebarElement Component', () => {
  
  test('should define custom element', async ({ page }) => {
    await page.goto('/');
    const isDefined = await page.evaluate(() => {
      return customElements.get('sidebar-element') !== undefined;
    });
    expect(isDefined, 'sidebar-element should be defined as custom element').toBeTruthy();
  });

  test('should create shadow root', async ({ page }) => {
    await page.goto('/');
    const hasShadowRoot = await page.evaluate(() => {
      const elements = document.querySelectorAll('sidebar-element');
      return elements.length > 0 && elements[0].shadowRoot !== null;
    });
    expect(hasShadowRoot, 'sidebar-element should have shadow root').toBeTruthy();
  });

  test('should toggle class on click', async ({ page }) => {
    await page.goto('/');
    const toggled = await page.evaluate(() => {
      const element = document.querySelector('sidebar-element');
      if (!element) return false;
      const hadClass = element.classList.contains('open');
      element.click();
      const hasClass = element.classList.contains('open');
      return hadClass !== hasClass; // Should have toggled
    });
    expect(toggled, 'sidebar-element should toggle open class on click').toBeTruthy();
  });

});

test.describe('DashboardPanel Component', () => {
  
  test('should define custom element', async ({ page }) => {
    await page.goto('/');
    const isDefined = await page.evaluate(() => {
      return customElements.get('dashboard-panel') !== undefined;
    });
    expect(isDefined, 'dashboard-panel should be defined as custom element').toBeTruthy();
  });

  test('should create shadow root', async ({ page }) => {
    await page.goto('/');
    const hasShadowRoot = await page.evaluate(() => {
      const elements = document.querySelectorAll('dashboard-panel');
      return elements.length > 0 && elements[0].shadowRoot !== null;
    });
    expect(hasShadowRoot, 'dashboard-panel should have shadow root').toBeTruthy();
  });

});

test.describe('MentorElement Component', () => {
  
  test('should define custom element', async ({ page }) => {
    await page.goto('/');
    const isDefined = await page.evaluate(() => {
      return customElements.get('mentor-element') !== undefined;
    });
    expect(isDefined, 'mentor-element should be defined as custom element').toBeTruthy();
  });

  test('should create shadow root', async ({ page }) => {
    await page.goto('/');
    const hasShadowRoot = await page.evaluate(() => {
      const elements = document.querySelectorAll('mentor-element');
      return elements.length > 0 && elements[0].shadowRoot !== null;
    });
    expect(hasShadowRoot, 'mentor-element should have shadow root').toBeTruthy();
  });

});

test.describe('BoardroomApp Component', () => {
  
  test('should define custom element', async ({ page }) => {
    await page.goto('/');
    const isDefined = await page.evaluate(() => {
      return customElements.get('boardroom-app') !== undefined;
    });
    expect(isDefined).toBeTruthy();
  });

  test('should create shadow root', async ({ page }) => {
    await page.goto('/');
    const hasShadowRoot = await page.evaluate(() => {
      const elements = document.querySelectorAll('boardroom-app');
      return elements.length > 0 && elements[0].shadowRoot !== null;
    });
    expect(hasShadowRoot).toBeTruthy();
  });

});

test.describe('Web Components - General', () => {
  
  test('all custom elements should load without errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for components to load
    
    expect(errors.length).toBe(0);
  });

  test('Shadow DOM should encapsulate styles', async ({ page }) => {
    await page.goto('/');
    const isEncapsulated = await page.evaluate(() => {
      const element = document.querySelector('sidebar-element');
      if (!element || !element.shadowRoot) return false;
      
      // Check that shadow root has its own styles
      const shadowStyles = element.shadowRoot.querySelector('style');
      
      // Global styles should not affect shadow DOM (except with ::part or host)
      return shadowStyles !== null;
    });
    expect(isEncapsulated).toBeTruthy();
  });

});
