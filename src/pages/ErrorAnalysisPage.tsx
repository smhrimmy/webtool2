import { ErrorAnalysisPanel } from '@/components/error-analysis/ErrorAnalysisPanel';

export default function ErrorAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Error Analysis</h1>
          <p className="text-muted-foreground">Deep technical analysis of potential website errors and conflicts.</p>
        </div>
      </div>
      <ErrorAnalysisPanel />
    </div>
  );
}
