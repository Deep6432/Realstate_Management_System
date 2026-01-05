#!/bin/bash
# Verify static files are accessible on server
# Run this on your Hostinger server

echo "=========================================="
echo "🔍 Verifying Static Files on Server"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please run this script from your project root directory."
    exit 1
fi

echo "1️⃣  Checking file existence..."
echo ""

# Check CSS file
if [ -f "public/css/style.css" ]; then
    CSS_SIZE=$(wc -c < "public/css/style.css")
    echo "✅ public/css/style.css exists (${CSS_SIZE} bytes)"
else
    echo "❌ public/css/style.css NOT FOUND!"
fi

# Check JS file
if [ -f "public/js/main.js" ]; then
    JS_SIZE=$(wc -c < "public/js/main.js")
    echo "✅ public/js/main.js exists (${JS_SIZE} bytes)"
else
    echo "❌ public/js/main.js NOT FOUND!"
fi

# Check favicon
if [ -f "public/favicon.svg" ]; then
    FAV_SIZE=$(wc -c < "public/favicon.svg")
    echo "✅ public/favicon.svg exists (${FAV_SIZE} bytes)"
else
    echo "❌ public/favicon.svg NOT FOUND!"
fi

echo ""
echo "2️⃣  Checking file permissions..."
echo ""

# Check permissions
if [ -r "public/css/style.css" ]; then
    PERMS=$(stat -c "%a" "public/css/style.css" 2>/dev/null || stat -f "%OLp" "public/css/style.css" 2>/dev/null)
    echo "✅ public/css/style.css is readable (permissions: $PERMS)"
    if [ "$PERMS" != "644" ] && [ "$PERMS" != "0644" ]; then
        echo "   ⚠️  Should be 644, fixing..."
        chmod 644 public/css/style.css
    fi
else
    echo "❌ public/css/style.css is NOT readable!"
    echo "   Fixing permissions..."
    chmod 644 public/css/style.css
fi

if [ -r "public/js/main.js" ]; then
    PERMS=$(stat -c "%a" "public/js/main.js" 2>/dev/null || stat -f "%OLp" "public/js/main.js" 2>/dev/null)
    echo "✅ public/js/main.js is readable (permissions: $PERMS)"
    if [ "$PERMS" != "644" ] && [ "$PERMS" != "0644" ]; then
        echo "   ⚠️  Should be 644, fixing..."
        chmod 644 public/js/main.js
    fi
else
    echo "❌ public/js/main.js is NOT readable!"
    chmod 644 public/js/main.js
fi

echo ""
echo "3️⃣  Checking directory permissions..."
echo ""

if [ -d "public" ] && [ -x "public" ]; then
    PERMS=$(stat -c "%a" "public" 2>/dev/null || stat -f "%OLp" "public" 2>/dev/null)
    echo "✅ public/ directory is accessible (permissions: $PERMS)"
    if [ "$PERMS" != "755" ] && [ "$PERMS" != "0755" ]; then
        echo "   ⚠️  Should be 755, fixing..."
        chmod 755 public
    fi
else
    echo "❌ public/ directory is NOT accessible!"
    chmod 755 public
fi

if [ -d "public/css" ] && [ -x "public/css" ]; then
    echo "✅ public/css/ directory is accessible"
else
    echo "❌ public/css/ directory is NOT accessible!"
    chmod 755 public/css
fi

if [ -d "public/js" ] && [ -x "public/js" ]; then
    echo "✅ public/js/ directory is accessible"
else
    echo "❌ public/js/ directory is NOT accessible!"
    chmod 755 public/js
fi

echo ""
echo "4️⃣  Testing Express static configuration..."
echo ""

# Check if server.js has static file configuration
if grep -q "express.static" server.js; then
    echo "✅ server.js has express.static configuration"
    if grep -q "/static" server.js; then
        echo "✅ /static path is configured"
    else
        echo "⚠️  /static path might not be configured"
    fi
else
    echo "❌ server.js does NOT have express.static configuration!"
fi

echo ""
echo "5️⃣  Checking .htaccess..."
echo ""

if [ -f ".htaccess" ]; then
    echo "✅ .htaccess file exists"
    if grep -q "static" .htaccess; then
        echo "✅ .htaccess has static file rules"
    else
        echo "⚠️  .htaccess might not have static file rules"
    fi
else
    echo "⚠️  .htaccess file not found (might be OK if not using Apache)"
fi

echo ""
echo "=========================================="
echo "📋 Summary"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. If files are missing, run: git pull origin hostinger"
echo "2. If permissions are wrong, they've been fixed above"
echo "3. Restart your Node.js app in Hostinger hPanel"
echo "4. Test: https://yourdomain.com/static/css/style.css"
echo "5. Clear browser cache (Ctrl+Shift+R)"
echo ""

