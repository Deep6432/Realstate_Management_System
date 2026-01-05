#!/bin/bash
# Environment Variables Setup Script for Hostinger
# This script helps you create and verify .env file on the server

echo "=========================================="
echo "🔧 Environment Variables Setup"
echo "=========================================="
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found!"
    exit 1
fi

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file"
        echo ""
        echo "Current .env contents:"
        echo "----------------------------------------"
        cat .env
        echo "----------------------------------------"
        exit 0
    fi
    echo "Backing up existing .env to .env.backup"
    cp .env .env.backup
fi

# Copy .env.example to .env
echo "📋 Creating .env from .env.example..."
cp .env.example .env
echo "✅ .env file created"
echo ""

# Display the .env file
echo "📄 Current .env file:"
echo "----------------------------------------"
cat .env
echo "----------------------------------------"
echo ""

# Check required variables
echo "🔍 Checking required environment variables..."
echo ""

REQUIRED_VARS=(
    "NODE_ENV"
    "PORT"
    "DB_ENGINE"
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "SESSION_SECRET"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env; then
        value=$(grep "^${var}=" .env | cut -d'=' -f2)
        if [ -z "$value" ] || [ "$value" = "your_database_name" ] || [ "$value" = "your_database_user" ] || [ "$value" = "your_database_password" ] || [ "$value" = "your-session-secret-key-change-this-in-production-generate-random-string" ]; then
            echo "⚠️  ${var}: Needs to be configured (currently: $value)"
            MISSING_VARS+=("$var")
        else
            echo "✅ ${var}: Set"
        fi
    else
        echo "❌ ${var}: Missing"
        MISSING_VARS+=("$var")
    fi
done

echo ""

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required variables are configured!"
else
    echo "⚠️  The following variables need to be configured:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "📝 Edit .env file:"
    echo "   nano .env"
    echo ""
    echo "Or use Hostinger File Manager to edit .env"
fi

echo ""
echo "=========================================="
echo "📋 Next Steps:"
echo "=========================================="
echo ""
echo "1. Edit .env file with your actual values:"
echo "   nano .env"
echo ""
echo "2. Required values to update:"
echo "   - DB_NAME: Your MySQL database name"
echo "   - DB_USER: Your MySQL username"
echo "   - DB_PASSWORD: Your MySQL password"
echo "   - SESSION_SECRET: Generate with:"
echo "     node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
echo "3. After updating, restart your Node.js app in Hostinger hPanel"
echo ""

