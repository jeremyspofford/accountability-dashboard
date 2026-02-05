/**
 * Data fetcher - Integrates multiple data sources
 * Combines Congress.gov data, OpenFEC financials, and corruption scoring
 */

import type { Member } from './data';
import type { FECDonorBreakdown } from './types';
import { getMemberFECData, getDonorBreakdown } from './fec';
import { 
  calculateCorruptionScore, 
  calculateDonorInfluence, 
  calculateVotingIndependence,
  type CorruptionFactors 
} from './scoring';
import { getMemberTradingStats } from './stock-trades';

/**
 * Enhanced member data with FEC financials and corruption score
 */
export interface EnrichedMember extends Member {
  fec_data?: {
    candidate_id: string;
    cycle: number;
    total_raised: number;
    donor_breakdown: FECDonorBreakdown;
  };
  trading_stats?: {
    total_trades: number;
    conflict_count: number;
    avg_days_to_disclosure: number;
  };
  corruption_factors: CorruptionFactors;
}

/**
 * Fetch and enrich member data with real FEC financials
 */
export async function enrichMemberWithFECData(
  member: Member
): Promise<EnrichedMember> {
  try {
    // Fetch FEC data
    const fecData = await getMemberFECData(
      member.first_name,
      member.last_name,
      member.chamber
    );

    if (!fecData.candidate || !fecData.financials) {
      // Return member with placeholder score if FEC data unavailable
      console.warn(`No FEC data for ${member.full_name}`);
      return {
        ...member,
        corruption_factors: {
          financialTransparency: 50,
          donorInfluence: 50,
          votingIndependence: calculateVotingIndependence(member.party_alignment_pct),
          wealthGrowth: 50,
        },
      };
    }

    // Get detailed donor breakdown
    const donorBreakdown = await getDonorBreakdown(fecData.candidate.candidate_id);
    
    if (!donorBreakdown) {
      console.warn(`No donor breakdown for ${member.full_name}`);
      return {
        ...member,
        corruption_factors: {
          financialTransparency: 50,
          donorInfluence: 50,
          votingIndependence: calculateVotingIndependence(member.party_alignment_pct),
          wealthGrowth: 50,
        },
      };
    }

    // Calculate corruption factors with real data
    const donorInfluence = calculateDonorInfluence({
      totalRaised: fecData.financials.total_receipts,
      individualContributions: fecData.financials.individual_contributions,
      pacContributions: fecData.financials.pac_contributions,
      largeIndividualContributions: fecData.financials.individual_itemized,
    });

    const votingIndependence = calculateVotingIndependence(member.party_alignment_pct);

    // Financial transparency based on disclosure timeliness and completeness
    // TODO: Integrate actual disclosure data from stock trades
    const financialTransparency = 75; // Placeholder

    // Wealth growth - TODO: integrate net worth tracking data
    const wealthGrowth = 30; // Placeholder (lower is better, so 30 is good)

    const corruptionFactors: CorruptionFactors = {
      financialTransparency,
      donorInfluence,
      votingIndependence,
      wealthGrowth,
    };

    // Calculate final corruption score
    const corruptionScore = calculateCorruptionScore(corruptionFactors);

    // Fetch trading stats (placeholder for now)
    const tradingStatsResponse = await getMemberTradingStats(member.bioguide_id);
    const tradingStats = tradingStatsResponse.success ? tradingStatsResponse.data : undefined;

    return {
      ...member,
      corruption_grade: corruptionScore.grade,
      corruption_score: corruptionScore.score,
      total_raised: fecData.financials.total_receipts,
      fec_data: {
        candidate_id: fecData.candidate.candidate_id,
        cycle: fecData.financials.cycle,
        total_raised: fecData.financials.total_receipts,
        donor_breakdown: donorBreakdown,
      },
      trading_stats: tradingStats,
      corruption_factors: corruptionFactors,
    };
  } catch (error) {
    console.error(`Error enriching member ${member.full_name}:`, error);
    
    // Return member with placeholder on error
    return {
      ...member,
      corruption_factors: {
        financialTransparency: 50,
        donorInfluence: 50,
        votingIndependence: calculateVotingIndependence(member.party_alignment_pct),
        wealthGrowth: 50,
      },
    };
  }
}

/**
 * Batch enrich multiple members (with rate limiting to avoid API throttling)
 */
export async function enrichMembersBatch(
  members: Member[],
  options?: {
    maxConcurrent?: number;
    delayMs?: number;
  }
): Promise<EnrichedMember[]> {
  const maxConcurrent = options?.maxConcurrent || 5;
  const delayMs = options?.delayMs || 200; // 200ms delay between requests

  const results: EnrichedMember[] = [];
  
  // Process in batches
  for (let i = 0; i < members.length; i += maxConcurrent) {
    const batch = members.slice(i, i + maxConcurrent);
    
    const batchResults = await Promise.all(
      batch.map(member => enrichMemberWithFECData(member))
    );
    
    results.push(...batchResults);
    
    // Delay between batches
    if (i + maxConcurrent < members.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Get summary statistics for corruption across all members
 */
export function getCorruptionSummary(members: EnrichedMember[]) {
  const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  const scores: number[] = [];
  const donorInfluenceScores: number[] = [];
  const votingIndependenceScores: number[] = [];

  members.forEach(member => {
    grades[member.corruption_grade]++;
    scores.push(member.corruption_score);
    donorInfluenceScores.push(member.corruption_factors.donorInfluence);
    votingIndependenceScores.push(member.corruption_factors.votingIndependence);
  });

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgDonorInfluence = donorInfluenceScores.reduce((a, b) => a + b, 0) / donorInfluenceScores.length;
  const avgVotingIndependence = votingIndependenceScores.reduce((a, b) => a + b, 0) / votingIndependenceScores.length;

  return {
    total_members: members.length,
    grade_distribution: grades,
    average_score: Math.round(avgScore * 10) / 10,
    average_donor_influence: Math.round(avgDonorInfluence * 10) / 10,
    average_voting_independence: Math.round(avgVotingIndependence * 10) / 10,
    most_corrupt: members
      .sort((a, b) => a.corruption_score - b.corruption_score)
      .slice(0, 10),
    least_corrupt: members
      .sort((a, b) => b.corruption_score - a.corruption_score)
      .slice(0, 10),
  };
}

/**
 * Filter members by corruption grade
 */
export function filterByCorruptionGrade(
  members: EnrichedMember[],
  grades: Array<'A' | 'B' | 'C' | 'D' | 'F'>
): EnrichedMember[] {
  return members.filter(member => grades.includes(member.corruption_grade));
}

/**
 * Sort members by corruption score
 */
export function sortByCorruptionScore(
  members: EnrichedMember[],
  order: 'asc' | 'desc' = 'desc'
): EnrichedMember[] {
  return [...members].sort((a, b) => {
    return order === 'desc' 
      ? b.corruption_score - a.corruption_score
      : a.corruption_score - b.corruption_score;
  });
}
