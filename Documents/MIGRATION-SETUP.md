# Examsphere LMS - Post-Migration Setup Guide

## 🎉 Migration Summary

This project has been successfully migrated with the following improvements:

### ✅ **Cost Savings Achieved: $588/year**
- **Arcjet Security** ($348/year) → Custom Security System
- **Resend Email** ($240/year) → Nodemailer with Professional Templates

### ✅ **Enhanced Features**
- Custom security system with bot detection and rate limiting
- 5 professional responsive email templates
- Multi-provider email support (Gmail, Outlook, SMTP, Mailtrap)
- Same functionality as paid services with better control

---

## 🚀 Quick Start

### 1. **Environment Setup**
```bash
# Copy the example environment file
cp .env.example .env.local

# Generate a secure secret for Better Auth
openssl rand -base64 32
```

### 2. **Configure Environment Variables**
Edit `.env.local` with your actual values:

#### **Database (Already Configured)**
```env
DATABASE_URL="postgres://e4579fd0e84ff965275128036b71b1c2d05e34fafba8fb58423994277f8f94a4:sk_6-v_jNzk9ZtdJuWdusyux@db.prisma.io:5432/postgres?sslmode=require&pool=true"
```

#### **Better Auth (Required)**
```env
BETTER_AUTH_SECRET="[paste-the-32-character-secret-from-step-1]"
BETTER_AUTH_URL="http://localhost:3000"
```

#### **Email Configuration (Choose One)**

**Option A: Gmail (Recommended for production)**
```env
EMAIL_SERVICE="gmail"
EMAIL_USER="youremail@gmail.com"
EMAIL_PASS="your-16-character-app-password"
EMAIL_FROM="Examsphere <youremail@gmail.com>"
```

**Option B: Mailtrap (Recommended for development)**
```env
EMAIL_HOST="sandbox.smtp.mailtrap.io"
EMAIL_PORT="2525"
EMAIL_SECURE="false"
EMAIL_USER="your-mailtrap-username"
EMAIL_PASS="your-mailtrap-password"
EMAIL_FROM="Examsphere <test@example.com>"
```

### 3. **Database Setup**
```bash
# Push database schema
pnpm db:push

# Or run migrations
pnpm prisma migrate dev
```

### 4. **Start Development Server**
```bash
pnpm dev
```

---

## 📧 Email Setup Guide

### **Gmail Configuration**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use the 16-character app password in `EMAIL_PASS`

### **Mailtrap Configuration (Development)**
1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create a new inbox
3. Copy SMTP credentials to your `.env.local`

### **Email Templates Available**
- **Course Enrollment** - Welcome email when user enrolls
- **Welcome Email** - New user registration
- **Password Reset** - Secure password reset link
- **Notifications** - General announcements
- **Receipts** - Purchase confirmations

---

## 🔒 Security Features

### **Custom Security System**
- **Bot Detection** - Blocks common bot patterns
- **Rate Limiting** - Prevents abuse with configurable limits
- **Email Validation** - Blocks disposable and invalid emails
- **In-Memory Storage** - Fast, serverless-friendly

### **Protection Levels**
- **General Routes**: 50 requests/minute
- **Auth Routes**: 10 requests/minute
- **Signup Routes**: 5 requests/2 minutes
- **Admin Actions**: 5 requests/minute
- **Enrollment Actions**: 3 requests/minute

---

## 💳 Stripe Integration

### **Webhook Setup**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## 🗄️ AWS S3 Setup (Optional)

For file uploads, configure your S3 bucket:
```env
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="us-east-1"
NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES="your-bucket"
```

---

## 🧪 Testing Email Service

Create a test script to verify email configuration:

```typescript
// scripts/test-email.ts
import { sendTemplatedEmail } from '../lib/email';

async function testEmail() {
  const success = await sendTemplatedEmail(
    'welcome',
    'test@example.com',
    'Test Email',
    {
      userName: 'Test User',
      platformUrl: 'http://localhost:3000'
    }
  );
  
  console.log('Email sent:', success);
}

testEmail();
```

Run with: `npx tsx scripts/test-email.ts`

---

## 🚨 Troubleshooting

### **Build Issues**
```bash
# If build fails due to env vars
SKIP_ENV_VALIDATION=true pnpm build
```

### **Database Issues**
```bash
# Reset database
pnpm prisma migrate reset

# Generate Prisma client
pnpm prisma generate
```

### **Email Issues**
- Check spam folder for test emails
- Verify app password for Gmail
- Check Mailtrap inbox for development emails

---

## 📁 New Files Added

### **Security System**
- `lib/security.ts` - Core security functions
- `lib/action-security.ts` - Server action protection

### **Email System**
- `lib/email.ts` - Email service with templates
- `lib/email-notifications.ts` - High-level email functions

### **Updated Files**
- `middleware.ts` - Custom security middleware
- `lib/auth.ts` - Updated for Nodemailer
- `lib/env.ts` - Updated environment schema
- `package.json` - Updated dependencies
- All admin action files - Security integration
- Stripe webhook - Email integration

---

## 🎯 Next Steps

1. **Configure your email provider** (Gmail or Mailtrap)
2. **Set up Stripe webhooks** for payment processing
3. **Test the email system** with the test script
4. **Configure AWS S3** for file uploads (optional)
5. **Deploy to production** with proper environment variables

---

## 💰 Cost Comparison

| Service | Before | After | Savings |
|---------|--------|-------|---------|
| Security (Arcjet) | $348/year | $0 | $348/year |
| Email (Resend) | $240/year | $0 | $240/year |
| **Total** | **$588/year** | **$0** | **$588/year** |

**Plus enhanced features and better control!** 🚀