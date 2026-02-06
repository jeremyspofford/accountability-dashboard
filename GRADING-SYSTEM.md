# Grading System Documentation

## Overview

The accountability grading system evaluates members of Congress on four key pillars of accountability. Each member receives an overall grade (A-F) based on weighted scores across these dimensions.

## Grade Factors

### 1. Donor Influence Score (Default Weight: 25%)

**What it measures:** Financial independence from special interests

**Calculation:**
- Based on PAC percentage and large donor percentage from campaign finance data
- Score = 100 - average(PAC%, large donor%)
- Higher PAC/large donor dependence = lower score

**Rationale:** High reliance on PAC money and large donors suggests greater vulnerability to special interest influence.

**Score Ranges:**
- 90-100: Excellent transparency, low special interest funding
- 70-89: Moderate reliance on special interests
- <70: High dependence on special interests

---

### 2. Voting Accountability Score (Default Weight: 25%)

**What it measures:** Participation, consistency, and alignment with public interest

**Calculation:**
- Participation rate (40%): Percentage of key votes attended
- Party loyalty (10%): Consistency with party positions
- Public interest alignment (50%): Inverse of votes against public interest

**Rationale:** Members should show up for important votes, maintain consistent positions, and prioritize public interest over special interests. Public interest alignment is weighted highest as it's the most critical factor.

**Score Ranges:**
- 90-100: Strong voting record with consistent participation
- 70-89: Moderate accountability with some concerns
- <70: Concerning voting patterns or poor attendance

---

### 3. Trading Ethics Score (Default Weight: 25%)

**What it measures:** Stock trading ethics and potential conflicts of interest

**Calculation:**
- Flag rate (50%): Percentage of trades flagged as suspicious
- Average risk per trade (30%): Risk score normalized (0-5 scale)
- Overall suspicion level (20%): Categorical assessment (none/low/medium/high)

**Rationale:** High flag rates and risk scores indicate potential insider trading or conflicts of interest.

**Score Ranges:**
- 90-100: No trades or very low suspicious activity
- 70-89: Low trading concerns
- 50-69: Moderate trading concerns
- <50: Serious trading ethics concerns

**Special case:** Members with zero trades receive a perfect score (100).

---

### 4. Disclosure Compliance Score (Default Weight: 25%)

**What it measures:** Transparency through timely financial disclosures

**Calculation:**
- Filing completeness (40%): Percentage of expected filings completed
- Timeliness (40%): Inverse of late filing percentage
- Missing filing penalty (20%): Double penalty for missing required filings

**Rationale:** Timely and complete financial disclosures are essential for transparency and public accountability.

**Score Ranges:**
- 90-100: Excellent compliance, all filings on time
- 70-89: Moderate compliance with some late filings
- <70: Poor compliance with missing or late filings

---

## Overall Grade Calculation

The overall score is a weighted average of the four factor scores:

```
Overall = (Donor × 0.25) + (Voting × 0.25) + (Trading × 0.25) + (Disclosure × 0.25)
```

### Letter Grades
- **A:** 90-100 — Excellent accountability
- **B:** 80-89 — Good accountability
- **C:** 70-79 — Average accountability
- **D:** 60-69 — Below average accountability
- **F:** 0-59 — Poor accountability

---

## Configurable Weights

The grading system supports custom weight configurations for different accountability priorities:

```typescript
const customWeights: GradeWeights = {
  donor: 0.3,      // 30% weight on donor influence
  voting: 0.3,     // 30% weight on voting record
  trading: 0.3,    // 30% weight on trading ethics
  disclosure: 0.1, // 10% weight on disclosures
};

const grade = calculateGrade(memberData, customWeights);
```

**Requirements:**
- All weights must be between 0 and 1
- Weights must sum to exactly 1.0

---

## Grade Explanations

Each grade includes detailed explanations for all four factors:

```typescript
{
  overall: 85.5,
  letter: 'B',
  breakdown: {
    donorScore: 92.0,
    votingScore: 88.0,
    tradingScore: 75.0,
    disclosureScore: 87.0
  },
  explanation: {
    donor: "Excellent funding transparency with 8.0% from PACs and 8.0% from large donors.",
    voting: "Strong voting record: 96.0% participation in key votes with consistent alignment.",
    trading: "Low trading concerns: 3/12 trades flagged (25.0%).",
    disclosure: "Moderate compliance: 5/5 filings, 1 late."
  }
}
```

---

## Data Sources

### Current Implementation

1. **finance.json** — Campaign finance data (PAC and donor percentages)
2. **key-votes.json** — Voting records with "who benefits" analysis
3. **trades-by-member.json** — Individual stock trades
4. **trading-summaries.json** — Aggregated trading statistics with flags
5. **house-disclosures.json** — Financial disclosure filings

### Default Behavior

When data is unavailable for a factor, a neutral score of 70 is assigned to avoid penalizing members for missing data.

---

## Future Enhancements

### Planned Improvements
1. **Real-time data updates** — Integrate with live APIs for current trades and disclosures
2. **Historical tracking** — Show grade trends over time
3. **Comparative analysis** — Compare members against district/state averages
4. **Weighted voting** — Give more weight to consequential legislation
5. **Industry-specific conflicts** — Flag trades in industries affected by member's committee assignments

### Additional Factors Under Consideration
- Constituent service responsiveness
- Town hall/public engagement frequency
- Bill sponsorship and effectiveness
- Earmark transparency
- Lobbyist meeting disclosures

---

## Testing

The grading system includes comprehensive test coverage:

- 38 unit tests covering all calculation logic
- Edge case handling (missing data, null values, boundary conditions)
- Custom weight validation
- Explanation generation
- Integration with full test suite (315 total tests)

Run tests:
```bash
npm run test:run -- src/lib/grading.test.ts
```

---

## Usage Example

```typescript
import { calculateGrade, type MemberData } from '@/lib/grading';

const memberData: MemberData = {
  pac_percentage: 35,
  large_donor_percentage: 45,
  voting_record: {
    key_votes_participated: 48,
    key_votes_total: 50,
    votes_with_party: 44,
    votes_against_public_interest: 3,
  },
  trading_summary: {
    total_trades: 25,
    flagged_trades: 8,
    flag_rate: 32,
    total_risk_score: 20,
    avg_risk_per_trade: 0.8,
    overall_suspicion_level: 'medium',
  },
  disclosure_compliance: {
    filings_count: 5,
    expected_filings: 5,
    late_filings: 1,
    missing_filings: 0,
  },
};

const grade = calculateGrade(memberData);

console.log(`Overall Grade: ${grade.letter} (${grade.overall})`);
console.log('Breakdown:', grade.breakdown);
console.log('Explanations:', grade.explanation);
```

---

## Version History

### v2.0 (2026-02-06)
- ✅ Multi-factor grading system with four accountability pillars
- ✅ Configurable weights for custom priorities
- ✅ Detailed explanations for each grade factor
- ✅ Comprehensive test coverage (38 tests)
- ✅ Documentation of methodology and rationale

### v1.0 (Initial)
- Basic donor influence scoring
- Placeholder scores for other factors
- Equal weighting (25% each)

---

## Credits

**Development:** Nova (AI Assistant)  
**Methodology:** Based on common government accountability metrics  
**Data Sources:** OpenSecrets, Congress.gov, House Clerk financial disclosures  
**License:** MIT
