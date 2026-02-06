/**
 * Beneficiary Analysis System
 * 
 * Analyzes legislation and votes to determine who benefits from each piece of legislation.
 * This is the core of making political data meaningful to regular people.
 */

export type BeneficiaryGroup = 
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
  | "tech_industry"
  | "fossil_fuel_industry"
  | "wall_street"
  | "small_business"
  | "farmers"
  | "seniors"
  | "students"
  | "veterans"
  | "immigrants"
  | "general_public";

export interface BeneficiaryImpact {
  group: BeneficiaryGroup;
  impact: "benefits" | "harms" | "mixed";
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface LegislationAnalysis {
  summary: string;
  beneficiaries: BeneficiaryImpact[];
  publicSentiment: "positive" | "negative" | "mixed" | "unknown";
}

// Keywords and patterns for analyzing legislation
const BENEFIT_PATTERNS: Record<string, { groups: BeneficiaryGroup[], impact: "benefits" | "harms" }[]> = {
  // Tax-related
  "tax cut": [
    { groups: ["wealthy", "corporations"], impact: "benefits" },
    { groups: ["general_public"], impact: "mixed" }
  ],
  "corporate tax": [
    { groups: ["corporations"], impact: "benefits" },
    { groups: ["general_public"], impact: "harms" }
  ],
  "capital gains": [
    { groups: ["wealthy", "wall_street"], impact: "benefits" }
  ],
  "estate tax": [
    { groups: ["wealthy"], impact: "benefits" }
  ],
  "child tax credit": [
    { groups: ["middle_class", "working_class", "low_income"], impact: "benefits" }
  ],
  "earned income": [
    { groups: ["working_class", "low_income"], impact: "benefits" }
  ],
  
  // Healthcare
  "medicare": [
    { groups: ["seniors", "healthcare_industry"], impact: "benefits" }
  ],
  "medicaid": [
    { groups: ["low_income"], impact: "benefits" }
  ],
  "drug pricing": [
    { groups: ["consumers", "seniors"], impact: "benefits" },
    { groups: ["healthcare_industry"], impact: "harms" }
  ],
  "affordable care": [
    { groups: ["middle_class", "working_class"], impact: "benefits" }
  ],
  
  // Labor
  "minimum wage": [
    { groups: ["working_class", "low_income"], impact: "benefits" },
    { groups: ["small_business"], impact: "mixed" }
  ],
  "union": [
    { groups: ["workers"], impact: "benefits" },
    { groups: ["corporations"], impact: "harms" }
  ],
  "right to work": [
    { groups: ["corporations"], impact: "benefits" },
    { groups: ["workers"], impact: "harms" }
  ],
  "overtime": [
    { groups: ["workers"], impact: "benefits" }
  ],
  
  // Environment
  "climate": [
    { groups: ["environment", "general_public"], impact: "benefits" },
    { groups: ["fossil_fuel_industry"], impact: "harms" }
  ],
  "clean energy": [
    { groups: ["environment"], impact: "benefits" }
  ],
  "emissions": [
    { groups: ["environment"], impact: "benefits" },
    { groups: ["fossil_fuel_industry", "corporations"], impact: "harms" }
  ],
  "drilling": [
    { groups: ["fossil_fuel_industry"], impact: "benefits" },
    { groups: ["environment"], impact: "harms" }
  ],
  "pipeline": [
    { groups: ["fossil_fuel_industry"], impact: "benefits" },
    { groups: ["environment"], impact: "harms" }
  ],
  
  // Trade
  "tariff": [
    { groups: ["consumers"], impact: "harms" },
    { groups: ["corporations"], impact: "mixed" }
  ],
  "free trade": [
    { groups: ["corporations", "consumers"], impact: "benefits" },
    { groups: ["workers"], impact: "mixed" }
  ],
  
  // Immigration
  "border": [
    { groups: ["immigrants"], impact: "harms" }
  ],
  "daca": [
    { groups: ["immigrants"], impact: "benefits" }
  ],
  "visa": [
    { groups: ["tech_industry", "immigrants"], impact: "benefits" }
  ],
  
  // Defense
  "defense spending": [
    { groups: ["military_defense"], impact: "benefits" }
  ],
  "military": [
    { groups: ["military_defense", "veterans"], impact: "benefits" }
  ],
  "veterans": [
    { groups: ["veterans"], impact: "benefits" }
  ],
  
  // Financial
  "wall street": [
    { groups: ["wall_street"], impact: "benefits" }
  ],
  "dodd-frank": [
    { groups: ["consumers"], impact: "benefits" },
    { groups: ["wall_street"], impact: "harms" }
  ],
  "deregulation": [
    { groups: ["corporations", "wall_street"], impact: "benefits" },
    { groups: ["consumers", "environment"], impact: "harms" }
  ],
  "banking": [
    { groups: ["wall_street"], impact: "benefits" }
  ],
  
  // Education
  "student loan": [
    { groups: ["students"], impact: "benefits" }
  ],
  "pell grant": [
    { groups: ["students", "low_income"], impact: "benefits" }
  ],
  "school choice": [
    { groups: ["corporations"], impact: "benefits" }
  ],
  
  // Social programs
  "social security": [
    { groups: ["seniors"], impact: "benefits" }
  ],
  "snap": [
    { groups: ["low_income"], impact: "benefits" }
  ],
  "food stamp": [
    { groups: ["low_income"], impact: "benefits" }
  ],
  "housing": [
    { groups: ["low_income", "middle_class"], impact: "benefits" }
  ],
};

const GROUP_LABELS: Record<BeneficiaryGroup, string> = {
  corporations: "Corporations",
  wealthy: "Wealthy Individuals",
  middle_class: "Middle Class",
  working_class: "Working Class",
  low_income: "Low Income Families",
  workers: "Workers & Unions",
  consumers: "Consumers",
  environment: "Environment",
  military_defense: "Military & Defense",
  healthcare_industry: "Healthcare Industry",
  tech_industry: "Tech Industry",
  fossil_fuel_industry: "Fossil Fuel Industry",
  wall_street: "Wall Street",
  small_business: "Small Business",
  farmers: "Farmers",
  seniors: "Seniors",
  students: "Students",
  veterans: "Veterans",
  immigrants: "Immigrants",
  general_public: "General Public",
};

export function getGroupLabel(group: BeneficiaryGroup): string {
  return GROUP_LABELS[group];
}

export function analyzeLegislation(
  billNumber: string,
  title: string,
  description: string
): LegislationAnalysis {
  const searchText = `${billNumber} ${title} ${description}`.toLowerCase();
  
  const impacts: BeneficiaryImpact[] = [];
  const seenGroups = new Set<string>();
  
  // Search for patterns
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
              confidence: "medium",
              reason: `Contains "${pattern}" language`,
            });
          }
        }
      }
    }
  }
  
  // Determine public sentiment based on beneficiaries
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const impact of impacts) {
    const isProPublic = ["middle_class", "working_class", "low_income", "workers", 
                         "consumers", "environment", "general_public", "seniors",
                         "students", "veterans"].includes(impact.group);
    const isAntiPublic = ["corporations", "wealthy", "wall_street", "fossil_fuel_industry"].includes(impact.group);
    
    if (isProPublic && impact.impact === "benefits") positiveCount++;
    if (isProPublic && impact.impact === "harms") negativeCount++;
    if (isAntiPublic && impact.impact === "benefits") negativeCount++;
    if (isAntiPublic && impact.impact === "harms") positiveCount++;
  }
  
  let publicSentiment: "positive" | "negative" | "mixed" | "unknown" = "unknown";
  if (positiveCount > negativeCount && positiveCount > 0) {
    publicSentiment = "positive";
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    publicSentiment = "negative";
  } else if (positiveCount > 0 || negativeCount > 0) {
    publicSentiment = "mixed";
  }
  
  return {
    summary: description || title,
    beneficiaries: impacts,
    publicSentiment,
  };
}

// Analyze a vote result
export function analyzeVoteImpact(
  yea: boolean, 
  analysis: LegislationAnalysis
): { helpedGroups: BeneficiaryGroup[], harmedGroups: BeneficiaryGroup[] } {
  const helpedGroups: BeneficiaryGroup[] = [];
  const harmedGroups: BeneficiaryGroup[] = [];
  
  for (const impact of analysis.beneficiaries) {
    if (yea) {
      // Voting Yes supports the legislation
      if (impact.impact === "benefits") {
        helpedGroups.push(impact.group);
      } else if (impact.impact === "harms") {
        harmedGroups.push(impact.group);
      }
    } else {
      // Voting No opposes the legislation
      if (impact.impact === "benefits") {
        harmedGroups.push(impact.group);
      } else if (impact.impact === "harms") {
        helpedGroups.push(impact.group);
      }
    }
  }
  
  return { helpedGroups, harmedGroups };
}
