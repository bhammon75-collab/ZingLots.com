#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const criticalFiles = [
  'public/site.webmanifest',
  'public/icons/apple-touch-icon.png',
  'public/icons/favicon-16x16.png',
  'public/icons/favicon-32x32.png',
  'public/icons/bolt.svg'
];

let missingFiles = [];

console.log('🔍 Checking critical brand files...');

for (const file of criticalFiles) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
    console.log(`❌ Missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (missingFiles.length > 0) {
  console.error(`\n💥 ${missingFiles.length} critical brand files are missing!`);
  console.error('Run `npm run generate:icons` to create missing icon files.');
  process.exit(1);
} else {
  console.log('\n✨ All critical brand files are present!');
}
