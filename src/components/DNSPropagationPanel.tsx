/**
 * HostScope Diagnostic Tool
 * -------------------------
 * Features included in this build:
 * - Global DNS Propagation (Fast + Detailed split fetch)
 * - WHOIS Lookup with Privacy Detection & Copy Support
 * - SSL Certificate Analysis (CT Logs + Live Check)
 * - Server/Hosting/ISP Detection via IP Analysis
 * - CDN & WAF Detection (Cloudflare, AWS, etc.)
 * - Email Health Checks (MX, SPF, DMARC)
 *
 * Code execution starts below.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Link as LinkIcon, Activity, Globe, Server, Shield } from 'lucide-react';
import { DNSRegion, RecordType } from '@/types/diagnostic';
import { REGIONS, getCountryFlag } from '@/lib/dns-resolvers';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useScan } from '@/context/ScanContext';
import { Badge } from '@/components/ui/badge';

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
  const { result } = useScan();

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const stats = useMemo(() => {
    const allResults = regions.flatMap(r => r.results);
    const total = allResults.length;
    const propagated = allResults.filter(r => r.status === 'propagated').length;
    const percentage = total > 0 ? Math.round((propagated / total) * 100) : 0;
    
    // Extract unique values
    const uniqueValues = new Set(allResults.flatMap(r => r.values).filter(Boolean));
    const isFullyPropagated = uniqueValues.size === 1 && percentage === 100;
    
    return { total, propagated, percentage, uniqueValues: Array.from(uniqueValues), isFullyPropagated };
  }, [regions]);

  const hostingInfo = result?.website?.ipInfo;
  const wafCdn = result?.wafCdn;

  return (
    <div className="w-full space-y-4">
      {/* Network & Hosting Info Card (Only for A/AAAA Records) */}
      {(recordType === 'A' || recordType === 'AAAA') && (hostingInfo || wafCdn?.detected?.length > 0) && (
          <div className="bg-[#111111] border border-white/5 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hosting / ISP Info */}
              {hostingInfo && (
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Server className="w-4 h-4" />
                          <span className="font-medium">Hosting Provider / ISP</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-white font-medium text-lg">{hostingInfo.isp || hostingInfo.org || 'Unknown'}</span>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                              {hostingInfo.city && `${hostingInfo.city}, `}
                              {hostingInfo.country}
                          </span>
                      </div>
                  </div>
              )}
              
              {/* CDN / WAF Info */}
              {wafCdn?.detected?.length > 0 && (
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">CDN & Security</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {wafCdn.detected.map((item: any, i: number) => (
                              <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-gray-200">
                                  {item.provider} ({item.type})
                              </Badge>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Propagation Status Card */}
      <div className="bg-[#111111] border border-white/5 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${stats.percentage === 100 ? 'text-green-500' : 'text-orange-500'}`} />
                  <span className="font-medium text-white">Propagation Status</span>
              </div>
              <span className={`text-sm font-bold ${stats.percentage === 100 ? 'text-green-500' : 'text-orange-500'}`}>
                  {stats.percentage}%
              </span>
          </div>
          <Progress value={stats.percentage} className="h-2 mb-3 bg-white/5" indicatorClassName={stats.percentage === 100 ? 'bg-green-500' : 'bg-orange-500'} />
          
          <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{stats.propagated} / {stats.total} Servers</span>
              <span className={stats.isFullyPropagated ? 'text-green-400' : 'text-orange-400'}>
                  {stats.isFullyPropagated ? 'Propagation Completed' : 'Propagation In Progress'}
              </span>
          </div>
          
          {/* Unique Values Summary */}
          {stats.uniqueValues.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-gray-500 mb-2 block">Detected Records:</span>
                  <div className="flex flex-wrap gap-2">
                      {stats.uniqueValues.map((val, idx) => (
                          <div key={idx} className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-blue-400 border border-white/5 flex items-center gap-2">
                              {val}
                              <button onClick={() => copyToClipboard(val)} className="hover:text-white transition-colors">
                                  <LinkIcon className="w-3 h-3" />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>

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
                      className="px-4 py-3 flex items-start justify-between border-b border-white/5 hover:bg-white/5 transition-colors group min-h-[60px]"
                    >
                      {/* Left: Flag & Location & Provider */}
                      <div className="flex flex-col gap-1 max-w-[50%]">
                        <div className="flex items-center gap-2">
                           <span className="text-xl leading-none">{getCountryFlag(result.countryCode)}</span>
                           <span className="text-sm font-medium text-white">{result.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-7">
                            <span className="text-xs text-gray-400">{result.resolver}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-3 h-3 text-gray-500" />
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
                                         <LinkIcon className="w-3 h-3 text-gray-500 opacity-0 group-hover/ip:opacity-100 transition-opacity" />
                                         <span className="font-mono text-sm text-blue-400 hover:text-blue-300 hover:underline decoration-blue-400/30">
                                            {val}
                                         </span>
                                     </div>
                                 ))
                             ) : (
                                 <span className="text-xs text-gray-500 italic">No records found</span>
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
                    <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
                      <div className="flex flex-col gap-2 w-1/2">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-white/5 rounded animate-pulse"></div>
                            <div className="w-32 h-4 bg-white/5 rounded animate-pulse"></div>
                         </div>
                         <div className="ml-8 w-20 h-3 bg-white/5 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-24 h-4 bg-white/5 rounded animate-pulse"></div>
                         <div className="w-5 h-5 bg-white/5 rounded-full animate-pulse"></div>
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
