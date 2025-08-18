#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const criticalFiles = [
  'public/site.webmanifest',
  'public/icons/bolt.svg'
];

const iconFiles = [
  'public/icons/apple-touch-icon.png',
  'public/icons/favicon-16x16.png',
  'public/icons/favicon-32x32.png'
];

let missingFiles = [];
let missingIcons = [];

console.log('🔍 Checking critical brand files...');

// Check absolutely critical files
for (const file of criticalFiles) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
    console.log(`❌ Missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

// Check icon files (warn but don't fail)
for (const file of iconFiles) {
  if (!fs.existsSync(file)) {
    missingIcons.push(file);
    console.log(`⚠️  Missing (can be generated): ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (missingFiles.length > 0) {
  console.error(`\n💥 ${missingFiles.length} critical brand files are missing!`);
  console.error('These files are required for deployment.');
  process.exit(1);
}

if (missingIcons.length > 0) {
  console.log(`\n⚠️  ${missingIcons.length} icon files need to be generated.`);
  console.log('Run `npm run generate:icons` to create missing icon files.');
  console.log('Continuing CI for now...');
}

console.log('\n✨ Critical brand files check completed!');
