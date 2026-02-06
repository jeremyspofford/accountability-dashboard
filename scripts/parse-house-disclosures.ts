/**
 * Parse House Financial Disclosure XML files
 * Data from: https://disclosures-clerk.house.gov/public_disc/financial-pdfs/
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface DisclosureFiling {
  last: string;
  first: string;
  prefix: string;
  suffix: string;
  filingType: string; // O=Annual, C=Candidate, A=Amendment, T=Termination, N=New Filer
  stateDst: string;   // e.g., "TX31"
  year: number;
  filingDate: string;
  docId: string;
  pdfUrl: string;
}

interface MemberDisclosures {
  bioguideId: string;
  name: string;
  state: string;
  district: string;
  filings: DisclosureFiling[];
}

// Parse XML - simple regex-based parser for this structure
function parseDisclosureXml(xmlContent: string): DisclosureFiling[] {
  const filings: DisclosureFiling[] = [];
  const memberRegex = /<Member>([\s\S]*?)<\/Member>/g;
  
  let match;
  while ((match = memberRegex.exec(xmlContent)) !== null) {
    const memberXml = match[1];
    
    const getValue = (tag: string): string => {
      const tagMatch = memberXml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
      return tagMatch ? tagMatch[1].trim() : '';
    };
    
    const docId = getValue('DocID');
    const year = parseInt(getValue('Year')) || 0;
    
    filings.push({
      last: getValue('Last'),
      first: getValue('First'),
      prefix: getValue('Prefix'),
      suffix: getValue('Suffix'),
      filingType: getValue('FilingType'),
      stateDst: getValue('StateDst'),
      year,
      filingDate: getValue('FilingDate'),
      docId,
      pdfUrl: `https://disclosures-clerk.house.gov/public_disc/financial-pdfs/${year}/${docId}.pdf`
    });
  }
  
  return filings;
}

// Load current members
function loadMembers(): any[] {
  // Try multiple paths
  const paths = [
    join(__dirname, '../src/data/members.json'),
    join(process.cwd(), 'src/data/members.json'),
    './src/data/members.json'
  ];
  
  for (const p of paths) {
    if (existsSync(p)) {
      console.log(`Loading members from: ${p}`);
      return JSON.parse(readFileSync(p, 'utf-8'));
    }
  }
  
  console.error('members.json not found in:', paths);
  return [];
}

// State abbreviation to full name mapping
const STATE_ABBREVS: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia', PR: 'Puerto Rico', GU: 'Guam', VI: 'Virgin Islands',
  AS: 'American Samoa', MP: 'Northern Mariana Islands'
};

// Match filing to member by name and state/district
function matchFilingToMember(filing: DisclosureFiling, members: any[]): any | null {
  const stateAbbrev = filing.stateDst.slice(0, 2);
  const district = parseInt(filing.stateDst.slice(2)) || 0;
  const stateFull = STATE_ABBREVS[stateAbbrev];
  
  // Find House members in same state/district
  const candidates = members.filter(m => 
    m.chamber === 'house' && 
    m.state === stateFull
  );
  
  // Try exact district match first
  for (const member of candidates) {
    const memberDistrict = member.district || 0;
    if (memberDistrict === district) {
      // Check name match
      const memberLast = member.last_name?.toLowerCase() || '';
      const filingLast = filing.last.toLowerCase();
      if (memberLast === filingLast || memberLast.includes(filingLast) || filingLast.includes(memberLast)) {
        return member;
      }
    }
  }
  
  // Fallback: just name match within state
  for (const member of candidates) {
    const memberLast = member.last_name?.toLowerCase() || '';
    const filingLast = filing.last.toLowerCase();
    if (memberLast === filingLast) {
      return member;
    }
  }
  
  return null;
}

async function main() {
  const disclosuresDir = join(__dirname, '../data/disclosures');
  const years = [2024, 2023, 2022, 2021, 2020];
  
  // Load all filings
  const allFilings: DisclosureFiling[] = [];
  for (const year of years) {
    const xmlPath = join(disclosuresDir, `${year}FD.xml`);
    if (existsSync(xmlPath)) {
      console.log(`Parsing ${year}...`);
      const xml = readFileSync(xmlPath, 'utf-8');
      const filings = parseDisclosureXml(xml);
      console.log(`  Found ${filings.length} filings`);
      allFilings.push(...filings);
    }
  }
  
  console.log(`\nTotal filings: ${allFilings.length}`);
  
  // Load members and match
  const members = loadMembers();
  console.log(`Total members loaded: ${members.length}`);
  console.log(`Sample chambers: ${members.slice(0, 5).map(m => m.chamber).join(', ')}`);
  const houseMembers = members.filter(m => m.chamber === 'house'); // lowercase!
  console.log(`House members: ${houseMembers.length}`);
  
  // Group filings by member
  const memberDisclosures: Map<string, MemberDisclosures> = new Map();
  let matched = 0;
  let unmatched = 0;
  
  // Only process Annual (O) and Amendment (A) filings for current members
  const relevantFilings = allFilings.filter(f => ['O', 'A'].includes(f.filingType));
  console.log(`Relevant filings (Annual/Amendment): ${relevantFilings.length}`);
  
  for (const filing of relevantFilings) {
    const member = matchFilingToMember(filing, houseMembers);
    if (member) {
      matched++;
      const key = member.bioguide_id;
      if (!memberDisclosures.has(key)) {
        memberDisclosures.set(key, {
          bioguideId: key,
          name: member.full_name || `${member.first_name} ${member.last_name}`,
          state: member.state,
          district: member.district?.toString() || '',
          filings: []
        });
      }
      memberDisclosures.get(key)!.filings.push(filing);
    } else {
      unmatched++;
    }
  }
  
  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`);
  console.log(`Members with disclosures: ${memberDisclosures.size}`);
  
  // Sort filings by date (newest first)
  for (const md of memberDisclosures.values()) {
    md.filings.sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime());
  }
  
  // Output
  const output = Array.from(memberDisclosures.values());
  const outputPath = join(__dirname, '../src/data/house-disclosures.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${outputPath}`);
  
  // Show sample
  console.log('\nSample (first 3 members with most filings):');
  const sorted = output.sort((a, b) => b.filings.length - a.filings.length);
  for (const m of sorted.slice(0, 3)) {
    console.log(`  ${m.name} (${m.state}-${m.district}): ${m.filings.length} filings`);
    console.log(`    Latest: ${m.filings[0]?.filingDate} - ${m.filings[0]?.pdfUrl}`);
  }
}

main().catch(console.error);
