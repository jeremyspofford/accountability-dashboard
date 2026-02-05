/**
 * Fetch committee membership from ProPublica Congress API
 * 
 * API Docs: https://projects.propublica.org/api-docs/congress-api/
 * Requires API key (free, 5000 requests/day)
 * 
 * Note: Congress.gov API v3 does NOT expose committee membership data,
 * so we use ProPublica as the source for committee information.
 */

const PROPUBLICA_API_BASE = "https://api.propublica.org/congress/v1";
const CURRENT_CONGRESS = 119;

const API_KEY = process.env.PROPUBLICA_API_KEY;

interface ProPublicaMember {
  id: string;
  first_name: string;
  last_name: string;
  roles: Array<{
    congress: string;
    chamber: string;
    title: string;
    state: string;
    party: string;
    start_date: string;
    end_date: string | null;
    committees: Array<{
      name: string;
      code: string;
      api_uri: string;
      side: string | null;
      title: string;
      rank_in_party: number;
      begin_date: string;
      end_date: string | null;
    }>;
    subcommittees: Array<{
      name: string;
      code: string;
      parent_committee_id: string;
      api_uri: string;
      side: string | null;
      title: string;
      rank_in_party: number;
      begin_date: string;
      end_date: string | null;
    }>;
  }>;
}

interface CommitteeAssignment {
  name: string;
  code: string;
  chamber: "house" | "senate" | "joint";
  rank?: number;
  is_chair: boolean;
  is_ranking_member: boolean;
  subcommittees: Array<{
    name: string;
    code: string;
    rank?: number;
    is_chair: boolean;
    is_ranking_member: boolean;
  }>;
}

async function fetchWithAuth(url: string): Promise<Response> {
  if (!API_KEY) {
    throw new Error("PROPUBLICA_API_KEY environment variable required");
  }

  return fetch(url, {
    headers: {
      "X-API-Key": API_KEY,
    },
  });
}

export async function fetchMemberCommittees(
  bioguideId: string
): Promise<CommitteeAssignment[]> {
  const url = `${PROPUBLICA_API_BASE}/members/${bioguideId}.json`;
  
  try {
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      // Member not found or API error - return empty array
      return [];
    }

    const data = await response.json();
    const member: ProPublicaMember = data.results[0];
    
    if (!member || !member.roles || member.roles.length === 0) {
      return [];
    }

    // Get the most recent role (current term)
    const currentRole = member.roles.find(r => !r.end_date) || member.roles[0];
    
    if (!currentRole.committees) {
      return [];
    }

    // Transform committees
    const committees: CommitteeAssignment[] = currentRole.committees.map(c => {
      // Determine chamber from committee code
      let chamber: "house" | "senate" | "joint" = "joint";
      if (c.code.startsWith("H")) {
        chamber = "house";
      } else if (c.code.startsWith("S")) {
        chamber = "senate";
      } else if (c.code.startsWith("J")) {
        chamber = "joint";
      }

      // Parse leadership roles from title
      const title = c.title?.toLowerCase() || "";
      const isChair = title.includes("chair") && !title.includes("ranking");
      const isRankingMember = title.includes("ranking");

      // Find subcommittees for this committee
      const subcommittees = (currentRole.subcommittees || [])
        .filter(s => s.parent_committee_id === c.code)
        .map(s => {
          const subTitle = s.title?.toLowerCase() || "";
          return {
            name: s.name,
            code: s.code,
            rank: s.rank_in_party || undefined,
            is_chair: subTitle.includes("chair") && !subTitle.includes("ranking"),
            is_ranking_member: subTitle.includes("ranking"),
          };
        });

      return {
        name: c.name,
        code: c.code,
        chamber,
        rank: c.rank_in_party || undefined,
        is_chair: isChair,
        is_ranking_member: isRankingMember,
        subcommittees,
      };
    });

    return committees;
  } catch (error) {
    console.error(`Error fetching committees for ${bioguideId}:`, error);
    return [];
  }
}

export async function enrichWithCommittees(
  members: Array<{ bioguide_id: string; full_name: string }>,
  batchSize = 10,
  delayMs = 200
): Promise<Map<string, CommitteeAssignment[]>> {
  console.log(`Fetching committee data for ${members.length} members from ProPublica...`);
  
  const committeesMap = new Map<string, CommitteeAssignment[]>();
  
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    
    const results = await Promise.all(
      batch.map(m => fetchMemberCommittees(m.bioguide_id))
    );
    
    for (let j = 0; j < batch.length; j++) {
      committeesMap.set(batch[j].bioguide_id, results[j]);
    }
    
    const progress = Math.min(i + batchSize, members.length);
    process.stdout.write(`\r  Fetched committees for ${progress}/${members.length} members...`);
    
    if (i + batchSize < members.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log("\n✓ Committee data fetch complete");
  return committeesMap;
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!API_KEY) {
    console.error("Set PROPUBLICA_API_KEY to test");
    process.exit(1);
  }

  // Test with a known member (e.g., Nancy Pelosi)
  fetchMemberCommittees("P000197")
    .then(committees => {
      console.log(`\nFetched ${committees.length} committee assignments`);
      console.log(JSON.stringify(committees, null, 2));
    })
    .catch(console.error);
}
