#!/usr/bin/env node
/**
 * Analyze Trump promises and add who_benefits, who_harmed, public_opinion
 * Usage: node scripts/analyze-promises.js
 */

const fs = require('fs');
const path = require('path');

const PROMISES_FILE = path.join(__dirname, '../src/data/trump-promises.json');

function analyzePromise(promise) {
  const text = promise.text.toLowerCase();
  const category = promise.category.toLowerCase();
  
  let who_benefits = [];
  let who_harmed = [];
  let public_opinion = 'mixed';
  
  // Trade/Tariffs
  if (text.includes('tariff')) {
    who_benefits.push('Domestic Manufacturers', 'Protected Industries');
    who_harmed.push('Consumers', 'Importers', 'Exporters', 'Middle Class');
    public_opinion = 'negative'; // Economists widely oppose tariffs
    
    if (text.includes('china')) {
      who_benefits.push('Geopolitical Hawks');
      who_harmed.push('US-China Trade Relations', 'Tech Companies');
    }
  }
  
  // Immigration
  if (category.includes('immigration') || text.includes('deportation') || text.includes('border')) {
    if (text.includes('deportation') || text.includes('end birthright')) {
      who_benefits.push('Immigration Restrictionists', 'Private Detention Companies');
      who_harmed.push('Immigrants', 'Immigrant Families', 'Agricultural Industry', 'Service Industry');
      public_opinion = 'negative';
    }
    
    if (text.includes('wall')) {
      who_benefits.push('Construction Contractors', 'Immigration Hardliners');
      who_harmed.push('Border Communities', 'Environment', 'Taxpayers');
      public_opinion = 'mixed';
    }
  }
  
  // Environment/Climate
  if (category.includes('environment') || text.includes('climate') || text.includes('epa') || text.includes('drilling')) {
    if (text.includes('rollback') || text.includes('drill') || text.includes('coal') || text.includes('withdraw')) {
      who_benefits.push('Fossil Fuel Industry', 'Oil and Gas Companies');
      who_harmed.push('Environment', 'Future Generations', 'Public Health', 'Climate');
      public_opinion = 'negative';
    }
  }
  
  // Healthcare
  if (category.includes('healthcare') || text.includes('obamacare') || text.includes('aca')) {
    if (text.includes('repeal')) {
      who_benefits.push('Wealthy', 'Insurance Companies');
      who_harmed.push('Low Income', 'Middle Class', 'Pre-existing Conditions', '20+ Million People');
      public_opinion = 'negative';
    }
  }
  
  // Tax policy
  if (text.includes('tax')) {
    if (text.includes('cut')) {
      if (text.includes('corporate') || text.includes('wealthy')) {
        who_benefits.push('Corporations', 'Wealthy', 'Top 1%');
        who_harmed.push('Middle Class', 'Low Income', 'Government Services', 'National Debt');
        public_opinion = 'negative';
      } else {
        who_benefits.push('Middle Class', 'Workers');
        who_harmed.push('Government Revenue');
        public_opinion = 'positive';
      }
    }
  }
  
  // Social Security
  if (text.includes('social security')) {
    if (text.includes('privatize') || text.includes('cut')) {
      who_benefits.push('Wall Street', 'Investment Firms');
      who_harmed.push('Elderly', 'Retirees', 'Disabled', 'Low Income');
      public_opinion = 'negative';
    } else if (text.includes('protect')) {
      who_benefits.push('Elderly', 'Retirees', 'Workers');
      who_harmed.push('Wealthy');
      public_opinion = 'positive';
    }
  }
  
  // Foreign policy/Military
  if (category.includes('foreign') || text.includes('military') || text.includes('defense')) {
    if (text.includes('increase') || text.includes('expand')) {
      who_benefits.push('Military', 'Defense Contractors', 'Military Industrial Complex');
      who_harmed.push('Domestic Programs', 'Taxpayers', 'National Debt');
      public_opinion = 'mixed';
    }
    
    if (text.includes('nato') && text.includes('withdraw')) {
      who_benefits.push('Russia', 'Isolationists');
      who_harmed.push('NATO Allies', 'US Global Leadership', 'National Security');
      public_opinion = 'negative';
    }
  }
  
  // Education
  if (text.includes('education') || text.includes('student loan')) {
    if (text.includes('loan forgiveness') && text.includes('reverse')) {
      who_benefits.push('Loan Servicers', 'Wealthy');
      who_harmed.push('Students', 'Middle Class', 'Young People');
      public_opinion = 'negative';
    }
    
    if (text.includes('eliminate') && text.includes('department')) {
      who_benefits.push('State-level Control Advocates', 'Private Education');
      who_harmed.push('Students', 'Public Education', 'Educational Standards');
      public_opinion = 'negative';
    }
  }
  
  // Regulation
  if (text.includes('regulation') || text.includes('deregulate')) {
    who_benefits.push('Corporations', 'Business Owners');
    who_harmed.push('Consumers', 'Workers', 'Public Safety', 'Environment');
    public_opinion = 'mixed';
  }
  
  // Abortion/Social issues
  if (text.includes('abortion')) {
    if (text.includes('ban')) {
      who_benefits.push('Anti-Abortion Movement', 'Religious Right');
      who_harmed.push('Women', 'Healthcare Providers', 'Reproductive Rights');
      public_opinion = 'negative'; // Majority supports abortion access
    }
  }
  
  // Federal workforce
  if (text.includes('federal') && (text.includes('fire') || text.includes('workforce') || text.includes('bureaucrat'))) {
    who_benefits.push('Anti-Government Activists', 'Private Contractors');
    who_harmed.push('Federal Workers', 'Government Services', 'Public Sector');
    public_opinion = 'mixed';
  }
  
  // Pardons
  if (text.includes('pardon') && text.includes('january 6')) {
    who_benefits.push('January 6 Defendants', 'Far Right');
    who_harmed.push('Rule of Law', 'Police Officers', 'Democracy');
    public_opinion = 'negative';
  }
  
  // Default
  if (who_benefits.length === 0) {
    who_benefits.push('Supporters');
    who_harmed.push('Critics');
  }
  
  return {
    who_benefits: [...new Set(who_benefits)],
    who_harmed: [...new Set(who_harmed)],
    public_opinion
  };
}

function main() {
  console.log('Loading Trump promises...');
  const data = JSON.parse(fs.readFileSync(PROMISES_FILE, 'utf8'));
  
  console.log(`Analyzing ${data.promises.length} promises...`);
  let updated = 0;
  
  for (const promise of data.promises) {
    const analysis = analyzePromise(promise);
    promise.who_benefits = analysis.who_benefits;
    promise.who_harmed = analysis.who_harmed;
    promise.public_opinion = analysis.public_opinion;
    updated++;
    
    if (updated % 10 === 0) {
      console.log(`Processed ${updated} promises...`);
    }
  }
  
  // Write back to file
  fs.writeFileSync(PROMISES_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Updated ${updated} promises with impact analysis`);
}

main();
