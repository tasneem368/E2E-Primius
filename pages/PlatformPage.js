/**
 * PlatformPage
 * ─────────────────────────────────────────────────────────────
 * Page Object for https://primius.ai/platform
 *
 * Organises all locators and user-facing interactions into
 * descriptive, reusable methods so test files stay concise.
 *
 * Sections covered:
 *   • Hero
 *   • Products (PrimeVision, PrimeLeads, PrimeRecruits, PrimeReachout, PrimeCRM)
 *   • Platform Features ("One Platform, Infinite Possibilities")
 *   • PrimeLeads form
 *   • PrimeRecruits form
 *   • "Why Primius.ai?" benefits
 *   • CTA section
 *   • Footer
 */
import { BasePage } from './BasePage.js';

export class PlatformPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Hero Section ─────────────────────────────────────────────
    /** Main hero heading (appears in slider; .first() pins to the initial one) */
    this.heroHeading = page
      .getByRole('heading', { name: 'Automate Repetition. Accelerate Growth' })
      .first();

    /** Primary "Start Your Experience" CTA in the hero (rendered as a <button>) */
    this.heroStartExperienceBtn = page
      .getByRole('button', { name: 'Start Your Experience' })
      .first();

    // ── Products Section ──────────────────────────────────────────
    /** "High-Output AI Automation" section heading */
    this.productsHeading = page
      .getByRole('heading', { name: 'High-Output AI Automation' })
      .first();

    /** Product card headings — .first() avoids duplication from carousel */
    this.primeVisionHeading  = page.getByRole('heading', { name: 'PrimeVision'  }).first();
    this.primeLeadsHeading   = page.getByRole('heading', { name: 'PrimeLeads'   }).first();
    this.primeRecruitsHeading = page.getByRole('heading', { name: 'PrimeRecruits' }).first();
    this.primeReachoutHeading = page.getByRole('heading', { name: 'PrimeReachout' }).first();
    this.primeCRMHeading     = page.getByRole('heading', { name: 'PrimeCRM'     }).first();

    /** All "Learn More" links across the product cards */
    this.learnMoreLinks = page.getByRole('link', { name: 'Learn More' });

    // ── Platform Features Section ─────────────────────────────────
    /** "One Platform, Infinite Possibilities" heading */
    this.platformFeaturesHeading = page.getByRole('heading', {
      name: 'One Platform, Infinite Possibilities',
    });

    /** Individual feature card headings */
    this.intelligentRPAFeature      = page.getByRole('heading', { name: 'Intelligent RPA' });
    this.agenticWorkflowsFeature    = page.getByRole('heading', { name: 'Agentic Workflows' });
    this.enterpriseSecurityFeature  = page.getByRole('heading', { name: 'Enterprise Security' });
    this.seamlessIntegrationFeature = page.getByRole('heading', { name: 'Seamless Integration' }).first();

    // ── PrimeLeads Form ───────────────────────────────────────────
    /** PrimeLeads form section heading */
    this.primeLeadsFormHeading = page.getByRole('heading', {
      name: 'Get Started Today With PrimeLeads',
    });

    /** Website URL text input (placeholder: "Enter your website (e.g. example.com)") */
    this.websiteUrlInput = page.getByPlaceholder(/enter your website/i);

    /** "Scan My Business" submit button */
    this.scanMyBusinessBtn = page.getByRole('button', { name: 'Scan My Business' });

    // ── PrimeRecruits Form ────────────────────────────────────────
    /** PrimeRecruits form section heading */
    this.primeRecruitsFormHeading = page.getByRole('heading', {
      name: 'Get Started With PrimeRecruits',
    });

    /** Job Title input (placeholder: "e.g., Senior Software Engineer") */
    this.jobTitleInput = page.getByPlaceholder(/senior software engineer/i);

    /** Hidden native file input (custom upload UI wraps it) */
    this.fileUploadInput = page.locator('input[type="file"]');

    /** "Find Candidates" submit button */
    this.findCandidatesBtn = page.getByRole('button', { name: 'Find Candidates' });

    // ── Why Primius.ai Section ────────────────────────────────────
    /** "Why Primius.ai?" section heading */
    this.whyPrimiusHeading = page.getByRole('heading', { name: 'Why Primius.ai?' });

    // ── CTA Section ───────────────────────────────────────────────
    /** "Ready to Transform Your Business?" section heading */
    this.ctaSectionHeading = page.getByRole('heading', {
      name: 'Ready to Transform Your Business?',
    });

    /** "Start Your Experience" button in the bottom CTA band (rendered as a <button>) */
    this.ctaStartExperienceBtn = page
      .getByRole('button', { name: 'Start Your Experience' })
      .last();

    /** "Schedule Demo" button (rendered as a <button>) */
    this.scheduleDemoBtn = page.getByRole('button', { name: 'Schedule Demo' });

    // ── Footer ────────────────────────────────────────────────────
    /**
     * Footer links are scoped to the <footer> (contentinfo) region — several
     * names (e.g. "Contact") also appear in the top nav, which would otherwise
     * cause strict-mode "resolved to 2 elements" failures.
     */
    const footer = page.getByRole('contentinfo');
    this.footerAboutUsLink  = footer.getByRole('link', { name: 'About Us' });
    this.footerContactLink  = footer.getByRole('link', { name: 'Contact'  });
    this.footerPrivacyLink  = footer.getByRole('link', { name: 'Privacy Policy' });

    /** Copyright notice */
    this.footerCopyrightText = footer.getByText(/© \d{4} Primius\.ai/);
  }

  // ── Navigation ────────────────────────────────────────────────────

  /**
   * Navigate to the platform page.
   * Reads PLATFORM_URL from the environment to support multiple environments.
   */
  async goto() {
    const url = process.env.PLATFORM_URL || 'https://primius.ai/platform';
    await this.navigateTo(url);
  }

  // ── Products Section ──────────────────────────────────────────────

  /**
   * Scroll to and return the count of "Learn More" links on the page.
   * @returns {Promise<number>}
   */
  async getLearnMoreLinksCount() {
    return this.learnMoreLinks.count();
  }

  // ── PrimeLeads Form ───────────────────────────────────────────────

  /** Scroll the PrimeLeads form into view. */
  async scrollToPrimeLeadsForm() {
    await this.scrollToElement(this.primeLeadsFormHeading);
  }

  /**
   * Type a website URL into the PrimeLeads input field.
   * @param {string} url
   */
  async fillWebsiteUrl(url) {
    await this.scrollToPrimeLeadsForm();
    await this.websiteUrlInput.fill(url);
  }

  /** Click the "Scan My Business" submit button. */
  async clickScanMyBusiness() {
    await this.scanMyBusinessBtn.click();
  }

  /**
   * Fill + submit the PrimeLeads form in one step (positive path).
   * @param {string} url - Website URL to enter
   */
  async submitPrimeLeadsForm(url) {
    await this.fillWebsiteUrl(url);
    await this.clickScanMyBusiness();
  }

  /** Clear the URL field and submit (negative / empty-input path). */
  async submitPrimeLeadsFormEmpty() {
    await this.scrollToPrimeLeadsForm();
    await this.websiteUrlInput.clear();
    await this.clickScanMyBusiness();
  }

  // ── PrimeRecruits Form ────────────────────────────────────────────

  /** Scroll the PrimeRecruits form into view. */
  async scrollToPrimeRecruitsForm() {
    await this.scrollToElement(this.primeRecruitsFormHeading);
  }

  /**
   * Type a job title into the PrimeRecruits input field.
   * @param {string} title
   */
  async fillJobTitle(title) {
    await this.scrollToPrimeRecruitsForm();
    await this.jobTitleInput.fill(title);
  }

  /** Click the "Find Candidates" submit button. */
  async clickFindCandidates() {
    await this.findCandidatesBtn.click();
  }

  /**
   * Fill + submit the PrimeRecruits form in one step (positive path).
   * @param {string} jobTitle
   */
  async submitPrimeRecruitsForm(jobTitle) {
    await this.fillJobTitle(jobTitle);
    await this.clickFindCandidates();
  }

  /** Clear the job title field and submit (negative / empty-input path). */
  async submitPrimeRecruitsFormEmpty() {
    await this.scrollToPrimeRecruitsForm();
    await this.jobTitleInput.clear();
    await this.clickFindCandidates();
  }

  // ── CTA Actions ───────────────────────────────────────────────────

  /** Scroll to and click the "Schedule Demo" button. */
  async clickScheduleDemo() {
    await this.scrollAndClick(this.scheduleDemoBtn);
  }
}
