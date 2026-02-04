/**
 * Main data pipeline - fetches and processes all data sources
 * 
 * Run with: pnpm pipeline
 * 
 * This script:
 * 1. Fetches current members from Congress.gov
 * 2. Fetches voting records from ProPublica
 * 3. Fetches campaign finance from OpenSecrets/FEC
 * 4. Computes aggregate stats
 * 5. Writes everything to the database
 */

import { fetchAllMembers, transformMember, enrichMembersWithBills } from "./sources/congress-members.js";
import { fetchVoteviewData, calculatePartyLoyalty, VoteviewMember } from "./sources/voteview.js";

async function runPipeline() {
  console.log("=".repeat(60));
  console.log("Accountability Dashboard - Data Pipeline");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Step 1: Fetch members
    console.log("\n[1/4] Fetching Congress members...");
    const members = await fetchAllMembers();
    console.log(`✓ Got ${members.length} members\n`);
    
    // Step 1b: Enrich with bills data
    console.log("[1b/4] Enriching with bills data...");
    const enrichedMembers = await enrichMembersWithBills(members);
    const transformedMembers = enrichedMembers.map(transformMember);
    console.log(`✓ Transformed ${transformedMembers.length} members\n`);

    // Log sample data
    console.log("Sample transformed member:");
    console.log(JSON.stringify(transformedMembers[0], null, 2));

    // Step 2: Fetch voting data from Voteview
    console.log("\n[2/4] Fetching voting records from Voteview...");
    const voteviewData = await fetchVoteviewData();
    
    // Merge Voteview data into transformed members
    for (const member of transformedMembers) {
      const vv = voteviewData.get(member.bioguide_id);
      if (vv) {
        member.party_loyalty_pct = calculatePartyLoyalty(vv);
        member.ideology_score = vv.nominate_dim1;
        member.votes_cast = vv.nominate_number_of_votes || 0;
        member.votes_against_party = vv.nominate_number_of_errors || 0;
      }
    }
    
    const membersWithVotes = transformedMembers.filter(m => m.party_loyalty_pct !== undefined).length;
    console.log(`✓ Merged voting data for ${membersWithVotes}/${transformedMembers.length} members`);

    // Step 3: Fetch campaign finance
    console.log("\n[3/4] Fetching campaign finance data...");
    console.log("⏳ Campaign finance not yet implemented");

    // Step 4: Compute stats
    console.log("\n[4/4] Computing aggregate stats...");
    console.log("⏳ Stats computation not yet implemented");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("Pipeline complete!");
    console.log("=".repeat(60));
    console.log(`\nData ready for database import.`);
    console.log(`Members: ${transformedMembers.length}`);

    // For now, write to JSON for testing
    const fs = await import("fs");
    const outDir = "./pipeline/output";
    
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(
      `${outDir}/members.json`,
      JSON.stringify(transformedMembers, null, 2)
    );
    console.log(`\nWrote ${outDir}/members.json`);

    // Also copy to src/data for Next.js static import
    const srcDataDir = "./src/data";
    if (!fs.existsSync(srcDataDir)) {
      fs.mkdirSync(srcDataDir, { recursive: true });
    }
    fs.writeFileSync(
      `${srcDataDir}/members.json`,
      JSON.stringify(transformedMembers, null, 2)
    );
    console.log(`Copied to ${srcDataDir}/members.json`);

  } catch (error) {
    console.error("\n❌ Pipeline failed:", error);
    process.exit(1);
  }
}

runPipeline();
