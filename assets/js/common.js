/**
 * Common utilities and shared functionality for Business Infinity
 * This file should be imported before subdomain-specific scripts.
 */

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
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
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
    return (...args) => {
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
