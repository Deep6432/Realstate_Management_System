# Quick Start: Git Deployment to Hostinger

## 🚀 Fast Setup (5 Steps)

### 1. Enable SSH on Hostinger
- hPanel → Advanced → SSH Access
- Enable SSH and note credentials

### 2. Connect via SSH
```bash
ssh your_username@your_domain.com -p 65002
```

### 3. Clone Repository
```bash
cd ~/public_html
git clone https://github.com/Deep6432/Realstate_Management_System.git .
git checkout hostinger
```

### 4. Configure Environment
```bash
cp .env.example .env
nano .env  # Update with your database credentials
npm install --production
```

### 5. Start Application
- hPanel → Advanced → Node.js App
- Create app pointing to `server.js`
- Start application

## 🔄 Update Application

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

## ✅ Done!

For detailed instructions, see `HOSTINGER_GIT_DEPLOYMENT.md`

