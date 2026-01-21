import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Code2, 
  Palette, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Shield,
  Zap,
  FileWarning,
  MailQuestion,
  Bug
} from 'lucide-react';
import { useState } from 'react';
import type { WordPressDiagnostics, ContactForm, WordPressError } from '@/types/wordpress';

interface EnhancedWordPressPanelProps {
  data: WordPressDiagnostics | null;
  isLoading: boolean;
  error?: string;
}

function StatusIcon({ status }: { status: boolean | 'warning' }) {
  if (status === true) return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (status === 'warning') return <AlertTriangle className="h-4 w-4 text-warning" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

function SeverityBadge({ severity }: { severity: WordPressError['type'] }) {
  const config: Record<string, { label: string; variant: 'destructive' | 'secondary' | 'outline' }> = {
    wsod: { label: 'WSOD', variant: 'destructive' },
    '500': { label: '500 Error', variant: 'destructive' },
    '502': { label: '502 Error', variant: 'destructive' },
    '503': { label: '503 Error', variant: 'destructive' },
    memory: { label: 'Memory', variant: 'destructive' },
    fatal: { label: 'Fatal', variant: 'destructive' },
    database: { label: 'Database', variant: 'secondary' },
    plugin_conflict: { label: 'Plugin Conflict', variant: 'secondary' },
  };
  
  const c = config[severity] || { label: severity, variant: 'outline' };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

function Section({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
  badge,
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{title}</span>
          {badge}
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 pl-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ContactFormCard({ form }: { form: ContactForm }) {
  const pluginNames: Record<string, string> = {
    cf7: 'Contact Form 7',
    wpforms: 'WPForms',
    gravity: 'Gravity Forms',
    ninja: 'Ninja Forms',
    formidable: 'Formidable Forms',
    elementor: 'Elementor Forms',
    custom: 'Custom/Theme Form',
    unknown: 'Unknown Form',
  };

  return (
    <div className="p-3 bg-muted/30 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{pluginNames[form.plugin]}</span>
        <StatusIcon status={form.issues.length === 0} />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {form.ajaxEnabled && <Badge variant="outline">AJAX</Badge>}
        {form.captchaType && form.captchaType !== 'none' && (
          <Badge variant="outline">{form.captchaType}</Badge>
        )}
        {form.smtpConfigured && <Badge variant="secondary">SMTP</Badge>}
      </div>
      {form.issues.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-border/30">
          {form.issues.map((issue, i) => (
            <p key={i} className="text-xs text-warning flex items-start gap-1">
              <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
              {issue}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function EnhancedWordPressPanel({ data, isLoading, error }: EnhancedWordPressPanelProps) {
  if (isLoading) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            WordPress Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-panel border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Code2 className="h-5 w-5" />
            WordPress Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.core.detected) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Code2 className="h-5 w-5" />
            WordPress Not Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This site does not appear to be running WordPress, or WordPress detection is blocked.
          </p>
        </CardContent>
      </Card>
    );
  }

  const vulnerablePlugins = data.plugins.filter(p => p.isVulnerable);
  const abandonedPlugins = data.plugins.filter(p => p.isAbandoned);

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            WordPress Diagnostics
          </CardTitle>
          <div className="flex items-center gap-2">
            {data.core.version && (
              <Badge variant="secondary">{data.core.version}</Badge>
            )}
            {data.core.isMultisite && (
              <Badge variant="outline">Multisite</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {/* Errors Section */}
            {data.errors.length > 0 && (
              <Section 
                title="Detected Errors" 
                icon={Bug}
                badge={<Badge variant="destructive">{data.errors.length}</Badge>}
              >
                <div className="space-y-3">
                  {data.errors.map((err, i) => (
                    <div key={i} className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={err.type} />
                        <span className="font-medium text-sm">{err.message}</span>
                      </div>
                      {err.possibleCauses.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Possible Causes:</p>
                          {err.possibleCauses.map((cause, j) => (
                            <p key={j} className="text-xs text-muted-foreground">• {cause}</p>
                          ))}
                        </div>
                      )}
                      {err.suggestedFixes.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-success">Suggested Fixes:</p>
                          {err.suggestedFixes.map((fix, j) => (
                            <p key={j} className="text-xs text-success">• {fix}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Security Section */}
            <Section title="Security" icon={Shield}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">XML-RPC</span>
                  <StatusIcon status={!data.security.xmlRpcExposed} />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">User Enumeration</span>
                  <StatusIcon status={!data.security.userEnumeration} />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">Debug Mode</span>
                  <StatusIcon status={!data.security.debugModeEnabled} />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">wp-config Exposed</span>
                  <StatusIcon status={!data.security.wpConfigExposed} />
                </div>
              </div>
              
              {data.security.xmlRpcExposed && (
                <p className="text-xs text-warning mt-2">
                  ⚠️ XML-RPC is exposed - consider disabling if not needed (security risk)
                </p>
              )}
            </Section>

            {/* Plugins Section */}
            {data.plugins.length > 0 && (
              <Section 
                title={`Plugins (${data.plugins.length})`} 
                icon={Code2}
                badge={
                  vulnerablePlugins.length > 0 ? (
                    <Badge variant="destructive">{vulnerablePlugins.length} vulnerable</Badge>
                  ) : undefined
                }
              >
                <div className="space-y-2">
                  {vulnerablePlugins.length > 0 && (
                    <div className="space-y-2 pb-2 border-b border-border/30">
                      <p className="text-xs font-medium text-destructive">Vulnerable Plugins:</p>
                      {vulnerablePlugins.map((plugin, i) => (
                        <div key={i} className="p-2 bg-destructive/10 rounded flex items-center justify-between">
                          <span className="text-sm">{plugin.name || plugin.slug}</span>
                          <Badge variant="destructive" className="text-xs">Vulnerable</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {abandonedPlugins.length > 0 && (
                    <div className="space-y-2 pb-2 border-b border-border/30">
                      <p className="text-xs font-medium text-warning">Potentially Abandoned:</p>
                      {abandonedPlugins.map((plugin, i) => (
                        <div key={i} className="p-2 bg-warning/10 rounded flex items-center justify-between">
                          <span className="text-sm">{plugin.name || plugin.slug}</span>
                          <Badge variant="secondary" className="text-xs">Abandoned?</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {data.plugins.filter(p => !p.isVulnerable && !p.isAbandoned).map((plugin, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded flex items-center justify-between">
                        <span className="text-sm">{plugin.name || plugin.slug}</span>
                        {plugin.version && (
                          <span className="text-xs text-muted-foreground">{plugin.version}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* Themes Section */}
            {data.themes.length > 0 && (
              <Section title={`Themes (${data.themes.length})`} icon={Palette} defaultOpen={false}>
                <div className="space-y-2">
                  {data.themes.map((theme, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded flex items-center justify-between">
                      <div>
                        <span className="text-sm">{theme.name || theme.slug}</span>
                        {theme.isChild && (
                          <span className="text-xs text-muted-foreground ml-2">(Child of {theme.parentTheme})</span>
                        )}
                      </div>
                      {theme.version && (
                        <span className="text-xs text-muted-foreground">{theme.version}</span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Contact Forms Section */}
            {data.contactForms.length > 0 && (
              <Section 
                title={`Contact Forms (${data.contactForms.length})`} 
                icon={MailQuestion}
                badge={
                  data.contactForms.some(f => f.issues.length > 0) ? (
                    <Badge variant="secondary">Issues found</Badge>
                  ) : undefined
                }
              >
                <div className="space-y-3">
                  {data.contactForms.map((form, i) => (
                    <ContactFormCard key={i} form={form} />
                  ))}
                </div>
              </Section>
            )}

            {/* Performance Section */}
            <Section title="Performance" icon={Zap} defaultOpen={false}>
              <div className="space-y-2">
                {data.performance.ttfb && (
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">TTFB</span>
                    <Badge variant={data.performance.ttfb < 500 ? 'default' : data.performance.ttfb < 1000 ? 'secondary' : 'destructive'}>
                      {data.performance.ttfb}ms
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">Cache Detected</span>
                  <StatusIcon status={data.performance.cacheDetected || false} />
                </div>
                {data.performance.cachePlugin && (
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">Cache Plugin</span>
                    <span className="text-xs text-muted-foreground">{data.performance.cachePlugin}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">admin-ajax Heavy</span>
                  <StatusIcon status={!data.performance.adminAjaxHeavy} />
                </div>
              </div>
            </Section>

            {/* API Status */}
            <Section title="API & Endpoints" icon={FileWarning} defaultOpen={false}>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">REST API</span>
                  <StatusIcon status={data.api.restApiEnabled} />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">WP-Cron</span>
                  <StatusIcon status={data.api.wpCronAccessible} />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">admin-ajax</span>
                  <StatusIcon status={data.api.adminAjaxAccessible} />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">XML-RPC</span>
                  <StatusIcon status={data.api.xmlRpcExposed ? 'warning' : false} />
                </div>
              </div>
            </Section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
