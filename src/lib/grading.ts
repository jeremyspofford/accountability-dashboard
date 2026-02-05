/**
 * Grading module for member accountability scoring
 * 
 * Calculates an overall grade (0-100) based on four equally-weighted factors:
 * - Donor influence (25%)
 * - Transparency compliance (25%)
 * - Wealth growth concerns (25%)
 * - STOCK Act compliance (25%)
 */

export interface MemberData {
  pac_percentage?: number | null;
  large_donor_percentage?: number | null;
  // Future fields for when we have the data:
  // disclosure_compliance?: number;
  // wealth_growth_score?: number;
  // stock_act_compliance?: number;
}

export interface GradeResult {
  overall: number;
  letter: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    donorScore: number;
    transparencyScore: number;
    wealthScore: number;
    stockScore: number;
  };
}

/**
 * Calculate the donor influence score (0-100, higher is better)
 * Formula: 100 - average of PAC percentage and large donor percentage
 */
function calculateDonorScore(data: MemberData): number {
  const pac = data.pac_percentage ?? 0;
  const largeDonor = data.large_donor_percentage ?? 0;
  
  const averageDonorInfluence = (pac + largeDonor) / 2;
  return Math.max(0, Math.min(100, 100 - averageDonorInfluence));
}

/**
 * Calculate transparency score (placeholder: default 70)
 * TODO: Implement based on disclosure compliance data
 */
function calculateTransparencyScore(data: MemberData): number {
  // Placeholder - will be calculated from disclosure_compliance field
  return 70;
}

/**
 * Calculate wealth score (placeholder: default 70)
 * TODO: Implement based on suspicious wealth growth analysis
 */
function calculateWealthScore(data: MemberData): number {
  // Placeholder - will be inverse of wealth growth concerns
  return 70;
}

/**
 * Calculate STOCK Act compliance score (placeholder: default 70)
 * TODO: Implement based on STOCK Act violation data
 */
function calculateStockScore(data: MemberData): number {
  // Placeholder - will be based on STOCK Act compliance
  return 70;
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
 * Calculate overall accountability grade for a member
 * 
 * @param data - Member data including donor percentages (and future compliance fields)
 * @returns Grade result with overall score, letter grade, and breakdown
 */
export function calculateGrade(data: MemberData): GradeResult {
  const donorScore = calculateDonorScore(data);
  const transparencyScore = calculateTransparencyScore(data);
  const wealthScore = calculateWealthScore(data);
  const stockScore = calculateStockScore(data);
  
  // Equal weighting: 25% each
  const overall = (donorScore + transparencyScore + wealthScore + stockScore) / 4;
  
  return {
    overall: Math.round(overall * 10) / 10, // Round to 1 decimal
    letter: getLetterGrade(overall),
    breakdown: {
      donorScore: Math.round(donorScore * 10) / 10,
      transparencyScore: Math.round(transparencyScore * 10) / 10,
      wealthScore: Math.round(wealthScore * 10) / 10,
      stockScore: Math.round(stockScore * 10) / 10,
    },
  };
}

/**
 * Get color styling for a grade (for UI display)
 * 
 * @param letter - Letter grade (A-F)
 * @returns Tailwind color class
 */
export function getGradeColor(letter: 'A' | 'B' | 'C' | 'D' | 'F'): string {
  switch (letter) {
    case 'A':
      return 'text-green-600';
    case 'B':
      return 'text-blue-600';
    case 'C':
      return 'text-yellow-600';
    case 'D':
      return 'text-orange-600';
    case 'F':
      return 'text-red-600';
  }
}
