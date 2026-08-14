# Render & Vercel Deployment Guide

Deploying to Render (Backend) and Vercel (Frontend) is completely free and automatically updates whenever you push code to GitHub.

## Part 1: Deploying the Backend on Render
1. Go to [Render.com](https://render.com) and sign up with GitHub.
2. Click **New > Web Service**.
3. Select **"Build and deploy from a Git repository"** and select your `Campus-Monitoring-system` repository.
4. Configure the Web Service:
   - **Name**: `attendance-backend` (or whatever you like)
   - **Root Directory**: `attendance-express-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add these exactly as they appear in your `.env` file:
   - `DATABASE_URL` = (Your Supabase URL)
   - `DIRECT_URL` = (Your Supabase Direct URL)
   - `REDIS_URL` = (Your Upstash URL)
   - `TELEGRAM_BOT_TOKEN` = (Your Token)
   - `TELEGRAM_CHAT_ID` = (Your Chat ID)
   - `JETSON_API_KEY` = `JETSON_DEV_KEY`
6. Click **Create Web Service**. Wait 2-3 minutes for it to build.
7. Once live, copy your new URL at the top left (e.g., `https://attendance-backend-xyz.onrender.com`).

---

## Part 2: Deploying the Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2. Click **Add New > Project** and import the `Campus-Monitoring-system` repository.
3. Configure the Project:
   - **Project Name**: `warden-dashboard`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `warden-dashboard`.
4. Open the **Environment Variables** dropdown and add:
   - **Name**: `VITE_BACKEND_URL` 
   - **Value**: *(Paste the Render URL you copied in Part 1! Do NOT include a trailing slash)*
5. Click **Deploy**. Wait about 1 minute.
6. Click the preview screen to visit your live dashboard!

---

## Part 3: Pointing the Jetson Nano to Render
Now that your backend is hosted online permanently, your Jetson Nano just needs to know the new address!

On your Jetson Nano, open `edge_bridge.py` using `nano`:
```bash
nano edge_bridge.py
```

Find the `API_URL` line (around line 13):
```python
API_URL = os.getenv('API_URL', 'https://e0387a7a9a029076-152-58-58-177.serveousercontent.com/api/v1/events/attendance')
```

Change the URL to your brand new Render URL, exactly like this:
```python
API_URL = os.getenv('API_URL', 'https://attendance-backend-xyz.onrender.com/api/v1/events/attendance')
```

Save the file, run `python3 edge_bridge.py`, and your Jetson will seamlessly beam data straight to your hosted cloud backend!
