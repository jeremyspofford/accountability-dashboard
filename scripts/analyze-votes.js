#!/usr/bin/env node
/**
 * Analyze key votes and add beneficiary data
 * Usage: node scripts/analyze-votes.js
 */

const fs = require('fs');
const path = require('path');

const VOTES_FILE = path.join(__dirname, '../src/data/key-votes.json');

// Beneficiary categories based on vote content
function analyzeBeneficiaries(vote) {
  const desc = vote.description.toLowerCase();
  const title = vote.title.toLowerCase();
  const text = `${title} ${desc}`;
  
  const beneficiaries = [];
  const harmed = [];
  
  // Healthcare-related
  if (vote.category === 'Healthcare' || text.includes('medicaid') || text.includes('medicare') || text.includes('healthcare')) {
    if (text.includes('rescind') || text.includes('cut')) {
      harmed.push('Low Income', 'Middle Class', 'Healthcare Patients');
      beneficiaries.push('Corporations', 'Wealthy', 'Insurance Companies');
    } else if (text.includes('expand') || text.includes('fund')) {
      beneficiaries.push('Low Income', 'Middle Class', 'Healthcare Patients');
      harmed.push('Wealthy', 'Insurance Companies');
    }
  }
  
  // Immigration
  if (text.includes('immigration') || text.includes('ice') || text.includes('border')) {
    if (text.includes('enforcement') || text.includes('detention')) {
      beneficiaries.push('Law Enforcement', 'Private Prisons');
      harmed.push('Immigrants', 'Low Income Communities');
    }
  }
  
  // Tax policy
  if (text.includes('tax')) {
    if (text.includes('cut') || text.includes('reduction')) {
      if (text.includes('corporate') || text.includes('estate')) {
        beneficiaries.push('Corporations', 'Wealthy');
        harmed.push('Middle Class', 'Low Income', 'Government Services');
      } else {
        beneficiaries.push('Middle Class', 'Workers');
      }
    } else if (text.includes('increase') || text.includes('raise')) {
      beneficiaries.push('Government Services', 'Low Income');
      if (text.includes('corporate') || text.includes('wealthy')) {
        harmed.push('Corporations', 'Wealthy');
      } else {
        harmed.push('Middle Class', 'Workers');
      }
    }
  }
  
  // Defense/Military
  if (vote.category === 'Defense' || text.includes('military') || text.includes('defense') || text.includes('pentagon')) {
    if (text.includes('spending') || text.includes('budget') || text.includes('appropriation')) {
      beneficiaries.push('Military', 'Defense Contractors');
      harmed.push('Domestic Programs');
    }
  }
  
  // Environment
  if (vote.category === 'Environment' || text.includes('climate') || text.includes('environmental') || text.includes('epa')) {
    if (text.includes('protection') || text.includes('clean') || text.includes('renewable')) {
      beneficiaries.push('Environment', 'Future Generations', 'Public Health');
      harmed.push('Fossil Fuel Industry');
    } else if (text.includes('rollback') || text.includes('rescind')) {
      beneficiaries.push('Corporations', 'Fossil Fuel Industry');
      harmed.push('Environment', 'Future Generations', 'Public Health');
    }
  }
  
  // Labor/Workers
  if (text.includes('worker') || text.includes('labor') || text.includes('union') || text.includes('wage')) {
    if (text.includes('protect') || text.includes('raise') || text.includes('increase')) {
      beneficiaries.push('Workers', 'Middle Class', 'Labor Unions');
      harmed.push('Corporations');
    } else if (text.includes('weaken') || text.includes('restrict')) {
      beneficiaries.push('Corporations');
      harmed.push('Workers', 'Middle Class', 'Labor Unions');
    }
  }
  
  // Education
  if (text.includes('education') || text.includes('student') || text.includes('school')) {
    if (text.includes('funding') || text.includes('loan forgiveness')) {
      beneficiaries.push('Students', 'Middle Class', 'Low Income', 'Education');
      harmed.push('Wealthy');
    } else if (text.includes('cut') || text.includes('privatization')) {
      beneficiaries.push('Private Education Companies', 'Wealthy');
      harmed.push('Students', 'Public Education', 'Low Income');
    }
  }
  
  // Social programs
  if (text.includes('snap') || text.includes('food stamps') || text.includes('welfare') || text.includes('social security')) {
    if (text.includes('cut') || text.includes('rescind') || text.includes('reduce')) {
      beneficiaries.push('Wealthy', 'Corporations');
      harmed.push('Low Income', 'Elderly', 'Disabled');
    } else if (text.includes('expand') || text.includes('protect')) {
      beneficiaries.push('Low Income', 'Elderly', 'Disabled');
      harmed.push('Wealthy');
    }
  }
  
  // Financial regulation
  if (text.includes('wall street') || text.includes('bank') || text.includes('financial regulation') || text.includes('dodd-frank')) {
    if (text.includes('deregulation') || text.includes('rollback') || text.includes('repeal')) {
      beneficiaries.push('Banks', 'Corporations', 'Wealthy', 'Wall Street');
      harmed.push('Consumers', 'Middle Class', 'Low Income');
    } else if (text.includes('regulation') || text.includes('consumer protection')) {
      beneficiaries.push('Consumers', 'Middle Class', 'Low Income');
      harmed.push('Banks', 'Corporations', 'Wall Street');
    }
  }
  
  // Trade
  if (text.includes('trade') || text.includes('tariff')) {
    if (text.includes('tariff') || text.includes('protectionist')) {
      beneficiaries.push('Domestic Manufacturers');
      harmed.push('Consumers', 'International Trade', 'Importers');
    } else if (text.includes('free trade')) {
      beneficiaries.push('Corporations', 'Consumers', 'International Trade');
      harmed.push('Domestic Workers', 'Manufacturing Jobs');
    }
  }
  
  // Energy
  if (text.includes('energy') || text.includes('oil') || text.includes('gas') || text.includes('fossil fuel')) {
    if (text.includes('subsidy') || text.includes('support')) {
      beneficiaries.push('Fossil Fuel Industry', 'Energy Companies');
      harmed.push('Environment', 'Renewable Energy');
    }
  }
  
  // Criminal justice
  if (text.includes('criminal justice') || text.includes('sentencing') || text.includes('prison')) {
    if (text.includes('reform') || text.includes('reduce sentencing')) {
      beneficiaries.push('Criminal Justice Reform', 'Low Income Communities', 'Minorities');
      harmed.push('Private Prisons', 'Law Enforcement Unions');
    }
  }
  
  // Default fallback
  if (beneficiaries.length === 0 && harmed.length === 0) {
    // Generic analysis based on party split
    if (vote.yea_count > vote.nay_count) {
      beneficiaries.push('Majority Coalition');
    } else {
      beneficiaries.push('Minority Coalition');
    }
  }
  
  return {
    beneficiaries: [...new Set(beneficiaries)],
    harmed: [...new Set(harmed)]
  };
}

function main() {
  console.log('Loading key votes...');
  const votes = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8'));
  
  console.log(`Analyzing ${votes.length} votes...`);
  let updated = 0;
  
  for (const vote of votes) {
    const analysis = analyzeBeneficiaries(vote);
    vote.beneficiaries = analysis.beneficiaries;
    vote.harmed = analysis.harmed;
    updated++;
    
    if (updated % 50 === 0) {
      console.log(`Processed ${updated} votes...`);
    }
  }
  
  // Write back to file
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
  console.log(`✅ Updated ${updated} votes with beneficiary data`);
}

main();
