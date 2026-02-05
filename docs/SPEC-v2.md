# Rep Accountability Dashboard v2 — Specification

## Overview
Show transparency and corruption through **real data**, not arbitrary scores.

## Core Philosophy
Don't grade with a single number. **Show the data** and let users draw conclusions.

---

## Data Categories

### 1. 💰 Campaign Finance — "Who Funds Them?"
**Source:** OpenFEC API (we have key)

Display:
- Top 10 donors (individuals + PACs)
- Breakdown: Small donors (<$200) vs Large donors vs PACs vs Corporate
- Industry breakdown (Healthcare, Defense, Tech, Finance, etc.)
- Total raised per cycle
- Self-funded amount

**Visual:** Pie chart + donor list with amounts

---

### 2. 📊 Wealth Growth — "Did They Get Rich in Office?"
**Source:** Financial disclosures (OpenSecrets, LegiStorm)

Display:
- Net worth at start of term vs current (or most recent disclosure)
- Year-over-year chart
- Comparison to median constituent income growth
- Notable assets (stocks, real estate)

**Visual:** Line chart of wealth over time

---

### 3. 📈 Stock Trades vs Committees — "Insider Trading?"
**Source:** Capitol Trades API, House/Senate financial disclosures

Display:
- Committees they serve on
- Stock trades in industries those committees regulate
- Timeline: Trade date vs committee hearings/votes
- Flagged suspicious trades (bought before positive news, sold before negative)

**Visual:** Timeline showing trades + committee actions

---

### 4. 🗳️ Voting Record by Issue Category
**Source:** Congress.gov API, ProPublica, VoteSmart

Categories:
- Healthcare
- Environment/Climate
- Defense/Military
- Immigration
- Taxes/Economy
- Labor/Workers
- Civil Rights
- Education
- Housing
- Technology/Privacy

Display:
- How they voted on key bills in each category
- Comparison to campaign promises (if available)
- Pro-corporate vs pro-consumer stance per category

**Visual:** Category cards with vote summaries + expand for details

---

### 5. 🎯 Campaign Promises vs Votes — "Did They Keep Their Word?"
**Source:** Ballotpedia, PolitiFact, VoteSmart positions

Display:
- Stated positions during campaign
- Actual votes on those issues
- Promise kept / broken / in progress

**Visual:** Checklist with ✅ / ❌ / ⏳

---

### 6. 👥 Who Do They Represent? — "Follow the Benefits"
**Derived analysis from voting patterns**

Show who benefits from their votes:
- Corporations / Big Business
- Billionaires / Wealthy individuals
- Middle Class / Working families
- Healthcare industry vs Patients
- Banks vs Consumers
- Fossil fuels vs Clean energy

**Visual:** Horizontal bar chart showing lean toward each interest group

---

## Data Sources

| Data | Source | Status |
|------|--------|--------|
| Basic member info | Congress.gov | ✅ Have |
| Campaign finance | OpenFEC | ✅ Have key |
| Stock trades | Capitol Trades | 🔍 Need API |
| Financial disclosures | OpenSecrets | 🔍 Need API |
| Voting records | Congress.gov + ProPublica | ✅ Available |
| Bill categorization | ProPublica/VoteSmart | 🔍 Need integration |
| Campaign positions | Ballotpedia/VoteSmart | 🔍 Need integration |

---

## Scoring Philosophy

**Option A: No single grade** — Just show the data with clear visualizations

**Option B: Category grades** — Grade each area (Finance: C, Transparency: B, etc.)

**Option C: "Corruption Risk" indicators** — Flag specific red flags:
- 🚩 Large wealth increase vs salary
- 🚩 Trades in committee-regulated industries
- 🚩 >50% funding from PACs
- 🚩 Votes against campaign promises

**Recommendation:** Option C — Show red flags, not arbitrary letter grades

---

## UI Structure

### Rep Detail Page
```
┌─────────────────────────────────────────────┐
│ [Photo] Name (Party-State)                  │
│ Chamber · District · Since YYYY             │
├─────────────────────────────────────────────┤
│ 🚩 RED FLAGS (if any)                       │
│ • Wealth increased 400% since taking office │
│ • 3 stock trades flagged for timing         │
├─────────────────────────────────────────────┤
│ TABS: [Money] [Wealth] [Trades] [Votes] ... │
├─────────────────────────────────────────────┤
│ (Tab content with charts/data)              │
└─────────────────────────────────────────────┘
```

### Congress List Page
- Sortable/filterable by: State, Party, Chamber
- Quick indicators: Red flag count, top donor industry
- Search by name

---

## Implementation Phases

### Phase 1: Core Data (Week 1)
- [ ] OpenFEC integration for real campaign finance
- [ ] Display top donors + industry breakdown
- [ ] Remove fake placeholder scores

### Phase 2: Voting Analysis (Week 2)
- [ ] Categorize votes by issue area
- [ ] Build voting record display
- [ ] Key votes summary

### Phase 3: Financial Transparency (Week 3)
- [ ] Capitol Trades integration
- [ ] Wealth disclosure data
- [ ] Committee vs trades analysis

### Phase 4: Promises vs Actions (Week 4)
- [ ] Campaign position scraping
- [ ] Promise tracking system
- [ ] "Who benefits" analysis

---

## Questions for Jeremy

1. **No letter grade at all?** Or category-specific grades?
2. **Priority order** for the phases above?
3. **Any specific reps** to use as test cases?
4. **Mobile-first or desktop-first** for the detail pages?

---

*Created: 2026-02-05*
