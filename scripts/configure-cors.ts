import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("❌ Missing required environment variables. Please check your .env file.");
    process.exit(1);
}

const client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const corsRules = [
    {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedOrigins: ["http://localhost:3000"],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000,
    },
];

async function configureCors() {
    try {
        console.log(`⏳ Applying CORS configuration to bucket: ${bucketName}...`);

        const div = new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: corsRules,
            },
        });

        await client.send(div);

        console.log("✅ CORS configuration applied successfully!");
    } catch (err) {
        console.error("❌ Error applying CORS configuration:", err);
    }
}

configureCors();
