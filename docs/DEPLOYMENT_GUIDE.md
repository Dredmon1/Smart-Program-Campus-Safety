# Deployment Guide

## Quick Start (Local Development)

### Option 1: Static File Server (Simplest)
```bash
python run_dashboard.py
```
Opens `http://localhost:8000` automatically. No dependencies required.

### Option 2: Flask API + Dashboard
```bash
# Install Flask
pip install flask flask-cors

# Start API server (Terminal 1)
python api_server.py

# Start dashboard server (Terminal 2)
python run_dashboard.py
```
- Dashboard: `http://localhost:8000`
- API: `http://localhost:5000/api/health`

---

## Docker Deployment

### Prerequisites
- Docker Desktop 4.x+
- Docker Compose v2+

### Build & Run
```bash
# Build and start all services
docker-compose up -d --build

# Verify services
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services
| Service | Port | Description |
|---|---|---|
| Dashboard | 8000 | Static file server |
| API | 5000 | Flask REST API |
| MySQL | 3306 | Database (when enabled) |

---

## Cloud Deployment

### AWS (Recommended)

#### Architecture
```
CloudFront CDN → S3 (Dashboard static files)
                → ALB → ECS Fargate (API containers)
                       → RDS MySQL (Database)
```

#### Steps
1. **S3 + CloudFront** — Upload HTML/CSS/JS to S3, front with CloudFront CDN
2. **ECS Fargate** — Deploy API container using the included `Dockerfile`
3. **RDS MySQL** — Create a `db.t3.micro` instance for development
4. **ALB** — Application Load Balancer routing `/api/*` to ECS, `/*` to S3

#### Environment Variables
```bash
# Required for API server
MYSQL_HOST=your-rds-endpoint.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=scs_admin
MYSQL_PASSWORD=<secure-password>
MYSQL_DATABASE=scs_command
FLASK_ENV=production
SECRET_KEY=<random-32-char-string>
```

#### Estimated Monthly Cost (Dev)
| Resource | Cost |
|---|---|
| S3 + CloudFront | ~$5 |
| ECS Fargate (0.25 vCPU) | ~$12 |
| RDS db.t3.micro | ~$15 |
| ALB | ~$18 |
| **Total** | **~$50/mo** |

### Azure Alternative
- **Azure Static Web Apps** for dashboard
- **Azure Container Instances** for API
- **Azure Database for MySQL** for data

### Google Cloud Alternative
- **Cloud Storage + Cloud CDN** for dashboard
- **Cloud Run** for API (auto-scaling, pay-per-request)
- **Cloud SQL for MySQL** for data

---

## Security Checklist (Production)

- [ ] Enable HTTPS/TLS on all endpoints
- [ ] Set `FLASK_ENV=production`
- [ ] Use strong `SECRET_KEY` (32+ random characters)
- [ ] Enable CORS whitelist (not wildcard `*`)
- [ ] Configure rate limiting on API endpoints
- [ ] Enable WAF (Web Application Firewall)
- [ ] Set up automated backups for MySQL
- [ ] Enable CloudWatch/Azure Monitor logging
- [ ] Rotate database credentials quarterly
- [ ] Run vulnerability scans monthly
