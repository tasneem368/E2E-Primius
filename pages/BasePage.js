/**
 * BasePage
 * ─────────────────────────────────────────────────────────────
 * Foundation class for every Page Object in this suite.
 * Wraps Playwright's Page API with reusable, well-named helpers
 * that keep individual page objects clean and DRY.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────

  /**
   * Navigate to a URL and wait for the network to settle.
   * @param {string} url - Full URL or path relative to baseURL
   * @param {'domcontentloaded'|'load'|'networkidle'} [waitUntil='domcontentloaded']
   */
  async navigateTo(url, waitUntil = 'domcontentloaded') {
    await this.page.goto(url, { waitUntil });
    // Best-effort settle for dynamically loaded content. primius.ai keeps
    // background connections open (analytics, chat widgets), so it never
    // reaches full network idle — never block on it. Tolerate the timeout
    // and let Playwright's per-locator auto-waiting handle readiness.
    await this.page.waitForLoadState('networkidle', { timeout: 3_000 }).catch(() => {});
  }

  // ── Element Interaction ───────────────────────────────────────────

  /**
   * Scroll the element into the viewport before interacting with it.
   * Prevents "element is not visible" failures on long pages.
   * @param {import('@playwright/test').Locator} locator
   */
  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to an element, then click it.
   * Safer than a bare click on off-screen elements.
   * @param {import('@playwright/test').Locator} locator
   */
  async scrollAndClick(locator) {
    await this.scrollToElement(locator);
    await locator.click();
  }

  /**
   * Wait for a locator to enter the 'visible' state.
   * @param {import('@playwright/test').Locator} locator
   * @param {number} [timeout=15000] - Milliseconds before timeout
   */
  async waitForVisible(locator, timeout = 15_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  // ── Data Extraction ───────────────────────────────────────────────

  /**
   * Return trimmed text content of an element.
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const text = await locator.textContent();
    return (text ?? '').trim();
  }

  /**
   * Check element visibility without throwing on failure.
   * Useful for conditional logic in tests.
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<boolean>}
   */
  async isVisible(locator) {
    return locator.isVisible();
  }

  // ── Page Info ─────────────────────────────────────────────────────

  /**
   * Return the current page URL.
   * @returns {Promise<string>}
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Return the current page <title>.
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return this.page.title();
  }
}
