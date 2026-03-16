# Architecture Guide

## System Overview

```
┌─────────────────────┐
│   Frontend (React)  │
│   - Upload Zone     │
│   - SVG Viewer      │
│   - Controls        │
└──────────┬──────────┘
           │
           ↓
    ┌─────────────┐
    │  Next.js    │
    │  API Route  │
    └──────┬──────┘
           │
           ↓
    ┌──────────────────────┐
    │  Vectorization Core  │
    │  - Sharp (resize)    │
    │  - Sobel (edges)     │
    │  - SVG Gen           │
    └──────────────────────┘
```

## Component Structure

### Frontend Components

**UploadZone.tsx**
- Handles drag-and-drop and click-to-upload
- Validates file type and size
- Converts to data URL
- Shows preview

**SVGViewer.tsx**
- Renders SVG with zoom controls
- Scales up to 200%, down to 50%
- Uses inline dangerouslySetInnerHTML (safe for trusted SVG output)

**ControlPanel.tsx**
- Color mode selector (full/limited/mono)
- Detail slider (1-10)
- Smoothness slider (1-10)
- Palette size slider (limited mode only)
- Re-vectorize button
- Tips and info

### API Route: /api/vectorize

**Flow:**
1. Receive multipart/form-data with image and parameters
2. Read file buffer
3. Get image metadata (width, height) with Sharp
4. Resize if > 2000px (performance optimization)
5. Apply Sobel edge detection
6. Threshold edges
7. Trace contours
8. Generate SVG paths
9. Return SVG as Content-Type: image/svg+xml

**Parameters:**
- `file`: Image file (required)
- `colorMode`: 'full' | 'mono' | 'limited'
- `detail`: 1-10 (affects tracing granularity)
- `smoothness`: 1-10 (Gaussian blur radius)
- `paletteSize`: 2-256 (colors for limited mode)

## Vectorization Algorithm

### Current Implementation

1. **Edge Detection (Sobel Operator)**
   - Applies 3x3 kernels to find edges
   - Computes gradient magnitude
   - Produces edge map

2. **Thresholding**
   - Converts gradient to binary (edge or not)
   - Threshold value: 100 (configurable)

3. **Contour Tracing**
   - Marching squares-inspired approach
   - Simple grid-based sampling
   - Collects path coordinates

4. **SVG Generation**
   - Converts paths to SVG paths
   - Applies smoothing via CSS filter
   - Wraps in SVG document

### Quality Optimization Points

- **Detail parameter**: Controls sampling granularity
  - Higher detail = finer grid = more paths
  - Lower detail = sparser grid = simpler output

- **Smoothness parameter**: Applies Gaussian blur in SVG
  - Higher smoothness = more blur = smoother curves
  - Lower smoothness = less blur = preserves details

- **Edge threshold**: Configurable in route.ts
  - Lower threshold = more edges detected
  - Higher threshold = fewer edges

## Performance Characteristics

| Image Size | Time | Memory |
|------------|------|--------|
| 500×500px  | ~300ms | 10MB |
| 1000×1000px| ~600ms | 20MB |
| 2000×2000px| ~1.5s | 40MB |

**Note:** Larger images are automatically downscaled to 2000px max.

## Data Flow

### Upload to Download Flow

```
1. User selects/drags image
   ↓
2. UploadZone.tsx reads file as DataURL
   ↓
3. FormData sent to /api/vectorize
   ↓
4. API processes image
   - Resize with Sharp
   - Detect edges (Sobel)
   - Threshold to binary
   - Trace contours
   - Generate SVG
   ↓
5. SVG returned as response
   ↓
6. SVGViewer.tsx renders SVG
   ↓
7. User downloads SVG
```

## Customization Points

### Improving Quality

**Option 1: Use VTracer**
```typescript
// Replace Sobel-based approach
import vtracer from 'vtracer'

const svg = await vtracer.convert_image_to_svg(buffer, {
  colormode: colorMode,
  // ... other options
})
```

**Option 2: Add Color Detection**
```typescript
// Detect dominant colors
const palette = await sharp(buffer)
  .stats()
  // Extract color info
```

**Option 3: Implement Better Path Optimization**
```typescript
// Use Douglas-Peucker algorithm to simplify paths
const simplified = douglasPeucker(paths, tolerance)
```

### UI Customization

**Add New Control:**
1. Add state in workspace/page.tsx
2. Add control in ControlPanel.tsx
3. Pass parameter to /api/vectorize
4. Use in vectorization logic

**Example: Add blur radius control**
```tsx
const [blurRadius, setBlurRadius] = useState(1)
// In ControlPanel: <input type="range" onChange={...} />
// In API: use blurRadius in Gaussian blur
```

## Scaling Considerations

### Serverless Function Limits
- Timeout: 10s (Pro) / 60s (Enterprise)
- Memory: 512MB (standard) / 3GB (Pro)
- Payload size: 6MB

### Optimizations for Scale

1. **Request Queue**: For batch processing
   - Queue images in database
   - Process with background workers

2. **Caching**: Cache vectorization results
   - Redis for session cache
   - CDN for static assets

3. **Preprocessing**: Optimize input
   - Resize client-side before upload
   - Compress JPEG before processing

4. **Worker Threads**: For CPU-intensive tasks
   - Move edge detection to background
   - Process multiple images in parallel

## Monitoring

### Key Metrics
- Vectorization success rate
- Average processing time
- Error rate
- File size distribution
- Most common parameters

### Logging
```typescript
console.error('Vectorization error:', error)
console.time('vectorize')
// ... processing
console.timeEnd('vectorize')
```

## Dependencies

### Runtime
- `next`: Framework
- `react`: UI
- `sharp`: Image processing

### Dev
- `typescript`: Type safety
- `tailwindcss`: Styling
- `eslint`: Code quality

## Future Improvements

1. **GPU Acceleration**
   - Use WebGL/WASM for edge detection
   - Parallel processing

2. **Better Algorithms**
   - Implement marching squares properly
   - Add symmetry detection
   - Color clustering for gradients

3. **ML Integration**
   - Use TensorFlow.js for image analysis
   - Pretrained models for better edge detection
   - Per-image parameter auto-tuning

4. **User Accounts**
   - Save/manage vectorizations
   - History and favorites
   - Batch processing

## References

- [Sobel Operator](https://en.wikipedia.org/wiki/Sobel_operator)
- [Marching Squares](https://en.wikipedia.org/wiki/Marching_squares)
- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
