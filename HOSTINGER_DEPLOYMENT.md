# Hostinger Deployment Guide - Node.js Application

Complete guide to deploy the Real Estate Management System on Hostinger.

## 📋 Prerequisites

- Hostinger hosting account with Node.js support
- MySQL database created in Hostinger control panel
- Domain name configured
- SSH access (if available) or File Manager access

## 🚀 Step-by-Step Deployment

### STEP 1: Prepare Your Local Project

1. **Ensure all files are committed:**
   ```bash
   git status
   ```

2. **Create a deployment package** (optional):
   ```bash
   # Files are ready in the repository
   ```

### STEP 2: Create MySQL Database on Hostinger

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com

2. **Navigate to Databases**
   - Click **"Databases"** → **"MySQL Databases"**

3. **Create Database**
   - Click **"Create Database"**
   - Database name: `realestate_db` (or your choice)
   - Click **"Create"**

4. **Create Database User**
   - Scroll to **"Add New User"**
   - Username: `realestate_user` (or your choice)
   - Password: Create a strong password
   - Click **"Create User"**

5. **Grant Privileges**
   - Find your user in the list
   - Click **"Grant Privileges"** or **"Manage"**
   - Select your database
   - Grant **ALL PRIVILEGES**
   - Click **"Save"**

6. **Note Down Credentials**
   - Database Name: `_________________`
   - Database User: `_________________`
   - Database Password: `_________________`
   - Database Host: Usually `localhost`

### STEP 3: Upload Files to Hostinger

#### Option A: Using Git (Recommended)

1. **Access SSH** (if available):
   ```bash
   ssh your_username@your_domain.com
   cd ~/public_html
   git clone https://github.com/Deep6432/Realstate_Management_System.git .
   git checkout hostinger
   ```

#### Option B: Using File Manager

1. **Access File Manager** in Hostinger hPanel
2. **Navigate to** `public_html`
3. **Upload all project files**:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `config/` folder
   - `controllers/` folder
   - `middleware/` folder
   - `models/` folder
   - `routes/` folder
   - `views/` folder
   - `public/` folder
   - `.htaccess`
   - `.env.example`
   - `ecosystem.config.js` (for PM2)

#### Option C: Using FTP/SFTP

1. **Get FTP Credentials** from hPanel
2. **Connect with FTP Client** (FileZilla, WinSCP)
3. **Upload all files** to `public_html`

### STEP 4: Set Up Environment Variables

1. **In File Manager**, navigate to `public_html`
2. **Create `.env` file**:
   ```env
   NODE_ENV=production
   PORT=3000
   DB_ENGINE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   SESSION_SECRET=your-very-long-random-secret-key-here
   APP_URL=https://yourdomain.com
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ADMIN_USERNAME=Ajay
   ADMIN_PASSWORD=Ajay@2026
   ADMIN_EMAIL=admin@yourdomain.com
   ```

3. **Generate SESSION_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### STEP 5: Install Dependencies

#### Option A: Using SSH

```bash
cd ~/public_html
npm install --production
```

#### Option B: Using Hostinger Node.js App

1. **In hPanel**: **"Advanced"** → **"Node.js App"**
2. **Create Application**:
   - App Directory: `/public_html`
   - App Startup File: `server.js`
   - Node Version: 18.x or 20.x
3. **Install Dependencies**: Click **"Install Dependencies"** or run `npm install`

### STEP 6: Set Up Database

#### Using SSH:
```bash
cd ~/public_html
node -e "require('./config/database').testConnection().then(() => process.exit(0)).catch(() => process.exit(1))"
```

The database tables will be created automatically on first run.

### STEP 7: Set File Permissions

```bash
chmod -R 755 public
chmod -R 755 uploads
chmod 644 .env
chmod 644 .htaccess
chmod 644 server.js
```

### STEP 8: Configure Application Server

#### Option A: Using Hostinger Node.js App (Easiest)

1. **In hPanel**: **"Advanced"** → **"Node.js App"**
2. **Configure**:
   - **App Directory**: `/public_html`
   - **App Startup File**: `server.js`
   - **Node Version**: 18.x or 20.x
   - **Startup Command**: `node server.js` (or leave empty)
3. **Start Application**: Click **"Start"** or **"Restart"**

#### Option B: Using PM2 (If SSH Available)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on server reboot
pm2 startup
```

#### Option C: Using Passenger (If Available)

1. **Ensure `passenger_wsgi.js` exists** (already created)
2. **Configure `.htaccess`** (already configured)
3. **Restart Application** via hPanel

### STEP 9: Test Your Deployment

1. **Visit your domain**: `https://yourdomain.com`
2. **Test pages**:
   - ✅ Homepage loads
   - ✅ Static files (CSS, JS) load
   - ✅ Admin login: `/login`
   - ✅ Property listings work
   - ✅ Search functionality works

3. **Test admin**:
   - Go to: `/login`
   - Login with credentials
   - Test adding/editing properties
   - Test image uploads

## 🔧 Configuration Files

### `.htaccess`
- Already configured for Apache
- Handles static files
- Security headers
- Compression and caching

### `ecosystem.config.js`
- PM2 configuration for process management
- Auto-restart on crashes
- Memory limits

### `passenger_wsgi.js`
- Passenger configuration (if using Passenger)

## 🐛 Troubleshooting

### Application Not Starting

**Check logs:**
```bash
# PM2 logs
pm2 logs

# Or check Hostinger error logs in hPanel
```

**Common issues:**
- Port conflict: Change `PORT` in `.env`
- Database connection: Verify credentials
- Missing dependencies: Run `npm install`

### Static Files Not Loading

- Check `public/` directory exists
- Verify `.htaccess` is in root
- Check file permissions: `chmod -R 755 public`

### Database Connection Error

- Verify MySQL credentials in `.env`
- Check if MySQL service is running
- Ensure database exists
- Test connection from Hostinger MySQL section

### Images Not Uploading

```bash
# Check uploads directory
mkdir -p uploads/property_images
chmod -R 755 uploads
```

### 500 Internal Server Error

- Check error logs in Hostinger panel
- Temporarily set `NODE_ENV=development` to see detailed errors
- Verify all environment variables are set
- Check Node.js version compatibility

## 🔒 Security Checklist

- [ ] `NODE_ENV=production` in `.env`
- [ ] Strong `SESSION_SECRET` set
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] Database credentials are secure
- [ ] `.env` file is not publicly accessible
- [ ] SSL certificate installed (if available)
- [ ] Strong admin password set
- [ ] File permissions are correct (755 for dirs, 644 for files)

## 📝 Maintenance

### Update Application

```bash
cd ~/public_html
git pull origin hostinger
npm install --production
pm2 restart real-estate-app
# Or restart via Hostinger Node.js App interface
```

### Backup Database

```bash
# Backup MySQL database
mysqldump -u username -p database_name > backup.sql

# Or use Hostinger's backup feature
```

### View Logs

```bash
# PM2 logs
pm2 logs real-estate-app

# Or check Hostinger error logs
```

## 🎉 Success!

Once deployed, your application will be live at:
**https://yourdomain.com**

## 📞 Support

- **Hostinger Support**: Check hPanel help section
- **Node.js Issues**: Check Node.js documentation
- **Application Logs**: Check in hPanel or PM2 logs

---

**Ready for Hostinger Deployment!** 🚀

