/**
 * Data loading utilities for the accountability dashboard
 * v2: Real data only, no fake scores
 */

import membersData from "../data/members.json";
import financeData from "../data/finance.json";
import tradesData from "../data/trades-by-member.json";
import type { Member, CampaignFinance } from "./types";

// Re-export types for convenience
export type { Member, CampaignFinance } from "./types";

// State name to abbreviation mapping
const STATE_ABBREV: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC",
  "Puerto Rico": "PR", "Guam": "GU", "American Samoa": "AS",
  "Virgin Islands": "VI", "Northern Mariana Islands": "MP",
};

interface RawMember {
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
  party_loyalty_pct?: number | null;
  ideology_score?: number | null;
  votes_cast?: number;
}

// Transform raw member data
function transformMember(raw: RawMember): Member {
  return {
    bioguide_id: raw.bioguide_id,
    first_name: raw.first_name,
    last_name: raw.last_name,
    full_name: raw.full_name,
    party: raw.party as Member["party"],
    state: STATE_ABBREV[raw.state] || raw.state,
    district: raw.district,
    chamber: raw.chamber,
    photo_url: raw.photo_url,
    bills_sponsored: raw.bills_sponsored || 0,
    bills_cosponsored: raw.bills_cosponsored || 0,
    party_alignment_pct: raw.party_loyalty_pct ?? 0,
    ideology_score: raw.ideology_score ?? null,
    votes_cast: raw.votes_cast || 0,
  };
}

// Cache transformed data
let _members: Member[] | null = null;
let _financeMap: Map<string, CampaignFinance> | null = null;

export function getMembers(): Member[] {
  if (!_members) {
    _members = (membersData as RawMember[]).map(transformMember);
  }
  return _members;
}

export function getMember(bioguideId: string): Member | undefined {
  return getMembers().find(m => m.bioguide_id === bioguideId);
}

// Finance data access
function getFinanceMap(): Map<string, CampaignFinance> {
  if (!_financeMap) {
    _financeMap = new Map();
    const data = financeData as Record<string, CampaignFinance>;
    for (const [bioguideId, finance] of Object.entries(data)) {
      _financeMap.set(bioguideId, finance);
    }
  }
  return _financeMap;
}

export function getMemberFinance(bioguideId: string): CampaignFinance | null {
  return getFinanceMap().get(bioguideId) || null;
}

export function getMembersByState(stateAbbrev: string): Member[] {
  return getMembers().filter(m => m.state === stateAbbrev);
}

export function getMembersByChamber(chamber: "house" | "senate"): Member[] {
  return getMembers().filter(m => m.chamber === chamber);
}

export function getMembersByParty(party: string): Member[] {
  return getMembers().filter(m => m.party === party);
}

// Get unique states with their counts
export function getStates(): Array<{ abbrev: string; name: string; count: number }> {
  const stateCount = new Map<string, number>();
  
  for (const member of getMembers()) {
    stateCount.set(member.state, (stateCount.get(member.state) || 0) + 1);
  }
  
  const abbrevToName = Object.fromEntries(
    Object.entries(STATE_ABBREV).map(([name, abbrev]) => [abbrev, name])
  );
  
  return Array.from(stateCount.entries())
    .map(([abbrev, count]) => ({
      abbrev,
      name: abbrevToName[abbrev] || abbrev,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get party breakdown
export function getPartyBreakdown() {
  const members = getMembers();
  return {
    total: members.length,
    democrats: members.filter(m => m.party === "D").length,
    republicans: members.filter(m => m.party === "R").length,
    independents: members.filter(m => m.party === "I").length,
    other: members.filter(m => !["D", "R", "I"].includes(m.party)).length,
    house: members.filter(m => m.chamber === "house").length,
    senate: members.filter(m => m.chamber === "senate").length,
  };
}

// Get members sorted by total raised (for rankings)
export function getMembersByFunding(): Array<Member & { finance: CampaignFinance | null }> {
  const members = getMembers();
  const financeMap = getFinanceMap();
  
  return members
    .map(m => ({
      ...m,
      finance: financeMap.get(m.bioguide_id) || null,
    }))
    .sort((a, b) => {
      const aRaised = a.finance?.total_raised || 0;
      const bRaised = b.finance?.total_raised || 0;
      return bRaised - aRaised;
    });
}

// Stock trades data (from Quiver Quant)
const tradesMap = tradesData as Record<string, Array<{
  ticker: string;
  company: string | null;
  tradedDate: string;
  filedDate: string;
  transaction: string;
  tradeSizeUsd: number;
  excessReturn: number | null;
}>>;

// Get stock trades for a member by bioguide_id
export function getMemberTrades(bioguideId: string) {
  const trades = tradesMap[bioguideId] || [];
  // Sort by trade date, most recent first
  return trades.sort((a, b) => 
    new Date(b.tradedDate).getTime() - new Date(a.tradedDate).getTime()
  );
}
