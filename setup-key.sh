#!/bin/bash
set -e

HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
KEY_FILE="./vps_key"

echo "1. Generating SSH Key..."
rm -f "$KEY_FILE" "$KEY_FILE.pub"
ssh-keygen -t ed25519 -f "$KEY_FILE" -N "" -q

echo "2. Copying Key to VPS..."
# Add key to authorized_keys using sshpass
sshpass -p "$PASS" ssh-copy-id -o StrictHostKeyChecking=no -i "$KEY_FILE.pub" "$USER@$HOST"

echo "3. Verifying Access..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$USER@$HOST" "echo 'Key auth successful'"

echo "SSH Key Setup Complete."
