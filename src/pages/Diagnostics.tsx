import { motion } from 'framer-motion';
import { useScan } from '@/context/ScanContext';
import { DNSPropagationPanel } from '@/components/DNSPropagationPanel';
import { WHOISPanel } from '@/components/WHOISPanel';
import { SSLPanel } from '@/components/SSLPanel';
import { WebsiteStatusPanel } from '@/components/WebsiteStatusPanel';
import { WAFCDNPanel } from '@/components/WAFCDNPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Shield, Activity, Network, Server, Search, Mail } from 'lucide-react';
import { DomainSearch } from '@/components/DomainSearch';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Diagnostics() {
  const { 
    result, 
    dnsResults, 
    selectedTypes, 
    isLoading, 
    runDiagnostics, 
    history,
    setSelectedTypes,
    refreshWhois
  } = useScan();

  const [activeRecordType, setActiveRecordType] = useState('A');

  // Wrapper for runDiagnostics to ensure type is selected
  const handleSearch = (domain: string) => {
    if (!selectedTypes.includes(activeRecordType as any)) {
        setSelectedTypes([activeRecordType as any]);
    }
    runDiagnostics(domain);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
       {/* Header Bar with Search */}
       <div className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">Global DNS</h1>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <DomainSearch onSearch={handleSearch} isLoading={isLoading} history={history} />
          </div>
          
          <div className="w-8"></div> {/* Spacer to balance layout */}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {(isLoading || result) ? (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <Tabs defaultValue="dns" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-[#111111] border border-white/5 h-12 p-1 rounded-lg">
                        <TabsTrigger value="dns" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Network className="h-4 w-4"/> DNS</TabsTrigger>
                        <TabsTrigger value="whois" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Globe className="h-4 w-4"/> WHOIS</TabsTrigger>
                        <TabsTrigger value="ssl" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Shield className="h-4 w-4"/> SSL</TabsTrigger>
                        <TabsTrigger value="server" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Activity className="h-4 w-4"/> Server</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 bg-[#111111] rounded-xl border border-white/5 p-6 min-h-[500px]">
                        <TabsContent value="dns" className="mt-0 space-y-4">
                            {/* In-Tab Controls for DNS Type - Matching User Requirement for Features */}
                            <div className="flex items-center gap-4 mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-sm font-medium text-gray-400">Record Type:</span>
                                <Select value={activeRecordType} onValueChange={(val) => {
                                    setActiveRecordType(val);
                                    if (result) {
                                        setSelectedTypes([val as any]);
                                        runDiagnostics(result.domain);
                                    }
                                }}>
                                    <SelectTrigger className="w-[100px] bg-[#0a0a0a] border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                                        {['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'TXT'].map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <div className="h-6 w-px bg-white/10 mx-2"></div>
                                
                                <div className="flex items-center gap-2">
                                   <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                                     <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                                   </div>
                                   <span className="text-sm text-gray-400">CD Flag</span>
                                </div>

                                <div className="flex-1"></div>

                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                   <span>Refresh:</span>
                                   <div className="bg-[#0a0a0a] border border-white/10 px-2 py-1 rounded text-white font-mono">20</div>
                                   <span>sec</span>
                                </div>
                            </div>

                            <DNSPropagationPanel
                                recordType={activeRecordType as any}
                                regions={dnsResults[activeRecordType] || []}
                                isLoading={isLoading}
                                onRefresh={() => result && runDiagnostics(result.domain)}
                                autoRefresh={false}
                                refreshInterval={0}
                            />
                        </TabsContent>
                        
                        <TabsContent value="whois" className="mt-0">
                            <WHOISPanel 
                                data={result?.whois || null} 
                                isLoading={isLoading} 
                                onRefresh={refreshWhois}
                            />
                        </TabsContent>
                        
                        <TabsContent value="ssl" className="mt-0">
                            <SSLPanel data={result?.ssl || null} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="server" className="mt-0 space-y-6">
                            <WebsiteStatusPanel data={result?.website || null} isLoading={isLoading} />
                            <WAFCDNPanel data={result?.wafCdn || null} isLoading={isLoading} />
                        </TabsContent>
                    </div>
                </Tabs>
            </motion.div>
        ) : (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 bg-[#111111] rounded-3xl border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)]">
              <Search className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Analyze</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Enter a domain above to start a comprehensive diagnostic scan across global DNS nodes, WHOIS databases, and security checks.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center max-w-lg w-full">
              <div className="p-4 rounded-xl bg-[#111111] border border-white/5">
                <Globe className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-xs font-bold text-gray-400 uppercase">Global DNS</p>
              </div>
              <div className="p-4 rounded-xl bg-[#111111] border border-white/5">
                <Mail className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-xs font-bold text-gray-400 uppercase">Email Health</p>
              </div>
              <div className="p-4 rounded-xl bg-[#111111] border border-white/5">
                <Shield className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-xs font-bold text-gray-400 uppercase">Security</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
