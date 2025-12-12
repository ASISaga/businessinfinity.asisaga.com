import { OPENAPI_SPEC_URL } from './config.js';

/**
 * OpenApiLoader
 *
 * Responsible for loading the OpenAPI specification used by the app. It
 * attempts to fetch from a configured `OPENAPI_SPEC_URL` and falls back to
 * a bundled `/assets/data/openapi.json` file. On success the parsed JSON is
 * stored on `window.openApiSpec` for legacy consumers.
 */
class OpenApiLoader {
    /**
     * Attempt to load the OpenAPI JSON from configured locations.
     * @returns {Promise<object|null>} parsed OpenAPI JSON or null on failure
     */
    static async load() {
        window.openApiSpec = null;
        const localFallback = '/assets/data/openapi.json';
        const tryUrls = [OPENAPI_SPEC_URL, localFallback];
        for (const url of tryUrls) {
            try {
                if (!url) continue;
                const res = await fetch(url);
                if (!res.ok) {
                    console.warn(`OpenAPI spec at ${url} returned ${res.status}`);
                    continue;
                }
                const json = await res.json();
                // Expose for legacy code that reads `window.openApiSpec`
                window.openApiSpec = json;
                console.log('Loaded OpenAPI spec from', url, json);
                return json;
            } catch (err) {
                console.warn(`Failed to fetch OpenAPI spec from ${url}:`, err);
            }
        }
        console.error('Failed to load OpenAPI spec from all known locations');
        return null;
    }
}

export default OpenApiLoader;
