# Environment Variables Setup Guide for Hostinger

## 🔴 Why 503 Error? Missing Environment Variables!

The 503 error is likely because:
1. **`.env` file doesn't exist** on the server
2. **Environment variables are not configured** correctly
3. **Database credentials are wrong** or missing

## ✅ Quick Fix: Create .env File on Server

### Option 1: Using SSH (Recommended)

```bash
# 1. Connect to your server
ssh your_username@your_domain.com -p 65002

# 2. Navigate to your project
cd ~/public_html

# 3. Run the setup script
./setup-env.sh

# 4. Edit .env file with your actual values
nano .env
```

### Option 2: Using Hostinger File Manager

1. **Log in to Hostinger hPanel**
2. Go to **"Files"** → **"File Manager"**
3. Navigate to `public_html`
4. **Create new file** named `.env`
5. Copy the content from `.env.example` below
6. **Edit with your actual values**

## 📋 Required Environment Variables

### Complete .env File Template

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (Get these from Hostinger MySQL)
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name_here
DB_USER=your_database_user_here
DB_PASSWORD=your_database_password_here

# Session Secret (Generate a random string)
SESSION_SECRET=your-generated-random-secret-key-here

# Application Settings
APP_URL=https://propertyhub.subtronz.com
ALLOWED_HOSTS=propertyhub.subtronz.com,www.propertyhub.subtronz.com

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Admin User Credentials
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
ADMIN_EMAIL=admin@propertyhub.subtronz.com
```

## 🔑 How to Get Database Credentials

1. **Log in to Hostinger hPanel**
2. Go to **"Databases"** → **"MySQL Databases"**
3. Find your database and note:
   - **Database Name**: `u123456789_realestate` (example)
   - **Database User**: `u123456789_admin` (example)
   - **Database Password**: (the password you set)
   - **Database Host**: Usually `localhost`

4. **Update your `.env` file** with these values

## 🔐 Generate Session Secret

**On your server via SSH:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Or use any random string generator** (at least 32 characters)

## ✅ Verification Steps

### 1. Check if .env exists
```bash
cd ~/public_html
ls -la .env
```

### 2. Verify .env contents
```bash
cat .env
```

### 3. Test database connection
```bash
node -e "require('./config/database').testConnection().then(() => console.log('✅ DB OK')).catch(err => console.error('❌ DB Error:', err.message))"
```

### 4. Check all required variables
```bash
./setup-env.sh
```

## 🚨 Common Issues

### Issue 1: .env file doesn't exist
**Solution:**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

### Issue 2: Database connection fails
**Check:**
- Database name is correct
- Database user has permissions
- Password is correct
- Database exists in Hostinger

### Issue 3: Wrong database host
**For Hostinger, use:**
```env
DB_HOST=localhost
```

### Issue 4: Session secret not set
**Generate one:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Step-by-Step Setup

### Step 1: Create .env File

**Via SSH:**
```bash
cd ~/public_html
cp .env.example .env
```

**Via File Manager:**
- Create new file `.env` in `public_html`
- Copy content from `.env.example`

### Step 2: Get Database Credentials

1. Hostinger hPanel → Databases → MySQL Databases
2. Note your database name, user, and password

### Step 3: Edit .env File

**Via SSH:**
```bash
nano .env
```

**Update these values:**
```env
DB_NAME=your_actual_database_name
DB_USER=your_actual_database_user
DB_PASSWORD=your_actual_database_password
SESSION_SECRET=your-generated-secret
APP_URL=https://propertyhub.subtronz.com
```

### Step 4: Save and Restart

**Save the file** (Ctrl+X, then Y, then Enter in nano)

**Restart application in Hostinger hPanel:**
1. Go to Advanced → Node.js App
2. Click **Stop**
3. Wait 5 seconds
4. Click **Start**

## ✅ Verification Checklist

- [ ] `.env` file exists in `public_html`
- [ ] `DB_NAME` is set to your actual database name
- [ ] `DB_USER` is set to your actual database user
- [ ] `DB_PASSWORD` is set to your actual database password
- [ ] `SESSION_SECRET` is set (not the default placeholder)
- [ ] `NODE_ENV=production`
- [ ] `APP_URL` matches your domain
- [ ] Database connection test passes
- [ ] Application restarted after .env changes

## 🎯 Quick Commands

```bash
# Create .env from template
cp .env.example .env

# Edit .env
nano .env

# Check .env contents
cat .env

# Test database connection
node -e "require('./config/database').testConnection().then(() => console.log('✅ OK')).catch(e => console.error('❌', e.message))"

# Verify all variables
./setup-env.sh
```

## 🆘 Still Getting 503?

After setting up `.env`:

1. **Restart the application** in Hostinger hPanel
2. **Check error logs** in hPanel → Node.js App → Logs
3. **Verify database connection** works
4. **Check file permissions**: `chmod 644 .env`

---

**The `.env` file is CRITICAL for your app to work!** Make sure it exists and is configured correctly.

