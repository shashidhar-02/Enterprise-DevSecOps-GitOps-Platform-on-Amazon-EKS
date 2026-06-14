#!/bin/bash
# ============================================
# CraveDrop Food Delivery Platform - EC2 Setup Script
# Run this script on a fresh Ubuntu EC2 instance
# ============================================

set -e

echo "🛵 Setting up CraveDrop Food Delivery Platform..."
echo "==========================================="

# --- Update system ---
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# --- Install Node.js 20.x ---
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# --- Install PostgreSQL ---
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# --- Install Nginx ---
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# --- Install PM2 (process manager) ---
echo "📦 Installing PM2..."
sudo npm install -g pm2

# --- Configure PostgreSQL ---
echo "🗄️  Configuring PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE USER cravedrop_user WITH PASSWORD 'cravedrop_pass_2026';
CREATE DATABASE cravedrop_db OWNER cravedrop_user;
GRANT ALL PRIVILEGES ON DATABASE cravedrop_db TO cravedrop_user;
\c cravedrop_db
GRANT ALL ON SCHEMA public TO cravedrop_user;
EOF

echo "✅ PostgreSQL configured"

# --- Set up project directory ---
echo "📁 Setting up project..."
sudo mkdir -p /var/www/cravedrop
sudo chown -R $USER:$USER /var/www/cravedrop

# Copy project files (assumes you've transferred them to ~/CraveDrop)
cp -r ~/CraveDrop/* /var/www/cravedrop/

# --- Install backend dependencies & setup .env ---
echo "📦 Installing backend dependencies..."
cd /var/www/cravedrop/backend
npm install --production

echo "⚙️ Creating backend .env file..."
cat <<EOF > .env
DB_USER=cravedrop_user
DB_HOST=localhost
DB_NAME=cravedrop_db
DB_PASSWORD=cravedrop_pass_2026
DB_PORT=5432
PORT=5000
EOF

# --- Build frontend ---
echo "🔨 Building frontend..."
cd /var/www/cravedrop/frontend
npm install
npm run build

# --- Configure Nginx ---
echo "🌐 Configuring Nginx..."
sudo cp /var/www/cravedrop/deploy/cravedrop-nginx.conf /etc/nginx/sites-available/cravedrop
sudo ln -sf /etc/nginx/sites-available/cravedrop /etc/nginx/sites-enabled/cravedrop
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# --- Start backend with PM2 ---
echo "🚀 Starting backend with PM2..."
cd /var/www/cravedrop/backend
pm2 start src/index.js --name cravedrop-backend
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER | tail -1 | sudo bash

echo ""
echo "==========================================="
echo "🎉 CraveDrop is now live and ready for orders!"
echo "==========================================="
echo ""
echo "Access your app at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo '<your-ec2-public-ip>')"
echo ""
echo "Useful commands:"
echo "  pm2 status                   - Check backend status"
echo "  pm2 logs                     - View backend logs"
echo "  pm2 restart all              - Restart backend"
echo "  sudo systemctl restart nginx - Restart Nginx"
echo "  sudo systemctl status nginx  - Check Nginx status"
echo "==========================================="