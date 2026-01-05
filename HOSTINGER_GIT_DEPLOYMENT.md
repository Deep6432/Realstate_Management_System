# Hostinger Git Deployment Guide

Complete guide to deploy your Real Estate Management System to Hostinger using Git.

## 🎯 Overview

This guide will help you set up automatic deployment from GitHub to Hostinger using Git.

## 📋 Prerequisites

- Hostinger hosting account with SSH access enabled
- GitHub repository: `https://github.com/Deep6432/Realstate_Management_System.git`
- Branch: `hostinger`
- SSH access to your Hostinger server

## 🚀 Step-by-Step Git Deployment

### STEP 1: Enable SSH Access on Hostinger

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com

2. **Enable SSH Access**
   - Navigate to **"Advanced"** → **"SSH Access"**
   - Click **"Enable SSH"** or **"Manage SSH"**
   - Note your SSH credentials:
     - **Host**: `your-domain.com` or IP address
     - **Port**: Usually `65002` (check your hPanel)
     - **Username**: Your hosting username
     - **Password**: Your hosting password (or use SSH keys)

3. **Generate SSH Key (Recommended)**
   - In hPanel: **"SSH Access"** → **"SSH Keys"**
   - Generate a new SSH key pair
   - Download the private key
   - Add the public key to authorized_keys

### STEP 2: Connect to Hostinger via SSH

#### Option A: Using Terminal/Command Line

```bash
# Connect to Hostinger
ssh your_username@your_domain.com -p 65002

# Or using SSH key
ssh -i ~/.ssh/hostinger_key your_username@your_domain.com -p 65002
```

#### Option B: Using SSH Client (PuTTY, WinSCP, etc.)

- **Host**: `your-domain.com`
- **Port**: `65002`
- **Username**: Your hosting username
- **Password**: Your hosting password

### STEP 3: Navigate to Your Domain Directory

```bash
# Navigate to public_html (or your domain directory)
cd ~/public_html

# Or if you have multiple domains
cd ~/domains/yourdomain.com/public_html
```

### STEP 4: Initialize Git Repository (First Time Only)

#### Option A: Clone from GitHub

```bash
# Remove existing files (backup first if needed)
cd ~/public_html
rm -rf * .[^.]* 2>/dev/null

# Clone your repository
git clone https://github.com/Deep6432/Realstate_Management_System.git .

# Switch to hostinger branch
git checkout hostinger
```

#### Option B: Initialize and Add Remote

```bash
# If you already have files, initialize Git
cd ~/public_html
git init
git remote add origin https://github.com/Deep6432/Realstate_Management_System.git
git fetch origin
git checkout -b hostinger origin/hostinger
```

### STEP 5: Set Up Environment Variables

```bash
# Create .env file
cd ~/public_html
cp .env.example .env
nano .env  # or use vi/vim
```

**Update `.env` with your production values:**

```env
NODE_ENV=production
PORT=3000

# Database Configuration (from Hostinger MySQL)
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Generate session secret
SESSION_SECRET=your-generated-secret-here

# Application Settings
APP_URL=https://yourdomain.com
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Admin Credentials
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
ADMIN_EMAIL=admin@yourdomain.com
```

**Generate Session Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### STEP 6: Install Dependencies

```bash
cd ~/public_html

# Install production dependencies
npm install --production

# Or install all dependencies
npm install
```

### STEP 7: Set Up Database

1. **Create MySQL Database in Hostinger hPanel**
   - Go to **"Databases"** → **"MySQL Databases"**
   - Create database and user
   - Grant all privileges

2. **Update `.env` with database credentials**

3. **Test Database Connection:**
```bash
node -e "require('./config/database').testConnection().then(() => console.log('✅ DB OK')).catch(err => console.error('❌ DB Error:', err))"
```

### STEP 8: Create Required Directories

```bash
cd ~/public_html

# Create uploads directory
mkdir -p uploads/property_images
chmod -R 755 uploads

# Create logs directory
mkdir -p logs
chmod -R 755 logs

# Set permissions
chmod 644 .env
chmod 644 .htaccess
chmod 644 server.js
```

### STEP 9: Configure Node.js App in Hostinger

1. **In hPanel**: **"Advanced"** → **"Node.js App"**

2. **Create/Configure Application:**
   - **App Directory**: `/public_html` (or full path)
   - **App Startup File**: `server.js`
   - **Node Version**: 18.x or 20.x (latest LTS)
   - **Startup Command**: `node server.js` (or leave empty)

3. **Start Application**: Click **"Start"** or **"Restart"**

### STEP 10: Set Up Auto-Deployment (Optional)

#### Option A: GitHub Webhook (If Hostinger Supports)

1. **Create deployment script:**
```bash
cd ~/public_html
cat > deploy.sh << 'EOF'
#!/bin/bash
cd ~/public_html
git pull origin hostinger
npm install --production
pm2 restart real-estate-app || node server.js
EOF

chmod +x deploy.sh
```

2. **Set up webhook in GitHub:**
   - Go to: https://github.com/Deep6432/Realstate_Management_System/settings/hooks
   - Add webhook pointing to your server

#### Option B: Manual Deployment Script

```bash
cd ~/public_html
cat > update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating application..."
cd ~/public_html
git fetch origin
git checkout hostinger
git pull origin hostinger
npm install --production
echo "✅ Update complete! Restart your Node.js app in hPanel."
EOF

chmod +x update.sh
```

### STEP 11: Test Your Deployment

1. **Visit your domain**: `https://yourdomain.com`
2. **Test pages:**
   - ✅ Homepage loads
   - ✅ Admin login: `/login`
   - ✅ Property listings work
   - ✅ Image uploads work

## 🔄 Updating Your Application

### Manual Update via SSH

```bash
# Connect via SSH
ssh your_username@your_domain.com -p 65002

# Navigate to project
cd ~/public_html

# Pull latest changes
git pull origin hostinger

# Install new dependencies (if any)
npm install --production

# Restart application via hPanel or PM2
pm2 restart real-estate-app
```

### Using Update Script

```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
./update.sh
# Then restart via hPanel Node.js App interface
```

## 🛠️ Using PM2 for Process Management

If you have SSH access, PM2 is recommended:

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
cd ~/public_html
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on server reboot
pm2 startup

# Useful PM2 commands
pm2 status          # Check status
pm2 logs            # View logs
pm2 restart all     # Restart all apps
pm2 stop all        # Stop all apps
```

## 🔒 Security Best Practices

1. **Protect `.env` file:**
```bash
chmod 600 .env
```

2. **Add to `.gitignore`** (already done):
   - `.env`
   - `node_modules/`
   - `uploads/`
   - `logs/`

3. **Use SSH keys instead of passwords**

4. **Keep dependencies updated:**
```bash
npm audit
npm audit fix
```

## 🐛 Troubleshooting

### Git Pull Fails

**Error: "Permission denied"**
```bash
# Check file permissions
ls -la
chmod -R 755 .
chown -R your_username:your_username .
```

**Error: "Merge conflict"**
```bash
# Reset to remote version
git fetch origin
git reset --hard origin/hostinger
```

### Application Not Starting

**Check logs:**
```bash
# PM2 logs
pm2 logs

# Or check Hostinger error logs in hPanel
```

**Check Node.js version:**
```bash
node -v
npm -v
```

### Database Connection Issues

```bash
# Test connection
node -e "require('./config/database').testConnection()"

# Check .env file
cat .env | grep DB_
```

### Static Files Not Loading

```bash
# Check public directory
ls -la public/

# Check .htaccess
cat .htaccess
```

## 📝 Quick Reference Commands

```bash
# Connect to server
ssh your_username@your_domain.com -p 65002

# Navigate to project
cd ~/public_html

# Pull latest changes
git pull origin hostinger

# Install dependencies
npm install --production

# Restart app (PM2)
pm2 restart real-estate-app

# View logs
pm2 logs real-estate-app

# Check status
pm2 status
```

## ✅ Deployment Checklist

- [ ] SSH access enabled on Hostinger
- [ ] Git repository cloned to `public_html`
- [ ] Switched to `hostinger` branch
- [ ] `.env` file created with production values
- [ ] MySQL database created and configured
- [ ] Dependencies installed (`npm install --production`)
- [ ] Required directories created (`uploads/`, `logs/`)
- [ ] File permissions set correctly
- [ ] Node.js app configured in hPanel
- [ ] Application started and running
- [ ] Website accessible at your domain
- [ ] Admin login working
- [ ] Property management working

## 🎉 Success!

Your application is now deployed via Git and will automatically update when you push to the `hostinger` branch!

**Repository**: https://github.com/Deep6432/Realstate_Management_System  
**Branch**: `hostinger`  
**Live URL**: `https://yourdomain.com`

---

**Need Help?** Check the main `HOSTINGER_DEPLOYMENT.md` for more details.

