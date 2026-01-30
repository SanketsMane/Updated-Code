#!/bin/bash
set -e

HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
APP_PORT="2004"
APP_NAME="kidokool-lms"
REMOTE_DIR="/var/www/kidokool-lms"
ARCHIVE_NAME="deploy-package.zip"

run_remote() {
    sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "$1"
}

echo "=== KIDOKOOL LMS Deployment ==="
echo "1. Creating deployment package..."
rm -f "$ARCHIVE_NAME"
zip -r "$ARCHIVE_NAME" . \
    -x "node_modules/*" "*/node_modules/*" \
    -x ".next/*" ".git/*" \
    -x "deploy*.sh" "setup*.sh" "AWS/*" \
    -x "*.zip" "*.log" "cpanel-*/*" \
    -x "vps_key*"

echo "2. Uploading to VPS (10MB via SSH pipe)..."
run_remote "mkdir -p $REMOTE_DIR"
cat "$ARCHIVE_NAME" | sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "cat > $REMOTE_DIR/$ARCHIVE_NAME"

echo "3. Extracting and deploying..."
run_remote "
    cd $REMOTE_DIR
    echo 'Extracting files...'
    unzip -o $ARCHIVE_NAME > /dev/null 2>&1
    rm $ARCHIVE_NAME
    
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
        mv .env .env.production
    fi

    # Docker deployment
    echo 'Stopping old container...'
    docker stop $APP_NAME 2>/dev/null || true
    docker rm $APP_NAME 2>/dev/null || true

    echo 'Building Docker image (this may take 5-10 minutes)...'
    docker build -t $APP_NAME . 2>&1 | tail -20
    
    echo 'Starting container on port $APP_PORT...'
    docker run -d \
        --name $APP_NAME \
        --restart unless-stopped \
        -p $APP_PORT:3000 \
        --env-file .env.production \
        $APP_NAME
    
    echo 'Verifying container status...'
    sleep 3
    docker ps -f name=$APP_NAME
"

echo ""
echo "=== Deployment Complete! ==="
echo "Application URL: http://$HOST:$APP_PORT"
echo ""
