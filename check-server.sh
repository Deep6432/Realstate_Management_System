#!/bin/bash
# Server health check script for Hostinger
# Run this on your server to diagnose 503 errors

echo "=========================================="
echo "🔍 Server Health Check"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please run this script from your project root directory."
    exit 1
fi

echo "1️⃣  Checking Node.js version..."
node -v
npm -v
echo ""

echo "2️⃣  Checking if .env file exists..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo "   Checking required variables..."
    if grep -q "DB_ENGINE" .env; then
        echo "   ✅ DB_ENGINE found"
    else
        echo "   ❌ DB_ENGINE missing"
    fi
    if grep -q "DB_NAME" .env; then
        echo "   ✅ DB_NAME found"
    else
        echo "   ❌ DB_NAME missing"
    fi
    if grep -q "SESSION_SECRET" .env; then
        echo "   ✅ SESSION_SECRET found"
    else
        echo "   ❌ SESSION_SECRET missing"
    fi
else
    echo "❌ .env file not found!"
    echo "   Please create .env from .env.example"
fi
echo ""

echo "3️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
    if [ -f "node_modules/express/package.json" ]; then
        echo "   ✅ Express.js installed"
    else
        echo "   ❌ Express.js not found - run: npm install"
    fi
else
    echo "❌ node_modules not found!"
    echo "   Run: npm install --production"
fi
echo ""

echo "4️⃣  Checking required directories..."
if [ -d "uploads" ]; then
    echo "✅ uploads/ directory exists"
else
    echo "⚠️  uploads/ directory missing - creating..."
    mkdir -p uploads/property_images
    chmod -R 755 uploads
fi

if [ -d "logs" ]; then
    echo "✅ logs/ directory exists"
else
    echo "⚠️  logs/ directory missing - creating..."
    mkdir -p logs
    chmod -R 755 logs
fi
echo ""

echo "5️⃣  Testing database connection..."
node -e "require('./config/database').testConnection().then(() => { console.log('✅ Database connection OK'); process.exit(0); }).catch((err) => { console.error('❌ Database connection failed:', err.message); process.exit(1); })" 2>&1
DB_STATUS=$?
echo ""

echo "6️⃣  Checking file permissions..."
if [ -r "server.js" ]; then
    echo "✅ server.js is readable"
else
    echo "❌ server.js is not readable"
    chmod 644 server.js
fi

if [ -r ".env" ]; then
    echo "✅ .env is readable"
else
    echo "❌ .env is not readable"
    chmod 644 .env
fi
echo ""

echo "7️⃣  Checking if port is available..."
PORT=$(grep -E "^PORT=" .env 2>/dev/null | cut -d'=' -f2 || echo "3000")
if [ -z "$PORT" ]; then
    PORT=3000
fi
echo "   Using PORT: $PORT"
if command -v lsof &> /dev/null; then
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   ⚠️  Port $PORT is already in use"
    else
        echo "   ✅ Port $PORT is available"
    fi
else
    echo "   ℹ️  Cannot check port (lsof not available)"
fi
echo ""

echo "=========================================="
if [ $DB_STATUS -eq 0 ]; then
    echo "✅ Basic checks passed!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure application is started in Hostinger hPanel"
    echo "2. Check application logs in hPanel"
    echo "3. Try restarting the application"
else
    echo "❌ Some checks failed!"
    echo ""
    echo "Please fix the errors above before starting the application."
fi
echo "=========================================="

