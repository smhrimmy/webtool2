import { motion } from 'framer-motion';
import { FileCode, Check, X, AlertTriangle, Shield, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WordPressInfo } from '@/types/diagnostic';
import { cn } from '@/lib/utils';

interface WordPressPanelProps {
  data: WordPressInfo | null;
  isLoading: boolean;
  error?: string;
}

export function WordPressPanel({ data, isLoading, error }: WordPressPanelProps) {
  if (isLoading) {
    return (
      <Card className="glass-panel shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            WordPress Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Detecting WordPress...</span>
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
            <FileCode className="w-5 h-5 text-primary" />
            WordPress Detection
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

  if (!data.detected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="glass-panel shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                WordPress Detection
              </CardTitle>
              <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                Not Detected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This website does not appear to be running WordPress.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const StatusItem = ({ label, icon: Icon, enabled, warning = false }: { label: string; icon: any; enabled: boolean; warning?: boolean }) => (
    <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      {enabled ? (
        warning ? (
          <AlertTriangle className="w-4 h-4 text-warning" />
        ) : (
          <Check className="w-4 h-4 text-success" />
        )
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Card className="glass-panel shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              WordPress Detection
            </CardTitle>
            <Badge variant="outline" className="border-success text-success">
              {data.version ? `v${data.version}` : 'Detected'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatusItem label="REST API" icon={Zap} enabled={data.restApiEnabled} />
            <StatusItem label="wp-cron" icon={Clock} enabled={data.wpCronAccessible} />
            <StatusItem 
              label="XML-RPC" 
              icon={Shield} 
              enabled={data.xmlRpcExposed} 
              warning={data.xmlRpcExposed} 
            />
            <StatusItem label="admin-ajax" icon={Zap} enabled={data.adminAjaxAccessible} />
          </div>

          {data.exposedPlugins.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-warning" />
                Exposed Plugins ({data.exposedPlugins.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {data.exposedPlugins.slice(0, 10).map((plugin, idx) => (
                  <Badge key={idx} variant="secondary" className="font-mono text-xs">
                    {plugin}
                  </Badge>
                ))}
                {data.exposedPlugins.length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.exposedPlugins.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {data.exposedThemes.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Exposed Themes</div>
              <div className="flex flex-wrap gap-2">
                {data.exposedThemes.map((theme, idx) => (
                  <Badge key={idx} variant="secondary" className="font-mono text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
