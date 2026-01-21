import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ScanHistory } from '@/types/diagnostic';

interface DomainSearchProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
  history: ScanHistory[];
}

export function DomainSearch({ onSearch, isLoading, history }: DomainSearchProps) {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (cleanDomain) {
      onSearch(cleanDomain);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full">
       <div className="relative flex-1">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
         <Input
           type="text"
           placeholder="google.com"
           value={domain}
           onChange={(e) => setDomain(e.target.value)}
           className="h-10 pl-10 pr-4 bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 rounded-l-md rounded-r-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors"
           disabled={isLoading}
         />
       </div>
       <Button
         type="submit"
         disabled={isLoading || !domain.trim()}
         className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-l-none rounded-r-md uppercase text-xs tracking-wider"
       >
         {isLoading ? (
           <>
             <Loader2 className="w-3 h-3 animate-spin mr-2" />
             Analyzing
           </>
         ) : (
           "Analyze"
         )}
       </Button>
    </form>
  );
}
