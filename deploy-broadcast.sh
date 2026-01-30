#!/bin/bash

# AWS EC2 Deployment Script for KIDOKOOL LMS - Broadcast Feature
# This script deploys the broadcast feature to EC2 by syncing files

set -e  # Exit on error

# Configuration
EC2_IP="16.176.20.69"
EC2_USER="ubuntu"
PEM_KEY="/Users/sanket/Documents/Kidokool-LMS/Kidokool-latest-key.pem"
APP_NAME="kidokool-lms"
REMOTE_DIR="/home/ubuntu/kidokool-lms"
LOCAL_DIR="/Users/sanket/Documents/Kidokool-LMS"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  KIDOKOOL LMS - Broadcast Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if PEM key exists
if [ ! -f "$PEM_KEY" ]; then
    echo -e "${RED}Error: PEM key not found at $PEM_KEY${NC}"
    exit 1
fi

# Set correct permissions for PEM key
echo -e "${GREEN}Setting PEM key permissions...${NC}"
chmod 400 "$PEM_KEY"

# Test SSH connection
echo -e "${GREEN}Testing SSH connection to EC2...${NC}"
if ! ssh -i "$PEM_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_USER@$EC2_IP" "echo 'Connection successful'"; then
    echo -e "${RED}Error: Cannot connect to EC2 instance${NC}"
    exit 1
fi

echo -e "${GREEN}✓ SSH connection successful${NC}"

# Sync broadcast-related files to EC2
echo -e "${GREEN}Syncing broadcast files to EC2...${NC}"
rsync -avz --progress \
    -e "ssh -i \"$PEM_KEY\"" \
    --include='app/actions/broadcasts.ts' \
    --include='app/admin/broadcasts/***' \
    --include='components/marketing/BroadcastBanner.tsx' \
    --include='components/sidebar/app-sidebar.tsx' \
    --include='lib/env.ts' \
    --include='prisma/schema.prisma' \
    --include='package.json' \
    --include='package-lock.json' \
    --exclude='*' \
    "$LOCAL_DIR/" "$EC2_USER@$EC2_IP:$REMOTE_DIR/"

# Sync the entire broadcast admin directory
echo -e "${GREEN}Syncing broadcast admin directory...${NC}"
scp -i "$PEM_KEY" -r "$LOCAL_DIR/app/admin/broadcasts" "$EC2_USER@$EC2_IP:$REMOTE_DIR/app/admin/"

# Sync broadcast action file
echo -e "${GREEN}Syncing broadcast actions...${NC}"
scp -i "$PEM_KEY" "$LOCAL_DIR/app/actions/broadcasts.ts" "$EC2_USER@$EC2_IP:$REMOTE_DIR/app/actions/"

# Sync broadcast banner component
echo -e "${GREEN}Syncing broadcast banner component...${NC}"
ssh -i "$PEM_KEY" "$EC2_USER@$EC2_IP" "mkdir -p $REMOTE_DIR/components/marketing"
scp -i "$PEM_KEY" "$LOCAL_DIR/components/marketing/BroadcastBanner.tsx" "$EC2_USER@$EC2_IP:$REMOTE_DIR/components/marketing/"

# Sync sidebar with broadcasts menu
echo -e "${GREEN}Syncing sidebar...${NC}"
scp -i "$PEM_KEY" "$LOCAL_DIR/components/sidebar/app-sidebar.tsx" "$EC2_USER@$EC2_IP:$REMOTE_DIR/components/sidebar/"

# Sync Prisma schema
echo -e "${GREEN}Syncing Prisma schema...${NC}"
scp -i "$PEM_KEY" "$LOCAL_DIR/prisma/schema.prisma" "$EC2_USER@$EC2_IP:$REMOTE_DIR/prisma/"

# Sync env.ts
echo -e "${GREEN}Syncing env.ts...${NC}"
scp -i "$PEM_KEY" "$LOCAL_DIR/lib/env.ts" "$EC2_USER@$EC2_IP:$REMOTE_DIR/lib/"

echo -e "${GREEN}✓ Files synced successfully${NC}"

# Run database migration and build on EC2
echo -e "${GREEN}Running database migration and building application...${NC}"
ssh -i "$PEM_KEY" "$EC2_USER@$EC2_IP" << 'ENDSSH'
cd /home/ubuntu/kidokool-lms

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migration
echo "Running database migration..."
npx prisma db push

# Build the application
echo "Building application..."
npm run build

# Restart PM2 process
echo "Restarting application..."
pm2 restart kidokool-lms || pm2 start npm --name "kidokool-lms" -- start

# Show status
pm2 status kidokool-lms

ENDSSH

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Application URL: http://$EC2_IP:3000${NC}"
echo -e "${BLUE}Admin Broadcasts: http://$EC2_IP:3000/admin/broadcasts${NC}"
echo -e "${BLUE}To view logs: ssh -i $PEM_KEY $EC2_USER@$EC2_IP 'pm2 logs kidokool-lms'${NC}"
echo -e "${BLUE}To restart: ssh -i $PEM_KEY $EC2_USER@$EC2_IP 'pm2 restart kidokool-lms'${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Visit http://$EC2_IP:3000/admin/broadcasts to create broadcasts"
echo -e "2. Test the broadcast banner on the homepage"
echo -e "3. Monitor logs for any errors"
