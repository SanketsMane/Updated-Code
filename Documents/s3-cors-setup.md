# S3 Bucket CORS Configuration

## Issue
Getting **403 Forbidden** error when uploading files to S3 using presigned URLs.

## Root Cause
The S3 bucket `Examsphere-sanket-dev` needs CORS (Cross-Origin Resource Sharing) configuration to allow uploads from the browser.

## Solution: Configure CORS on S3 Bucket

### Option 1: Via AWS Console (Recommended)

1. **Go to AWS S3 Console**: https://console.aws.amazon.com/s3/
2. **Select your bucket**: `Examsphere-sanket-dev`
3. **Navigate to**: Permissions tab → CORS configuration
4. **Add the following CORS configuration**:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://yourdomain.com"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

5. **Save the configuration**

### Option 2: Via AWS CLI

Run this command (replace with your actual production domain):

```bash
aws s3api put-bucket-cors --bucket Examsphere-sanket-dev --cors-configuration file://cors.json --region eu-north-1
```

Where `cors.json` contains:

```json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": [
                "http://localhost:3000",
                "http://localhost:3001",
                "https://yourdomain.com"
            ],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
```

## After Configuration

1. **Wait 1-2 minutes** for CORS changes to propagate
2. **Refresh your browser**
3. **Try uploading again**

## Production Deployment

When deploying to production, update `AllowedOrigins` to include:
- Your production domain (e.g., `https://Examsphere.com`)
- Remove localhost origins for security

## Additional Security Notes

- The current CORS config allows all headers (`*`) which is fine for development
- For production, you may want to restrict to specific headers
- Consider adding your staging environment URLs as well
