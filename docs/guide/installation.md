# Installation

This guide covers the complete installation process for self-hosting Discord Ticket SaaS.

## System Requirements

### Minimum Requirements

- **Node.js**: 18.0.0 or higher
- **Memory**: 512MB RAM minimum, 2GB recommended
- **Storage**: 1GB available space
- **Database**: MongoDB 5.0+ or MongoDB Atlas
- **Cache**: Redis 6.0+ or Redis Cloud
- **OS**: Linux, macOS, or Windows with WSL2

### Recommended Production Setup

- **CPU**: 2 vCPUs
- **Memory**: 4GB RAM
- **Storage**: 10GB SSD
- **Network**: 1Gbps connection
- **Load Balancer**: NGINX or Cloudflare
- **SSL**: Let's Encrypt or commercial certificate

## Prerequisites

Before installation, ensure you have:

1. **Node.js and npm**:
   ```bash
   # Install Node.js (using NodeSource repository)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version  # Should be 18.0.0+
   npm --version
   ```

2. **MongoDB** (local or Atlas):
   ```bash
   # Local MongoDB installation (Ubuntu/Debian)
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Redis** (local or cloud):
   ```bash
   # Local Redis installation
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

4. **Git**:
   ```bash
   sudo apt-get install git
   ```

## Installation Methods

### Method 1: Direct Installation

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Legacy-DEV-Team/TicketSystem.git
cd TicketSystem

# Check out the latest stable release
git checkout tags/v1.0.0
```

#### 2. Install Dependencies

```bash
# Install dependencies for all packages
npm install

# If using pnpm (recommended for development)
npm install -g pnpm
pnpm install
```

#### 3. Environment Configuration

```bash
# Copy environment templates
cp .env.example .env
cp packages/bot/.env.example packages/bot/.env
cp packages/web/.env.example packages/web/.env
```

Edit the `.env` files with your configuration:

```bash
# Root .env
NODE_ENV=production
LOG_LEVEL=info

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ticket-system
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket-system

# Redis Configuration
REDIS_URL=redis://localhost:6379
# or for Redis Cloud:
# REDIS_URL=redis://username:password@host:port

# Bot Configuration (packages/bot/.env)
BOT_WEBHOOK_PORT=3001

# Web Configuration (packages/web/.env)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret-here
BOT_WEBHOOK_URL=http://localhost:3001
```

#### 4. Build the Application

```bash
# Build all packages
npm run build

# Or build individually
npm run build:shared
npm run build:bot
npm run build:web
```

#### 5. Database Setup

```bash
# Start MongoDB (if local)
sudo systemctl start mongod

# Start Redis (if local)
sudo systemctl start redis-server

# The application will automatically create collections and indexes on first run
```

### Method 2: Docker Installation

#### 1. Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/Legacy-DEV-Team/TicketSystem.git
cd TicketSystem

# Copy and edit environment file
cp docker-compose.env.example docker-compose.env
# Edit docker-compose.env with your configuration

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 2. Manual Docker Setup

```bash
# Build images
docker build -f docker/Dockerfile.bot -t discord-ticket-bot .
docker build -f docker/Dockerfile.web -t discord-ticket-web .

# Create network
docker network create discord-ticket-network

# Start MongoDB
docker run -d --name mongodb --network discord-ticket-network \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:6.0

# Start Redis
docker run -d --name redis --network discord-ticket-network \
  -p 6379:6379 \
  redis:7-alpine

# Start Bot
docker run -d --name discord-bot --network discord-ticket-network \
  -p 3001:3001 \
  --env-file packages/bot/.env \
  discord-ticket-bot

# Start Web Panel
docker run -d --name discord-web --network discord-ticket-network \
  -p 3000:3000 \
  --env-file packages/web/.env \
  discord-ticket-web
```

## Process Management

### Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'discord-ticket-bot',
      script: 'packages/bot/dist/index.js',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/bot-error.log',
      out_file: './logs/bot-out.log',
      log_file: './logs/bot-combined.log',
      time: true
    },
    {
      name: 'discord-ticket-web',
      script: 'packages/web/server.js',
      cwd: process.cwd(),
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_file: './logs/web-combined.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command

# Monitor applications
pm2 monit

# View logs
pm2 logs

# Restart applications
pm2 restart all

# Stop applications
pm2 stop all
```

### Using Systemd Services

```bash
# Create systemd service for bot
sudo cat > /etc/systemd/system/discord-ticket-bot.service << 'EOF'
[Unit]
Description=Discord Ticket Bot
After=network.target mongodb.service redis.service

[Service]
Type=simple
User=discord-ticket
WorkingDirectory=/opt/ticket-system
ExecStart=/usr/bin/node packages/bot/dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/opt/ticket-system/.env

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for web
sudo cat > /etc/systemd/system/discord-ticket-web.service << 'EOF'
[Unit]
Description=Discord Ticket Web Panel
After=network.target mongodb.service redis.service

[Service]
Type=simple
User=discord-ticket
WorkingDirectory=/opt/ticket-system
ExecStart=/usr/bin/node packages/web/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/opt/ticket-system/.env

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start services
sudo systemctl daemon-reload
sudo systemctl enable discord-ticket-bot discord-ticket-web
sudo systemctl start discord-ticket-bot discord-ticket-web

# Check status
sudo systemctl status discord-ticket-bot
sudo systemctl status discord-ticket-web

# View logs
sudo journalctl -u discord-ticket-bot -f
sudo journalctl -u discord-ticket-web -f
```

## Web Server Configuration

### NGINX Configuration

```nginx
# /etc/nginx/sites-available/ticket-system
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Bot webhook endpoint
    location /webhook/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /transcripts/ {
        alias /opt/ticket-system/transcripts/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/ticket-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (already configured, but verify)
sudo crontab -l | grep certbot
# Should show: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Post-Installation

### 1. Verify Installation

```bash
# Check if services are running
pm2 status
# or
sudo systemctl status discord-ticket-bot discord-ticket-web

# Check database connections
mongosh --eval "db.runCommand({ping:1})"
redis-cli ping

# Check web access
curl -I https://yourdomain.com
```

### 2. Initial Configuration

1. Access the admin panel: `https://yourdomain.com/admin`
2. Configure system settings (Discord bot tokens, payment providers)
3. Test bot functionality in a Discord server

### 3. Monitoring Setup

```bash
# Install monitoring tools
npm install -g @ticket-system/monitoring

# Setup health checks
cat > /opt/ticket-system/health-check.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:3000/api/health || exit 1
curl -f http://localhost:3001/health || exit 1
EOF

chmod +x /opt/ticket-system/health-check.sh

# Add to crontab for monitoring
echo "*/5 * * * * /opt/ticket-system/health-check.sh" | crontab -
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 3001 are available
2. **Database connection**: Verify MongoDB and Redis are running
3. **Permissions**: Ensure the application user has read/write access to files
4. **Firewall**: Open necessary ports (80, 443, 3000, 3001)

### Log Locations

- **PM2 logs**: `~/.pm2/logs/`
- **Systemd logs**: `journalctl -u service-name`
- **Application logs**: `logs/` directory in project root
- **NGINX logs**: `/var/log/nginx/`

### Performance Tuning

```bash
# Increase file descriptor limits
echo "discord-ticket soft nofile 65536" >> /etc/security/limits.conf
echo "discord-ticket hard nofile 65536" >> /etc/security/limits.conf

# Optimize MongoDB
# Edit /etc/mongod.conf:
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1

# Optimize Redis
# Edit /etc/redis/redis.conf:
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Next Steps

After successful installation:

1. **[Configure the system](/guide/configuration)** - Set up Discord bot and payment providers
2. **[Set up monitoring](/deployment/monitoring)** - Configure alerts and health checks
3. **[Security hardening](/deployment/security)** - Additional security measures
4. **[Backup strategy](/deployment/backup)** - Data protection and recovery