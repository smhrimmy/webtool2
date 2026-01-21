// WordPress Diagnostics Types

export interface WordPressCore {
  detected: boolean;
  version?: string;
  isLatest?: boolean;
  updateAvailable?: string;
  isMultisite?: boolean;
  isSubdirectory?: boolean;
  siteName?: string;
  siteDescription?: string;
}

export interface WordPressAPI {
  restApiEnabled: boolean;
  restApiVersion?: string;
  xmlRpcExposed: boolean;
  wpCronAccessible: boolean;
  adminAjaxAccessible: boolean;
  oEmbed?: boolean;
}

export interface WordPressPlugin {
  slug: string;
  name?: string;
  version?: string;
  isVulnerable?: boolean;
  vulnerabilityDetails?: string;
  lastUpdated?: string;
  isAbandoned?: boolean;
}

export interface WordPressTheme {
  slug: string;
  name?: string;
  version?: string;
  isChild?: boolean;
  parentTheme?: string;
}

export interface WordPressSecurity {
  xmlRpcExposed: boolean;
  userEnumeration?: boolean;
  debugModeEnabled?: boolean;
  directoryListingEnabled?: boolean;
  wpConfigExposed?: boolean;
  readmeExposed?: boolean;
  installScriptAccessible?: boolean;
}

export interface WordPressPerformance {
  ttfb?: number;
  cacheDetected?: boolean;
  cachePlugin?: string;
  adminAjaxHeavy?: boolean;
  heartbeatEnabled?: boolean;
}

export interface WordPressError {
  type: 'wsod' | '500' | '502' | '503' | 'memory' | 'fatal' | 'database' | 'plugin_conflict';
  message: string;
  possibleCauses: string[];
  suggestedFixes: string[];
}

export interface ContactForm {
  plugin: 'cf7' | 'wpforms' | 'gravity' | 'ninja' | 'formidable' | 'elementor' | 'custom' | 'unknown';
  detected: boolean;
  ajaxEnabled?: boolean;
  captchaType?: 'recaptcha_v2' | 'recaptcha_v3' | 'hcaptcha' | 'turnstile' | 'none';
  smtpConfigured?: boolean;
  issues: string[];
}

export interface WordPressDiagnostics {
  core: WordPressCore;
  api: WordPressAPI;
  plugins: WordPressPlugin[];
  themes: WordPressTheme[];
  security: WordPressSecurity;
  performance: WordPressPerformance;
  errors: WordPressError[];
  contactForms: ContactForm[];
}
