/**
 * Test utilities and best practice helpers
 * Provides common testing patterns for Playwright tests
 */

/**
 * Safely check if element exists without failing test
 */
export async function elementExists(page, selector) {
  const count = await page.locator(selector).count();
  return count > 0;
}

/**
 * Get element with timeout
 */
export async function waitForElement(page, selector, options = {}) {
  const timeout = options.timeout || 5000;
  try {
    await page.locator(selector).first().waitFor({ 
      state: 'visible', 
      timeout 
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Click element with retry logic
 */
export async function clickWithRetry(page, selector, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.locator(selector).click({ timeout: 5000 });
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
  return false;
}

/**
 * Type text with proper waiting
 */
export async function typeText(page, selector, text) {
  const input = page.locator(selector);
  await input.waitFor({ state: 'visible' });
  await input.clear();
  await input.fill(text);
  await input.blur(); // Trigger change events
}

/**
 * Navigate and wait for page to be ready
 */
export async function navigateAndWait(page, url, options = {}) {
  await page.goto(url, { 
    waitUntil: 'domcontentloaded',
    ...options 
  });
  await page.waitForLoadState('networkidle');
}

/**
 * Check if page has no console errors (with filters)
 */
export async function checkNoConsoleErrors(page, options = {}) {
  const errors = [];
  const ignorePatterns = options.ignore || [
    'cloud.businessinfinity',
    'Failed to load resource',
    'favicon.ico'
  ];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const shouldIgnore = ignorePatterns.some(pattern => text.includes(pattern));
      if (!shouldIgnore) {
        errors.push(text);
      }
    }
  });
  
  return errors;
}

/**
 * Test element accessibility
 */
export async function checkAccessibility(page, selector) {
  const element = page.locator(selector);
  const count = await element.count();
  
  if (count === 0) return null;
  
  return await element.evaluate(el => {
    const role = el.getAttribute('role');
    const ariaLabel = el.getAttribute('aria-label');
    const ariaLabelledBy = el.getAttribute('aria-labelledby');
    const ariaDescribedBy = el.getAttribute('aria-describedby');
    const tabIndex = el.getAttribute('tabindex');
    const text = el.textContent?.trim();
    
    return {
      role,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      tabIndex,
      hasText: !!text,
      isAccessible: !!(text || ariaLabel || ariaLabelledBy)
    };
  });
}

/**
 * Check responsive image loading
 */
export async function checkImageLoading(page, selector = 'img') {
  return await page.evaluate((sel) => {
    const images = Array.from(document.querySelectorAll(sel));
    return images.map(img => ({
      src: img.src,
      alt: img.alt,
      loaded: img.complete && img.naturalHeight !== 0,
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
  }, selector);
}

/**
 * Check for broken links
 */
export async function findBrokenLinks(page, selector = 'a[href]') {
  const links = await page.locator(selector).all();
  const broken = [];
  
  for (const link of links.slice(0, 10)) {
    const href = await link.getAttribute('href');
    
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }
    
    if (href.startsWith('http')) {
      // External link - skip for now
      continue;
    }
    
    try {
      const response = await page.request.get(href);
      if (response.status() >= 400) {
        broken.push({ href, status: response.status() });
      }
    } catch (error) {
      broken.push({ href, error: error.message });
    }
  }
  
  return broken;
}

/**
 * Get viewport dimensions
 */
export async function getViewportInfo(page) {
  return await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scrollWidth: document.body.scrollWidth,
    scrollHeight: document.body.scrollHeight,
    hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
    hasVerticalScroll: document.body.scrollHeight > window.innerHeight
  }));
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `screenshot-${name}-${timestamp}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  return filename;
}

/**
 * Test keyboard navigation
 */
export async function testKeyboardNavigation(page, startSelector = 'body') {
  await page.focus(startSelector);
  
  const focusableElements = [];
  
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el.tagName,
        type: el.type,
        id: el.id,
        className: el.className,
        text: el.textContent?.trim().substring(0, 50)
      };
    });
    
    focusableElements.push(focusedElement);
    
    // Stop if we've cycled back to body
    if (focusedElement.tagName === 'BODY') break;
  }
  
  return focusableElements;
}

/**
 * Wait for web component to be defined
 */
export async function waitForWebComponent(page, componentName, timeout = 10000) {
  return await page.waitForFunction(
    (name) => {
      return customElements.get(name) !== undefined;
    },
    componentName,
    { timeout }
  );
}

/**
 * Get shadow DOM content
 */
export async function getShadowRoot(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element?.shadowRoot) return null;
    
    return {
      html: element.shadowRoot.innerHTML,
      childCount: element.shadowRoot.children.length,
      hasSlot: !!element.shadowRoot.querySelector('slot')
    };
  }, selector);
}

/**
 * Common test patterns
 */
export const testPatterns = {
  /**
   * Test page loads successfully
   */
  pageLoads: async (page, url, expectedTitle) => {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
    if (expectedTitle) {
      const title = await page.title();
      return title.includes(expectedTitle);
    }
    return true;
  },
  
  /**
   * Test element is visible and accessible
   */
  elementIsAccessible: async (page, selector) => {
    const element = page.locator(selector).first();
    const isVisible = await element.isVisible();
    const isFocusable = await element.evaluate(el => {
      return el.tabIndex >= 0 || ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
    });
    return isVisible && isFocusable;
  }
};
