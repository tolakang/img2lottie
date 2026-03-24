# Image2Lottie - Self-Hosted Deployment

## Quick Start

```bash
git clone https://github.com/tolakang/img2lottie.git
cd img2lottie
docker compose up -d
```

Access at: **http://YOUR_IP:5177**

## Ports

| Service | Port |
|---------|------|
| App | **5177** |

## Docker Compose (Recommended)

```yaml
services:
  img2lottie:
    image: ghcr.io/tolakang/img2lottie:latest
    container_name: img2lottie
    ports:
      - "5177:5177"
    restart: unless-stopped
```

## TrueNAS Scale

### Option 1: Docker Compose App
1. Apps → Add Container → Docker Compose
2. Use the docker-compose.yml content

### Option 2: Custom App
Use `truenas-app.yaml` (requires pre-built Docker image)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5177 | Server port |
| `NODE_ENV` | production | Environment mode |

## Build & Run Locally

```bash
# Development
npm install
npm run dev

# Production
docker compose -f docker-compose.prod.yml up -d
```

## Health Check

```bash
curl http://localhost:5177
```

## Troubleshooting

1. **Port conflict**: Change mapping in docker-compose.yml
2. **Permission issues**: Ensure proper file permissions
3. **Build fails**: Check Docker daemon is running
