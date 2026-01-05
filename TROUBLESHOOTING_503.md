# Troubleshooting 503 Service Unavailable Error

## 🔴 Common Causes of 503 Error

1. **Node.js application not running**
2. **Application crashed on startup**
3. **Port configuration mismatch**
4. **Database connection failed**
5. **Missing environment variables**
6. **Missing dependencies**

## ✅ Step-by-Step Fix

### STEP 1: Check Application Status in Hostinger

1. **Log in to Hostinger hPanel**
2. Go to **"Advanced"** → **"Node.js App"**
3. Check if your application is:
   - ✅ **Running** (green status)
   - ❌ **Stopped** (red status)
   - ⚠️ **Crashed** (error status)

### STEP 2: Check Application Logs

**In Hostinger hPanel:**
1. Go to **"Advanced"** → **"Node.js App"**
2. Click on your application
3. Click **"View Logs"** or **"Error Logs"**
4. Look for error messages

**Common errors you might see:**
- Database connection errors
- Missing module errors
- Port already in use
- Environment variable errors

### STEP 3: Verify Environment Variables

**Check your `.env` file on the server:**

```bash
# Connect via SSH
ssh your_username@your_domain.com -p 65002
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

### STEP 4: Test Database Connection

```bash
# On server via SSH
cd ~/public_html
node -e "require('./config/database').testConnection().then(() => console.log('✅ DB OK')).catch(err => console.error('❌ DB Error:', err.message))"
```

### STEP 5: Check Dependencies

```bash
# On server via SSH
cd ~/public_html
npm install --production
```

### STEP 6: Test Application Locally on Server

```bash
# On server via SSH
cd ~/public_html
node server.js
```

**If it crashes, you'll see the error message.**

### STEP 7: Check Port Configuration

**In Hostinger hPanel:**
1. Go to **"Advanced"** → **"Node.js App"**
2. Check the **PORT** setting
3. Make sure it matches your `.env` file

**Common issue:** Hostinger might assign a different port. Update your `.env`:
```env
PORT=process.env.PORT  # Let Hostinger assign the port
```

### STEP 8: Restart Application

**In Hostinger hPanel:**
1. Go to **"Advanced"** → **"Node.js App"**
2. Click **"Stop"** (if running)
3. Wait 5 seconds
4. Click **"Start"** or **"Restart"**

## 🔧 Quick Fixes

### Fix 1: Update server.js to Handle Port Correctly

Make sure your `server.js` uses:
```javascript
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
```

### Fix 2: Add Error Handling

Add this to catch startup errors:
```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
```

### Fix 3: Check File Permissions

```bash
# On server
cd ~/public_html
chmod 644 server.js
chmod 644 .env
chmod -R 755 public
chmod -R 755 uploads
```

### Fix 4: Verify Directory Structure

```bash
# On server
cd ~/public_html
ls -la
# Should see: server.js, package.json, config/, controllers/, etc.
```

## 🐛 Common Error Messages & Solutions

### Error: "Cannot find module"
**Solution:**
```bash
npm install --production
```

### Error: "Port 3000 already in use"
**Solution:**
- Change PORT in `.env` to a different number
- Or let Hostinger assign the port automatically

### Error: "Database connection failed"
**Solution:**
- Verify database credentials in `.env`
- Check if database exists in Hostinger
- Test connection manually

### Error: "EADDRINUSE"
**Solution:**
- Another process is using the port
- Change PORT in `.env`
- Or restart the server

## 📋 Checklist

- [ ] Application is started in Hostinger hPanel
- [ ] `.env` file exists and is configured
- [ ] Database credentials are correct
- [ ] Dependencies are installed (`npm install`)
- [ ] Port configuration is correct
- [ ] File permissions are set correctly
- [ ] Application logs show no errors
- [ ] Database connection works

## 🆘 Still Not Working?

1. **Check Hostinger Support:**
   - Contact Hostinger support
   - Share error logs with them

2. **Try Manual Start:**
   ```bash
   ssh your_username@your_domain.com -p 65002
   cd ~/public_html
   node server.js
   ```
   This will show you the exact error.

3. **Check Node.js Version:**
   - Make sure Hostinger is using Node.js 18.x
   - Check in hPanel → Node.js App → Settings

## ✅ Success Indicators

When it's working, you should see:
- ✅ Application status: **Running** (green)
- ✅ No errors in logs
- ✅ Website loads without 503 error
- ✅ Can access homepage

---

**Need more help?** Check the error logs in Hostinger hPanel for specific error messages.

