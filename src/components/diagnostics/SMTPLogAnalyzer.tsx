import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertTriangle, CheckCircle2, XCircle, Copy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { SMTPLogAnalysis, SMTPLogEntry } from '@/types/email';

interface SMTPLogAnalyzerProps {
  onAnalyze?: (log: string) => Promise<SMTPLogAnalysis>;
}

function StatusBadge({ status }: { status: SMTPLogEntry['status'] }) {
  switch (status) {
    case 'success':
      return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />OK</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-warning text-warning-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Warn</Badge>;
    case 'error':
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
  }
}

const SAMPLE_LOG = `220 mail.example.com ESMTP Postfix
EHLO client.example.com
250-mail.example.com
250-PIPELINING
250-SIZE 52428800
250-STARTTLS
250 8BITMIME
STARTTLS
220 2.0.0 Ready to start TLS
EHLO client.example.com
250-mail.example.com
250-PIPELINING
250-SIZE 52428800
250 8BITMIME
AUTH LOGIN
334 VXNlcm5hbWU6
dXNlckBleGFtcGxlLmNvbQ==
334 UGFzc3dvcmQ6
cGFzc3dvcmQ=
235 2.7.0 Authentication successful
MAIL FROM:<sender@example.com>
250 2.1.0 Ok
RCPT TO:<recipient@gmail.com>
250 2.1.5 Ok
DATA
354 End data with <CR><LF>.<CR><LF>
.
250 2.0.0 Ok: queued as ABC123
QUIT
221 2.0.0 Bye`;

export function SMTPLogAnalyzer({ onAnalyze }: SMTPLogAnalyzerProps) {
  const [logInput, setLogInput] = useState('');
  const [analysis, setAnalysis] = useState<SMTPLogAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const parseLocalLog = (log: string): SMTPLogAnalysis => {
    const lines = log.split('\n').filter(l => l.trim());
    const entries: SMTPLogEntry[] = [];
    let overallStatus: SMTPLogAnalysis['overallStatus'] = 'success';
    const issues: string[] = [];
    const recommendations: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Server greeting
      if (line.startsWith('220')) {
        entries.push({
          command: 'SERVER GREETING',
          response: line,
          status: 'success',
          explanation: 'Server is ready and accepting connections',
        });
      }
      // EHLO/HELO
      else if (line.toUpperCase().startsWith('EHLO') || line.toUpperCase().startsWith('HELO')) {
        entries.push({
          command: line,
          status: 'success',
          explanation: 'Client identifies itself to the server',
        });
      }
      // STARTTLS
      else if (line.toUpperCase() === 'STARTTLS') {
        const nextLine = lines[i + 1] || '';
        const success = nextLine.startsWith('220');
        entries.push({
          command: 'STARTTLS',
          response: nextLine,
          status: success ? 'success' : 'error',
          explanation: success ? 'TLS encryption initiated successfully' : 'TLS handshake failed',
        });
        if (!success) {
          issues.push('TLS encryption failed - connection is not secure');
          overallStatus = 'error';
        }
      }
      // AUTH
      else if (line.toUpperCase().startsWith('AUTH')) {
        entries.push({
          command: line,
          status: 'success',
          explanation: 'Authentication initiated',
        });
      }
      // AUTH success/failure
      else if (line.startsWith('235')) {
        entries.push({
          command: 'AUTH RESULT',
          response: line,
          status: 'success',
          explanation: 'Authentication successful',
        });
      }
      else if (line.startsWith('535') || line.startsWith('530')) {
        entries.push({
          command: 'AUTH RESULT',
          response: line,
          status: 'error',
          explanation: 'Authentication failed - check username/password',
        });
        issues.push('Authentication failed');
        overallStatus = 'error';
      }
      // MAIL FROM
      else if (line.toUpperCase().startsWith('MAIL FROM')) {
        const nextLine = lines[i + 1] || '';
        const success = nextLine.startsWith('250');
        entries.push({
          command: line,
          response: nextLine,
          status: success ? 'success' : 'error',
          explanation: success ? 'Sender accepted' : 'Sender rejected - check SPF/sender permissions',
        });
        if (!success) {
          issues.push('Sender address rejected');
          if (overallStatus === 'success') overallStatus = 'warning';
        }
      }
      // RCPT TO
      else if (line.toUpperCase().startsWith('RCPT TO')) {
        const nextLine = lines[i + 1] || '';
        const success = nextLine.startsWith('250');
        entries.push({
          command: line,
          response: nextLine,
          status: success ? 'success' : nextLine.startsWith('4') ? 'warning' : 'error',
          explanation: success ? 'Recipient accepted' : 'Recipient rejected or deferred',
        });
        if (!success) {
          if (nextLine.startsWith('5')) {
            issues.push('Recipient rejected permanently');
            overallStatus = 'error';
          } else if (nextLine.startsWith('4')) {
            issues.push('Recipient temporarily unavailable');
            if (overallStatus === 'success') overallStatus = 'warning';
          }
        }
      }
      // DATA
      else if (line.toUpperCase() === 'DATA') {
        entries.push({
          command: 'DATA',
          status: 'success',
          explanation: 'Starting message body transmission',
        });
      }
      // Queued
      else if (line.startsWith('250') && line.toLowerCase().includes('queued')) {
        entries.push({
          command: 'MESSAGE QUEUED',
          response: line,
          status: 'success',
          explanation: 'Email accepted for delivery - but delivery is not guaranteed!',
        });
        recommendations.push('Email was accepted but "queued" does not mean delivered. Check recipient inbox and spam folder.');
      }
      // Generic errors
      else if (line.startsWith('4') || line.startsWith('5')) {
        entries.push({
          command: 'SERVER RESPONSE',
          response: line,
          status: line.startsWith('5') ? 'error' : 'warning',
          explanation: line.startsWith('5') ? 'Permanent error - message will not be retried' : 'Temporary error - server may retry',
        });
        if (line.startsWith('5')) overallStatus = 'error';
        else if (overallStatus === 'success') overallStatus = 'warning';
      }
    }

    // Add recommendations based on issues
    if (issues.length === 0 && entries.some(e => e.command === 'MESSAGE QUEUED')) {
      recommendations.push('SMTP transaction completed successfully, but monitor for bounce emails');
      recommendations.push('Check SPF, DKIM, and DMARC records if emails are going to spam');
    }

    return {
      entries,
      overallStatus,
      summary: overallStatus === 'success' 
        ? 'SMTP transaction completed successfully' 
        : overallStatus === 'warning'
        ? 'SMTP transaction completed with warnings'
        : 'SMTP transaction failed',
      issues,
      recommendations,
    };
  };

  const handleAnalyze = async () => {
    if (!logInput.trim()) {
      toast.error('Please paste SMTP log content');
      return;
    }

    setIsAnalyzing(true);
    try {
      if (onAnalyze) {
        const result = await onAnalyze(logInput);
        setAnalysis(result);
      } else {
        // Local parsing
        const result = parseLocalLog(logInput);
        setAnalysis(result);
      }
    } catch (err) {
      toast.error('Failed to analyze log');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = () => {
    setLogInput(SAMPLE_LOG);
    toast.success('Sample SMTP log loaded');
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          SMTP Log Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Paste SMTP Log</label>
            <Button variant="outline" size="sm" onClick={loadSample}>
              Load Sample
            </Button>
          </div>
          <Textarea
            placeholder="Paste your raw SMTP transaction log here...&#10;&#10;Example:&#10;220 mail.example.com ESMTP&#10;EHLO client.example.com&#10;250-mail.example.com..."
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
            className="min-h-[150px] font-mono text-xs"
          />
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !logInput.trim()}
          className="w-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Log'}
        </Button>

        {analysis && (
          <div className="space-y-4 pt-4 border-t border-border/30">
            {/* Summary */}
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="font-medium">{analysis.summary}</span>
              <StatusBadge status={analysis.overallStatus} />
            </div>

            {/* Transaction Steps */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {analysis.entries.map((entry, i) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-semibold text-primary">{entry.command}</code>
                      <StatusBadge status={entry.status} />
                    </div>
                    {entry.response && (
                      <code className="block text-xs text-muted-foreground">{entry.response}</code>
                    )}
                    <p className="text-xs">{entry.explanation}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Issues Found</h4>
                {analysis.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    {issue}
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary">Recommendations</h4>
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
