import { useScan } from '@/context/ScanContext';
import { EmailDNSPanel, SMTPLogAnalyzer } from '@/components/diagnostics';

export default function EmailHealth() {
  const { emailDNS, emailHealth, isLoading, result } = useScan();

  if (!result && !isLoading) {
     return <div className="p-8 text-center text-muted-foreground">Please run a scan from the Overview page first.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Health</h1>
        <p className="text-muted-foreground">DNS records for email deliverability (SPF, DKIM, DMARC) and SMTP analysis.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EmailDNSPanel 
          data={emailDNS} 
          healthScore={emailHealth} 
          isLoading={isLoading} 
        />
        <SMTPLogAnalyzer />
      </div>
    </div>
  );
}
