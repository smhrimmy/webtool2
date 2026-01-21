import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { DNSRegion, RecordType, PropagationStatus } from '@/types/diagnostic';
import { REGIONS, getCountryFlag } from '@/lib/dns-resolvers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DNSPropagationPanelProps {
  recordType: RecordType;
  regions: DNSRegion[];
  isLoading: boolean;
  onRefresh: () => void;
  autoRefresh: boolean;
  refreshInterval: number;
}

export function DNSPropagationPanel({
  recordType,
  regions,
  isLoading,
  onRefresh,
  autoRefresh,
  refreshInterval,
}: DNSPropagationPanelProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="space-y-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <AnimatePresence mode="wait">
        {REGIONS.map((regionName) => {
          const region = regions.find(r => r.name === regionName);
          const results = region?.results || [];

          return (
            <div key={regionName}>
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <div
                    key={`${regionName}-${idx}`}
                    className="px-4 py-3 flex items-center border-b border-white/5 hover:bg-white/5 transition-colors group relative"
                  >
                    {/* Left: Location Flag & Name */}
                    <div className="flex items-center gap-3 w-[140px] shrink-0">
                      <span className="text-xl">{getCountryFlag(result.countryCode)}</span>
                      <div className="text-sm font-bold text-white truncate">{result.location}</div>
                    </div>

                    {/* Center: IP Address (Highlighted) */}
                    <div className="flex-1 flex justify-center">
                       <span className="font-mono text-sm text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {result.values[0] || "No IP Found"}
                       </span>
                    </div>

                    {/* Right: Status & Latency */}
                    <div className="flex items-center gap-3 w-[140px] justify-end shrink-0">
                        {result.status === 'propagated' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 uppercase border border-green-500/30">
                                Resolved
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 uppercase border border-red-500/30">
                                Failed
                            </span>
                        )}
                        <div className="text-xs font-bold text-white w-[50px] text-right">
                          {result.responseTime}ms
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                // Loading Skeleton for row
                isLoading && (
                  <div className="px-4 py-3 flex items-center border-b border-white/5 opacity-50">
                    <div className="flex items-center gap-3 w-[140px]">
                       <div className="w-6 h-4 bg-white/10 rounded animate-pulse"></div>
                       <div className="w-20 h-3 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                       <div className="w-32 h-6 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3 w-[140px] justify-end">
                       <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                       <div className="w-8 h-3 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
