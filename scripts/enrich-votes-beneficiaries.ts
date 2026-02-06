/**
 * Enrich key votes with beneficiary analysis
 * 
 * Adds "who benefits" data to each vote in key-votes.json
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "../src/data");

type BeneficiaryGroup = 
  | "corporations"
  | "wealthy" 
  | "middle_class"
  | "working_class"
  | "low_income"
  | "workers"
  | "consumers"
  | "environment"
  | "military_defense"
  | "healthcare_industry"
  | "fossil_fuel_industry"
  | "wall_street"
  | "seniors"
  | "students"
  | "veterans"
  | "immigrants"
  | "general_public";

interface BeneficiaryImpact {
  group: BeneficiaryGroup;
  impact: "benefits" | "harms" | "mixed";
}

// Keywords and patterns for analyzing legislation
const BENEFIT_PATTERNS: Record<string, { groups: BeneficiaryGroup[], impact: "benefits" | "harms" }[]> = {
  // Tax-related
  "tax cut": [{ groups: ["wealthy", "corporations"], impact: "benefits" }],
  "tax relief": [{ groups: ["wealthy", "corporations"], impact: "benefits" }],
  "corporate tax": [{ groups: ["corporations"], impact: "benefits" }],
  "capital gains": [{ groups: ["wealthy", "wall_street"], impact: "benefits" }],
  "estate tax": [{ groups: ["wealthy"], impact: "benefits" }],
  "child tax credit": [{ groups: ["middle_class", "working_class", "low_income"], impact: "benefits" }],
  "earned income": [{ groups: ["working_class", "low_income"], impact: "benefits" }],
  
  // Healthcare
  "medicare": [{ groups: ["seniors"], impact: "benefits" }],
  "medicaid": [{ groups: ["low_income"], impact: "benefits" }],
  "drug pricing": [{ groups: ["consumers", "seniors"], impact: "benefits" }],
  "prescription": [{ groups: ["seniors", "consumers"], impact: "benefits" }],
  "affordable care": [{ groups: ["middle_class", "working_class"], impact: "benefits" }],
  "health care": [{ groups: ["general_public"], impact: "benefits" }],
  "healthcare": [{ groups: ["general_public"], impact: "benefits" }],
  
  // Labor
  "minimum wage": [{ groups: ["working_class", "low_income"], impact: "benefits" }],
  "union": [{ groups: ["workers"], impact: "benefits" }],
  "worker": [{ groups: ["workers"], impact: "benefits" }],
  "overtime": [{ groups: ["workers"], impact: "benefits" }],
  "labor": [{ groups: ["workers"], impact: "benefits" }],
  
  // Environment
  "climate": [{ groups: ["environment"], impact: "benefits" }],
  "clean energy": [{ groups: ["environment"], impact: "benefits" }],
  "emission": [{ groups: ["environment"], impact: "benefits" }],
  "renewable": [{ groups: ["environment"], impact: "benefits" }],
  "drilling": [{ groups: ["fossil_fuel_industry"], impact: "benefits" }],
  "pipeline": [{ groups: ["fossil_fuel_industry"], impact: "benefits" }],
  "oil": [{ groups: ["fossil_fuel_industry"], impact: "benefits" }],
  "natural gas": [{ groups: ["fossil_fuel_industry"], impact: "benefits" }],
  
  // Trade
  "tariff": [{ groups: ["corporations"], impact: "mixed" }],
  
  // Immigration
  "border": [{ groups: ["immigrants"], impact: "harms" }],
  "immigration": [{ groups: ["immigrants"], impact: "mixed" }],
  "daca": [{ groups: ["immigrants"], impact: "benefits" }],
  "dreamer": [{ groups: ["immigrants"], impact: "benefits" }],
  
  // Defense
  "defense": [{ groups: ["military_defense"], impact: "benefits" }],
  "military": [{ groups: ["military_defense"], impact: "benefits" }],
  "veteran": [{ groups: ["veterans"], impact: "benefits" }],
  "ukraine": [{ groups: ["military_defense"], impact: "benefits" }],
  "israel": [{ groups: ["military_defense"], impact: "benefits" }],
  "nato": [{ groups: ["military_defense"], impact: "benefits" }],
  
  // Financial
  "wall street": [{ groups: ["wall_street"], impact: "benefits" }],
  "deregulation": [{ groups: ["corporations", "wall_street"], impact: "benefits" }],
  "banking": [{ groups: ["wall_street"], impact: "benefits" }],
  "crypto": [{ groups: ["wall_street"], impact: "benefits" }],
  
  // Education
  "student loan": [{ groups: ["students"], impact: "benefits" }],
  "pell grant": [{ groups: ["students", "low_income"], impact: "benefits" }],
  "education": [{ groups: ["students"], impact: "benefits" }],
  
  // Social programs
  "social security": [{ groups: ["seniors"], impact: "benefits" }],
  "snap": [{ groups: ["low_income"], impact: "benefits" }],
  "food": [{ groups: ["low_income"], impact: "benefits" }],
  "housing": [{ groups: ["low_income", "middle_class"], impact: "benefits" }],
  
  // Budget/Spending
  "appropriation": [{ groups: ["general_public"], impact: "mixed" }],
  "budget": [{ groups: ["general_public"], impact: "mixed" }],
  "spending": [{ groups: ["general_public"], impact: "mixed" }],
  "rescind": [{ groups: ["general_public"], impact: "mixed" }],
};

function analyzeVote(bill: string, title: string, description: string): BeneficiaryImpact[] {
  const searchText = `${bill} ${title} ${description}`.toLowerCase();
  
  const impacts: BeneficiaryImpact[] = [];
  const seenGroups = new Set<string>();
  
  for (const [pattern, effects] of Object.entries(BENEFIT_PATTERNS)) {
    if (searchText.includes(pattern.toLowerCase())) {
      for (const effect of effects) {
        for (const group of effect.groups) {
          const key = `${group}-${effect.impact}`;
          if (!seenGroups.has(key)) {
            seenGroups.add(key);
            impacts.push({
              group,
              impact: effect.impact,
            });
          }
        }
      }
    }
  }
  
  // Default to general_public if no specific beneficiaries found
  if (impacts.length === 0) {
    impacts.push({ group: "general_public", impact: "mixed" });
  }
  
  return impacts;
}

async function main() {
  console.log("🎯 Enriching votes with beneficiary analysis\n");
  
  const keyVotesPath = path.join(DATA_DIR, "key-votes.json");
  const keyVotes = JSON.parse(fs.readFileSync(keyVotesPath, "utf-8"));
  
  console.log(`Processing ${keyVotes.length} votes...\n`);
  
  let enrichedCount = 0;
  
  for (const vote of keyVotes) {
    const beneficiaries = analyzeVote(vote.bill, vote.title, vote.description);
    vote.beneficiaries = beneficiaries;
    
    // Determine overall sentiment
    const proPublic = beneficiaries.filter(b => 
      ["middle_class", "working_class", "low_income", "workers", "consumers", 
       "environment", "seniors", "students", "veterans", "general_public"].includes(b.group) &&
      b.impact === "benefits"
    ).length;
    
    const antiPublic = beneficiaries.filter(b =>
      ["corporations", "wealthy", "wall_street", "fossil_fuel_industry"].includes(b.group) &&
      b.impact === "benefits"
    ).length;
    
    if (proPublic > antiPublic) {
      vote.publicBenefit = "positive";
    } else if (antiPublic > proPublic) {
      vote.publicBenefit = "negative";
    } else {
      vote.publicBenefit = "mixed";
    }
    
    if (beneficiaries.length > 0 && beneficiaries[0].group !== "general_public") {
      enrichedCount++;
    }
  }
  
  // Write back
  fs.writeFileSync(keyVotesPath, JSON.stringify(keyVotes, null, 2));
  
  console.log(`✅ Enriched ${enrichedCount} votes with specific beneficiary data`);
  console.log(`💾 Saved to ${keyVotesPath}`);
  
  // Show sample
  console.log("\n📊 Sample enriched votes:");
  const samples = keyVotes.slice(0, 5);
  for (const vote of samples) {
    console.log(`\n${vote.bill}: ${vote.title}`);
    console.log(`  Beneficiaries: ${vote.beneficiaries.map((b: BeneficiaryImpact) => `${b.group} (${b.impact})`).join(", ")}`);
    console.log(`  Public benefit: ${vote.publicBenefit}`);
  }
}

main().catch(console.error);
