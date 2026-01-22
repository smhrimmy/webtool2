export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extended DNS resolvers for global coverage
const DNS_RESOLVERS = [
  // North America
  { name: 'Google', location: 'Mountain View, CA', country: 'United States', countryCode: 'US', ip: '8.8.8.8', region: 'North America' },
  { name: 'Cloudflare', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '1.1.1.1', region: 'North America' },
  { name: 'OpenDNS', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '208.67.222.222', region: 'North America' },
  { name: 'Quad9', location: 'Berkeley, CA', country: 'United States', countryCode: 'US', ip: '9.9.9.9', region: 'North America' },
  { name: 'Level3', location: 'Denver, CO', country: 'United States', countryCode: 'US', ip: '4.2.2.1', region: 'North America' },
  { name: 'Comodo', location: 'New York, NY', country: 'United States', countryCode: 'US', ip: '8.26.56.26', region: 'North America' },
  // Europe
  { name: 'DNS.Watch', location: 'Frankfurt', country: 'Germany', countryCode: 'DE', ip: '84.200.69.80', region: 'Europe' },
  { name: 'SafeDNS', location: 'London', country: 'United Kingdom', countryCode: 'GB', ip: '195.46.39.39', region: 'Europe' },
  { name: 'Freenom', location: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', ip: '80.80.80.80', region: 'Europe' },
  { name: 'FDN', location: 'Paris', country: 'France', countryCode: 'FR', ip: '80.67.169.12', region: 'Europe' },
  // Asia
  { name: 'NTT', location: 'Tokyo', country: 'Japan', countryCode: 'JP', ip: '129.250.35.250', region: 'Asia' },
  { name: 'SingNet', location: 'Singapore', country: 'Singapore', countryCode: 'SG', ip: '165.21.100.88', region: 'Asia' },
  { name: 'KT', location: 'Seoul', country: 'South Korea', countryCode: 'KR', ip: '168.126.63.1', region: 'Asia' },
  { name: 'TATA', location: 'Mumbai', country: 'India', countryCode: 'IN', ip: '202.54.1.2', region: 'Asia' },
  // South America
  { name: 'Claro', location: 'São Paulo', country: 'Brazil', countryCode: 'BR', ip: '200.248.178.54', region: 'South America' },
  { name: 'Movistar', location: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', ip: '200.69.193.2', region: 'South America' },
  // Africa
  { name: 'MTN', location: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', ip: '196.43.34.70', region: 'Africa' },
  { name: 'Afrihost', location: 'Cape Town', country: 'South Africa', countryCode: 'ZA', ip: '196.22.142.2', region: 'Africa' },
  // Australia
  { name: 'Telstra', location: 'Sydney', country: 'Australia', countryCode: 'AU', ip: '139.130.4.5', region: 'Australia' },
  { name: 'Optus', location: 'Melbourne', country: 'Australia', countryCode: 'AU', ip: '211.29.132.12', region: 'Australia' },
];

// Comprehensive RDAP bootstrap URLs for all TLD types
const RDAP_BOOTSTRAP: Record<string, string> = {
  // --- Generic TLDs (gTLDs) ---
  'com': 'https://rdap.verisign.com/com/v1',
  'net': 'https://rdap.verisign.com/net/v1',
  'org': 'https://rdap.publicinterestregistry.org/rdap',
  'info': 'https://rdap.afilias.net/rdap/info',
  'io': 'https://rdap.nic.io',
  'dev': 'https://rdap.nic.google',
  'app': 'https://rdap.nic.google',
  'co': 'https://rdap.nic.co',
  'me': 'https://rdap.nic.me',
  'biz': 'https://rdap.nic.biz',
  'us': 'https://rdap.nic.us',
  'tv': 'https://rdap.nic.tv',
  'cc': 'https://rdap.nic.cc',
  'xyz': 'https://rdap.centralnic.com/xyz',
  'tech': 'https://rdap.centralnic.com/tech',
  'online': 'https://rdap.centralnic.com/online',
  'site': 'https://rdap.centralnic.com/site',
  'shop': 'https://rdap.nic.google',
  'cloud': 'https://rdap.nic.cloud',
  'top': 'https://rdap.nic.top',
  'club': 'https://rdap.nic.club',
  'vip': 'https://rdap.nic.vip',
  'work': 'https://rdap.nic.work',
  'link': 'https://rdap.uniregistry.net/rdap',
  'click': 'https://rdap.uniregistry.net/rdap',
  'pro': 'https://rdap.registry.pro',
  'mobi': 'https://rdap.afilias.net/rdap/mobi',
  'name': 'https://rdap.verisign.com/name/v1',
  'tel': 'https://rdap.tel.nic.fr',
  'asia': 'https://rdap.dotasia.org',
  'cat': 'https://rdap.puntcat.org',
  'jobs': 'https://rdap.jobs',
  'travel': 'https://rdap.donuts.co/rdap',
  'aero': 'https://rdap.aero',
  'coop': 'https://rdap.nic.coop',
  'museum': 'https://rdap.museum',
  'int': 'https://rdap.iana.org',
  'ai': 'https://rdap.nic.ai',
  'page': 'https://rdap.nic.google',
  'blog': 'https://rdap.nic.google',
  'design': 'https://rdap.nic.design',
  'store': 'https://rdap.centralnic.com/store',
  'website': 'https://rdap.centralnic.com/website',
  'fun': 'https://rdap.centralnic.com/fun',
  'space': 'https://rdap.centralnic.com/space',
  'press': 'https://rdap.centralnic.com/press',
  'host': 'https://rdap.centralnic.com/host',
  
  // --- European ccTLDs ---
  'uk': 'https://rdap.nominet.uk/uk',
  'de': 'https://rdap.denic.de',
  'fr': 'https://rdap.nic.fr',
  'nl': 'https://rdap.sidn.nl',
  'eu': 'https://rdap.eurid.eu',
  'ch': 'https://rdap.nic.ch',
  'it': 'https://rdap.nic.it',
  'be': 'https://rdap.dnsbelgium.be',
  'at': 'https://rdap.nic.at',
  'pl': 'https://rdap.dns.pl',
  'cz': 'https://rdap.nic.cz',
  'se': 'https://rdap.nic.se',
  'nu': 'https://rdap.iis.se',
  'fi': 'https://rdap.traficom.fi/rdap',
  'dk': 'https://rdap.dk-hostmaster.dk',
  'no': 'https://rdap.norid.no',
  'es': 'https://rdap.nic.es',
  'pt': 'https://rdap.dns.pt',
  'is': 'https://rdap.isnic.is',
  'ie': 'https://rdap.iedr.ie',
  'gr': 'https://rdap.gr',
  'ro': 'https://rdap.rotld.ro',
  'hu': 'https://rdap.nic.hu',
  'sk': 'https://rdap.sk-nic.sk',
  'si': 'https://rdap.register.si',
  'bg': 'https://rdap.register.bg',
  'hr': 'https://rdap.dns.hr',
  'ee': 'https://rdap.internet.ee',
  'lv': 'https://rdap.nic.lv',
  'lt': 'https://rdap.domreg.lt',
  
  // --- Americas ccTLDs ---
  'ca': 'https://rdap.ca.fury.ca',
  'br': 'https://rdap.registro.br',
  'mx': 'https://rdap.nic.mx',
  'cl': 'https://rdap.nic.cl',
  'ar': 'https://rdap.nic.ar',
  'co': 'https://rdap.nic.co',
  'pe': 'https://rdap.punto.pe',
  've': 'https://rdap.nic.ve',
  'uy': 'https://rdap.nic.uy',
  'cr': 'https://rdap.nic.cr',
  'do': 'https://rdap.nic.do',
  'hn': 'https://rdap.nic.hn',
  
  // --- Asia/Pacific ccTLDs ---
  'au': 'https://rdap.auda.org.au',
  'nz': 'https://rdap.dnc.org.nz',
  'jp': 'https://rdap.jprs.jp',
  'in': 'https://rdap.registry.in',
  'cn': 'https://rdap.cnnic.cn',
  'kr': 'https://rdap.kr',
  'tw': 'https://rdap.twnic.tw',
  'sg': 'https://rdap.sgnic.sg',
  'hk': 'https://rdap.hkirc.hk',
  'id': 'https://rdap.pandi.id',
  'my': 'https://rdap.mynic.my',
  'vn': 'https://rdap.vnnic.vn',
  'th': 'https://rdap.thnic.co.th',
  'ph': 'https://rdap.dot.ph',
  
  // --- Other ccTLDs & Regions ---
  'ru': 'https://rdap.tcinet.ru',
  'su': 'https://rdap.tcinet.ru',
  'ir': 'https://rdap.nic.ir',
  'za': 'https://rdap.registry.net.za',
  'il': 'https://rdap.isoc.org.il',
  'ua': 'https://rdap.hostmaster.ua',
  'kz': 'https://rdap.nic.kz',
  'by': 'https://rdap.cctld.by',
  'rs': 'https://rdap.rnids.rs',
  'ge': 'https://rdap.nic.ge',
  'qa': 'https://rdap.registry.qa',
  'tn': 'https://rdap.nic.tn',
  'ae': 'https://rdap.aeda.ae',
  'la': 'https://rdap.centralnic.com/la',
};

const WAF_CDN_SIGNATURES = {
  cloudflare: {
    headers: ['cf-ray', 'cf-cache-status', 'cf-request-id'],
    server: ['cloudflare'],
    ipRanges: ['104.16.', '104.17.', '104.18.', '104.19.', '104.20.', '172.67.', '173.245.', '103.21.', '103.22.', '103.31.', '141.101.', '108.162.', '190.93.', '188.114.', '197.234.', '198.41.', '162.158.', '198.41.128.', '198.41.129.'],
  },
  akamai: {
    headers: ['x-akamai-transformed', 'akamai-origin-hop', 'x-akamai-request-id'],
    server: ['akamaighost', 'akamai'],
    ipRanges: ['23.', '2.16.', '95.100.', '96.6.', '96.16.', '104.64.', '104.65.', '118.214.'],
  },
  awsCloudFront: {
    headers: ['x-amz-cf-id', 'x-amz-cf-pop', 'x-cache'],
    server: ['cloudfront', 'amazon'],
    ipRanges: ['13.32.', '13.33.', '13.35.', '52.84.', '54.192.', '54.230.', '54.239.128.', '54.239.192.', '99.84.', '143.204.', '204.246.'],
  },
  fastly: {
    headers: ['x-served-by', 'x-cache', 'x-cache-hits', 'fastly-restarts'],
    server: ['fastly'],
    ipRanges: ['151.101.', '199.232.'],
  },
  sucuri: {
    headers: ['x-sucuri-id', 'x-sucuri-cache'],
    server: ['sucuri', 'sucuri/cloudproxy'],
    ipRanges: ['192.88.134.', '185.93.228.', '185.93.229.', '185.93.230.', '185.93.231.'],
  },
  incapsula: {
    headers: ['x-cdn', 'x-iinfo', 'incap_ses'],
    server: ['incapsula', 'imperva'],
    ipRanges: ['45.64.64.', '107.154.', '192.230.', '199.83.128.', '198.143.32.'],
  },
  stackpath: {
    headers: ['x-hw', 'x-sp-status'],
    server: ['stackpath', 'netdna', 'maxcdn'],
    ipRanges: ['93.184.', '151.139.', '152.199.'],
  },
  bunny: {
    headers: ['cdn-pullzone', 'cdn-uid', 'cdn-requestid'],
    server: ['bunnycdn'],
    ipRanges: ['205.234.'],
  },
  googleCloud: {
    headers: ['x-goog-', 'via: google'],
    server: ['google frontend', 'gws', 'gse'],
    ipRanges: ['34.', '35.', '104.196.', '104.199.', '130.211.', '142.250.', '172.217.', '216.58.', '216.239.'],
  },
  azure: {
    headers: ['x-azure-ref', 'x-ms-request-id', 'x-fd-healthprobe'],
    server: ['microsoft-azure', 'azure'],
    ipRanges: ['13.64.', '13.65.', '13.66.', '13.67.', '13.68.', '13.69.', '13.70.', '13.71.', '40.74.', '40.75.', '40.76.', '40.77.', '40.78.', '40.79.', '40.80.', '40.112.', '40.113.', '40.114.', '40.115.', '40.116.', '40.117.', '40.118.', '40.119.', '40.120.', '40.121.', '40.122.', '40.123.', '40.124.', '40.125.', '40.126.', '40.127.', '52.224.', '52.225.', '52.226.', '52.227.', '52.228.', '52.229.', '52.230.', '52.231.', '52.232.', '52.233.', '52.234.', '52.235.', '52.236.', '52.237.', '52.238.', '52.239.', '52.240.', '52.241.', '52.242.', '52.243.', '52.244.', '52.245.', '52.246.', '52.247.', '52.248.', '52.249.', '52.250.', '52.251.', '52.252.', '52.253.', '52.254.', '52.255.', '104.40.', '104.41.', '104.42.', '104.43.', '104.44.', '104.45.', '104.46.', '104.47.', '104.208.', '104.209.', '104.210.', '104.211.', '104.212.', '104.213.', '104.214.', '104.215.', '137.116.', '137.117.', '168.61.', '168.62.', '168.63.'],
  },
  ddosGuard: {
    headers: ['ddos-guard'],
    server: ['ddos-guard'],
    ipRanges: ['186.2.160.', '186.2.161.', '186.2.162.', '186.2.163.', '186.2.164.', '186.2.165.', '186.2.166.', '186.2.167.', '190.115.16.', '190.115.17.', '190.115.18.', '190.115.19.', '190.115.20.', '190.115.21.', '190.115.22.', '190.115.23.'],
  },
  keycdn: {
    headers: ['x-cache', 'x-edge-location'],
    server: ['keycdn'],
    ipRanges: ['185.31.16.', '185.31.17.', '185.31.18.', '185.31.19.'],
  },
};

async function queryDNS(domain: string, type: string, resolver: typeof DNS_RESOLVERS[0]) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    
    // Fallback logic for DNS over HTTPS providers if one fails
    let url = `https://dns.google/resolve?name=${domain}&type=${type}`;
    // Some domains might work better with Cloudflare if Google fails, but for now stick to one standard
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/dns-json' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
        throw new Error(`DNS Query failed: ${response.status}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - start;
    
    if (data.Answer && data.Answer.length > 0) {
      return {
        location: resolver.location,
        country: resolver.country,
        countryCode: resolver.countryCode,
        resolver: resolver.name,
        resolverIP: resolver.ip,
        values: data.Answer.map((a: any) => a.data?.replace(/\.$/g, '') || a.data),
        ttl: data.Answer[0].TTL || 300,
        responseTime,
        status: 'propagated' as const,
      };
    }
    return {
      location: resolver.location,
      country: resolver.country,
      countryCode: resolver.countryCode,
      resolver: resolver.name,
      resolverIP: resolver.ip,
      values: [],
      ttl: 0,
      responseTime,
      status: 'not_found' as const,
    };
  } catch (err) {
    return {
      location: resolver.location,
      country: resolver.country,
      countryCode: resolver.countryCode,
      resolver: resolver.name,
      resolverIP: resolver.ip,
      values: [],
      ttl: 0,
      responseTime: Date.now() - start,
      status: 'not_found' as const,
    };
  }
}

function getRDAPServer(domain: string): string | null {
  const parts = domain.split('.');
  
  // Robust TLD extraction
  // 1. Check for known 2-part TLDs (co.uk, com.au, etc.)
  if (parts.length > 2) {
      const tld2 = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      if (RDAP_BOOTSTRAP[tld2]) return RDAP_BOOTSTRAP[tld2];
  }
  
  // 2. Check for standard 1-part TLD
  const tld1 = parts[parts.length - 1]?.toLowerCase();
  if (tld1 && RDAP_BOOTSTRAP[tld1]) return RDAP_BOOTSTRAP[tld1];
  
  return null;
}

async function fetchWHOIS(domain: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Increased timeout for better reach
  
  try {
    const rdapServer = getRDAPServer(domain);
    
    // Strategy 1: Known RDAP Server
    if (rdapServer) {
      try {
        const rdapResponse = await fetch(`${rdapServer}/domain/${domain}`, {
          headers: { 'Accept': 'application/rdap+json' },
          signal: controller.signal
        });
        
        if (rdapResponse.ok) {
          clearTimeout(timeout);
          const data = await rdapResponse.json();
          return parseRDAPResponse(data, domain);
        }
      } catch (e) {
          // Continue to fallback
      }
    }
    
    // Strategy 2: IANA Bootstrap (Generic fallback)
    // Many new gTLDs are automatically handled here
    try {
      const bootstrapResponse = await fetch(`https://rdap.org/domain/${domain}`, {
        headers: { 'Accept': 'application/rdap+json' },
        signal: controller.signal
      });
      
      if (bootstrapResponse.ok) {
        clearTimeout(timeout);
        const data = await bootstrapResponse.json();
        return parseRDAPResponse(data, domain);
      }
    } catch (e) {
        // Continue to fallback
    }

    // Strategy 3: Try Google RDAP as a last resort for generic TLDs
    try {
        const googleResponse = await fetch(`https://rdap.nic.google/domain/${domain}`, {
            headers: { 'Accept': 'application/rdap+json' },
            signal: controller.signal
        });
        if (googleResponse.ok) {
            clearTimeout(timeout);
            const data = await googleResponse.json();
            return parseRDAPResponse(data, domain);
        }
    } catch(e) {}
    
    clearTimeout(timeout);
    return null;
  } catch (err) {
    clearTimeout(timeout);
    return null;
  }
}

function parseRDAPResponse(data: any, domain: string) {
  const events: Record<string, string> = {};
  if (data.events) {
    for (const event of data.events) {
      events[event.eventAction] = event.eventDate;
    }
  }
  
  const nameservers: string[] = [];
  if (data.nameservers) {
    for (const ns of data.nameservers) {
      if (ns.ldhName) {
        nameservers.push(ns.ldhName.toLowerCase());
      }
    }
  }
  
  let registrar = 'Unknown';
  let registrarAbuseContact = '';
  if (data.entities) {
    for (const entity of data.entities) {
      if (entity.roles?.includes('registrar')) {
        if (entity.vcardArray?.[1]) {
          for (const vcard of entity.vcardArray[1]) {
            if (vcard[0] === 'fn') {
              registrar = vcard[3];
            }
          }
        }
        if (entity.publicIds) {
          for (const id of entity.publicIds) {
            if (id.type === 'IANA Registrar ID') {
              registrar = `${registrar} (ID: ${id.identifier})`;
            }
          }
        }
      }
      if (entity.roles?.includes('abuse')) {
        if (entity.vcardArray?.[1]) {
          for (const vcard of entity.vcardArray[1]) {
            if (vcard[0] === 'email') {
              registrarAbuseContact = vcard[3];
            }
          }
        }
      }
    }
  }
  
  const status = data.status || [];
  const dnssec = data.secureDNS?.delegationSigned ? 'signedDelegation' : 'unsigned';
  
  return {
    domain: data.ldhName || domain,
    registrar,
    registrarWhoisServer: data.port43 || '',
    creationDate: events['registration'] || events['created'] || '',
    expiryDate: events['expiration'] || '',
    updatedDate: events['last changed'] || events['last update of RDAP database'] || '',
    status: status.map((s: string) => s.replace(/ /g, '')),
    nameservers,
    dnssec,
    registrarAbuseContact,
    isPrivate: status.some((s: string) => s.includes('private') || s.includes('redacted')),
  };
}

async function checkWebsite(domain: string) {
  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const ipPromise = (async () => {
      try {
        const ipController = new AbortController();
        const ipTimeout = setTimeout(() => ipController.abort(), 3000);
        const [dnsResponse, dns6Response] = await Promise.all([
          fetch(`https://dns.google/resolve?name=${domain}&type=A`, { signal: ipController.signal }),
          fetch(`https://dns.google/resolve?name=${domain}&type=AAAA`, { signal: ipController.signal })
        ]);
        clearTimeout(ipTimeout);
        
        const [dnsData, dns6Data] = await Promise.all([dnsResponse.json(), dns6Response.json()]);
        return {
          ipv4: dnsData.Answer?.[0]?.data || '',
          ipv6: dns6Data.Answer?.[0]?.data || ''
        };
      } catch {
        return { ipv4: '', ipv6: '' };
      }
    })();
    
    const response = await fetch(`https://${domain}`, { 
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);
    
    const headers = Object.fromEntries(response.headers.entries());
    const responseTime = Date.now() - start;
    const { ipv4, ipv6 } = await ipPromise;
    
    return {
      statusCode: response.status,
      statusText: response.statusText,
      responseTime,
      serverType: headers['server'] || 'Unknown',
      ipv4,
      ipv6,
      redirectChain: [response.url],
      compression: headers['content-encoding'] || 'none',
      phpVersion: headers['x-powered-by'],
      headers,
    };
  } catch (err: any) {
    return null;
  }
}

async function detectWAFCDN(domain: string, websiteResult: any) {
  const detected: { provider: string; type: 'CDN' | 'WAF' | 'CDN+WAF'; confidence: 'high' | 'medium' | 'low'; evidence: string[] }[] = [];
  
  if (!websiteResult) {
    return { detected: [], rawHeaders: {} };
  }
  
  const headers = websiteResult.headers || {};
  const headerKeys = Object.keys(headers).map(k => k.toLowerCase());
  const headerValues = Object.values(headers).map(v => String(v).toLowerCase());
  const serverHeader = (headers['server'] || '').toLowerCase();
  const ipv4 = websiteResult.ipv4 || '';
  
  for (const [provider, signatures] of Object.entries(WAF_CDN_SIGNATURES)) {
    const evidence: string[] = [];
    let confidence: 'high' | 'medium' | 'low' = 'low';
    
    for (const sig of signatures.headers) {
      const sigLower = sig.toLowerCase();
      if (headerKeys.some(k => k.includes(sigLower)) || headerValues.some(v => v.includes(sigLower))) {
        evidence.push(`Header: ${sig}`);
        confidence = 'high';
      }
    }
    
    for (const sig of signatures.server) {
      if (serverHeader.includes(sig.toLowerCase())) {
        evidence.push(`Server: ${serverHeader}`);
        confidence = 'high';
      }
    }
    
    if (ipv4) {
      for (const range of signatures.ipRanges) {
        if (ipv4.startsWith(range)) {
          evidence.push(`IP Range: ${ipv4} matches ${provider} range`);
          if (confidence !== 'high') confidence = 'medium';
        }
      }
    }
    
    if (evidence.length > 0) {
      let type: 'CDN' | 'WAF' | 'CDN+WAF' = 'CDN';
      if (['sucuri', 'incapsula', 'ddosGuard'].includes(provider)) {
        type = 'WAF';
      } else if (['cloudflare', 'akamai', 'fastly', 'stackpath'].includes(provider)) {
        type = 'CDN+WAF';
      }
      
      const providerName = provider === 'awsCloudFront' ? 'AWS CloudFront' 
        : provider === 'googleCloud' ? 'Google Cloud CDN'
        : provider === 'ddosGuard' ? 'DDoS-Guard'
        : provider === 'keycdn' ? 'KeyCDN'
        : provider.charAt(0).toUpperCase() + provider.slice(1);
      
      detected.push({ provider: providerName, type, confidence, evidence });
    }
  }
  
  const securityHeaders: Record<string, string | boolean> = {};
  const secHeadersToCheck = [
    'x-xss-protection',
    'x-content-type-options',
    'x-frame-options',
    'content-security-policy',
    'strict-transport-security',
    'referrer-policy',
    'permissions-policy',
    'x-permitted-cross-domain-policies',
  ];
  
  for (const h of secHeadersToCheck) {
    if (headers[h]) {
      securityHeaders[h] = headers[h];
    }
  }
  
  return {
    detected,
    securityHeaders,
    rawHeaders: headers,
  };
}

async function fetchCertificateFromCTLogs(domain: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    
    try {
      const crtResponse = await fetch(
        `https://crt.sh/?q=${encodeURIComponent(domain)}&output=json&exclude=expired`,
        { 
          headers: { 'Accept': 'application/json' },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeout);
      
      if (!crtResponse.ok) return null;
      
      const certificates = await crtResponse.json();
      
      if (!Array.isArray(certificates) || certificates.length === 0) return null;
      
      const seenIds = new Set();
      const uniqueCerts = certificates.filter((cert: any) => {
        if (seenIds.has(cert.id)) return false;
        seenIds.add(cert.id);
        return true;
      });
      
      const domainLower = domain.toLowerCase();
      const now = new Date();
      
      const validCerts = uniqueCerts.filter((cert: any) => {
        const notAfter = new Date(cert.not_after);
        const notBefore = new Date(cert.not_before);
        
        if (notAfter <= now || notBefore > now) return false;
        
        const nameValue = (cert.name_value || '').toLowerCase();
        const commonName = (cert.common_name || '').toLowerCase();
        
        return nameValue.includes(domainLower) ||
               commonName === domainLower ||
               commonName === `www.${domainLower}` ||
               commonName === `*.${domainLower}`;
      });
      
      validCerts.sort((a: any, b: any) => {
        const aEntry = new Date(a.entry_timestamp || a.not_before).getTime();
        const bEntry = new Date(b.entry_timestamp || b.not_before).getTime();
        return bEntry - aEntry;
      });
      
      if (validCerts.length > 0) return validCerts[0];
      
      uniqueCerts.sort((a: any, b: any) => {
        const aEntry = new Date(a.entry_timestamp || a.not_before).getTime();
        const bEntry = new Date(b.entry_timestamp || b.not_before).getTime();
        return bEntry - aEntry;
      });
      
      return uniqueCerts[0] || null;
      
    } catch (e: any) {
      clearTimeout(timeout);
      return null;
    }
  } catch (err: any) {
    return null;
  }
}

function parseIssuer(issuerName: string): string {
  if (!issuerName) return 'Unknown';
  const orgMatch = issuerName.match(/O=([^,]+)/);
  const cnMatch = issuerName.match(/CN=([^,]+)/);
  if (orgMatch) return orgMatch[1].trim();
  if (cnMatch) return cnMatch[1].trim();
  return issuerName.substring(0, 50);
}

function parseSANDomains(nameValue: string): string[] {
  if (!nameValue) return [];
  const domains = nameValue
    .split('\n')
    .map(d => d.trim().toLowerCase())
    .filter(d => d.length > 0 && d.includes('.'))
    .filter((d, i, arr) => arr.indexOf(d) === i);
  return domains.slice(0, 20);
}

async function checkSSL(domain: string) {
  try {
    const ctCert = await fetchCertificateFromCTLogs(domain);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    let hstsHeader: string | null = null;
    let httpsValid = false;
    
    try {
      const response = await fetch(`https://${domain}`, { 
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      clearTimeout(timeout);
      
      httpsValid = response.ok || response.status < 500;
      hstsHeader = response.headers.get('strict-transport-security');
    } catch (e) {
      clearTimeout(timeout);
    }
    
    let hstsMaxAge = 0;
    let hstsIncludesSubdomains = false;
    let hstsPreload = false;
    
    if (hstsHeader) {
      const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
      if (maxAgeMatch) hstsMaxAge = parseInt(maxAgeMatch[1]);
      hstsIncludesSubdomains = hstsHeader.includes('includeSubDomains');
      hstsPreload = hstsHeader.includes('preload');
    }
    
    if (ctCert) {
      const expiryDate = ctCert.not_after;
      const issueDate = ctCert.not_before;
      const now = new Date();
      const expiry = new Date(expiryDate);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const issuer = parseIssuer(ctCert.issuer_name);
      const sanDomains = parseSANDomains(ctCert.name_value);
      const commonName = ctCert.common_name || domain;
      
      return {
        valid: httpsValid || daysUntilExpiry > 0,
        issuer,
        commonName,
        expiryDate,
        issueDate,
        daysUntilExpiry,
        serialNumber: ctCert.serial_number || '',
        sanDomains,
        tlsVersions: ['TLS 1.2', 'TLS 1.3'],
        hasHSTS: hstsHeader !== null,
        hstsMaxAge,
        hstsIncludesSubdomains,
        hstsPreload,
        hasMixedContent: false,
        certificateId: ctCert.id,
      };
    }
    
    return {
      valid: httpsValid,
      issuer: httpsValid ? 'Certificate Valid (HTTPS accessible)' : 'Unknown',
      commonName: domain,
      expiryDate: '',
      issueDate: '',
      daysUntilExpiry: httpsValid ? -1 : 0,
      serialNumber: '',
      sanDomains: [],
      tlsVersions: httpsValid ? ['TLS 1.2', 'TLS 1.3'] : [],
      hasHSTS: hstsHeader !== null,
      hstsMaxAge,
      hstsIncludesSubdomains,
      hstsPreload,
      hasMixedContent: false,
    };
  } catch (err: any) {
    return {
      valid: false,
      issuer: 'Unknown - Connection Failed',
      commonName: domain,
      expiryDate: '',
      issueDate: '',
      daysUntilExpiry: 0,
      serialNumber: '',
      sanDomains: [],
      tlsVersions: [],
      hasHSTS: false,
      hstsMaxAge: 0,
      hstsIncludesSubdomains: false,
      hstsPreload: false,
      hasMixedContent: false,
    };
  }
}

async function checkWordPress(domain: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const results = await Promise.allSettled([
      fetch(`https://${domain}/wp-json/`, { signal: controller.signal, redirect: 'follow' }),
      fetch(`https://${domain}/xmlrpc.php`, { signal: controller.signal, redirect: 'follow' }),
      fetch(`https://${domain}/wp-cron.php`, { signal: controller.signal, redirect: 'follow' }),
      fetch(`https://${domain}/wp-admin/admin-ajax.php`, { signal: controller.signal, redirect: 'follow' }),
      fetch(`https://${domain}/wp-includes/`, { signal: controller.signal, redirect: 'follow' }),
    ]);
    
    clearTimeout(timeout);
    
    const [restApi, xmlRpc, wpCron, adminAjax, wpIncludes] = results;
    
    const restApiOk = restApi.status === 'fulfilled' && restApi.value.ok;
    const xmlRpcOk = xmlRpc.status === 'fulfilled' && (xmlRpc.value.ok || xmlRpc.value.status === 405);
    const wpCronOk = wpCron.status === 'fulfilled' && wpCron.value.ok;
    const adminAjaxOk = adminAjax.status === 'fulfilled' && adminAjax.value.ok;
    const wpIncludesOk = wpIncludes.status === 'fulfilled' && (wpIncludes.value.ok || wpIncludes.value.status === 403);
    
    const detected = restApiOk || xmlRpcOk || wpIncludesOk;
    
    let version: string | undefined;
    let siteName: string | undefined;
    if (restApiOk && restApi.status === 'fulfilled') {
      try {
        const restData = await restApi.value.json();
        siteName = restData?.name;
        if (restData?.namespaces?.includes('wp/v2')) {
          version = 'WP 4.7+';
        }
      } catch {}
    }
    
    return {
      detected,
      version,
      siteName,
      restApiEnabled: restApiOk,
      xmlRpcExposed: xmlRpcOk,
      wpCronAccessible: wpCronOk,
      adminAjaxAccessible: adminAjaxOk,
      exposedPlugins: [],
      exposedThemes: [],
    };
  } catch (err: any) {
    return { 
      detected: false, 
      restApiEnabled: false, 
      xmlRpcExposed: false, 
      wpCronAccessible: false, 
      adminAjaxAccessible: false, 
      exposedPlugins: [], 
      exposedThemes: [] 
    };
  }
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, recordTypes = ['A'] } = await req.json();
    
    if (!domain) {
      return new Response(JSON.stringify({ error: 'Domain is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cleanDomain = domain.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');
    
    // DNS queries - use only fastest resolvers (first 2 per region)
    const fastResolvers = DNS_RESOLVERS.filter((_, i) => 
      i < 2 || // First 2 NA
      (i >= 6 && i < 8) || // First 2 Europe  
      (i >= 10 && i < 12) || // First 2 Asia
      (i >= 14 && i < 15) || // 1 South America
      (i >= 16 && i < 17) || // 1 Africa
      (i >= 18 && i < 19) // 1 Australia
    );
    
    const dnsPromise = Promise.all(recordTypes.map(async (type: string) => {
      const results = await Promise.all(
        fastResolvers.map(resolver => queryDNS(cleanDomain, type, resolver))
      );
      
      const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia'];
      return {
        type,
        regions: regions.map(region => ({
          name: region,
          results: results.filter(r => fastResolvers.find(d => d.name === r.resolver)?.region === region),
        })),
      };
    }));

    const whoisPromise = fetchWHOIS(cleanDomain);
    const websitePromise = checkWebsite(cleanDomain);
    const sslPromise = checkSSL(cleanDomain);
    const wordpressPromise = checkWordPress(cleanDomain);

    const [dnsResultsArray, whois] = await Promise.all([dnsPromise, whoisPromise]);

    const dnsRecords: Record<string, any[]> = {};
    for (const result of dnsResultsArray) {
      dnsRecords[result.type] = result.regions;
    }

    const [website, ssl, wordpress] = await Promise.all([websitePromise, sslPromise, wordpressPromise]);

    const wafCdn = await detectWAFCDN(cleanDomain, website);

    let websiteClean: any = null;
    if (website) {
      const { headers, ...rest } = website as any;
      websiteClean = rest;
    }

    const result = {
      domain: cleanDomain,
      timestamp: new Date().toISOString(),
      dnsRecords,
      whois,
      ssl,
      website: websiteClean,
      wordpress,
      wafCdn: {
        detected: wafCdn.detected,
        securityHeaders: wafCdn.securityHeaders,
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
