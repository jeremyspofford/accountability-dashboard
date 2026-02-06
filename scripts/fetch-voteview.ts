/**
 * VoteView Key Votes Pipeline
 * 
 * Downloads and processes roll call vote data from VoteView
 * (UCLA/Berkeley project providing historical Congressional voting data)
 * 
 * Data sources:
 * - Roll call votes: https://voteview.com/static/data/out/rollcalls/
 * - Member votes: https://voteview.com/static/data/out/votes/
 * - Members: https://voteview.com/static/data/out/members/
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const DATA_DIR = path.join(__dirname, "../src/data");
const CACHE_DIR = path.join(__dirname, "../.cache/voteview");

// Current Congress (119th, 2025-2027)
const CURRENT_CONGRESS = 119;

interface RollCall {
  congress: number;
  chamber: "House" | "Senate";
  rollnumber: number;
  date: string;
  bill_number: string;
  vote_question: string;
  vote_result: string;
  vote_desc: string;
  dtl_desc: string;
  yea_count: number;
  nay_count: number;
}

interface MemberVote {
  icpsr: number;
  congress: number;
  chamber: "House" | "Senate";
  rollnumber: number;
  cast_code: number; // 1=Yea, 6=Nay, 7/8/9=Not voting
}

interface KeyVote {
  id: string;
  congress: number;
  chamber: "House" | "Senate";
  rollnumber: number;
  date: string;
  bill: string;
  title: string;
  description: string;
  category: string;
  yea_count: number;
  nay_count: number;
  result: "Passed" | "Failed" | "Unknown";
  votes: Record<string, "Yea" | "Nay" | "Not Voting">;
}

// Key vote categories for accountability tracking
const KEY_VOTE_CATEGORIES = [
  "Healthcare",
  "Climate & Environment", 
  "Voting Rights",
  "Immigration",
  "Economy & Taxes",
  "Civil Rights",
  "National Security",
  "Government Ethics",
];

// Keywords to identify important votes
const KEY_VOTE_KEYWORDS = [
  // Healthcare
  "affordable care", "medicare", "medicaid", "health care", "health insurance",
  // Climate
  "climate", "environment", "emissions", "clean energy", "paris agreement",
  // Voting
  "voting rights", "election", "ballot", "voter",
  // Immigration
  "immigration", "border", "asylum", "daca", "dreamers",
  // Economy
  "tax", "budget", "appropriations", "spending", "deficit",
  // Civil Rights
  "civil rights", "discrimination", "equality", "lgbtq",
  // National Security
  "defense", "military", "nato", "ukraine", "foreign aid",
  // Ethics
  "ethics", "transparency", "oversight", "impeachment",
];

async function downloadCSV(url: string, filename: string): Promise<string> {
  const cacheFile = path.join(CACHE_DIR, filename);
  
  // Check cache (expires after 24 hours)
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
  
  // Ensure cache directory exists
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, data);
  
  return data;
}

async function fetchRollCalls(congress: number, chamber: "H" | "S"): Promise<RollCall[]> {
  const chamberName = chamber === "H" ? "house" : "senate";
  const url = `https://voteview.com/static/data/out/rollcalls/${chamberName.charAt(0).toUpperCase()}${congress.toString().padStart(3, "0")}_rollcalls.csv`;
  
  try {
    const csv = await downloadCSV(url, `${chamberName}_${congress}_rollcalls.csv`);
    const records = parse(csv, { columns: true, skip_empty_lines: true });
    
    return records.map((r: Record<string, string>) => ({
      congress: parseInt(r.congress),
      chamber: chamber === "H" ? "House" : "Senate",
      rollnumber: parseInt(r.rollnumber),
      date: r.date,
      bill_number: r.bill_number || "",
      vote_question: r.vote_question || "",
      vote_result: r.vote_result || "",
      vote_desc: r.vote_desc || "",
      dtl_desc: r.dtl_desc || "",
      yea_count: parseInt(r.yea_count) || 0,
      nay_count: parseInt(r.nay_count) || 0,
    }));
  } catch (error) {
    console.warn(`No rollcalls found for ${chamberName} ${congress}:`, error);
    return [];
  }
}

async function fetchMemberVotes(congress: number, chamber: "H" | "S"): Promise<MemberVote[]> {
  const chamberName = chamber === "H" ? "house" : "senate";
  const url = `https://voteview.com/static/data/out/votes/${chamberName.charAt(0).toUpperCase()}${congress.toString().padStart(3, "0")}_votes.csv`;
  
  try {
    const csv = await downloadCSV(url, `${chamberName}_${congress}_votes.csv`);
    const records = parse(csv, { columns: true, skip_empty_lines: true });
    
    return records.map((r: Record<string, string>) => ({
      icpsr: parseInt(r.icpsr),
      congress: parseInt(r.congress),
      chamber: chamber === "H" ? "House" : "Senate",
      rollnumber: parseInt(r.rollnumber),
      cast_code: parseInt(r.cast_code),
    }));
  } catch (error) {
    console.warn(`No votes found for ${chamberName} ${congress}:`, error);
    return [];
  }
}

function isKeyVote(rollcall: RollCall): boolean {
  const searchText = `${rollcall.bill_number} ${rollcall.vote_desc} ${rollcall.dtl_desc}`.toLowerCase();
  
  return KEY_VOTE_KEYWORDS.some(keyword => searchText.includes(keyword));
}

function categorizeVote(rollcall: RollCall): string {
  const searchText = `${rollcall.bill_number} ${rollcall.vote_desc} ${rollcall.dtl_desc}`.toLowerCase();
  
  if (searchText.match(/health|medicare|medicaid|affordable care/)) return "Healthcare";
  if (searchText.match(/climate|environment|emission|clean energy/)) return "Climate & Environment";
  if (searchText.match(/voting|election|ballot/)) return "Voting Rights";
  if (searchText.match(/immigra|border|asylum|daca/)) return "Immigration";
  if (searchText.match(/tax|budget|appropriation|spending/)) return "Economy & Taxes";
  if (searchText.match(/civil right|discrimination|equality|lgbtq/)) return "Civil Rights";
  if (searchText.match(/defense|military|nato|ukraine|foreign aid/)) return "National Security";
  if (searchText.match(/ethic|transparency|oversight|impeach/)) return "Government Ethics";
  
  return "Other";
}

async function main() {
  console.log("🗳️  VoteView Key Votes Pipeline");
  console.log("================================\n");
  
  // Load existing members data to map ICPSR to bioguide IDs
  const membersPath = path.join(DATA_DIR, "members.json");
  const members = JSON.parse(fs.readFileSync(membersPath, "utf-8"));
  
  // Create ICPSR to bioguide mapping (we'll need to enhance this)
  console.log(`Loaded ${members.length} members from data file\n`);
  
  const allKeyVotes: KeyVote[] = [];
  
  // Fetch data for both chambers
  for (const chamber of ["H", "S"] as const) {
    const chamberName = chamber === "H" ? "House" : "Senate";
    console.log(`\n📊 Processing ${chamberName}...`);
    
    const rollcalls = await fetchRollCalls(CURRENT_CONGRESS, chamber);
    console.log(`  Found ${rollcalls.length} roll calls`);
    
    if (rollcalls.length === 0) {
      console.log(`  ⚠️  No data yet for ${CURRENT_CONGRESS}th Congress ${chamberName}`);
      continue;
    }
    
    const keyRollCalls = rollcalls.filter(isKeyVote);
    console.log(`  Identified ${keyRollCalls.length} key votes`);
    
    const memberVotes = await fetchMemberVotes(CURRENT_CONGRESS, chamber);
    console.log(`  Loaded ${memberVotes.length} individual vote records`);
    
    // Build vote lookup
    const voteLookup = new Map<string, MemberVote[]>();
    for (const vote of memberVotes) {
      const key = `${vote.chamber}-${vote.rollnumber}`;
      if (!voteLookup.has(key)) {
        voteLookup.set(key, []);
      }
      voteLookup.get(key)!.push(vote);
    }
    
    // Process key votes
    for (const rc of keyRollCalls) {
      const votes = voteLookup.get(`${rc.chamber}-${rc.rollnumber}`) || [];
      
      const voteMap: Record<string, "Yea" | "Nay" | "Not Voting"> = {};
      for (const v of votes) {
        const voteValue = v.cast_code === 1 ? "Yea" 
          : v.cast_code === 6 ? "Nay" 
          : "Not Voting";
        voteMap[v.icpsr.toString()] = voteValue;
      }
      
      allKeyVotes.push({
        id: `${rc.congress}-${rc.chamber}-${rc.rollnumber}`,
        congress: rc.congress,
        chamber: rc.chamber,
        rollnumber: rc.rollnumber,
        date: rc.date,
        bill: rc.bill_number,
        title: rc.vote_question,
        description: rc.vote_desc || rc.dtl_desc,
        category: categorizeVote(rc),
        yea_count: rc.yea_count,
        nay_count: rc.nay_count,
        result: rc.vote_result?.toLowerCase().includes("passed") ? "Passed"
          : rc.vote_result?.toLowerCase().includes("failed") ? "Failed"
          : "Unknown",
        votes: voteMap,
      });
    }
  }
  
  // Sort by date descending
  allKeyVotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  console.log(`\n✅ Total key votes identified: ${allKeyVotes.length}`);
  
  // Category breakdown
  const byCategory = allKeyVotes.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\nBy category:");
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
  
  // Write output
  const outputPath = path.join(DATA_DIR, "key-votes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allKeyVotes, null, 2));
  console.log(`\n💾 Saved to ${outputPath}`);
}

main().catch(console.error);
