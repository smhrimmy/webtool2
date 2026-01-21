import { motion } from 'framer-motion';
import { Globe, Server, Zap, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebsiteStatus } from '@/types/diagnostic';
import { cn } from '@/lib/utils';

interface WebsiteStatusPanelProps {
  data: WebsiteStatus | null;
  isLoading: boolean;
  error?: string;
}

export function WebsiteStatusPanel({ data, isLoading, error }: WebsiteStatusPanelProps) {
  if (isLoading) {
    return (
      <Card className="glass-panel shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Website Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Checking website...</span>
            </div>
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
            <Globe className="w-5 h-5 text-primary" />
            Website Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-destructive py-4">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'success';
    if (code >= 300 && code < 400) return 'warning';
    return 'destructive';
  };

  const statusColor = getStatusColor(data.statusCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-panel shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Website Status
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                statusColor === 'success' && 'border-success text-success',
                statusColor === 'warning' && 'border-warning text-warning',
                statusColor === 'destructive' && 'border-destructive text-destructive',
              )}
            >
              {data.statusCode} {data.statusText}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Response Time
              </div>
              <div className="text-sm font-mono font-medium">{data.responseTime}ms</div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Server className="w-3 h-3" />
                Server
              </div>
              <div className="text-sm font-mono font-medium">{data.serverType || 'Unknown'}</div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">IPv4</div>
              <div className="text-sm font-mono text-primary">{data.ipv4 || 'N/A'}</div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">IPv6</div>
              <div className="text-sm font-mono text-primary truncate">{data.ipv6 || 'N/A'}</div>
            </div>
          </div>

          {data.compression && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Compression:</span>
              <Badge variant="secondary">{data.compression}</Badge>
            </div>
          )}

          {data.phpVersion && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">PHP Version:</span>
              <Badge variant="secondary" className="font-mono">{data.phpVersion}</Badge>
            </div>
          )}

          {data.redirectChain.length > 1 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Redirect Chain</div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {data.redirectChain.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary truncate max-w-[200px]">{url}</span>
                      {idx < data.redirectChain.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
