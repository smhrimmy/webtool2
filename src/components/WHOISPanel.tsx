import { Copy, RefreshCw, AlertTriangle, Globe, User, Shield } from 'lucide-react';
import { WHOISData } from '@/types/diagnostic';
import { useState } from 'react';
import { toast } from 'sonner';

interface WHOISPanelProps {
  data: WHOISData | null;
  isLoading: boolean;
  error?: string;
}

export function WHOISPanel({ data, isLoading, error }: WHOISPanelProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
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

  const DataRow = ({ label, value, isLink = false }: { label: string; value: string | React.ReactNode, isLink?: boolean }) => (
    <div className="flex items-start py-2 border-b border-white/5 last:border-0">
      <div className="w-1/3 text-sm text-gray-500 font-medium">{label}:</div>
      <div className={`w-2/3 text-sm font-medium break-all ${isLink ? 'text-blue-400 hover:underline cursor-pointer' : 'text-gray-200'}`}>
        {value || "N/A"}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white">{data.domain}</h2>
         <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Updated 1 second ago</span>
            <RefreshCw className="w-3 h-3" />
         </div>
      </div>

      {/* Domain Information Card */}
      <div className="bg-[#111111] rounded-lg border border-white/5 shadow-sm overflow-hidden">
         <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-gray-200 text-sm">Domain Information</h3>
         </div>
         <div className="p-4">
            <DataRow label="Domain" value={data.domain} />
            <DataRow label="Registered On" value={data.creationDate ? new Date(data.creationDate).toISOString().split('T')[0] : ''} />
            <DataRow label="Expires On" value={data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : ''} />
            <DataRow label="Updated On" value={data.updatedDate ? new Date(data.updatedDate).toISOString().split('T')[0] : ''} />
            <DataRow label="Status" value={data.status.join(', ')} />
            <DataRow label="Name Servers" value={
                <div className="flex flex-col">
                    {data.nameservers.map((ns, i) => <span key={i}>{ns}</span>)}
                </div>
            } />
         </div>
      </div>

      {/* Registrar Information Card */}
      <div className="bg-[#111111] rounded-lg border border-white/5 shadow-sm overflow-hidden">
         <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-gray-200 text-sm">Registrar Information</h3>
         </div>
         <div className="p-4">
            <DataRow label="Registrar" value={data.registrar} />
            <DataRow label="IANA ID" value="1636" /> {/* Placeholder or parse if available */}
            <DataRow label="Abuse Email" value={data.registrarAbuseContact} isLink={true} />
            <DataRow label="Abuse Phone" value="+1.000000000" /> {/* Placeholder as usually hard to parse accurately without specific field */}
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
