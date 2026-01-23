import { Copy, RefreshCw, AlertTriangle, Globe, User, Shield } from 'lucide-react';
import { WHOISData } from '@/types/diagnostic';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface WHOISPanelProps {
  data: WHOISData | null;
  isLoading: boolean;
  error?: string;
  onRefresh?: () => void;
}

export function WHOISPanel({ data, isLoading, error, onRefresh }: WHOISPanelProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRefresh = async () => {
      if (onRefresh) {
          setIsRefreshing(true);
          await onRefresh();
          setIsRefreshing(false);
      }
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3 bg-[#111111] rounded-lg border border-white/5">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Retrieving WHOIS data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3 bg-[#111111] rounded-lg border border-white/5">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <span className="text-sm font-medium">{error || "No Data Available"}</span>
      </div>
    );
  }

  const DataRow = ({ label, value, isLink = false, copyValue, fieldName }: { label: string; value: string | React.ReactNode, isLink?: boolean, copyValue?: string, fieldName?: string }) => (
    <div className="flex items-start py-2 border-b border-white/5 last:border-0 group">
      <div className="w-1/3 text-sm text-gray-500 font-medium">{label}:</div>
      <div className="w-2/3 flex items-start justify-between gap-2">
          <div className={`text-sm font-medium break-all ${isLink ? 'text-blue-400 hover:underline cursor-pointer' : 'text-gray-200'}`}>
            {value || "N/A"}
          </div>
          {(copyValue || (typeof value === 'string' && value)) && (
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"
                onClick={() => copyToClipboard(copyValue || (typeof value === 'string' ? value : ''), fieldName || label)}
             >
                <Copy className="w-3 h-3" />
             </Button>
          )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white">{data.domain}</h2>
         <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Updated just now</span>
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-white/10"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
            >
                <RefreshCw className={`w-4 h-4 text-blue-500 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            </Button>
         </div>
      </div>

      {/* Domain Information Card */}
      <div className="bg-[#111111] rounded-lg border border-white/5 shadow-sm overflow-hidden">
         <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-gray-200 text-sm">Domain Information</h3>
         </div>
         <div className="p-4">
            <DataRow label="Domain" value={data.domain} copyValue={data.domain} fieldName="Domain" />
            <DataRow label="Registered On" value={data.creationDate ? new Date(data.creationDate).toISOString().split('T')[0] : ''} />
            <DataRow label="Expires On" value={data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : ''} />
            <DataRow label="Updated On" value={data.updatedDate ? new Date(data.updatedDate).toISOString().split('T')[0] : ''} />
            <DataRow label="Status" value={data.status.join(', ')} />
            <div className="flex items-start py-2 border-b border-white/5 last:border-0 group">
                <div className="w-1/3 text-sm text-gray-500 font-medium">Name Servers:</div>
                <div className="w-2/3">
                    <div className="flex flex-col gap-1">
                        {data.nameservers.map((ns, i) => (
                            <div key={i} className="flex items-center justify-between group/ns">
                                <span className="text-sm font-medium text-gray-200">{ns}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 opacity-0 group-hover/ns:opacity-100 transition-opacity text-gray-500 hover:text-white"
                                    onClick={() => copyToClipboard(ns, 'Nameserver')}
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Registrar Information Card */}
      <div className="bg-[#111111] rounded-lg border border-white/5 shadow-sm overflow-hidden">
         <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-gray-200 text-sm">Registrar Information</h3>
         </div>
         <div className="p-4">
            <DataRow label="Registrar" value={data.registrar} copyValue={data.registrar} fieldName="Registrar" />
            <DataRow label="IANA ID" value="1636" /> 
            <DataRow label="Abuse Email" value={data.registrarAbuseContact} isLink={true} copyValue={data.registrarAbuseContact} fieldName="Abuse Email" />
            <DataRow label="Abuse Phone" value="+1.000000000" />
         </div>
      </div>

      {/* Registrant Contact Card */}
      <div className="bg-[#111111] rounded-lg border border-white/5 shadow-sm overflow-hidden">
         <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-gray-200 text-sm">Registrant Contact</h3>
         </div>
         <div className="p-4">
            <DataRow label="Country" value={data.isPrivate ? 'Redacted' : 'Unknown'} />
            <DataRow label="Email" value={`https://whois.registrar.com/whois?domain=${data.domain}`} isLink={true} />
         </div>
      </div>
    </div>
  );
}
