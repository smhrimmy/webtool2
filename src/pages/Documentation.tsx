import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Documentation() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to the Website Diagnostic & Troubleshooting Tool
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <Card>
              <CardHeader>
                <CardTitle>Project Purpose</CardTitle>
                <CardDescription>A complete website diagnostic and troubleshooting tool for developers and site administrators.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>
                  This tool is designed to provide deep technical analysis of websites, identifying potential errors, misconfigurations, and vulnerabilities. 
                  It aggregates data from various sources (DNS, WHOIS, SSL Logs, HTTP Headers) and performs heuristic analysis to pinpoint root causes of common issues.
                </p>
                <p>
                  Key capabilities include:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Global DNS propagation checking</li>
                  <li>Email deliverability auditing (SPF, DMARC, DKIM)</li>
                  <li>SSL/TLS certificate verification</li>
                  <li>CMS detection and vulnerability scanning (WordPress, etc.)</li>
                  <li>Deep error analysis for PHP, scripts, and server configs</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="features">
            <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Error Analysis Engine
                    <Badge>New</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    The newly implemented Error Analysis engine performs a comprehensive scan for:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      <span>Theme/Plugin Conflicts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      <span>PHP Compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      <span>Custom Script Errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">4.</span>
                      <span>Server Configuration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diagnostics & Scanning</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    <strong>DNS Propagation:</strong> Checks DNS records across multiple global regions to ensure changes have propagated.
                  </p>
                  <p className="mt-2">
                    <strong>CMS Analysis:</strong> Detects WordPress versions, exposed APIs (REST, XML-RPC), and potential security risks.
                  </p>
                  <p className="mt-2">
                    <strong>Security Headers:</strong> Analyzes WAF/CDN presence and security headers like HSTS, CSP, and X-Frame-Options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-semibold mb-4">Usage Guide</h2>
            <Card>
              <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Starting a Scan</h3>
                  <p>Navigate to the <strong>Overview</strong> page and enter a domain name (e.g., example.com). Select the record types you wish to query and click "Diagnose".</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Interpreting Results</h3>
                  <p>Results are categorized into different sections accessible via the sidebar. Use <strong>Error Analysis</strong> for deep technical debugging and <strong>Diagnostics</strong> for raw data inspection.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Exporting Reports</h3>
                  <p>Diagnostic data is automatically saved to your local history. You can review previous scans at any time.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
               <nav className="flex flex-col space-y-2 text-sm">
                 <a href="#introduction" className="hover:underline text-primary">Introduction</a>
                 <a href="#features" className="hover:underline text-muted-foreground">Core Features</a>
                 <a href="#usage" className="hover:underline text-muted-foreground">Usage Guide</a>
               </nav>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
