import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Shield, Server, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { WAFCDNInfo } from '@/types/diagnostic';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WAFCDNPanelProps {
  data: WAFCDNInfo | null;
  isLoading: boolean;
}

const providerIcons: Record<string, string> = {
  'Cloudflare': '☁️',
  'Akamai': '🔷',
  'AWS CloudFront': '🟠',
  'Fastly': '⚡',
  'Sucuri': '🛡️',
  'Incapsula': '🔒',
  'Stackpath': '📦',
  'Bunny': '🐰',
  'Google Cloud CDN': '🔵',
  'Azure': '💠',
  'DDoS-Guard': '🛡️',
  'KeyCDN': '🔑',
};

const securityHeaderDescriptions: Record<string, string> = {
  'strict-transport-security': 'Forces HTTPS connections',
  'x-content-type-options': 'Prevents MIME type sniffing',
  'x-frame-options': 'Prevents clickjacking attacks',
  'x-xss-protection': 'Enables XSS filtering',
  'content-security-policy': 'Controls resource loading',
  'referrer-policy': 'Controls referrer information',
  'permissions-policy': 'Controls browser features',
  'x-permitted-cross-domain-policies': 'Controls Flash/PDF policies',
};

export function WAFCDNPanel({ data, isLoading }: WAFCDNPanelProps) {
  if (isLoading) {
    return (
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            WAF / CDN Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const hasProviders = data.detected && data.detected.length > 0;
  const securityHeaders = data.securityHeaders || {};
  const headerCount = Object.keys(securityHeaders).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            WAF / CDN Detection
            {hasProviders && (
              <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/30">
                {data.detected.length} detected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Detected Providers */}
          {hasProviders ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server className="h-4 w-4" />
                Detected Services
              </h4>
              <div className="grid gap-2">
                {data.detected.map((provider, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{providerIcons[provider.provider] || '🌐'}</span>
                      <div>
                        <div className="font-medium">{provider.provider}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider.evidence.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={
                          provider.type === 'CDN+WAF' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : provider.type === 'WAF'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }
                      >
                        {provider.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          provider.confidence === 'high'
                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                            : provider.confidence === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                        }
                      >
                        {provider.confidence}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <Info className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">No WAF/CDN Detected</div>
                <div className="text-sm text-muted-foreground">
                  This domain doesn't appear to be using a CDN or WAF service
                </div>
              </div>
            </div>
          )}

          {/* Security Headers */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="security-headers" className="border-border/50">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Headers
                  <Badge variant="outline" className="ml-2">
                    {headerCount} / 8
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {Object.entries(securityHeaderDescriptions).map(([header, desc]) => {
                    const hasHeader = header in securityHeaders;
                    return (
                      <div 
                        key={header}
                        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/20"
                      >
                        <div className="flex items-center gap-2">
                          {hasHeader ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500/60" />
                          )}
                          <div>
                            <code className="text-xs font-mono">{header}</code>
                            <div className="text-xs text-muted-foreground">{desc}</div>
                          </div>
                        </div>
                        <Badge variant={hasHeader ? 'default' : 'secondary'} className="text-xs">
                          {hasHeader ? 'Present' : 'Missing'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Recommendations */}
          {!hasProviders && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-yellow-500">Recommendation</div>
                <div className="text-muted-foreground">
                  Consider using a CDN/WAF service like Cloudflare to improve performance and security.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
