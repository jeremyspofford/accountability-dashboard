# Data Integration Documentation

## Overview

The Rep Accountability Dashboard integrates data from multiple sources to provide comprehensive analysis of congressional representatives. This document outlines the data sources, implementation, and usage.

## Data Sources

### 1. **OpenFEC (Federal Election Commission)**
- **Status:** ✅ Implemented
- **Purpose:** Campaign finance data, donor information
- **API Key Required:** Yes (stored in `.env` as `FEC_API_KEY`)
- **Features:**
  - Candidate financial summaries
  - Donor breakdowns (PAC vs individual vs small donors)
  - Top contributors list
  - Small donor percentage (≤$200)

### 2. **Congress.gov API**
- **Status:** ✅ Implemented (via pipeline)
- **Purpose:** Legislative activity, bills, voting records
- **API Key Required:** Yes (stored in `.env` as `CONGRESS_API_KEY`)
- **Features:**
  - Bills sponsored
  - Bills cosponsored
  - Voting records

### 3. **Voteview**
- **Status:** ✅ Implemented (via pipeline)
- **Purpose:** Ideological scoring, party loyalty
- **API Key Required:** No (public data)
- **Features:**
  - Party alignment percentage
  - Ideology scores
  - Voting independence metrics

### 4. **Stock Trading Data**
- **Status:** 🟡 Stub implemented, awaiting integration
- **Purpose:** Congressional stock trading activity
- **Data Sources:**
  - House: https://disclosures-clerk.house.gov/FinancialDisclosure
  - Senate: https://efdsearch.senate.gov/
  - Quiver Quantitative (paid API): https://www.quiverquant.com/
  - Capitol Trades (scraping): https://www.capitoltrades.com/
- **Features (planned):**
  - Trade disclosure tracking
  - Conflict of interest detection
  - Committee correlation
  - Trade timing analysis

## Implementation

### File Structure

```
src/lib/
├── types.ts              # TypeScript interfaces for all data types
├── fec.ts                # OpenFEC API client
├── scoring.ts            # Corruption scoring algorithm
├── stock-trades.ts       # Stock trading data (stub)
├── data.ts               # Static member data loading
├── data-fetcher.ts       # Data enrichment and integration
└── tests/
    ├── fec.test.ts       # FEC integration tests
    ├── scoring.test.ts   # Scoring algorithm tests
    └── data.test.ts      # Data loading tests
```

### Corruption Scoring Algorithm

The corruption score is calculated using weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Donor Influence** | 35% | PAC money ratio, large donor dependency |
| **Voting Independence** | 30% | Deviation from party line voting |
| **Financial Transparency** | 25% | Disclosure compliance, timeliness |
| **Wealth Growth** | 10% | Suspicious net worth increases |

**Scoring:**
- **A (90-100):** High integrity, minimal corruption risk
- **B (80-89):** Good, above average
- **C (70-79):** Average, some concerns
- **D (60-69):** Below average, significant concerns
- **F (<60):** Poor, high corruption risk

### Donor Influence Calculation

```typescript
// PAC contributions are weighted more heavily than individual donors
const influence = (pacPct * 1.5) + (largeDonorPct * 0.8) - (smallDonorPct * 0.3);
```

- **0-30:** Grassroots funded, low influence
- **30-60:** Balanced funding
- **60-100:** Corporate/PAC dominated, high influence

### Voting Independence Calculation

```typescript
// Maximum independence at 50% party alignment
const distanceFrom50 = Math.abs(50 - partyAlignmentPct);
const independence = 100 - (distanceFrom50 * 2);
```

- **100% or 0% party alignment = 0 independence** (always votes with/against party)
- **50% party alignment = 100 independence** (truly independent thinker)

## Usage

### Basic FEC Data Fetching

```typescript
import { getMemberFECData, getDonorBreakdown } from '@/lib/fec';

// Fetch candidate and financial data
const { candidate, financials } = await getMemberFECData(
  'Alexandria',
  'Ocasio-Cortez',
  'house'
);

// Get detailed donor breakdown
if (candidate) {
  const breakdown = await getDonorBreakdown(candidate.candidate_id);
  console.log(`PAC %: ${breakdown.pac_percentage}%`);
  console.log(`Small Donor %: ${breakdown.small_donor_percentage}%`);
  console.log(`Top Contributors:`, breakdown.top_contributors);
}
```

### Enriching Member Data

```typescript
import { enrichMemberWithFECData } from '@/lib/data-fetcher';
import { getMembers } from '@/lib/data';

// Get a member
const members = getMembers();
const member = members[0];

// Enrich with real FEC data
const enrichedMember = await enrichMemberWithFECData(member);

console.log(`Corruption Grade: ${enrichedMember.corruption_grade}`);
console.log(`Corruption Score: ${enrichedMember.corruption_score}`);
console.log(`Donor Influence: ${enrichedMember.corruption_factors.donorInfluence}`);
console.log(`Total Raised: $${enrichedMember.total_raised.toLocaleString()}`);
```

### Batch Enrichment (Rate Limited)

```typescript
import { enrichMembersBatch } from '@/lib/data-fetcher';

// Enrich multiple members with automatic rate limiting
const enrichedMembers = await enrichMembersBatch(members, {
  maxConcurrent: 5,  // Process 5 at a time
  delayMs: 200,      // 200ms delay between batches
});
```

### Corruption Summary Statistics

```typescript
import { getCorruptionSummary, sortByCorruptionScore } from '@/lib/data-fetcher';

const summary = getCorruptionSummary(enrichedMembers);

console.log(`Total Members: ${summary.total_members}`);
console.log(`Grade Distribution:`, summary.grade_distribution);
console.log(`Average Score: ${summary.average_score}`);
console.log(`Most Corrupt:`, summary.most_corrupt.slice(0, 5));
console.log(`Least Corrupt:`, summary.least_corrupt.slice(0, 5));
```

## Caching

All API responses are cached in-memory with a 5-minute TTL to reduce API calls and improve performance.

```typescript
import { clearFECCache } from '@/lib/fec';

// Clear cache to force fresh data
clearFECCache();
```

## Error Handling

All API functions return `ApiResponse<T>` objects:

```typescript
const response = await getMemberStockTrades(bioguideId);

if (response.success) {
  console.log('Trades:', response.data);
} else {
  console.error('Error:', response.error);
}
```

## Testing

Run the test suite:

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage

# Watch mode
npm test
```

### Test Coverage

- ✅ FEC integration (13 tests)
- ✅ Corruption scoring (16 tests)
- ✅ Data loading (25 tests)
- ✅ UI components (10 tests)

**Total: 64 tests passing**

## API Rate Limits

- **OpenFEC:** 1,000 requests/hour (unauthenticated), 120 requests/min (authenticated)
- **Congress.gov:** Unknown (reasonable use)

The implementation includes automatic rate limiting via batch processing and caching to stay within limits.

## Environment Variables

Create a `.env` file in the project root:

```bash
# OpenFEC API Key (required)
FEC_API_KEY=your_fec_api_key_here

# Congress.gov API Key (required)
CONGRESS_API_KEY=your_congress_api_key_here
```

Get API keys:
- **OpenFEC:** https://api.open.fec.gov/developers/
- **Congress.gov:** https://api.congress.gov/sign-up/

## Future Enhancements

### Stock Trading Integration
- [ ] Implement House disclosure PDF scraper
- [ ] Implement Senate disclosure scraper
- [ ] Integrate Quiver Quantitative API (if budget allows)
- [ ] Build conflict detection algorithm
- [ ] Track stock performance post-trade

### Additional Data Sources
- [ ] OpenSecrets API (detailed lobbying data)
- [ ] ProPublica Congress API (additional vote data)
- [ ] Net worth tracking database
- [ ] Committee assignment history

### Performance
- [ ] Implement persistent caching (Redis or file-based)
- [ ] Add background job for batch member enrichment
- [ ] Implement incremental updates vs full refresh

## Contributing

When adding new data sources:

1. Define TypeScript interfaces in `src/lib/types.ts`
2. Create API client in `src/lib/{source}.ts`
3. Add integration to `src/lib/data-fetcher.ts`
4. Write tests in `src/lib/{source}.test.ts`
5. Update this documentation

## License

Data sourced from public APIs and government databases. All data is used in compliance with respective API terms of service.

---

**Last Updated:** 2026-02-04
**Status:** ✅ FEC Integration Complete | 🟡 Stock Trading Stub | 📋 Additional Sources Planned
