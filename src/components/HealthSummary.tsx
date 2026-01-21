import { motion } from 'framer-motion';
import { 
  Activity, 
  Globe, 
  Shield, 
  Lock, 
  Mail, 
  FileCode,
  AlertTriangle,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
import { DiagnosticResult } from '@/types/diagnostic';
import { cn } from '@/lib/utils';

interface HealthSummaryProps {
  result: DiagnosticResult | null;
  isLoading: boolean;
}

interface HealthItem {
  label: string;
  icon: any;
  status: 'success' | 'warning' | 'error' | 'pending';
  detail: string;
  score?: number;
}

export function HealthSummary({ result, isLoading }: HealthSummaryProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Health Overview</h2>
            <p className="text-sm text-muted-foreground">Analyzing domain...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="status-card animate-shimmer"
            >
              <div className="w-10 h-10 bg-muted/50 rounded-xl mb-3" />
              <div className="h-4 bg-muted/50 rounded w-16 mb-2" />
              <div className="h-3 bg-muted/30 rounded w-20" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!result) return null;

  const healthItems: HealthItem[] = [
    {
      label: 'DNS',
      icon: Globe,
      status: 'success',
      detail: 'Propagated',
      score: 100,
    },
    {
      label: 'Domain',
      icon: Shield,
      status: result.whois 
        ? (new Date(result.whois.expiryDate) > new Date() ? 'success' : 'error')
        : 'pending',
      detail: result.whois 
        ? (new Date(result.whois.expiryDate) > new Date() ? 'Valid' : 'Expired')
        : 'Checking...',
      score: result.whois ? (new Date(result.whois.expiryDate) > new Date() ? 100 : 0) : undefined,
    },
    {
      label: 'Website',
      icon: Activity,
      status: result.website 
        ? (result.website.statusCode === 200 ? 'success' : 'warning')
        : 'pending',
      detail: result.website 
        ? `${result.website.statusCode}`
        : 'Checking...',
      score: result.website ? (result.website.statusCode === 200 ? 100 : 50) : undefined,
    },
    {
      label: 'SSL',
      icon: Lock,
      status: result.ssl 
        ? (result.ssl.valid && result.ssl.daysUntilExpiry > 14 ? 'success' : 
           result.ssl.valid ? 'warning' : 'error')
        : 'pending',
      detail: result.ssl 
        ? (result.ssl.valid ? `${result.ssl.daysUntilExpiry}d` : 'Invalid')
        : 'Checking...',
      score: result.ssl ? (result.ssl.valid ? Math.min(100, result.ssl.daysUntilExpiry) : 0) : undefined,
    },
    {
      label: 'WordPress',
      icon: FileCode,
      status: result.wordpress 
        ? (result.wordpress.detected ? 'success' : 'warning')
        : 'pending',
      detail: result.wordpress 
        ? (result.wordpress.detected ? 'Detected' : 'Not Found')
        : 'Checking...',
    },
    {
      label: 'Email',
      icon: Mail,
      status: result.email 
        ? (result.email.mxRecords.length > 0 ? 'success' : 'error')
        : 'pending',
      detail: result.email 
        ? (result.email.mxRecords.length > 0 ? `${result.email.mxRecords.length} MX` : 'No MX')
        : 'Checking...',
    },
  ];

  const statusConfig = {
    success: {
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      glow: 'shadow-[0_0_20px_hsl(var(--success)/0.15)]',
    },
    warning: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      glow: 'shadow-[0_0_20px_hsl(var(--warning)/0.15)]',
    },
    error: {
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.15)]',
    },
    pending: {
      color: 'text-muted-foreground',
      bg: 'bg-muted/10',
      border: 'border-border/50',
      glow: '',
    },
  };

  const StatusIcon = ({ status }: { status: HealthItem['status'] }) => {
    if (status === 'success') return <Check className="w-3.5 h-3.5" />;
    if (status === 'warning') return <AlertTriangle className="w-3.5 h-3.5" />;
    if (status === 'error') return <X className="w-3.5 h-3.5" />;
    return <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />;
  };

  const overallScore = Math.round(
    healthItems.reduce((sum, item) => sum + (item.score ?? 0), 0) / 
    healthItems.filter(item => item.score !== undefined).length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="section-title-icon">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Health Overview</h2>
            <p className="text-sm text-muted-foreground">{result.domain}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Overall Score</p>
            <p className={cn(
              "text-2xl font-bold",
              overallScore >= 80 ? "text-success" : overallScore >= 50 ? "text-warning" : "text-destructive"
            )}>
              {overallScore}%
            </p>
          </div>
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            overallScore >= 80 ? "bg-success/20 text-success" : 
            overallScore >= 50 ? "bg-warning/20 text-warning" : 
            "bg-destructive/20 text-destructive"
          )}>
            {overallScore >= 80 ? <Check className="w-7 h-7" /> : 
             overallScore >= 50 ? <AlertTriangle className="w-7 h-7" /> : 
             <X className="w-7 h-7" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {healthItems.map((item, idx) => {
          const config = statusConfig[item.status];
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'status-card',
                config.bg,
                config.border,
                config.glow
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                config.bg
              )}>
                <item.icon className={cn('w-5 h-5', config.color)} />
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.label}</span>
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", config.bg)}>
                  <StatusIcon status={item.status} />
                </div>
              </div>
              <p className={cn('text-xs font-medium', config.color)}>{item.detail}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
