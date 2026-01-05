#!/bin/bash
# Check Node.js version on server
# Run this on your Hostinger server

echo "=========================================="
echo "🔍 Node.js Version Check"
echo "=========================================="
echo ""

echo "1️⃣  Current Node.js version:"
node -v
echo ""

echo "2️⃣  Current npm version:"
npm -v
echo ""

echo "3️⃣  Required version (from package.json):"
if [ -f "package.json" ]; then
    grep -A 2 '"engines"' package.json | grep '"node"' || echo "   Not specified in package.json"
else
    echo "   package.json not found"
fi
echo ""

echo "4️⃣  Version specified in .nvmrc:"
if [ -f ".nvmrc" ]; then
    echo "   $(cat .nvmrc)"
else
    echo "   .nvmrc not found"
fi
echo ""

echo "5️⃣  Version specified in .node-version:"
if [ -f ".node-version" ]; then
    echo "   $(cat .node-version)"
else
    echo "   .node-version not found"
fi
echo ""

echo "=========================================="
echo "📋 Summary"
echo "=========================================="
echo ""
echo "Project requires: Node.js 18.x"
echo ""

CURRENT_NODE=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$CURRENT_NODE" = "18" ]; then
    echo "✅ Node.js version matches requirement (18.x)"
else
    echo "⚠️  Node.js version mismatch!"
    echo "   Current: $(node -v)"
    echo "   Required: 18.x"
    echo ""
    echo "To fix in Hostinger:"
    echo "1. Go to hPanel → Advanced → Node.js App"
    echo "2. Edit your application"
    echo "3. Change Node.js version to 18.x"
    echo "4. Save and restart"
fi
echo ""

