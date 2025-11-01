// Central script loader for Boardroom | Business Infinity
import './common.js';
import './sidebar-element.js';
import './boardroom-app.js';
import './dashboard-panel.js';
import './mentor-element.js';

// Import OpenAPI spec from backend (relative path in workspace)

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

// Expose the spec globally for documentation, validation, or codegen
window.openApiSpec = openApiSpec;

// Initialize the Boardroom application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Custom elements are auto-registered. Example: log the API spec
  console.log('Loaded OpenAPI spec:', window.openApiSpec);
});
