---
applyTo: "**/assets/js/**,**/*.js,assets/js/**,**/scripts/**"
description: "JavaScript guidance for subdomain: entry points, asset ordering, vendor flow, runtime concerns, and test hooks."
---

# JS Entry & Asset Ordering
- The subdomain JS entry is `/assets/js/script.js`.
- Load order: always import the theme's `common.js` (or `assets/js/common.js`) before subdomain-specific scripts to avoid duplicate polyfills or conflicting initialization.

# File Locations & Conventions
- Subdomain runtime JS: `/assets/js/`.
- Vendor JS: `/assets/js/vendor/` — isolate vendor libs and document version and origin.

# Vendor Flow & Compatibility
- Vendor artifacts should be prepared locally and added to `/assets/js/vendor/` for GitHub Pages compatibility.
- Prefer shipping minified vendor builds that are stable and documented. Verify license and reproducibility.

# Runtime & Initialization
- Keep initialization idempotent: add guards so multiple loads or HMR (during local dev) don't produce duplicate event handlers.
- Expose public hooks for theme-level initialization when necessary (e.g., `window.asisaga = window.asisaga || { init() {} }`).

# Testing & Quality
- Include small unit tests for critical UI helpers and run Playwright/Playwright-based E2E in CI where appropriate.
- Lint JS in CI and use an agreed ESLint config shared with the theme when possible.

# Do Not
- Do not override theme head scripts or modify bootstrapping done by the theme without coordination.
