export interface DNSResolver {
  name: string;
  location: string;
  country: string;
  countryCode: string;
  ip: string;
  region: string;
}

export const DNS_RESOLVERS: DNSResolver[] = [
  // North America
  { name: 'Google', location: 'Mountain View, CA', country: 'United States', countryCode: 'US', ip: '8.8.8.8', region: 'North America' },
  { name: 'Cloudflare', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '1.1.1.1', region: 'North America' },
  { name: 'OpenDNS', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '208.67.222.222', region: 'North America' },
  { name: 'Quad9', location: 'Berkeley, CA', country: 'United States', countryCode: 'US', ip: '9.9.9.9', region: 'North America' },
  { name: 'Level3', location: 'Denver, CO', country: 'United States', countryCode: 'US', ip: '4.2.2.1', region: 'North America' },
  { name: 'Comodo', location: 'New York, NY', country: 'United States', countryCode: 'US', ip: '8.26.56.26', region: 'North America' },
  { name: 'Rogers', location: 'Toronto', country: 'Canada', countryCode: 'CA', ip: '64.71.255.198', region: 'North America' },
  
  // Europe
  { name: 'DNS.Watch', location: 'Frankfurt', country: 'Germany', countryCode: 'DE', ip: '84.200.69.80', region: 'Europe' },
  { name: 'Freenom', location: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', ip: '80.80.80.80', region: 'Europe' },
  { name: 'UncensoredDNS', location: 'Copenhagen', country: 'Denmark', countryCode: 'DK', ip: '91.239.100.100', region: 'Europe' },
  { name: 'SafeDNS', location: 'London', country: 'United Kingdom', countryCode: 'GB', ip: '195.46.39.39', region: 'Europe' },
  { name: 'FDN', location: 'Paris', country: 'France', countryCode: 'FR', ip: '80.67.169.12', region: 'Europe' },
  
  // Asia
  { name: 'Baidu', location: 'Beijing', country: 'China', countryCode: 'CN', ip: '180.76.76.76', region: 'Asia' },
  { name: 'CNNIC', location: 'Shanghai', country: 'China', countryCode: 'CN', ip: '1.2.4.8', region: 'Asia' },
  { name: 'NTT', location: 'Tokyo', country: 'Japan', countryCode: 'JP', ip: '129.250.35.250', region: 'Asia' },
  { name: 'KT', location: 'Seoul', country: 'South Korea', countryCode: 'KR', ip: '168.126.63.1', region: 'Asia' },
  { name: 'TATA', location: 'Mumbai', country: 'India', countryCode: 'IN', ip: '202.54.1.2', region: 'Asia' },
  { name: 'SingNet', location: 'Singapore', country: 'Singapore', countryCode: 'SG', ip: '165.21.100.88', region: 'Asia' },
  
  // South America
  { name: 'LACNIC', location: 'Montevideo', country: 'Uruguay', countryCode: 'UY', ip: '200.40.220.245', region: 'South America' },
  { name: 'Claro', location: 'São Paulo', country: 'Brazil', countryCode: 'BR', ip: '200.248.178.54', region: 'South America' },
  { name: 'Movistar', location: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', ip: '200.69.193.2', region: 'South America' },
  
  // Africa
  { name: 'MTN', location: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', ip: '196.43.34.70', region: 'Africa' },
  { name: 'Afrihost', location: 'Cape Town', country: 'South Africa', countryCode: 'ZA', ip: '196.22.142.2', region: 'Africa' },
  
  // Australia/Oceania
  { name: 'Telstra', location: 'Sydney', country: 'Australia', countryCode: 'AU', ip: '139.130.4.5', region: 'Australia' },
  { name: 'Optus', location: 'Melbourne', country: 'Australia', countryCode: 'AU', ip: '211.29.132.12', region: 'Australia' },
  { name: 'Spark', location: 'Auckland', country: 'New Zealand', countryCode: 'NZ', ip: '202.27.184.3', region: 'Australia' },
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
