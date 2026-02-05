import { describe, it, expect } from 'vitest';
import {
  calculateCorruptionScore,
  calculateDonorInfluence,
  calculateVotingIndependence,
  getGradeColor,
  type CorruptionFactors,
} from './scoring';

describe('Corruption Scoring', () => {
  describe('calculateCorruptionScore', () => {
    it('should give an A grade for excellent scores', () => {
      const factors: CorruptionFactors = {
        financialTransparency: 95,
        donorInfluence: 10,  // Low influence = good
        votingIndependence: 90,
        wealthGrowth: 5,     // Low growth = good
      };
      
      const result = calculateCorruptionScore(factors);
      expect(result.grade).toBe('A');
      expect(result.score).toBeGreaterThanOrEqual(90);
    });
    
    it('should give an F grade for poor scores', () => {
      const factors: CorruptionFactors = {
        financialTransparency: 20,
        donorInfluence: 90,  // High influence = bad
        votingIndependence: 10,
        wealthGrowth: 95,    // High growth = bad
      };
      
      const result = calculateCorruptionScore(factors);
      expect(result.grade).toBe('F');
      expect(result.score).toBeLessThan(60);
    });
    
    it('should give a C grade for average scores', () => {
      const factors: CorruptionFactors = {
        financialTransparency: 75,
        donorInfluence: 30,  // Low influence (30) inverts to high score (70)
        votingIndependence: 70,
        wealthGrowth: 25,    // Low growth (25) inverts to high score (75)
      };
      
      const result = calculateCorruptionScore(factors);
      expect(result.grade).toBe('C');
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.score).toBeLessThan(80);
    });
    
    it('should include breakdown of normalized factors', () => {
      const factors: CorruptionFactors = {
        financialTransparency: 80,
        donorInfluence: 30,
        votingIndependence: 70,
        wealthGrowth: 20,
      };
      
      const result = calculateCorruptionScore(factors);
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.donorInfluence).toBe(70); // Inverted from 30
      expect(result.breakdown.wealthGrowth).toBe(80);   // Inverted from 20
    });
  });
  
  describe('calculateDonorInfluence', () => {
    it('should give low influence score for mostly small donors', () => {
      const fecData = {
        totalRaised: 1000000,
        individualContributions: 900000,
        pacContributions: 50000,
        largeIndividualContributions: 100000,
      };
      
      const score = calculateDonorInfluence(fecData);
      expect(score).toBeLessThan(50);
    });
    
    it('should give high influence score for mostly PAC money', () => {
      const fecData = {
        totalRaised: 1000000,
        individualContributions: 200000,
        pacContributions: 800000,
        largeIndividualContributions: 100000,
      };
      
      const score = calculateDonorInfluence(fecData);
      expect(score).toBeGreaterThan(70);
    });
    
    it('should handle zero total raised', () => {
      const fecData = {
        totalRaised: 0,
        individualContributions: 0,
        pacContributions: 0,
        largeIndividualContributions: 0,
      };
      
      const score = calculateDonorInfluence(fecData);
      expect(score).toBe(50); // Neutral when no data
    });
    
    it('should clamp scores to 0-100 range', () => {
      const fecData = {
        totalRaised: 1000000,
        individualContributions: 0,
        pacContributions: 1000000,
        largeIndividualContributions: 0,
      };
      
      const score = calculateDonorInfluence(fecData);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
  
  describe('calculateVotingIndependence', () => {
    it('should give high independence for moderate alignment', () => {
      const score = calculateVotingIndependence(50);
      expect(score).toBe(100); // Perfect middle = max independence
    });
    
    it('should give low independence for 100% party line', () => {
      const score = calculateVotingIndependence(100);
      expect(score).toBe(0); // Always votes with party = no independence
    });
    
    it('should give low independence for 0% party line', () => {
      const score = calculateVotingIndependence(0);
      expect(score).toBe(0); // Always votes against party = also not independent
    });
    
    it('should be symmetric around 50%', () => {
      const score1 = calculateVotingIndependence(40);
      const score2 = calculateVotingIndependence(60);
      expect(score1).toBe(score2);
    });
  });
  
  describe('getGradeColor', () => {
    it('should return green for A grade', () => {
      const colors = getGradeColor('A');
      expect(colors.text).toContain('green');
    });
    
    it('should return red for F grade', () => {
      const colors = getGradeColor('F');
      expect(colors.text).toContain('red');
    });
    
    it('should return yellow for C grade', () => {
      const colors = getGradeColor('C');
      expect(colors.text).toContain('yellow');
    });
    
    it('should return all required color properties', () => {
      const colors = getGradeColor('B');
      expect(colors).toHaveProperty('bg');
      expect(colors).toHaveProperty('text');
      expect(colors).toHaveProperty('border');
    });
  });
});
