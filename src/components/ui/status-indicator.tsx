import { cn } from '@/lib/utils';
import { Check, AlertTriangle, X, Loader2 } from 'lucide-react';
import { PropagationStatus } from '@/types/diagnostic';

interface StatusIndicatorProps {
  status: PropagationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StatusIndicator({ status, size = 'md', showLabel = false }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const statusConfig = {
    propagated: {
      icon: Check,
      className: 'text-success glow-success',
      label: 'Propagated',
    },
    mismatch: {
      icon: AlertTriangle,
      className: 'text-warning glow-warning',
      label: 'Mismatch',
    },
    not_found: {
      icon: X,
      className: 'text-destructive glow-error',
      label: 'Not Found',
    },
    pending: {
      icon: Loader2,
      className: 'text-muted-foreground animate-spin',
      label: 'Checking...',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex items-center justify-center rounded-full', sizeClasses[size])}>
        <Icon size={iconSize[size]} className={config.className} />
      </div>
      {showLabel && (
        <span className={cn('text-sm', config.className.split(' ')[0])}>
          {config.label}
        </span>
      )}
    </div>
  );
}
