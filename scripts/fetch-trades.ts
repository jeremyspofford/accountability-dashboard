/**
 * Fetch stock trades from Quiver Quant API
 * Usage: QUIVER_API_KEY=xxx npx tsx scripts/fetch-trades.ts
 */
import * as fs from 'fs';

const API_KEY = process.env.QUIVER_API_KEY;

async function main() {
  if (!API_KEY) {
    console.error('QUIVER_API_KEY required');
    process.exit(1);
  }

  console.log('Fetching trades from Quiver (since 2024-01-01)...');
  
  const response = await fetch(
    'https://api.quiverquant.com/beta/bulk/congresstrading?traded_gte=2024-01-01',
    {
      headers: { 'Authorization': `Token ${API_KEY}` }
    }
  );

  if (!response.ok) {
    console.error(`API error: ${response.status}`);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`Got ${data.length} trades`);

  // Save raw data
  fs.writeFileSync('src/data/trades.json', JSON.stringify(data, null, 2));
  console.log('Saved to src/data/trades.json');

  // Group by bioguide_id for quick lookup
  const byMember: Record<string, any[]> = {};
  for (const trade of data) {
    const id = trade.BioGuideID;
    if (!byMember[id]) byMember[id] = [];
    byMember[id].push({
      ticker: trade.Ticker,
      company: trade.Company,
      tradedDate: trade.Traded,
      filedDate: trade.Filed,
      transaction: trade.Transaction,
      tradeSizeUsd: parseFloat(trade.Trade_Size_USD) || 0,
      excessReturn: trade.excess_return ? parseFloat(trade.excess_return) : null,
    });
  }

  fs.writeFileSync('src/data/trades-by-member.json', JSON.stringify(byMember, null, 2));
  console.log(`Saved trades-by-member.json (${Object.keys(byMember).length} members with trades)`);
}

main().catch(console.error);
