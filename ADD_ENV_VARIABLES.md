# Add Environment Variables in Hostinger

## ⚠️ CRITICAL: Environment Variables Missing!

Your configuration shows **"Environment Variables: None"** - this needs to be fixed!

## ✅ Current Configuration (Looks Good!)

- ✅ Framework preset: **Express** (Correct!)
- ✅ Branch: **hostinger** (Correct!)
- ✅ Node version: **18.x** (Correct!)
- ✅ Root directory: **./** (Correct!)
- ✅ Entry file: **server.js** (Correct!)
- ✅ Package manager: **npm** (Correct!)
- ❌ **Environment Variables: None** ← **NEEDS TO BE FIXED!**

## 🔧 How to Add Environment Variables

### Option 1: Add in Hostinger Interface (Recommended)

1. **In the Hostinger Node.js App configuration page:**
   - Scroll to **"Environment Variables"** section
   - Click the **"Add"** button

2. **Add each variable one by one:**

   **Required Variables:**
   
   ```
   NODE_ENV = production
   ```
   
   ```
   PORT = 3000
   ```
   
   ```
   DB_ENGINE = mysql
   ```
   
   ```
   DB_HOST = localhost
   ```
   
   ```
   DB_PORT = 3306
   ```
   
   ```
   DB_NAME = your_database_name
   ```
   (Replace with your actual database name from Hostinger)
   
   ```
   DB_USER = your_database_user
   ```
   (Replace with your actual database user from Hostinger)
   
   ```
   DB_PASSWORD = your_database_password
   ```
   (Replace with your actual database password from Hostinger)
   
   ```
   SESSION_SECRET = your-generated-secret-key
   ```
   (Generate a random string - see below)
   
   ```
   APP_URL = https://propertyhub.subtronz.com
   ```
   (Replace with your actual domain)
   
   ```
   ALLOWED_HOSTS = propertyhub.subtronz.com,www.propertyhub.subtronz.com
   ```
   (Replace with your actual domain)
   
   ```
   ADMIN_USERNAME = Ajay
   ```
   
   ```
   ADMIN_PASSWORD = Ajay@2026
   ```

3. **Click "Save and redeploy"** after adding all variables

### Option 2: Use .env File on Server

If you prefer to use a `.env` file:

1. **Connect via SSH:**
   ```bash
   ssh your_username@your_domain.com -p 65002
   cd ~/public_html
   ```

2. **Create/Edit .env file:**
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Update with your values:**
   ```env
   NODE_ENV=production
   PORT=3000
   DB_ENGINE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   SESSION_SECRET=your-generated-secret-key
   APP_URL=https://propertyhub.subtronz.com
   ALLOWED_HOSTS=propertyhub.subtronz.com,www.propertyhub.subtronz.com
   ADMIN_USERNAME=Ajay
   ADMIN_PASSWORD=Ajay@2026
   ```

4. **Save and restart app in Hostinger hPanel**

## 🔑 How to Get Database Credentials

1. **Go to Hostinger hPanel**
2. Navigate to: **Databases** → **MySQL Databases**
3. Find your database and note:
   - **Database Name**: `u123456789_realestate` (example)
   - **Database User**: `u123456789_admin` (example)
   - **Database Password**: (the password you set)
   - **Database Host**: Usually `localhost`

## 🔐 Generate Session Secret

**On your server via SSH:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Or use any random string generator** (at least 32 characters)

## ✅ After Adding Environment Variables

1. **Click "Save and redeploy"** in Hostinger
2. **Wait for deployment to complete**
3. **Check application logs** for any errors
4. **Test your website** - should now work properly

## 📋 Complete Environment Variables List

Copy this list and fill in your actual values:

```
NODE_ENV=production
PORT=3000
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=_________________
DB_USER=_________________
DB_PASSWORD=_________________
SESSION_SECRET=_________________
APP_URL=https://propertyhub.subtronz.com
ALLOWED_HOSTS=propertyhub.subtronz.com,www.propertyhub.subtronz.com
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
ADMIN_EMAIL=admin@propertyhub.subtronz.com
```

## 🚨 Why This is Critical

Without environment variables:
- ❌ App cannot connect to database
- ❌ App will crash on startup
- ❌ You'll get 503 errors
- ❌ No session management
- ❌ App won't work at all

**Environment variables are REQUIRED for the app to function!**

---

**Add the environment variables now, then click "Save and redeploy"!**

