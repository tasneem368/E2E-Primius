/**
 * helpers.js
 * ─────────────────────────────────────────────────────────────
 * Pure utility functions shared across the test suite.
 * No Playwright imports — keep these framework-agnostic where
 * possible so they can be unit-tested independently.
 */

/**
 * Generate a timestamp string in "YYYYMMDD-HHmmss" format.
 * Useful for creating unique identifiers in test data.
 *
 * @returns {string} e.g. "20260531-143022"
 */
export function generateTimestamp() {
  return new Date()
    .toISOString()                    // "2026-05-31T14:30:22.000Z"
    .replace(/[-:T]/g, '')            // "20260531143022000Z"
    .slice(0, 14)                     // "20260531143022"
    .replace(/(\d{8})(\d{6})/, '$1-$2'); // "20260531-143022"
}

/**
 * Build a synthetic test URL that includes a timestamp path segment.
 * Helps avoid any server-side caching when submitting repeated form tests.
 *
 * @param {string} [base='https://example.com'] - Base website URL
 * @returns {string}
 */
export function generateTestWebsiteUrl(base = 'https://example.com') {
  return `${base}/test-${generateTimestamp()}`;
}

/**
 * Determine whether a string is a well-formed URL.
 * Uses the native URL constructor — no third-party dependencies.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure a URL starts with "https://".
 * Adds the scheme if the string omits it entirely.
 *
 * @param {string} url
 * @returns {string}
 */
export function ensureHttps(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Wait for the page network to go idle, tolerating long-running requests.
 * Wraps the Playwright call in a try/catch so tests are not blocked by
 * persistent background XHRs (analytics, chat widgets, etc.).
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} [timeout=5000] - Milliseconds to wait for idle
 */
export async function waitForNetworkIdle(page, timeout = 5_000) {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // Tolerated: the timeout simply means some background request is still
    // running; the visible content we care about is already rendered.
  }
}

/**
 * Return a URL-safe slug from a product name.
 * e.g. "PrimeCRM" → "primecrm"
 *
 * @param {string} productName
 * @returns {string}
 */
export function toProductSlug(productName) {
  return productName.toLowerCase().replace(/\s+/g, '-');
}
