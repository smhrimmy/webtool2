export type RecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA' | 'SRV' | 'CAA';

export type PropagationStatus = 'propagated' | 'mismatch' | 'not_found' | 'pending';

export interface DNSResult {
  location: string;
  country: string;
  countryCode: string;
  resolver: string;
  resolverIP: string;
  values: string[];
  ttl: number;
  responseTime: number;
  status: PropagationStatus;
}

export interface DNSRegion {
  name: string;
  results: DNSResult[];
}

export interface WHOISData {
  domain: string;
  registrar: string;
  registrarWhoisServer: string;
  creationDate: string;
  expiryDate: string;
  updatedDate: string;
  status: string[];
  nameservers: string[];
  dnssec: string;
  registrarAbuseContact: string;
  isPrivate: boolean;
}

export interface SSLInfo {
  valid: boolean;
  issuer: string;
  commonName?: string;
  expiryDate: string;
  issueDate?: string;
  daysUntilExpiry: number;
  serialNumber?: string;
  sanDomains?: string[];
  tlsVersions: string[];
  hasHSTS: boolean;
  hstsMaxAge?: number;
  hstsIncludesSubdomains?: boolean;
  hstsPreload?: boolean;
  hasMixedContent: boolean;
  certificateId?: number;
}

export interface WebsiteStatus {
  statusCode: number;
  statusText: string;
  responseTime: number;
  serverType: string;
  ipv4: string;
  ipv6: string;
  redirectChain: string[];
  compression: string;
  phpVersion?: string;
}

export interface WordPressInfo {
  detected: boolean;
  version?: string;
  restApiEnabled: boolean;
  xmlRpcExposed: boolean;
  wpCronAccessible: boolean;
  adminAjaxAccessible: boolean;
  exposedPlugins: string[];
  exposedThemes: string[];
}

export interface EmailHealth {
  mxRecords: { priority: number; server: string }[];
  spfRecord: string;
  dkimFound: boolean;
  dmarcRecord: string;
  reverseDnsValid: boolean;
  blacklistStatus: { list: string; listed: boolean }[];
}

export interface RateLimitInfo {
  has429: boolean;
  hasWAF: boolean;
  wafType?: string;
  bruteForceProtection: boolean;
  crawlLimitDetected: boolean;
}

export interface WAFCDNProvider {
  provider: string;
  type: 'CDN' | 'WAF' | 'CDN+WAF';
  confidence: 'high' | 'medium' | 'low';
  evidence: string[];
}

export interface WAFCDNInfo {
  detected: WAFCDNProvider[];
  securityHeaders?: Record<string, string | boolean>;
}

export interface DiagnosticResult {
  domain: string;
  timestamp: string;
  dnsRecords: Record<RecordType, DNSRegion[]>;
  whois?: WHOISData;
  ssl?: SSLInfo;
  website?: WebsiteStatus;
  wordpress?: WordPressInfo;
  email?: EmailHealth;
  rateLimit?: RateLimitInfo;
  wafCdn?: WAFCDNInfo;
  aiAnalysis?: {
    customerExplanation: string;
    agentNotes: string;
    suggestedActions: string[];
    likelyRootCause: string;
  };
}

export interface ScanHistory {
  id: string;
  domain: string;
  timestamp: string;
  summary: {
    dnsStatus: PropagationStatus;
    sslValid: boolean;
    websiteUp: boolean;
    wordpressDetected: boolean;
  };
}
