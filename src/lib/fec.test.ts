import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  searchCandidateByName,
  getCandidateFinancials,
  getTopContributors,
  getDonorBreakdown,
  getMemberFECData,
  clearFECCache,
} from './fec';

// Mock fetch globally
global.fetch = vi.fn();

describe('OpenFEC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearFECCache();
  });

  describe('searchCandidateByName', () => {
    it('should find a candidate by name', async () => {
      const mockResponse = {
        results: [
          {
            candidate_id: 'H0NY15088',
            name: 'OCASIO-CORTEZ, ALEXANDRIA',
            party: 'DEM',
            office: 'H',
            state: 'NY',
            district: '14',
            election_years: [2024, 2022, 2020, 2018],
          },
        ],
        pagination: {
          count: 1,
          page: 1,
          pages: 1,
          per_page: 5,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchCandidateByName('Alexandria', 'Ocasio-Cortez', 'H');

      expect(result).toBeDefined();
      expect(result?.candidate_id).toBe('H0NY15088');
      expect(result?.name).toContain('OCASIO-CORTEZ');
      expect(result?.office).toBe('H');
    });

    it('should return null when no candidate found', async () => {
      const mockResponse = {
        results: [],
        pagination: {
          count: 0,
          page: 1,
          pages: 0,
          per_page: 5,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchCandidateByName('NonExistent', 'Candidate', 'H');
      expect(result).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      });

      const result = await searchCandidateByName('Test', 'User', 'H');
      expect(result).toBeNull();
    });
  });

  describe('getCandidateFinancials', () => {
    it('should fetch financial summary for a candidate', async () => {
      const mockResponse = {
        results: [
          {
            cycle: 2024,
            receipts: 5000000,
            disbursements: 4000000,
            cash_on_hand_end_period: 1000000,
            individual_contributions: 4000000,
            other_political_committee_contributions: 500000,
            political_party_committee_contributions: 100000,
            candidate_contribution: 50000,
            other_receipts: 350000,
            individual_itemized_contributions: 3000000,
            individual_unitemized_contributions: 1000000,
          },
        ],
        pagination: {
          count: 1,
          page: 1,
          pages: 1,
          per_page: 20,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCandidateFinancials('H0NY15088', 2024);

      expect(result).toBeDefined();
      expect(result?.cycle).toBe(2024);
      expect(result?.total_receipts).toBe(5000000);
      expect(result?.individual_contributions).toBe(4000000);
      expect(result?.pac_contributions).toBe(500000);
      expect(result?.individual_itemized).toBe(3000000);
      expect(result?.individual_unitemized).toBe(1000000);
    });

    it('should return null when no financial data found', async () => {
      const mockResponse = {
        results: [],
        pagination: {
          count: 0,
          page: 1,
          pages: 0,
          per_page: 20,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCandidateFinancials('INVALID123');
      expect(result).toBeNull();
    });
  });

  describe('getTopContributors', () => {
    it('should fetch top contributors for a candidate', async () => {
      const mockResponse = {
        results: [
          {
            contributor_name: 'ACTBLUE',
            contributor_type: 'individual',
            total: 1500000,
            count: 15000,
          },
          {
            contributor_name: 'UNIVERSITY OF CALIFORNIA',
            contributor_type: 'individual',
            total: 50000,
            count: 150,
          },
        ],
        pagination: {
          count: 2,
          page: 1,
          pages: 1,
          per_page: 10,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTopContributors('H0NY15088', 2024, 10);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('ACTBLUE');
      expect(result[0].total).toBe(1500000);
      expect(result[0].type).toBe('individual');
    });

    it('should return empty array on error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Not found',
      });

      const result = await getTopContributors('INVALID');
      expect(result).toEqual([]);
    });
  });

  describe('getDonorBreakdown', () => {
    it('should calculate donor breakdown with percentages', async () => {
      // Mock getCandidateFinancials
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [
              {
                cycle: 2024,
                receipts: 5000000,
                individual_contributions: 4000000,
                other_political_committee_contributions: 500000,
                individual_itemized_contributions: 3000000,
                individual_unitemized_contributions: 1000000,
              },
            ],
            pagination: { count: 1, page: 1, pages: 1, per_page: 20 },
          }),
        })
        // Mock getTopContributors
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [
              {
                contributor_name: 'ACTBLUE',
                total: 1500000,
                count: 10000,
              },
            ],
            pagination: { count: 1, page: 1, pages: 1, per_page: 10 },
          }),
        });

      const result = await getDonorBreakdown('H0NY15088', 2024);

      expect(result).toBeDefined();
      expect(result?.total_raised).toBe(5000000);
      expect(result?.pac_total).toBe(500000);
      expect(result?.pac_percentage).toBe(10); // 500k / 5M = 10%
      expect(result?.small_donor_total).toBe(1000000);
      expect(result?.small_donor_percentage).toBe(20); // 1M / 5M = 20%
      expect(result?.top_contributors).toHaveLength(1);
    });

    it('should return null when financials unavailable', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [],
          pagination: { count: 0, page: 1, pages: 0, per_page: 20 },
        }),
      });

      const result = await getDonorBreakdown('INVALID');
      expect(result).toBeNull();
    });
  });

  describe('getMemberFECData', () => {
    it('should fetch both candidate and financial data', async () => {
      // Mock searchCandidateByName
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [
              {
                candidate_id: 'H0NY15088',
                name: 'OCASIO-CORTEZ, ALEXANDRIA',
                office: 'H',
              },
            ],
            pagination: { count: 1, page: 1, pages: 1, per_page: 5 },
          }),
        })
        // Mock getCandidateFinancials
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [
              {
                cycle: 2024,
                receipts: 5000000,
                individual_contributions: 4000000,
              },
            ],
            pagination: { count: 1, page: 1, pages: 1, per_page: 20 },
          }),
        });

      const result = await getMemberFECData('Alexandria', 'Ocasio-Cortez', 'house');

      expect(result.candidate).toBeDefined();
      expect(result.financials).toBeDefined();
      expect(result.candidate?.candidate_id).toBe('H0NY15088');
      expect(result.financials?.total_receipts).toBe(5000000);
    });

    it('should handle missing candidate gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [],
          pagination: { count: 0, page: 1, pages: 0, per_page: 5 },
        }),
      });

      const result = await getMemberFECData('NonExistent', 'Candidate', 'house');

      expect(result.candidate).toBeNull();
      expect(result.financials).toBeNull();
    });
  });

  describe('Caching', () => {
    it('should cache API responses', async () => {
      const mockResponse = {
        results: [{ candidate_id: 'TEST123' }],
        pagination: { count: 1, page: 1, pages: 1, per_page: 5 },
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      // First call
      await searchCandidateByName('Test', 'User', 'H');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await searchCandidateByName('Test', 'User', 'H');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still only 1 call
    });

    it('should clear cache when requested', async () => {
      const mockResponse = {
        results: [{ candidate_id: 'TEST123' }],
        pagination: { count: 1, page: 1, pages: 1, per_page: 5 },
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchCandidateByName('Test', 'User', 'H');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      clearFECCache();

      await searchCandidateByName('Test', 'User', 'H');
      expect(global.fetch).toHaveBeenCalledTimes(2); // Cache cleared, new fetch
    });
  });
});
