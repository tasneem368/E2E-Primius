/**
 * platform.data.js
 * ─────────────────────────────────────────────────────────────
 * Centralised test data for all Primius platform page tests.
 *
 * Sensitive or environment-specific values are read from
 * environment variables so the same suite runs in dev, staging,
 * and production without code changes.
 */

export const platformData = {
  // ── Page URLs ─────────────────────────────────────────────────────
  urls: {
    platform:     process.env.PLATFORM_URL || 'https://primius.ai/platform',
    primeVision:  'https://primius.ai/products/primevision',
    primeLeads:   'https://primius.ai/products/primeleads',
    primeRecruits:'https://primius.ai/products/primerecruits',
    primeReachout:'https://primius.ai/products/primereachout',
    primeCRM:     'https://primius.ai/products/primecrm',
    aboutUs:      'https://primius.ai/about-us',
    contact:      'https://primius.ai/contact',
    privacyPolicy:'https://primius.ai/privacy-policy',
  },

  // ── Hero ──────────────────────────────────────────────────────────
  hero: {
    heading: 'Automate Repetition. Accelerate Growth',
  },

  // ── Products ──────────────────────────────────────────────────────
  /** All product names that must appear on the page */
  products: ['PrimeVision', 'PrimeLeads', 'PrimeRecruits', 'PrimeReachout', 'PrimeCRM'],

  /** Minimum "Learn More" link count (one per product, may appear multiple times) */
  minLearnMoreLinksCount: 5,

  // ── Platform Features ─────────────────────────────────────────────
  platformFeatures: [
    'Intelligent RPA',
    'Agentic Workflows',
    'Enterprise Security',
    'Seamless Integration',
  ],

  // ── Section Headings ──────────────────────────────────────────────
  sections: {
    productsHeading:         'High-Output AI Automation',
    platformHeading:         'One Platform, Infinite Possibilities',
    whyPrimiusHeading:       'Why Primius.ai?',
    ctaHeading:              'Ready to Transform Your Business?',
    primeLeadsFormHeading:   'Get Started Today With PrimeLeads',
    primeRecruitsFormHeading:'Get Started With PrimeRecruits',
  },

  // ── "Why Primius.ai?" Benefits ────────────────────────────────────
  benefits: [
    'Hybrid AI Technology',
    'No-Code Automation',
    'Enterprise-Ready',
    'Seamless Integration',
    'Continuous Learning',
    'ROI-Focused',
  ],

  // ── PrimeLeads Form ───────────────────────────────────────────────
  primeLeadsForm: {
    /** Valid URL — reads from env so QA can swap it without editing code */
    validWebsiteUrl:   process.env.TEST_WEBSITE_URL || 'https://example.com',
    /** Deliberately malformed URL for negative tests */
    invalidWebsiteUrl: 'not-a-valid-url-format',
    /** Empty string for empty-submission negative tests */
    emptyUrl:          '',
  },

  // ── PrimeRecruits Form ────────────────────────────────────────────
  primeRecruitsForm: {
    validJobTitle: process.env.TEST_JOB_TITLE || 'Senior Software Engineer',
    emptyJobTitle: '',
  },

  // ── CTA Buttons ───────────────────────────────────────────────────
  ctaButtons: {
    startExperience: 'Start Your Experience',
    scheduleDemo:    'Schedule Demo',
  },

  // ── Footer ────────────────────────────────────────────────────────
  footer: {
    products: ['PrimeVision', 'PrimeLeads', 'PrimeRecruits', 'PrimeReachout', 'PrimeCRM'],
    company:  ['About Us', 'Contact', 'Privacy Policy'],
    copyright: 'Primius.ai',
  },
};
