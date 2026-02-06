import { describe, it, expect } from 'vitest';
import conflictsData from '../data/trump-conflicts.json';

describe('Trump Conflicts Data', () => {
  it('has the correct top-level structure', () => {
    expect(conflictsData).toHaveProperty('summary');
    expect(conflictsData).toHaveProperty('conflicts');
    expect(conflictsData).toHaveProperty('who_he_represents');
  });

  describe('who_he_represents section', () => {
    it('exists and has required categories', () => {
      expect(conflictsData.who_he_represents).toBeDefined();
      expect(conflictsData.who_he_represents).toHaveProperty('tech_billionaires');
      expect(conflictsData.who_he_represents).toHaveProperty('campaign_donors');
      expect(conflictsData.who_he_represents).toHaveProperty('business_partners');
      expect(conflictsData.who_he_represents).toHaveProperty('foreign_governments');
      expect(conflictsData.who_he_represents).toHaveProperty('summary');
    });

    it('tech_billionaires has required fields', () => {
      const tech = conflictsData.who_he_represents.tech_billionaires;
      expect(Array.isArray(tech)).toBe(true);
      expect(tech.length).toBeGreaterThan(0);
      
      for (const person of tech) {
        expect(person).toHaveProperty('name');
        expect(person).toHaveProperty('company');
        expect(person).toHaveProperty('relationship');
        expect(person).toHaveProperty('benefits');
      }
    });

    it('campaign_donors has required fields', () => {
      const donors = conflictsData.who_he_represents.campaign_donors;
      expect(Array.isArray(donors)).toBe(true);
      expect(donors.length).toBeGreaterThan(0);
      
      for (const donor of donors) {
        expect(donor).toHaveProperty('name');
        expect(donor).toHaveProperty('amount');
        expect(donor).toHaveProperty('industry');
        expect(donor).toHaveProperty('policy_interests');
      }
    });

    it('business_partners has required fields', () => {
      const partners = conflictsData.who_he_represents.business_partners;
      expect(Array.isArray(partners)).toBe(true);
      expect(partners.length).toBeGreaterThan(0);
      
      for (const partner of partners) {
        expect(partner).toHaveProperty('entity');
        expect(partner).toHaveProperty('relationship_type');
        expect(partner).toHaveProperty('financial_ties');
      }
    });

    it('foreign_governments has required fields', () => {
      const govs = conflictsData.who_he_represents.foreign_governments;
      expect(Array.isArray(govs)).toBe(true);
      expect(govs.length).toBeGreaterThan(0);
      
      for (const gov of govs) {
        expect(gov).toHaveProperty('country');
        expect(gov).toHaveProperty('relationship');
        expect(gov).toHaveProperty('financial_connections');
      }
    });

    it('summary provides overview statistics', () => {
      const summary = conflictsData.who_he_represents.summary;
      expect(summary).toHaveProperty('total_billionaires');
      expect(summary).toHaveProperty('total_donors');
      expect(summary).toHaveProperty('foreign_governments_count');
      expect(typeof summary.total_billionaires).toBe('number');
      expect(typeof summary.total_donors).toBe('number');
      expect(typeof summary.foreign_governments_count).toBe('number');
    });
  });

  describe('conflicts array', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(conflictsData.conflicts)).toBe(true);
      expect(conflictsData.conflicts.length).toBeGreaterThan(0);
    });

    it('each conflict has required fields', () => {
      for (const conflict of conflictsData.conflicts) {
        expect(conflict).toHaveProperty('id');
        expect(conflict).toHaveProperty('title');
        expect(conflict).toHaveProperty('category');
        expect(conflict).toHaveProperty('severity');
        expect(conflict).toHaveProperty('description');
      }
    });

    it('has valid severity levels', () => {
      const validSeverities = ['low', 'medium', 'high', 'critical'];
      for (const conflict of conflictsData.conflicts) {
        expect(validSeverities).toContain(conflict.severity);
      }
    });
  });
});
