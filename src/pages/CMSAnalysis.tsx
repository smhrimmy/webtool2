import { useScan } from '@/context/ScanContext';
import { WordPressPanel } from '@/components/WordPressPanel';

export default function CMSAnalysis() {
  const { result, isLoading } = useScan();

  if (!result && !isLoading) {
     return <div className="p-8 text-center text-muted-foreground">Please run a scan from the Overview page first.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CMS Analysis</h1>
        <p className="text-muted-foreground">WordPress and CMS specific vulnerability and configuration checks.</p>
      </div>
      <WordPressPanel data={result?.wordpress || null} isLoading={isLoading} />
    </div>
  );
}
