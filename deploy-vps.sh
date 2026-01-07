#!/bin/bash

# VPS Deployment Script for KIDOKOOL LMS
# Target: AlmaLinux 9.7 on 159.198.40.133

set -e

# Configuration
HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
APP_PORT="2004"
APP_NAME="kidokool-lms"
REMOTE_DIR="/var/www/kidokool-lms"
ARCHIVE_NAME="deploy-package.zip"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  KIDOKOOL LMS - VPS Deployment (SCP)${NC}"
echo -e "${BLUE}========================================${NC}"

# Helper for SSH commands
run_remote() {
    sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "$1"
}

# 1. Prepare Server (Install Unzip if missing)
echo -e "${GREEN}Preparing server environment...${NC}"
run_remote "
    if ! command -v unzip &> /dev/null; then
        echo 'Installing unzip...'
        dnf install -y unzip
    fi
     if ! command -v docker &> /dev/null; then
         # Just in case
        echo 'Installing Docker...'
        dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        dnf install -y docker-ce docker-ce-cli containerd.io
        systemctl start docker
        systemctl enable docker
    fi
"

# 2. Package Files Locally
echo -e "${GREEN}Packaging files locally...${NC}"
# Remove old archive
rm -f "$ARCHIVE_NAME"
# Zip files excluding heavy/unnecessary ones
zip -r "$ARCHIVE_NAME" . -x "node_modules/*" ".next/*" ".git/*" "deploy-vps.sh" ".DS_Store" "AWS/*"

# 3. Upload Package
echo -e "${GREEN}Uploading package to VPS...${NC}"
# Create dir
run_remote "mkdir -p $REMOTE_DIR"
# SCP
sshpass -p "$PASS" scp -o StrictHostKeyChecking=no "$ARCHIVE_NAME" "$USER@$HOST:$REMOTE_DIR/$ARCHIVE_NAME"

# 4. Extract and Deploy
echo -e "${GREEN}Extracting and deploying...${NC}"
run_remote "
    cd $REMOTE_DIR
    echo 'Extracting files...'
    unzip -o $ARCHIVE_NAME > /dev/null
    rm $ARCHIVE_NAME

    # Create swap if not exists
    if [ ! -f /swapfile ]; then
        echo 'Creating 2GB swap file...'
        dd if=/dev/zero of=/swapfile bs=128M count=16
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile || true
    fi

    # Setup .env
    if [ -f .env ]; then
        mv .env .env.production
    fi

    # Build Docker
    echo 'Building Docker image (this may take 5-10 mins)...'
    docker build -t $APP_NAME:latest .

    # Stop old
    if [ \"\$(docker ps -q -f name=$APP_NAME)\" ]; then
        docker stop $APP_NAME
        docker rm $APP_NAME
    fi
    docker rm $APP_NAME 2>/dev/null || true

    # Run
    echo 'Starting container on port $APP_PORT...'
    docker run -d \
        --name $APP_NAME \
        --restart unless-stopped \
        -p $APP_PORT:3000 \
        --env-file .env.production \
        $APP_NAME:latest
"

# Cleanup Local
rm -f "$ARCHIVE_NAME"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Application URL: http://$HOST:$APP_PORT${NC}"
