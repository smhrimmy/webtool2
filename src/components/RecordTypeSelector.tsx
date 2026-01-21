import { RecordType } from '@/types/diagnostic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface RecordTypeSelectorProps {
  selectedTypes: RecordType[];
  onToggle: (type: RecordType) => void;
  onSelectAll: () => void;
  disabled?: boolean;
}

const RECORD_TYPES: { type: RecordType; description: string; color: string }[] = [
  { type: 'A', description: 'IPv4 address', color: 'from-emerald-500/20 to-emerald-500/5' },
  { type: 'AAAA', description: 'IPv6 address', color: 'from-cyan-500/20 to-cyan-500/5' },
  { type: 'CNAME', description: 'Canonical name', color: 'from-blue-500/20 to-blue-500/5' },
  { type: 'MX', description: 'Mail exchange', color: 'from-violet-500/20 to-violet-500/5' },
  { type: 'TXT', description: 'Text records', color: 'from-amber-500/20 to-amber-500/5' },
  { type: 'NS', description: 'Nameservers', color: 'from-rose-500/20 to-rose-500/5' },
  { type: 'SOA', description: 'Start of authority', color: 'from-pink-500/20 to-pink-500/5' },
  { type: 'SRV', description: 'Service locator', color: 'from-indigo-500/20 to-indigo-500/5' },
  { type: 'CAA', description: 'Certificate authority', color: 'from-teal-500/20 to-teal-500/5' },
];

export function RecordTypeSelector({
  selectedTypes,
  onToggle,
  onSelectAll,
  disabled,
}: RecordTypeSelectorProps) {
  const allSelected = selectedTypes.length === RECORD_TYPES.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">DNS Record Types</h3>
        <button
          onClick={onSelectAll}
          disabled={disabled}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200",
            allSelected 
              ? "bg-primary/20 text-primary" 
              : "bg-secondary text-muted-foreground hover:text-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {RECORD_TYPES.map(({ type, description, color }) => {
          const isSelected = selectedTypes.includes(type);
          
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(type)}
              disabled={disabled}
              className={cn(
                'relative px-4 py-2.5 rounded-xl text-sm font-mono transition-all duration-200',
                'border group overflow-hidden',
                isSelected
                  ? 'border-primary/50 text-primary'
                  : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              title={description}
            >
              {/* Background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br transition-opacity duration-200",
                color,
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
              )} />
              
              {/* Content */}
              <div className="relative flex items-center gap-2">
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
                <span>{type}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
