/**
 * Corruption scoring algorithm
 * Generates an A-F grade based on multiple factors
 */

export interface CorruptionFactors {
  // Financial transparency (0-100, higher is better)
  financialTransparency: number;
  
  // Donor influence (0-100, lower is better - flipped in calculation)
  donorInfluence: number;
  
  // Voting independence (0-100, higher is better)
  votingIndependence: number;
  
  // Net worth growth rate (0-100, lower is better)
  wealthGrowth: number;
}

export interface CorruptionScore {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number; // 0-100
  factors: CorruptionFactors;
  breakdown: {
    financialTransparency: number;
    donorInfluence: number;
    votingIndependence: number;
    wealthGrowth: number;
  };
}

/**
 * Calculate corruption score from various factors
 * Higher score = less corrupt (better)
 */
export function calculateCorruptionScore(factors: CorruptionFactors): CorruptionScore {
  // Weight each factor (total = 100%)
  const weights = {
    financialTransparency: 0.25,
    donorInfluence: 0.35,        // Most important - who funds them
    votingIndependence: 0.30,    // Do they think for themselves?
    wealthGrowth: 0.10,          // Suspicious wealth accumulation
  };
  
  // Normalize scores (some are inverted - lower is better)
  const normalized = {
    financialTransparency: factors.financialTransparency,
    donorInfluence: 100 - factors.donorInfluence, // Invert: high influence = bad
    votingIndependence: factors.votingIndependence,
    wealthGrowth: 100 - factors.wealthGrowth,     // Invert: high growth = suspicious
  };
  
  // Calculate weighted score
  const score = Math.round(
    normalized.financialTransparency * weights.financialTransparency +
    normalized.donorInfluence * weights.donorInfluence +
    normalized.votingIndependence * weights.votingIndependence +
    normalized.wealthGrowth * weights.wealthGrowth
  );
  
  // Convert to letter grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  return {
    grade,
    score,
    factors,
    breakdown: normalized,
  };
}

/**
 * Calculate donor influence score from FEC data
 * Returns 0-100 where:
 * - 0 = no corporate/PAC influence (all small donors)
 * - 100 = heavily influenced by large donors/PACs
 */
export function calculateDonorInfluence(fecData: {
  totalRaised: number;
  individualContributions: number;
  pacContributions: number;
  largeIndividualContributions: number; // >$200
}): number {
  if (fecData.totalRaised === 0) return 50; // No data = neutral
  
  const { totalRaised, individualContributions, pacContributions, largeIndividualContributions } = fecData;
  
  // Calculate percentages
  const pacPct = (pacContributions / totalRaised) * 100;
  const largeDonorPct = (largeIndividualContributions / totalRaised) * 100;
  const smallDonorPct = ((individualContributions - largeIndividualContributions) / totalRaised) * 100;
  
  // Weight the influence (PACs are worse than large individuals)
  const influence = (pacPct * 1.5) + (largeDonorPct * 0.8) - (smallDonorPct * 0.3);
  
  // Normalize to 0-100 and clamp
  return Math.max(0, Math.min(100, influence));
}

/**
 * Calculate voting independence from party alignment
 * Returns 0-100 where:
 * - 0 = 100% party line voter (no independence)
 * - 100 = votes independently 
 */
export function calculateVotingIndependence(partyAlignmentPct: number): number {
  // Perfect middle (50% alignment) = max independence = 100 score
  // 100% or 0% alignment = no independence = 0 score
  const distanceFrom50 = Math.abs(50 - partyAlignmentPct);
  return Math.round(100 - (distanceFrom50 * 2));
}

/**
 * Generate a mock/placeholder corruption score
 * Used until we have real data for all members
 */
export function generatePlaceholderScore(bioguideId: string): CorruptionScore {
  // Deterministic but varied based on ID
  const hash = bioguideId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const factors: CorruptionFactors = {
    financialTransparency: 50 + (hash % 50),
    donorInfluence: 30 + (hash % 40),
    votingIndependence: 40 + (hash % 60),
    wealthGrowth: 20 + (hash % 50),
  };
  
  return calculateCorruptionScore(factors);
}

/**
 * Get grade color for UI
 */
export function getGradeColor(grade: 'A' | 'B' | 'C' | 'D' | 'F'): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = {
    A: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-700' },
    B: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700' },
    C: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-700' },
    D: { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-700' },
    F: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-700' },
  };
  
  return colors[grade];
}
