# Docker Deployment & Jetson Configuration Guide

This guide explains how to deploy the Warden Dashboard (Frontend) and the Attendance Express Backend using Docker Compose on any server (VPS, AWS, local server) and how to point your Jetson Nano to it.

## 1. Prerequisites for Deployment
Before deploying, ensure you have Docker and Docker Compose installed on your deployment machine.
Ensure your `.env` files contain the correct production variables.

### Backend Configuration (`attendance-express-backend/.env`)
Your backend relies on external cloud providers. Make sure your `.env` file is fully configured:
- `DATABASE_URL` and `DIRECT_URL` (Supabase Postgres strings)
- `REDIS_URL` (Upstash connection string)
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`

### Frontend Configuration (`warden-dashboard/.env`)
> [!WARNING]
> Because Vite builds static files, the frontend environment variables are **baked in at build time**. 
Before running Docker, you MUST edit `warden-dashboard/.env` and change `VITE_BACKEND_URL` to the public IP or Domain of your hosted backend. 
- Example: `VITE_BACKEND_URL=http://<YOUR_VPS_IP>:3000`

## 2. Deploying with Docker Compose
From the root of this project (where `docker-compose.yml` is located), simply run:

```bash
docker-compose up -d --build
```

### What this does:
1. **Frontend**: Builds the Vite React app into static files and serves them via an ultra-fast Nginx container on port **80**.
2. **Backend**: Installs dependencies, generates the Prisma client, and runs the Node.js Express server on port **3000**.
3. It binds both containers so they automatically restart if the server reboots (`restart: unless-stopped`).

You can now visit your dashboard in your browser at: `http://<YOUR_SERVER_IP>`

---

## 3. Configuring the Jetson Nano

Now that your backend is hosted online and always running, the Jetson Nano no longer needs tunnels like Localtunnel or Serveo. It can directly beam data to the server's public IP address.

### Step A: Start the Edge AI Engine
On the Jetson Nano, start the face detection pipeline as usual:
```bash
python3 edge_daemon.py
```

### Step B: Configure and Start the Bridge
Because we built `edge_bridge.py` to accept the `API_URL` environment variable, you simply export the live endpoint of your new Docker backend before starting it!

```bash
# Replace YOUR_SERVER_IP with the public IP or domain of your Docker server
export API_URL="http://<YOUR_SERVER_IP>:3000/api/v1/events/attendance"

# Run the bridge
python3 edge_bridge.py
```

> [!TIP]
> If you want to make this permanent so you don't have to `export` the URL every time the Jetson reboots, you can simply edit `edge_bridge.py` and hardcode the new URL exactly as we did for Serveo!

---
## Useful Docker Commands

- **Stop the servers**: 
  `docker-compose down`
- **Rebuild after making code changes**: 
  `docker-compose up -d --build`
- **View Backend Logs**: 
  `docker logs -f campus-backend`
- **View Frontend Logs**: 
  `docker logs -f campus-frontend`
