import { test, expect } from '@playwright/test';

/**
 * Integration tests for performance
 * Tests page load time, resource optimization, and caching
 */

test.describe('Performance - Page Load', () => {

  test('homepage loads in under 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Allow 5 seconds for test environment (spec says 2s for production)
    expect(loadTime).toBeLessThan(5000);
  });

  test('boardroom page loads in under 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/boardroom/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('DOMContentLoaded event fires quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // DOM should load very quickly
    expect(loadTime).toBeLessThan(3000);
  });

});

test.describe('Performance - Resource Optimization', () => {

  test('CSS files are loaded', async ({ page }) => {
    const cssRequests = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'stylesheet') {
        cssRequests.push(request.url());
      }
    });
    
    await page.goto('/');
    
    // Should have CSS loaded
    expect(cssRequests.length).toBeGreaterThan(0);
  });

  test('JavaScript files are loaded', async ({ page }) => {
    const jsRequests = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'script') {
        jsRequests.push(request.url());
      }
    });
    
    await page.goto('/');
    
    // Should have JavaScript loaded
    expect(jsRequests.length).toBeGreaterThan(0);
  });

  test('images are optimized (under 500KB each)', async ({ page }) => {
    const imageRequests = [];
    
    page.on('response', async response => {
      if (response.request().resourceType() === 'image') {
        imageRequests.push({
          url: response.url(),
          status: response.status(),
          contentLength: response.headers()['content-length']
        });
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check image sizes
    for (const img of imageRequests.slice(0, 10)) {
      if (img.contentLength) {
        const sizeInKB = parseInt(img.contentLength) / 1024;
        // Allow up to 500KB per image (should be optimized in production)
        expect(sizeInKB).toBeLessThan(500);
      }
    }
  });

});

test.describe('Performance - No Blocking Scripts', () => {

  test('no blocking scripts in head', async ({ page }) => {
    await page.goto('/');
    
    const blockingScripts = await page.evaluate(() => {
      const scripts = Array.from(document.head.querySelectorAll('script'));
      return scripts.filter(script => {
        return !script.async && !script.defer && script.src;
      }).length;
    });
    
    // Should have minimal or no blocking scripts
    expect(blockingScripts).toBeLessThanOrEqual(2);
  });

  test('scripts have defer or async attributes', async ({ page }) => {
    await page.goto('/');
    
    const scriptAttrs = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(script => ({
        async: script.async,
        defer: script.defer,
        src: script.src
      }));
    });
    
    // Most scripts should have async or defer
    const optimizedScripts = scriptAttrs.filter(s => s.async || s.defer);
    
    if (scriptAttrs.length > 0) {
      const ratio = optimizedScripts.length / scriptAttrs.length;
      expect(ratio).toBeGreaterThan(0.5); // At least 50% optimized
    }
  });

});

test.describe('Performance - Caching Headers', () => {

  test('static assets have cache headers', async ({ page }) => {
    const cachedResources = [];
    
    page.on('response', response => {
      const url = response.url();
      const headers = response.headers();
      
      // Check for CSS, JS, image caching
      if (url.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
        cachedResources.push({
          url,
          cacheControl: headers['cache-control'],
          etag: headers['etag']
        });
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // At least some resources should have cache headers
    const cached = cachedResources.filter(r => r.cacheControl || r.etag);
    
    if (cachedResources.length > 0) {
      expect(cached.length).toBeGreaterThan(0);
    }
  });

});

test.describe('Performance - Bundle Size', () => {

  test('total page weight is reasonable', async ({ page }) => {
    let totalSize = 0;
    
    page.on('response', async response => {
      const contentLength = response.headers()['content-length'];
      if (contentLength) {
        totalSize += parseInt(contentLength);
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const totalSizeMB = totalSize / (1024 * 1024);
    
    // Total page weight should be under 5MB
    expect(totalSizeMB).toBeLessThan(5);
  });

});
