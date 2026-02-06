import { describe, it, expect } from 'vitest';
import {
  calculateMultiFactorGrade,
  type MultiFactorGradeOptions,
  type MultiFactorGradeResult,
} from './grading-v2';

describe('calculateMultiFactorGrade', () => {
  describe('voting record score', () => {
    it('should give perfect score when member has no voting record data', () => {
      const result = calculateMultiFactorGrade('UNKNOWN123', {});
      
      // No voting data = neutral score of 70 (benefit of doubt)
      expect(result.breakdown.votingScore).toBe(70);
    });

    it('should calculate voting score based on key votes alignment', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          {
            id: 'vote1',
            votes: { 'TEST001': 'Yea' },
            proPublicBenefit: true, // Yea aligns with public benefit
          },
          {
            id: 'vote2',
            votes: { 'TEST001': 'Nay' },
            proPublicBenefit: false, // Nay aligns with public benefit
          },
        ],
      });
      
      // 2/2 votes aligned with public benefit = 100
      expect(result.breakdown.votingScore).toBe(100);
    });

    it('should penalize votes against public benefit', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          {
            id: 'vote1',
            votes: { 'TEST001': 'Yea' },
            proPublicBenefit: true, // Aligned
          },
          {
            id: 'vote2',
            votes: { 'TEST001': 'Yea' },
            proPublicBenefit: false, // NOT aligned (voted for special interests)
          },
        ],
      });
      
      // 1/2 votes aligned = 50
      expect(result.breakdown.votingScore).toBe(50);
    });

    it('should handle missing votes as neutral (not counted)', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          {
            id: 'vote1',
            votes: { 'TEST001': 'Yea' },
            proPublicBenefit: true,
          },
          {
            id: 'vote2',
            votes: { 'OTHER': 'Yea' }, // TEST001 didn't vote
            proPublicBenefit: false,
          },
        ],
      });
      
      // Only 1 vote counted, 100% aligned
      expect(result.breakdown.votingScore).toBe(100);
    });

    it('should handle Present votes as neutral', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          {
            id: 'vote1',
            votes: { 'TEST001': 'Present' },
            proPublicBenefit: true,
          },
        ],
      });
      
      // Present = not counted, defaults to 70
      expect(result.breakdown.votingScore).toBe(70);
    });
  });

  describe('donor influence score', () => {
    it('should calculate donor score from PAC and large donor percentages', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        finance: {
          pac_percentage: 40,
          large_donor_percentage: 60,
        },
      });
      
      // donorScore = 100 - (40 + 60) / 2 = 50
      expect(result.breakdown.donorScore).toBe(50);
    });

    it('should give perfect score for zero PAC/donor money', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        finance: {
          pac_percentage: 0,
          large_donor_percentage: 0,
        },
      });
      
      expect(result.breakdown.donorScore).toBe(100);
    });

    it('should use default score when no finance data', () => {
      const result = calculateMultiFactorGrade('TEST001', {});
      
      // No data = neutral 70
      expect(result.breakdown.donorScore).toBe(70);
    });
  });

  describe('stock trading score', () => {
    it('should penalize high risk trading', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        trading: {
          total_risk_score: 1000,
          flagged_trades: 80,
          total_trades: 100,
          overall_suspicion_level: 'high',
        },
      });
      
      // High risk should result in low score
      expect(result.breakdown.stockScore).toBeLessThan(40);
    });

    it('should reward clean trading record', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        trading: {
          total_risk_score: 10,
          flagged_trades: 2,
          total_trades: 50,
          overall_suspicion_level: 'low',
        },
      });
      
      // Low risk should result in high score
      expect(result.breakdown.stockScore).toBeGreaterThan(80);
    });

    it('should give perfect score when no trading activity', () => {
      const result = calculateMultiFactorGrade('TEST001', {});
      
      // No trading = perfect score (100)
      expect(result.breakdown.stockScore).toBe(100);
    });

    it('should handle medium suspicion level', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        trading: {
          total_risk_score: 100,
          flagged_trades: 20,
          total_trades: 50,
          overall_suspicion_level: 'medium',
        },
      });
      
      // Medium risk should be in middle range
      expect(result.breakdown.stockScore).toBeGreaterThan(40);
      expect(result.breakdown.stockScore).toBeLessThan(80);
    });
  });

  describe('disclosure compliance score', () => {
    it('should give perfect score when disclosures are filed', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        disclosures: [
          { year: 2024, filingDate: '5/15/2025' },
          { year: 2023, filingDate: '5/15/2024' },
        ],
      });
      
      // Has recent disclosures = 100
      expect(result.breakdown.disclosureScore).toBe(100);
    });

    it('should penalize missing recent disclosures', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        disclosures: [
          { year: 2020, filingDate: '5/15/2021' },
        ],
      });
      
      // Old disclosures only = lower score
      expect(result.breakdown.disclosureScore).toBeLessThan(70);
    });

    it('should give zero score when no disclosures', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        disclosures: [],
      });
      
      expect(result.breakdown.disclosureScore).toBe(0);
    });

    it('should give zero score when disclosures undefined', () => {
      const result = calculateMultiFactorGrade('TEST001', {});
      
      // No disclosure data = 0 (non-compliance)
      expect(result.breakdown.disclosureScore).toBe(0);
    });
  });

  describe('overall grade calculation', () => {
    it('should calculate overall as weighted average with default weights', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          { id: 'v1', votes: { 'TEST001': 'Yea' }, proPublicBenefit: true },
        ],
        finance: { pac_percentage: 0, large_donor_percentage: 0 },
        trading: { total_risk_score: 0, flagged_trades: 0, total_trades: 0, overall_suspicion_level: 'low' },
        disclosures: [{ year: 2024, filingDate: '5/15/2025' }],
      });
      
      // All perfect scores = 100
      expect(result.overall).toBe(100);
    });

    it('should use equal weights by default (25% each)', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          { id: 'v1', votes: { 'TEST001': 'Yea' }, proPublicBenefit: true },
        ], // 100
        finance: { pac_percentage: 100, large_donor_percentage: 100 }, // 0
        trading: { total_risk_score: 1000, flagged_trades: 100, total_trades: 100, overall_suspicion_level: 'high' }, // ~20
        disclosures: [], // 0
      });
      
      // (100 + 0 + ~20 + 0) / 4 = ~30
      expect(result.overall).toBeGreaterThan(20);
      expect(result.overall).toBeLessThan(40);
    });

    it('should support custom weights', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          { id: 'v1', votes: { 'TEST001': 'Yea' }, proPublicBenefit: true },
        ],
        finance: { pac_percentage: 0, large_donor_percentage: 0 },
        trading: {},
        disclosures: [],
      }, {
        votingWeight: 0.5,      // 50%
        donorWeight: 0.3,       // 30%
        stockWeight: 0.1,       // 10%
        disclosureWeight: 0.1,  // 10%
      });
      
      // voting=100, donor=100, stock=100, disclosure=0
      // overall = 100*0.5 + 100*0.3 + 100*0.1 + 0*0.1 = 90
      expect(result.overall).toBe(90);
    });
  });

  describe('letter grade assignment', () => {
    it('should assign A for score >= 90', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [{ id: 'v1', votes: { 'TEST001': 'Yea' }, proPublicBenefit: true }],
        finance: { pac_percentage: 0, large_donor_percentage: 0 },
        trading: {},
        disclosures: [{ year: 2024, filingDate: '5/15/2025' }],
      });
      
      expect(result.overall).toBeGreaterThanOrEqual(90);
      expect(result.letter).toBe('A');
    });

    it('should assign B for score 80-89', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        keyVotes: [
          { id: 'v1', votes: { 'TEST001': 'Yea' }, proPublicBenefit: true },
          { id: 'v2', votes: { 'TEST001': 'Nay' }, proPublicBenefit: true }, // misaligned
        ],
        finance: { pac_percentage: 0, large_donor_percentage: 0 },
        trading: {},
        disclosures: [{ year: 2024, filingDate: '5/15/2025' }],
      });
      
      // voting=50, donor=100, stock=100, disclosure=100 → 87.5
      expect(result.overall).toBeCloseTo(87.5, 0);
      expect(result.letter).toBe('B');
    });

    it('should assign F for score < 60', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        finance: { pac_percentage: 100, large_donor_percentage: 100 },
        trading: { total_risk_score: 2000, flagged_trades: 100, total_trades: 100, overall_suspicion_level: 'high' },
        disclosures: [],
      });
      
      expect(result.overall).toBeLessThan(60);
      expect(result.letter).toBe('F');
    });
  });

  describe('return type structure', () => {
    it('should return complete MultiFactorGradeResult structure', () => {
      const result = calculateMultiFactorGrade('TEST001', {});
      
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('letter');
      expect(result).toHaveProperty('breakdown');
      expect(result.breakdown).toHaveProperty('votingScore');
      expect(result.breakdown).toHaveProperty('donorScore');
      expect(result.breakdown).toHaveProperty('stockScore');
      expect(result.breakdown).toHaveProperty('disclosureScore');
      expect(result).toHaveProperty('weights');
      expect(result.weights).toHaveProperty('votingWeight');
      expect(result.weights).toHaveProperty('donorWeight');
      expect(result.weights).toHaveProperty('stockWeight');
      expect(result.weights).toHaveProperty('disclosureWeight');
    });

    it('should round all scores to 1 decimal place', () => {
      const result = calculateMultiFactorGrade('TEST001', {
        finance: { pac_percentage: 33.33, large_donor_percentage: 66.67 },
      });
      
      expect(result.overall).toEqual(expect.any(Number));
      expect(result.overall.toString()).toMatch(/^\d+(\.\d)?$/); // Max 1 decimal
    });
  });
});
