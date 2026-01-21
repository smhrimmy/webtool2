import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Key, Mail, FileText, RefreshCw, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  generatePassword, 
  generateEmailObject, 
  generateFormSubmission 
} from '@/services/generators';
import type { 
  PasswordOptions, 
  GeneratedPassword,
  EmailObjectOptions,
  GeneratedEmailObject,
  FormSubmissionOptions,
  GeneratedFormSubmission
} from '@/types/generators';

function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };
  
  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4 mr-2" />
      Copy
    </Button>
  );
}

function StrengthBadge({ strength }: { strength: GeneratedPassword['strength'] }) {
  const variants: Record<string, 'destructive' | 'secondary' | 'default' | 'outline'> = {
    weak: 'destructive',
    fair: 'secondary',
    good: 'default',
    strong: 'default',
    very_strong: 'default',
  };
  
  const labels: Record<string, string> = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    very_strong: 'Very Strong',
  };
  
  return (
    <Badge variant={variants[strength]} className={strength === 'very_strong' ? 'bg-success' : ''}>
      <Shield className="h-3 w-3 mr-1" />
      {labels[strength]}
    </Badge>
  );
}

export function TestGeneratorsPanel() {
  // Password generator state
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
    cpanelCompatible: false,
  });
  const [generatedPassword, setGeneratedPassword] = useState<GeneratedPassword | null>(null);

  // Email object state
  const [emailOptions, setEmailOptions] = useState<EmailObjectOptions>({
    from: '',
    to: '',
    subject: 'Test Email',
    body: 'This is a test email message.',
    bodyType: 'plain',
    includeMessageId: true,
    includeDate: true,
    includeReturnPath: true,
  });
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailObject | null>(null);

  // Form submission state
  const [formOptions, setFormOptions] = useState<FormSubmissionOptions>({
    includeEmail: true,
    includeName: true,
    includePhone: true,
    includeMessage: true,
    includeAddress: false,
    locale: 'en',
  });
  const [generatedForm, setGeneratedForm] = useState<GeneratedFormSubmission | null>(null);

  const handleGeneratePassword = () => {
    const result = generatePassword(passwordOptions);
    setGeneratedPassword(result);
  };

  const handleGenerateEmail = () => {
    if (!emailOptions.from || !emailOptions.to) {
      toast.error('Please enter From and To addresses');
      return;
    }
    const result = generateEmailObject(emailOptions);
    setGeneratedEmail(result);
  };

  const handleGenerateForm = () => {
    const result = generateFormSubmission(formOptions);
    setGeneratedForm(result);
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Test Data Generators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="password" className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email Object
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Form Data
            </TabsTrigger>
          </TabsList>

          {/* Password Generator */}
          <TabsContent value="password" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Length: {passwordOptions.length}</Label>
                </div>
                <Slider
                  value={[passwordOptions.length]}
                  onValueChange={([v]) => setPasswordOptions(prev => ({ ...prev, length: v }))}
                  min={8}
                  max={64}
                  step={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                  <Switch
                    id="uppercase"
                    checked={passwordOptions.includeUppercase}
                    onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeUppercase: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                  <Switch
                    id="lowercase"
                    checked={passwordOptions.includeLowercase}
                    onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeLowercase: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                  <Switch
                    id="numbers"
                    checked={passwordOptions.includeNumbers}
                    onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeNumbers: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">Symbols (!@#...)</Label>
                  <Switch
                    id="symbols"
                    checked={passwordOptions.includeSymbols}
                    onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeSymbols: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ambiguous">Exclude Ambiguous</Label>
                  <Switch
                    id="ambiguous"
                    checked={passwordOptions.excludeAmbiguous}
                    onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, excludeAmbiguous: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cpanel">cPanel Compatible</Label>
                  <Switch
                    id="cpanel"
                    checked={passwordOptions.cpanelCompatible}
                    onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, cpanelCompatible: v }))}
                  />
                </div>
              </div>

              <Button onClick={handleGeneratePassword} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Generate Password
              </Button>

              {generatedPassword && (
                <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono break-all">{generatedPassword.password}</code>
                    <CopyButton text={generatedPassword.password} label="Password" />
                  </div>
                  <div className="flex items-center gap-4">
                    <StrengthBadge strength={generatedPassword.strength} />
                    <span className="text-xs text-muted-foreground">
                      Entropy: {generatedPassword.entropy} bits
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Crack time: {generatedPassword.crackTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Email Object Generator */}
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From Address</Label>
                <Input
                  id="from"
                  placeholder="sender@example.com"
                  value={emailOptions.from}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To Address</Label>
                <Input
                  id="to"
                  placeholder="recipient@example.com"
                  value={emailOptions.to}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={emailOptions.subject}
                onChange={(e) => setEmailOptions(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                placeholder="Email body content..."
                value={emailOptions.body}
                onChange={(e) => setEmailOptions(prev => ({ ...prev, body: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Body Type</Label>
                <Select
                  value={emailOptions.bodyType}
                  onValueChange={(v) => setEmailOptions(prev => ({ ...prev, bodyType: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="multipart">Multipart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="messageId">Message-ID</Label>
                <Switch
                  id="messageId"
                  checked={emailOptions.includeMessageId}
                  onCheckedChange={(v) => setEmailOptions(prev => ({ ...prev, includeMessageId: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="date">Date Header</Label>
                <Switch
                  id="date"
                  checked={emailOptions.includeDate}
                  onCheckedChange={(v) => setEmailOptions(prev => ({ ...prev, includeDate: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="returnPath">Return-Path</Label>
                <Switch
                  id="returnPath"
                  checked={emailOptions.includeReturnPath}
                  onCheckedChange={(v) => setEmailOptions(prev => ({ ...prev, includeReturnPath: v }))}
                />
              </div>
            </div>

            <Button onClick={handleGenerateEmail} className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Generate Email Object
            </Button>

            {generatedEmail && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {generatedEmail.isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <span className="text-sm">
                      {generatedEmail.isValid ? 'Valid email object' : 'Issues detected'}
                    </span>
                  </div>
                  <CopyButton text={generatedEmail.raw} label="Email object" />
                </div>
                
                {generatedEmail.issues.length > 0 && (
                  <div className="space-y-1">
                    {generatedEmail.issues.map((issue, i) => (
                      <p key={i} className="text-xs text-warning flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {issue}
                      </p>
                    ))}
                  </div>
                )}

                <pre className="p-3 bg-muted/30 rounded text-xs font-mono overflow-auto max-h-[200px]">
                  {generatedEmail.raw}
                </pre>
              </div>
            )}
          </TabsContent>

          {/* Form Submission Generator */}
          <TabsContent value="form" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="formName">Name</Label>
                <Switch
                  id="formName"
                  checked={formOptions.includeName}
                  onCheckedChange={(v) => setFormOptions(prev => ({ ...prev, includeName: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="formEmail">Email</Label>
                <Switch
                  id="formEmail"
                  checked={formOptions.includeEmail}
                  onCheckedChange={(v) => setFormOptions(prev => ({ ...prev, includeEmail: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="formPhone">Phone</Label>
                <Switch
                  id="formPhone"
                  checked={formOptions.includePhone}
                  onCheckedChange={(v) => setFormOptions(prev => ({ ...prev, includePhone: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="formMessage">Message</Label>
                <Switch
                  id="formMessage"
                  checked={formOptions.includeMessage}
                  onCheckedChange={(v) => setFormOptions(prev => ({ ...prev, includeMessage: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="formAddress">Address</Label>
                <Switch
                  id="formAddress"
                  checked={formOptions.includeAddress}
                  onCheckedChange={(v) => setFormOptions(prev => ({ ...prev, includeAddress: v }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Locale</Label>
                <Select
                  value={formOptions.locale}
                  onValueChange={(v) => setFormOptions(prev => ({ ...prev, locale: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerateForm} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Form Data
            </Button>

            {generatedForm && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>JSON Format</Label>
                    <CopyButton text={generatedForm.json} label="JSON" />
                  </div>
                  <pre className="p-3 bg-muted/30 rounded text-xs font-mono overflow-auto">
                    {generatedForm.json}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>URL Encoded</Label>
                    <CopyButton text={generatedForm.urlEncoded} label="URL encoded data" />
                  </div>
                  <pre className="p-3 bg-muted/30 rounded text-xs font-mono overflow-auto break-all">
                    {generatedForm.urlEncoded}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
