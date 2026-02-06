/**
 * Build ICPSR to Bioguide ID mapping from VoteView data
 * 
 * VoteView uses ICPSR IDs; our members use Bioguide IDs
 * This creates a mapping file to link votes to members
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const DATA_DIR = path.join(__dirname, "../src/data");
const CACHE_DIR = path.join(__dirname, "../.cache/voteview");

const CURRENT_CONGRESS = 119;

interface VoteViewMember {
  icpsr: number;
  bioguide_id: string;
  state_abbrev: string;
  district_code: string;
  state_icpsr: number;
  party_code: number;
  chamber: "House" | "Senate";
  bioname: string;
}

async function downloadCSV(url: string, filename: string): Promise<string> {
  const cacheFile = path.join(CACHE_DIR, filename);
  
  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    const age = Date.now() - stats.mtimeMs;
    if (age < 24 * 60 * 60 * 1000) {
      console.log(`Using cached: ${filename}`);
      return fs.readFileSync(cacheFile, "utf-8");
    }
  }
  
  console.log(`Downloading: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  
  const data = await response.text();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, data);
  
  return data;
}

async function fetchMembers(congress: number, chamber: "H" | "S"): Promise<VoteViewMember[]> {
  const chamberName = chamber === "H" ? "house" : "senate";
  const url = `https://voteview.com/static/data/out/members/${chamberName.charAt(0).toUpperCase()}${congress.toString().padStart(3, "0")}_members.csv`;
  
  try {
    const csv = await downloadCSV(url, `${chamberName}_${congress}_members.csv`);
    const records = parse(csv, { columns: true, skip_empty_lines: true });
    
    return records.map((r: Record<string, string>) => ({
      icpsr: parseInt(r.icpsr),
      bioguide_id: r.bioguide_id || "",
      state_abbrev: r.state_abbrev,
      district_code: r.district_code,
      state_icpsr: parseInt(r.state_icpsr),
      party_code: parseInt(r.party_code),
      chamber: chamber === "H" ? "House" : "Senate",
      bioname: r.bioname,
    }));
  } catch (error) {
    console.warn(`No members found for ${chamberName} ${congress}:`, error);
    return [];
  }
}

async function main() {
  console.log("🔗 Building ICPSR → Bioguide ID mapping\n");
  
  const icpsrToBioguide: Record<string, string> = {};
  const bioguideToIcpsr: Record<string, string> = {};
  
  // Fetch from both chambers
  for (const chamber of ["H", "S"] as const) {
    const members = await fetchMembers(CURRENT_CONGRESS, chamber);
    console.log(`  ${chamber === "H" ? "House" : "Senate"}: ${members.length} members`);
    
    for (const m of members) {
      if (m.bioguide_id && m.icpsr) {
        icpsrToBioguide[m.icpsr.toString()] = m.bioguide_id;
        bioguideToIcpsr[m.bioguide_id] = m.icpsr.toString();
      }
    }
  }
  
  console.log(`\n✅ Mapped ${Object.keys(icpsrToBioguide).length} members`);
  
  // Write mapping files
  const icpsrMapPath = path.join(DATA_DIR, "icpsr-to-bioguide.json");
  fs.writeFileSync(icpsrMapPath, JSON.stringify(icpsrToBioguide, null, 2));
  console.log(`💾 Saved ICPSR→Bioguide: ${icpsrMapPath}`);
  
  const bioguideMapPath = path.join(DATA_DIR, "bioguide-to-icpsr.json");
  fs.writeFileSync(bioguideMapPath, JSON.stringify(bioguideToIcpsr, null, 2));
  console.log(`💾 Saved Bioguide→ICPSR: ${bioguideMapPath}`);
  
  // Now update key-votes.json to include bioguide IDs
  console.log("\n🔄 Updating key-votes.json with bioguide IDs...");
  
  const keyVotesPath = path.join(DATA_DIR, "key-votes.json");
  const keyVotes = JSON.parse(fs.readFileSync(keyVotesPath, "utf-8"));
  
  let mapped = 0;
  let unmapped = 0;
  
  for (const vote of keyVotes) {
    const bioguideVotes: Record<string, string> = {};
    
    for (const [icpsr, voteValue] of Object.entries(vote.votes)) {
      const bioguide = icpsrToBioguide[icpsr];
      if (bioguide) {
        bioguideVotes[bioguide] = voteValue as string;
        mapped++;
      } else {
        unmapped++;
      }
    }
    
    // Replace ICPSR votes with bioguide votes
    vote.votes = bioguideVotes;
  }
  
  fs.writeFileSync(keyVotesPath, JSON.stringify(keyVotes, null, 2));
  console.log(`✅ Updated votes: ${mapped} mapped, ${unmapped} unmapped`);
}

main().catch(console.error);
