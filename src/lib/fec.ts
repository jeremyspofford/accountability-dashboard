/**
 * OpenFEC API integration
 * Fetches campaign finance data for congressional candidates
 */

const FEC_API_BASE = 'https://api.open.fec.gov/v1';
const FEC_API_KEY = process.env.FEC_API_KEY || process.env.NEXT_PUBLIC_FEC_API_KEY;

export interface FECCandidate {
  candidate_id: string;
  name: string;
  party: string;
  office: string;
  state: string;
  district?: string;
  election_years: number[];
}

export interface FECFinancialSummary {
  candidate_id: string;
  cycle: number;
  total_receipts: number;
  total_disbursements: number;
  cash_on_hand: number;
  individual_contributions: number;
  pac_contributions: number;
  party_contributions: number;
  candidate_contributions: number;
  other_receipts: number;
  // Detailed breakdown
  individual_itemized: number;      // Donations >$200
  individual_unitemized: number;    // Donations ≤$200
}

interface FECApiResponse<T> {
  results: T[];
  pagination: {
    count: number;
    page: number;
    pages: number;
    per_page: number;
  };
}

/**
 * Search for a candidate by name
 */
export async function searchCandidateByName(
  firstName: string,
  lastName: string,
  office: 'H' | 'S' = 'H'
): Promise<FECCandidate | null> {
  if (!FEC_API_KEY) {
    console.warn('FEC_API_KEY not configured');
    return null;
  }

  try {
    const name = `${lastName}, ${firstName}`;
    const url = new URL(`${FEC_API_BASE}/candidates/search/`);
    url.searchParams.set('api_key', FEC_API_KEY);
    url.searchParams.set('q', name);
    url.searchParams.set('office', office);
    url.searchParams.set('sort', '-election_years');
    url.searchParams.set('per_page', '5');

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`FEC API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: FECApiResponse<FECCandidate> = await response.json();
    
    // Return the most recent candidate match
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error('Error searching FEC candidate:', error);
    return null;
  }
}

/**
 * Get financial summary for a candidate
 */
export async function getCandidateFinancials(
  candidateId: string,
  cycle?: number
): Promise<FECFinancialSummary | null> {
  if (!FEC_API_KEY) {
    console.warn('FEC_API_KEY not configured');
    return null;
  }

  try {
    // Use current cycle if not specified
    const targetCycle = cycle || new Date().getFullYear();
    
    const url = new URL(`${FEC_API_BASE}/candidate/${candidateId}/totals/`);
    url.searchParams.set('api_key', FEC_API_KEY);
    url.searchParams.set('cycle', targetCycle.toString());
    url.searchParams.set('sort', '-cycle');

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`FEC API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: FECApiResponse<any> = await response.json();
    
    if (data.results && data.results.length > 0) {
      const totals = data.results[0];
      
      return {
        candidate_id: candidateId,
        cycle: totals.cycle || targetCycle,
        total_receipts: totals.receipts || 0,
        total_disbursements: totals.disbursements || 0,
        cash_on_hand: totals.cash_on_hand_end_period || 0,
        individual_contributions: totals.individual_contributions || 0,
        pac_contributions: (totals.other_political_committee_contributions || 0),
        party_contributions: totals.political_party_committee_contributions || 0,
        candidate_contributions: totals.candidate_contribution || 0,
        other_receipts: totals.other_receipts || 0,
        individual_itemized: totals.individual_itemized_contributions || 0,
        individual_unitemized: totals.individual_unitemized_contributions || 0,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching FEC financials:', error);
    return null;
  }
}

/**
 * Get FEC data for a member (search + financials in one call)
 */
export async function getMemberFECData(
  firstName: string,
  lastName: string,
  chamber: 'house' | 'senate'
): Promise<{
  candidate: FECCandidate | null;
  financials: FECFinancialSummary | null;
}> {
  const office = chamber === 'house' ? 'H' : 'S';
  const candidate = await searchCandidateByName(firstName, lastName, office);
  
  if (!candidate) {
    return { candidate: null, financials: null };
  }

  const financials = await getCandidateFinancials(candidate.candidate_id);
  
  return { candidate, financials };
}
