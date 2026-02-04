/**
 * Data loading utilities for the accountability dashboard
 * Loads from pipeline JSON output (static at build time)
 */

import membersData from "../data/members.json";

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
  // Real data from Congress.gov
  bills_sponsored: number;
  bills_cosponsored: number;
  // Placeholders (need ProPublica/OpenSecrets)
  party_alignment_pct: number;
  missed_votes_pct: number;
  total_raised: number;
}

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
}

// Transform raw data to include stats
function transformMember(raw: RawMember): Member {
  return {
    ...raw,
    state: STATE_ABBREV[raw.state] || raw.state,
    // Real data from Congress.gov API
    bills_sponsored: raw.bills_sponsored || 0,
    bills_cosponsored: raw.bills_cosponsored || 0,
    // Placeholder stats - need ProPublica/OpenSecrets APIs
    party_alignment_pct: Math.floor(Math.random() * 20) + 80, // 80-99%
    missed_votes_pct: Math.floor(Math.random() * 15), // 0-14%
    total_raised: Math.floor(Math.random() * 10000000) + 500000, // $500k-$10.5M
  };
}

// Cache transformed members
let _members: Member[] | null = null;

export function getMembers(): Member[] {
  if (!_members) {
    _members = (membersData as RawMember[]).map(transformMember);
  }
  return _members;
}

export function getMember(bioguideId: string): Member | undefined {
  return getMembers().find(m => m.bioguide_id === bioguideId);
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
  
  // Reverse lookup for state names
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
