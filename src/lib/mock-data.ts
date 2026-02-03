// Mock data for development - replace with real DB queries

export interface Member {
  bioguide_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  party: "D" | "R" | "I";
  state: string;
  district: number | null;
  chamber: "house" | "senate";
  photo_url: string | null;
  party_alignment_pct: number;
  missed_votes_pct: number;
  bills_sponsored: number;
  total_raised: number;
}

export function getMockMembers(): Member[] {
  return [
    {
      bioguide_id: "S000033",
      first_name: "Bernard",
      last_name: "Sanders",
      full_name: "Bernie Sanders",
      party: "I",
      state: "VT",
      district: null,
      chamber: "senate",
      photo_url: null,
      party_alignment_pct: 95,
      missed_votes_pct: 2,
      bills_sponsored: 42,
      total_raised: 45000000,
    },
    {
      bioguide_id: "P000197",
      first_name: "Nancy",
      last_name: "Pelosi",
      full_name: "Nancy Pelosi",
      party: "D",
      state: "CA",
      district: 11,
      chamber: "house",
      photo_url: null,
      party_alignment_pct: 98,
      missed_votes_pct: 5,
      bills_sponsored: 28,
      total_raised: 18000000,
    },
    {
      bioguide_id: "C001098",
      first_name: "Ted",
      last_name: "Cruz",
      full_name: "Ted Cruz",
      party: "R",
      state: "TX",
      district: null,
      chamber: "senate",
      photo_url: null,
      party_alignment_pct: 92,
      missed_votes_pct: 8,
      bills_sponsored: 35,
      total_raised: 22000000,
    },
    {
      bioguide_id: "O000172",
      first_name: "Alexandria",
      last_name: "Ocasio-Cortez",
      full_name: "Alexandria Ocasio-Cortez",
      party: "D",
      state: "NY",
      district: 14,
      chamber: "house",
      photo_url: null,
      party_alignment_pct: 91,
      missed_votes_pct: 1,
      bills_sponsored: 24,
      total_raised: 12000000,
    },
    {
      bioguide_id: "G000068",
      first_name: "Marjorie",
      last_name: "Taylor Greene",
      full_name: "Marjorie Taylor Greene",
      party: "R",
      state: "GA",
      district: 14,
      chamber: "house",
      photo_url: null,
      party_alignment_pct: 78,
      missed_votes_pct: 12,
      bills_sponsored: 8,
      total_raised: 15000000,
    },
    {
      bioguide_id: "M001137",
      first_name: "Gregory",
      last_name: "Meeks",
      full_name: "Gregory Meeks",
      party: "D",
      state: "NY",
      district: 5,
      chamber: "house",
      photo_url: null,
      party_alignment_pct: 96,
      missed_votes_pct: 3,
      bills_sponsored: 18,
      total_raised: 3000000,
    },
  ];
}

export function getMockMember(bioguide_id: string): Member | undefined {
  return getMockMembers().find(m => m.bioguide_id === bioguide_id);
}
