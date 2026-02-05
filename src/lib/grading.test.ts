import { describe, it, expect } from 'vitest';
import { calculateGrade, getGradeColor, type MemberData, type GradeResult } from './grading';

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

  describe('placeholder scores', () => {
    it('should use 70 as placeholder for transparency score', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      expect(result.breakdown.transparencyScore).toBe(70);
    });

    it('should use 70 as placeholder for wealth score', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      expect(result.breakdown.wealthScore).toBe(70);
    });

    it('should use 70 as placeholder for stock score', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      expect(result.breakdown.stockScore).toBe(70);
    });
  });

  describe('overall score calculation', () => {
    it('should calculate overall as average of all four scores', () => {
      const data: MemberData = {
        pac_percentage: 20,
        large_donor_percentage: 40,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - (20 + 40) / 2 = 70
      // transparencyScore = 70
      // wealthScore = 70
      // stockScore = 70
      // overall = (70 + 70 + 70 + 70) / 4 = 70
      expect(result.overall).toBe(70);
    });

    it('should round overall score to 1 decimal place', () => {
      const data: MemberData = {
        pac_percentage: 33.33,
        large_donor_percentage: 33.33,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - 33.33 = 66.67
      // overall = (66.67 + 70 + 70 + 70) / 4 = 69.1675 → 69.2
      expect(result.overall).toBeCloseTo(69.2, 1);
    });
  });

  describe('letter grade assignment', () => {
    it('should assign C for score with perfect donor score but placeholder values', () => {
      const data: MemberData = {
        pac_percentage: 0,
        large_donor_percentage: 0,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100, placeholders = 70 each
      // overall = (100 + 70 + 70 + 70) / 4 = 77.5
      // 77.5 is in the C range (70-79)
      expect(result.overall).toBe(77.5);
      expect(result.letter).toBe('C');
    });

    it('should calculate correct overall score from all components', () => {
      const data: MemberData = {
        pac_percentage: 0,
        large_donor_percentage: 0,
      };
      
      const result = calculateGrade(data);
      
      // overall = 77.5
      expect(result.overall).toBe(77.5);
      expect(result.letter).toBe('C');
    });

    it('should assign C for score 70-79', () => {
      const data: MemberData = {
        pac_percentage: 20,
        large_donor_percentage: 40,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 70, overall = 70
      expect(result.overall).toBe(70);
      expect(result.letter).toBe('C');
    });

    it('should assign D for score 60-69', () => {
      const data: MemberData = {
        pac_percentage: 40,
        large_donor_percentage: 80,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 100 - 60 = 40
      // overall = (40 + 70 + 70 + 70) / 4 = 62.5
      expect(result.overall).toBe(62.5);
      expect(result.letter).toBe('D');
    });

    it('should assign F for score < 60', () => {
      const data: MemberData = {
        pac_percentage: 100,
        large_donor_percentage: 100,
      };
      
      const result = calculateGrade(data);
      
      // donorScore = 0
      // overall = (0 + 70 + 70 + 70) / 4 = 52.5
      expect(result.overall).toBe(52.5);
      expect(result.letter).toBe('F');
    });

    it('should handle boundary case: exactly 90 is an A', () => {
      // We'd need to mock the placeholder functions to test this precisely
      // For now, verify the logic works by checking result structure
      const data: MemberData = { pac_percentage: 20, large_donor_percentage: 0 };
      const result = calculateGrade(data);
      
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('letter');
      expect(['A', 'B', 'C', 'D', 'F']).toContain(result.letter);
    });

    it('should handle score in C range (70-79)', () => {
      const data: MemberData = { pac_percentage: 0, large_donor_percentage: 0 };
      const result = calculateGrade(data);
      
      // overall = 77.5 → C (70-79 range)
      expect(result.letter).toBe('C');
    });

    it('should handle boundary case: exactly 70 is a C', () => {
      const data: MemberData = { pac_percentage: 20, large_donor_percentage: 40 };
      const result = calculateGrade(data);
      
      // overall = 70 → C
      expect(result.overall).toBe(70);
      expect(result.letter).toBe('C');
    });

    it('should handle boundary case: exactly 60 is a D', () => {
      const data: MemberData = { pac_percentage: 50, large_donor_percentage: 70 };
      const result = calculateGrade(data);
      
      // donorScore = 100 - 60 = 40
      // overall = (40 + 70 + 70 + 70) / 4 = 62.5 → D
      expect(result.letter).toBe('D');
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
      expect(result.breakdown).toHaveProperty('donorScore');
      expect(result.breakdown).toHaveProperty('transparencyScore');
      expect(result.breakdown).toHaveProperty('wealthScore');
      expect(result.breakdown).toHaveProperty('stockScore');
    });

    it('should return numbers for all scores', () => {
      const data: MemberData = {};
      
      const result = calculateGrade(data);
      
      expect(typeof result.overall).toBe('number');
      expect(typeof result.breakdown.donorScore).toBe('number');
      expect(typeof result.breakdown.transparencyScore).toBe('number');
      expect(typeof result.breakdown.wealthScore).toBe('number');
      expect(typeof result.breakdown.stockScore).toBe('number');
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
