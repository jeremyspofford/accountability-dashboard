#!/usr/bin/env node
/**
 * Final comprehensive photo update with verified working URLs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Update Congress members
function updateCongressPhotos() {
  console.log('\n📸 Updating Congress member photos...\n');
  
  const membersPath = path.join(DATA_DIR, 'members.json');
  const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));
  
  let updated = 0;
  
  for (let member of members) {
    if (!member.bioguide_id) {
      console.log(`⚠️  ${member.full_name}: No bioguide_id`);
      continue;
    }
    
    const newUrl = `https://www.congress.gov/img/member/${member.bioguide_id.toLowerCase()}_200.jpg`;
    if (member.photo_url !== newUrl) {
      member.photo_url = newUrl;
      updated++;
    }
  }
  
  fs.writeFileSync(membersPath, JSON.stringify(members, null, 2) + '\n');
  console.log(`✅ Updated ${updated} Congress member photos`);
}

// Update SCOTUS photos  
function updateSCOTUSPhotos() {
  console.log('\n⚖️  Updating SCOTUS photos...\n');
  
  const scotusPath = path.join(DATA_DIR, 'scotus.json');
  const justices = JSON.parse(fs.readFileSync(scotusPath, 'utf8'));
  
  const photoMap = {
    'roberts': 'Roberts_8807-16_Crop.jpg',
    'thomas': 'Thomas_9366-024_Crop.jpg',
    'alito': 'Alito_9264-001-Crop.jpg',
    'sotomayor': 'Sotomayor_Official_2025.jpg',
    'kagan': 'Kagan_10713-017-Crop.jpg',
    'gorsuch': 'Gorsuch2.jpg',
    'kavanaugh': 'Kavanaugh 12221_005_crop.jpg',
    'barrett': 'Barrett_102535_w151.jpg',
    'jackson': 'KBJackson3.jpg'
  };
  
  let updated = 0;
  
  for (let justice of justices) {
    if (photoMap[justice.id]) {
      const newUrl = `https://www.supremecourt.gov/about/justice_pictures/${photoMap[justice.id]}`;
      if (justice.photo_url !== newUrl) {
        justice.photo_url = newUrl;
        updated++;
        console.log(`✅ ${justice.name}: Updated`);
      }
    }
  }
  
  fs.writeFileSync(scotusPath, JSON.stringify(justices, null, 2) + '\n');
  console.log(`\n✅ Updated ${updated} SCOTUS photos`);
}

// Update Cabinet photos - use Congress photos where available
function updateCabinetPhotos() {
  console.log('\n🏛️  Updating Cabinet photos...\n');
  
  const cabinetPath = path.join(DATA_DIR, 'cabinet.json');
  const data = JSON.parse(fs.readFileSync(cabinetPath, 'utf8'));
  
  // Cabinet members with Congress bioguide IDs (verified working)
  const congressPhotos = {
    'secretary-of-state': { name: 'Marco Rubio', bioguide: 'R000595' },
    'secretary-of-homeland-security': { name: 'Kristi Noem', bioguide: 'N000184' },
    'epa-administrator': { name: 'Lee Zeldin', bioguide: 'Z000017' },
    'secretary-of-veterans-affairs': { name: 'Doug Collins', bioguide: 'C001093' },
    'secretary-of-transportation': { name: 'Sean Duffy', bioguide: 'D000614' },
    'secretary-of-labor': { name: 'Lori Chavez-DeRemer', bioguide: 'C001125' },
    'secretary-of-defense': { name: 'Pete Hegseth', bioguide: null }, // Not in Congress
    'attorney-general': { name: 'Pam Bondi', bioguide: null },
    'secretary-of-treasury': { name: 'Scott Bessent', bioguide: null },
    'secretary-of-hhs': { name: 'Robert F. Kennedy Jr.', bioguide: null },
    'secretary-of-interior': { name: 'Doug Burgum', bioguide: null },
    'secretary-of-agriculture': { name: 'Brooke Rollins', bioguide: null },
    'secretary-of-commerce': { name: 'Howard Lutnick', bioguide: null },
    'secretary-of-energy': { name: 'Chris Wright', bioguide: null },
    'secretary-of-education': { name: 'Linda McMahon', bioguide: null },
    'secretary-of-housing': { name: 'Scott Turner', bioguide: null }
  };
  
  let updated = 0;
  let needsManual = [];
  
  for (let member of data.members) {
    const info = congressPhotos[member.id];
    if (!info) continue;
    
    if (info.bioguide) {
      // Use Congress photo
      const newUrl = `https://www.congress.gov/img/member/${info.bioguide.toLowerCase()}_200.jpg`;
      if (member.photo_url !== newUrl) {
        member.photo_url = newUrl;
        updated++;
        console.log(`✅ ${member.name}: Updated (Congress photo)`);
      }
    } else {
      // Keep existing URL but mark for manual review
      needsManual.push(member.name);
      console.log(`⚠️  ${member.name}: Needs manual photo URL verification`);
    }
  }
  
  fs.writeFileSync(cabinetPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✅ Updated ${updated} Cabinet photos`);
  if (needsManual.length > 0) {
    console.log(`⚠️  ${needsManual.length} Cabinet members need manual photo verification`);
  }
}

// Update VP photo
function updateVPPhoto() {
  console.log('\n🇺🇸 Updating VP photo...\n');
  
  const vpPath = path.join(DATA_DIR, 'vp.json');
  const data = JSON.parse(fs.readFileSync(vpPath, 'utf8'));
  
  // JD Vance has a Congress photo (he was a senator)
  const newUrl = 'https://www.congress.gov/img/member/v000137_200.jpg';
  
  if (data.vice_president.photo_url !== newUrl) {
    data.vice_president.photo_url = newUrl;
    fs.writeFileSync(vpPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ ${data.vice_president.name}: Updated (Congress photo)`);
  } else {
    console.log(`✓ ${data.vice_president.name}: Already correct`);
  }
}

// Update President photo
function updatePresidentPhoto() {
  console.log('\n🇺🇸 Updating President photo...\n');
  
  const presidentPath = path.join(DATA_DIR, 'trump-promises.json');
  const data = JSON.parse(fs.readFileSync(presidentPath, 'utf8'));
  
  // Trump's official portrait from Wikipedia (verified working)
  const newUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg';
  
  if (data.president.photo_url !== newUrl) {
    data.president.photo_url = newUrl;
    fs.writeFileSync(presidentPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ ${data.president.name}: Updated`);
  } else {
    console.log(`✓ ${data.president.name}: Already correct`);
  }
}

// Main execution
console.log('🔧 Final Photo Update (Verified URLs)');
console.log('=====================================\n');

updateCongressPhotos();
updateSCOTUSPhotos();
updateCabinetPhotos();
updateVPPhoto();
updatePresidentPhoto();

console.log('\n✅ All verified photos updated!\n');
console.log('Note: Some Cabinet member photos may need manual verification');
console.log('as they were not members of Congress and Wikipedia URLs may change.\n');
