import { describe, it, expect } from 'vitest';
import promisesData from '../data/trump-promises.json';

describe('Trump Promises Data', () => {
  it('has the correct top-level structure', () => {
    expect(promisesData).toHaveProperty('president');
    expect(promisesData).toHaveProperty('promises');
  });

  describe('promises array', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(promisesData.promises)).toBe(true);
      expect(promisesData.promises.length).toBeGreaterThan(0);
    });

    it('each promise has required fields', () => {
      for (const promise of promisesData.promises) {
        expect(promise).toHaveProperty('id');
        expect(promise).toHaveProperty('text');
        expect(promise).toHaveProperty('category');
        expect(promise).toHaveProperty('status');
      }
    });

    it('has valid status values', () => {
      const validStatuses = ['kept', 'broken', 'in_progress', 'not_started', 'compromised'];
      for (const promise of promisesData.promises) {
        expect(validStatuses).toContain(promise.status);
      }
    });
  });

  describe('impact analysis', () => {
    it('all promises have who_benefits field', () => {
      for (const promise of promisesData.promises) {
        expect(promise).toHaveProperty('who_benefits');
        expect(Array.isArray(promise.who_benefits)).toBe(true);
      }
    });

    it('all promises have who_harmed field', () => {
      for (const promise of promisesData.promises) {
        expect(promise).toHaveProperty('who_harmed');
        expect(Array.isArray(promise.who_harmed)).toBe(true);
      }
    });

    it('all promises have impact_analysis object', () => {
      for (const promise of promisesData.promises) {
        expect(promise).toHaveProperty('impact_analysis');
        expect(typeof promise.impact_analysis).toBe('object');
      }
    });

    it('impact_analysis has required categories', () => {
      for (const promise of promisesData.promises) {
        const impact = promise.impact_analysis;
        expect(impact).toHaveProperty('workers');
        expect(impact).toHaveProperty('middle_class');
        expect(impact).toHaveProperty('wealthy');
        expect(impact).toHaveProperty('corporations');
        expect(impact).toHaveProperty('environment');
      }
    });

    it('impact values are valid', () => {
      const validImpacts = ['positive', 'negative', 'neutral', 'mixed'];
      for (const promise of promisesData.promises) {
        const impact = promise.impact_analysis;
        expect(validImpacts).toContain(impact.workers);
        expect(validImpacts).toContain(impact.middle_class);
        expect(validImpacts).toContain(impact.wealthy);
        expect(validImpacts).toContain(impact.corporations);
        expect(validImpacts).toContain(impact.environment);
      }
    });

    it('all promises have public_opinion field', () => {
      for (const promise of promisesData.promises) {
        expect(promise).toHaveProperty('public_opinion');
      }
    });

    it('public_opinion values are valid', () => {
      const validOpinions = ['positive', 'negative', 'mixed', 'unknown'];
      for (const promise of promisesData.promises) {
        expect(validOpinions).toContain(promise.public_opinion);
      }
    });
  });

  describe('data quality', () => {
    it('all promises have non-empty text', () => {
      for (const promise of promisesData.promises) {
        expect(promise.text.length).toBeGreaterThan(0);
      }
    });

    it('all promises have valid categories', () => {
      const categories = new Set(promisesData.promises.map(p => p.category));
      expect(categories.size).toBeGreaterThan(0);
      
      // Check for common categories
      const categoryArray = Array.from(categories);
      expect(categoryArray.some(c => c.includes('Trade') || c.includes('Immigration') || c.includes('Economy'))).toBe(true);
    });

    it('promises with updates have valid update structure', () => {
      for (const promise of promisesData.promises) {
        if (promise.updates && promise.updates.length > 0) {
          for (const update of promise.updates) {
            expect(update).toHaveProperty('date');
            expect(update).toHaveProperty('note');
            expect(update.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          }
        }
      }
    });
  });
});
