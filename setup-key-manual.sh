#!/bin/bash
set -e

HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
KEY_FILE="./vps_key"

echo "1. Generating SSH Key..."
rm -f "$KEY_FILE" "$KEY_FILE.pub"
ssh-keygen -t ed25519 -f "$KEY_FILE" -N "" -q

echo "2. Installing Key Manually..."
# Read pub key
PUB_KEY=$(cat "$KEY_FILE.pub")
# Execute installation
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PUB_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

echo "3. Verifying Access..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$USER@$HOST" "echo 'Key auth successful'"

echo "SSH Key Setup Complete."
