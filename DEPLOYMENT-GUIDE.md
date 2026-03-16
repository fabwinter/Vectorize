# Deployment Guide

## Vercel Deployment (Recommended)

### Why Vercel?

✅ One-click deployment from GitHub
✅ Free tier covers 1-10k vectorizations/day
✅ Auto-scaling and CDN included
✅ Environment variables managed in dashboard
✅ Automatic HTTPS and domain

### Prerequisites

- Code pushed to GitHub
- Vercel account (free at vercel.com)

### Deployment Steps

#### 1. Create Vercel Account

Visit [vercel.com](https://vercel.com) and sign up with GitHub.

#### 2. Import Project

1. Click "New Project"
2. Select your GitHub repository
3. Vercel auto-detects Next.js

#### 3. Configure Build

**Project Settings:**

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Build Command | `pnpm install && pnpm build` |
| Output Directory | `.next` |

#### 4. Add Environment Variables

In Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

#### 5. Deploy!

```bash
git push origin main
```

Vercel automatically deploys on every push to main.

✅ **Your app is live!**

Default URL: `https://vectorize-abc123.vercel.app`

### Custom Domain

1. In Vercel dashboard: "Settings" → "Domains"
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. Wait for SSL certificate (5-10 minutes)

## Alternative Deployments

### Railway.app

1. Connect GitHub in [railway.app](https://railway.app)
2. Select repository
3. Configure environment
4. Deploy

**Pricing:** Free tier + pay-as-you-go

### Render

1. Sign up at [render.com](https://render.com)
2. Connect GitHub
3. Create new Web Service
4. Configure:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `cd apps/web && pnpm start`
5. Deploy

**Pricing:** $7/month minimum

### Docker (Self-Hosted)

**Build Docker image:**

```dockerfile
# Dockerfile in apps/web
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

**Build and run:**

```bash
docker build -t vectorizer .
docker run -p 3000:3000 vectorizer
```

**Deploy to Docker Hub:**

```bash
docker tag vectorizer username/vectorizer:1.0
docker push username/vectorizer:1.0
```

## Environment Configuration

### Production Variables

Create `apps/web/.env.production`:

```
NEXT_PUBLIC_API_URL=https://your-production-domain.com
NODE_ENV=production
```

### Performance Optimization

**Vercel automatically:**
- Minifies code
- Splits bundles
- Optimizes images
- Compresses with Brotli

## Monitoring

### Vercel Analytics

In Vercel dashboard:
- Real-time logs
- Performance metrics
- Error tracking
- Deployment history

## Troubleshooting

### Build Fails on Vercel

**Check:**
1. Root directory is `apps/web`
2. All dependencies in `package.json`
3. No local environment variables used
4. Build command is correct

### 502 Bad Gateway

**Solution:**
1. Check function logs in Vercel dashboard
2. Verify API endpoint is responding
3. Check image processing isn't timing out

### Slow Vectorization

**Optimization:**
- Reduce image size limit
- Add request timeout
- Implement queue system for large batches

## Security

### Environment Variables

✅ Store in Vercel dashboard
❌ Never commit `.env` files

### CORS

Vercel auto-handles same-origin requests.

For cross-origin:

```typescript
// app/api/vectorize/route.ts
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Input Validation

Always validate uploads:

```typescript
if (!file.type.startsWith('image/')) {
  throw new Error('Invalid file type')
}
if (file.size > 5 * 1024 * 1024) {
  throw new Error('File too large')
}
```

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Railway Docs](https://docs.railway.app/)
- GitHub Issues
