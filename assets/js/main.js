/**
 * Common utilities and shared functionality for Business Infinity
 * This file should be imported before subdomain-specific scripts.
 */

// App-specific imports moved from `script.js`
import './boardroom/sidebar-element.js';
import './boardroom-app.js';
import './dashboard-panel.js';
import './mentor-element.js';
import { OPENAPI_SPEC_URL } from './config.js';

// Initialize OpenAPI spec placeholder
window.openApiSpec = null;

// Load OpenAPI spec at runtime using configured URL with fallback to bundled file
const localFallback = '/assets/data/openapi.json';
async function loadOpenApiSpec() {
  const tryUrls = [OPENAPI_SPEC_URL, localFallback];
  for (const url of tryUrls) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // try next
        console.warn(`OpenAPI spec at ${url} returned ${res.status}`);
        continue;
      }
      const json = await res.json();
      window.openApiSpec = json;
      console.log('Loaded OpenAPI spec from', url, json);
      return;
    } catch (err) {
      console.warn(`Failed to fetch OpenAPI spec from ${url}:`, err);
    }
  }
  console.error('Failed to load OpenAPI spec from all known locations');
}

loadOpenApiSpec();

// Initialize the Boardroom application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Custom elements are auto-registered. Example: log the API spec
  if (window.openApiSpec) {
    console.log('OpenAPI spec available:', window.openApiSpec);
  }
});

// Namespace for Business Infinity
window.asisaga = window.asisaga || {
  init() {
    console.log('%cBusiness Infinity', 'color:#00e0ff; font-weight:700;', 'Common utilities loaded.');
  },

  /**
   * Safe DOM query helper with error handling
   * @param {string} selector - CSS selector
   * @param {Element} context - Parent element context (defaults to document)
   * @returns {Element|null}
   */
  $(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (e) {
      console.warn('Invalid selector:', selector);
      return null;
    }
  },

  /**
   * Safe DOM query for multiple elements
   * @param {string} selector - CSS selector
   * @param {Element} context - Parent element context (defaults to document)
   * @returns {Element[]}
   */
  $$(selector, context = document) {
    try {
      return Array.from(context.querySelectorAll(selector));
    } catch (e) {
      console.warn('Invalid selector:', selector);
      return [];
    }
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Create element safely with text content (not innerHTML)
   * @param {string} tag - HTML tag name
   * @param {object} attrs - Attributes to set
   * @param {string} textContent - Text content (not HTML)
   * @returns {Element}
   */
  createElement(tag, attrs = {}, textContent = '') {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') {
        el.className = value;
      } else if (key === 'data') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          el.dataset[dataKey] = dataValue;
        });
      } else {
        el.setAttribute(key, value);
      }
    });
    if (textContent) {
      el.textContent = textContent;
    }
    return el;
  },

  /**
   * Debounce function for performance optimization
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function}
   */
  debounce(fn, delay = 250) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      const context = this;
      timeoutId = setTimeout(() => fn.apply(context, args), delay);
    };
  },

  /**
   * Throttle function for performance optimization
   * @param {Function} fn - Function to throttle
   * @param {number} limit - Minimum time between calls in milliseconds
   * @returns {Function}
   */
  throttle(fn, limit = 250) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Initialize on load
window.asisaga.init();

export default window.asisaga;
