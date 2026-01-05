# Import .env File Guide

## 📋 Complete .env File Template

Copy this complete `.env` file and fill in your actual values:

```env
# ============================================
# Real Estate Management System
# Environment Variables Configuration
# ============================================

# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (MySQL for Hostinger)
# Get these from: Hostinger hPanel → Databases → MySQL Databases
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name_here
DB_USER=your_database_user_here
DB_PASSWORD=your_database_password_here

# Session Secret (Generate a random string)
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your-generated-session-secret-key-here-change-this

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

## 🔧 How to Use This File

### Option 1: Import in Hostinger Interface

1. **Copy the template above**
2. **Fill in your actual values** (see below)
3. **In Hostinger Node.js App:**
   - Go to **Environment Variables** section
   - Click **"Add"** for each variable
   - Paste the variable name and value
   - Repeat for all variables

### Option 2: Create .env File on Server

1. **Connect via SSH:**
   ```bash
   ssh your_username@your_domain.com -p 65002
   cd ~/public_html
   ```

2. **Create .env file:**
   ```bash
   nano .env
   ```

3. **Paste the template and fill in values**

4. **Save:** Press `Ctrl+X`, then `Y`, then `Enter`

## 🔑 How to Fill In the Values

### 1. Database Credentials

**Get from Hostinger hPanel:**
- Go to: **Databases** → **MySQL Databases**
- Find your database and copy:
  - **Database Name**: `u123456789_realestate` (example)
  - **Database User**: `u123456789_admin` (example)
  - **Database Password**: (the password you set)

**Update in .env:**
```env
DB_NAME=u123456789_realestate
DB_USER=u123456789_admin
DB_PASSWORD=your_actual_password
```

### 2. Session Secret

**Generate a random secret:**

**On server via SSH:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Or use online generator:**
- Visit: https://randomkeygen.com/
- Use a 64-character random string

**Update in .env:**
```env
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### 3. Application URL

**Update with your actual domain:**
```env
APP_URL=https://propertyhub.subtronz.com
ALLOWED_HOSTS=propertyhub.subtronz.com,www.propertyhub.subtronz.com
```

### 4. Admin Credentials (Optional to Change)

```env
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
ADMIN_EMAIL=admin@propertyhub.subtronz.com
```

## ✅ Complete Example (Filled In)

Here's what a filled-in `.env` file looks like:

```env
NODE_ENV=production
PORT=3000
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456789_realestate
DB_USER=u123456789_admin
DB_PASSWORD=MySecurePassword123!
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
APP_URL=https://propertyhub.subtronz.com
ALLOWED_HOSTS=propertyhub.subtronz.com,www.propertyhub.subtronz.com
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
ADMIN_EMAIL=admin@propertyhub.subtronz.com
```

## 📋 Quick Copy-Paste for Hostinger Interface

If adding in Hostinger interface, add these one by one:

```
NODE_ENV = production
PORT = 3000
DB_ENGINE = mysql
DB_HOST = localhost
DB_PORT = 3306
DB_NAME = [YOUR_DB_NAME]
DB_USER = [YOUR_DB_USER]
DB_PASSWORD = [YOUR_DB_PASSWORD]
SESSION_SECRET = [GENERATE_RANDOM_STRING]
APP_URL = https://propertyhub.subtronz.com
ALLOWED_HOSTS = propertyhub.subtronz.com,www.propertyhub.subtronz.com
MAX_FILE_SIZE = 10485760
UPLOAD_PATH = ./uploads
ADMIN_USERNAME = Ajay
ADMIN_PASSWORD = Ajay@2026
ADMIN_EMAIL = admin@propertyhub.subtronz.com
```

## ⚠️ Important Notes

1. **No spaces around `=` sign** in .env file
2. **No quotes needed** (unless value has spaces)
3. **Keep it secure** - don't commit .env to Git
4. **Restart app** after adding/changing variables

## ✅ After Importing

1. **Save the configuration** in Hostinger
2. **Click "Save and redeploy"**
3. **Wait for deployment**
4. **Check application logs** for errors
5. **Test your website**

---

**Copy the template above, fill in your values, and import!**

