/**
 * Fetch congressional stock trades from Quiver Quant API
 * 
 * API Docs: https://api.quiverquant.com/docs
 * Requires paid API key ($10/month)
 * 
 * Data includes:
 * - Stock ticker and company
 * - Transaction type (Purchase/Sale)
 * - Trade size in USD
 * - Filing date vs trade date
 * - Excess return vs market
 */

const QUIVER_API_BASE = "https://api.quiverquant.com/beta";
const API_KEY = process.env.QUIVER_API_KEY;

export interface StockTrade {
  ticker: string;
  company: string | null;
  tradedDate: string;
  filedDate: string;
  transaction: "Purchase" | "Sale";
  tradeSizeUsd: number;
  bioguideId: string;
  name: string;
  party: string;
  chamber: string;
  excessReturn: number | null;
}

interface QuiverTradeResponse {
  Ticker: string;
  Company: string | null;
  Traded: string;
  Filed: string;
  Transaction: string;
  Trade_Size_USD: string;
  BioGuideID: string;
  Name: string;
  Party: string;
  Chamber: string;
  excess_return: string | null;
}

async function fetchWithAuth(url: string): Promise<Response> {
  if (!API_KEY) {
    throw new Error("QUIVER_API_KEY environment variable required");
  }

  return fetch(url, {
    headers: {
      "Authorization": `Token ${API_KEY}`,
    },
  });
}

/**
 * Fetch all congressional trades since a given date
 */
export async function fetchCongressTrades(sinceDate?: string): Promise<StockTrade[]> {
  console.log("Fetching congressional stock trades from Quiver...");
  
  let url = `${QUIVER_API_BASE}/bulk/congresstrading`;
  if (sinceDate) {
    url += `?traded_gte=${sinceDate}`;
  }

  const response = await fetchWithAuth(url);

  if (!response.ok) {
    throw new Error(`Quiver API error: ${response.status} ${response.statusText}`);
  }

  const data: QuiverTradeResponse[] = await response.json();
  console.log(`✓ Got ${data.length} trades from Quiver`);

  return data.map(transformTrade);
}

/**
 * Fetch trades for a specific member by bioguide ID
 */
export async function fetchMemberTrades(bioguideId: string): Promise<StockTrade[]> {
  const url = `${QUIVER_API_BASE}/historical/congresstrading/${bioguideId}`;
  
  const response = await fetchWithAuth(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      return []; // No trades found for this member
    }
    throw new Error(`Quiver API error: ${response.status}`);
  }

  const data: QuiverTradeResponse[] = await response.json();
  return data.map(transformTrade);
}

/**
 * Transform Quiver API response to our schema
 */
function transformTrade(raw: QuiverTradeResponse): StockTrade {
  return {
    ticker: raw.Ticker,
    company: raw.Company,
    tradedDate: raw.Traded,
    filedDate: raw.Filed,
    transaction: raw.Transaction as "Purchase" | "Sale",
    tradeSizeUsd: parseFloat(raw.Trade_Size_USD) || 0,
    bioguideId: raw.BioGuideID,
    name: raw.Name,
    party: raw.Party,
    chamber: raw.Chamber,
    excessReturn: raw.excess_return ? parseFloat(raw.excess_return) : null,
  };
}

/**
 * Get trade summary stats for a member
 */
export function getTradeStats(trades: StockTrade[]) {
  const purchases = trades.filter(t => t.transaction === "Purchase");
  const sales = trades.filter(t => t.transaction === "Sale");
  
  const totalPurchaseValue = purchases.reduce((sum, t) => sum + t.tradeSizeUsd, 0);
  const totalSaleValue = sales.reduce((sum, t) => sum + t.tradeSizeUsd, 0);
  
  // Group by ticker
  const tickerCounts = trades.reduce((acc, t) => {
    acc[t.ticker] = (acc[t.ticker] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTickers = Object.entries(tickerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ticker, count]) => ({ ticker, count }));
  
  // Calculate average excess return
  const tradesWithReturn = trades.filter(t => t.excessReturn !== null);
  const avgExcessReturn = tradesWithReturn.length > 0
    ? tradesWithReturn.reduce((sum, t) => sum + (t.excessReturn || 0), 0) / tradesWithReturn.length
    : null;
  
  return {
    totalTrades: trades.length,
    purchases: purchases.length,
    sales: sales.length,
    totalPurchaseValue: Math.round(totalPurchaseValue),
    totalSaleValue: Math.round(totalSaleValue),
    topTickers,
    avgExcessReturn: avgExcessReturn ? Math.round(avgExcessReturn * 100) / 100 : null,
  };
}

// Run directly for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!API_KEY) {
    console.error("Set QUIVER_API_KEY to test");
    process.exit(1);
  }

  fetchCongressTrades("2024-01-01")
    .then(trades => {
      console.log(`\nFetched ${trades.length} trades since 2024-01-01`);
      if (trades[0]) {
        console.log("\nSample trade:");
        console.log(JSON.stringify(trades[0], null, 2));
      }
      
      // Test stats
      const stats = getTradeStats(trades);
      console.log("\nOverall stats:");
      console.log(JSON.stringify(stats, null, 2));
    })
    .catch(console.error);
}
