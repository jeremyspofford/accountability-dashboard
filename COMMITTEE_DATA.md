# Committee Membership Data Implementation

## Summary

Committee membership data has been added to the accountability dashboard. **Important:** Congress.gov API v3 does NOT provide committee membership data, so we use ProPublica Congress API instead.

## Changes Made

### 1. Type Definitions (`src/lib/types.ts`)
- Added `Committee` and `Subcommittee` interfaces
- Updated `Member` interface to include `committees: Committee[]` field
- Committees include: name, code, chamber, rank, leadership positions (chair/ranking member), and subcommittees

### 2. Data Pipeline (`pipeline/`)
- **New file:** `pipeline/sources/propublica-committees.ts`
  - Fetches committee assignments from ProPublica Congress API
  - Transforms data to our schema format
  - Handles leadership role detection (Chair, Ranking Member)
  - Includes subcommittee assignments
  
- **Updated:** `pipeline/index.ts`
  - Added step 1c to fetch committee data from ProPublica
  - Merges committee data into member records
  - Writes separate `committees.json` file for easy access
  - Shows committee stats in pipeline summary

- **Updated:** `pipeline/sources/congress-members.ts`
  - Removed attempted committee fetching (Congress.gov doesn't provide it)
  - Initializes committees as empty array (filled by ProPublica later)

### 3. Data Loading (`src/lib/data.ts`)
- Updated `RawMember` interface to include committee structure
- Updated `transformMember()` to pass through committee data
- Added `getMemberCommitteesForDisplay()` helper function
  - Converts our committee format to CommitteeMemberships component format
  - Returns array with name, role, and subcommittees as strings

### 4. Tests
- Updated `src/lib/data.test.ts` to check for `committees` field
- UI component test (`CommitteeMemberships.test.tsx`) already existed and passes
- All member data tests pass (95/101 total tests passing)

## API Requirements

### ProPublica Congress API
- **Required for:** Committee membership data
- **Sign up:** https://www.propublica.org/datastore/api/propublica-congress-api
- **Free tier:** 5,000 requests/day
- **Environment variable:** `PROPUBLICA_API_KEY`

### Congress.gov API
- **Used for:** Member info, bills sponsored/cosponsored
- **Does NOT provide:** Committee membership data
- **Environment variable:** `CONGRESS_API_KEY` (already configured)

## Running the Pipeline

```bash
# Set API keys (if not already in ~/.secrets)
export CONGRESS_API_KEY="your_congress_gov_key"
export PROPUBLICA_API_KEY="your_propublica_key"

# Run the full pipeline
cd /home/jeremy/repos/accountability-dashboard
pnpm run pipeline
```

### Pipeline Output
- `src/data/members.json` - Members with committee data included
- `src/data/committees.json` - Committee assignments by bioguide_id
- `pipeline/output/` - Reference copies of all data files

## Data Structure

### Committee Object
```typescript
{
  name: string;                 // "Committee on Ways and Means"
  code: string;                 // "HSWM00"
  chamber: "house" | "senate" | "joint";
  rank?: number;                // Position in committee (if available)
  is_chair: boolean;            // True if member chairs this committee
  is_ranking_member: boolean;   // True if member is ranking minority member
  subcommittees: Subcommittee[]; // Array of subcommittee assignments
}
```

### Example: Using Committee Data

```typescript
import { getMember, getMemberCommitteesForDisplay } from '@/lib/data';

// Get member with committee data
const member = getMember('P000197'); // Nancy Pelosi
console.log(member.committees); // Array of Committee objects

// Get formatted for UI component
const displayCommittees = getMemberCommitteesForDisplay('P000197');
// Returns: [{ name, role: "Chair" | "Ranking Member" | "Member", subcommittees?: string[] }]
```

## Next Steps

1. **Get ProPublica API Key**
   - Sign up at https://www.propublica.org/datastore/api/propublica-congress-api
   - Add to `~/.secrets` as `export PROPUBLICA_API_KEY="..."`
   - Or store in 1Password and source via `op`

2. **Run Pipeline**
   ```bash
   source ~/.secrets
   pnpm run pipeline
   ```

3. **Verify Data**
   - Check `src/data/committees.json` exists
   - Verify pipeline summary shows committee counts
   - Test a few members to ensure data is accurate

4. **Update UI** (if needed)
   - CommitteeMemberships component already exists
   - Use `getMemberCommitteesForDisplay(bioguideId)` to fetch formatted data
   - Component accepts: `{ name, role, subcommittees?: string[] }[]`

## Why ProPublica Instead of Congress.gov?

After thorough investigation, Congress.gov API v3 does NOT expose committee membership data through any endpoint:

- ✗ `/member/{bioguideId}` - No committee data
- ✗ `/committee/{chamber}/{code}` - No member list
- ✗ `/committee/{congress}/{chamber}/{code}` - No member list

ProPublica Congress API provides comprehensive committee data including:
- Current committee assignments
- Leadership roles (Chair, Ranking Member)
- Subcommittee memberships
- Rank/seniority information
- Updated regularly

This is already used in the project for vote data (`pipeline/sources/propublica-votes.ts`), so it's a consistent choice.

## Testing

```bash
# Run all tests
pnpm test:run

# Test committee fetching directly
cd pipeline/sources
PROPUBLICA_API_KEY="..." tsx propublica-committees.ts

# Test full pipeline
pnpm run pipeline
```

## Troubleshooting

### "PROPUBLICA_API_KEY environment variable required"
- Sign up for free API key at ProPublica
- Add to `~/.secrets` or set in current shell
- Pipeline will skip committee data if key is missing

### Empty committees array in members.json
- Check that PROPUBLICA_API_KEY is set when running pipeline
- Verify API key is valid (test with direct curl)
- Check pipeline logs for errors during step 1c

### Mismatched committee format in UI
- Use `getMemberCommitteesForDisplay()` helper function
- Don't pass raw member.committees to CommitteeMemberships component
- Component expects simplified format with role as string, not booleans
