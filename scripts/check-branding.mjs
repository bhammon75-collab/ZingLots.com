#!/usr/bin/env node

/**
 * CI check script to verify critical branding files exist
 * This ensures the icon generation was successful and all required files are present
 */

import { existsSync } from 'fs';
import { join } from 'path';

const CRITICAL_FILES = [
  'public/site.webmanifest',
  'public/icons/apple-touch-icon.png',
  'public/icons/favicon-16x16.png',
  'public/icons/favicon-32x32.png',
  'public/icons/android-chrome-192x192.png',
  'public/icons/android-chrome-512x512.png'
];

let missingFiles = [];

console.log('🔍 Checking critical branding files...');

for (const file of CRITICAL_FILES) {
  if (!existsSync(file)) {
    missingFiles.push(file);
    console.error(`❌ Missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (missingFiles.length > 0) {
  console.error(`\n💥 ${missingFiles.length} critical files are missing!`);
  console.error('Run "npm run generate:icons" to generate missing icon files.');
  process.exit(1);
} else {
  console.log('\n🎉 All critical branding files are present!');
  process.exit(0);
}
