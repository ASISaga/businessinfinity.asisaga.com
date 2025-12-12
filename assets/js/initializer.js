/**
 * Application initializer
 *
 * This module wires together the OpenAPI loader and the `Asisaga` utilities
 * and performs light startup tasks. It uses an immediately-invoked async
 * function to kick off the OpenAPI fetch and registers a `DOMContentLoaded`
 * handler to perform DOM-related initialization.
 */
import asisaga from './app-utils.js';
import OpenApiLoader from './openapi-loader.js';

// Begin loading the OpenAPI spec as early as possible. Consumers may read
// `window.openApiSpec` once this resolves (or inside DOMContentLoaded).
(async function initApp() {
    await OpenApiLoader.load();
})();

// When the DOM is ready, log availability and call the Asisaga initializer.
document.addEventListener('DOMContentLoaded', function () {
    if (window.openApiSpec) {
        console.log('OpenAPI spec available:', window.openApiSpec);
    }
    if (asisaga && typeof asisaga.init === 'function') {
        asisaga.init();
    }
});
