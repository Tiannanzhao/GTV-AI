# Deployment Guide

## Frontend: Vercel (Free Tier)

Vercel offers an excellent free tier for Next.js applications with:
- Automatic deployments from Git
- Global CDN
- Serverless functions
- 100GB bandwidth/month
- Unlimited deployments

### Deploy to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Set root directory to `frontend`
   - Vercel will auto-detect Next.js

3. **Environment Variables**:
   Add these in Vercel project settings:
   ```
   NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.railway.app
   NEXTAUTH_SECRET=generate-a-random-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

4. **Deploy**: Click "Deploy" and Vercel will build and deploy automatically

## Backend: Free Tier Options

### Option 1: Railway (Recommended - Free Trial + $5/month after)

Railway offers:
- Free $5 credit monthly (enough for small apps)
- Easy PostgreSQL database
- Simple deployment from GitHub
- Auto-scaling

**Deploy to Railway**:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo, set root to `backend`
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://... (Railway auto-creates)
   ONEROUTER_API_KEY=your-key
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   S3_BUCKET_NAME=your-bucket
   S3_REGION=us-east-1
   SECRET_KEY=your-jwt-secret
   CORS_ORIGINS=https://your-app.vercel.app
   ```
6. Railway will auto-detect Python and deploy

### Option 2: Render (Free Tier Available)

Render offers:
- Free tier with limitations (spins down after inactivity)
- PostgreSQL database
- Easy deployment

**Deploy to Render**:
1. Go to [render.com](https://render.com)
2. Sign up
3. Create "Web Service"
4. Connect GitHub repo
5. Set:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (same as Railway)

### Option 3: Vercel Serverless Functions (Hybrid Approach)

For a fully free solution, you could:
- Use Next.js API routes for some backend logic
- Keep Python backend for PDF generation and AI processing
- Deploy Python backend to Railway/Render free tier

## Database: Free Options

### Option 1: Railway PostgreSQL (Recommended)
- Included with Railway deployment
- Auto-configured
- 5GB storage on free tier

### Option 2: Supabase (Free Tier)
- 500MB database
- PostgreSQL
- Great free tier
- Connection string: `postgresql://user:pass@host:5432/dbname`

### Option 3: Neon (Free Tier)
- Serverless PostgreSQL
- 3GB storage
- Auto-scaling

## File Storage: Free Options

### Option 1: AWS S3 (Free Tier)
- 5GB storage
- 20,000 GET requests
- 2,000 PUT requests
- First 12 months free

### Option 2: Cloudflare R2 (Free Tier)
- 10GB storage
- No egress fees
- S3-compatible API

### Option 3: Backblaze B2 (Free Tier)
- 10GB storage
- 1GB download/day free

## Quick Start Deployment

### 1. Deploy Frontend to Vercel
```bash
cd frontend
# Push to GitHub first
# Then connect to Vercel via web interface
```

### 2. Deploy Backend to Railway
```bash
cd backend
# Push to GitHub
# Connect to Railway via web interface
```

### 3. Set up Database
- Railway: Auto-creates PostgreSQL
- Or use Supabase/Neon for separate database

### 4. Configure Environment Variables
- Frontend (Vercel): Set `NEXT_PUBLIC_BACKEND_API_URL` to Railway URL
- Backend (Railway): Set all backend env vars

### 5. Update CORS
- In backend, set `CORS_ORIGINS` to your Vercel URL

## Cost Summary (Free Tier)

- **Frontend (Vercel)**: Free
- **Backend (Railway)**: $5/month credit (usually enough)
- **Database (Railway/Supabase)**: Free
- **Storage (AWS S3)**: Free for 12 months, then ~$0.023/GB
- **Total**: ~$0-5/month

## Recommended Setup for Production

1. **Frontend**: Vercel (free tier)
2. **Backend**: Railway ($5/month credit)
3. **Database**: Railway PostgreSQL (included)
4. **Storage**: AWS S3 (free tier) or Cloudflare R2

This gives you a production-ready setup with minimal cost!

