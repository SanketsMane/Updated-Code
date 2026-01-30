// Author: Sanket
// Purpose: Check if S3 bucket is active and accessible

const { S3Client, HeadBucketCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'eu-north-1',
    bucketName: process.env.AWS_BUCKET_NAME || 'kidokool-sanket-dev'
};

async function checkBucket() {
    const client = new S3Client({
        region: config.region,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey
        }
    });

    try {
        console.log('🔍 Checking S3 bucket status...\n');
        console.log(`Bucket Name: ${config.bucketName}`);
        console.log(`Region: ${config.region}\n`);

        // Check if bucket exists and is accessible
        const headResponse = await client.send(new HeadBucketCommand({
            Bucket: config.bucketName
        }));

        console.log('✅ SUCCESS: Bucket is ACTIVE and accessible!\n');
        console.log('Bucket Details:');
        console.log(`- Status Code: ${headResponse.$metadata.httpStatusCode}`);
        console.log(`- Request ID: ${headResponse.$metadata.requestId}`);

        // Try to list objects to verify permissions
        const listResponse = await client.send(new ListObjectsV2Command({
            Bucket: config.bucketName,
            MaxKeys: 5
        }));

        console.log('\n📁 Bucket Contents:');
        console.log(`- Total objects shown: ${listResponse.Contents?.length || 0}`);
        console.log(`- Bucket is truncated: ${listResponse.IsTruncated || false}`);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
            console.log('\nSample files:');
            listResponse.Contents.forEach((obj, index) => {
                console.log(`  ${index + 1}. ${obj.Key} (${obj.Size} bytes)`);
            });
        } else {
            console.log('  (Bucket is empty or no objects found)');
        }

        console.log('\n✅ All checks passed! The S3 bucket is fully operational.');

    } catch (error) {
        console.error('❌ ERROR: Bucket check failed!\n');
        console.error(`Error Type: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Code: ${error.$metadata?.httpStatusCode || error.code || 'N/A'}`);

        // Show detailed error information
        if (error.$fault) {
            console.error(`Error Fault: ${error.$fault}`);
        }

        console.error('\nFull Error Details:');
        console.error(JSON.stringify(error, null, 2));

        if (error.name === 'NoSuchBucket') {
            console.error('\n💡 The bucket does not exist.');
        } else if (error.name === 'Forbidden' || error.name === 'AccessDenied') {
            console.error('\n💡 Access denied. Check your AWS credentials and bucket permissions.');
        } else if (error.name === 'NotFound') {
            console.error('\n💡 Bucket not found in the specified region.');
        }

        process.exit(1);
    }
}

checkBucket();
