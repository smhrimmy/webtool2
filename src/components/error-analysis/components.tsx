import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react";
import { ErrorAnalysisResult } from "@/types/error-analysis";

export function ThemePluginConflicts({ data }: { data: ErrorAnalysisResult['themePlugin'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Theme & Plugin Conflicts
        </CardTitle>
        <CardDescription>
          Potential conflicts between installed themes and plugins
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.conflicts.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>No obvious conflicts detected.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {data.conflicts.map((conflict, i) => (
              <div key={i} className="p-4 border rounded-lg bg-card/50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{conflict.name}</span>
                      <Badge variant={conflict.type === 'theme' ? 'outline' : 'secondary'}>
                        {conflict.type}
                      </Badge>
                      <Badge variant={
                        conflict.severity === 'high' ? 'destructive' : 
                        conflict.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {conflict.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Conflicts with: <span className="font-medium text-foreground">{conflict.conflictWith}</span>
                    </p>
                    <p className="text-sm">{conflict.description}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm bg-muted/50 p-2 rounded">
                  <span className="font-semibold text-xs uppercase text-muted-foreground">Recommendation:</span>
                  <p>{conflict.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PhpCompatibility({ data }: { data: ErrorAnalysisResult['php'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          PHP Compatibility
        </CardTitle>
        <CardDescription>
          PHP version analysis and compatibility check
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Detected Version</p>
            <p className="text-2xl font-bold">{data.version || 'Unknown'}</p>
          </div>
          <Badge variant={data.isSupported ? 'default' : 'destructive'}>
            {data.isSupported ? 'Supported' : 'End of Life'}
          </Badge>
        </div>
        
        {data.issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Detected Issues</h4>
            {data.issues.map((issue, i) => (
              <div key={i} className="flex gap-2 text-sm p-2 rounded bg-muted/30">
                <AlertCircle className={`h-4 w-4 mt-0.5 ${
                  issue.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <div>
                  <p className="font-medium">{issue.message}</p>
                  <p className="text-xs text-muted-foreground capitalize">{issue.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ScriptErrors({ data }: { data: ErrorAnalysisResult['scripts'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-purple-500" />
          Script Errors
        </CardTitle>
        <CardDescription>
          JavaScript and frontend script analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>No script errors detected.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((script, i) => (
              <div key={i} className="p-3 border rounded bg-card/50 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]" title={script.file}>
                    {script.file}
                  </span>
                  <Badge variant="outline" className="text-xs">{script.type}</Badge>
                </div>
                <p className="font-medium text-red-500">{script.error}</p>
                {script.line && <p className="text-xs text-muted-foreground">Line: {script.line}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ServerConfigIssues({ data }: { data: ErrorAnalysisResult['server'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-slate-500" />
          Server Configuration
        </CardTitle>
        <CardDescription>
          Server environment and configuration issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
           <div className="flex justify-between text-sm mb-1">
             <span>Config Score</span>
             <span className="font-bold">{data.score}/100</span>
           </div>
           <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
             <div 
               className={`h-full ${data.score > 80 ? 'bg-green-500' : data.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
               style={{ width: `${data.score}%` }}
             />
           </div>
        </div>

        <div className="space-y-3">
          {data.issues.map((issue, i) => (
             <div key={i} className="flex gap-3 p-3 border rounded bg-card/50">
               <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  issue.severity === 'high' ? 'bg-red-500' : 
                  issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
               }`} />
               <div className="space-y-1">
                 <p className="text-sm font-medium leading-none">{issue.message}</p>
                 <p className="text-xs text-muted-foreground">{issue.recommendation}</p>
               </div>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Code2, Server } from "lucide-react";
