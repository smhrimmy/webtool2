// Root Cause Analysis Types

export interface RootCause {
  id: string;
  category: 'dns' | 'email' | 'ssl' | 'wordpress' | 'server' | 'security' | 'performance';
  title: string;
  description: string;
  confidence: number; // 0-100
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  evidence: string[];
}

export interface FixStep {
  order: number;
  title: string;
  description: string;
  code?: string;
  codeLanguage?: string;
  copyable?: string;
  warning?: string;
  duration?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface RootCauseAnalysis {
  primaryCause: RootCause;
  secondaryCauses: RootCause[];
  fixSteps: FixStep[];
  customerExplanation: string;
  agentNotes: string;
  developerSteps: string;
  dnsConfig?: string;
  wpConfig?: string;
  estimatedResolutionTime: string;
  escalationRequired: boolean;
  escalationReason?: string;
}

export interface DiagnosticSeverity {
  overall: 'healthy' | 'warning' | 'critical' | 'error';
  dns: 'healthy' | 'warning' | 'critical' | 'error';
  email: 'healthy' | 'warning' | 'critical' | 'error';
  ssl: 'healthy' | 'warning' | 'critical' | 'error';
  wordpress: 'healthy' | 'warning' | 'critical' | 'error' | 'not_detected';
  website: 'healthy' | 'warning' | 'critical' | 'error';
}
