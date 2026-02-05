/**
 * Congressional Stock Trading Data Integration
 * 
 * Data Sources:
 * - House: https://disclosures-clerk.house.gov/FinancialDisclosure
 * - Senate: https://efdsearch.senate.gov/
 * - Quiver Quantitative API (paid): https://www.quiverquant.com/
 * - Capitol Trades: https://www.capitoltrades.com/
 * 
 * TODO: Implement full integration when API access is available
 */

import type {
  StockTrade,
  StockTradeWithContext,
  ApiResponse,
  CacheEntry,
} from './types';

// In-memory cache
const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_CACHE_TTL = 60 * 60 * 1000; // 1 hour (stock data doesn't change frequently)

/**
 * Parse amount range string to min/max values
 * e.g., "$15,001 - $50,000" => { min: 15001, max: 50000 }
 */
function parseAmountRange(range: string): { min: number; max: number } | null {
  // Match patterns like "$1,001 - $15,000" or "$50,001 - $100,000"
  const match = range.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
  if (!match) return null;

  const min = parseInt(match[1].replace(/,/g, ''), 10);
  const max = parseInt(match[2].replace(/,/g, ''), 10);

  return { min, max };
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get stock trades for a specific member
 * 
 * @param bioguideId - Member's Bioguide ID
 * @param options - Optional filters (date range, ticker, transaction type)
 * @returns Array of stock trades
 */
export async function getMemberStockTrades(
  bioguideId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    ticker?: string;
    transactionType?: 'purchase' | 'sale';
  }
): Promise<ApiResponse<StockTrade[]>> {
  // TODO: Implement actual API integration
  // For now, return mock data structure
  
  console.warn('Stock trading data not yet integrated - returning mock data');
  
  return {
    success: true,
    data: [],
  };
}

/**
 * Get stock trades with additional context (committees, conflicts, etc.)
 */
export async function getMemberStockTradesWithContext(
  bioguideId: string,
  options?: {
    startDate?: string;
    endDate?: string;
  }
): Promise<ApiResponse<StockTradeWithContext[]>> {
  const tradesResponse = await getMemberStockTrades(bioguideId, options);
  
  if (!tradesResponse.success || !tradesResponse.data) {
    return tradesResponse as ApiResponse<StockTradeWithContext[]>;
  }

  // Enhance trades with context
  const tradesWithContext: StockTradeWithContext[] = tradesResponse.data.map(trade => {
    const range = parseAmountRange(trade.amount_range);
    const daysToDisclosure = daysBetween(trade.transaction_date, trade.disclosure_date);
    
    return {
      ...trade,
      estimated_amount_min: range?.min,
      estimated_amount_max: range?.max,
      days_to_disclosure: daysToDisclosure,
      // TODO: Add committee context
      relevant_committees: [],
      // TODO: Add stock performance tracking
      price_change_30d: undefined,
      price_change_90d: undefined,
      // TODO: Add conflict detection
      conflict_flags: [],
    };
  });

  return {
    success: true,
    data: tradesWithContext,
  };
}

/**
 * Get aggregate statistics for a member's trading activity
 */
export async function getMemberTradingStats(
  bioguideId: string
): Promise<ApiResponse<{
  total_trades: number;
  total_purchases: number;
  total_sales: number;
  estimated_total_volume: { min: number; max: number };
  avg_days_to_disclosure: number;
  conflict_count: number;
}>> {
  const tradesResponse = await getMemberStockTradesWithContext(bioguideId);
  
  if (!tradesResponse.success || !tradesResponse.data) {
    return {
      success: false,
      error: tradesResponse.error,
    };
  }

  const trades = tradesResponse.data;
  const purchases = trades.filter(t => t.transaction_type === 'purchase');
  const sales = trades.filter(t => t.transaction_type === 'sale');
  
  // Calculate aggregate stats
  let totalMinVolume = 0;
  let totalMaxVolume = 0;
  let totalDaysToDisclosure = 0;
  let conflictCount = 0;

  trades.forEach(trade => {
    if (trade.estimated_amount_min) totalMinVolume += trade.estimated_amount_min;
    if (trade.estimated_amount_max) totalMaxVolume += trade.estimated_amount_max;
    if (trade.days_to_disclosure) totalDaysToDisclosure += trade.days_to_disclosure;
    if (trade.conflict_flags && trade.conflict_flags.length > 0) conflictCount++;
  });

  return {
    success: true,
    data: {
      total_trades: trades.length,
      total_purchases: purchases.length,
      total_sales: sales.length,
      estimated_total_volume: {
        min: totalMinVolume,
        max: totalMaxVolume,
      },
      avg_days_to_disclosure: trades.length > 0 ? Math.round(totalDaysToDisclosure / trades.length) : 0,
      conflict_count: conflictCount,
    },
  };
}

/**
 * Detect potential conflicts of interest
 * Correlates trades with committee memberships and relevant legislation
 */
export function detectTradingConflicts(
  trades: StockTradeWithContext[],
  committees: string[]
): string[] {
  const conflicts: string[] = [];

  for (const trade of trades) {
    // Check for late disclosure (>45 days is legally required)
    if (trade.days_to_disclosure && trade.days_to_disclosure > 45) {
      conflicts.push(`Late disclosure: ${trade.days_to_disclosure} days for ${trade.ticker}`);
    }

    // TODO: Check if trade is in sector relevant to committee assignments
    // TODO: Check if trade occurred near committee hearings or votes
    // TODO: Check unusual trading volume or patterns
  }

  return conflicts;
}

/**
 * Clear the stock trading data cache
 */
export function clearStockTradeCache(): void {
  cache.clear();
}

/**
 * Integration Status
 */
export const STOCK_TRADE_INTEGRATION = {
  enabled: false,
  sources: {
    house_disclosures: {
      url: 'https://disclosures-clerk.house.gov/FinancialDisclosure',
      status: 'not_implemented',
    },
    senate_disclosures: {
      url: 'https://efdsearch.senate.gov/',
      status: 'not_implemented',
    },
    quiver_quantitative: {
      url: 'https://www.quiverquant.com/api',
      status: 'requires_api_key',
      paid: true,
    },
    capitol_trades: {
      url: 'https://www.capitoltrades.com/',
      status: 'scraping_required',
    },
  },
  notes: [
    'House and Senate publish PDF disclosures - requires parsing',
    'Quiver Quantitative has structured API but requires paid subscription',
    'Capitol Trades aggregates data but may require scraping',
    'Consider building scraper for official House/Senate sources',
  ],
};
