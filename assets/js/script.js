// Central script loader for Boardroom | Business Infinity
import './common.js';
import './sidebar-element.js';
import './boardroom-app.js';
import './dashboard-panel.js';
import './mentor-element.js';

// Initialize OpenAPI spec placeholder
window.openApiSpec = null;

// Load OpenAPI spec at runtime using fetch to avoid MIME type issues
fetch('../data/openapi.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(openApiSpec => {
    window.openApiSpec = openApiSpec;
    console.log('Loaded OpenAPI spec:', openApiSpec);
  })
  .catch(error => {
    console.error('Failed to load OpenAPI spec:', error);
  });

// Initialize the Boardroom application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Custom elements are auto-registered. Example: log the API spec
  if (window.openApiSpec) {
    console.log('OpenAPI spec available:', window.openApiSpec);
  }
});

