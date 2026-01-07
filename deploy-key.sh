#!/bin/bash
set -e

HOST="159.198.40.133"
USER="root"
# Use generated key
KEY_FILE="./vps_key"
APP_PORT="2004"
APP_NAME="kidokool-lms"
REMOTE_DIR="/var/www/kidokool-lms"
ARCHIVE_NAME="deploy-package.zip"

run_remote() {
    ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$USER@$HOST" "$1"
}

echo "1. Zipping..."
rm -f "$ARCHIVE_NAME"
zip -r "$ARCHIVE_NAME" . -x "node_modules/*" "*/node_modules/*" ".next/*" ".git/*" "deploy*.sh" "AWS/*" "*.zip" "*.log" "cpanel-*/*"

echo "2. Uploading via SCP (Key Auth)..."
run_remote "mkdir -p $REMOTE_DIR"
scp -i "$KEY_FILE" -o StrictHostKeyChecking=no "$ARCHIVE_NAME" "$USER@$HOST:$REMOTE_DIR/$ARCHIVE_NAME"

echo "3. Deploying..."
run_remote "
    cd $REMOTE_DIR
    echo 'Extracting...'
    unzip -o $ARCHIVE_NAME > /dev/null
    rm $ARCHIVE_NAME
    
    if [ ! -f /swapfile ]; then
        echo 'Creating swap...'
        dd if=/dev/zero of=/swapfile bs=128M count=16
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile || true
    fi

    if [ -f .env ]; then mv .env .env.production; fi

    echo 'Stopping old container...'
    docker stop $APP_NAME || true
    docker rm $APP_NAME || true

    echo 'Building Docker image...'
    docker build -t $APP_NAME .
    
    echo 'Starting container...'
    docker run -d --name $APP_NAME --restart unless-stopped -p $APP_PORT:3000 --env-file .env.production $APP_NAME
"

echo "Done! Check http://$HOST:$APP_PORT"
