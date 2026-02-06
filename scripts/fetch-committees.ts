#!/usr/bin/env node
/**
 * Fetch committee assignments from Congress.gov API
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Get API key from 1Password
const getApiKey = (): string => {
  try {
    execSync('source ~/.secrets', { shell: '/bin/bash' });
    const key = execSync('op read "op://Aria Labs/Congress.Gov/credential"', {
      encoding: 'utf8',
      shell: '/bin/bash',
      env: { ...process.env }
    }).trim();
    return key;
  } catch (error) {
    console.error('Failed to get API key from 1Password');
    throw error;
  }
};

interface Committee {
  id: string;
  name: string;
  chamber: 'house' | 'senate' | 'joint';
  type: 'standing' | 'select' | 'joint' | 'special';
  url?: string;
}

interface MemberAssignment {
  bioguide_id: string;
  committee_id: string;
  committee_name: string;
  role: 'chair' | 'ranking_member' | 'vice_chair' | 'member';
  subcommittee_id?: string;
  subcommittee_name?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCommittees(apiKey: string): Promise<Committee[]> {
  console.log('Fetching House committees...');
  const houseResponse = await fetch(
    `https://api.congress.gov/v3/committee/house?api_key=${apiKey}&limit=250`
  );
  const houseData = await houseResponse.json();
  
  await delay(500); // Rate limiting
  
  console.log('Fetching Senate committees...');
  const senateResponse = await fetch(
    `https://api.congress.gov/v3/committee/senate?api_key=${apiKey}&limit=250`
  );
  const senateData = await senateResponse.json();

  const committees: Committee[] = [];

  // Process House committees
  if (houseData.committees) {
    for (const comm of houseData.committees) {
      committees.push({
        id: comm.systemCode || comm.committeeCode || comm.name.replace(/\s+/g, '-').toLowerCase(),
        name: comm.name,
        chamber: 'house',
        type: comm.committeeTypeCode === 'Standing' ? 'standing' : 'select',
        url: comm.url
      });
    }
  }

  // Process Senate committees
  if (senateData.committees) {
    for (const comm of senateData.committees) {
      committees.push({
        id: comm.systemCode || comm.committeeCode || comm.name.replace(/\s+/g, '-').toLowerCase(),
        name: comm.name,
        chamber: 'senate',
        type: comm.committeeTypeCode === 'Standing' ? 'standing' : 'select',
        url: comm.url
      });
    }
  }

  console.log(`Fetched ${committees.length} committees`);
  return committees;
}

async function fetchMemberAssignments(apiKey: string, membersData: any[]): Promise<MemberAssignment[]> {
  const assignments: MemberAssignment[] = [];
  let count = 0;

  console.log(`Fetching committee assignments for ${membersData.length} members...`);

  for (const member of membersData) {
    count++;
    if (count % 50 === 0) {
      console.log(`Progress: ${count}/${membersData.length}`);
    }

    try {
      const response = await fetch(
        `https://api.congress.gov/v3/member/${member.bioguide_id}?api_key=${apiKey}`
      );
      
      if (!response.ok) {
        console.warn(`Failed to fetch data for ${member.bioguide_id}: ${response.status}`);
        await delay(1000);
        continue;
      }

      const data = await response.json();
      
      if (data.member && data.member.deputation) {
        const deputation = data.member.deputation;
        
        // Process committee assignments
        if (deputation.committeeAssignments) {
          for (const comm of deputation.committeeAssignments) {
            assignments.push({
              bioguide_id: member.bioguide_id,
              committee_id: comm.systemCode || comm.name.replace(/\s+/g, '-').toLowerCase(),
              committee_name: comm.name,
              role: comm.rank === 1 ? 'chair' : 'member' // Simplified role detection
            });
          }
        }
      }

      await delay(200); // Rate limiting
    } catch (error) {
      console.error(`Error fetching ${member.bioguide_id}:`, error);
      await delay(1000);
    }
  }

  console.log(`Fetched ${assignments.length} committee assignments`);
  return assignments;
}

async function main() {
  try {
    const apiKey = getApiKey();
    
    // Load existing members data
    const membersPath = path.join(__dirname, '../src/data/members.json');
    const membersData = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

    // Fetch committees
    const committees = await fetchCommittees(apiKey);

    // Fetch member assignments (this will take a while - ~535 API calls)
    const memberAssignments = await fetchMemberAssignments(apiKey, membersData);

    // Create output
    const output = {
      committees,
      member_assignments: memberAssignments,
      source: 'Congress.gov API',
      last_updated: new Date().toISOString()
    };

    // Write to file
    const outputPath = path.join(__dirname, '../src/data/committees.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log('✅ Committee data saved to', outputPath);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
