/**
 * Fetch current members of Congress from Congress.gov API
 * 
 * API Docs: https://api.congress.gov/
 * No API key required for basic access (rate limited)
 */

const CONGRESS_API_BASE = "https://api.congress.gov/v3";
const CURRENT_CONGRESS = 118;

// Congress.gov now requires an API key (free)
// Get one at: https://api.congress.gov/sign-up/
const API_KEY = process.env.CONGRESS_API_KEY; // 2023-2025

interface CongressMember {
  bioguideId: string;
  name: string;
  firstName: string;
  lastName: string;
  party: string;
  state: string;
  district?: number;
  chamber: "house" | "senate";
  url: string;
  depiction?: {
    imageUrl: string;
  };
}

interface CongressApiResponse {
  members: CongressMember[];
  pagination: {
    count: number;
    next?: string;
  };
}

async function fetchMembers(chamber: "house" | "senate"): Promise<CongressMember[]> {
  const allMembers: CongressMember[] = [];
  let offset = 0;
  const limit = 250;

  console.log(`Fetching ${chamber} members from Congress.gov...`);

  while (true) {
    const apiKeyParam = API_KEY ? `&api_key=${API_KEY}` : "";
    const url = `${CONGRESS_API_BASE}/member/congress/${CURRENT_CONGRESS}/${chamber}?offset=${offset}&limit=${limit}&format=json${apiKeyParam}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Congress API error: ${response.status} ${response.statusText}`);
    }

    const data: CongressApiResponse = await response.json();
    
    for (const member of data.members) {
      allMembers.push({
        ...member,
        chamber,
      });
    }

    console.log(`  Fetched ${allMembers.length} ${chamber} members so far...`);

    if (!data.pagination.next || data.members.length < limit) {
      break;
    }

    offset += limit;
    
    // Rate limiting - be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return allMembers;
}

export async function fetchAllMembers(): Promise<CongressMember[]> {
  const [houseMembers, senateMembers] = await Promise.all([
    fetchMembers("house"),
    fetchMembers("senate"),
  ]);

  console.log(`\nTotal: ${houseMembers.length} House + ${senateMembers.length} Senate = ${houseMembers.length + senateMembers.length} members`);

  return [...houseMembers, ...senateMembers];
}

// Transform API response to our schema format
export function transformMember(member: CongressMember) {
  // Parse name (API gives "LastName, FirstName MiddleName")
  const nameParts = member.name.split(", ");
  const lastName = nameParts[0] || "";
  const firstName = nameParts[1]?.split(" ")[0] || "";
  
  // Map party codes
  const partyMap: Record<string, string> = {
    "Democratic": "D",
    "Republican": "R",
    "Independent": "I",
  };

  return {
    bioguide_id: member.bioguideId,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    party: partyMap[member.party] || member.party,
    state: member.state,
    district: member.district || null,
    chamber: member.chamber,
    photo_url: member.depiction?.imageUrl || null,
  };
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAllMembers()
    .then(members => {
      console.log("\nSample member:");
      console.log(JSON.stringify(transformMember(members[0]), null, 2));
    })
    .catch(console.error);
}
