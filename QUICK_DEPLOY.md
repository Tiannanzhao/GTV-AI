# Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/tech-nation-app.git
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.railway.app
   ```
   (You'll get this after deploying backend)
6. Click **"Deploy"**

✅ Your frontend will be live at `https://your-app.vercel.app`

### Step 3: Deploy Backend to Railway (Free $5/month credit)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect Python
5. Configure:
   - **Root Directory**: `backend`
   - Railway will auto-create a PostgreSQL database
6. Add Environment Variables in Railway dashboard:
   ```
   DATABASE_URL=<auto-created by Railway>
   ONEROUTER_API_KEY=your-onerouter-key
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   S3_BUCKET_NAME=your-bucket-name
   S3_REGION=us-east-1
   SECRET_KEY=generate-random-secret-here
   CORS_ORIGINS=https://your-app.vercel.app
   ```
7. Railway will auto-deploy

✅ Your backend will be live at `https://your-app.railway.app`

### Step 4: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Go to your project → **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_BACKEND_API_URL` with your Railway URL
4. Redeploy (Vercel will auto-redeploy on next push, or click "Redeploy")

### Step 5: Test Your Deployment

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.railway.app/api/criteria/match`
- Health check: `https://your-app.railway.app/health`

## 🆓 Free Tier Limits

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

### Railway (Backend)
- ✅ $5 free credit/month
- ✅ 500 hours runtime/month
- ✅ 5GB database storage
- ⚠️ After free credit: ~$5-10/month

### Alternative: Render (Backend)
- ✅ Free tier available
- ⚠️ Spins down after 15min inactivity
- ✅ Free PostgreSQL (90 days, then $7/month)

## 💡 Pro Tips

1. **Use Railway for backend** - More reliable than Render free tier
2. **Use Supabase for database** - Better free tier if you want separate DB
3. **Use Cloudflare R2 for storage** - 10GB free, no egress fees
4. **Monitor usage** - Railway shows usage in dashboard

## 🔧 Troubleshooting

### CORS Errors
- Make sure `CORS_ORIGINS` in backend includes your Vercel URL
- Format: `https://your-app.vercel.app` (no trailing slash)

### Database Connection
- Railway auto-creates `DATABASE_URL`
- Check Railway dashboard → Database → Connection string

### Build Failures
- Check build logs in Vercel/Railway dashboard
- Make sure all dependencies are in `requirements.txt` and `package.json`

## 📝 Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure database migrations (Alembic)
3. Set up file storage (S3/R2)
4. Add monitoring (Sentry, etc.)

