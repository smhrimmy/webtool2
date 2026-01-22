export interface DNSResolver {
  name: string;
  location: string;
  country: string;
  countryCode: string;
  ip: string;
  region: string;
}

export const DNS_RESOLVERS: DNSResolver[] = [
  // --- North America ---
  { name: 'Google (US)', location: 'Mountain View, CA', country: 'United States', countryCode: 'US', ip: '8.8.8.8', region: 'North America' },
  { name: 'Cloudflare (US)', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '1.1.1.1', region: 'North America' },
  { name: 'Level3 (US)', location: 'Denver, CO', country: 'United States', countryCode: 'US', ip: '4.2.2.1', region: 'North America' },
  { name: 'Comodo (US)', location: 'New York, NY', country: 'United States', countryCode: 'US', ip: '8.26.56.26', region: 'North America' },
  { name: 'Quad9 (US)', location: 'Berkeley, CA', country: 'United States', countryCode: 'US', ip: '9.9.9.9', region: 'North America' },
  { name: 'Verisign (US)', location: 'Reston, VA', country: 'United States', countryCode: 'US', ip: '64.6.64.6', region: 'North America' },
  { name: 'OpenDNS (US)', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '208.67.222.222', region: 'North America' },
  
  // --- Europe ---
  { name: 'DNS.Watch (DE)', location: 'Frankfurt', country: 'Germany', countryCode: 'DE', ip: '84.200.69.80', region: 'Europe' },
  { name: 'UncensoredDNS (DK)', location: 'Copenhagen', country: 'Denmark', countryCode: 'DK', ip: '91.239.100.100', region: 'Europe' },
  { name: 'FDN (FR)', location: 'Paris', country: 'France', countryCode: 'FR', ip: '80.67.169.12', region: 'Europe' },
  { name: 'Yandex (RU)', location: 'Moscow', country: 'Russia', countryCode: 'RU', ip: '77.88.8.8', region: 'Europe' },
  { name: 'Swiss Privacy (CH)', location: 'Zurich', country: 'Switzerland', countryCode: 'CH', ip: '77.109.148.136', region: 'Europe' },
  { name: 'Freenom (NL)', location: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', ip: '80.80.80.80', region: 'Europe' },
  { name: 'SafeDNS (GB)', location: 'London', country: 'United Kingdom', countryCode: 'GB', ip: '195.46.39.39', region: 'Europe' },
  { name: 'CleanBrowsing (EU)', location: 'Madrid', country: 'Spain', countryCode: 'ES', ip: '185.228.168.9', region: 'Europe' },

  // --- Asia ---
  { name: 'SingNet (SG)', location: 'Singapore', country: 'Singapore', countryCode: 'SG', ip: '203.126.118.38', region: 'Asia' },
  { name: 'Korea Telecom (KR)', location: 'Seoul', country: 'South Korea', countryCode: 'KR', ip: '222.122.43.43', region: 'Asia' },
  { name: 'NTT (JP)', location: 'Tokyo', country: 'Japan', countryCode: 'JP', ip: '203.141.131.66', region: 'Asia' },
  { name: 'Taiwan Univ (TW)', location: 'Kaohsiung', country: 'Taiwan', countryCode: 'TW', ip: '140.117.167.174', region: 'Asia' },
  { name: 'Tata Comm (IN)', location: 'Mumbai', country: 'India', countryCode: 'IN', ip: '202.54.1.2', region: 'Asia' },
  { name: 'CNNIC (CN)', location: 'Beijing', country: 'China', countryCode: 'CN', ip: '1.2.4.8', region: 'Asia' },
  { name: '114DNS (CN)', location: 'Nanjing', country: 'China', countryCode: 'CN', ip: '114.114.114.114', region: 'Asia' },
  
  // --- South America ---
  { name: 'Claro (BR)', location: 'São Paulo', country: 'Brazil', countryCode: 'BR', ip: '200.248.178.54', region: 'South America' },
  { name: 'Puntonet (EC)', location: 'Cuenca', country: 'Ecuador', countryCode: 'EC', ip: '190.110.216.222', region: 'South America' },
  { name: 'Coop. Elec (AR)', location: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', ip: '190.0.236.22', region: 'South America' },
  { name: 'DNS Chile (CL)', location: 'Santiago', country: 'Chile', countryCode: 'CL', ip: '200.83.1.5', region: 'South America' },

  // --- Oceania ---
  { name: 'Telstra (AU)', location: 'Sydney', country: 'Australia', countryCode: 'AU', ip: '139.130.4.5', region: 'Australia' },
  { name: 'Optus (AU)', location: 'Melbourne', country: 'Australia', countryCode: 'AU', ip: '211.29.132.12', region: 'Australia' },
  { name: 'Cloudflare (NZ)', location: 'Auckland', country: 'New Zealand', countryCode: 'NZ', ip: '1.0.0.1', region: 'Australia' },

  // --- Africa ---
  { name: 'MTN (ZA)', location: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', ip: '196.43.34.70', region: 'Africa' },
  { name: 'DirectOnPC (NG)', location: 'Lagos', country: 'Nigeria', countryCode: 'NG', ip: '41.204.224.38', region: 'Africa' },
  { name: 'Tunisia BB (TN)', location: 'Tunis', country: 'Tunisia', countryCode: 'TN', ip: '196.203.86.4', region: 'Africa' },
  { name: 'Telecom Egypt (EG)', location: 'Cairo', country: 'Egypt', countryCode: 'EG', ip: '84.36.0.7', region: 'Africa' },
];

export const REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia'] as const;

export type Region = typeof REGIONS[number];

export function getResolversByRegion(region: Region): DNSResolver[] {
  return DNS_RESOLVERS.filter(r => r.region === region);
}

export function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
