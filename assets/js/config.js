// config.js
export const AAD_CONFIG = {
  clientId: "YOUR_CLIENT_ID",
  tenantId: "YOUR_TENANT_ID",
  functionScope: "api://YOUR_FUNCTION_APP_ID/.default",
  redirectUri: window.location.origin
};

// Confindential information should not be hardcoded in production code.
// Client secret
// Certificate or Client assertion key
// API Keys