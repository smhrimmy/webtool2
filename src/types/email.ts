// Email Diagnostics Types

export interface MXRecord {
  priority: number;
  host: string;
  responseTime?: number;
}

export interface SPFRecord {
  raw: string;
  valid: boolean;
  mechanisms: string[];
  includes: string[];
  qualifier: 'pass' | 'softfail' | 'fail' | 'neutral';
  issues: string[];
}

export interface DKIMRecord {
  selector: string;
  found: boolean;
  publicKey?: string;
  keyType?: string;
  keySize?: number;
  valid: boolean;
  issues: string[];
}

export interface DMARCRecord {
  raw: string;
  valid: boolean;
  policy: 'none' | 'quarantine' | 'reject';
  subdomainPolicy?: 'none' | 'quarantine' | 'reject';
  percentage?: number;
  reportingEmail?: string[];
  forensicEmail?: string[];
  issues: string[];
}

export interface BIMIRecord {
  found: boolean;
  logoUrl?: string;
  vmcUrl?: string;
  valid: boolean;
  issues: string[];
}

export interface PTRRecord {
  ip: string;
  hostname: string;
  valid: boolean;
  matchesForward: boolean;
}

export interface EmailDNSResult {
  mx: MXRecord[];
  spf: SPFRecord | null;
  dkim: DKIMRecord[];
  dmarc: DMARCRecord | null;
  bimi: BIMIRecord | null;
  ptr: PTRRecord[];
}

export interface SMTPLogEntry {
  timestamp?: string;
  command: string;
  response?: string;
  status: 'success' | 'warning' | 'error';
  explanation: string;
}

export interface SMTPLogAnalysis {
  entries: SMTPLogEntry[];
  overallStatus: 'success' | 'warning' | 'error';
  summary: string;
  issues: string[];
  recommendations: string[];
}

export interface EmailTestResult {
  sent: boolean;
  smtpResponse?: string;
  messageId?: string;
  headers: Record<string, string>;
  riskScore: number;
  riskFactors: string[];
  deliverabilityScore: number;
}

export interface EmailHealthScore {
  overall: number;
  mx: number;
  spf: number;
  dkim: number;
  dmarc: number;
  compatibility: {
    gmail: 'pass' | 'warn' | 'fail';
    outlook: 'pass' | 'warn' | 'fail';
    yahoo: 'pass' | 'warn' | 'fail';
  };
}
