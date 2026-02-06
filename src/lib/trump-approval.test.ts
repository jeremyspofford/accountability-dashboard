import { describe, it, expect } from 'vitest';
import approvalData from '../data/trump-approval.json';

describe('Trump Approval Data', () => {
  it('has the correct structure', () => {
    expect(approvalData).toHaveProperty('current');
    expect(approvalData).toHaveProperty('history');
    expect(approvalData).toHaveProperty('source');
    expect(approvalData).toHaveProperty('last_updated');
  });

  describe('current approval', () => {
    it('has approve and disapprove percentages', () => {
      expect(approvalData.current).toHaveProperty('approve');
      expect(approvalData.current).toHaveProperty('disapprove');
      expect(approvalData.current).toHaveProperty('net');
    });

    it('percentages are valid numbers', () => {
      expect(typeof approvalData.current.approve).toBe('number');
      expect(typeof approvalData.current.disapprove).toBe('number');
      expect(approvalData.current.approve).toBeGreaterThanOrEqual(0);
      expect(approvalData.current.approve).toBeLessThanOrEqual(100);
      expect(approvalData.current.disapprove).toBeGreaterThanOrEqual(0);
      expect(approvalData.current.disapprove).toBeLessThanOrEqual(100);
    });

    it('net approval is calculated correctly', () => {
      const expectedNet = approvalData.current.approve - approvalData.current.disapprove;
      expect(approvalData.current.net).toBeCloseTo(expectedNet, 1);
    });
  });

  describe('history', () => {
    it('is an array with at least one entry', () => {
      expect(Array.isArray(approvalData.history)).toBe(true);
      expect(approvalData.history.length).toBeGreaterThan(0);
    });

    it('each entry has required fields', () => {
      for (const entry of approvalData.history) {
        expect(entry).toHaveProperty('date');
        expect(entry).toHaveProperty('approve');
        expect(entry).toHaveProperty('disapprove');
        expect(entry).toHaveProperty('net');
      }
    });

    it('dates are in ISO format', () => {
      for (const entry of approvalData.history) {
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('is sorted by date (most recent first)', () => {
      const dates = approvalData.history.map(h => h.date);
      const sorted = [...dates].sort().reverse();
      expect(dates).toEqual(sorted);
    });
  });

  describe('metadata', () => {
    it('has a valid source', () => {
      expect(typeof approvalData.source).toBe('string');
      expect(approvalData.source.length).toBeGreaterThan(0);
    });

    it('has a last_updated timestamp', () => {
      expect(typeof approvalData.last_updated).toBe('string');
      expect(approvalData.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('trend analysis', () => {
    it('can calculate 7-day trend', () => {
      if (approvalData.history.length >= 7) {
        const recent = approvalData.history[0].net;
        const weekAgo = approvalData.history[6].net;
        const trend = recent - weekAgo;
        
        // Trend should be a reasonable number
        expect(typeof trend).toBe('number');
        expect(Math.abs(trend)).toBeLessThan(20); // No more than 20 point swing in a week
      }
    });
  });
});
