// DNS Service - handles all DNS related operations
import { RecordType, DNSRegion, DNSResult } from '@/types/diagnostic';

const DNS_RESOLVERS = [
  // North America
  { name: 'Google', location: 'Mountain View, CA', country: 'United States', countryCode: 'US', ip: '8.8.8.8', region: 'North America' },
  { name: 'Cloudflare', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '1.1.1.1', region: 'North America' },
  { name: 'OpenDNS', location: 'San Francisco, CA', country: 'United States', countryCode: 'US', ip: '208.67.222.222', region: 'North America' },
  { name: 'Quad9', location: 'Berkeley, CA', country: 'United States', countryCode: 'US', ip: '9.9.9.9', region: 'North America' },
  // Europe
  { name: 'DNS.Watch', location: 'Frankfurt', country: 'Germany', countryCode: 'DE', ip: '84.200.69.80', region: 'Europe' },
  { name: 'SafeDNS', location: 'London', country: 'United Kingdom', countryCode: 'GB', ip: '195.46.39.39', region: 'Europe' },
  { name: 'FDN', location: 'Paris', country: 'France', countryCode: 'FR', ip: '80.67.169.12', region: 'Europe' },
  // Asia
  { name: 'NTT', location: 'Tokyo', country: 'Japan', countryCode: 'JP', ip: '129.250.35.250', region: 'Asia' },
  { name: 'SingNet', location: 'Singapore', country: 'Singapore', countryCode: 'SG', ip: '165.21.100.88', region: 'Asia' },
  { name: 'KT', location: 'Seoul', country: 'South Korea', countryCode: 'KR', ip: '168.126.63.1', region: 'Asia' },
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

export const REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia'] as const;
export type Region = typeof REGIONS[number];

export async function queryDNS(
  domain: string, 
  type: RecordType, 
  resolverName?: string
): Promise<DNSResult[]> {
  const resolvers = resolverName 
    ? DNS_RESOLVERS.filter(r => r.name === resolverName)
    : DNS_RESOLVERS;

  const results = await Promise.all(
    resolvers.map(async (resolver) => {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(
          `https://dns.google/resolve?name=${domain}&type=${type}`,
          { 
            headers: { 'Accept': 'application/dns-json' },
            signal: controller.signal 
          }
        );
        clearTimeout(timeout);
        
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
      } catch {
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
    })
  );

  return results;
}

export function groupResultsByRegion(results: DNSResult[]): DNSRegion[] {
  return REGIONS.map(region => ({
    name: region,
    results: results.filter(r => {
      const resolver = DNS_RESOLVERS.find(d => d.name === r.resolver);
      return resolver?.region === region;
    }),
  }));
}

export function calculatePropagationPercentage(regions: DNSRegion[]): number {
  const totalResults = regions.flatMap(r => r.results);
  if (totalResults.length === 0) return 0;
  
  const propagatedCount = totalResults.filter(r => r.status === 'propagated').length;
  return Math.round((propagatedCount / totalResults.length) * 100);
}

export function getMostCommonValue(regions: DNSRegion[]): string | null {
  const values = regions
    .flatMap(r => r.results)
    .filter(r => r.status === 'propagated')
    .flatMap(r => r.values);
  
  if (values.length === 0) return null;
  
  const counts = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}
