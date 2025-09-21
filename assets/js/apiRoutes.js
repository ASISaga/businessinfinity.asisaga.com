import { OPENAPI_SPEC_URL, API_BASE_URL } from './config.js';
// Helper to build full API URL
export function buildApiUrl(path) {
  // Ensure no double slashes
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
// Utility to resolve API paths and methods from OpenAPI spec

let openApiSpecCache = null;

export async function getOpenApiSpec() {
  if (openApiSpecCache) return openApiSpecCache;
  const response = await fetch(OPENAPI_SPEC_URL);
  if (!response.ok) throw new Error('Failed to load OpenAPI spec');
  openApiSpecCache = await response.json();
  return openApiSpecCache;
}

export async function getApiPath(operationId, params = {}) {
  const openApiSpec = await getOpenApiSpec();
  for (const [path, methods] of Object.entries(openApiSpec.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      if (details.operationId === operationId) {
        // Replace path params
        let resolvedPath = path;
        Object.entries(params).forEach(([key, value]) => {
          resolvedPath = resolvedPath.replace(`{${key}}`, value);
        });
        return { path: resolvedPath, method };
      }
    }
  }
  throw new Error(`Operation ${operationId} not found in OpenAPI spec`);
}
