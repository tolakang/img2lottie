# Image2Lottie - TrueNAS Installation Guide

## Quick Install (Recommended)

### Method 1: DockGe / DockProm (Easiest)

1. Open DockGe or DockProm on your TrueNAS
2. Click **"Create Stack"** or **"Add Stack"**
3. Name: `img2lottie`
4. Paste this configuration:

```yaml
services:
  img2lottie:
    image: docker.io/tolakang/img2lottie:latest
    container_name: img2lottie
    restart: unless-stopped
    ports:
      - "5177:5177"
    environment:
      - NODE_ENV=production
      - PORT=5177
```

5. Click **Deploy** / **Create**

---

### Method 2: TrueNAS Docker Compose App

1. Apps → Add Container → Docker Compose
2. Name: `img2lottie`
3. Repository/Compose: paste the `docker-compose.yaml` content
4. Click **Deploy**

---

### Method 3: TrueNAS Custom App (Advanced)

1. Apps → Add Custom App
2. Name: `img2lottie`
3. Container Image: `docker.io/tolakang/img2lottie:latest`
4. Port Forwarding: `5177:5177`
5. Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5177`
6. Click **Deploy**

---

## Access the App

After deployment, access at:
```
http://YOUR_NAS_IP:5177
```

---

## Features

- **Converter**: Upload PNG, JPG, WebP, SVG → Convert to Lottie animation
- **Viewer**: Preview Lottie JSON files with full playback controls
- **Speed Control**: 0.25x to 3x speed + FPS slider (1-100)
- **Frame Navigation**: Step through frames one by one
- **Background Toggle**: Dark/Light/Transparent
- **Sample Animations**: Built-in demos for testing
- **Keyboard Shortcuts**: Space=Play, ←→=Frame, ↑↓=Speed

---

## Troubleshooting

### Port 5177 not working?
Check if port 5177 is already in use:
```bash
docker ps | grep img2lottie
```

### Image pull fails?
Make sure Docker Hub is accessible from your network.

### App not loading?
Check logs:
```bash
docker logs img2lottie
```

---

## Update Image

To update to the latest version:

1. Pull latest image:
```bash
docker pull docker.io/tolakang/img2lottie:latest
```

2. Restart container:
```bash
docker restart img2lottie
```

Or redeploy from DockGe/DockProm.
