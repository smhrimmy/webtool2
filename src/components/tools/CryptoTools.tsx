import { useState } from "react";
import { ToolCard } from "./ToolCard";
import { Lock, Key, ShieldCheck, FileKey } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CryptoJS from "crypto-js";
import { toast } from "sonner";

export function Md5Base64Generator() {
  const [input, setInput] = useState("");
  const [md5, setMd5] = useState("");
  const [base64, setBase64] = useState("");

  const handleGenerate = () => {
    if (!input) return;
    setMd5(CryptoJS.MD5(input).toString());
    setBase64(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input)));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
           <ToolCard 
             title="MD5 & Base64 Generator" 
             description="Create MD5 & Base64 Hashes of any string" 
             icon={Lock} 
           />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>MD5 & Base64 Generator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Input String</Label>
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Enter text to hash..."
            />
          </div>
          <Button onClick={handleGenerate} className="w-full">Generate Hashes</Button>
          
          {md5 && (
            <div className="space-y-2 pt-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">MD5 Hash</Label>
                <div 
                  className="p-2 bg-muted rounded text-xs font-mono break-all cursor-pointer hover:bg-muted/80"
                  onClick={() => { navigator.clipboard.writeText(md5); toast.success("Copied MD5"); }}
                >
                  {md5}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Base64</Label>
                <div 
                  className="p-2 bg-muted rounded text-xs font-mono break-all cursor-pointer hover:bg-muted/80"
                  onClick={() => { navigator.clipboard.writeText(base64); toast.success("Copied Base64"); }}
                >
                  {base64}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  
  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < length[0]; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="Password Generator" 
            description="Generate Secure Random Passwords" 
            icon={Key} 
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Secure Password Generator</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Length: {length[0]}</Label>
            </div>
            <Slider 
              value={length} 
              onValueChange={setLength} 
              min={8} 
              max={64} 
              step={1} 
            />
          </div>
          <Button onClick={generate} className="w-full">Generate Password</Button>
          
          {password && (
            <div 
              className="p-4 bg-muted rounded-lg text-center font-mono text-lg break-all cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => { navigator.clipboard.writeText(password); toast.success("Password copied!"); }}
            >
              {password}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PasswordStrength() {
  const [password, setPassword] = useState("");
  
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 8) score += 20;
    if (pass.length > 12) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const strength = calculateStrength(password);
  const color = strength < 40 ? "bg-red-500" : strength < 80 ? "bg-yellow-500" : "bg-green-500";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="Password Strength Checker" 
            description="Check Strength of Passwords Easily" 
            icon={ShieldCheck} 
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password Strength Checker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Enter Password</Label>
            <Input 
              type="text" // Visible for checking
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Type a password..."
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Strength Score</span>
              <span>{strength}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${color}`} 
                style={{ width: `${strength}%` }} 
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {strength < 40 ? "Weak - Add more characters, numbers, and symbols." : 
               strength < 80 ? "Medium - Good, but could be stronger." : 
               "Strong - Excellent password!"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PasswordEncryption() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  const encrypt = () => {
    if (!text || !key) return;
    setResult(CryptoJS.AES.encrypt(text, key).toString());
  };

  const decrypt = () => {
    if (!text || !key) return;
    try {
      const bytes = CryptoJS.AES.decrypt(text, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (originalText) setResult(originalText);
      else toast.error("Decryption failed. Wrong key?");
    } catch (e) {
      toast.error("Decryption failed.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full">
          <ToolCard 
            title="Password Encryption Utility" 
            description="Encode/Decode any Password or Text" 
            icon={FileKey} 
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encryption Utility (AES)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Text / Cipher</Label>
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Enter text to encrypt or decrypt..."
            />
          </div>
          <div className="space-y-2">
            <Label>Secret Key</Label>
            <Input 
              type="password"
              value={key} 
              onChange={(e) => setKey(e.target.value)} 
              placeholder="Enter secret key..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={encrypt} className="flex-1">Encrypt</Button>
            <Button onClick={decrypt} variant="outline" className="flex-1">Decrypt</Button>
          </div>
          
          {result && (
            <div className="space-y-1 pt-2">
              <Label>Result</Label>
              <div 
                className="p-3 bg-muted rounded-lg text-sm font-mono break-all cursor-pointer hover:bg-muted/80"
                onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
              >
                {result}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
