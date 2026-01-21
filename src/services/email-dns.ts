// Email DNS Service - handles email-related DNS checks
import { 
  MXRecord, 
  SPFRecord, 
  DKIMRecord, 
  DMARCRecord, 
  BIMIRecord,
  EmailDNSResult,
  EmailHealthScore 
} from '@/types/email';

const COMMON_DKIM_SELECTORS = [
  'default', 'google', 'selector1', 'selector2', 'k1', 'k2', 
  'mail', 'dkim', 's1', 's2', 'mx', 'mandrill', 'smtp', 'cm',
  'zendesk1', 'zendesk2', 'email', 'sig1', 'everlytickey1', 'everlytickey2'
];

export async function checkMX(domain: string): Promise<MXRecord[]> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = await response.json();
    
    if (!data.Answer) return [];
    
    return data.Answer.map((record: any) => {
      const parts = record.data.split(' ');
      return {
        priority: parseInt(parts[0]) || 0,
        host: parts[1]?.replace(/\.$/, '') || record.data,
      };
    }).sort((a: MXRecord, b: MXRecord) => a.priority - b.priority);
  } catch {
    return [];
  }
}

export async function checkSPF(domain: string): Promise<SPFRecord | null> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
    const data = await response.json();
    
    if (!data.Answer) return null;
    
    const spfRecord = data.Answer.find((r: any) => 
      r.data?.toLowerCase().includes('v=spf1')
    );
    
    if (!spfRecord) return null;
    
    const raw = spfRecord.data.replace(/"/g, '');
    const mechanisms = raw.split(' ').filter((m: string) => m && m !== 'v=spf1');
    const includes = mechanisms.filter((m: string) => m.startsWith('include:'));
    
    let qualifier: SPFRecord['qualifier'] = 'pass';
    if (raw.includes('~all')) qualifier = 'softfail';
    else if (raw.includes('-all')) qualifier = 'fail';
    else if (raw.includes('?all')) qualifier = 'neutral';
    
    const issues: string[] = [];
    if (!raw.includes('all')) issues.push('Missing "all" mechanism - anyone can send');
    if (raw.includes('+all')) issues.push('Using +all allows anyone to send as your domain');
    if (includes.length > 10) issues.push('Too many includes (>10 DNS lookups may fail)');
    
    return {
      raw,
      valid: issues.length === 0,
      mechanisms,
      includes: includes.map((i: string) => i.replace('include:', '')),
      qualifier,
      issues,
    };
  } catch {
    return null;
  }
}

export async function checkDKIM(domain: string, selectors?: string[]): Promise<DKIMRecord[]> {
  const selectorsToCheck = selectors || COMMON_DKIM_SELECTORS;
  const results: DKIMRecord[] = [];
  
  await Promise.all(
    selectorsToCheck.map(async (selector) => {
      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${selector}._domainkey.${domain}&type=TXT`
        );
        const data = await response.json();
        
        if (data.Answer && data.Answer.length > 0) {
          const record = data.Answer[0].data.replace(/"/g, '');
          const issues: string[] = [];
          
          // Parse key type and size
          let keyType = 'rsa';
          let keySize: number | undefined;
          
          if (record.includes('k=ed25519')) keyType = 'ed25519';
          
          // Check for common issues
          if (!record.includes('p=')) {
            issues.push('Missing public key');
          } else if (record.includes('p=')) {
            const keyMatch = record.match(/p=([A-Za-z0-9+/=]+)/);
            if (keyMatch) {
              const keyLength = keyMatch[1].length;
              // Approximate key size from base64 length
              keySize = Math.round(keyLength * 6 / 8) * 8;
              if (keyType === 'rsa' && keySize < 1024) {
                issues.push('Key size is too small (< 1024 bits)');
              }
            }
          }
          
          results.push({
            selector,
            found: true,
            publicKey: record,
            keyType,
            keySize,
            valid: issues.length === 0,
            issues,
          });
        }
      } catch {
        // Selector not found, continue
      }
    })
  );
  
  return results;
}

export async function checkDMARC(domain: string): Promise<DMARCRecord | null> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`);
    const data = await response.json();
    
    if (!data.Answer) return null;
    
    const dmarcRecord = data.Answer.find((r: any) => 
      r.data?.toLowerCase().includes('v=dmarc1')
    );
    
    if (!dmarcRecord) return null;
    
    const raw = dmarcRecord.data.replace(/"/g, '');
    const issues: string[] = [];
    
    // Parse policy
    let policy: DMARCRecord['policy'] = 'none';
    const policyMatch = raw.match(/p=(none|quarantine|reject)/i);
    if (policyMatch) policy = policyMatch[1].toLowerCase() as DMARCRecord['policy'];
    
    // Parse subdomain policy
    let subdomainPolicy: DMARCRecord['subdomainPolicy'];
    const spMatch = raw.match(/sp=(none|quarantine|reject)/i);
    if (spMatch) subdomainPolicy = spMatch[1].toLowerCase() as DMARCRecord['subdomainPolicy'];
    
    // Parse percentage
    let percentage: number | undefined;
    const pctMatch = raw.match(/pct=(\d+)/i);
    if (pctMatch) percentage = parseInt(pctMatch[1]);
    
    // Parse reporting
    const ruaMatch = raw.match(/rua=([^;]+)/i);
    const rufMatch = raw.match(/ruf=([^;]+)/i);
    
    const reportingEmail = ruaMatch 
      ? ruaMatch[1].split(',').map((e: string) => e.trim().replace('mailto:', ''))
      : undefined;
    const forensicEmail = rufMatch
      ? rufMatch[1].split(',').map((e: string) => e.trim().replace('mailto:', ''))
      : undefined;
    
    // Check for issues
    if (policy === 'none') issues.push('Policy is set to "none" - no enforcement');
    if (!reportingEmail) issues.push('No aggregate reporting (rua) configured');
    if (percentage && percentage < 100) issues.push(`Only ${percentage}% of emails are subject to policy`);
    
    return {
      raw,
      valid: issues.length === 0 || policy !== 'none',
      policy,
      subdomainPolicy,
      percentage,
      reportingEmail,
      forensicEmail,
      issues,
    };
  } catch {
    return null;
  }
}

export async function checkBIMI(domain: string): Promise<BIMIRecord | null> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=default._bimi.${domain}&type=TXT`);
    const data = await response.json();
    
    if (!data.Answer) return null;
    
    const bimiRecord = data.Answer.find((r: any) => 
      r.data?.toLowerCase().includes('v=bimi1')
    );
    
    if (!bimiRecord) return null;
    
    const raw = bimiRecord.data.replace(/"/g, '');
    const issues: string[] = [];
    
    const logoMatch = raw.match(/l=([^;]+)/i);
    const vmcMatch = raw.match(/a=([^;]+)/i);
    
    const logoUrl = logoMatch?.[1]?.trim();
    const vmcUrl = vmcMatch?.[1]?.trim();
    
    if (!logoUrl) issues.push('Missing logo URL (l= parameter)');
    if (logoUrl && !logoUrl.endsWith('.svg')) issues.push('Logo should be in SVG format');
    
    return {
      found: true,
      logoUrl,
      vmcUrl,
      valid: issues.length === 0,
      issues,
    };
  } catch {
    return null;
  }
}

export async function checkEmailDNS(domain: string): Promise<EmailDNSResult> {
  const [mx, spf, dkim, dmarc, bimi] = await Promise.all([
    checkMX(domain),
    checkSPF(domain),
    checkDKIM(domain),
    checkDMARC(domain),
    checkBIMI(domain),
  ]);
  
  return { mx, spf, dkim, dmarc, bimi, ptr: [] };
}

export function calculateEmailHealthScore(result: EmailDNSResult): EmailHealthScore {
  let mxScore = result.mx.length > 0 ? 100 : 0;
  let spfScore = result.spf?.valid ? 100 : result.spf ? 50 : 0;
  let dkimScore = result.dkim.length > 0 ? (result.dkim.some(d => d.valid) ? 100 : 50) : 0;
  let dmarcScore = result.dmarc?.valid ? 100 : result.dmarc?.policy === 'none' ? 30 : result.dmarc ? 60 : 0;
  
  const overall = Math.round((mxScore + spfScore + dkimScore + dmarcScore) / 4);
  
  // Provider compatibility
  const hasStringSPF = result.spf !== null;
  const hasValidDKIM = result.dkim.some(d => d.valid);
  const hasDMARC = result.dmarc !== null;
  
  return {
    overall,
    mx: mxScore,
    spf: spfScore,
    dkim: dkimScore,
    dmarc: dmarcScore,
    compatibility: {
      gmail: hasStringSPF && hasValidDKIM && hasDMARC ? 'pass' : hasDMARC ? 'warn' : 'fail',
      outlook: hasStringSPF && hasValidDKIM ? 'pass' : hasStringSPF ? 'warn' : 'fail',
      yahoo: hasStringSPF && hasValidDKIM && hasDMARC ? 'pass' : hasDMARC ? 'warn' : 'fail',
    },
  };
}
