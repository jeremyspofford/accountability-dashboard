# Campaign Positions Data Sources Research
**Task:** DATA-12  
**Date:** February 6, 2026  
**Status:** Complete

## Executive Summary

**Recommendation:** Use **OnTheIssues.org** as the primary data source with web scraping. It provides the most comprehensive, structured, and consistent politician position data with voting records and citations.

**Key Findings:**
- ✅ OnTheIssues.org: Excellent scraping candidate with 20 policy topics per politician
- ⚠️ VoteSmart.org: Data exists but most politicians don't fill out the Political Courage Test (inferred positions only)
- ❌ ISideWith.com: No viable access method found (pages 404, no API)
- 📋 Manual entry schema provided as backup for top 50 members

---

## 1. OnTheIssues.org Analysis

### ✅ Viability: EXCELLENT

**Data Quality:**
- Comprehensive coverage of 20 policy topics per politician
- Each position includes:
  - Stance intensity (Strongly Favors/Favors/Neutral/Opposes/Strongly Opposes)
  - Voting record citations
  - Quotes and public statements
  - Interest group ratings (NARAL, NRA, NAACP, etc.)
  - Bill numbers and dates
- Clear categorization by issue area

**URL Structure:**
- Senate: `https://www.ontheissues.org/Senate/{First}_{Last}.htm`
- House: `https://www.ontheissues.org/{State}/{First}_{Last}.htm`
  - Example: `https://www.ontheissues.org/Senate/Chuck_Schumer.htm`
  - Example: `https://www.ontheissues.org/NY/Alexandria_Ocasio-Cortez.htm`

**Scraping Approach:**
The data is consistently structured in HTML tables with predictable patterns:

```html
<td valign=top><b>
Strongly Favors
</b> topic 1:</br>
<a href='...'>Abortion is a woman's unrestricted right</a>
<br><small>(-5 points on Social scale)</small>
</td>
<td>
  Rated 100% by <a href='...'>NARAL</a>, indicating a pro-choice voting record
  <small>: <a href='...'>Strongly Favors topic 1</small></a>
  <br>Expand embryonic stem cell research
  <small>: <a href='...'>Favors topic 1</small></a>
  ...
</td>
```

**CSS Selectors for Scraping:**
- Position topic: `table td b + a[href*='VoteMatch']`
- Stance intensity: `table td b` (text: "Strongly Favors", "Opposes", etc.)
- Individual positions: `table td:nth-child(2) a[href*='_+_']`
- Position descriptions: `table td:nth-child(2)` (text nodes before `<small>` tags)

**Sample Data Structure (3 Members):**

#### Chuck Schumer (D-NY, Senate)
```json
{
  "bioguide_id": "S000148",
  "full_name": "Chuck Schumer",
  "source": "ontheissues",
  "url": "https://www.ontheissues.org/Senate/Chuck_Schumer.htm",
  "positions": [
    {
      "topic": "Abortion",
      "stance": "Strongly Favors",
      "description": "Abortion is a woman's unrestricted right",
      "details": [
        "Rated 100% by NARAL, indicating a pro-choice voting record",
        "Expand embryonic stem cell research",
        "Access safe, legal abortion without restrictions"
      ],
      "citations": [
        "HR1808 - Women's Health Protection Act",
        "S217 - Abortion access bill"
      ]
    },
    {
      "topic": "Gun Control",
      "stance": "Strongly Opposes",
      "description": "Absolute right to gun ownership",
      "details": [
        "Ban large-capacity ammunition",
        "Close the Gun Show Loophole",
        "Co-sponsored background check for every firearm sale"
      ]
    },
    {
      "topic": "Healthcare",
      "stance": "Strongly Favors",
      "description": "Expand ObamaCare",
      "details": [
        "Rated 100% by APHA, indicating a pro-public health record",
        "Opposes repealing mandated health insurance",
        "Expand health services for women veterans"
      ]
    }
  ]
}
```

#### Mitch McConnell (R-KY, Senate)
```json
{
  "bioguide_id": "M000355",
  "full_name": "Mitch McConnell",
  "source": "ontheissues",
  "url": "https://www.ontheissues.org/Senate/Mitch_McConnell.htm",
  "positions": [
    {
      "topic": "Abortion",
      "stance": "Strongly Opposes",
      "description": "Abortion is a woman's unrestricted right",
      "details": [
        "Rated 0% by NARAL, indicating a pro-life voting record",
        "Rated 100% by the NRLC, indicating a pro-life stance",
        "Voted YES to protect infant survivors of abortion"
      ]
    },
    {
      "topic": "Gun Control",
      "stance": "Strongly Favors",
      "description": "Absolute right to gun ownership",
      "details": [
        "Rated A by the NRA, indicating a pro-gun rights voting record",
        "Congress cannot fix school shootings; must act locally"
      ]
    },
    {
      "topic": "Healthcare",
      "stance": "Strongly Opposes",
      "description": "Expand ObamaCare",
      "details": [
        "ObamaCare is a train wreck; do what we can to repeal it",
        "Rated 0% by APHA, indicating an anti-public health voting record"
      ]
    }
  ]
}
```

#### Alexandria Ocasio-Cortez (D-NY-14, House)
```json
{
  "bioguide_id": "O000172",
  "full_name": "Alexandria Ocasio-Cortez",
  "source": "ontheissues",
  "url": "https://www.ontheissues.org/NY/Alexandria_Ocasio-Cortez.htm",
  "positions": [
    {
      "topic": "Green Energy",
      "stance": "Strongly Favors",
      "description": "Prioritize green energy",
      "details": [
        "Move to a carbon-free, 100% renewable energy system",
        "Sponsored Green New Deal: 10-year national mobilization",
        "Fund renewable energy like wind and solar"
      ]
    },
    {
      "topic": "Medicare for All",
      "stance": "Strongly Favors",
      "description": "Expand ObamaCare",
      "details": [
        "Medicare-for-All offers affordable healthcare to everyone",
        "Medicare-for-All saves money; an investment for our future"
      ]
    },
    {
      "topic": "Tax Policy",
      "stance": "Strongly Favors",
      "description": "Higher taxes on the wealthy",
      "details": [
        "70% marginal tax rate on income above $10M/year",
        "Workers & government should not pay for billionaires",
        "Raise taxes on the wealthy and on corporations"
      ]
    }
  ]
}
```

---

## 2. VoteSmart.org Political Courage Test

### ⚠️ Viability: LIMITED

**Data Quality:**
- Structured questionnaire format when politicians respond
- Covers major policy areas with detailed sub-questions
- **Problem:** Most politicians refuse to fill it out
- VoteSmart "infers" positions from voting records (less reliable than direct statements)

**URL Structure:**
- `https://justfacts.votesmart.org/candidate/political-courage-test/{vote_smart_id}/{slug}`
- Example: `https://justfacts.votesmart.org/candidate/political-courage-test/26732/nancy-pelosi`

**Sample Finding (Nancy Pelosi):**
> "Nancy Pelosi did not provide voters with positions on key issues covered by the 2024 Political Courage Test, despite repeated requests from Vote Smart and voters like you."

When they DO respond, data quality is excellent:
- Checkbox-style responses to specific policy questions
- Numerical ratings (tax levels, spending priorities)
- Written explanations for some questions

**Recommendation:** Use as **secondary validation source** only. Most members don't participate.

---

## 3. ISideWith.com

### ❌ Viability: NOT VIABLE

**Findings:**
- Tested URL: `https://www.isidewith.com/candidates/mitch-mcconnell/policies` → **404 Error**
- No public API discovered
- FAQ page mentions the site but no data access methods
- Appears to be primarily a voter quiz platform, not a data repository

**Recommendation:** **Do not pursue** this source.

---

## 4. Manual Entry Schema (Backup Plan)

If scraping proves unreliable or we need custom data fields, here's a proposed manual entry schema for the **top 50 members** (House leadership + key committee chairs):

### Database Schema

```sql
CREATE TABLE politician_positions (
    id SERIAL PRIMARY KEY,
    bioguide_id VARCHAR(7) NOT NULL,
    
    -- Issue categories (match with voting record topics)
    abortion_stance VARCHAR(20), -- 'strongly-for' | 'for' | 'neutral' | 'against' | 'strongly-against'
    abortion_details TEXT,
    abortion_source_url TEXT,
    
    gun_control_stance VARCHAR(20),
    gun_control_details TEXT,
    gun_control_source_url TEXT,
    
    healthcare_stance VARCHAR(20),
    healthcare_details TEXT,
    healthcare_source_url TEXT,
    
    climate_stance VARCHAR(20),
    climate_details TEXT,
    climate_source_url TEXT,
    
    immigration_stance VARCHAR(20),
    immigration_details TEXT,
    immigration_source_url TEXT,
    
    tax_policy_stance VARCHAR(20),
    tax_policy_details TEXT,
    tax_policy_source_url TEXT,
    
    -- Key campaign promises (free-form)
    campaign_promises JSONB, -- [{ "promise": "...", "year": 2020, "source": "..." }]
    
    data_source VARCHAR(50), -- 'ontheissues' | 'manual' | 'votesmart'
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### JSON Entry Format

```json
{
  "bioguide_id": "S000148",
  "full_name": "Chuck Schumer",
  "party": "D",
  "state": "NY",
  "chamber": "Senate",
  "positions": {
    "abortion": {
      "stance": "strongly-for",
      "summary": "Supports unrestricted abortion rights and opposes limitations",
      "details": [
        "Rated 100% by NARAL pro-choice organization",
        "Opposes parental notification requirements",
        "Supports federal abortion funding"
      ],
      "sources": [
        "https://www.ontheissues.org/Senate/Chuck_Schumer.htm"
      ]
    },
    "gun_control": {
      "stance": "strongly-for",
      "summary": "Supports strict gun control measures",
      "details": [
        "Co-sponsored universal background check legislation",
        "Supports banning high-capacity magazines",
        "Opposes gun show loophole"
      ],
      "sources": [
        "https://www.congress.gov/bill/116th-congress/house-bill/8"
      ]
    },
    "healthcare": {
      "stance": "strongly-for",
      "summary": "Supports expansion of government healthcare programs",
      "details": [
        "Defended ACA from repeal attempts",
        "Supports drug price negotiations",
        "Favors Medicare expansion"
      ],
      "sources": [
        "https://www.ontheissues.org/Senate/Chuck_Schumer.htm"
      ]
    }
  },
  "campaign_promises": [
    {
      "promise": "Fight to protect and expand the Affordable Care Act",
      "election_year": 2022,
      "source": "Campaign website",
      "status": "ongoing"
    }
  ],
  "data_source": "ontheissues",
  "last_updated": "2026-02-06"
}
```

### Top 50 Priority List

**House Leadership (10):**
1. Speaker: Mike Johnson (R-LA)
2. Minority Leader: Hakeem Jeffries (D-NY)
3. Majority Leader: Steve Scalise (R-LA)
4. Minority Whip: Katherine Clark (D-MA)
5-10. Committee chairs (Ways & Means, Appropriations, Rules, etc.)

**Senate Leadership (10):**
1. Majority Leader: Chuck Schumer (D-NY)
2. Minority Leader: Mitch McConnell (R-KY)
3. Majority Whip: Dick Durbin (D-IL)
4. Minority Whip: John Thune (R-SD)
5-10. Key committee chairs

**High-Profile Members (30):**
- AOC, MTG, Bernie Sanders, Ted Cruz, Elizabeth Warren, etc.
- Members with strong national profiles
- Frequent media appearances
- Large social media followings

---

## 5. Implementation Recommendation

### Phase 1: Automated Scraping (Recommended)
1. **Build OnTheIssues.org scraper**
   - Python with BeautifulSoup or Scrapy
   - Scrape all House + Senate members (~535 pages)
   - Store in PostgreSQL with JSONB fields
   - Run weekly to capture updates

2. **Extract structured data:**
   - 20 policy topics per politician
   - Stance intensity (5-point scale)
   - Supporting details and citations
   - Voting record references

3. **Normalize data:**
   - Map to our issue categories
   - Create "promises vs votes" comparison logic
   - Link positions to roll call votes in database

### Phase 2: Manual Enhancement (Optional)
For top 50 members:
- Add campaign website promises
- Include recent public statements
- Annotate with fact-checks
- Update quarterly

### Scraper Pseudocode

```python
import requests
from bs4 import BeautifulSoup
import json

def scrape_politician_positions(bioguide_id, name_slug, chamber):
    """
    Scrape OnTheIssues.org for politician positions
    """
    # Construct URL based on chamber
    if chamber == 'Senate':
        url = f"https://www.ontheissues.org/Senate/{name_slug}.htm"
    else:
        # Need to map bioguide to state code
        state = get_state_from_bioguide(bioguide_id)
        url = f"https://www.ontheissues.org/{state}/{name_slug}.htm"
    
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    positions = []
    
    # Find all topic sections
    topic_rows = soup.find_all('tr')
    
    for row in topic_rows:
        # Extract stance (Strongly Favors, Opposes, etc.)
        stance_cell = row.find('td', valign='top')
        if not stance_cell:
            continue
        
        stance_text = stance_cell.find('b').text.strip()
        
        # Extract topic and details
        topic_link = row.find('a', href=lambda x: x and 'VoteMatch' in x)
        if not topic_link:
            continue
        
        topic = topic_link.text.strip()
        
        # Extract all position details
        details_cell = row.find_all('td')[1] if len(row.find_all('td')) > 1 else None
        if not details_cell:
            continue
        
        details = []
        for text in details_cell.stripped_strings:
            if text and not text.startswith('topic'):
                details.append(text)
        
        positions.append({
            'topic': topic,
            'stance': stance_text,
            'details': details
        })
    
    return {
        'bioguide_id': bioguide_id,
        'url': url,
        'positions': positions
    }
```

### Data Refresh Strategy
- **Initial load:** Scrape all 535+ members
- **Weekly updates:** Re-scrape changed pages (check Last-Modified header)
- **Priority updates:** Daily scraping for top 50 high-profile members
- **Validation:** Cross-reference with voting records from ProPublica Congress API

---

## 6. Data Mapping to Dashboard

### Promised vs. Delivered Comparison

Example visualization:

**Rep. Alexandria Ocasio-Cortez (D-NY-14)**

| Issue | Campaign Position | Voting Record | Alignment |
|-------|------------------|---------------|-----------|
| Green New Deal | Strongly Supports (2018 campaign) | Sponsored HR109 (2019), Voted YES on IRA (2022) | ✅ **100% Aligned** |
| Medicare for All | Strongly Supports | Voted YES on drug pricing (HR3), NO on ACA repeal | ✅ **95% Aligned** |
| Gun Control | Supports universal background checks | Voted YES on HR8 (2019, 2021, 2023) | ✅ **100% Aligned** |

**Sen. Mitch McConnell (R-KY)**

| Issue | Campaign Position | Voting Record | Alignment |
|-------|------------------|---------------|-----------|
| Repeal ObamaCare | Strongly Supports (2014, 2020) | Voted YES on repeal (2017), NO on ACA expansion | ✅ **100% Aligned** |
| Tax Cuts | Supports lower corporate taxes | Voted YES on 2017 tax bill, Opposed rate increases | ✅ **100% Aligned** |
| Gun Rights | Opposes new restrictions | Voted NO on background checks, A-rated by NRA | ✅ **100% Aligned** |

---

## 7. Technical Considerations

### Rate Limiting
- OnTheIssues.org: No public rate limits observed
- Implement polite scraping: 1-2 second delays between requests
- Use `User-Agent` header identifying the project

### Legal/Ethical
- OnTheIssues.org content is factual compilation (not copyrightable opinion)
- Cite source and link back to original pages
- Add robots.txt check before scraping
- Consider reaching out to site owner for bulk data access

### Error Handling
- Handle 404s gracefully (some newer members may not have pages yet)
- Validate extracted data structure
- Log failed scrapes for manual review
- Implement retry logic with exponential backoff

### Data Quality
- Cross-reference with ProPublica Congress API voting data
- Flag inconsistencies for manual review
- Store source URLs for audit trail
- Version control position changes over time

---

## Conclusion

**Recommended Path Forward:**

1. ✅ **Implement OnTheIssues.org scraper** (1-2 days)
   - Highest data quality and coverage
   - Consistent structure enables reliable extraction
   - Includes citations and voting records

2. ⚠️ **Use VoteSmart as secondary source** (optional)
   - Only for members who completed Political Courage Test
   - Manual integration for high-value targets

3. 📋 **Prepare manual entry workflow** (backup)
   - JSON schema ready for top 50 members
   - Use if scraping blocked or for campaign-specific promises

4. 🔄 **Build data pipeline:**
   - Scraper → PostgreSQL → Dashboard API
   - Weekly automated updates
   - Manual review queue for discrepancies

**Success Metrics:**
- Coverage: 90%+ of Congress members with position data
- Accuracy: Cross-validated with voting records
- Freshness: Weekly updates or better
- Usability: Clear promise-vs-delivery comparisons

---

## Sample URLs for Testing

**OnTheIssues.org:**
- Chuck Schumer: https://www.ontheissues.org/Senate/Chuck_Schumer.htm
- Mitch McConnell: https://www.ontheissues.org/Senate/Mitch_McConnell.htm
- Alexandria Ocasio-Cortez: https://www.ontheissues.org/NY/Alexandria_Ocasio-Cortez.htm

**VoteSmart.org:**
- Nancy Pelosi: https://justfacts.votesmart.org/candidate/political-courage-test/26732/nancy-pelosi
- Mitch McConnell: https://justfacts.votesmart.org/candidate/political-courage-test/53298/mitch-mcconnell-jr

---

**Research completed:** February 6, 2026  
**Next steps:** Proceed with OnTheIssues scraper implementation
