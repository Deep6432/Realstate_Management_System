# Hostinger Git Pull Deployment - Ready to Use

This branch (`hostinger`) is **production-ready** and can be directly pulled on Hostinger.

## 🚀 One-Command Deployment

### First Time Setup

```bash
# 1. Connect via SSH
ssh your_username@your_domain.com -p 65002

# 2. Navigate to public_html
cd ~/public_html

# 3. Clone and setup (all in one)
git clone https://github.com/Deep6432/Realstate_Management_System.git .
git checkout hostinger
cp .env.example .env
nano .env  # Add your database credentials
npm install --production
```

**That's it!** The `post-install.sh` script will automatically:
- ✅ Create `uploads/` and `logs/` directories
- ✅ Set proper file permissions
- ✅ Copy `.env.example` to `.env` if needed

### Start Application

1. **Via Hostinger hPanel:**
   - Go to: **Advanced** → **Node.js App**
   - Create new app:
     - **App Directory**: `/public_html`
     - **Startup File**: `server.js`
     - **Node Version**: 18.x or 20.x
   - Click **Start**

2. **Or via PM2 (if SSH available):**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   ```

## 🔄 Updating (After Git Push)

### Option 1: Using Update Script (Recommended)

```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
./update.sh
```

### Option 2: Manual Update

```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
git pull origin hostinger
npm install --production
# Restart via hPanel or: pm2 restart real-estate-app
```

## ✅ What's Included

This branch includes:
- ✅ All production-ready code
- ✅ `.env.example` template
- ✅ `.htaccess` for Apache
- ✅ `ecosystem.config.js` for PM2
- ✅ `update.sh` for easy updates
- ✅ `post-install.sh` for automatic setup
- ✅ All deployment documentation

## 📋 Pre-Deployment Checklist

Before pulling on Hostinger:

- [ ] SSH access enabled on Hostinger
- [ ] MySQL database created in hPanel
- [ ] Database credentials ready
- [ ] Domain name configured

## 🎯 Post-Deployment Checklist

After pulling:

- [ ] `.env` file created and configured
- [ ] Database credentials in `.env` are correct
- [ ] `npm install --production` completed successfully
- [ ] Directories created (`uploads/`, `logs/`)
- [ ] Node.js app started in hPanel
- [ ] Website accessible at your domain
- [ ] Admin login working (`/login`)

## 🔧 Configuration

### Required `.env` Variables

```env
NODE_ENV=production
PORT=3000
DB_ENGINE=mysql
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
SESSION_SECRET=generate-random-string-here
APP_URL=https://yourdomain.com
```

### Generate Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🐛 Troubleshooting

### Git Pull Fails

```bash
# If you have local changes
git stash
git pull origin hostinger
git stash pop
```

### Permissions Error

```bash
chmod -R 755 .
chmod 644 .env
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force
npm install --production
```

### Application Not Starting

- Check Node.js version in hPanel (should be 18.x or 20.x)
- Check error logs in hPanel
- Verify `.env` file exists and is configured
- Test database connection

## 📖 Additional Documentation

- **Complete Guide**: `HOSTINGER_GIT_DEPLOYMENT.md`
- **Quick Start**: `GIT_DEPLOY_QUICK_START.md`
- **General Deployment**: `HOSTINGER_DEPLOYMENT.md`

## 🎉 Ready to Deploy!

This branch is **100% ready** for Hostinger deployment via Git pull.

**Repository**: https://github.com/Deep6432/Realstate_Management_System  
**Branch**: `hostinger`  
**Status**: ✅ Production Ready

---

**Just pull and deploy!** 🚀

