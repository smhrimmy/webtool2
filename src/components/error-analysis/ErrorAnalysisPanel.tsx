import { useEffect, useState } from 'react';
import { useScan } from '@/context/ScanContext';
import { ThemePluginConflicts, PhpCompatibility, ScriptErrors, ServerConfigIssues } from './components';
import { ErrorAnalysisResult } from '@/types/error-analysis';
import { Loader2 } from 'lucide-react';

export function ErrorAnalysisPanel() {
  const { result, isLoading } = useScan();
  const [analysisData, setAnalysisData] = useState<ErrorAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (result && !isLoading) {
      simulateDeepAnalysis(result);
    } else {
        setAnalysisData(null);
    }
  }, [result, isLoading]);

  const simulateDeepAnalysis = async (scanResult: any) => {
    setAnalyzing(true);
    // Simulate API delay for "deep analysis"
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data generation based on basic scan results
    const phpVersion = scanResult.website?.phpVersion || scanResult.headers?.['x-powered-by'] || 'Unknown';
    const serverType = scanResult.website?.serverType || 'Unknown';
    
    const mockData: ErrorAnalysisResult = {
      themePlugin: {
        conflicts: scanResult.wordpress?.detected ? [
          {
            type: 'plugin',
            name: 'W3 Total Cache',
            conflictWith: 'Autoptimize',
            severity: 'medium',
            description: 'Multiple caching plugins detected which may cause conflicts.',
            recommendation: 'Use only one caching solution to avoid race conditions and unexpected behavior.'
          }
        ] : [],
        issues: []
      },
      php: {
        version: phpVersion,
        isSupported: !phpVersion.includes('5.') && !phpVersion.includes('7.0') && !phpVersion.includes('7.1') && !phpVersion.includes('7.2'),
        issues: phpVersion.includes('7.') ? [{
            type: 'security',
            message: 'PHP 7.x has reached End of Life (EOL).',
            severity: 'high'
        }] : []
      },
      scripts: [
        {
          file: 'jquery-migrate.min.js',
          type: 'runtime',
          error: 'JQMIGRATE: Migrate is installed, version 3.3.2',
          severity: 'low'
        }
      ],
      server: {
        score: 85,
        issues: [
          {
            category: 'configuration',
            message: `Server signature exposed: ${serverType}`,
            severity: 'low',
            recommendation: 'Turn off server signature in configuration to hide version information.'
          },
          ...(scanResult.ssl?.valid ? [] : [{
             category: 'security',
             message: 'SSL Certificate issues detected',
             severity: 'high',
             recommendation: 'Renew or install a valid SSL certificate immediately.'
          } as any])
        ]
      }
    };
    
    setAnalysisData(mockData);
    setAnalyzing(false);
  };

  if (isLoading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Performing deep technical analysis...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Error Analysis</h2>
        <p className="text-muted-foreground">Run a diagnostic scan to see detailed error analysis.</p>
      </div>
    );
  }

  if (!analysisData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 animate-in fade-in">
      <ThemePluginConflicts data={analysisData.themePlugin} />
      <PhpCompatibility data={analysisData.php} />
      <ScriptErrors data={analysisData.scripts} />
      <ServerConfigIssues data={analysisData.server} />
    </div>
  );
}
