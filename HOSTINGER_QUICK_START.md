# Hostinger Quick Start Guide

## 🚀 Fast Deployment (5 Steps)

### 1. Upload Files
- Upload all files to `public_html` via File Manager or Git

### 2. Create Database
- hPanel → Databases → MySQL Databases
- Create database and user
- Grant all privileges

### 3. Create `.env` File
```env
NODE_ENV=production
PORT=3000
DB_ENGINE=mysql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
SESSION_SECRET=generate-random-string-here
APP_URL=https://yourdomain.com
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
```

### 4. Install & Start
- hPanel → Advanced → Node.js App
- Create app pointing to `server.js`
- Install dependencies
- Start application

### 5. Test
- Visit: `https://yourdomain.com`
- Login: `/login`

## ✅ Done!

For detailed instructions, see `HOSTINGER_DEPLOYMENT.md`

