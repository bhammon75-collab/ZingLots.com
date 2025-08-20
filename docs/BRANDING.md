# ZingLots Branding Guide

## Brand Colors

- **Primary Red**: `#E53935` - Used for the main logo bolt
- **Background**: `#ffffff` (white) - Clean, professional appearance
- **Text**: `#1f2937` (gray-900) - High contrast for readability

## Logo Usage

### Primary Logo
The ZingLots logo consists of a red bolt icon paired with the "ZingLots" wordmark.

**Logo Files:**
- Source: `public/icons/bolt.svg` (vector, scalable)
- Main navigation: SVG used at 64px (desktop) and 48px (mobile)

### Logo Specifications
- **Colors**: Red bolt (#E53935) with black text
- **Typography**: Bold sans-serif for maximum readability
- **Spacing**: 12px gap between icon and text (desktop), 8px (mobile)
- **Minimum size**: 32px height to maintain legibility

## Icon Set

All icons are generated from the source SVG (`public/icons/bolt.svg`) using the automated generation script.

### PWA / Android Icons
- `android-chrome-192x192.png` (192×192px)
- `android-chrome-512x512.png` (512×512px)

### iOS Icons
- `apple-touch-icon.png` (180×180px)
- `ios-40.png` through `ios-180.png` (various sizes)

### Favicons
- `favicon-16x16.png` (16×16px)
- `favicon-32x32.png` (32×32px)
- `favicon-48x48.png` (48×48px)
- `favicon-64x64.png` (64×64px)

### Social Media Icons
- `social-256.png` (256×256px)
- `social-512.png` (512×512px)
- `social-1024.png` (1024×1024px)

## Regenerating Icons

To regenerate all icon sizes from the source SVG:

```bash
npm run generate:icons
```

This script:
1. Reads the source SVG from `public/icons/bolt.svg`
2. Generates PNG files in all required sizes
3. Maintains transparent backgrounds
4. Ensures consistent quality across all sizes

## File Structure

```
public/
├── icons/
│   ├── bolt.svg                    # Source logo (vector)
│   ├── android-chrome-192x192.png  # PWA icons
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png        # iOS icon
│   ├── favicon-16x16.png           # Browser favicons
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── favicon-64x64.png
│   ├── ios-*.png                   # iOS app icons (various sizes)
│   └── social-*.png                # Social media icons
└── site.webmanifest                # PWA manifest
```

## Usage Guidelines

### Do's
- ✅ Use the red bolt color (#E53935) consistently
- ✅ Maintain proper spacing between icon and text
- ✅ Use vector SVG format when possible for crisp rendering
- ✅ Ensure sufficient contrast against backgrounds
- ✅ Keep the logo proportional when scaling

### Don'ts
- ❌ Don't change the bolt color or modify the SVG shape
- ❌ Don't use the icon without the wordmark in primary branding
- ❌ Don't place the logo on backgrounds with poor contrast
- ❌ Don't stretch or distort the logo proportions
- ❌ Don't use outdated logo files or old branding

## Implementation

The logo is implemented in the main navigation component (`src/components/ZingNav.tsx`) and appears in the browser tab via favicon links in `index.html`.

**Navigation Usage:**
```tsx
<img 
  src="/icons/bolt.svg" 
  alt="ZingLots Bolt Logo" 
  className="h-16 w-16"
/>
<span className="text-3xl font-bold text-gray-900">ZingLots</span>
```

## PWA Integration

The brand icons are fully integrated with Progressive Web App functionality through:
- `site.webmanifest` - Defines app name, colors, and icon references
- HTML meta tags - Links to appropriate favicon sizes
- Apple touch icons - iOS home screen integration

## Maintenance

- **Source file**: Only edit `public/icons/bolt.svg` for logo changes
- **Regeneration**: Run `npm run generate:icons` after any SVG updates
- **Quality check**: Verify all generated icons maintain visual consistency
- **Deployment**: Ensure all icon files are included in production builds

---

*Last updated: August 2025*