# Vectorizer.AI Clone

## Overview

A production-ready, AI-powered image-to-SVG converter built with Next.js, TypeScript, and Tailwind CSS. Convert your images to clean, scalable vector graphics instantly.

## Features

✨ **Core Features**
- Drag-and-drop image upload
- Real-time SVG preview with zoom controls
- Multiple color modes (Full Color, Limited Palette, Monochrome)
- Adjustable detail and smoothness controls
- One-click SVG download
- Responsive mobile design
- Dark/light theme support

🚀 **Developer Features**
- TypeScript for type safety
- Clean component architecture
- Fully documented code
- CI/CD ready with GitHub Actions
- Production-optimized serverless design
- Easy to customize and extend

## Tech Stack

```
Frontend:     Next.js 14 + React 18 + TypeScript + Tailwind CSS
Backend:      Serverless API (Sharp + Edge Detection)
Deployment:   Vercel
Package Mgr:  pnpm
```

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run Development Server

```bash
cd apps/web
pnpm dev
```

### 3. Open Browser

```
http://localhost:3000
```

## Deployment to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set root to `apps/web`
4. Deploy!

## Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup guide
- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - Production deployment
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep-dive
- [VECTORIZER_AI_TECH_OVERVIEW.md](./VECTORIZER_AI_TECH_OVERVIEW.md) - Detailed technology overview and implementation playbook

## License

MIT License - feel free to use for personal or commercial purposes.
