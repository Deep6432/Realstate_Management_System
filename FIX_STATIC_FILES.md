# Fix Static Files (CSS/JS) Not Loading on Hostinger

## 🔴 Problem: CSS and JavaScript Not Loading

If your website looks unstyled (no colors, no layout), the static files are not being served correctly.

## ✅ Quick Fix

### Option 1: Update Code (Recommended)

Pull the latest code which includes fixes:

```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
git pull origin hostinger
npm install --production
# Restart app in Hostinger hPanel
```

### Option 2: Manual Fix on Server

1. **Check if CSS file exists:**
```bash
cd ~/public_html
ls -la public/css/style.css
```

2. **Verify file permissions:**
```bash
chmod -R 755 public
chmod 644 public/css/style.css
```

3. **Test if file is accessible:**
Visit in browser: `https://yourdomain.com/static/css/style.css`

If you get 404, the static files aren't being served.

## 🔧 Server Configuration Fix

### Update server.js

Make sure these lines exist in `server.js`:

```javascript
// Static files - serve from root and /static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### Update .htaccess

Make sure `.htaccess` has these rules:

```apache
# Handle static files directly
RewriteCond %{REQUEST_URI} ^/(static|css|js|images|favicon\.svg)/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(static|css|js|images|favicon\.svg)/(.*)$ public/$1/$2 [L]
```

## 🧪 Testing

1. **Check CSS file directly:**
   - Visit: `https://yourdomain.com/static/css/style.css`
   - Should show CSS content, not 404

2. **Check browser console:**
   - Press F12 → Console tab
   - Look for 404 errors on CSS/JS files

3. **Check Network tab:**
   - Press F12 → Network tab
   - Reload page
   - Check if `style.css` loads (status 200)

## 🐛 Common Issues

### Issue 1: 404 on CSS file
**Solution:**
- Check file exists: `ls -la public/css/style.css`
- Check permissions: `chmod 644 public/css/style.css`
- Restart Node.js app

### Issue 2: CSS loads but doesn't apply
**Solution:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check CSS file content is correct

### Issue 3: Apache blocking static files
**Solution:**
- Update `.htaccess` with correct rewrite rules
- Make sure Apache mod_rewrite is enabled
- Check Hostinger allows .htaccess files

## ✅ Verification Checklist

- [ ] `public/css/style.css` exists
- [ ] File permissions are correct (644 for files, 755 for directories)
- [ ] `server.js` serves static files correctly
- [ ] `.htaccess` has correct rewrite rules
- [ ] Can access `https://yourdomain.com/static/css/style.css` directly
- [ ] Node.js app is restarted after changes
- [ ] Browser cache is cleared

## 🚀 After Fix

1. **Restart application** in Hostinger hPanel
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Check website** - should now have styling

---

**The latest code includes these fixes!** Just pull and restart.

