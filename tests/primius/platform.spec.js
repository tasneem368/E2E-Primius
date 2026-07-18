/**
 * platform.spec.js
 * ─────────────────────────────────────────────────────────────
 * End-to-End tests for https://primius.ai/platform
 *
 * Pattern  : Page Object Model (POM)
 * Structure: AAA — Arrange · Act · Assert
 * Coverage :
 *   ✅ Hero section visibility
 *   ✅ All five product cards
 *   ✅ Platform features ("One Platform, Infinite Possibilities")
 *   ✅ "Why Primius.ai?" benefits section
 *   ✅ PrimeLeads form — positive & negative paths
 *   ✅ PrimeRecruits form — positive & negative paths
 *   ✅ CTA section and action buttons
 *   ✅ Footer links and copyright
 */
import { test, expect } from '@playwright/test';
import { PlatformPage } from '../../pages/PlatformPage.js';
import { platformData }  from '../../test-data/platform.data.js';
import { waitForNetworkIdle } from '../../utils/helpers.js';

/**
 * Tests that actually submit the lead-gen forms create REAL leads in the
 * Primius backend. Skip them when running against production; set
 * TEST_ENV=staging (or anything other than "production") to exercise them.
 */
const SKIP_REAL_SUBMIT = (process.env.TEST_ENV || 'production') === 'production';

// ── Suite setup ───────────────────────────────────────────────────────────────
test.describe('Primius.ai — Platform Page', () => {
  /** @type {PlatformPage} */
  let platformPage;

  /**
   * Before each test: create a fresh PlatformPage and navigate.
   * Screenshots on failure are handled globally via playwright.config.js.
   */
  test.beforeEach(async ({ page }) => {
    platformPage = new PlatformPage(page);
    await platformPage.goto();
  });

  // ══════════════════════════════════════════════════════════════
  // HERO SECTION
  // ══════════════════════════════════════════════════════════════
  test.describe('Hero Section', () => {
    test('should display the main hero heading', async () => {
      // Assert — core value proposition must be immediately visible
      await expect(platformPage.heroHeading).toBeVisible();
      await expect(platformPage.heroHeading).toContainText(
        platformData.hero.heading,
      );
    });

    test('should display the hero "Start Your Experience" CTA button', async () => {
      // Assert — primary conversion action must be above the fold.
      // It is a <button>, so assert it is actionable rather than checking href.
      await expect(platformPage.heroStartExperienceBtn).toBeVisible();
      await expect(platformPage.heroStartExperienceBtn).toBeEnabled();
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PRODUCTS SECTION
  // ══════════════════════════════════════════════════════════════
  test.describe('Products Section', () => {
    test('should display the "High-Output AI Automation" section heading', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.productsHeading);

      // Assert
      await expect(platformPage.productsHeading).toBeVisible();
      await expect(platformPage.productsHeading).toContainText(
        platformData.sections.productsHeading,
      );
    });

    test('should display all five product card headings', async ({ page }) => {
      // Arrange
      await platformPage.scrollToElement(platformPage.productsHeading);

      // Assert — iterate over the expected product list for scalability
      for (const productName of platformData.products) {
        await expect(
          page.getByRole('heading', { name: productName }).first(),
        ).toBeVisible();
      }
    });

    test('should have at least one "Learn More" link per product', async () => {
      // Arrange
      const count = await platformPage.getLearnMoreLinksCount();

      // Assert
      expect(count).toBeGreaterThanOrEqual(platformData.minLearnMoreLinksCount);
    });

    test('PrimeVision "Learn More" link should point to the PrimeVision product page', async ({ page }) => {
      // Arrange
      await platformPage.scrollToElement(platformPage.primeVisionHeading);

      // Act — the first Learn More link in DOM order belongs to PrimeVision
      const primeVisionLearnMore = platformPage.learnMoreLinks.first();

      // Assert
      await expect(primeVisionLearnMore).toHaveAttribute('href', /primevision/i);
    });

    test('each product card heading should contain descriptive sub-text', async ({ page }) => {
      // Arrange
      const productDescriptions = [
        'Adaptive RPA for UI-driven tasks',
        'End-to-end lead discovery',
        'AI-driven candidate sourcing',
      ];

      // Assert — key descriptions appear somewhere on the page
      for (const desc of productDescriptions) {
        await expect(page.getByText(desc, { exact: false }).first()).toBeAttached();
      }
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PLATFORM FEATURES SECTION
  // ══════════════════════════════════════════════════════════════
  test.describe('Platform Features Section', () => {
    test('should display the "One Platform, Infinite Possibilities" heading', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.platformFeaturesHeading);

      // Assert
      await expect(platformPage.platformFeaturesHeading).toBeVisible();
    });

    test('should display all four platform feature cards', async ({ page }) => {
      // Arrange
      await platformPage.scrollToElement(platformPage.platformFeaturesHeading);

      // Assert — every feature card heading must be in the DOM
      for (const feature of platformData.platformFeatures) {
        await expect(
          page.getByRole('heading', { name: feature }).first(),
        ).toBeVisible();
      }
    });
  });

  // ══════════════════════════════════════════════════════════════
  // WHY PRIMIUS.AI SECTION
  // ══════════════════════════════════════════════════════════════
  test.describe('"Why Primius.ai?" Section', () => {
    test('should display the section heading', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.whyPrimiusHeading);

      // Assert
      await expect(platformPage.whyPrimiusHeading).toBeVisible();
    });

    test('should display all six benefit card headings', async ({ page }) => {
      // Arrange
      await platformPage.scrollToElement(platformPage.whyPrimiusHeading);

      // Assert — all benefits from the marketing copy must be rendered
      for (const benefit of platformData.benefits) {
        await expect(
          page.getByRole('heading', { name: benefit }).first(),
        ).toBeVisible();
      }
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PRIMELEADS FORM — POSITIVE TESTS
  // ══════════════════════════════════════════════════════════════
  test.describe('PrimeLeads Form — Positive Tests', () => {
    test('should display the PrimeLeads form with all required elements', async () => {
      // Arrange
      await platformPage.scrollToPrimeLeadsForm();

      // Assert
      await expect(platformPage.primeLeadsFormHeading).toBeVisible();
      await expect(platformPage.websiteUrlInput).toBeVisible();
      await expect(platformPage.scanMyBusinessBtn).toBeVisible();
    });

    test('should accept a valid website URL in the input field', async () => {
      // Arrange
      const { validWebsiteUrl } = platformData.primeLeadsForm;

      // Act
      await platformPage.fillWebsiteUrl(validWebsiteUrl);

      // Assert — the field value reflects exactly what was typed
      await expect(platformPage.websiteUrlInput).toHaveValue(validWebsiteUrl);
    });

    test('"Scan My Business" button should be enabled when URL field contains text', async () => {
      // Arrange
      const { validWebsiteUrl } = platformData.primeLeadsForm;

      // Act
      await platformPage.fillWebsiteUrl(validWebsiteUrl);

      // Assert
      await expect(platformPage.scanMyBusinessBtn).toBeEnabled();
    });

    test('should not navigate away from the platform page on valid form submit', async ({ page }) => {
      // Submits a real lead — only run outside production.
      test.skip(SKIP_REAL_SUBMIT, 'Creates a real lead; set TEST_ENV=staging to run');

      // Arrange
      const { validWebsiteUrl } = platformData.primeLeadsForm;

      // Act
      await platformPage.submitPrimeLeadsForm(validWebsiteUrl);
      await waitForNetworkIdle(page);

      // Assert — stay on platform page (may open a modal/inline result)
      await expect(page).not.toHaveURL(/error|404/i);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PRIMELEADS FORM — NEGATIVE TESTS
  // ══════════════════════════════════════════════════════════════
  test.describe('PrimeLeads Form — Negative Tests', () => {
    test('"Scan My Business" should be disabled when the URL field is empty', async () => {
      // Arrange
      await platformPage.scrollToPrimeLeadsForm();

      // Act — ensure the field is empty
      await platformPage.websiteUrlInput.clear();

      // Assert — the form blocks submission of an empty URL by disabling the button
      await expect(platformPage.scanMyBusinessBtn).toBeDisabled();
    });

    test('website URL input should be empty after clearing it', async () => {
      // Arrange
      await platformPage.scrollToPrimeLeadsForm();

      // Act — clear any pre-filled value
      await platformPage.websiteUrlInput.clear();

      // Assert
      await expect(platformPage.websiteUrlInput).toHaveValue('');
    });

    test('should not navigate away when submitted with an invalid URL format', async ({ page }) => {
      // Submits a real request — only run outside production.
      test.skip(SKIP_REAL_SUBMIT, 'Submits to the backend; set TEST_ENV=staging to run');

      // Arrange
      const { invalidWebsiteUrl } = platformData.primeLeadsForm;

      // Act
      await platformPage.fillWebsiteUrl(invalidWebsiteUrl);
      await platformPage.clickScanMyBusiness();
      await waitForNetworkIdle(page);

      // Assert — the page handles the error gracefully
      await expect(page).toHaveURL(/primius\.ai\/platform/);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PRIMERECRUITS FORM — POSITIVE TESTS
  // ══════════════════════════════════════════════════════════════
  test.describe('PrimeRecruits Form — Positive Tests', () => {
    test('should display the PrimeRecruits form with all required elements', async () => {
      // Arrange
      await platformPage.scrollToPrimeRecruitsForm();

      // Assert
      await expect(platformPage.primeRecruitsFormHeading).toBeVisible();
      await expect(platformPage.jobTitleInput).toBeVisible();
      await expect(platformPage.findCandidatesBtn).toBeVisible();
    });

    test('should accept a valid job title in the input field', async () => {
      // Arrange
      const { validJobTitle } = platformData.primeRecruitsForm;

      // Act
      await platformPage.fillJobTitle(validJobTitle);

      // Assert
      await expect(platformPage.jobTitleInput).toHaveValue(validJobTitle);
    });

    test('should expose a file upload input for the job description', async () => {
      // Arrange
      await platformPage.scrollToPrimeRecruitsForm();

      // Assert — the native file input must be attached (may be visually hidden)
      await expect(platformPage.fileUploadInput).toBeAttached();
    });

    test('"Find Candidates" button should be visible and disabled until the form is filled', async () => {
      // Arrange
      await platformPage.scrollToPrimeRecruitsForm();

      // Assert — the button stays disabled until a job title + file are supplied
      await expect(platformPage.findCandidatesBtn).toBeVisible();
      await expect(platformPage.findCandidatesBtn).toBeDisabled();
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PRIMERECRUITS FORM — NEGATIVE TESTS
  // ══════════════════════════════════════════════════════════════
  test.describe('PrimeRecruits Form — Negative Tests', () => {
    test('"Find Candidates" should be disabled when the job title is empty', async () => {
      // Arrange
      await platformPage.scrollToPrimeRecruitsForm();

      // Act — ensure the job title field is empty
      await platformPage.jobTitleInput.clear();

      // Assert — the form blocks submission of an empty required field
      await expect(platformPage.findCandidatesBtn).toBeDisabled();
    });

    test('job title input should be empty after clearing it', async () => {
      // Arrange
      await platformPage.scrollToPrimeRecruitsForm();

      // Act
      await platformPage.jobTitleInput.clear();

      // Assert
      await expect(platformPage.jobTitleInput).toHaveValue('');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // CTA SECTION
  // ══════════════════════════════════════════════════════════════
  test.describe('CTA Section', () => {
    test('should display the CTA section heading', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.ctaSectionHeading);

      // Assert
      await expect(platformPage.ctaSectionHeading).toBeVisible();
      await expect(platformPage.ctaSectionHeading).toContainText(
        platformData.sections.ctaHeading,
      );
    });

    test('"Start Your Experience" CTA button should be visible and enabled', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.ctaStartExperienceBtn);

      // Assert — it is a <button>, so assert it is actionable rather than checking href
      await expect(platformPage.ctaStartExperienceBtn).toBeVisible();
      await expect(platformPage.ctaStartExperienceBtn).toBeEnabled();
    });

    test('"Schedule Demo" link should be visible', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.scheduleDemoBtn);

      // Assert
      await expect(platformPage.scheduleDemoBtn).toBeVisible();
    });
  });

  // ══════════════════════════════════════════════════════════════
  // FOOTER NAVIGATION
  // ══════════════════════════════════════════════════════════════
  test.describe('Footer Navigation', () => {
    test('should display the "About Us" link pointing to the correct URL', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.footerAboutUsLink);

      // Assert
      await expect(platformPage.footerAboutUsLink).toBeVisible();
      await expect(platformPage.footerAboutUsLink).toHaveAttribute(
        'href',
        /about-us/i,
      );
    });

    test('should display the "Contact" link in the footer', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.footerContactLink);

      // Assert
      await expect(platformPage.footerContactLink).toBeVisible();
      await expect(platformPage.footerContactLink).toHaveAttribute(
        'href',
        /contact/i,
      );
    });

    test('should display the "Privacy Policy" link pointing to the correct URL', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.footerPrivacyLink);

      // Assert
      await expect(platformPage.footerPrivacyLink).toBeVisible();
      await expect(platformPage.footerPrivacyLink).toHaveAttribute(
        'href',
        /privacy-policy/i,
      );
    });

    test('should display a current-year copyright notice', async () => {
      // Arrange
      await platformPage.scrollToElement(platformPage.footerCopyrightText);

      // Assert — copyright text contains brand name
      await expect(platformPage.footerCopyrightText).toBeVisible();
      await expect(platformPage.footerCopyrightText).toContainText(
        platformData.footer.copyright,
      );
    });

    test('all footer product links should carry the correct href attribute', async ({ page }) => {
      // Act + Assert — validate href without causing a navigation
      const productToSlug = {
        PrimeVision:  'primevision',
        PrimeLeads:   'primeleads',
        PrimeRecruits:'primerecruits',
        PrimeReachout:'primereachout',
        PrimeCRM:     'primecrm',
      };

      for (const [name, slug] of Object.entries(productToSlug)) {
        // .last() prefers the footer link over card links higher on the page
        const link = page.getByRole('link', { name, exact: true }).last();
        await expect(link).toHaveAttribute('href', new RegExp(slug, 'i'));
      }
    });
  });
});
