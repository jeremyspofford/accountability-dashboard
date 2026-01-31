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

import { fetchAllMembers, transformMember } from "./sources/congress-members.js";

async function runPipeline() {
  console.log("=".repeat(60));
  console.log("Accountability Dashboard - Data Pipeline");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Step 1: Fetch members
    console.log("\n[1/4] Fetching Congress members...");
    const members = await fetchAllMembers();
    const transformedMembers = members.map(transformMember);
    console.log(`✓ Got ${transformedMembers.length} members\n`);

    // Log sample data
    console.log("Sample transformed member:");
    console.log(JSON.stringify(transformedMembers[0], null, 2));

    // Step 2: Fetch votes (requires API key)
    console.log("\n[2/4] Fetching voting records...");
    if (process.env.PROPUBLICA_API_KEY) {
      // TODO: Implement vote fetching
      console.log("⏳ Vote fetching not yet implemented");
    } else {
      console.log("⚠️  Skipping votes (PROPUBLICA_API_KEY not set)");
    }

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

  } catch (error) {
    console.error("\n❌ Pipeline failed:", error);
    process.exit(1);
  }
}

runPipeline();
