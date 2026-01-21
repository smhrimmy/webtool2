import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Server, Shield, AlertTriangle, CheckCircle2, XCircle, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { toast } from 'sonner';
import type { EmailDNSResult, EmailHealthScore } from '@/types/email';

interface EmailDNSPanelProps {
  data: EmailDNSResult | null;
  healthScore: EmailHealthScore | null;
  isLoading: boolean;
  error?: string;
}

function StatusIcon({ status }: { status: 'pass' | 'warn' | 'fail' | boolean }) {
  if (status === 'pass' || status === true) {
    return <CheckCircle2 className="h-4 w-4 text-success" />;
  } else if (status === 'warn') {
    return <AlertTriangle className="h-4 w-4 text-warning" />;
  }
  return <XCircle className="h-4 w-4 text-destructive" />;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${label || 'Value'} copied to clipboard`);
  };
  
  return (
    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy}>
      <Copy className="h-3 w-3" />
    </Button>
  );
}

function RecordSection({ 
  title, 
  icon: Icon, 
  children, 
  status,
  defaultOpen = true 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  status?: 'pass' | 'warn' | 'fail';
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {status && <StatusIcon status={status} />}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function EmailDNSPanel({ data, healthScore, isLoading, error }: EmailDNSPanelProps) {
  if (isLoading) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email DNS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-panel border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Mail className="h-5 w-5" />
            Email DNS Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-5 w-5" />
            Email DNS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No email DNS data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email DNS Configuration
          </CardTitle>
          {healthScore && (
            <div className="flex items-center gap-4">
              <Badge variant={healthScore.overall >= 80 ? 'default' : healthScore.overall >= 50 ? 'secondary' : 'destructive'}>
                Score: {healthScore.overall}%
              </Badge>
            </div>
          )}
        </div>
        
        {/* Provider Compatibility */}
        {healthScore && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
            <span className="text-sm text-muted-foreground">Provider Compatibility:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <StatusIcon status={healthScore.compatibility.gmail} />
                <span className="text-xs">Gmail</span>
              </div>
              <div className="flex items-center gap-1">
                <StatusIcon status={healthScore.compatibility.outlook} />
                <span className="text-xs">Outlook</span>
              </div>
              <div className="flex items-center gap-1">
                <StatusIcon status={healthScore.compatibility.yahoo} />
                <span className="text-xs">Yahoo</span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* MX Records */}
        <RecordSection 
          title={`MX Records (${data.mx.length})`} 
          icon={Server}
          status={data.mx.length > 0 ? 'pass' : 'fail'}
        >
          {data.mx.length > 0 ? (
            <div className="space-y-2">
              {data.mx.map((mx, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm font-mono">
                  <span>
                    <span className="text-muted-foreground mr-2">{mx.priority}</span>
                    {mx.host}
                  </span>
                  <CopyButton text={mx.host} label="MX record" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-destructive">No MX records found - email delivery will fail!</p>
          )}
        </RecordSection>

        {/* SPF Record */}
        <RecordSection 
          title="SPF Record" 
          icon={Shield}
          status={data.spf?.valid ? 'pass' : data.spf ? 'warn' : 'fail'}
        >
          {data.spf ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <code className="text-xs break-all">{data.spf.raw}</code>
                <CopyButton text={data.spf.raw} label="SPF record" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={data.spf.qualifier === 'fail' ? 'default' : data.spf.qualifier === 'softfail' ? 'secondary' : 'outline'}>
                  {data.spf.qualifier === 'fail' ? '-all (strict)' : 
                   data.spf.qualifier === 'softfail' ? '~all (softfail)' : 
                   data.spf.qualifier === 'neutral' ? '?all (neutral)' : '+all (open)'}
                </Badge>
              </div>
              {data.spf.issues.length > 0 && (
                <div className="space-y-1">
                  {data.spf.issues.map((issue, i) => (
                    <p key={i} className="text-xs text-warning flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {issue}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-destructive">No SPF record found - emails may be marked as spam!</p>
          )}
        </RecordSection>

        {/* DKIM Records */}
        <RecordSection 
          title={`DKIM Records (${data.dkim.length} found)`} 
          icon={Shield}
          status={data.dkim.some(d => d.valid) ? 'pass' : data.dkim.length > 0 ? 'warn' : 'fail'}
        >
          {data.dkim.length > 0 ? (
            <div className="space-y-2">
              {data.dkim.map((dkim, i) => (
                <div key={i} className="p-2 bg-muted/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Selector: {dkim.selector}</span>
                    <StatusIcon status={dkim.valid} />
                  </div>
                  {dkim.keyType && (
                    <p className="text-xs text-muted-foreground">
                      Key: {dkim.keyType.toUpperCase()} {dkim.keySize ? `(${dkim.keySize} bits)` : ''}
                    </p>
                  )}
                  {dkim.issues.map((issue, j) => (
                    <p key={j} className="text-xs text-warning">{issue}</p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warning">No DKIM records found with common selectors</p>
          )}
        </RecordSection>

        {/* DMARC Record */}
        <RecordSection 
          title="DMARC Policy" 
          icon={Shield}
          status={data.dmarc?.policy === 'reject' || data.dmarc?.policy === 'quarantine' ? 'pass' : data.dmarc ? 'warn' : 'fail'}
        >
          {data.dmarc ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <code className="text-xs break-all">{data.dmarc.raw}</code>
                <CopyButton text={data.dmarc.raw} label="DMARC record" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  data.dmarc.policy === 'reject' ? 'default' : 
                  data.dmarc.policy === 'quarantine' ? 'secondary' : 'outline'
                }>
                  Policy: {data.dmarc.policy}
                </Badge>
                {data.dmarc.percentage && data.dmarc.percentage < 100 && (
                  <Badge variant="outline">pct={data.dmarc.percentage}%</Badge>
                )}
              </div>
              {data.dmarc.issues.map((issue, i) => (
                <p key={i} className="text-xs text-warning flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {issue}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warning">No DMARC record found - recommended for email authentication</p>
          )}
        </RecordSection>

        {/* BIMI Record */}
        {data.bimi && (
          <RecordSection 
            title="BIMI (Brand Logo)" 
            icon={Mail}
            status={data.bimi.valid ? 'pass' : 'warn'}
            defaultOpen={false}
          >
            <div className="space-y-2">
              {data.bimi.logoUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Logo:</span>
                  <code className="text-xs">{data.bimi.logoUrl}</code>
                </div>
              )}
              {data.bimi.vmcUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">VMC:</span>
                  <code className="text-xs">{data.bimi.vmcUrl}</code>
                </div>
              )}
              {data.bimi.issues.map((issue, i) => (
                <p key={i} className="text-xs text-warning">{issue}</p>
              ))}
            </div>
          </RecordSection>
        )}
      </CardContent>
    </Card>
  );
}
