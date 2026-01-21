import { useState, useEffect } from 'react';
import { ScanHistory, DiagnosticResult } from '@/types/diagnostic';

const STORAGE_KEY = 'hostscope_scan_history';
const MAX_HISTORY = 20;

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addScan = (result: DiagnosticResult) => {
    const entry: ScanHistory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      domain: result.domain,
      timestamp: result.timestamp,
      summary: {
        dnsStatus: 'propagated', // Calculate based on results
        sslValid: result.ssl?.valid ?? false,
        websiteUp: result.website?.statusCode === 200,
        wordpressDetected: result.wordpress?.detected ?? false,
      },
    };

    const newHistory = [entry, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    
    // Also store full result
    localStorage.setItem(`hostscope_result_${entry.id}`, JSON.stringify(result));
    
    return entry.id;
  };

  const getScan = (id: string): DiagnosticResult | null => {
    const stored = localStorage.getItem(`hostscope_result_${id}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const clearHistory = () => {
    history.forEach(h => localStorage.removeItem(`hostscope_result_${h.id}`));
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return { history, addScan, getScan, clearHistory };
}
