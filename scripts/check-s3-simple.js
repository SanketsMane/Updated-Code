// Author: Sanket
// Purpose: Check if S3 bucket is active using simple HTTP request

const https = require('https');
const crypto = require('crypto');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'eu-north-1',
    bucketName: process.env.AWS_BUCKET_NAME || 'Examsphere-sanket-dev'
};

// Simple check using AWS S3 REST API
function checkBucketSimple() {
    const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/`;

    console.log('🔍 Checking S3 bucket status...\n');
    console.log(`Bucket Name: ${config.bucketName}`);
    console.log(`Region: ${config.region}`);
    console.log(`Endpoint: ${url}\n`);

    https.get(url, (res) => {
        console.log(`Response Status Code: ${res.statusCode}`);
        console.log(`Response Headers:`, res.headers);

        if (res.statusCode === 200 || res.statusCode === 403) {
            // 200 means bucket exists and is accessible
            // 403 means bucket exists but we don't have ListBucket permission (which is fine, bucket still exists)
            console.log('\n✅ SUCCESS: Bucket EXISTS and is ACTIVE!');
            if (res.statusCode === 403) {
                console.log('   (Access is restricted, but bucket is confirmed to exist)');
            }
        } else if (res.statusCode === 404) {
            console.log('\n❌ ERROR: Bucket does NOT exist or is in a different region!');
        } else if (res.statusCode === 301) {
            console.log('\n⚠️  WARNING: Bucket exists but is in a different region!');
            console.log('   Redirect location:', res.headers.location);
        } else {
            console.log(`\n⚠️  WARNING: Unexpected status code: ${res.statusCode}`);
        }

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (data) {
                console.log('\nResponse body:', data.substring(0, 500));
            }
        });

    }).on('error', (err) => {
        console.error('\n❌ ERROR: Failed to connect to S3!');
        console.error('Error:', err.message);
        console.error('\nPossible causes:');
        console.error('- Network connectivity issues');
        console.error('- DNS resolution problems');
        console.error('- Firewall blocking the connection');
    });
}

checkBucketSimple();
