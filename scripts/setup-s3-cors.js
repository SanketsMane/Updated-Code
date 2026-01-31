// Author: Sanket
// Purpose: Configure CORS on S3 bucket to allow browser uploads

const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'eu-north-1',
    bucketName: process.env.AWS_BUCKET_NAME || 'Examsphere-sanket-dev'
};

async function setupCORS() {
    const client = new S3Client({
        region: config.region,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey
        }
    });

    console.log('🔧 Setting up CORS configuration for S3 bucket...\n');
    console.log(`Bucket: ${config.bucketName}`);
    console.log(`Region: ${config.region}\n`);

    // CORS configuration
    const corsConfiguration = {
        CORSRules: [
            {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                AllowedOrigins: [
                    'http://localhost:3000',
                    'http://localhost:3001',
                    'http://192.168.1.14:3000',
                    // Add your production domain here later
                    // 'https://yourdomain.com'
                ],
                ExposeHeaders: ['ETag'],
                MaxAgeSeconds: 3000
            }
        ]
    };

    try {
        // Check existing CORS configuration
        console.log('📋 Checking existing CORS configuration...');
        try {
            const existingCors = await client.send(new GetBucketCorsCommand({
                Bucket: config.bucketName
            }));
            console.log('Current CORS rules:', JSON.stringify(existingCors.CORSRules, null, 2));
        } catch (error) {
            if (error.name === 'NoSuchCORSConfiguration') {
                console.log('No existing CORS configuration found.');
            } else {
                throw error;
            }
        }

        // Apply new CORS configuration
        console.log('\n✏️  Applying new CORS configuration...');
        await client.send(new PutBucketCorsCommand({
            Bucket: config.bucketName,
            CORSConfiguration: corsConfiguration
        }));

        console.log('\n✅ SUCCESS! CORS configuration applied successfully!\n');
        console.log('📝 CORS Rules:');
        console.log(JSON.stringify(corsConfiguration.CORSRules, null, 2));

        console.log('\n🎉 Your S3 bucket is now configured for browser uploads!');
        console.log('\n⏳ Wait 1-2 minutes for changes to propagate, then:');
        console.log('   1. Refresh your browser');
        console.log('   2. Try uploading a file again');
        console.log('   3. The 403 error should be resolved!\n');

    } catch (error) {
        console.error('\n❌ ERROR: Failed to configure CORS!');
        console.error(`Error Type: ${error.name}`);
        console.error(`Error Message: ${error.message}`);

        if (error.name === 'AccessDenied') {
            console.error('\n💡 Your AWS credentials may not have permission to modify bucket CORS.');
            console.error('   Please use the AWS Console to configure CORS manually:');
            console.error('   1. Go to: https://console.aws.amazon.com/s3/');
            console.error(`   2. Select bucket: ${config.bucketName}`);
            console.error('   3. Go to: Permissions → CORS');
            console.error('   4. Paste the CORS configuration from s3-cors-setup.md');
        }

        process.exit(1);
    }
}

setupCORS();
