import { motion } from 'framer-motion';
import { Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Retrieving WHOIS data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <span className="text-sm font-medium">{error || "No Data Available"}</span>
      </div>
    );
  }

  const InfoBlock = ({ label, value }: { label: string; value: string }) => (
    <div className="mb-6">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-bold text-white break-words">{value || "N/A"}</div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-4">
        <InfoBlock label="Registrar" value={data.registrar} />
        <InfoBlock label="Registered On" value={data.creationDate ? new Date(data.creationDate).toISOString().split('T')[0] : 'N/A'} />
        <InfoBlock label="Expiry Date" value={data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : 'N/A'} />
        <InfoBlock label="Updated On" value={data.updatedDate ? new Date(data.updatedDate).toISOString().split('T')[0] : 'N/A'} />
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Name Servers</div>
        <div className="flex flex-wrap gap-2">
          {data.nameservers.map((ns, idx) => (
            <span 
              key={idx} 
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => copyToClipboard(ns, `ns-${idx}`)}
            >
              {ns}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
         <div className="text-[10px] font-mono text-gray-600">Query ID: DX-{Math.floor(Math.random() * 9000) + 1000}-AF</div>
         <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/10 transition-colors">
            Refresh Data
         </button>
      </div>
    </div>
  );
}
