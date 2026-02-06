/**
 * Multi-Factor Grading System v2
 * 
 * Calculates member accountability scores based on four weighted factors:
 * 1. Voting Record (25%) - Alignment with public benefit on key votes
 * 2. Donor Influence (25%) - PAC and large donor dependency
 * 3. Stock Trading (25%) - Risk score from trading activity
 * 4. Disclosure Compliance (25%) - Financial disclosure filing status
 */

export interface KeyVoteData {
  id: string;
  votes: Record<string, string>; // bioguideId -> vote (Yea/Nay/Present/Not Voting)
  proPublicBenefit: boolean; // True = Yea benefits public, False = Nay benefits public
}

export interface FinanceData {
  pac_percentage?: number | null;
  large_donor_percentage?: number | null;
}

export interface TradingData {
  total_risk_score?: number;
  flagged_trades?: number;
  total_trades?: number;
  overall_suspicion_level?: 'low' | 'medium' | 'high';
}

export interface DisclosureData {
  year: number;
  filingDate: string;
}

export interface MultiFactorGradeOptions {
  keyVotes?: KeyVoteData[];
  finance?: FinanceData;
  trading?: TradingData;
  disclosures?: DisclosureData[];
}

export interface GradeWeights {
  votingWeight: number;
  donorWeight: number;
  stockWeight: number;
  disclosureWeight: number;
}

export interface MultiFactorGradeResult {
  overall: number;
  letter: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    votingScore: number;
    donorScore: number;
    stockScore: number;
    disclosureScore: number;
  };
  weights: GradeWeights;
}

const DEFAULT_WEIGHTS: GradeWeights = {
  votingWeight: 0.25,
  donorWeight: 0.25,
  stockWeight: 0.25,
  disclosureWeight: 0.25,
};

/**
 * Calculate voting record score (0-100, higher is better)
 * 
 * Measures alignment with public benefit on key votes.
 * - 100: All votes aligned with public interest
 * - 0: All votes against public interest
 * - 70: No voting data (benefit of doubt)
 */
function calculateVotingScore(
  bioguideId: string,
  keyVotes?: KeyVoteData[]
): number {
  if (!keyVotes || keyVotes.length === 0) {
    return 70; // Neutral score when no data
  }

  let alignedVotes = 0;
  let totalVotes = 0;

  for (const vote of keyVotes) {
    const memberVote = vote.votes[bioguideId];
    
    // Skip if member didn't vote or voted Present
    if (!memberVote || memberVote === 'Present' || memberVote === 'Not Voting') {
      continue;
    }

    totalVotes++;

    // Check alignment
    const votedYea = memberVote === 'Yea';
    const isAligned = votedYea === vote.proPublicBenefit;

    if (isAligned) {
      alignedVotes++;
    }
  }

  // If no votes counted, return neutral
  if (totalVotes === 0) {
    return 70;
  }

  // Calculate percentage aligned
  const alignmentPercentage = (alignedVotes / totalVotes) * 100;
  return alignmentPercentage;
}

/**
 * Calculate donor influence score (0-100, higher is better)
 * 
 * Formula: 100 - average of PAC percentage and large donor percentage
 * - 100: No PAC or large donor money
 * - 0: 100% from PACs and large donors
 * - 70: No data (neutral)
 */
function calculateDonorScore(finance?: FinanceData): number {
  if (!finance) {
    return 70; // Neutral score when no data
  }

  const pac = finance.pac_percentage ?? 0;
  const largeDonor = finance.large_donor_percentage ?? 0;
  
  const averageDonorInfluence = (pac + largeDonor) / 2;
  return Math.max(0, Math.min(100, 100 - averageDonorInfluence));
}

/**
 * Calculate stock trading score (0-100, higher is better)
 * 
 * Based on risk score and suspicious trading patterns.
 * - 100: No trading activity (cleanest)
 * - 80+: Low suspicion level
 * - 40-80: Medium suspicion level
 * - <40: High suspicion level
 */
function calculateStockScore(trading?: TradingData): number {
  if (!trading || !trading.total_trades || trading.total_trades === 0) {
    return 100; // No trading = perfect score
  }

  const flagRate = trading.flagged_trades && trading.total_trades
    ? (trading.flagged_trades / trading.total_trades) * 100
    : 0;

  const avgRiskPerTrade = trading.total_risk_score && trading.total_trades
    ? trading.total_risk_score / trading.total_trades
    : 0;

  // Scoring based on suspicion level and metrics
  let baseScore = 100;

  // Penalize based on suspicion level
  if (trading.overall_suspicion_level === 'high') {
    baseScore = 30;
  } else if (trading.overall_suspicion_level === 'medium') {
    baseScore = 65;
  } else if (trading.overall_suspicion_level === 'low') {
    baseScore = 85;
  }

  // Further adjust based on flag rate (0-100%)
  const flagPenalty = flagRate * 0.2; // Up to -20 points
  
  // Adjust based on average risk per trade (typically 0-5)
  const riskPenalty = Math.min(avgRiskPerTrade * 4, 15); // Up to -15 points

  const finalScore = baseScore - flagPenalty - riskPenalty;
  
  return Math.max(0, Math.min(100, finalScore));
}

/**
 * Calculate disclosure compliance score (0-100, higher is better)
 * 
 * Based on presence and recency of financial disclosures.
 * - 100: Has filed disclosures for recent years
 * - 50-99: Has some disclosures but not recent
 * - 0: No disclosures on file
 */
function calculateDisclosureScore(disclosures?: DisclosureData[]): number {
  if (!disclosures || disclosures.length === 0) {
    return 0; // No disclosures = non-compliance
  }

  const currentYear = new Date().getFullYear();
  const hasRecentDisclosure = disclosures.some(d => 
    d.year >= currentYear - 2
  );

  if (hasRecentDisclosure) {
    return 100; // Perfect compliance
  }

  // Has old disclosures only
  const mostRecentYear = Math.max(...disclosures.map(d => d.year));
  const yearsSinceLastFiling = currentYear - mostRecentYear;

  // Degrade score based on how old the last filing is
  const score = Math.max(0, 100 - (yearsSinceLastFiling * 15));
  
  return score;
}

/**
 * Convert numeric score to letter grade
 */
function getLetterGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Round number to 1 decimal place
 */
function round(num: number): number {
  return Math.round(num * 10) / 10;
}

/**
 * Calculate multi-factor accountability grade for a member
 * 
 * @param bioguideId - Member's bioguide ID
 * @param options - Data for each grading factor
 * @param weights - Optional custom weights (must sum to 1.0)
 * @returns Comprehensive grade result with breakdown
 */
export function calculateMultiFactorGrade(
  bioguideId: string,
  options: MultiFactorGradeOptions,
  weights: Partial<GradeWeights> = {}
): MultiFactorGradeResult {
  // Merge with default weights
  const finalWeights: GradeWeights = {
    ...DEFAULT_WEIGHTS,
    ...weights,
  };

  // Validate weights sum to 1.0 (allow small floating point errors)
  const weightSum = Object.values(finalWeights).reduce((a, b) => a + b, 0);
  if (Math.abs(weightSum - 1.0) > 0.001) {
    throw new Error(`Weights must sum to 1.0, got ${weightSum}`);
  }

  // Calculate individual scores
  const votingScore = calculateVotingScore(bioguideId, options.keyVotes);
  const donorScore = calculateDonorScore(options.finance);
  const stockScore = calculateStockScore(options.trading);
  const disclosureScore = calculateDisclosureScore(options.disclosures);

  // Calculate weighted overall score
  const overall = 
    votingScore * finalWeights.votingWeight +
    donorScore * finalWeights.donorWeight +
    stockScore * finalWeights.stockWeight +
    disclosureScore * finalWeights.disclosureWeight;

  return {
    overall: round(overall),
    letter: getLetterGrade(overall),
    breakdown: {
      votingScore: round(votingScore),
      donorScore: round(donorScore),
      stockScore: round(stockScore),
      disclosureScore: round(disclosureScore),
    },
    weights: finalWeights,
  };
}
