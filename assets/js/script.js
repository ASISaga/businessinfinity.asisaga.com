// Central script loader for Boardroom | Business Infinity
import './common.js';
import Boardroom from './boardroom/boardroom.js';
import './dashboard/dashboard.js';

// Import OpenAPI spec from backend (relative path in workspace)
import openApiSpec from '../../../../BusinessInfinity/openapi.json';

// Expose the spec globally for documentation, validation, or codegen
window.openApiSpec = openApiSpec;

// Initialize the Boardroom application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const app = new Boardroom();
  app.init();
  // Example: log the API spec
  console.log('Loaded OpenAPI spec:', window.openApiSpec);
});
