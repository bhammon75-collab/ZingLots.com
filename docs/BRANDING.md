# ZingLots Branding Icons

This document describes the ZingLots icon set and branding implementation.

## Icon Set Overview

The ZingLots brand uses a red bolt symbol (#E53935) as the primary icon. All icons are generated from a single source SVG file to ensure consistency across platforms and use cases.

## Source Files

- **Source SVG**: `public/icons/bolt.svg`
- **Color**: Red (#E53935)
- **Background**: Transparent

## Generated Icon Sizes

### PWA / Android
- `android-chrome-192x192.png` (192×192)
- `android-chrome-512x512.png` (512×512)

### iOS
- `ios-40.png` to `ios-180.png` (various sizes for different iOS contexts)
- `apple-touch-icon.png` (180×180) - primary iOS app icon

### Favicons
- `favicon-16x16.png` (16×16)
- `favicon-32x32.png` (32×32)
- `favicon-48x48.png` (48×48)
- `favicon-64x64.png` (64×64)

### Social Media
- `social-256.png` (256×256)
- `social-512.png` (512×512)
- `social-1024.png` (1024×1024)

## Regenerating Icons

To regenerate all icon sizes from the source SVG:

```bash
npm run generate:icons
```

This script uses Sharp to resize the source SVG into all required PNG formats while maintaining transparency and image quality.

## PWA Support

The icon set includes full Progressive Web App (PWA) support with:
- Web app manifest (`public/site.webmanifest`)
- Proper iOS and Android icon references
- Theme color configuration

## Usage in HTML

The following link tags are included in `index.html`:

```html
<link rel="manifest" href="/site.webmanifest">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
<meta name="theme-color" content="#ffffff">
```

## File Structure

```
public/
  icons/
    bolt.svg                    # Source icon
    android-chrome-192x192.png
    android-chrome-512x512.png
    apple-touch-icon.png
    favicon-16x16.png
    favicon-32x32.png
    favicon-48x48.png
    favicon-64x64.png
    ios-40.png
    ios-58.png
    ios-60.png
    ios-80.png
    ios-87.png
    ios-120.png
    ios-152.png
    ios-167.png
    ios-180.png
    social-256.png
    social-512.png
    social-1024.png
  site.webmanifest              # PWA manifest
```

## Dependencies

- **Sharp**: Used for high-quality SVG to PNG conversion
- Added to devDependencies in `package.json`

## Verification

After building, verify the icons are accessible:

1. Build the project: `npm run build`
2. Serve locally: `npm run preview`
3. Test icon URLs:
   - `/icons/favicon-32x32.png`
   - `/icons/apple-touch-icon.png`
   - `/site.webmanifest`
4. Check PWA manifest in Chrome DevTools → Application → Manifest
