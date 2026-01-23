import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Link as LinkIcon } from 'lucide-react';
import { DNSRegion, RecordType } from '@/types/diagnostic';
import { REGIONS, getCountryFlag } from '@/lib/dns-resolvers';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <div className="w-full bg-white">
      <div className="flex flex-col">
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
                      className="px-4 py-3 flex items-start justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors group min-h-[60px]"
                    >
                      {/* Left: Flag & Location & Provider */}
                      <div className="flex flex-col gap-1 max-w-[50%]">
                        <div className="flex items-center gap-2">
                           <span className="text-xl leading-none">{getCountryFlag(result.countryCode)}</span>
                           <span className="text-sm font-medium text-gray-700">{result.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-7">
                            <span className="text-xs text-gray-500">{result.resolver}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-3 h-3 text-gray-300" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Provider: {result.resolver}</p>
                                        <p>IP: {result.resolverIP}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                      </div>

                      {/* Right: IPs & Status */}
                      <div className="flex items-start gap-3 justify-end flex-1">
                          <div className="flex flex-col items-end gap-1">
                             {result.values && result.values.length > 0 ? (
                                 result.values.map((val, vIdx) => (
                                     <div key={vIdx} className="flex items-center gap-1.5 group/ip cursor-pointer" onClick={() => copyToClipboard(val)}>
                                         <LinkIcon className="w-3 h-3 text-gray-300 opacity-0 group-hover/ip:opacity-100 transition-opacity" />
                                         <span className="font-mono text-sm text-blue-500 hover:text-blue-600 hover:underline decoration-blue-500/30">
                                            {val}
                                         </span>
                                     </div>
                                 ))
                             ) : (
                                 <span className="text-xs text-gray-400 italic">No records found</span>
                             )}
                          </div>
                          
                          <div className="pt-0.5">
                            {result.status === 'propagated' ? (
                                <Check className="w-5 h-5 text-green-500 font-bold" strokeWidth={3} />
                            ) : (
                                <span className="w-5 h-5 flex items-center justify-center text-red-500 font-bold text-lg">×</span>
                            )}
                          </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Loading Skeleton for row
                  isLoading && (
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                      <div className="flex flex-col gap-2 w-1/2">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-gray-100 rounded animate-pulse"></div>
                            <div className="w-32 h-4 bg-gray-100 rounded animate-pulse"></div>
                         </div>
                         <div className="ml-8 w-20 h-3 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-24 h-4 bg-gray-100 rounded animate-pulse"></div>
                         <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
