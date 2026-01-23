import { motion } from 'framer-motion';
import { useScan } from '@/context/ScanContext';
import { DNSPropagationPanel } from '@/components/DNSPropagationPanel';
import { WHOISPanel } from '@/components/WHOISPanel';
import { SSLPanel } from '@/components/SSLPanel';
import { WebsiteStatusPanel } from '@/components/WebsiteStatusPanel';
import { WAFCDNPanel } from '@/components/WAFCDNPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, Shield, Activity, Network, Search, MapPin, 
  Smartphone, Moon, Menu, Settings, Plus, CheckSquare 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function Diagnostics() {
  const { 
    result, 
    dnsResults, 
    selectedTypes, 
    isLoading, 
    runDiagnostics,
    setSelectedTypes
  } = useScan();

  const [domainInput, setDomainInput] = useState('');
  const [activeRecordType, setActiveRecordType] = useState('A');

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (domainInput) {
        // Ensure the selected type is included
        if (!selectedTypes.includes(activeRecordType as any)) {
            setSelectedTypes([activeRecordType as any]);
        }
        runDiagnostics(domainInput);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-800">
       {/* Teal Header */}
       <header className="bg-[#00a1c9] text-white shadow-sm">
         <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
           {/* Left: Logo & Nav */}
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
               <div className="relative w-8 h-8">
                  <Activity className="w-8 h-8 text-white absolute top-0 left-0 animate-pulse" />
                  <Globe className="w-8 h-8 text-white/30 absolute top-0 left-0" />
               </div>
               <span className="text-2xl font-light tracking-tight">DNS<span className="font-bold">CHECKER</span></span>
             </div>
             
             <nav className="hidden md:flex items-center h-14">
               <a href="#" className="h-full flex items-center px-4 bg-[#f1c40f] text-black font-medium text-sm">Home</a>
               <a href="#" className="h-full flex items-center px-4 text-white hover:bg-white/10 text-sm font-medium transition-colors">All Tools</a>
               <a href="#" className="h-full flex items-center px-4 text-white hover:bg-white/10 text-sm font-medium transition-colors">DNS Lookup</a>
               <a href="#" className="h-full flex items-center px-4 text-white hover:bg-white/10 text-sm font-medium transition-colors">Public DNS List</a>
             </nav>
           </div>

           {/* Right: Icons & IP */}
           <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-3 border-r border-white/20 pr-4">
                <Smartphone className="w-4 h-4 text-green-300" />
                <Globe className="w-4 h-4 text-yellow-300" />
                <Moon className="w-4 h-4 text-yellow-100" />
             </div>
             <div className="flex items-center gap-2 font-mono text-xs md:text-sm">
               <MapPin className="w-4 h-4 text-red-400" />
               <span>2409:40f2:11a5:84c8:b90e:1dcc:1f8e:a93f</span>
             </div>
           </div>
         </div>
       </header>

       <div className="max-w-[1600px] mx-auto p-4 md:p-6">
         <Tabs defaultValue="dns" className="w-full space-y-6">
           {/* Mobile Tabs / Tool Switcher */}
           <TabsList className="w-full max-w-2xl bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                <TabsTrigger value="dns" className="flex-1 gap-2 data-[state=active]:bg-[#00a1c9] data-[state=active]:text-white">DNS Propagation</TabsTrigger>
                <TabsTrigger value="whois" className="flex-1 gap-2 data-[state=active]:bg-[#00a1c9] data-[state=active]:text-white">WHOIS</TabsTrigger>
                <TabsTrigger value="ssl" className="flex-1 gap-2 data-[state=active]:bg-[#00a1c9] data-[state=active]:text-white">SSL Check</TabsTrigger>
           </TabsList>

           {/* DNS Content - Split View */}
           <TabsContent value="dns" className="mt-0">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               
               {/* Left Panel: Controls & List */}
               <div className="lg:col-span-4 space-y-0 shadow-sm rounded-t-lg overflow-hidden border border-gray-200 bg-white">
                 {/* Header */}
                 <div className="bg-[#e9ecef] px-4 py-3 border-b border-gray-200">
                   <h2 className="text-[#333] font-bold text-lg uppercase">DNS Check</h2>
                 </div>
                 
                 {/* Controls */}
                 <div className="p-4 bg-[#f8f9fa] border-b border-gray-200 space-y-4">
                   <form onSubmit={handleSearch} className="flex gap-2">
                     <Input 
                        placeholder="example.com" 
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                        className="bg-[#e9ecef] border-gray-300 text-gray-800 placeholder:text-gray-500 focus-visible:ring-[#00a1c9]"
                     />
                     <Select value={activeRecordType} onValueChange={setActiveRecordType}>
                        <SelectTrigger className="w-[80px] bg-white border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'TXT'].map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                     </Select>
                     <Button type="submit" disabled={isLoading} className="bg-[#0056b3] hover:bg-[#004494] text-white px-6">
                        {isLoading ? "..." : <Search className="w-4 h-4" />}
                        <span className="ml-2 hidden xl:inline">Search</span>
                     </Button>
                   </form>

                   <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-[#00a1c9] border-[#00a1c9]"><Settings className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-gray-200 border-gray-300 text-gray-600"><Plus className="w-4 h-4" /></Button>
                        
                        <div className="flex items-center gap-1.5 ml-2">
                            <div className="bg-[#00a1c9] text-white p-0.5 rounded text-[10px]"><CheckSquare className="w-3 h-3" /></div>
                            <span className="text-xs font-medium">CD Flag</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded">
                         <span className="text-xs">Refresh:</span>
                         <span className="bg-white px-1.5 rounded text-xs border border-gray-300">20</span>
                         <span className="text-xs">sec.</span>
                      </div>
                   </div>
                 </div>

                 {/* Results List */}
                 <div className="bg-white min-h-[600px]">
                    <DNSPropagationPanel
                        recordType={activeRecordType as any}
                        regions={dnsResults[activeRecordType] || []}
                        isLoading={isLoading}
                        onRefresh={() => result && runDiagnostics(result.domain)}
                        autoRefresh={false}
                        refreshInterval={0}
                    />
                 </div>
               </div>

               {/* Right Panel: Content & Map */}
               <div className="lg:col-span-8 space-y-8">
                 <div>
                    <h1 className="text-3xl font-bold text-[#333] mb-4">CHECK DNS PROPAGATION</h1>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Whether you have recently changed your DNS records, switched web host, or started a new website - checking whether the DNS records are propagated globally is essential. DNS Checker provides a free DNS propagation check service to check Domain Name System records against a selected list of DNS servers in multiple regions worldwide. Perform a quick DNS propagation lookup for any hostname or domain, and check DNS data collected from all available DNS Servers to confirm that the DNS records are fully propagated.
                    </p>
                 </div>

                 {/* Map Placeholder */}
                 <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="bg-[#f8f9fa] px-4 py-3 border-b border-gray-300 flex justify-between items-center">
                        <h3 className="font-bold text-[#333]">DNS Propagation Map by DNSChecker.org</h3>
                        <Button variant="ghost" size="sm"><Menu className="w-4 h-4" /></Button>
                    </div>
                    <div className="h-[400px] bg-[#e9ecef] relative flex items-center justify-center">
                        {/* Simple SVG World Map Placeholder */}
                        <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
                            <path d="M50,250 Q250,50 500,250 T950,250" fill="none" stroke="#00a1c9" strokeWidth="2" />
                            <text x="500" y="250" textAnchor="middle" className="text-4xl fill-gray-400 font-bold">World Map Visualization</text>
                        </svg>
                        
                        {/* Simulated Pins */}
                        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-ping delay-100"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-ping delay-200"></div>
                    </div>
                 </div>
               </div>

             </div>
           </TabsContent>

           {/* WHOIS Content */}
           <TabsContent value="whois">
              <div className="max-w-4xl mx-auto">
                 <WHOISPanel data={result?.whois || null} isLoading={isLoading} />
              </div>
           </TabsContent>

           {/* SSL Content */}
           <TabsContent value="ssl">
             <div className="max-w-4xl mx-auto">
                <SSLPanel data={result?.ssl || null} isLoading={isLoading} />
             </div>
           </TabsContent>

         </Tabs>
       </div>
    </div>
  );
}
