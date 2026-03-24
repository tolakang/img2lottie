# Image2Lottie - Self-Hosted Deployment

## TrueNAS Scale Installation

### Option 1: Docker Compose (Recommended)

1. SSH into your TrueNAS Scale server
2. Create a directory for the app:
   ```bash
   mkdir -p /mnt/pool/apps/img2lottie
   cd /mnt/pool/apps/img2lottie
   ```

3. Copy these files to that directory:
   - `docker-compose.yml`
   - `Dockerfile`
   - `Dockerfile.prod`
   - `frontend/` directory (with Dockerfile and nginx.conf)

4. Build and run:
   ```bash
   docker compose up -d
   ```

5. Access at `http://YOUR_IP:8080`

### Option 2: Manual Docker

```bash
# Build images
docker build -t img2lottie-backend -f Dockerfile .
docker build -t img2lottie-frontend -f frontend/Dockerfile .

# Run containers
docker run -d -p 8080:80 --name img2lottie-frontend img2lottie-frontend
docker run -d -p 3001:3001 --name img2lottie-backend img2lottie-backend
```

### Option 3: Kubernetes/Helm

```bash
kubectl apply -f k8s-deployment.yaml
```

## Quick Start with Docker

```bash
# Clone and run
git clone https://github.com/YOUR_USERNAME/img2lottie.git
cd img2lottie
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8080 | Server port |
| `NODE_ENV` | production | Environment mode |

## Storage

For persistent data, mount volumes:
- `/data` - App data storage

## SSL/HTTPS

For SSL termination, use a reverse proxy like Traefik or Nginx:

```yaml
services:
  traefik:
    image: traefik:v2.10
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.yml:/traefik.yml
```

## Health Check

```bash
curl http://localhost:8080/health
```

## Troubleshooting

1. **Container won't start**: Check logs with `docker logs <container_name>`
2. **Port conflicts**: Change port mapping in docker-compose.yml
3. **Permission issues**: Ensure proper file permissions on mounted volumes
