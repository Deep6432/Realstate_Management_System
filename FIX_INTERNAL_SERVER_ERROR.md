# 🔴 Fix Internal Server Error (500) on Hostinger

## Quick Diagnosis

You're seeing **"Internal server error"** which means the app is running, but something is failing when processing requests. The CSS is loading (good!), but the application logic has an error.

---

## ✅ STEP 1: Check Application Logs

**This is the MOST IMPORTANT step!**

1. **Log in to Hostinger hPanel**
2. Go to **"Advanced"** → **"Node.js App"**
3. Click on your application
4. Click **"View Logs"** or **"Error Logs"**
5. **Look for recent error messages** - they will tell you exactly what's wrong

**Common errors you'll see:**
- `Table 'database.Properties' doesn't exist` → Go to STEP 2
- `Cannot find module` → Go to STEP 3
- `Database connection error` → Go to STEP 4
- `SequelizeValidationError` → Go to STEP 5

---

## ✅ STEP 2: Fix Missing Database Tables (MOST COMMON)

**If logs show "Table doesn't exist" or "Unknown table":**

### Check if tables exist:

```bash
# Connect via SSH
ssh your_username@your_domain.com -p 65002
cd ~/public_html

# Check tables
node scripts/check-tables.js
```

**If tables are missing:**

The app should create tables automatically on startup. If they don't exist:

1. **Check if database sync ran:**
   - Look in Hostinger logs for "Database tables synchronized"
   - If you see "Database sync failed", check the error

2. **Manually sync tables:**
   ```bash
   # On server via SSH
   cd ~/public_html
   node -e "require('./config/database').sequelize.sync({ alter: true }).then(() => console.log('✅ Tables synced')).catch(err => console.error('❌ Error:', err.message))"
   ```

3. **Restart the application** in Hostinger hPanel

---

## ✅ STEP 3: Check Database Connection

**Even if the app started, database might not be connected:**

```bash
# On server via SSH
cd ~/public_html
node scripts/test-db.js
```

**If it fails:**
- Check your `.env` file database credentials
- Verify database exists in Hostinger hPanel
- See `FIX_503_ERROR.md` for database setup

---

## ✅ STEP 4: Check Dependencies

**If logs show "Cannot find module":**

```bash
# On server via SSH
cd ~/public_html
npm install --production
```

**Then restart the app in Hostinger hPanel.**

---

## ✅ STEP 5: Run Full Diagnostic

**Get a complete health check:**

```bash
# On server via SSH
cd ~/public_html
node scripts/diagnose.js
```

This will check:
- ✅ Node.js version
- ✅ Environment variables
- ✅ Dependencies
- ✅ Directory structure
- ✅ Database connection
- ✅ Critical files

**Fix any issues it reports.**

---

## ✅ STEP 6: Check Specific Route Errors

**The error might be specific to a route. Check logs for:**
- Which URL was accessed when error occurred
- What controller/function failed
- What database query failed

**Common failing routes:**
- `/` (homepage) - might be missing PROPERTY_TYPE_CHOICES
- `/properties` - database query issue
- `/admin/dashboard` - database query or missing data

---

## ✅ STEP 7: Verify Environment Variables

**Check your `.env` file on server:**

```bash
# On server via SSH
cd ~/public_html
cat .env
```

**Required variables:**
```env
NODE_ENV=production
PORT=3000
DB_ENGINE=mysql
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
SESSION_SECRET=your-secret-key
```

**If any are missing or have placeholder values, update them.**

---

## ✅ STEP 8: Test Application Manually

**Start the app manually to see the exact error:**

```bash
# On server via SSH
cd ~/public_html

# Stop the app in Hostinger hPanel first, then:
node server.js
```

**Visit your website** - you'll see the error in the terminal.

**Press `Ctrl+C` to stop, then fix the error.**

---

## 🐛 Common Error Messages & Solutions

### Error: "Table 'database.Properties' doesn't exist"
**Solution:**
```bash
node scripts/check-tables.js
# If missing, sync tables (see STEP 2)
```

### Error: "SequelizeDatabaseError: Unknown column"
**Solution:**
- Tables exist but structure is wrong
- Run: `node -e "require('./config/database').sequelize.sync({ alter: true })"`

### Error: "Cannot read property 'findAll' of undefined"
**Solution:**
- Model not imported correctly
- Check `models/index.js` and controller imports

### Error: "EACCES: permission denied"
**Solution:**
```bash
chmod -R 755 public
chmod -R 755 uploads
chmod 644 .env
```

### Error: "MODULE_NOT_FOUND"
**Solution:**
```bash
npm install --production
```

---

## 📋 Quick Checklist

- [ ] Checked Hostinger application logs
- [ ] Database connection works (`node scripts/test-db.js`)
- [ ] Database tables exist (`node scripts/check-tables.js`)
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables are set correctly
- [ ] File permissions are correct
- [ ] Application restarted after fixes

---

## 🆘 Still Getting Internal Server Error?

1. **Check the exact error in Hostinger logs:**
   - hPanel → **"Advanced"** → **"Node.js App"** → **"View Logs"**
   - Look for the most recent error message
   - Copy the full error message

2. **Run diagnostic:**
   ```bash
   ssh your_username@your_domain.com -p 65002
   cd ~/public_html
   node scripts/diagnose.js
   ```

3. **Check specific route:**
   - Try accessing different pages
   - Note which page gives the error
   - Check logs for that specific route

4. **Compare with localhost:**
   - Does it work on localhost?
   - What's different? (database, environment variables, file paths)

---

## ✅ Success Indicators

When fixed, you should see:
- ✅ No errors in Hostinger application logs
- ✅ Website loads without "Internal server error"
- ✅ All pages work correctly
- ✅ Database queries succeed
- ✅ CSS/UI is applied (already working!)

---

**The enhanced error logging will now show detailed error information in the Hostinger logs, making it much easier to identify the exact issue.**

**Last Updated:** January 2026
