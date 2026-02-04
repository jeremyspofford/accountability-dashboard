/**
 * Fetch voting data from Voteview (UCLA)
 * 
 * Data includes:
 * - DW-NOMINATE ideology scores (dim1: liberal-conservative)
 * - Vote counts and error rates
 * - Party codes
 * 
 * Docs: https://voteview.com/data
 */

const VOTEVIEW_BASE = "https://voteview.com/static/data/out/members";
const CURRENT_CONGRESS = 119;

export interface VoteviewMember {
  congress: number;
  chamber: string;
  bioguide_id: string;
  state_abbrev: string;
  party_code: number; // 100 = Democrat, 200 = Republican, 328 = Independent
  nominate_dim1: number | null; // Ideology: negative = liberal, positive = conservative
  nominate_dim2: number | null;
  nominate_number_of_votes: number | null;
  nominate_number_of_errors: number | null; // Votes against party prediction
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchVoteviewData(): Promise<Map<string, VoteviewMember>> {
  const members = new Map<string, VoteviewMember>();
  
  // Fetch both House and Senate
  for (const chamber of ['H', 'S']) {
    const url = `${VOTEVIEW_BASE}/${chamber}${CURRENT_CONGRESS}_members.csv`;
    console.log(`Fetching Voteview ${chamber === 'H' ? 'House' : 'Senate'} data...`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`  Failed to fetch ${url}: ${response.status}`);
        continue;
      }
      
      const csv = await response.text();
      const lines = csv.trim().split('\n');
      const headers = parseCSVLine(lines[0]);
      
      // Find column indices
      const idx = {
        congress: headers.indexOf('congress'),
        chamber: headers.indexOf('chamber'),
        bioguide_id: headers.indexOf('bioguide_id'),
        state_abbrev: headers.indexOf('state_abbrev'),
        party_code: headers.indexOf('party_code'),
        nominate_dim1: headers.indexOf('nominate_dim1'),
        nominate_dim2: headers.indexOf('nominate_dim2'),
        nominate_number_of_votes: headers.indexOf('nominate_number_of_votes'),
        nominate_number_of_errors: headers.indexOf('nominate_number_of_errors'),
      };
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const bioguideId = values[idx.bioguide_id];
        
        if (!bioguideId) continue;
        
        members.set(bioguideId, {
          congress: parseInt(values[idx.congress]) || CURRENT_CONGRESS,
          chamber: values[idx.chamber],
          bioguide_id: bioguideId,
          state_abbrev: values[idx.state_abbrev],
          party_code: parseInt(values[idx.party_code]) || 0,
          nominate_dim1: values[idx.nominate_dim1] ? parseFloat(values[idx.nominate_dim1]) : null,
          nominate_dim2: values[idx.nominate_dim2] ? parseFloat(values[idx.nominate_dim2]) : null,
          nominate_number_of_votes: values[idx.nominate_number_of_votes] ? parseInt(values[idx.nominate_number_of_votes]) : null,
          nominate_number_of_errors: values[idx.nominate_number_of_errors] ? parseInt(values[idx.nominate_number_of_errors]) : null,
        });
      }
      
      console.log(`  Got ${chamber === 'H' ? 'House' : 'Senate'}: ${lines.length - 1} members`);
    } catch (err) {
      console.warn(`  Error fetching ${chamber} data:`, err);
    }
  }
  
  console.log(`✓ Total Voteview members: ${members.size}`);
  return members;
}

/**
 * Calculate party loyalty percentage from Voteview data
 * Based on nominate_number_of_errors / nominate_number_of_votes
 */
export function calculatePartyLoyalty(member: VoteviewMember): number | null {
  if (!member.nominate_number_of_votes || member.nominate_number_of_votes === 0) {
    return null;
  }
  
  const errors = member.nominate_number_of_errors || 0;
  const votes = member.nominate_number_of_votes;
  const loyalty = ((votes - errors) / votes) * 100;
  
  return Math.round(loyalty * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate missed votes percentage
 * Note: Voteview doesn't have this directly, would need separate data source
 */
export function calculateMissedVotes(member: VoteviewMember, totalVotesInChamber: number): number | null {
  if (!member.nominate_number_of_votes || totalVotesInChamber === 0) {
    return null;
  }
  
  const missed = totalVotesInChamber - member.nominate_number_of_votes;
  const pct = (missed / totalVotesInChamber) * 100;
  
  return Math.round(pct * 10) / 10;
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchVoteviewData()
    .then(members => {
      console.log("\nSample member:");
      const sample = Array.from(members.values())[0];
      console.log(JSON.stringify(sample, null, 2));
      console.log(`Party loyalty: ${calculatePartyLoyalty(sample)}%`);
    })
    .catch(console.error);
}
