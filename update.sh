#!/bin/bash
# Update script for Hostinger Git deployment
# Run this script after connecting via SSH to update your application

echo "=========================================="
echo "🔄 Updating Real Estate Management App"
echo "=========================================="
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository!"
    echo "Please run this script from your project directory."
    exit 1
fi

# Fetch latest changes
echo "📥 Fetching latest changes from GitHub..."
git fetch origin

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Pull latest changes
echo "⬇️  Pulling latest changes..."
if git pull origin hostinger; then
    echo "✅ Successfully pulled latest changes"
else
    echo "❌ Error: Failed to pull changes"
    echo "You may have local changes. Use 'git status' to check."
    exit 1
fi

# Install/update dependencies
echo ""
echo "📦 Installing/updating dependencies..."
if npm install --production; then
    echo "✅ Dependencies updated"
else
    echo "⚠️  Warning: Some dependencies may have failed to install"
fi

# Create necessary directories if they don't exist
echo ""
echo "📁 Checking directories..."
mkdir -p uploads/property_images
mkdir -p logs
chmod -R 755 uploads
chmod -R 755 logs
echo "✅ Directories ready"

# Set file permissions
echo ""
echo "🔐 Setting file permissions..."
chmod 644 .env 2>/dev/null || echo "⚠️  .env file not found (this is OK if using environment variables)"
chmod 644 .htaccess
chmod 644 server.js
echo "✅ Permissions set"

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    echo ""
    echo "🔄 Restarting application with PM2..."
    if pm2 restart real-estate-app 2>/dev/null; then
        echo "✅ Application restarted with PM2"
    else
        echo "⚠️  PM2 restart failed. You may need to start it manually:"
        echo "   pm2 start ecosystem.config.js"
    fi
else
    echo ""
    echo "ℹ️  PM2 not found. Please restart your application manually:"
    echo "   - Via Hostinger hPanel: Advanced → Node.js App → Restart"
    echo "   - Or install PM2: npm install -g pm2"
fi

echo ""
echo "=========================================="
echo "✅ Update Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Restart your Node.js app via Hostinger hPanel (if not using PM2)"
echo "2. Test your website at your domain"
echo "3. Check logs if there are any issues"
echo ""

