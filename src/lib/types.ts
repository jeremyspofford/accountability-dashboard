/**
 * Core TypeScript interfaces for the accountability dashboard
 * v2: Focused on transparency data, no arbitrary grades
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
  
  // Committee assignments (Congress.gov)
  committees: Committee[];
  
  // Voting behavior (Voteview)
  party_alignment_pct: number;
  ideology_score: number | null;
  votes_cast: number;
}

// ==================== Committee Data ====================

export interface Committee {
  name: string;
  code: string;
  chamber: "house" | "senate" | "joint";
  rank?: number;
  is_chair: boolean;
  is_ranking_member: boolean;
  // Subcommittees
  subcommittees?: Subcommittee[];
}

export interface Subcommittee {
  name: string;
  code: string;
  rank?: number;
  is_chair: boolean;
  is_ranking_member: boolean;
}

// ==================== Campaign Finance (OpenFEC) ====================

export interface CampaignFinance {
  candidate_id: string;
  cycle: number;
  
  // Totals
  total_raised: number;
  total_spent: number;
  cash_on_hand: number;
  
  // Source breakdown
  individual_contributions: number;
  pac_contributions: number;
  party_contributions: number;
  candidate_self_funding: number;
  
  // Individual donor breakdown
  small_donors: number;        // ≤$200 (unitemized)
  large_donors: number;        // >$200 (itemized)
  
  // Percentages for quick display
  pac_percentage: number;
  small_donor_percentage: number;
  large_donor_percentage: number;
  
  // Top contributors
  top_contributors: Contributor[];
  
  // Industry breakdown
  top_industries: IndustryDonation[];
}

export interface Contributor {
  name: string;
  total: number;
  count: number;
  type: 'individual' | 'pac' | 'party' | 'committee';
  employer?: string;
  occupation?: string;
}

export interface IndustryDonation {
  industry: string;
  total: number;
  pac_amount: number;
  individual_amount: number;
}

// ==================== Red Flags (Transparency Indicators) ====================

export interface RedFlag {
  type: 'finance' | 'trading' | 'wealth' | 'voting';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  data?: Record<string, unknown>;
}

// ==================== Stock Trading ====================

export interface StockTrade {
  disclosure_date: string;
  transaction_date: string;
  ticker: string;
  company_name: string;
  asset_type: 'stock' | 'bond' | 'fund' | 'option' | 'other';
  transaction_type: 'purchase' | 'sale' | 'exchange';
  amount_range: string;  // e.g., "$15,001 - $50,000"
  
  // Parsed amounts
  amount_min?: number;
  amount_max?: number;
}

export interface TradingProfile {
  total_trades: number;
  total_value_min: number;
  total_value_max: number;
  
  // Conflict of interest analysis
  committee_related_trades: number;
  days_to_disclosure_avg: number;
  
  // Flagged trades
  flagged_trades: FlaggedTrade[];
}

export interface FlaggedTrade extends StockTrade {
  flag_reason: string;
  related_committee?: string;
  related_legislation?: string;
}

// ==================== Wealth Tracking ====================

export interface WealthSnapshot {
  year: number;
  net_worth_min: number;
  net_worth_max: number;
  net_worth_mid: number;  // Midpoint estimate
  source: 'disclosure' | 'estimate';
}

export interface WealthProfile {
  first_year_in_office: number;
  snapshots: WealthSnapshot[];
  
  // Calculated metrics
  total_change: number;
  percent_change: number;
  annual_growth_rate: number;
  
  // Context
  median_constituent_income?: number;
  salary_total?: number;  // Total salary earned over period
}

// ==================== Voting Record ====================

export interface VoteCategory {
  category: string;  // Healthcare, Environment, Defense, etc.
  total_votes: number;
  votes_for: number;
  votes_against: number;
  abstained: number;
  
  // Notable votes
  key_votes: KeyVote[];
}

export interface KeyVote {
  date: string;
  bill_id: string;
  bill_title: string;
  vote: 'yea' | 'nay' | 'abstain' | 'not_voting';
  bill_outcome: 'passed' | 'failed';
  
  // Context
  description?: string;
  who_benefits?: string[];  // ['corporations', 'consumers', etc.]
}

// ==================== API Types ====================

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
  individual_itemized: number;
  individual_unitemized: number;
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
  pac_percentage: number;
  individual_percentage: number;
  small_donor_percentage: number;
  large_donor_percentage: number;
  top_contributors: FECContributor[];
  total_raised: number;
  pac_total: number;
  individual_total: number;
  small_donor_total: number;
  large_donor_total: number;
}

// ==================== Cache & API Utilities ====================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires_at: number;
}

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
  retry_after?: number;
}
