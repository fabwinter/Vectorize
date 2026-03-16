# Quick Start Guide

## 5-Minute Setup

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### Step 1: Clone and Install (2 min)

```bash
# Clone the repository
git clone https://github.com/fabwinter/Vectorize.git
cd Vectorize

# Install dependencies
pnpm install
```

### Step 2: Run Locally (1 min)

```bash
# Navigate to web app
cd apps/web

# Start development server
pnpm dev
```

Server runs on: `http://localhost:3000`

### Step 3: Test Upload (2 min)

1. Go to `http://localhost:3000/workspace`
2. Drag an image onto the upload area
3. Watch it vectorize!
4. Adjust sliders to see changes
5. Click "Download SVG" to save

## Customization Examples

### Example 1: Change Primary Color

**File:** `apps/web/tailwind.config.ts`

Find this section:
```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#0ea5e9',  // ← Change this
    600: '#0284c7',  // ← And this
  }
}
```

Change to your colors:
```typescript
colors: {
  primary: {
    50: '#fff0f5',   // Light pink
    500: '#ff1493',  // Deep pink
    600: '#ff69b4',  // Hot pink
  }
}
```

### Example 2: Add Your Logo

**File:** `apps/web/app/workspace/page.tsx`

Find:
```tsx
<svg className="w-8 h-8 text-primary-500" viewBox="...">
```

Replace with:
```tsx
<img src="/your-logo.png" className="w-8 h-8" alt="Logo" />
```

Place your logo in `apps/web/public/your-logo.png`

### Example 3: Change Default Detail Level

**File:** `apps/web/app/workspace/page.tsx`

Find:
```tsx
const [detail, setDetail] = useState(5)
```

Change to:
```tsx
const [detail, setDetail] = useState(7)  // Higher default
```

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `apps/web`
5. Click "Deploy"

✅ Your app is live!

## Common Tasks

### Add a New Feature

1. Create a new component in `apps/web/components/`
2. Import in `app/workspace/page.tsx`
3. Add to the UI
4. Test locally with `pnpm dev`

### Change Upload Size Limit

**File:** `apps/web/components/UploadZone.tsx`

Find:
```typescript
if (file.size > 5 * 1024 * 1024) {  // 5MB
```

Change to:
```typescript
if (file.size > 20 * 1024 * 1024) {  // 20MB
```

### Improve Vectorization Quality

Edit `apps/web/app/api/vectorize/route.ts`:

```typescript
// Increase edge detection sensitivity
const threshold = 100  // Lower for more sensitivity

// Or add post-processing
const smoothingPasses = detail  // More detail = more passes
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 pnpm dev
```

Then visit: `http://localhost:3001`

### Dependencies Won't Install

```bash
# Clear cache and try again
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Vectorization Takes Too Long

- Try a smaller image
- Reduce detail level in UI
- Check internet connection

## Next Steps

✅ Running locally? Great!

**Now try:**
1. Upload a logo and adjust settings
2. Deploy to Vercel (takes 2 minutes)
3. Share your deployed link!

**Want more?**
- Check `ARCHITECTURE.md` for technical details
- Read `DEPLOYMENT-GUIDE.md` for production setup
- Explore code in `app/api/vectorize/route.ts`

## Support

**Having issues?**

1. Check console: DevTools → Console tab
2. Review error message
3. Check file size and format
4. Restart dev server

**Still stuck?** Create a GitHub issue!
