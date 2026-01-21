import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  Copy,
  Sparkles,
  Clock,
  Target,
  Wrench,
  User,
  Code,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import type { RootCauseAnalysis, RootCause, FixStep, DiagnosticSeverity } from '@/types/root-cause';

interface RootCauseEnginePanelProps {
  analysis: RootCauseAnalysis | null;
  severity: DiagnosticSeverity | null;
  isLoading: boolean;
  onRefresh?: () => void;
  error?: string;
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  let label = 'Low';
  
  if (confidence >= 80) {
    variant = 'default';
    label = 'High';
  } else if (confidence >= 50) {
    variant = 'secondary';
    label = 'Medium';
  } else {
    variant = 'destructive';
    label = 'Low';
  }
  
  return (
    <Badge variant={variant}>
      <Target className="h-3 w-3 mr-1" />
      {confidence}% {label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: RootCause['severity'] }) {
  const config: Record<string, { color: string; label: string }> = {
    critical: { color: 'bg-destructive', label: 'Critical' },
    high: { color: 'bg-destructive/80', label: 'High' },
    medium: { color: 'bg-warning', label: 'Medium' },
    low: { color: 'bg-secondary', label: 'Low' },
    info: { color: 'bg-muted', label: 'Info' },
  };
  
  const c = config[severity];
  return (
    <Badge className={c.color}>
      {c.label}
    </Badge>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: FixStep['difficulty'] }) {
  const config: Record<string, { label: string; color: string }> = {
    easy: { label: '🟢 Easy', color: 'text-success' },
    medium: { label: '🟡 Medium', color: 'text-warning' },
    hard: { label: '🟠 Hard', color: 'text-orange-500' },
    expert: { label: '🔴 Expert', color: 'text-destructive' },
  };
  
  const c = config[difficulty];
  return <span className={`text-xs ${c.color}`}>{c.label}</span>;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };
  
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2">
      <Copy className="h-3 w-3" />
    </Button>
  );
}

function Section({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
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
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function RootCauseEnginePanel({ 
  analysis, 
  severity, 
  isLoading, 
  onRefresh,
  error 
}: RootCauseEnginePanelProps) {
  if (isLoading) {
    return (
      <Card className="glass-panel border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Root Cause Analysis
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Analyzing...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-panel border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Brain className="h-5 w-5" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" className="mt-4">
              Retry Analysis
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-5 w-5" />
            AI Root Cause Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Run a domain scan to get AI-powered root cause analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Root Cause Analysis
          </CardTitle>
          {analysis.escalationRequired && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Escalation Required
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Primary Root Cause - Always visible at top */}
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Most Likely Root Cause
                </h3>
                <ConfidenceBadge confidence={analysis.primaryCause.confidence} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={analysis.primaryCause.severity} />
                  <Badge variant="outline">{analysis.primaryCause.category}</Badge>
                </div>
                <h4 className="font-medium text-lg">{analysis.primaryCause.title}</h4>
                <p className="text-muted-foreground">{analysis.primaryCause.description}</p>
              </div>
              
              {analysis.primaryCause.evidence.length > 0 && (
                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Evidence:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {analysis.primaryCause.evidence.map((e, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-success shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Estimated Resolution Time */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Estimated Resolution Time</span>
              </div>
              <Badge variant="secondary">{analysis.estimatedResolutionTime}</Badge>
            </div>

            {/* Fix Steps */}
            <Section title="Fix Steps (Checklist)" icon={Wrench}>
              <div className="space-y-3">
                {analysis.fixSteps.map((step, i) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center">
                          {step.order}
                        </Badge>
                        <span className="font-medium">{step.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.duration && (
                          <span className="text-xs text-muted-foreground">~{step.duration}</span>
                        )}
                        <DifficultyBadge difficulty={step.difficulty} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    {step.warning && (
                      <div className="flex items-center gap-2 text-xs text-warning">
                        <AlertTriangle className="h-3 w-3" />
                        {step.warning}
                      </div>
                    )}
                    
                    {step.code && (
                      <div className="relative">
                        <pre className="p-2 bg-background rounded text-xs font-mono overflow-x-auto">
                          {step.code}
                        </pre>
                        <CopyButton text={step.code} label="Code" />
                      </div>
                    )}
                    
                    {step.copyable && (
                      <div className="flex items-center justify-between p-2 bg-background rounded">
                        <code className="text-xs font-mono">{step.copyable}</code>
                        <CopyButton text={step.copyable} label="Value" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Customer Explanation */}
            <Section title="Customer-Friendly Explanation" icon={User}>
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm whitespace-pre-wrap">{analysis.customerExplanation}</p>
                <CopyButton text={analysis.customerExplanation} label="Explanation" />
              </div>
            </Section>

            {/* Agent Notes */}
            <Section title="Internal Agent Notes" icon={FileText} defaultOpen={false}>
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm whitespace-pre-wrap">{analysis.agentNotes}</p>
                <CopyButton text={analysis.agentNotes} label="Notes" />
              </div>
            </Section>

            {/* Developer Steps */}
            {analysis.developerSteps && (
              <Section title="Developer-Ready Steps" icon={Code} defaultOpen={false}>
                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <pre className="text-xs font-mono whitespace-pre-wrap">{analysis.developerSteps}</pre>
                  <CopyButton text={analysis.developerSteps} label="Developer steps" />
                </div>
              </Section>
            )}

            {/* Config Snippets */}
            {(analysis.dnsConfig || analysis.wpConfig) && (
              <Section title="Copy-Paste Configs" icon={Copy} defaultOpen={false}>
                <div className="space-y-3">
                  {analysis.dnsConfig && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">DNS Configuration</span>
                        <CopyButton text={analysis.dnsConfig} label="DNS config" />
                      </div>
                      <pre className="p-2 bg-background rounded text-xs font-mono overflow-x-auto">
                        {analysis.dnsConfig}
                      </pre>
                    </div>
                  )}
                  {analysis.wpConfig && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">WordPress Configuration</span>
                        <CopyButton text={analysis.wpConfig} label="WP config" />
                      </div>
                      <pre className="p-2 bg-background rounded text-xs font-mono overflow-x-auto">
                        {analysis.wpConfig}
                      </pre>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Secondary Causes */}
            {analysis.secondaryCauses.length > 0 && (
              <Section title={`Other Possible Causes (${analysis.secondaryCauses.length})`} icon={AlertTriangle} defaultOpen={false}>
                <div className="space-y-3">
                  {analysis.secondaryCauses.map((cause, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cause.title}</span>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={cause.severity} />
                          <ConfidenceBadge confidence={cause.confidence} />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{cause.description}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Escalation Info */}
            {analysis.escalationRequired && analysis.escalationReason && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Escalation Required
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  {analysis.escalationReason}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
