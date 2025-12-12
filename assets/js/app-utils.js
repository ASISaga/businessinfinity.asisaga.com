/**
 * AppUtils — lightweight DOM utilities and application namespace for Business Infinity
 *
 * This module is the canonical implementation of the application's small set
 * of DOM helpers and utilities. It replaces the legacy `asisaga.js` filename.
 */
class AppUtils {
    constructor() {
        this.name = 'Business Infinity';
    }

    init() {
        // Small initializer used by pages to indicate the utilities are available
        console.log('%cBusiness Infinity', 'color:#00e0ff; font-weight:700;', 'Common utilities loaded.');
    }

    /**
     * Query a single element safely.
     * @param {string} selector - CSS selector
     * @param {Element|Document} [context=document] - Query context
     * @returns {Element|null}
     */
    $(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn('Invalid selector:', selector);
            return null;
        }
    }

    /**
     * Query multiple elements safely.
     * @param {string} selector - CSS selector
     * @param {Element|Document} [context=document] - Query context
     * @returns {Element[]}
     */
    $$(selector, context = document) {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (e) {
            console.warn('Invalid selector:', selector);
            return [];
        }
    }

    /**
     * Escape text for safe insertion into the DOM (prevents XSS).
     * @param {string} str
     * @returns {string}
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Create an element and set attributes safely (avoids innerHTML).
     * - `attrs.class` sets `className`
     * - `attrs.data` should be an object of data-* attributes
     * @param {string} tag
     * @param {object} [attrs={}]
     * @param {string} [textContent='']
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
    }

    /**
     * Return a debounced version of `fn` that delays invocation until `delay` ms
     * have passed since the last call.
     */
    debounce(fn, delay = 250) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            const context = this;
            timeoutId = setTimeout(() => fn.apply(context, args), delay);
        };
    }

    /**
     * Return a throttled version of `fn` that only allows one call per `limit` ms.
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
}

// Expose a single instance as the global namespace for legacy code. New code
// should import this module and use the exported instance instead of relying
// on globals when possible.
window.asisaga = window.asisaga || new AppUtils();
export default window.asisaga;
