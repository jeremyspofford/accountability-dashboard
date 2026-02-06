#!/usr/bin/env node
/**
 * Comprehensive photo URL update script
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
  
  // Mapping from justice IDs to photo filenames
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
    } else {
      console.log(`⚠️  ${justice.name}: No photo mapping found`);
    }
  }
  
  fs.writeFileSync(scotusPath, JSON.stringify(justices, null, 2) + '\n');
  console.log(`\n✅ Updated ${updated} SCOTUS photos`);
}

// Update Cabinet photos with working alternatives
function updateCabinetPhotos() {
  console.log('\n🏛️  Updating Cabinet photos...\n');
  
  const cabinetPath = path.join(DATA_DIR, 'cabinet.json');
  const data = JSON.parse(fs.readFileSync(cabinetPath, 'utf8'));
  
  // These Wikipedia URLs work - just need to remove /thumb/ and size suffix
  const photoUpdates = {
    'secretary-of-state': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Marco_Rubio_Official_Portrait_%28cropped_2%29.jpg',
    'secretary-of-defense': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Pete_Hegseth_by_Gage_Skidmore.jpg',
    'attorney-general': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Pam_Bondi_official_photo.jpg',
    'secretary-of-treasury': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Scott_Bessent_official_portrait.jpg',
    'secretary-of-hhs': 'https://upload.wikimedia.org/wikipedia/commons/1/10/RFK_Jr._by_Gage_Skidmore.jpg',
    'secretary-of-homeland-security': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Kristi_Noem_official_photo_%28cropped%29.jpg',
    'epa-administrator': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Lee_Zeldin_official_portrait_%28cropped%29.jpg',
    'secretary-of-interior': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Doug_Burgum_by_Gage_Skidmore.jpg',
    'secretary-of-agriculture': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Brooke_Rollins_official_portrait.jpg',
    'secretary-of-commerce': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Howard_Lutnick_2024.jpg',
    'secretary-of-labor': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Lori_Chavez-DeRemer_117th_Congress_portrait.jpg',
    'secretary-of-transportation': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Sean_Duffy_official_photo.jpg',
    'secretary-of-energy': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Chris_Wright_DOE.jpg',
    'secretary-of-education': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Linda_McMahon_by_Gage_Skidmore_2.jpg',
    'secretary-of-veterans-affairs': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Doug_Collins_official_photo_%28cropped%29.jpg',
    'secretary-of-housing': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Scott_Turner_HUD.jpg'
  };
  
  let updated = 0;
  
  for (let member of data.members) {
    if (photoUpdates[member.id]) {
      const newUrl = photoUpdates[member.id];
      if (member.photo_url !== newUrl) {
        member.photo_url = newUrl;
        updated++;
        console.log(`✅ ${member.name}: Updated`);
      }
    }
  }
  
  fs.writeFileSync(cabinetPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✅ Updated ${updated} Cabinet photos`);
}

// Update VP photo
function updateVPPhoto() {
  console.log('\n🇺🇸 Updating VP photo...\n');
  
  const vpPath = path.join(DATA_DIR, 'vp.json');
  const data = JSON.parse(fs.readFileSync(vpPath, 'utf8'));
  
  const newUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/49/Senator-Elect_James_David_Vance_official_portrait%2C_117th_Congress_%28cropped%29.jpg';
  
  if (data.vice_president.photo_url !== newUrl) {
    data.vice_president.photo_url = newUrl;
    fs.writeFileSync(vpPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ ${data.vice_president.name}: Updated`);
  } else {
    console.log(`✓ ${data.vice_president.name}: Already correct`);
  }
}

// Update President photo
function updatePresidentPhoto() {
  console.log('\n🇺🇸 Updating President photo...\n');
  
  const presidentPath = path.join(DATA_DIR, 'trump-promises.json');
  const data = JSON.parse(fs.readFileSync(presidentPath, 'utf8'));
  
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
console.log('🔧 Comprehensive Photo Update');
console.log('============================\n');

updateCongressPhotos();
updateSCOTUSPhotos();
updateCabinetPhotos();
updateVPPhoto();
updatePresidentPhoto();

console.log('\n✅ All photos updated!\n');
