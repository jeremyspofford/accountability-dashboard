#!/usr/bin/env node
/**
 * Script to fix photo URLs for all representatives
 * 
 * 1. Congress members: Update to bioguide format
 * 2. Cabinet/SCOTUS/VP/President: Test and verify URLs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Test if a URL returns 200 OK (using GET with proper headers)
async function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/jpeg,image/png,image/*'
      }
    };
    
    const req = client.request(url, options, (res) => {
      // Consume response data to avoid memory leak
      res.on('data', () => {});
      res.on('end', () => {
        resolve(res.statusCode === 200);
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// Update Congress members to use congress.gov URLs based on bioguide_id
async function fixCongressPhotos() {
  console.log('\n📸 Fixing Congress member photos...\n');
  
  const membersPath = path.join(DATA_DIR, 'members.json');
  const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));
  
  let fixed = 0;
  let total = members.length;
  
  for (let member of members) {
    if (!member.bioguide_id) {
      console.log(`⚠️  ${member.full_name}: No bioguide_id`);
      continue;
    }
    
    // Use congress.gov format with lowercase bioguide_id
    const newUrl = `https://www.congress.gov/img/member/${member.bioguide_id.toLowerCase()}_200.jpg`;
    const oldUrl = member.photo_url;
    
    if (oldUrl !== newUrl) {
      member.photo_url = newUrl;
      fixed++;
      console.log(`✅ ${member.full_name} (${member.bioguide_id}): Updated`);
    }
  }
  
  fs.writeFileSync(membersPath, JSON.stringify(members, null, 2) + '\n');
  console.log(`\n✨ Fixed ${fixed}/${total} Congress member photos`);
}

// Test and report on Cabinet photos
async function testCabinetPhotos() {
  console.log('\n🏛️  Testing Cabinet photos...\n');
  
  const cabinetPath = path.join(DATA_DIR, 'cabinet.json');
  const data = JSON.parse(fs.readFileSync(cabinetPath, 'utf8'));
  
  let working = 0;
  let broken = 0;
  
  for (let member of data.members) {
    const works = await testUrl(member.photo_url);
    if (works) {
      console.log(`✅ ${member.name} (${member.role}): OK`);
      working++;
    } else {
      console.log(`❌ ${member.name} (${member.role}): BROKEN - ${member.photo_url}`);
      broken++;
    }
  }
  
  console.log(`\n📊 Cabinet: ${working} working, ${broken} broken`);
}

// Test SCOTUS photos
async function testSCOTUSPhotos() {
  console.log('\n⚖️  Testing SCOTUS photos...\n');
  
  const scotusPath = path.join(DATA_DIR, 'scotus.json');
  const justices = JSON.parse(fs.readFileSync(scotusPath, 'utf8'));
  
  let working = 0;
  let broken = 0;
  
  for (let justice of justices) {
    const works = await testUrl(justice.photo_url);
    if (works) {
      console.log(`✅ ${justice.name}: OK`);
      working++;
    } else {
      console.log(`❌ ${justice.name}: BROKEN - ${justice.photo_url}`);
      broken++;
    }
  }
  
  console.log(`\n📊 SCOTUS: ${working} working, ${broken} broken`);
}

// Test VP photo
async function testVPPhoto() {
  console.log('\n🇺🇸 Testing VP photo...\n');
  
  const vpPath = path.join(DATA_DIR, 'vp.json');
  const data = JSON.parse(fs.readFileSync(vpPath, 'utf8'));
  
  const works = await testUrl(data.vice_president.photo_url);
  if (works) {
    console.log(`✅ ${data.vice_president.name}: OK`);
  } else {
    console.log(`❌ ${data.vice_president.name}: BROKEN - ${data.vice_president.photo_url}`);
  }
}

// Test President photo
async function testPresidentPhoto() {
  console.log('\n🇺🇸 Testing President photo...\n');
  
  const presidentPath = path.join(DATA_DIR, 'trump-promises.json');
  const data = JSON.parse(fs.readFileSync(presidentPath, 'utf8'));
  
  const works = await testUrl(data.president.photo_url);
  if (works) {
    console.log(`✅ ${data.president.name}: OK`);
  } else {
    console.log(`❌ ${data.president.name}: BROKEN - ${data.president.photo_url}`);
  }
}

// Main execution
async function main() {
  console.log('🔧 Photo Fix Script');
  console.log('===================');
  
  await fixCongressPhotos();
  await testCabinetPhotos();
  await testSCOTUSPhotos();
  await testVPPhoto();
  await testPresidentPhoto();
  
  console.log('\n✅ Done!\n');
}

main().catch(console.error);
