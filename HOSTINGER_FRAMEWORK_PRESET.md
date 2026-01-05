# Hostinger Framework Preset Configuration

## 🎯 Framework Preset Selection

For this **Express.js** application, you need to select the correct framework preset in Hostinger.

## ✅ Recommended Framework Preset

### Option 1: Node.js (Generic) - **RECOMMENDED**

**Select:** `Node.js` or `Generic Node.js`

**Configuration:**
- **Framework Preset**: `Node.js` or `Generic`
- **App Directory**: `/public_html` (or your domain directory)
- **Startup File**: `server.js`
- **Node Version**: `18.x`
- **Startup Command**: Leave empty (or `node server.js`)

### Option 2: Express.js (If Available)

**Select:** `Express.js` (if this option exists)

**Configuration:**
- **Framework Preset**: `Express.js`
- **App Directory**: `/public_html`
- **Startup File**: `server.js`
- **Node Version**: `18.x`

### Option 3: Custom/Manual

**Select:** `Custom` or `Manual` (if available)

**Configuration:**
- **Framework Preset**: `Custom` or `Manual`
- **App Directory**: `/public_html`
- **Startup File**: `server.js`
- **Node Version**: `18.x`
- **Startup Command**: `node server.js`

## 📋 Step-by-Step Configuration

### In Hostinger hPanel:

1. **Navigate to Node.js App**
   - Go to: **Advanced** → **Node.js App**

2. **Create/Edit Application**
   - Click **"Create Application"** or edit existing one

3. **Select Framework Preset**
   - Choose: **`Node.js`** or **`Generic Node.js`**
   - If Express.js is available, you can use that too

4. **Configure Application**
   - **App Directory**: `/public_html` (or full path like `/home/username/public_html`)
   - **Startup File**: `server.js`
   - **Node.js Version**: `18.x` (or latest 18.x available)
   - **Startup Command**: Leave empty (defaults to `node server.js`)

5. **Environment Variables**
   - Make sure `.env` file exists in your app directory
   - Or add environment variables in the Hostinger interface

6. **Save and Start**
   - Click **"Save"** or **"Create"**
   - Click **"Start"** to start the application

## 🔍 Framework Detection Files

The project includes these files to help Hostinger detect the framework:

- ✅ `.hostinger.json` - Hostinger-specific config
- ✅ `app.json` - Application metadata
- ✅ `package.json` - Node.js project config
- ✅ `.nvmrc` - Node.js version
- ✅ `Procfile` - Process definition

## ⚠️ Common Issues

### Issue 1: "Unsupported Framework" Warning

**Solution:**
- Select **`Node.js`** or **`Generic Node.js`** preset
- Make sure `server.js` exists in the app directory
- Verify `package.json` exists

### Issue 2: Application Not Starting

**Solution:**
- Check **Startup File** is set to `server.js`
- Verify Node.js version is `18.x`
- Check error logs in Hostinger hPanel

### Issue 3: Wrong Framework Preset

**Solution:**
- Don't select frameworks like:
  - ❌ React
  - ❌ Vue.js
  - ❌ Angular
  - ❌ Next.js
- Select:
  - ✅ Node.js
  - ✅ Generic Node.js
  - ✅ Express.js (if available)
  - ✅ Custom/Manual

## ✅ Verification Checklist

- [ ] Framework preset selected: `Node.js` or `Generic Node.js`
- [ ] App directory set correctly: `/public_html`
- [ ] Startup file: `server.js`
- [ ] Node.js version: `18.x`
- [ ] Application status: **Running** (green)
- [ ] No errors in application logs

## 🎯 Quick Reference

**Framework Preset**: `Node.js` or `Generic Node.js`  
**Startup File**: `server.js`  
**Node Version**: `18.x`  
**App Directory**: `/public_html`

---

**The framework preset is just a template - the actual framework (Express.js) is detected from your `package.json` and `server.js` file.**

