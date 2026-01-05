# Real Estate Management System

A professional Real Estate Inventory Management System built with Node.js, Express.js, and MySQL/SQLite.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your settings
# For local dev, you can use SQLite (no DB setup needed)

# Start server
npm start
# or for development with auto-reload
npm run dev
```

### Hostinger Deployment (Git Pull)

```bash
# 1. Connect via SSH
ssh your_username@your_domain.com -p 65002

# 2. Navigate to public_html
cd ~/public_html

# 3. Clone repository
git clone https://github.com/Deep6432/Realstate_Management_System.git .
git checkout hostinger

# 4. Configure environment
cp .env.example .env
nano .env  # Add your database credentials

# 5. Install dependencies
npm install --production

# 6. Create directories
mkdir -p uploads/property_images logs
chmod -R 755 uploads logs

# 7. Start via Hostinger Node.js App interface
# hPanel → Advanced → Node.js App → Create & Start
```

## 📋 Features

- ✅ Property Management (CRUD)
- ✅ Image Uploads
- ✅ Admin Dashboard
- ✅ Search & Filter
- ✅ Responsive Design
- ✅ Professional UI
- ✅ Session-based Authentication

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

**Required for Production:**
- `DB_ENGINE=mysql`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `SESSION_SECRET`
- `APP_URL`

### Database Setup

**MySQL (Production):**
- Create database in Hostinger hPanel
- Update `.env` with credentials

**SQLite (Local Development):**
- Set `DB_ENGINE=sqlite` in `.env`
- Database file will be created automatically

## 📖 Documentation

- **Git Deployment**: `HOSTINGER_GIT_DEPLOYMENT.md`
- **Quick Start**: `GIT_DEPLOY_QUICK_START.md`
- **General Deployment**: `HOSTINGER_DEPLOYMENT.md`
- **Quick Reference**: `HOSTINGER_QUICK_START.md`

## 🔄 Updating on Hostinger

After pushing changes to GitHub:

```bash
ssh your_username@your_domain.com -p 65002
cd ~/public_html
./update.sh
```

Or manually:
```bash
git pull origin hostinger
npm install --production
# Restart via hPanel
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (Production), SQLite (Development)
- **ORM**: Sequelize
- **Templates**: EJS
- **Authentication**: express-session
- **File Upload**: Multer
- **Process Manager**: PM2 (optional)

## 📝 Admin Credentials

Default admin credentials (change in production):
- Username: `Ajay`
- Password: `Ajay@2026`

## 🔒 Security

- Environment variables for sensitive data
- Session-based authentication
- Secure file uploads
- SQL injection protection (Sequelize)
- XSS protection headers

## 📦 Project Structure

```
.
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Auth, upload middleware
├── models/          # Sequelize models
├── routes/          # Express routes
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── uploads/         # Uploaded property images
├── server.js        # Main application file
└── package.json     # Dependencies
```

## 🐛 Troubleshooting

See `HOSTINGER_DEPLOYMENT.md` for detailed troubleshooting guide.

## 📄 License

ISC

## 🔗 Repository

**GitHub**: https://github.com/Deep6432/Realstate_Management_System  
**Branch**: `hostinger` (production-ready)

---

**Ready for Hostinger Deployment!** 🚀
