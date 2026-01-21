import { useState, useEffect } from "react";
import { ToolCard } from "./ToolCard";
import { Globe, User, Search, FileText, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export function UserAgentTool() {
  const [ua, setUa] = useState("");

  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="What is My User Agent?" 
            description="Check Your User Agent Information" 
            icon={User} 
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your User Agent</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div 
            className="p-4 bg-muted rounded-lg font-mono text-sm break-all cursor-pointer hover:bg-muted/80"
            onClick={() => { navigator.clipboard.writeText(ua); toast.success("Copied!"); }}
          >
            {ua}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This string identifies your browser, operating system, and device to web servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PunycodeConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  
  // Basic implementation - for full support ideally use 'punycode' lib, but browser has URL API
  const convert = () => {
    try {
      if (input.startsWith("xn--")) {
        // Decode
        const url = new URL(`http://${input}`);
        setOutput(url.hostname);
      } else {
        // Encode
        const url = new URL(`http://${input}`);
        setOutput(url.hostname);
      }
    } catch (e) {
      toast.error("Invalid domain format");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="Punycode Converter" 
            description="Convert IDN to Punycode" 
            icon={Globe} 
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>IDN / Punycode Converter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Domain Name (Unicode or Punycode)</Label>
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="e.g. münchen.de"
            />
          </div>
          <Button onClick={convert} className="w-full">Convert</Button>
          
          {output && (
            <div className="space-y-2">
              <Label>Result</Label>
              <div 
                className="p-3 bg-muted rounded-lg font-mono text-lg cursor-pointer hover:bg-muted/80"
                onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }}
              >
                {output}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RobotsTxtGenerator() {
  const [agents, setAgents] = useState("*");
  const [allow, setAllow] = useState("/");
  const [disallow, setDisallow] = useState("/admin");
  const [sitemap, setSitemap] = useState("");

  const result = `User-agent: ${agents}\nAllow: ${allow}\nDisallow: ${disallow}\n${sitemap ? `Sitemap: ${sitemap}` : ''}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="Robots.txt Generator" 
            description="Generate Robots.txt File Instantly" 
            icon={FileText} 
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Robots.txt Generator</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>User Agent</Label>
            <Input value={agents} onChange={(e) => setAgents(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Allow Path</Label>
            <Input value={allow} onChange={(e) => setAllow(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Disallow Path</Label>
            <Input value={disallow} onChange={(e) => setDisallow(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sitemap URL</Label>
            <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://..." />
          </div>
          
          <div className="col-span-2 space-y-2 mt-4">
            <Label>Generated Content</Label>
            <Textarea 
              className="font-mono h-32" 
              readOnly 
              value={result} 
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
            >
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function HtaccessGenerator() {
  const [redirectType, setRedirectType] = useState("www");
  
  const getRule = () => {
    switch(redirectType) {
      case "www": return `RewriteEngine On\nRewriteCond %{HTTP_HOST} !^www\\.\nRewriteRule ^(.*)$ http://www.%{HTTP_HOST}/$1 [R=301,L]`;
      case "non-www": return `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.(.*)$\nRewriteRule ^(.*)$ http://%1/$1 [R=301,L]`;
      case "https": return `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;
      default: return "";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="htaccess Redirect Generator" 
            description="Redirect HTACCESS tool" 
            icon={AlertTriangle} 
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>.htaccess Generator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Redirect Type</Label>
            <select 
              className="w-full p-2 border rounded-md bg-background"
              value={redirectType}
              onChange={(e) => setRedirectType(e.target.value)}
            >
              <option value="www">Force WWW</option>
              <option value="non-www">Force Non-WWW</option>
              <option value="https">Force HTTPS</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Code</Label>
            <Textarea 
              className="font-mono h-32" 
              readOnly 
              value={getRule()} 
            />
            <Button 
              className="w-full"
              onClick={() => { navigator.clipboard.writeText(getRule()); toast.success("Copied!"); }}
            >
              Copy Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SerpSimulator() {
  const [title, setTitle] = useState("Example Page Title | Brand Name");
  const [desc, setDesc] = useState("This is an example meta description that will appear in Google search results. Keep it between 150-160 characters for best visibility.");
  const [url, setUrl] = useState("https://example.com/page-slug");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="Google SERP Simulator" 
            description="Preview Google SERP Simulator" 
            icon={Search} 
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>SERP Simulator</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title ({title.length} chars)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Meta Description ({desc.length} chars)</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          </div>

          <div className="border p-4 rounded-lg bg-white">
            <Label className="mb-2 block text-muted-foreground">Preview</Label>
            <div className="font-sans max-w-[600px]">
               <div className="flex items-center gap-2 mb-1">
                 <div className="bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center text-xs">
                   <Globe className="w-4 h-4 text-gray-500" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm text-[#202124]">{new URL(url || "https://example.com").hostname}</span>
                    <span className="text-xs text-[#5f6368]">{url}</span>
                 </div>
               </div>
               <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
                 {title}
               </h3>
               <p className="text-sm text-[#4d5156] leading-6 line-clamp-2">
                 {desc}
               </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
