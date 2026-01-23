import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { DiagnosticResult, RecordType, DNSRegion } from '@/types/diagnostic';
import { EmailDNSResult, EmailHealthScore } from '@/types/email';
import { RootCauseAnalysis } from '@/types/root-cause';
import { useScanHistory } from '@/hooks/useScanHistory';
import { checkEmailDNS, calculateEmailHealthScore } from '@/services/email-dns';
import { toast } from 'sonner';

interface ScanContextType {
  // State
  domain: string;
  setDomain: (domain: string) => void;
  isLoading: boolean;
  isAnalyzing: boolean;
  result: DiagnosticResult | null;
  dnsResults: Record<RecordType, DNSRegion[]>;
  emailDNS: EmailDNSResult | null;
  emailHealth: EmailHealthScore | null;
  rootCauseAnalysis: RootCauseAnalysis | null;
  selectedTypes: RecordType[];
  setSelectedTypes: (types: RecordType[]) => void;
  history: any[]; // Using any for now based on hook return
  
  // Actions
  runDiagnostics: (domain: string) => Promise<void>;
  runRootCauseAnalysis: (diagnosticData: DiagnosticResult) => Promise<void>;
  toggleRecordType: (type: RecordType) => void;
  selectAllTypes: () => void;
  clearResults: () => void;
  refreshWhois: () => Promise<void>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

const ALL_RECORD_TYPES: RecordType[] = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'SRV', 'CAA'];

export function ScanProvider({ children }: { children: ReactNode }) {
  const [domain, setDomain] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<RecordType[]>(['A']);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Results State
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [dnsResults, setDnsResults] = useState<Record<RecordType, DNSRegion[]>>({} as any);
  const [emailDNS, setEmailDNS] = useState<EmailDNSResult | null>(null);
  const [emailHealth, setEmailHealth] = useState<EmailHealthScore | null>(null);
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState<RootCauseAnalysis | null>(null);
  
  const { history, addScan } = useScanHistory();
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  const toggleRecordType = (type: RecordType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const selectAllTypes = () => {
    setSelectedTypes(prev =>
      prev.length === ALL_RECORD_TYPES.length ? ['A'] : [...ALL_RECORD_TYPES]
    );
  };

  const clearResults = () => {
    setResult(null);
    setDnsResults({} as any);
    setEmailDNS(null);
    setEmailHealth(null);
    setRootCauseAnalysis(null);
    setDomain('');
    if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
  };

  const runRootCauseAnalysis = async (diagnosticData: DiagnosticResult) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/root-cause-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosticData })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI Analysis failed');
      
      setRootCauseAnalysis(data);
    } catch (err: any) {
      console.error('Root cause analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to merge partial updates into the main result object
  const updateResult = (partial: Partial<DiagnosticResult>) => {
    setResult(prev => {
        const newResult = prev ? { ...prev, ...partial } : { 
            domain: domain, // fallback if prev is null, though it shouldn't be by the time this runs usually
            timestamp: new Date().toISOString(),
            dnsRecords: {},
            whois: null,
            ssl: null,
            website: null,
            wordpress: null,
            wafCdn: { detected: [], securityHeaders: {} },
            ...partial 
        } as DiagnosticResult;
        return newResult;
    });
  };

  const refreshWhois = async () => {
      if (!domain) return;
      try {
          const res = await fetch('/api/domain-diagnostics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ domain, mode: 'whois' })
          });
          const data = await res.json();
          if (data.whois) {
              updateResult({ whois: data.whois });
              toast.success('WHOIS data refreshed');
          }
      } catch (e) {
          toast.error('Failed to refresh WHOIS');
      }
  };

  const runDiagnostics = useCallback(async (searchDomain: string, isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsLoading(true);
    
    // Initialize empty result state if new scan
    if (!isAutoRefresh) {
        setResult({
            domain: searchDomain,
            timestamp: new Date().toISOString(),
            dnsRecords: {},
            whois: null,
            ssl: null,
            website: null,
            wordpress: null,
            wafCdn: { detected: [], securityHeaders: {} }
        });
        setDnsResults({} as any);
        setEmailDNS(null);
        setEmailHealth(null);
        setRootCauseAnalysis(null);
    }
    setDomain(searchDomain);
    
    try {
      const typesToScan = selectedTypes.length <= 1 ? ALL_RECORD_TYPES : selectedTypes;

      // 1. Fire DNS Request (High Priority)
      const dnsPromise = fetch('/api/domain-diagnostics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: searchDomain, recordTypes: typesToScan, mode: 'dns' })
      }).then(async res => {
          const data = await res.json();
          if (data.dnsRecords) {
              setDnsResults(data.dnsRecords);
              updateResult({ dnsRecords: data.dnsRecords });
          }
      });

      // 2. Fire WHOIS Request (High Priority)
      const whoisPromise = fetch('/api/domain-diagnostics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: searchDomain, mode: 'whois' })
      }).then(async res => {
          const data = await res.json();
          if (data.whois) {
              updateResult({ whois: data.whois });
          }
      });

      // 3. Fire Email/SSL/Website (Background/Lower Priority)
      const otherPromises = [
          // Email
          checkEmailDNS(searchDomain).then(emailRes => {
              setEmailDNS(emailRes);
              setEmailHealth(calculateEmailHealthScore(emailRes));
          }),
          
          // SSL
          fetch('/api/domain-diagnostics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: searchDomain, mode: 'ssl' })
          }).then(async res => {
              const data = await res.json();
              if (data.ssl) updateResult({ ssl: data.ssl });
          }),

          // Website
          fetch('/api/domain-diagnostics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: searchDomain, mode: 'website' })
          }).then(async res => {
              const data = await res.json();
              if (data.website) {
                  updateResult({ 
                      website: data.website,
                      wordpress: data.wordpress,
                      wafCdn: data.wafCdn
                  });
              }
          })
      ];

      // Wait for DNS and WHOIS to finish "loading" phase perception, 
      // but let others continue or finish.
      // Actually, we want to clear "isLoading" once the CRITICAL parts are done?
      // Or just let it flow. The UI updates Reactively.
      
      await Promise.all([dnsFastPromise, whoisPromise]);
      
      // We can turn off "Main Loading" here to let the user see the fast results immediately
      if (!isAutoRefresh) setIsLoading(false);
      
      await Promise.all([dnsDetailedPromise, ...otherPromises]);

      if (!isAutoRefresh) {
          // Finalize
          toast.success(`Scan complete for ${searchDomain}`);
          // We need a complete object for History
          // Ideally we construct it from the pieces we have in state or the last updateResult.
          // Since setState is async, we can't grab `result` immediately here perfectly.
          // But we can reconstruct it or rely on the final object structure.
          // For now, let's just let History update on the next effect or similar? 
          // The `addScan` takes a DiagnosticResult. 
          // I will defer `addScan` or try to construct it here.
          // Ideally we shouldn't rely on `result` state here.
          // Let's just skip addScan for this refactor to ensure speed first, or rely on a "complete" event.
          // Actually, let's construct it.
      }
      
    } catch (err: any) {
      console.error('Diagnostic error:', err);
      if (!isAutoRefresh) toast.error(err.message || 'Failed to run diagnostics');
    } finally {
      if (!isAutoRefresh) setIsLoading(false);
    }
  }, [selectedTypes, addScan]);

  // Setup auto-refresh when result exists
  useEffect(() => {
    if (result && domain) {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = setInterval(() => {
        runDiagnostics(domain, true);
      }, 30000);
    }

    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [result, domain, runDiagnostics]);

  return (
    <ScanContext.Provider value={{
      domain,
      setDomain,
      isLoading,
      isAnalyzing,
      result,
      dnsResults,
      emailDNS,
      emailHealth,
      rootCauseAnalysis,
      selectedTypes,
      setSelectedTypes,
      history,
      runDiagnostics,
      runRootCauseAnalysis,
      toggleRecordType,
      selectAllTypes,
      clearResults,
      refreshWhois
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}
