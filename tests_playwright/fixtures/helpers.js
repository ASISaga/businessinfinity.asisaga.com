/**
 * Test fixtures and helpers for Playwright tests
 * Provides common utilities and mock data for testing
 */

/**
 * Mock API responses for testing without backend
 */
export const mockApiResponses = {
  agents: {
    success: [
      { agentId: 'cmo', name: 'Chief Marketing Officer' },
      { agentId: 'cfo', name: 'Chief Financial Officer' },
      { agentId: 'cto', name: 'Chief Technology Officer' }
    ]
  },
  
  conversation: {
    success: {
      conversationId: 'test-conv-123'
    }
  },
  
  messages: {
    empty: {
      messages: []
    },
    withMessages: {
      messages: [
        {
          messageId: 'msg-1',
          senderAgentId: 'cmo',
          timestamp: Date.now() / 1000,
          payload: { text: 'Hello from CMO' }
        },
        {
          messageId: 'msg-2',
          senderAgentId: 'cfo',
          timestamp: Date.now() / 1000 + 1,
          payload: { text: 'Hello from CFO' }
        }
      ]
    }
  },
  
  dashboard: {
    cmo: {
      uiSchema: {
        panels: [
          {
            title: 'Marketing Actions',
            actions: [
              {
                id: 'create-campaign',
                agentId: 'cmo',
                label: 'Create Campaign',
                argsSchema: {
                  name: { type: 'string' },
                  budget: { type: 'number' }
                }
              }
            ]
          }
        ]
      }
    }
  }
};

/**
 * Mock fetch for testing without backend
 */
export async function mockFetch(page, routes) {
  await page.route('**/*', route => {
    const url = route.request().url();
    
    for (const [pattern, response] of Object.entries(routes)) {
      if (url.includes(pattern)) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(response)
        });
        return;
      }
    }
    
    // Continue with actual request if no mock found
    route.continue();
  });
}

/**
 * Wait for web components to be defined
 */
export async function waitForWebComponents(page, componentNames) {
  await page.waitForFunction(
    (names) => {
      return names.every(name => customElements.get(name) !== undefined);
    },
    componentNames
  );
}

/**
 * Get shadow root content
 */
export async function getShadowContent(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element || !element.shadowRoot) return null;
    return element.shadowRoot.innerHTML;
  }, selector);
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Get computed style of element
 */
export async function getComputedStyle(page, selector, property) {
  return await page.evaluate(({ sel, prop }) => {
    const element = document.querySelector(sel);
    if (!element) return null;
    return window.getComputedStyle(element)[prop];
  }, { sel: selector, prop: property });
}

/**
 * Check color contrast ratio (simplified WCAG check)
 */
export function checkContrastRatio(foreground, background) {
  // Simplified contrast check
  // Real implementation would parse RGB and calculate luminance
  return true; // Placeholder
}

/**
 * Generate test user data
 */
export function generateTestUser(role = 'user') {
  return {
    id: `test-${Date.now()}`,
    name: `Test ${role}`,
    email: `test-${role}@example.com`,
    role: role
  };
}

/**
 * Common viewport sizes for testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1920, height: 1080 },
  desktopLarge: { width: 2560, height: 1440 }
};

/**
 * Common test selectors
 */
export const selectors = {
  nav: 'nav, .navbar, [role="navigation"]',
  footer: 'footer, [role="contentinfo"]',
  main: 'main, [role="main"]',
  header: 'header, [role="banner"]',
  heading: 'h1, h2, h3, h4, h5, h6',
  link: 'a[href]',
  button: 'button, [role="button"]',
  input: 'input, textarea, select',
  form: 'form'
};

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Capture console messages
 */
export function captureConsole(page) {
  const messages = {
    log: [],
    error: [],
    warning: [],
    info: []
  };
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (messages[type]) {
      messages[type].push(text);
    }
  });
  
  return messages;
}

/**
 * Check for broken images
 */
export async function findBrokenImages(page) {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .filter(img => !img.complete || img.naturalHeight === 0)
      .map(img => img.src);
  });
}

/**
 * Get all links on page
 */
export async function getAllLinks(page) {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links.map(link => ({
      href: link.href,
      text: link.textContent.trim(),
      target: link.target
    }));
  });
}

/**
 * Check if element has focus
 */
export async function hasFocus(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return element === document.activeElement;
  }, selector);
}
