import { describe, it, expect } from 'vitest';
import { 
  calculateGrade, 
  getGradeColor, 
  type MemberData, 
  type GradeResult,
  type GradeWeights,
  DEFAULT_WEIGHTS 
} from './grading';

describe('calculateGrade', () => {
  describe('donor score calculation', () => {
    it('should calculate perfect donor score when no PAC or large donor money', () => {
      const data: MemberData = {
        pac_percentage: 0,
        large_donor_percentage: 0,
      };
      
      const result = calculateGrade(data);
      
      expect(result.breakdown.donorScore).toBe(100);
    });

    it('should calculate donor score with PAC and large donor percentages', () => {
      const data: MemberData = {
        pac_percentage: 40,
        large_donor_percentage: 60,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - (40 + 60) / 2 = 100 - 50 = 50
      expect(result.breakdown.donorScore).toBe(50);
    });

    it('should handle null PAC percentage as 0', () => {
      const data: MemberData = {
        pac_percentage: null,
        large_donor_percentage: 20,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - (0 + 20) / 2 = 100 - 10 = 90
      expect(result.breakdown.donorScore).toBe(90);
    });

    it('should handle undefined large_donor_percentage as 0', () => {
      const data: MemberData = {
        pac_percentage: 30,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - (30 + 0) / 2 = 100 - 15 = 85
      expect(result.breakdown.donorScore).toBe(85);
    });

    it('should handle 100% PAC and large donor funding', () => {
      const data: MemberData = {
        pac_percentage: 100,
        large_donor_percentage: 100,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - (100 + 100) / 2 = 0
      expect(result.breakdown.donorScore).toBe(0);
    });
  });

  describe('voting accountability score calculation', () => {
    it('should give perfect score with high voting participation and consistent alignment', () => {
      const data: MemberData = {
        voting_record: {
          key_votes_participated: 50,
          key_votes_total: 50,
          votes_with_party: 48,
          votes_against_public_interest: 0,
        },
      };
      
      const result = calculateGrade(data);
      
      // 100% participation, 96% party loyalty, 0% against public interest
      // Score should be very high
      expect(result.breakdown.votingScore).toBeGreaterThan(90);
    });

    it('should penalize missing key votes', () => {
      const data: MemberData = {
        voting_record: {
          key_votes_participated: 30,
          key_votes_total: 50,
          votes_with_party: 25,
          votes_against_public_interest: 2,
        },
      };
      
      const result = calculateGrade(data);
      
      // 60% participation but good party loyalty and public interest alignment
      // Score: (60 * 0.5) + (83.33 * 0.2) + (93.33 * 0.3) ≈ 74.7
      expect(result.breakdown.votingScore).toBeGreaterThan(70);
      expect(result.breakdown.votingScore).toBeLessThan(80);
    });

    it('should penalize votes against public interest', () => {
      const data: MemberData = {
        voting_record: {
          key_votes_participated: 50,
          key_votes_total: 50,
          votes_with_party: 40,
          votes_against_public_interest: 15,
        },
      };
      
      const result = calculateGrade(data);
      
      // 30% votes against public interest reduces score but perfect participation helps
      // Score: (100 * 0.5) + (80 * 0.2) + (70 * 0.3) = 87
      expect(result.breakdown.votingScore).toBeGreaterThan(80);
      expect(result.breakdown.votingScore).toBeLessThan(90);
    });

    it('should handle missing voting record data', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      // Should use default neutral score
      expect(result.breakdown.votingScore).toBe(70);
    });
  });

  describe('trading ethics score calculation', () => {
    it('should give perfect score with no trades', () => {
      const data: MemberData = {
        trading_summary: {
          total_trades: 0,
          flagged_trades: 0,
          flag_rate: 0,
          total_risk_score: 0,
          avg_risk_per_trade: 0,
          overall_suspicion_level: 'none',
        },
      };
      
      const result = calculateGrade(data);
      
      expect(result.breakdown.tradingScore).toBe(100);
    });

    it('should penalize high flag rate', () => {
      const data: MemberData = {
        trading_summary: {
          total_trades: 100,
          flagged_trades: 85,
          flag_rate: 85,
          total_risk_score: 340,
          avg_risk_per_trade: 3.4,
          overall_suspicion_level: 'high',
        },
      };
      
      const result = calculateGrade(data);
      
      // 85% flag rate should result in low score
      expect(result.breakdown.tradingScore).toBeLessThan(30);
    });

    it('should penalize high risk per trade', () => {
      const data: MemberData = {
        trading_summary: {
          total_trades: 50,
          flagged_trades: 40,
          flag_rate: 80,
          total_risk_score: 200,
          avg_risk_per_trade: 4.0,
          overall_suspicion_level: 'high',
        },
      };
      
      const result = calculateGrade(data);
      
      // High risk score should reduce score
      expect(result.breakdown.tradingScore).toBeLessThan(35);
    });

    it('should give good score for low suspicious activity', () => {
      const data: MemberData = {
        trading_summary: {
          total_trades: 20,
          flagged_trades: 3,
          flag_rate: 15,
          total_risk_score: 9,
          avg_risk_per_trade: 0.45,
          overall_suspicion_level: 'low',
        },
      };
      
      const result = calculateGrade(data);
      
      // Low flag rate and risk should result in good score
      expect(result.breakdown.tradingScore).toBeGreaterThan(75);
    });

    it('should handle missing trading data', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      // Should use default score
      expect(result.breakdown.tradingScore).toBe(70);
    });
  });

  describe('disclosure compliance score calculation', () => {
    it('should give perfect score for timely and complete filings', () => {
      const data: MemberData = {
        disclosure_compliance: {
          filings_count: 5,
          expected_filings: 5,
          late_filings: 0,
          missing_filings: 0,
        },
      };
      
      const result = calculateGrade(data);
      
      expect(result.breakdown.disclosureScore).toBe(100);
    });

    it('should penalize late filings', () => {
      const data: MemberData = {
        disclosure_compliance: {
          filings_count: 5,
          expected_filings: 5,
          late_filings: 3,
          missing_filings: 0,
        },
      };
      
      const result = calculateGrade(data);
      
      // 60% late filings should reduce score
      expect(result.breakdown.disclosureScore).toBeLessThan(70);
    });

    it('should heavily penalize missing filings', () => {
      const data: MemberData = {
        disclosure_compliance: {
          filings_count: 2,
          expected_filings: 5,
          late_filings: 0,
          missing_filings: 3,
        },
      };
      
      const result = calculateGrade(data);
      
      // Missing 60% of expected filings should result in very low score
      expect(result.breakdown.disclosureScore).toBeLessThan(50);
    });

    it('should handle missing disclosure data', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      // Should use default score
      expect(result.breakdown.disclosureScore).toBe(70);
    });
  });

  describe('configurable weights', () => {
    it('should use default weights when not provided', () => {
      const data: MemberData = {
        pac_percentage: 50,
        large_donor_percentage: 50,
      };
      
      const result = calculateGrade(data);
      
      // Default weights are equal (25% each)
      expect(result).toHaveProperty('overall');
      expect(result.breakdown).toHaveProperty('donorScore');
      expect(result.breakdown).toHaveProperty('votingScore');
      expect(result.breakdown).toHaveProperty('tradingScore');
      expect(result.breakdown).toHaveProperty('disclosureScore');
    });

    it('should apply custom weights correctly', () => {
      const data: MemberData = {
        pac_percentage: 0,
        large_donor_percentage: 0,
        trading_summary: {
          total_trades: 0,
          flagged_trades: 0,
          flag_rate: 0,
          total_risk_score: 0,
          avg_risk_per_trade: 0,
          overall_suspicion_level: 'none',
        },
      };
      
      const customWeights: GradeWeights = {
        donor: 0.5,  // 50% weight on donor score
        voting: 0.2,
        trading: 0.2,
        disclosure: 0.1,
      };
      
      const result = calculateGrade(data, customWeights);
      
      // donorScore = 100, tradingScore = 100, others = 70
      // overall = 100 * 0.5 + 70 * 0.2 + 100 * 0.2 + 70 * 0.1
      //         = 50 + 14 + 20 + 7 = 91
      expect(result.overall).toBeCloseTo(91, 1);
    });

    it('should throw error if weights do not sum to 1', () => {
      const data: MemberData = {};
      
      const invalidWeights: GradeWeights = {
        donor: 0.5,
        voting: 0.3,
        trading: 0.1,
        disclosure: 0.05,  // Sum = 0.95, not 1.0
      };
      
      expect(() => calculateGrade(data, invalidWeights)).toThrow('Weights must sum to 1.0');
    });
  });

  describe('overall score calculation with multiple factors', () => {
    it('should calculate overall with all factors present', () => {
      const data: MemberData = {
        pac_percentage: 20,
        large_donor_percentage: 30,
        voting_record: {
          key_votes_participated: 45,
          key_votes_total: 50,
          votes_with_party: 40,
          votes_against_public_interest: 2,
        },
        trading_summary: {
          total_trades: 20,
          flagged_trades: 5,
          flag_rate: 25,
          total_risk_score: 15,
          avg_risk_per_trade: 0.75,
          overall_suspicion_level: 'low',
        },
        disclosure_compliance: {
          filings_count: 5,
          expected_filings: 5,
          late_filings: 1,
          missing_filings: 0,
        },
      };
      
      const result = calculateGrade(data);
      
      // Should calculate based on all four factors
      expect(result.overall).toBeGreaterThan(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.letter).toMatch(/^[ABCDF]$/);
    });

    it('should handle mixed good and bad scores', () => {
      const data: MemberData = {
        pac_percentage: 10,  // Good donor score
        large_donor_percentage: 10,
        trading_summary: {  // Bad trading score
          total_trades: 100,
          flagged_trades: 90,
          flag_rate: 90,
          total_risk_score: 450,
          avg_risk_per_trade: 4.5,
          overall_suspicion_level: 'high',
        },
      };
      
      const result = calculateGrade(data);
      
      // Should average good and bad scores
      expect(result.breakdown.donorScore).toBeGreaterThan(85);
      expect(result.breakdown.tradingScore).toBeLessThan(25);
      expect(result.overall).toBeGreaterThan(40);
      expect(result.overall).toBeLessThan(80);
    });
  });

  describe('letter grade assignment', () => {
    it('should assign A for score >= 90', () => {
      const data: MemberData = {
        pac_percentage: 0,
        large_donor_percentage: 0,
        voting_record: {
          key_votes_participated: 50,
          key_votes_total: 50,
          votes_with_party: 48,
          votes_against_public_interest: 0,
        },
        trading_summary: {
          total_trades: 0,
          flagged_trades: 0,
          flag_rate: 0,
          total_risk_score: 0,
          avg_risk_per_trade: 0,
          overall_suspicion_level: 'none',
        },
        disclosure_compliance: {
          filings_count: 5,
          expected_filings: 5,
          late_filings: 0,
          missing_filings: 0,
        },
      };
      
      const result = calculateGrade(data);
      
      expect(result.overall).toBeGreaterThanOrEqual(90);
      expect(result.letter).toBe('A');
    });

    it('should assign B for score 80-89', () => {
      const data: MemberData = {
        pac_percentage: 20,
        large_donor_percentage: 20,
        voting_record: {
          key_votes_participated: 48,
          key_votes_total: 50,
          votes_with_party: 45,
          votes_against_public_interest: 2,
        },
        trading_summary: {
          total_trades: 12,
          flagged_trades: 3,
          flag_rate: 25,
          total_risk_score: 9,
          avg_risk_per_trade: 0.75,
          overall_suspicion_level: 'low',
        },
        disclosure_compliance: {
          filings_count: 5,
          expected_filings: 5,
          late_filings: 1,
          missing_filings: 0,
        },
      };
      
      const result = calculateGrade(data);
      
      expect(result.overall).toBeGreaterThanOrEqual(80);
      expect(result.overall).toBeLessThan(90);
      expect(result.letter).toBe('B');
    });

    it('should assign C for score 70-79', () => {
      const data: MemberData = {
        pac_percentage: 30,
        large_donor_percentage: 30,
      };
      
      const result = calculateGrade(data);
      
      expect(result.overall).toBeGreaterThanOrEqual(70);
      expect(result.overall).toBeLessThan(80);
      expect(result.letter).toBe('C');
    });

    it('should assign D for score 60-69', () => {
      const data: MemberData = {
        pac_percentage: 50,
        large_donor_percentage: 60,
      };
      
      const result = calculateGrade(data);
      
      expect(result.overall).toBeGreaterThanOrEqual(60);
      expect(result.overall).toBeLessThan(70);
      expect(result.letter).toBe('D');
    });

    it('should assign F for score < 60', () => {
      const data: MemberData = {
        pac_percentage: 90,
        large_donor_percentage: 90,
        trading_summary: {
          total_trades: 200,
          flagged_trades: 190,
          flag_rate: 95,
          total_risk_score: 950,
          avg_risk_per_trade: 4.75,
          overall_suspicion_level: 'high',
        },
      };
      
      const result = calculateGrade(data);
      
      expect(result.overall).toBeLessThan(60);
      expect(result.letter).toBe('F');
    });
  });

  describe('grade explanations', () => {
    it('should include explanation for each factor', () => {
      const data: MemberData = {
        pac_percentage: 40,
        large_donor_percentage: 50,
      };
      
      const result = calculateGrade(data);
      
      expect(result.explanation).toBeDefined();
      expect(result.explanation.donor).toBeDefined();
      expect(result.explanation.voting).toBeDefined();
      expect(result.explanation.trading).toBeDefined();
      expect(result.explanation.disclosure).toBeDefined();
    });

    it('should provide meaningful explanation for low donor score', () => {
      const data: MemberData = {
        pac_percentage: 80,
        large_donor_percentage: 70,
      };
      
      const result = calculateGrade(data);
      
      expect(result.explanation.donor).toContain('PAC');
      expect(result.explanation.donor).toContain('large donor');
    });

    it('should provide meaningful explanation for trading issues', () => {
      const data: MemberData = {
        trading_summary: {
          total_trades: 100,
          flagged_trades: 85,
          flag_rate: 85,
          total_risk_score: 340,
          avg_risk_per_trade: 3.4,
          overall_suspicion_level: 'high',
        },
      };
      
      const result = calculateGrade(data);
      
      expect(result.explanation.trading).toContain('suspicious');
      expect(result.explanation.trading).toContain('85');
    });
  });

  describe('return type structure', () => {
    it('should return complete GradeResult structure', () => {
      const data: MemberData = {
        pac_percentage: 25,
        large_donor_percentage: 35,
      };
      
      const result = calculateGrade(data);
      
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('letter');
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('explanation');
      expect(result.breakdown).toHaveProperty('donorScore');
      expect(result.breakdown).toHaveProperty('votingScore');
      expect(result.breakdown).toHaveProperty('tradingScore');
      expect(result.breakdown).toHaveProperty('disclosureScore');
    });

    it('should return numbers for all scores', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      expect(typeof result.overall).toBe('number');
      expect(typeof result.breakdown.donorScore).toBe('number');
      expect(typeof result.breakdown.votingScore).toBe('number');
      expect(typeof result.breakdown.tradingScore).toBe('number');
      expect(typeof result.breakdown.disclosureScore).toBe('number');
    });
  });
});

describe('getGradeColor', () => {
  it('should return green for A grade', () => {
    expect(getGradeColor('A')).toBe('text-green-600');
  });

  it('should return blue for B grade', () => {
    expect(getGradeColor('B')).toBe('text-blue-600');
  });

  it('should return yellow for C grade', () => {
    expect(getGradeColor('C')).toBe('text-yellow-600');
  });

  it('should return orange for D grade', () => {
    expect(getGradeColor('D')).toBe('text-orange-600');
  });

  it('should return red for F grade', () => {
    expect(getGradeColor('F')).toBe('text-red-600');
  });
});
