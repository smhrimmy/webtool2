import { 
  Md5Base64Generator, 
  PasswordGenerator, 
  PasswordStrength, 
  PasswordEncryption,
  UserAgentTool,
  PunycodeConverter,
  RobotsTxtGenerator,
  HtaccessGenerator,
  SerpSimulator,
  MultiUrlOpener,
  HttpHeadersCheck,
  ServerOsCheck,
  LinkAnalyzer,
  BrokenLinkChecker
} from "@/components/tools";
import { EmailDNSGeneratorPanel, SMTPLogAnalyzer } from "@/components/diagnostics";
import { Mail, Wrench } from "lucide-react";

export default function Tools() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Web Tools Collection</h1>
        <p className="text-muted-foreground text-lg">
          Essential utilities for developers, SEOs, and system administrators.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          Webmaster & SEO Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HttpHeadersCheck />
          <ServerOsCheck />
          <UserAgentTool />
          <LinkAnalyzer />
          <BrokenLinkChecker />
          <MultiUrlOpener />
          <RobotsTxtGenerator />
          <HtaccessGenerator />
          <SerpSimulator />
          <PunycodeConverter />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Email & Security Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PasswordGenerator />
          <PasswordStrength />
          <PasswordEncryption />
          <Md5Base64Generator />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Email Generators</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <EmailDNSGeneratorPanel />
          <SMTPLogAnalyzer />
        </div>
      </div>
    </div>
  );
}
