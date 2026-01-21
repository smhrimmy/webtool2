export interface ErrorAnalysisResult {
  themePlugin: {
    conflicts: Array<{
      type: 'theme' | 'plugin';
      name: string;
      conflictWith: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      recommendation: string;
    }>;
    issues: string[];
  };
  php: {
    version: string;
    isSupported: boolean;
    eolDate?: string;
    issues: Array<{
      type: 'deprecation' | 'compatibility' | 'security';
      message: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
  scripts: Array<{
    file: string;
    error?: string;
    type: 'syntax' | 'runtime' | 'network';
    severity: 'high' | 'medium' | 'low';
    line?: number;
  }>;
  server: {
    issues: Array<{
      category: 'security' | 'performance' | 'configuration';
      message: string;
      severity: 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
    score: number;
  };
}
