import { motion } from 'framer-motion';
import { Brain, User, FileText, Lightbulb, AlertCircle, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface AIAnalysisProps {
  analysis: {
    customerExplanation: string;
    agentNotes: string;
    suggestedActions: string[];
    likelyRootCause: string;
  } | null;
  isLoading: boolean;
  error?: string;
}

export function AIAnalysisPanel({ analysis, isLoading, error }: AIAnalysisProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (isLoading) {
    return (
      <Card className="glass-panel shadow-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              <Brain className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-muted-foreground animate-pulse">Analyzing diagnostic results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-panel shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-destructive py-4">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const Section = ({ 
    title, 
    icon: Icon, 
    content, 
    section,
    highlight = false 
  }: { 
    title: string; 
    icon: any; 
    content: string; 
    section: string;
    highlight?: boolean;
  }) => (
    <div className={`rounded-lg p-4 ${highlight ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(content, section)}
          className="h-6 w-6 p-0"
        >
          {copiedSection === section ? (
            <Check className="w-3 h-3 text-success" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground" />
          )}
        </Button>
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-panel shadow-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Analysis
            </CardTitle>
            <span className="text-xs text-muted-foreground">Powered by AI</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Section 
            title="Likely Root Cause" 
            icon={AlertCircle} 
            content={analysis.likelyRootCause}
            section="rootCause"
            highlight
          />
          
          <Section 
            title="Customer-Friendly Explanation" 
            icon={User} 
            content={analysis.customerExplanation}
            section="customer"
          />
          
          <Section 
            title="Internal Agent Notes" 
            icon={FileText} 
            content={analysis.agentNotes}
            section="agent"
          />

          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-warning" />
              <h4 className="text-sm font-medium">Suggested Actions</h4>
            </div>
            <ul className="space-y-2">
              {analysis.suggestedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary font-mono text-sm">{idx + 1}.</span>
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
