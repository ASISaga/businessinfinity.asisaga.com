// Utility to resolve API paths and methods from OpenAPI spec
import openApiSpec from '../../../../BusinessInfinity/openapi.json';

export function getApiPath(operationId, params = {}) {
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
