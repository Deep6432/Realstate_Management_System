#!/bin/bash
# Post-install script - runs after git pull or npm install
# This ensures all necessary directories and permissions are set

echo "🔧 Running post-install setup..."

# Create uploads directory if it doesn't exist
if [ ! -d "uploads/property_images" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads/property_images
    chmod -R 755 uploads
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir -p logs
    chmod -R 755 logs
fi

# Set file permissions
echo "🔐 Setting file permissions..."
chmod 644 .htaccess 2>/dev/null || true
chmod 644 server.js 2>/dev/null || true
chmod 755 update.sh 2>/dev/null || true
chmod 755 deploy.sh 2>/dev/null || true

# Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  .env file not found. Copying from .env.example..."
        cp .env.example .env
        echo "✅ Please update .env with your production settings"
    else
        echo "⚠️  .env.example not found. Please create .env manually"
    fi
fi

echo "✅ Post-install setup complete!"

