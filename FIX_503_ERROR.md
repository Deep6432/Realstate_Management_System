# 🔴 Fix 503 Service Unavailable Error on Hostinger

## Quick Diagnosis

The **503 Service Unavailable** error means your Node.js application is **not running** or **crashed on startup**. Follow these steps to fix it.

---

## ✅ STEP 1: Check Application Status in Hostinger

1. **Log in to Hostinger hPanel**
2. Go to **"Advanced"** → **"Node.js App"**
3. Check your application status:
   - ✅ **Green/Running** = App is running (check logs if still getting 503)
   - ❌ **Red/Stopped** = App is not running (click "Start")
   - ⚠️ **Error/Crashed** = App crashed (check logs below)

---

## ✅ STEP 2: View Application Logs

**In Hostinger hPanel:**
1. Go to **"Advanced"** → **"Node.js App"**
2. Click on your application
3. Click **"View Logs"** or **"Error Logs"**
4. **Copy the error message** you see

**Common errors you'll see:**
- `Database connection failed` → Go to STEP 3
- `Cannot find module` → Go to STEP 4
- `Port already in use` → Go to STEP 5
- `Environment variable missing` → Go to STEP 6

---

## ✅ STEP 3: Fix Database Connection (MOST COMMON ISSUE)

**If logs show "Database connection failed":**

### Option A: Check via SSH (Recommended)

```bash
# Connect to your server
ssh your_username@your_domain.com -p 65002
cd ~/public_html

# Run database test
node scripts/test-db.js
```

**If test fails, check your `.env` file:**
```bash
cat .env | grep DB_
```

**Required database variables:**
```env
DB_ENGINE=mysql
DB_HOST=localhost
DB_NAME=your_actual_database_name
DB_USER=your_actual_database_user
DB_PASSWORD=your_actual_database_password
```

### Option B: Check in Hostinger hPanel

1. Go to **"Databases"** → **"MySQL Databases"**
2. Note your database name, username, and password
3. Go to **"Advanced"** → **"Node.js App"** → **"Environment Variables"**
4. Add/Update these variables:
   - `DB_ENGINE` = `mysql`
   - `DB_HOST` = `localhost`
   - `DB_NAME` = (your database name)
   - `DB_USER` = (your database user)
   - `DB_PASSWORD` = (your database password)

### Option C: Update .env File via SSH

```bash
# Connect via SSH
ssh your_username@your_domain.com -p 65002
cd ~/public_html

# Edit .env file
nano .env
```

**Make sure these lines are correct:**
```env
DB_ENGINE=mysql
DB_HOST=localhost
DB_NAME=u123456789_mydb
DB_USER=u123456789_user
DB_PASSWORD=your_actual_password
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

**After fixing, restart the app:**
- In Hostinger hPanel → Node.js App → **Restart**

---

## ✅ STEP 4: Install Missing Dependencies

**If logs show "Cannot find module":**

```bash
# Connect via SSH
ssh your_username@your_domain.com -p 65002
cd ~/public_html

# Install dependencies
npm install --production

# Restart app in Hostinger hPanel
```

---

## ✅ STEP 5: Fix Port Configuration

**If logs show "Port already in use" or "EADDRINUSE":**

**In Hostinger hPanel:**
1. Go to **"Advanced"** → **"Node.js App"**
2. Check the **PORT** setting
3. Note the port number (e.g., `3000`, `3001`, etc.)

**Update your `.env` file:**
```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
nano .env
```

**Add/Update:**
```env
PORT=3000
# Or whatever port Hostinger assigned
```

**Or let Hostinger assign automatically** - remove PORT from .env

---

## ✅ STEP 6: Set Environment Variables

**Required environment variables:**

```env
NODE_ENV=production
PORT=3000
DB_ENGINE=mysql
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
SESSION_SECRET=generate-random-string-here
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
ADMIN_EMAIL=admin@yourdomain.com
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Set in Hostinger:**
1. **Option A:** Via SSH - edit `.env` file
2. **Option B:** Via hPanel - **"Advanced"** → **"Node.js App"** → **"Environment Variables"**

---

## ✅ STEP 7: Run Diagnostic Script

**On your server via SSH:**
```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
node scripts/diagnose.js
```

This will check:
- ✅ Node.js version
- ✅ .env file and variables
- ✅ Dependencies installed
- ✅ Directory structure
- ✅ Database connection
- ✅ Critical files

**Fix any issues it reports.**

---

## ✅ STEP 8: Test Application Manually

**On your server via SSH:**
```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html

# Test database
node scripts/test-db.js

# Try starting the app manually
node server.js
```

**If it crashes, you'll see the exact error message.**

**Press `Ctrl+C` to stop it, then fix the error and restart via Hostinger hPanel.**

---

## ✅ STEP 9: Verify Hostinger Configuration

**In Hostinger hPanel → Node.js App:**

1. **App Directory:** Should be `public_html` (or your app directory)
2. **Startup File:** Should be `server.js`
3. **Node Version:** Should be `18.x` (check `.nvmrc` file)
4. **Framework Preset:** Should be `Express` ✅

---

## ✅ STEP 10: Restart Application

**After making any changes:**

1. **In Hostinger hPanel:**
   - Go to **"Advanced"** → **"Node.js App"**
   - Click **"Stop"** (wait 5 seconds)
   - Click **"Start"** or **"Restart"**

2. **Wait 30 seconds** for the app to start

3. **Check logs again** to confirm it started successfully

4. **Visit your website** - the 503 error should be gone

---

## 🐛 Common Error Messages & Quick Fixes

### Error: "Database connection failed"
**Fix:** Check DB credentials in `.env` file (STEP 3)

### Error: "Cannot find module 'express'"
**Fix:** Run `npm install --production` (STEP 4)

### Error: "Port 3000 already in use"
**Fix:** Update PORT in `.env` or let Hostinger assign (STEP 5)

### Error: "DB_NAME is not defined"
**Fix:** Set all DB_* variables in `.env` (STEP 6)

### Error: "EADDRINUSE"
**Fix:** Change PORT or restart server (STEP 5)

---

## 📋 Quick Checklist

Before contacting support, verify:

- [ ] Application is **Started** in Hostinger hPanel
- [ ] `.env` file exists and has correct values
- [ ] Database credentials are correct
- [ ] `npm install` has been run
- [ ] Node.js version is 18.x
- [ ] App Directory is correct (`public_html`)
- [ ] Startup File is `server.js`
- [ ] Framework Preset is `Express`
- [ ] Application logs show no errors
- [ ] Database connection test passes (`node scripts/test-db.js`)

---

## 🆘 Still Getting 503?

1. **Check Hostinger error logs:**
   - hPanel → **"Advanced"** → **"Error Log"**
   - Look for recent errors

2. **Run full diagnostic:**
   ```bash
   ssh your_username@your_domain.com -p 65002
   cd ~/public_html
   node scripts/diagnose.js
   ```

3. **Contact Hostinger Support** with:
   - Your domain name
   - Error logs from hPanel
   - Output from `node scripts/diagnose.js`
   - Output from `node scripts/test-db.js`

---

## ✅ Success Indicators

When fixed, you should see:
- ✅ Application status: **Running** (green) in hPanel
- ✅ Application logs show: `✅ Server running on http://0.0.0.0:PORT`
- ✅ Website loads without 503 error
- ✅ CSS/UI is applied (if this was also an issue)

---

**Last Updated:** January 2026
