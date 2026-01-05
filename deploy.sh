#!/bin/bash
# Deployment script for Hostinger

echo "=========================================="
echo "Real Estate Management - Hostinger Deployment"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Please create .env file with production settings"
    echo "Copy .env.example to .env and update values"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads/property_images
mkdir -p logs

# Set file permissions
echo "🔐 Setting file permissions..."
chmod -R 755 public
chmod -R 755 uploads
chmod 644 .env
chmod 644 .htaccess
chmod 644 server.js

# Test database connection (optional)
echo "🔍 Testing database connection..."
node -e "require('./config/database').testConnection().then(() => { console.log('✅ Database connection OK'); process.exit(0); }).catch((err) => { console.log('❌ Database connection failed'); process.exit(1); })" || echo "⚠️  Database connection test failed - check your .env file"

echo ""
echo "=========================================="
echo "✅ Deployment preparation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start the application via Hostinger Node.js App interface"
echo "2. Or use PM2: pm2 start ecosystem.config.js"
echo "3. Test your website at your domain"
echo ""

