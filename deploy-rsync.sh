#!/bin/bash
set -e

HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
APP_PORT="2004"
APP_NAME="kidokool-lms"
REMOTE_DIR="/var/www/kidokool-lms"

# Helper for SSH commands
run_remote() {
    sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "$1"
}

echo "1. Syncing files to VPS..."
run_remote "mkdir -p $REMOTE_DIR"

# Rsync with sshpass
# Exclude heavy/unnecessary files
sshpass -p "$PASS" rsync -avz --progress \
    -e "ssh -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '*/node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'deploy*.sh' \
    --exclude 'AWS' \
    --exclude '*.zip' \
    --exclude '*.log' \
    --exclude 'cpanel-*' \
    . "$USER@$HOST:$REMOTE_DIR/"

echo "2. Deploying..."
run_remote "
    cd $REMOTE_DIR
    
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
