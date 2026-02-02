# NeuroLeaf Cloud Deployment Guide 🚀

## Overview

This guide will walk you through deploying NeuroLeaf to:
- **Frontend**: Vercel (Free tier)
- **Backend + Database**: Render (Free tier)
- **Redis Cache**: Upstash (Free tier, optional)

**Total Cost: $0/month** (on free tiers)

---

## Part 1: Deploy Database & Backend to Render

### Step 1.1: Create Render Account
1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended for easy repo connection)

### Step 1.2: Deploy via Blueprint (Recommended)
1. Go to **[render.com/new](https://dashboard.render.com/new)**
2. Click **"Blueprint"**
3. Connect your GitHub repository: `mew228/NeuroLeaf`
4. Render will detect the `render.yaml` file automatically
5. Click **"Apply"** to create both the backend service and PostgreSQL database

### Step 1.3: Configure Environment Variables
After the services are created:
1. Go to your **neuroleaf-api** service
2. Click **"Environment"** in the sidebar
3. Add these required variables:
   ```
   OPENAI_API_KEY = sk-proj-your-openai-api-key
   ```
4. The `DATABASE_URL` and `SECRET_KEY` are auto-generated

### Step 1.4: Run Database Migrations
1. In your **neuroleaf-api** service, go to **"Shell"**
2. Run:
   ```bash
   alembic upgrade head
   ```

### Step 1.5: Verify Backend is Running
1. Copy your backend URL (e.g., `https://neuroleaf-api.onrender.com`)
2. Visit `https://neuroleaf-api.onrender.com/health`
3. You should see: `{"status": "healthy"}`

---

## Part 2: Deploy Frontend to Vercel

### Step 2.1: Create Vercel Account
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Start Deploying"**
3. Sign up with **GitHub** (recommended)

### Step 2.2: Import Your Project
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import"** next to `mew228/NeuroLeaf`
3. Set the **Root Directory** to: `frontend`
4. Framework Preset: **Next.js** (auto-detected)

### Step 2.3: Configure Environment Variables
Before deploying, add these environment variables:
```
NEXT_PUBLIC_API_URL = https://neuroleaf-api.onrender.com/api/v1
```
(Replace with your actual Render backend URL)

### Step 2.4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build
3. Your app will be live at: `https://neuroleaf.vercel.app` (or similar)

---

## Part 3: Update CORS Settings (Important!)

After getting your Vercel URL, update your Render backend:

1. Go to your **neuroleaf-api** service on Render
2. Go to **"Environment"**
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS = https://your-app.vercel.app
   ```
4. The service will automatically redeploy

---

## Part 4: (Optional) Add Redis with Upstash

For improved caching and future Celery support:

### Step 4.1: Create Upstash Account
1. Go to **[upstash.com](https://upstash.com)**
2. Sign up (free)

### Step 4.2: Create Redis Database
1. Click **"Create Database"**
2. Name: `neuroleaf-cache`
3. Region: Select closest to your Render region (Oregon = US-West)
4. Type: **Regional** (free)

### Step 4.3: Get Connection String
1. Copy the **Redis URL** (starts with `redis://...`)
2. Add it to your Render backend environment:
   ```
   REDIS_URL = redis://default:xxx@xxx.upstash.io:6379
   ```

---

## Part 5: Verify Deployment

### Checklist:
- [ ] Backend health check passes: `https://your-api.onrender.com/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] User registration works
- [ ] Login works
- [ ] Journal entries save correctly
- [ ] AI analysis generates reflections

---

## Troubleshooting

### Backend returns 500 errors
- Check the Render logs: **Dashboard → neuroleaf-api → Logs**
- Ensure `OPENAI_API_KEY` is set correctly
- Run database migrations if not done

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Ensure `ALLOWED_ORIGINS` includes your Vercel domain
- Check for CORS errors in browser console

### Database connection issues
- The database takes a few minutes to provision initially
- Check that `DATABASE_URL` is auto-populated from the database

---

## Production URLs

After deployment, your app will be available at:

| Service | URL |
|---------|-----|
| Frontend | `https://neuroleaf.vercel.app` |
| Backend API | `https://neuroleaf-api.onrender.com` |
| API Docs | `https://neuroleaf-api.onrender.com/docs` |

---

## 🎉 Congratulations!

Your mental wellness platform is now live and accessible worldwide!

### Next Steps:
1. **Custom Domain**: Add your own domain in Vercel settings
2. **SSL**: Already included (free) with both Vercel and Render
3. **Monitoring**: Add Sentry DSN for error tracking
4. **Analytics**: Consider adding Vercel Analytics (free tier available)
