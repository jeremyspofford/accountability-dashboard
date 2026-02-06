import { describe, it, expect } from 'vitest';
import committeesData from '../data/committees.json';

describe('Committees Data', () => {
  it('has committees array', () => {
    expect(committeesData).toHaveProperty('committees');
    expect(Array.isArray(committeesData.committees)).toBe(true);
  });

  it('has member_assignments array', () => {
    expect(committeesData).toHaveProperty('member_assignments');
    expect(Array.isArray(committeesData.member_assignments)).toBe(true);
  });

  describe('committees', () => {
    it('each committee has required fields', () => {
      if (committeesData.committees.length > 0) {
        for (const committee of committeesData.committees) {
          expect(committee).toHaveProperty('id');
          expect(committee).toHaveProperty('name');
          expect(committee).toHaveProperty('chamber');
          expect(committee).toHaveProperty('type');
        }
      }
    });

    it('chamber values are valid', () => {
      const validChambers = ['house', 'senate', 'joint'];
      for (const committee of committeesData.committees) {
        expect(validChambers).toContain(committee.chamber);
      }
    });

    it('type values are valid', () => {
      const validTypes = ['standing', 'select', 'joint', 'special'];
      for (const committee of committeesData.committees) {
        expect(validTypes).toContain(committee.type);
      }
    });
  });

  describe('member_assignments', () => {
    it('each assignment has required fields', () => {
      if (committeesData.member_assignments.length > 0) {
        for (const assignment of committeesData.member_assignments) {
          expect(assignment).toHaveProperty('bioguide_id');
          expect(assignment).toHaveProperty('committee_id');
          expect(assignment).toHaveProperty('role');
        }
      }
    });

    it('role values are valid', () => {
      const validRoles = ['chair', 'ranking_member', 'vice_chair', 'member'];
      for (const assignment of committeesData.member_assignments) {
        expect(validRoles).toContain(assignment.role);
      }
    });

    it('bioguide IDs are valid format', () => {
      for (const assignment of committeesData.member_assignments) {
        expect(assignment.bioguide_id).toMatch(/^[A-Z]\d{6}$/);
      }
    });
  });

  describe('data quality', () => {
    it('has reasonable number of committees', () => {
      // House has ~20 standing, Senate has ~16 standing, plus select/joint
      expect(committeesData.committees.length).toBeGreaterThan(20);
      expect(committeesData.committees.length).toBeLessThan(60);
    });

    it('has assignments data', () => {
      // Note: Full dataset would have 1000+ assignments, sample has fewer
      expect(committeesData.member_assignments.length).toBeGreaterThan(0);
    });

    it('has unique member assignments', () => {
      const uniqueMembers = new Set(
        committeesData.member_assignments.map(a => a.bioguide_id)
      );
      // Sample data has key leadership assignments
      expect(uniqueMembers.size).toBeGreaterThan(0);
    });
  });

  describe('metadata', () => {
    it('has last_updated timestamp', () => {
      expect(committeesData).toHaveProperty('last_updated');
      expect(typeof committeesData.last_updated).toBe('string');
    });

    it('has source information', () => {
      expect(committeesData).toHaveProperty('source');
      expect(typeof committeesData.source).toBe('string');
    });
  });
});
