#!/bin/bash
# Chunked upload script - splits large file into chunks and uploads piece by piece
set -e

HOST="159.198.40.133"
USER="root"
PASS="y371W7cpF2ZtEAI7jr"
REMOTE_DIR="/var/www/kidokool-lms"
ARCHIVE="kidokool-deploy.zip"
CHUNK_SIZE=1048576  # 1MB chunks

echo "=== Chunked Upload to VPS ==="

if [ ! -f "$ARCHIVE" ]; then
    echo "Error: $ARCHIVE not found"
    exit 1
fi

# Get file size
FILE_SIZE=$(wc -c < "$ARCHIVE")
echo "File size: $FILE_SIZE bytes"
echo "Chunk size: $CHUNK_SIZE bytes"

# Calculate number of chunks
CHUNKS=$(( ($FILE_SIZE + $CHUNK_SIZE - 1) / $CHUNK_SIZE ))
echo "Total chunks: $CHUNKS"

# Create remote directory
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "mkdir -p $REMOTE_DIR && rm -f $REMOTE_DIR/${ARCHIVE}.part*"

# Upload chunks
for i in $(seq 0 $(($CHUNKS - 1))); do
    SKIP=$((i * $CHUNK_SIZE))
    echo "Uploading chunk $((i+1))/$CHUNKS..."
    
    # Extract chunk and upload via base64 encoding (more reliable than binary)
    dd if="$ARCHIVE" bs=$CHUNK_SIZE skip=$i count=1 2>/dev/null | base64 | \
    sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" \
        "base64 -d > $REMOTE_DIR/${ARCHIVE}.part$i"
    
    echo "  ✓ Chunk $((i+1)) uploaded"
done

# Reassemble on server
echo "Reassembling file on server..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$HOST" "
    cd $REMOTE_DIR
    cat ${ARCHIVE}.part* > $ARCHIVE
    rm -f ${ARCHIVE}.part*
    echo 'File reassembled successfully'
    ls -lh $ARCHIVE
"

echo "✓ Upload complete!"
