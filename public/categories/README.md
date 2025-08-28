# Category Images Guide

## Image Requirements

### Recommended Specifications:
- **Format**: JPEG or WebP (for better compression)
- **Dimensions**: 600x400px (3:2 aspect ratio) or 800x600px (4:3 aspect ratio)
- **File Size**: Keep under 200KB for optimal loading
- **Quality**: 80-85% JPEG quality is usually sufficient

### Naming Convention:
Use lowercase, hyphenated names that match the category ID:
- `construction.jpg`
- `restaurant.jpg`
- `office.jpg`
- `municipal.jpg`
- `industrial.jpg`
- `vehicles.jpg`
- `blacksmithing.jpg`
- `jewelry-making.jpg`

## How to Add New Category Images

1. **Prepare your image**:
   - Resize to 600x400px or 800x600px
   - Optimize file size (use tools like TinyPNG or ImageOptim)
   - Ensure good contrast for text overlay readability

2. **Add to this directory**:
   ```bash
   cp your-image.jpg public/categories/category-name.jpg
   ```

3. **Update the code**:
   Edit `src/pages/ModernIndex.tsx` and `src/pages/Index.tsx`:
   ```javascript
   {
     id: "your-category-id",
     name: "Your Category",
     image: "/categories/your-category.jpg", // <- Your local image
     // ... other properties
   }
   ```

## Image Optimization Tips

### Using ImageMagick:
```bash
# Resize and optimize a JPEG
convert input.jpg -resize 600x400^ -gravity center -extent 600x400 -quality 85 output.jpg

# Convert to WebP for better compression
convert input.jpg -resize 600x400^ -gravity center -extent 600x400 -quality 85 output.webp
```

### Using FFmpeg:
```bash
# Resize and optimize
ffmpeg -i input.jpg -vf scale=600:400:force_original_aspect_ratio=increase,crop=600:400 -q:v 2 output.jpg
```

## Current Categories

| Category | File | Status |
|----------|------|--------|
| Construction | construction.jpg | ✅ Exists |
| Restaurant | restaurant.jpg | ✅ Exists |
| Office | office.jpg | ✅ Exists |
| Municipal | municipal.jpg | ✅ Exists |
| Industrial | industrial.jpg | ✅ Exists |
| Vehicles | vehicles.jpg | ✅ Exists |
| Blacksmithing | blacksmithing.jpg | ❌ Needs image |
| Jewelry Making | jewelry-making.jpg | ❌ Needs image |

## Fallback Images

If an image fails to load, the system will show a placeholder. Consider adding a generic fallback image:
- `fallback.jpg` - Generic auction/marketplace image

## Performance Considerations

- Use lazy loading (already implemented in the code)
- Consider using WebP format with JPEG fallback
- Implement responsive images with srcset for different screen sizes
- Use a CDN for production deployment