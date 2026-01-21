
const SUPABASE_URL = "https://enuiabeidlnylfungxsr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudWlhYmVpZGxueWxmdW5neHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDQ1NDEsImV4cCI6MjA4MzYyMDU0MX0.D00Bp9C63xJg2Zky_LkXheToK6ACaZgtckIjCEgT67c";
const TEST_DOMAIN = "example.com";

async function testTool(name, fn) {
    process.stdout.write(`Testing ${name}... `);
    try {
        const result = await fn();
        if (result.success) {
            console.log("✅ Working Perfectly");
            if (result.details) console.log("   " + result.details);
        } else {
            console.log("❌ Issue Found");
            console.log("   Error: " + result.error);
        }
    } catch (e) {
        console.log("❌ Failed");
        console.log("   Exception: " + e.message);
    }
}

async function runTests() {
    console.log("Starting Comprehensive Tool Verification...\n");

    // 1. Test Frontend Availability
    await testTool("Frontend Server", async () => {
        try {
            const res = await fetch("http://localhost:8080");
            return { success: res.ok, details: `Status: ${res.status}` };
        } catch (e) {
            return { success: false, error: "Could not connect to localhost:8080. Is the server running?" };
        }
    });

    // 2. Test Domain Diagnostics (Core Engine)
    let diagnosticData = null;
    await testTool("Domain Diagnostics Engine (Supabase Edge Function)", async () => {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/domain-diagnostics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ domain: TEST_DOMAIN, recordTypes: ["A", "MX"] })
        });

        if (!res.ok) {
            const txt = await res.text();
            return { success: false, error: `API returned ${res.status}: ${txt}` };
        }

        const data = await res.json();
        diagnosticData = data;
        
        // Validation of response structure
        const checks = [];
        if (data.dnsRecords) checks.push("DNS Records");
        if (data.whois) checks.push("WHOIS");
        if (data.ssl) checks.push("SSL");
        if (data.website) checks.push("Website Headers");
        if (data.wordpress) checks.push("CMS Detection");

        return { success: true, details: `Retrieved: ${checks.join(", ")}` };
    });

    if (!diagnosticData) {
        console.log("Skipping dependent tests due to core failure.\n");
        return;
    }

    // 3. Test Individual Features based on Diagnostic Data
    
    // DNS Tool
    await testTool("DNS Propagation Tool", async () => {
        if (diagnosticData.dnsRecords && diagnosticData.dnsRecords.A) {
             return { success: true, details: `Found ${diagnosticData.dnsRecords.A.length} regions` };
        }
        return { success: false, error: "No DNS records returned" };
    });

    // WHOIS Tool
    await testTool("WHOIS Lookup Tool", async () => {
        if (diagnosticData.whois) {
            return { success: true, details: `Registrar: ${diagnosticData.whois.registrar}` };
        }
        return { success: false, error: "WHOIS data missing" };
    });

    // SSL Tool
    await testTool("SSL Inspector", async () => {
        if (diagnosticData.ssl) {
            return { success: true, details: `Issuer: ${diagnosticData.ssl.issuer}, Valid: ${diagnosticData.ssl.valid}` };
        }
        return { success: false, error: "SSL data missing" };
    });

    // WAF/CDN Detector
    await testTool("WAF/CDN Detector", async () => {
        if (diagnosticData.wafCdn) {
             return { success: true, details: `Detected: ${diagnosticData.wafCdn.detected.map(d => d.provider).join(", ") || "None"}` };
        }
        return { success: false, error: "WAF/CDN data missing" };
    });

    // 4. Test Root Cause Analysis (AI Engine)
    await testTool("Root Cause Analysis (AI Engine)", async () => {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/root-cause-analysis`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ diagnosticData })
        });

        if (!res.ok) {
             // It might fail if no OpenAI key is set on backend, but we report the status
            return { success: false, error: `Analysis failed: ${res.status} (Check backend logs/keys)` };
        }
        
        const data = await res.json();
        return { success: true, details: "Generated analysis successfully" };
    });

    console.log("\nVerification Complete.");
}

runTests();
