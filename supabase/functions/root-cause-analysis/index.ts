import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are an expert hosting support diagnostic AI for HostScope. Your role is to analyze diagnostic data from websites and provide:

1. **Root Cause Analysis**: Identify the most likely root cause of any issues
2. **Confidence Level**: Rate your confidence (0-100%) based on available evidence
3. **Fix Steps**: Provide clear, actionable steps to resolve issues
4. **Customer Explanation**: Write a non-technical explanation for customers
5. **Agent Notes**: Write technical notes for support agents
6. **Developer Steps**: Provide technical implementation details

You specialize in:
- DNS propagation issues
- Email deliverability (SPF, DKIM, DMARC)
- SSL certificate problems
- WordPress troubleshooting
- Server configuration issues
- WAF/CDN detection and configuration

Always be specific, actionable, and prioritize the most impactful fixes first.

Response Format (JSON):
{
  "primaryCause": {
    "id": "unique_id",
    "category": "dns|email|ssl|wordpress|server|security|performance",
    "title": "Brief title",
    "description": "Detailed description",
    "confidence": 0-100,
    "severity": "critical|high|medium|low|info",
    "evidence": ["evidence1", "evidence2"]
  },
  "secondaryCauses": [...],
  "fixSteps": [
    {
      "order": 1,
      "title": "Step title",
      "description": "What to do",
      "code": "optional code snippet",
      "copyable": "value to copy",
      "warning": "optional warning",
      "duration": "5 mins",
      "difficulty": "easy|medium|hard|expert"
    }
  ],
  "customerExplanation": "Non-technical explanation",
  "agentNotes": "Technical notes for support",
  "developerSteps": "Technical implementation details",
  "dnsConfig": "DNS record to add (if applicable)",
  "wpConfig": "WordPress config to add (if applicable)",
  "estimatedResolutionTime": "15-30 minutes",
  "escalationRequired": false,
  "escalationReason": null
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosticData } = await req.json();

    if (!diagnosticData) {
      return new Response(JSON.stringify({ error: 'Diagnostic data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare the diagnostic summary for the AI
    const diagnosticSummary = {
      domain: diagnosticData.domain,
      timestamp: diagnosticData.timestamp,
      dns: {
        hasRecords: Object.keys(diagnosticData.dnsRecords || {}).length > 0,
        recordTypes: Object.keys(diagnosticData.dnsRecords || {}),
        propagationStatus: analyzeDNSPropagation(diagnosticData.dnsRecords),
      },
      whois: diagnosticData.whois ? {
        registrar: diagnosticData.whois.registrar,
        expiryDate: diagnosticData.whois.expiryDate,
        nameservers: diagnosticData.whois.nameservers,
        dnssec: diagnosticData.whois.dnssec,
      } : null,
      ssl: diagnosticData.ssl ? {
        valid: diagnosticData.ssl.valid,
        issuer: diagnosticData.ssl.issuer,
        daysUntilExpiry: diagnosticData.ssl.daysUntilExpiry,
        hasHSTS: diagnosticData.ssl.hasHSTS,
      } : null,
      website: diagnosticData.website ? {
        statusCode: diagnosticData.website.statusCode,
        responseTime: diagnosticData.website.responseTime,
        serverType: diagnosticData.website.serverType,
        compression: diagnosticData.website.compression,
      } : null,
      wordpress: diagnosticData.wordpress,
      email: diagnosticData.email,
      wafCdn: diagnosticData.wafCdn,
    };

    console.log(`Analyzing diagnostics for ${diagnosticData.domain}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: `Analyze this diagnostic data and provide root cause analysis:\n\n${JSON.stringify(diagnosticSummary, null, 2)}`
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: 'No analysis generated' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the JSON from the AI response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      analysis = JSON.parse(jsonMatch[1].trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return a fallback structure
      analysis = {
        primaryCause: {
          id: 'parse_error',
          category: 'server',
          title: 'Analysis Generated',
          description: content.substring(0, 500),
          confidence: 50,
          severity: 'info',
          evidence: [],
        },
        secondaryCauses: [],
        fixSteps: [],
        customerExplanation: 'Our analysis has been completed. Please review the findings above.',
        agentNotes: content,
        developerSteps: '',
        estimatedResolutionTime: 'Varies',
        escalationRequired: false,
      };
    }

    console.log(`Analysis complete for ${diagnosticData.domain}`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Root cause analysis error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeDNSPropagation(dnsRecords: any): string {
  if (!dnsRecords || Object.keys(dnsRecords).length === 0) {
    return 'no_records';
  }

  let totalResults = 0;
  let propagatedResults = 0;

  for (const recordType of Object.keys(dnsRecords)) {
    const regions = dnsRecords[recordType] || [];
    for (const region of regions) {
      for (const result of region.results || []) {
        totalResults++;
        if (result.status === 'propagated') {
          propagatedResults++;
        }
      }
    }
  }

  if (totalResults === 0) return 'no_results';
  const percentage = (propagatedResults / totalResults) * 100;
  
  if (percentage >= 95) return 'fully_propagated';
  if (percentage >= 70) return 'mostly_propagated';
  if (percentage >= 30) return 'partially_propagated';
  return 'not_propagated';
}
