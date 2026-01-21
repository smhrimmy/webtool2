import { motion } from 'framer-motion';
import { Lock, AlertTriangle, Check, X, Clock, Shield, Globe, Calendar, FileKey, ExternalLink, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SSLInfo } from '@/types/diagnostic';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SSLPanelProps {
  data: SSLInfo | null;
  isLoading: boolean;
  error?: string;
}

export function SSLPanel({ data, isLoading, error }: SSLPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Checking SSL Certificate...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <span className="text-sm font-medium">{error || "No SSL Data Available"}</span>
      </div>
    );
  }

  const getExpiryColor = (days: number) => {
    if (days <= 0) return 'text-red-500';
    if (days <= 14) return 'text-red-500';
    if (days <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const InfoBlock = ({ label, value, icon: Icon, className }: { label: string; value: React.ReactNode; icon?: any; className?: string }) => (
    <div className={cn("p-3 rounded-lg bg-white/5 border border-white/10", className)}>
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="text-sm font-medium text-white break-words">{value}</div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <Badge
             variant="outline"
             className={cn(
               "border-none px-0 text-sm",
               data.valid ? 'text-green-500' : 'text-red-500'
             )}
           >
             {data.valid ? (
               <span className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                 <Check className="w-3 h-3" /> Valid Certificate
               </span>
             ) : (
               <span className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                 <X className="w-3 h-3" /> Invalid Certificate
               </span>
             )}
           </Badge>
        </div>
        {data.certificateId && (
          <a
            href={`https://crt.sh/?id=${data.certificateId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            crt.sh <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 gap-3">
        <InfoBlock 
          label="Issuer" 
          value={data.issuer} 
          icon={Shield} 
        />
        <InfoBlock 
          label="Common Name" 
          value={data.commonName || 'N/A'} 
          icon={Globe} 
        />
        <div className="grid grid-cols-2 gap-3">
          <InfoBlock 
            label="Issued" 
            value={formatDate(data.issueDate)} 
            icon={Calendar} 
          />
          <InfoBlock 
            label="Expires" 
            value={
              <span className={getExpiryColor(data.daysUntilExpiry)}>
                {formatDate(data.expiryDate)}
                <span className="block text-[10px] opacity-70">
                  {data.daysUntilExpiry > 0 ? `${data.daysUntilExpiry} days left` : 'Expired'}
                </span>
              </span>
            } 
            icon={Clock} 
          />
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">HSTS</div>
          {data.hasHSTS ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-600" />}
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TLS 1.3</div>
          {data.tlsVersions.includes('TLS 1.3') ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-600" />}
        </div>
      </div>

      {/* SAN Domains */}
      {data.sanDomains && data.sanDomains.length > 0 && (
        <div className="pt-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">SAN Domains ({data.sanDomains.length})</div>
          <ScrollArea className="h-20 w-full rounded-lg bg-black/20 border border-white/5 p-2">
            <div className="flex flex-wrap gap-1">
              {data.sanDomains.map((domain, idx) => (
                <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-gray-400 font-mono">
                  {domain}
                </span>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
