#!/bin/bash

# Local Build and Deploy Script for KIDOKOOL LMS
# This script builds the app locally and deploys to EC2 without Docker

set -e

# Configuration
EC2_IP="13.48.30.48"
EC2_USER="ubuntu"
PEM_KEY="/Users/sanket/Documents/LMS-Organomed copy/AWS/kidokool-lms-key.pem"
REMOTE_DIR="/home/ubuntu/kidokool-lms"
LOCAL_DIR="/Users/sanket/Documents/LMS-Organomed copy"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  KIDOKOOL LMS - Local Build & Deploy${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Build locally
echo -e "${GREEN}Step 1: Building Next.js application locally...${NC}"
cd "$LOCAL_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    pnpm install
fi

# Build the application
echo -e "${GREEN}Building production bundle...${NC}"
pnpm build

echo -e "${GREEN}✓ Local build completed${NC}"

# Step 2: Stop remote Docker build if running
echo -e "${GREEN}Step 2: Cleaning up EC2...${NC}"
ssh -i "$PEM_KEY" "$EC2_USER@$EC2_IP" << 'ENDSSH'
# Kill any running docker build processes
sudo pkill -f "docker build" || true

# Stop and remove container if exists
if [ "$(sudo docker ps -q -f name=kidokool-lms)" ]; then
    echo "Stopping existing container..."
    sudo docker stop kidokool-lms || true
    sudo docker rm kidokool-lms || true
fi

# Remove image if exists
if [ "$(sudo docker images -q kidokool-lms:latest)" ]; then
    echo "Removing old image..."
    sudo docker rmi kidokool-lms:latest || true
fi
ENDSSH

echo -e "${GREEN}✓ EC2 cleaned up${NC}"

# Step 3: Sync built files to EC2
echo -e "${GREEN}Step 3: Syncing files to EC2...${NC}"
rsync -avz --progress \
    -e "ssh -i \"$PEM_KEY\"" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'build*.log' \
    --exclude 'errors*.txt' \
    --exclude 'AWS' \
    "$LOCAL_DIR/" "$EC2_USER@$EC2_IP:$REMOTE_DIR/"

echo -e "${GREEN}✓ Files synced${NC}"

# Step 4: Install dependencies and start on EC2
echo -e "${GREEN}Step 4: Setting up and starting application on EC2...${NC}"
ssh -i "$PEM_KEY" "$EC2_USER@$EC2_IP" << 'ENDSSH'
cd /home/ubuntu/kidokool-lms

# Install pnpm if not installed
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    export PNPM_HOME="/home/ubuntu/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install --prod

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Stop existing PM2 process if running
pm2 delete kidokool-lms || true

# Start the application with PM2
echo "Starting application..."
pm2 start pnpm --name kidokool-lms -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup || true

echo "✓ Application started successfully"
pm2 status
ENDSSH

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Application URL: http://$EC2_IP:3000${NC}"
echo -e "${BLUE}To view logs: ssh -i $PEM_KEY $EC2_USER@$EC2_IP 'pm2 logs kidokool-lms'${NC}"
echo -e "${BLUE}To restart: ssh -i $PEM_KEY $EC2_USER@$EC2_IP 'pm2 restart kidokool-lms'${NC}"
echo -e "${GREEN}========================================${NC}"
