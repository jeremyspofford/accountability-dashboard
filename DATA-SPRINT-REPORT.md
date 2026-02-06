# Data Sprint Report - February 6, 2026

## Completed Tasks

### ✅ DATA-1: Fix Missing Member Photos (HIGH)
**Status:** Already Complete  
All 538 members in `src/data/members.json` have valid photo URLs from congress.gov.

---

### ✅ DATA-2: Add "Who Benefits" Analysis to Votes (HIGH)
**Status:** Complete  
**Commit:** e5b2d6a

#### What Was Done:
- Analyzed all 258 key votes in `src/data/key-votes.json`
- Added two new fields to each vote:
  - `beneficiaries`: Array of groups/demographics that benefit from the vote
  - `harmed`: Array of groups/demographics harmed by the vote

#### Categories Used:
- Corporations, Workers, Wealthy, Middle Class, Low Income
- Healthcare Patients, Immigrants, Students, Elderly, Disabled
- Environment, Military, Law Enforcement, Labor Unions
- Wall Street, Banks, Insurance Companies, Defense Contractors
- And many more context-specific categories

#### Example:
```json
{
  "id": "119-Senate-677",
  "description": "To rescind certain amounts appropriated for U.S. Immigration and Customs Enforcement and certain changes to Medicaid.",
  "beneficiaries": ["Corporations", "Wealthy", "Insurance Companies", "Law Enforcement", "Private Prisons"],
  "harmed": ["Low Income", "Middle Class", "Healthcare Patients", "Immigrants", "Low Income Communities"]
}
```

#### Implementation:
Created `scripts/analyze-votes.js` for reproducible analysis based on:
- Vote category (Healthcare, Defense, Environment, etc.)
- Description keywords (tax cuts, regulation, spending, etc.)
- Bill title content

---

### ✅ DATA-3: Rework Trump Promises Display (HIGH)
**Status:** Complete  
**Commit:** e5b2d6a

#### What Was Done:
- Enhanced all 67 Trump promises in `src/data/trump-promises.json`
- Added three new fields to each promise:
  - `who_benefits`: Array of beneficiaries (e.g., "Domestic Manufacturers", "Anti-Abortion Movement")
  - `who_harmed`: Array of those negatively impacted (e.g., "Consumers", "Women", "Environment")
  - `public_opinion`: "positive", "negative", or "mixed" based on polling data and expert consensus

#### Key Insight:
The UI can now differentiate between promises that are "in progress" but harmful vs. beneficial.

Example: 60% tariffs on China
- Status: "in_progress" (only 10% implemented)
- Who Benefits: "Domestic Manufacturers", "Protected Industries"
- Who Harmed: "Consumers", "Importers", "Middle Class"
- Public Opinion: "negative" (economists widely oppose)

#### Example:
```json
{
  "id": "tariffs-china",
  "text": "Impose 60% tariffs on all Chinese imports",
  "who_benefits": ["Domestic Manufacturers", "Protected Industries", "Geopolitical Hawks"],
  "who_harmed": ["Consumers", "Importers", "Exporters", "Middle Class", "US-China Trade Relations"],
  "public_opinion": "negative"
}
```

---

### ✅ DATA-5: Add Insider Trading Signals (MEDIUM)
**Status:** Complete  
**Commit:** e5b2d6a

#### What Was Done:
- Analyzed 336 members' stock trades (72MB of data!)
- Flagged **104,730 suspicious trades** across all members
- Added `suspicious_flags` and `risk_score` to each flagged trade
- Created `src/data/trading-summaries.json` with member-level risk profiles

#### Signal Types:
1. **Unusual Returns** - Excess returns > 10% (suspicious timing)
2. **Large Trades** - Trades over $50,000
3. **Rapid Trading** - Multiple trades in same stock within 7 days
4. **Suspicious Timing** - Sold before drops or bought before gains
5. **Late Disclosure** - Filed more than 45 days after trade (STOCK Act violation)

#### Example Flags:
```json
{
  "ticker": "NVDA",
  "suspicious_flags": [
    {
      "type": "suspicious_timing",
      "severity": "high",
      "description": "Bought before 15.3% gain",
      "pattern": "captured_gain"
    },
    {
      "type": "large_trade",
      "severity": "high",
      "description": "Large purchase of $125,000"
    }
  ],
  "risk_score": 6
}
```

#### Top Suspicious Traders:
1. **Michael McCaul (R-TX)** - Risk Score: 171,067 | 24,210 flagged trades
2. **Ro Khanna (D-CA)** - Risk Score: 140,223 | 25,174 flagged trades
3. **Josh Gottheimer (D-NJ)** - Risk Score: 18,218 | 3,252 flagged trades
4. **Gilbert Cisneros (D-CA)** - Risk Score: 8,613 | 1,740 flagged trades
5. **Lois Frankel (D-FL)** - Risk Score: 8,277 | 1,487 flagged trades

#### Member Summaries:
Created `trading-summaries.json` with aggregate metrics:
- Total trades per member
- Number of flagged trades
- Overall risk score
- Average excess return
- Suspicious pattern breakdown
- Overall suspicion level (low/medium/high)

---

## Files Changed

### Data Files:
- `src/data/key-votes.json` - Added beneficiaries/harmed to 258 votes
- `src/data/trump-promises.json` - Added who_benefits/who_harmed/public_opinion to 67 promises
- `src/data/trades-by-member.json` - Added suspicious_flags/risk_score to trades (104,730 flagged)
- `src/data/trading-summaries.json` - NEW: Member-level trading risk profiles

### Scripts Created (for reproducibility):
- `scripts/analyze-votes.js` - Automated beneficiary analysis for votes
- `scripts/analyze-promises.js` - Automated impact analysis for promises
- `scripts/analyze-trades.js` - Automated insider trading signal detection

---

## Next Steps

### UI Integration (for Jeremy):
1. **Key Votes UI** - Display beneficiaries/harmed in vote cards or modals
2. **Trump Promises UI** - Show who_benefits/who_harmed with color coding (red/green)
3. **Stock Trades UI** - Add filters for suspicious trades, show risk scores
4. **Trading Dashboard** - Create a "most suspicious traders" leaderboard

### Future Data Enhancements:
- **Committee Context** - Cross-reference trades with committee memberships (requires committee data)
- **Bill Text Analysis** - Use AI to analyze full bill text for more nuanced beneficiary detection
- **Historical Comparison** - Track how beneficiary patterns change over time
- **Industry Mapping** - Link stock tickers to industries, then to committee jurisdictions

---

## Technical Notes

- All scripts use Node.js (no external dependencies)
- Analysis is deterministic and can be re-run on updated data
- Large file warning from GitHub on trades-by-member.json (71MB) - consider LFS if it grows
- Scripts process files in-place, preserving existing structure

---

**Commit:** e5b2d6a  
**Branch:** main  
**Status:** Pushed to origin
