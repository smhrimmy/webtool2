import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Shield, Mail, CheckCircle2, AlertTriangle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface SPFGeneratorOptions {
  mode: 'safe' | 'strict' | 'transition';
  includes: string[];
  ips: string[];
  allowMx: boolean;
  allowA: boolean;
}

interface DKIMGeneratorOptions {
  selector: string;
  keySize: 1024 | 2048;
  cpanelCompatible: boolean;
}

interface DMARCGeneratorOptions {
  policy: 'none' | 'quarantine' | 'reject';
  subdomainPolicy?: 'none' | 'quarantine' | 'reject';
  percentage: number;
  reportingEmail: string;
  forensicEmail?: string;
  alignmentMode: 'relaxed' | 'strict';
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };
  
  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4 mr-2" />
      Copy
    </Button>
  );
}

export function EmailDNSGeneratorPanel() {
  // SPF State
  const [spfOptions, setSpfOptions] = useState<SPFGeneratorOptions>({
    mode: 'safe',
    includes: [],
    ips: [],
    allowMx: true,
    allowA: false,
  });
  const [newInclude, setNewInclude] = useState('');
  const [newIp, setNewIp] = useState('');

  // DKIM State
  const [dkimOptions, setDkimOptions] = useState<DKIMGeneratorOptions>({
    selector: 'default',
    keySize: 2048,
    cpanelCompatible: true,
  });

  // DMARC State
  const [dmarcOptions, setDmarcOptions] = useState<DMARCGeneratorOptions>({
    policy: 'none',
    percentage: 100,
    reportingEmail: '',
    alignmentMode: 'relaxed',
  });

  // Generate SPF Record
  const generateSPF = (): string => {
    const parts = ['v=spf1'];
    
    if (spfOptions.allowMx) parts.push('mx');
    if (spfOptions.allowA) parts.push('a');
    
    spfOptions.ips.forEach(ip => {
      if (ip.includes(':')) {
        parts.push(`ip6:${ip}`);
      } else if (ip.includes('/')) {
        parts.push(`ip4:${ip}`);
      } else {
        parts.push(`ip4:${ip}`);
      }
    });
    
    spfOptions.includes.forEach(inc => {
      parts.push(`include:${inc}`);
    });
    
    switch (spfOptions.mode) {
      case 'strict':
        parts.push('-all');
        break;
      case 'transition':
        parts.push('~all');
        break;
      case 'safe':
      default:
        parts.push('~all');
        break;
    }
    
    return parts.join(' ');
  };

  // Generate DKIM selector record name
  const generateDKIMRecordName = (): string => {
    return `${dkimOptions.selector}._domainkey.yourdomain.com`;
  };

  // Generate DKIM instructions
  const generateDKIMInstructions = (): string => {
    const lines = [
      `DKIM Setup Instructions for "${dkimOptions.selector}" selector:`,
      '',
      '1. Generate a key pair using one of these methods:',
      '',
    ];

    if (dkimOptions.cpanelCompatible) {
      lines.push(
        '   cPanel Method:',
        '   - Go to Email Deliverability in cPanel',
        '   - Click "Manage" next to your domain',
        '   - Click "Install the suggested record" for DKIM',
        '',
      );
    }

    lines.push(
      '   OpenSSL Method (Terminal):',
      `   openssl genrsa -out dkim_private.pem ${dkimOptions.keySize}`,
      '   openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem',
      '',
      '2. Create a TXT record with:',
      `   Name: ${dkimOptions.selector}._domainkey`,
      '   Value: v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE',
      '',
      '3. Configure your mail server to sign with the private key',
      '',
      `Key Size: ${dkimOptions.keySize} bits (${dkimOptions.keySize >= 2048 ? 'recommended' : 'minimum acceptable'})`,
    );

    return lines.join('\n');
  };

  // Generate DMARC Record
  const generateDMARC = (): string => {
    const parts = ['v=DMARC1'];
    
    parts.push(`p=${dmarcOptions.policy}`);
    
    if (dmarcOptions.subdomainPolicy) {
      parts.push(`sp=${dmarcOptions.subdomainPolicy}`);
    }
    
    if (dmarcOptions.percentage < 100) {
      parts.push(`pct=${dmarcOptions.percentage}`);
    }
    
    if (dmarcOptions.reportingEmail) {
      parts.push(`rua=mailto:${dmarcOptions.reportingEmail}`);
    }
    
    if (dmarcOptions.forensicEmail) {
      parts.push(`ruf=mailto:${dmarcOptions.forensicEmail}`);
    }
    
    if (dmarcOptions.alignmentMode === 'strict') {
      parts.push('adkim=s', 'aspf=s');
    }
    
    return parts.join('; ');
  };

  const addInclude = () => {
    if (newInclude && !spfOptions.includes.includes(newInclude)) {
      setSpfOptions(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude],
      }));
      setNewInclude('');
    }
  };

  const addIp = () => {
    if (newIp && !spfOptions.ips.includes(newIp)) {
      setSpfOptions(prev => ({
        ...prev,
        ips: [...prev.ips, newIp],
      }));
      setNewIp('');
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Email DNS Record Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spf">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spf">SPF</TabsTrigger>
            <TabsTrigger value="dkim">DKIM</TabsTrigger>
            <TabsTrigger value="dmarc">DMARC</TabsTrigger>
          </TabsList>

          {/* SPF Generator */}
          <TabsContent value="spf" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mode</Label>
                <div className="flex gap-2">
                  {(['safe', 'transition', 'strict'] as const).map(mode => (
                    <Button
                      key={mode}
                      variant={spfOptions.mode === mode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSpfOptions(prev => ({ ...prev, mode }))}
                    >
                      {mode === 'safe' && '🛡️ Safe (~all)'}
                      {mode === 'transition' && '⚠️ Transition (~all)'}
                      {mode === 'strict' && '🔒 Strict (-all)'}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {spfOptions.mode === 'safe' && 'Softfail unauthorized senders - good for testing'}
                  {spfOptions.mode === 'transition' && 'Softfail - use when migrating to strict'}
                  {spfOptions.mode === 'strict' && 'Hard fail unauthorized senders - maximum protection'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowMx">Allow MX hosts</Label>
                  <Switch
                    id="allowMx"
                    checked={spfOptions.allowMx}
                    onCheckedChange={(v) => setSpfOptions(prev => ({ ...prev, allowMx: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowA">Allow A record</Label>
                  <Switch
                    id="allowA"
                    checked={spfOptions.allowA}
                    onCheckedChange={(v) => setSpfOptions(prev => ({ ...prev, allowA: v }))}
                  />
                </div>
              </div>

              {/* Include domains */}
              <div className="space-y-2">
                <Label>Include Domains (e.g., _spf.google.com)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="_spf.google.com"
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                  />
                  <Button type="button" size="sm" onClick={addInclude}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {spfOptions.includes.map((inc, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {inc}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSpfOptions(prev => ({
                          ...prev,
                          includes: prev.includes.filter((_, j) => j !== i),
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* IP addresses */}
              <div className="space-y-2">
                <Label>IP Addresses</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="192.168.1.1 or 192.168.1.0/24"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIp())}
                  />
                  <Button type="button" size="sm" onClick={addIp}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {spfOptions.ips.map((ip, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {ip}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSpfOptions(prev => ({
                          ...prev,
                          ips: prev.ips.filter((_, j) => j !== i),
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generated SPF */}
              <div className="space-y-2 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <Label>Generated SPF Record</Label>
                  <CopyButton text={generateSPF()} label="SPF record" />
                </div>
                <div className="p-3 bg-muted/30 rounded font-mono text-sm break-all">
                  {generateSPF()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add this as a TXT record for your domain root (@)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* DKIM Generator */}
          <TabsContent value="dkim" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selector">Selector Name</Label>
                  <Input
                    id="selector"
                    placeholder="default"
                    value={dkimOptions.selector}
                    onChange={(e) => setDkimOptions(prev => ({ ...prev, selector: e.target.value || 'default' }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Size</Label>
                  <Select
                    value={String(dkimOptions.keySize)}
                    onValueChange={(v) => setDkimOptions(prev => ({ ...prev, keySize: parseInt(v) as 1024 | 2048 }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024">1024 bits (legacy)</SelectItem>
                      <SelectItem value="2048">2048 bits (recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cpanel">cPanel Compatible Instructions</Label>
                <Switch
                  id="cpanel"
                  checked={dkimOptions.cpanelCompatible}
                  onCheckedChange={(v) => setDkimOptions(prev => ({ ...prev, cpanelCompatible: v }))}
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <Label>DKIM Setup Instructions</Label>
                  <CopyButton text={generateDKIMInstructions()} label="DKIM instructions" />
                </div>
                <pre className="p-3 bg-muted/30 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
                  {generateDKIMInstructions()}
                </pre>
              </div>
            </div>
          </TabsContent>

          {/* DMARC Generator */}
          <TabsContent value="dmarc" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Policy</Label>
                <div className="flex gap-2">
                  {(['none', 'quarantine', 'reject'] as const).map(policy => (
                    <Button
                      key={policy}
                      variant={dmarcOptions.policy === policy ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDmarcOptions(prev => ({ ...prev, policy }))}
                      className="flex-1"
                    >
                      {policy === 'none' && '📊 None (Monitor)'}
                      {policy === 'quarantine' && '📥 Quarantine'}
                      {policy === 'reject' && '🚫 Reject'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subdomain Policy</Label>
                  <Select
                    value={dmarcOptions.subdomainPolicy || 'inherit'}
                    onValueChange={(v) => setDmarcOptions(prev => ({ 
                      ...prev, 
                      subdomainPolicy: v === 'inherit' ? undefined : v as any 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Inherit from parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Inherit from parent</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="quarantine">Quarantine</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Percentage: {dmarcOptions.percentage}%</Label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={dmarcOptions.percentage}
                    onChange={(e) => setDmarcOptions(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rua">Aggregate Report Email (rua)</Label>
                <Input
                  id="rua"
                  type="email"
                  placeholder="dmarc-reports@yourdomain.com"
                  value={dmarcOptions.reportingEmail}
                  onChange={(e) => setDmarcOptions(prev => ({ ...prev, reportingEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruf">Forensic Report Email (ruf) - Optional</Label>
                <Input
                  id="ruf"
                  type="email"
                  placeholder="dmarc-forensic@yourdomain.com"
                  value={dmarcOptions.forensicEmail || ''}
                  onChange={(e) => setDmarcOptions(prev => ({ ...prev, forensicEmail: e.target.value || undefined }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Alignment Mode</Label>
                <Select
                  value={dmarcOptions.alignmentMode}
                  onValueChange={(v) => setDmarcOptions(prev => ({ ...prev, alignmentMode: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed (recommended)</SelectItem>
                    <SelectItem value="strict">Strict</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <Label>Generated DMARC Record</Label>
                  <CopyButton text={generateDMARC()} label="DMARC record" />
                </div>
                <div className="p-3 bg-muted/30 rounded font-mono text-sm break-all">
                  {generateDMARC()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add this as a TXT record for _dmarc.yourdomain.com
                </p>

                {dmarcOptions.policy === 'none' && (
                  <div className="flex items-center gap-2 text-sm text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    Policy is set to "none" - no enforcement, monitoring only
                  </div>
                )}
                {dmarcOptions.policy === 'reject' && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Maximum protection - unauthorized emails will be rejected
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
