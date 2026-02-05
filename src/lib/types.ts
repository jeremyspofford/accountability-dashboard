/**
 * Core TypeScript interfaces for the accountability dashboard
 */

// ==================== Member Data ====================

export interface Member {
  bioguide_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  party: "D" | "R" | "I" | string;
  state: string;
  district: number | null;
  chamber: "house" | "senate";
  photo_url: string | null;
  
  // Legislative activity (Congress.gov)
  bills_sponsored: number;
  bills_cosponsored: number;
  
  // Voting behavior (Voteview)
  party_alignment_pct: number;
  ideology_score: number | null;
  votes_cast: number;
  
  // Financial data (OpenFEC)
  total_raised: number;
  
  // Corruption scoring
  corruption_grade: "A" | "B" | "C" | "D" | "F";
  corruption_score: number;
}

// ==================== OpenFEC API ====================

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
  individual_unitemized: number;    // Donations ≤$200 (small donors)
}

export interface FECContributor {
  name: string;
  total: number;
  count: number;
  type: 'individual' | 'pac' | 'party';
}

export interface FECDonorBreakdown {
  candidate_id: string;
  cycle: number;
  
  // Summary percentages
  pac_percentage: number;
  individual_percentage: number;
  small_donor_percentage: number;  // ≤$200
  large_donor_percentage: number;  // >$200
  
  // Top contributors
  top_contributors: FECContributor[];
  
  // Raw totals
  total_raised: number;
  pac_total: number;
  individual_total: number;
  small_donor_total: number;
  large_donor_total: number;
}

// ==================== Corruption Scoring ====================

export interface CorruptionFactors {
  // Financial transparency (0-100, higher is better)
  financialTransparency: number;
  
  // Donor influence (0-100, lower is better - flipped in calculation)
  donorInfluence: number;
  
  // Voting independence (0-100, higher is better)
  votingIndependence: number;
  
  // Net worth growth rate (0-100, lower is better)
  wealthGrowth: number;
}

export interface CorruptionScore {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number; // 0-100
  factors: CorruptionFactors;
  breakdown: {
    financialTransparency: number;
    donorInfluence: number;
    votingIndependence: number;
    wealthGrowth: number;
  };
}

// ==================== Stock Trading ====================

export interface StockTrade {
  disclosure_date: string;
  transaction_date: string;
  ticker: string;
  company_name: string;
  asset_type: 'stock' | 'bond' | 'fund' | 'other';
  transaction_type: 'purchase' | 'sale' | 'exchange';
  amount_range: string;  // e.g., "$15,001 - $50,000"
  
  // Derived data
  estimated_amount_min?: number;
  estimated_amount_max?: number;
}

export interface StockTradeWithContext extends StockTrade {
  // Committee memberships at time of trade
  relevant_committees?: string[];
  
  // Days between trade and disclosure
  days_to_disclosure?: number;
  
  // Stock performance after trade
  price_change_30d?: number;
  price_change_90d?: number;
  
  // Conflict of interest flags
  conflict_flags?: string[];
}

// ==================== Congress.gov API ====================

export interface CongressBill {
  bill_id: string;
  bill_type: string;
  number: string;
  title: string;
  introduced_date: string;
  latest_action: {
    action_date: string;
    text: string;
  };
  sponsors: {
    bioguide_id: string;
    full_name: string;
    party: string;
    state: string;
  }[];
  cosponsors_count: number;
}

export interface CongressVote {
  roll_call: number;
  chamber: 'house' | 'senate';
  session: number;
  vote_date: string;
  question: string;
  result: string;
  total_yes: number;
  total_no: number;
  total_not_voting: number;
}

// ==================== Data Caching ====================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires_at: number;
}

export interface CacheOptions {
  ttl?: number;  // Time to live in milliseconds
  force_refresh?: boolean;
}

// ==================== API Responses ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  cache_timestamp?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    count: number;
    page: number;
    pages: number;
    per_page: number;
  };
}

// ==================== Error Handling ====================

export type ApiErrorCode = 
  | 'NETWORK_ERROR'
  | 'API_KEY_MISSING'
  | 'RATE_LIMIT'
  | 'NOT_FOUND'
  | 'INVALID_REQUEST'
  | 'SERVER_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  retry_after?: number;  // For rate limits
}
