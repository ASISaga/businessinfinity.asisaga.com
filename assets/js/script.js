// Central script loader for Boardroom | Business Infinity
import './common.js';
import './sidebar-element.js';
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

