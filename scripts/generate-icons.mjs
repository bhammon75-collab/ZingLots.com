import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join('public', 'icons', 'bolt.svg');
const OUT = path.join('public', 'icons');

const sizes = {
  // PWA / Android
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
  // iOS
  'ios-40.png': 40,
  'ios-58.png': 58,
  'ios-60.png': 60,
  'ios-80.png': 80,
  'ios-87.png': 87,
  'ios-120.png': 120,
  'ios-152.png': 152,
  'ios-167.png': 167,
  'ios-180.png': 180,
  // Favicons
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon-48x48.png': 48,
  'favicon-64x64.png': 64,
  // Social squares
  'social-256.png': 256,
  'social-512.png': 512,
  'social-1024.png': 1024
};

if (!fs.existsSync(SRC)) {
  console.error('Missing bolt.svg at', SRC);
  process.exit(1);
}
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const svg = fs.readFileSync(SRC);

const run = async () => {
  for (const [name, size] of Object.entries(sizes)) {
    const outPath = path.join(OUT, name);
    await sharp(svg)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    console.log('Wrote', outPath);
  }

  // Convenience: apple-touch-icon (must be 180x180)
  await sharp(svg).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
  console.log('Wrote apple-touch-icon.png');
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
