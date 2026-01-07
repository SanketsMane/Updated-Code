#!/bin/bash
set -e

HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
APP_PORT="2004"
APP_NAME="kidokool-lms"
REMOTE_DIR="/var/www/kidokool-lms"
REPO_URL="https://github.com/SanketsMane/KIDOKOOL-LMS-Marketplace-UPDATED.git"
BRANCH="main"  # or "rohan" depending on which branch you want to deploy

echo "=== Git-Based VPS Deployment ==="

# Step 1: Ensure code is pushed to GitHub
echo "1. Checking local git status..."
if [[ -n $(git status -s) ]]; then
    echo "   You have uncommitted changes. Commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Deployment update'"
    echo "   git push origin $BRANCH"
    exit 1
fi

echo "2. Deploying to VPS via Git..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" bash <<ENDSSH
set -e

# Clone or pull repository
if [ -d "$REMOTE_DIR/.git" ]; then
    echo "Updating existing repository..."
    cd $REMOTE_DIR
    git fetch origin
    git reset --hard origin/$BRANCH
    git clean -fd
else
    echo "Cloning repository..."
    rm -rf $REMOTE_DIR
    git clone -b $BRANCH $REPO_URL $REMOTE_DIR
    cd $REMOTE_DIR
fi

# Setup swap if needed
if [ ! -f /swapfile ]; then
    echo 'Creating 2GB swap...'
    dd if=/dev/zero of=/swapfile bs=128M count=16 2>/dev/null
    chmod 600 /swapfile
    mkswap /swapfile > /dev/null 2>&1
    swapon /swapfile 2>/dev/null || true
fi

# Setup environment
if [ -f .env ]; then 
    cp .env .env.production
fi

# Docker deployment
echo 'Stopping old container...'
docker stop $APP_NAME 2>/dev/null || true
docker rm $APP_NAME 2>/dev/null || true

echo 'Building Docker image...'
docker build -t $APP_NAME .

echo 'Starting container on port $APP_PORT...'
docker run -d \
    --name $APP_NAME \
    --restart unless-stopped \
    -p $APP_PORT:3000 \
    --env-file .env.production \
    $APP_NAME

echo 'Verifying deployment...'
sleep 3
docker ps -f name=$APP_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

ENDSSH

echo ""
echo "=== Deployment Complete! ==="
echo "Application URL: http://$HOST:$APP_PORT"
echo ""
