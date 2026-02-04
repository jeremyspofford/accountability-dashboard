/**
 * Fetch campaign finance data from FEC API
 * 
 * Data includes:
 * - Total receipts (money raised)
 * - Total disbursements (money spent)
 * - Cash on hand
 * 
 * Docs: https://api.open.fec.gov/developers/
 */

const FEC_API_BASE = "https://api.open.fec.gov/v1";
const API_KEY = process.env.FEC_API_KEY || "DEMO_KEY"; // DEMO_KEY has lower rate limits
const CURRENT_CYCLE = 2024;

export interface FECCandidate {
  candidate_id: string;
  name: string;
  party: string;
  state: string;
  district: string | null;
  office: string; // H = House, S = Senate
  receipts: number;
  disbursements: number;
  cash_on_hand: number;
}

interface FECSearchResult {
  candidate_id: string;
  name: string;
  party: string;
  state: string;
  district: string;
  office: string;
}

interface FECTotalsResult {
  candidate_id: string;
  name: string;
  receipts: number;
  disbursements: number;
  cash_on_hand_end_period: string | number;
}

// Search for a candidate by name and state
async function searchCandidate(
  name: string,
  state: string,
  office: "H" | "S",
  district?: number
): Promise<FECSearchResult | null> {
  const lastName = name.split(" ").pop()?.toUpperCase() || name;
  
  let url = `${FEC_API_BASE}/candidates/?api_key=${API_KEY}&name=${encodeURIComponent(lastName)}&state=${state}&office=${office}&is_active_candidate=true&sort=-election_years`;
  
  if (office === "H" && district) {
    url += `&district=${String(district).padStart(2, '0')}`;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Find best match by comparing names
    const candidates = data.results || [];
    const match = candidates.find((c: FECSearchResult) => {
      const cName = c.name.toLowerCase();
      const searchName = name.toLowerCase();
      return cName.includes(searchName.split(" ")[0]) || 
             searchName.includes(cName.split(",")[0].toLowerCase());
    });
    
    return match || candidates[0] || null;
  } catch {
    return null;
  }
}

// Get financial totals for a candidate
async function getCandidateTotals(candidateId: string): Promise<FECTotalsResult | null> {
  const url = `${FEC_API_BASE}/candidates/totals/?api_key=${API_KEY}&candidate_id=${candidateId}&cycle=${CURRENT_CYCLE}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}

// Fetch finance data for a single member
export async function fetchMemberFinance(
  fullName: string,
  state: string,
  chamber: "house" | "senate",
  district?: number | null
): Promise<{ receipts: number; disbursements: number; cashOnHand: number } | null> {
  const office = chamber === "house" ? "H" : "S";
  
  const candidate = await searchCandidate(fullName, state, office, district || undefined);
  if (!candidate) return null;
  
  const totals = await getCandidateTotals(candidate.candidate_id);
  if (!totals) return null;
  
  return {
    receipts: totals.receipts || 0,
    disbursements: totals.disbursements || 0,
    cashOnHand: parseFloat(String(totals.cash_on_hand_end_period)) || 0,
  };
}

// Batch fetch for multiple members (with rate limiting)
export async function enrichMembersWithFinance<T extends {
  full_name: string;
  state: string;
  chamber: "house" | "senate";
  district: number | null;
}>(
  members: T[],
  batchSize = 5,
  delayMs = 1000 // FEC DEMO_KEY has strict rate limits
): Promise<Map<string, { receipts: number; disbursements: number; cashOnHand: number }>> {
  const results = new Map<string, { receipts: number; disbursements: number; cashOnHand: number }>();
  
  console.log(`Fetching FEC finance data for ${members.length} members...`);
  console.log(`  (Using ${API_KEY === 'DEMO_KEY' ? 'DEMO_KEY - limited rate' : 'production key'})`);
  
  let found = 0;
  
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    
    for (const member of batch) {
      const finance = await fetchMemberFinance(
        member.full_name,
        member.state,
        member.chamber,
        member.district
      );
      
      if (finance && finance.receipts > 0) {
        results.set(member.full_name, finance);
        found++;
      }
    }
    
    const progress = Math.min(i + batchSize, members.length);
    process.stdout.write(`\r  Processed ${progress}/${members.length} (found ${found})...`);
    
    if (i + batchSize < members.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log(`\n✓ Found finance data for ${found}/${members.length} members`);
  return results;
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  // Test with Bernie Sanders
  fetchMemberFinance("Bernard Sanders", "VT", "senate")
    .then(result => {
      console.log("Bernie Sanders finance:");
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(console.error);
}
