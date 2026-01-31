/**
 * Fetch voting records from ProPublica Congress API
 * 
 * API Docs: https://projects.propublica.org/api-docs/congress-api/
 * Requires API key (free, 5000 requests/day)
 */

const PROPUBLICA_API_BASE = "https://api.propublica.org/congress/v1";
const CURRENT_CONGRESS = 118;

// Will be loaded from environment
const API_KEY = process.env.PROPUBLICA_API_KEY;

interface VotePosition {
  member_id: string;
  name: string;
  party: string;
  state: string;
  vote_position: string;
}

interface Vote {
  roll_call: number;
  bill?: {
    bill_id: string;
    title: string;
  };
  question: string;
  result: string;
  date: string;
  time: string;
  positions: VotePosition[];
}

interface VotesResponse {
  results: {
    votes: Vote[];
  }[];
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

export async function fetchRecentVotes(
  chamber: "house" | "senate",
  offset = 0
): Promise<Vote[]> {
  console.log(`Fetching recent ${chamber} votes (offset: ${offset})...`);

  const url = `${PROPUBLICA_API_BASE}/${chamber}/votes/recent.json?offset=${offset}`;
  const response = await fetchWithAuth(url);

  if (!response.ok) {
    throw new Error(`ProPublica API error: ${response.status} ${response.statusText}`);
  }

  const data: VotesResponse = await response.json();
  return data.results[0]?.votes || [];
}

export async function fetchMemberVotes(
  bioguideId: string,
  congress = CURRENT_CONGRESS
): Promise<any[]> {
  console.log(`Fetching votes for member ${bioguideId}...`);

  const url = `${PROPUBLICA_API_BASE}/members/${bioguideId}/votes.json`;
  const response = await fetchWithAuth(url);

  if (!response.ok) {
    throw new Error(`ProPublica API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results[0]?.votes || [];
}

// Transform vote to our schema
export function transformVote(vote: any, bioguideId: string) {
  return {
    bioguide_id: bioguideId,
    roll_call_id: `${vote.congress}-${vote.chamber}-${vote.roll_call}`,
    bill_id: vote.bill?.bill_id || null,
    vote_date: vote.date,
    vote_position: vote.position,
    question: vote.question,
    result: vote.result,
  };
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!API_KEY) {
    console.error("Set PROPUBLICA_API_KEY to test");
    process.exit(1);
  }

  fetchRecentVotes("senate")
    .then(votes => {
      console.log(`\nFetched ${votes.length} recent Senate votes`);
      if (votes[0]) {
        console.log("\nSample vote:");
        console.log(JSON.stringify(votes[0], null, 2));
      }
    })
    .catch(console.error);
}
