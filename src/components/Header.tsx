import { Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="bg-gradient-header border-b border-border/40 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-gradient-primary">Host</span>
                <span className="text-foreground">Scope</span>
              </h1>
              <p className="text-xs text-muted-foreground">Hosting Support Diagnostic Platform</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">All Systems Operational</span>
            </div>
            
            <Badge variant="outline" className="gap-2 px-3 py-1.5 border-border/50 bg-card/50">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs">Passive Mode</span>
            </Badge>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
