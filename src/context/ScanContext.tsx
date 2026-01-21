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

  const runDiagnostics = useCallback(async (searchDomain: string, isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsLoading(true);
    if (!isAutoRefresh) {
        setResult(null);
        setDnsResults({} as any);
        setEmailDNS(null);
        setEmailHealth(null);
        setRootCauseAnalysis(null);
    }
    setDomain(searchDomain);
    
    try {
      // Use ALL_RECORD_TYPES by default if selectedTypes is empty or just ['A'] to get comprehensive data
      const typesToScan = selectedTypes.length <= 1 ? ALL_RECORD_TYPES : selectedTypes;

      const [diagnosticsResponse, emailResult] = await Promise.all([
        fetch('/api/domain-diagnostics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: searchDomain, recordTypes: typesToScan })
        }),
        checkEmailDNS(searchDomain)
      ]);

      const diagnosticsData = await diagnosticsResponse.json();
      
      if (!diagnosticsResponse.ok) {
        throw new Error(diagnosticsData.error || 'Failed to fetch diagnostics');
      }

      setResult(diagnosticsData);
      setDnsResults(diagnosticsData.dnsRecords || {});
      setEmailDNS(emailResult);
      setEmailHealth(calculateEmailHealthScore(emailResult));
      
      if (!isAutoRefresh) {
          addScan(diagnosticsData);
          toast.success(`Scan complete for ${searchDomain}`);
          // Run AI analysis in background only on initial scan
          runRootCauseAnalysis(diagnosticsData);
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
      // Clear existing interval
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
      
      // Set new interval (every 30 seconds)
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
      clearResults
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
