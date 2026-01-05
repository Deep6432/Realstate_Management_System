# Fix: Works on Localhost but Not on Server

## 🔴 Problem: Works Locally but Not on Hostinger

Your app works perfectly on localhost but CSS/JS doesn't load on the server.

## 🔍 Common Causes

1. **Static files not accessible** - File permissions or path issues
2. **Apache interfering** - .htaccess not configured correctly
3. **Node.js app not serving static files** - Express static middleware issue
4. **File paths different** - Absolute vs relative paths
5. **Cache issues** - Browser or server cache

## ✅ Complete Fix

### Step 1: Pull Latest Code on Server

```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
git pull origin hostinger
```

### Step 2: Verify File Structure

```bash
# Check if files exist
ls -la public/css/style.css
ls -la public/js/main.js
ls -la public/favicon.svg

# Should all exist and be readable
```

### Step 3: Fix File Permissions

```bash
# Set correct permissions
chmod -R 755 public
chmod 644 public/css/style.css
chmod 644 public/js/main.js
chmod 644 public/favicon.svg
chmod 644 server.js
chmod 644 .htaccess
```

### Step 4: Test Static File Access

```bash
# Test if CSS is accessible
curl -I https://yourdomain.com/static/css/style.css

# Should return 200 OK, not 404
```

### Step 5: Check Node.js App Configuration

In Hostinger hPanel:
1. Go to **Advanced** → **Node.js App**
2. Check:
   - **App Directory**: `/public_html` (or full path)
   - **Startup File**: `server.js`
   - **Node Version**: 18.x
3. **Restart** the application

### Step 6: Verify .htaccess

Make sure `.htaccess` exists and has correct rules:

```apache
# Handle static files
RewriteCond %{REQUEST_URI} ^/(static|css|js|images|favicon\.svg)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(static|css|js|images|favicon\.svg)/(.*)$ public/$1/$2 [L]
```

### Step 7: Clear All Caches

**On Server:**
```bash
# Clear Node.js cache (if any)
rm -rf node_modules/.cache
```

**In Browser:**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

## 🐛 Debugging Steps

### 1. Check Server Logs

```bash
# In Hostinger hPanel → Node.js App → View Logs
# Look for errors related to static files
```

### 2. Test Direct File Access

Visit these URLs in your browser:
- `https://yourdomain.com/static/css/style.css`
- `https://yourdomain.com/static/js/main.js`
- `https://yourdomain.com/static/favicon.svg`

**If you get 404:**
- Static files aren't being served
- Check file paths and permissions

**If you get 200 but no content:**
- File exists but empty or corrupted
- Re-upload the files

### 3. Check Browser Console

1. Press **F12** in browser
2. Go to **Console** tab
3. Look for errors like:
   - `Failed to load resource: style.css`
   - `404 Not Found`
   - `CORS error`

4. Go to **Network** tab
5. Reload page
6. Check if `style.css` loads:
   - **Status**: Should be 200 (not 404)
   - **Type**: Should be `text/css`
   - **Size**: Should be > 0 bytes

### 4. Compare Localhost vs Server

**Localhost:**
- URL: `http://localhost:3000/static/css/style.css` ✅ Works

**Server:**
- URL: `https://yourdomain.com/static/css/style.css` ❌ Not working?

**Check:**
- Is the path the same?
- Is Express serving static files?
- Is Apache blocking them?

## 🔧 Advanced Fixes

### Fix 1: Force Static File Serving

Update `server.js` to explicitly serve static files:

```javascript
// Serve static files with explicit headers
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
```

### Fix 2: Add Static Route Handler

Add explicit route for static files:

```javascript
// Explicit static file routes
app.get('/static/css/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'css', 'style.css'), {
    headers: {
      'Content-Type': 'text/css'
    }
  });
});
```

### Fix 3: Check Apache Configuration

If using Apache reverse proxy, make sure static files bypass Node.js:

```apache
# Serve static files directly, don't proxy to Node.js
RewriteCond %{REQUEST_URI} \.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$
RewriteRule ^(.*)$ - [L]
```

## 📋 Checklist

- [ ] Latest code pulled from GitHub
- [ ] File permissions set correctly (755 for dirs, 644 for files)
- [ ] Static files exist in `public/` directory
- [ ] Can access `https://yourdomain.com/static/css/style.css` directly
- [ ] Node.js app restarted after changes
- [ ] Browser cache cleared
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] `.htaccess` file exists and is correct
- [ ] Express static middleware is configured

## 🆘 Still Not Working?

### Option 1: Check Hostinger Support

Contact Hostinger support with:
- Your domain
- Error logs from Node.js app
- Screenshot of browser console errors

### Option 2: Manual File Upload

If Git pull doesn't work, manually upload:

1. **Via File Manager:**
   - Upload `public/css/style.css`
   - Upload `public/js/main.js`
   - Upload `public/favicon.svg`

2. **Set permissions:**
   - Files: 644
   - Directories: 755

### Option 3: Use CDN (Temporary)

As a workaround, host CSS on a CDN and update the link in `header.ejs`.

## ✅ Success Indicators

When fixed, you should see:
- ✅ Website has proper styling (colors, layout, fonts)
- ✅ `style.css` loads with 200 status
- ✅ No 404 errors in browser console
- ✅ Property type cards have hover effects
- ✅ Navbar has dark background
- ✅ Buttons are styled correctly

---

**The key difference:** Localhost serves files directly, but Hostinger needs proper configuration for Apache + Node.js to work together.

