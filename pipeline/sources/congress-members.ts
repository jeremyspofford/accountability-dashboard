/**
 * Fetch current members of Congress from Congress.gov API
 * 
 * API Docs: https://api.congress.gov/
 * API Key required: https://api.congress.gov/sign-up/
 */

const CONGRESS_API_BASE = "https://api.congress.gov/v3";

// API key from environment (required)
const API_KEY = process.env.CONGRESS_API_KEY;

if (!API_KEY) {
  console.error("❌ CONGRESS_API_KEY environment variable is required");
  console.error("   Get one at: https://api.congress.gov/sign-up/");
  process.exit(1);
}

interface CongressMemberRaw {
  bioguideId: string;
  name: string;
  partyName: string;
  state: string;
  district?: number;
  depiction?: {
    imageUrl: string;
  };
  terms: {
    item: Array<{
      chamber: string;
      startYear: number;
      endYear?: number;
    }>;
  };
  url: string;
  // Enriched data from member detail endpoint
  sponsoredLegislation?: { count: number };
  cosponsoredLegislation?: { count: number };
}

interface CongressApiResponse {
  members: CongressMemberRaw[];
  pagination: {
    count: number;
    next?: string;
  };
}

export interface TransformedMember {
  bioguide_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  party: string;
  state: string;
  district: number | null;
  chamber: "house" | "senate";
  photo_url: string | null;
  bills_sponsored: number;
  bills_cosponsored: number;
}

async function fetchCurrentMembers(): Promise<CongressMemberRaw[]> {
  const allMembers: CongressMemberRaw[] = [];
  let offset = 0;
  const limit = 250;

  console.log("Fetching current members from Congress.gov...");

  while (true) {
    const url = `${CONGRESS_API_BASE}/member?currentMember=true&offset=${offset}&limit=${limit}&format=json&api_key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Congress API error: ${response.status} ${response.statusText}\n${body}`);
    }

    const data: CongressApiResponse = await response.json();
    
    allMembers.push(...data.members);

    console.log(`  Fetched ${allMembers.length}/${data.pagination.count} members...`);

    if (!data.pagination.next || data.members.length < limit) {
      break;
    }

    offset += limit;
    
    // Rate limiting - be nice to the API
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return allMembers;
}

export async function fetchAllMembers(): Promise<CongressMemberRaw[]> {
  return fetchCurrentMembers();
}

// Fetch detailed info for a single member (includes bills counts)
async function fetchMemberDetail(bioguideId: string): Promise<{
  sponsoredCount: number;
  cosponsoredCount: number;
} | null> {
  try {
    const url = `${CONGRESS_API_BASE}/member/${bioguideId}?format=json&api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      sponsoredCount: data.member?.sponsoredLegislation?.count || 0,
      cosponsoredCount: data.member?.cosponsoredLegislation?.count || 0,
    };
  } catch {
    return null;
  }
}

// Enrich members with bills data (batched to respect rate limits)
export async function enrichMembersWithBills(
  members: CongressMemberRaw[],
  batchSize = 10,
  delayMs = 500
): Promise<CongressMemberRaw[]> {
  console.log(`Enriching ${members.length} members with bills data...`);
  
  const enriched = [...members];
  
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    
    const details = await Promise.all(
      batch.map(m => fetchMemberDetail(m.bioguideId))
    );
    
    for (let j = 0; j < batch.length; j++) {
      if (details[j]) {
        enriched[i + j] = {
          ...enriched[i + j],
          sponsoredLegislation: { count: details[j]!.sponsoredCount },
          cosponsoredLegislation: { count: details[j]!.cosponsoredCount },
        };
      }
    }
    
    const progress = Math.min(i + batchSize, members.length);
    process.stdout.write(`\r  Enriched ${progress}/${members.length} members...`);
    
    if (i + batchSize < members.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log('\n✓ Bills data enrichment complete');
  return enriched;
}

// Transform API response to our schema format
export function transformMember(member: CongressMemberRaw): TransformedMember {
  // Parse name (API gives "LastName, FirstName MiddleName")
  const nameParts = member.name.split(", ");
  const lastName = nameParts[0] || "";
  const firstName = nameParts[1]?.split(" ")[0] || "";
  
  // Map party names to codes
  const partyMap: Record<string, string> = {
    "Democratic": "D",
    "Republican": "R",
    "Independent": "I",
    "Libertarian": "L",
  };

  // Get current chamber from terms
  const currentTerm = member.terms?.item?.find(t => !t.endYear) || member.terms?.item?.[0];
  const chamber = currentTerm?.chamber === "Senate" ? "senate" : "house";

  return {
    bioguide_id: member.bioguideId,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    party: partyMap[member.partyName] || member.partyName?.charAt(0) || "?",
    state: member.state,
    district: member.district || null,
    chamber,
    photo_url: member.depiction?.imageUrl || null,
    // Real data from API (or 0 if not enriched)
    bills_sponsored: member.sponsoredLegislation?.count || 0,
    bills_cosponsored: member.cosponsoredLegislation?.count || 0,
  };
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAllMembers()
    .then(members => {
      console.log(`\n✓ Fetched ${members.length} current members of Congress`);
      
      const transformed = members.map(transformMember);
      const house = transformed.filter(m => m.chamber === "house");
      const senate = transformed.filter(m => m.chamber === "senate");
      const dems = transformed.filter(m => m.party === "D");
      const reps = transformed.filter(m => m.party === "R");
      
      console.log(`  House: ${house.length}, Senate: ${senate.length}`);
      console.log(`  Democrats: ${dems.length}, Republicans: ${reps.length}`);
      
      console.log("\nSample transformed member:");
      console.log(JSON.stringify(transformed[0], null, 2));
    })
    .catch(console.error);
}
