#!/bin/bash
set -e

# Define directories
DEPLOY_DIR="cpanel-deploy"
ZIP_NAME="kidokool-lms-cpanel.zip"

echo "📦 Preparing cPanel Deployment Package..."

# 1. Check for Standalone Build
if [ ! -d ".next/standalone" ]; then
    echo "❌ Error: .next/standalone not found!"
    echo "   Please run 'pnpm build' first."
    exit 1
fi

# 2. Clean previous build
rm -rf $DEPLOY_DIR $ZIP_NAME
mkdir -p $DEPLOY_DIR

# 3. Copy Standalone Server files
echo "-> Copying Application Server..."
cp -R .next/standalone/* $DEPLOY_DIR/

# 4. Copy Static Assets (CRITICAL for cPanel)
echo "-> Copying Static Assets..."
mkdir -p $DEPLOY_DIR/.next/static
cp -R .next/static/* $DEPLOY_DIR/.next/static/
cp -R public $DEPLOY_DIR/public

# 5. Copy Environment
echo "-> Copying Environment..."
if [ -f ".env.production" ]; then
    cp .env.production $DEPLOY_DIR/.env
else
    echo "⚠️ .env.production not found, skipping..."
fi

# 6. Create custom launcher for cPanel
# This helps ensure the correct port and hostname are used
echo "-> Creating cPanel Launcher..."
cat > $DEPLOY_DIR/cpanel_index.js << 'EOF'
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = '0.0.0.0';

const path = require('path');
const next = require('next');

// Import the standalone server entry point
// Note: Depending on Next.js version, this might differ.
// Usually the standalone server.js starts the server immediately.
// We just require it.
require('./server.js');
EOF

echo "-> Zipping Package..."
cd $DEPLOY_DIR
zip -r ../$ZIP_NAME .
cd ..

echo "✅ SUCCESS! Package created: $ZIP_NAME"
echo "👉 Upload this file to your cPanel File Manager."
