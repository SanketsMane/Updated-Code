/**
 * Email Configuration Test Script
 * Run this to verify your email setup is working correctly
 * 
 * Usage: npx tsx scripts/test-email.ts
 */

import { sendTemplatedEmail, sendEmail } from '../lib/email';

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');

  try {
    // Test basic email sending
    console.log('📧 Testing basic email...');
    const basicEmailSuccess = await sendEmail({
      to: 'bksun170882@gmail.com', // Using your email for testing
      subject: 'KIDOKOOL - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Configuration Successful!</h2>
          <p>Your KIDOKOOL email system is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    });

    if (basicEmailSuccess) {
      console.log('✅ Basic email test: SUCCESS\n');
    } else {
      console.log('❌ Basic email test: FAILED\n');
      return;
    }

    // Test templated emails
    console.log('🎨 Testing templated emails...');
    
    const templates = [
      {
        name: 'Welcome Email',
        template: 'welcome' as const,
        data: {
          userName: 'John Doe',
          platformUrl: 'http://localhost:3000'
        } as Record<string, string | number>
      },
      {
        name: 'Course Enrollment',
        template: 'courseEnrollment' as const,
        data: {
          userName: 'John Doe',
          courseTitle: 'Test Course',
          courseDescription: 'A sample course for testing',
          courseUrl: 'http://localhost:3000/dashboard/test-course',
          enrollmentDate: new Date().toLocaleDateString()
        } as Record<string, string | number>
      },
      {
        name: 'Password Reset',
        template: 'passwordReset' as const,
        data: {
          userName: 'John Doe',
          resetUrl: 'http://localhost:3000/reset-password?token=test',
          expirationTime: '1 hour'
        } as Record<string, string | number>
      }
    ];

    for (const { name, template, data } of templates) {
      console.log(`  Testing ${name}...`);
      const success = await sendTemplatedEmail(
        template,
        'bksun170882@gmail.com', // Using your email for testing
        `KIDOKOOL - ${name} Test`,
        data
      );
      
      if (success) {
        console.log(`  ✅ ${name}: SUCCESS`);
      } else {
        console.log(`  ❌ ${name}: FAILED`);
      }
    }

    console.log('\n🎉 Email configuration test completed!');
    console.log('📬 Check your email inbox for the test messages.');
    
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env.local file has correct email credentials');
    console.log('2. For Gmail, make sure you\'re using an App Password');
    console.log('3. For SMTP, verify host, port, and authentication settings');
    console.log('4. Check if your email provider requires specific security settings');
  }
}

// Load environment variables from .env and .env.local
import 'dotenv/config';

// Check if EMAIL_USER is configured
console.log('Environment check:', {
  EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV
});

if (!process.env.EMAIL_USER && !process.env.EMAIL_SERVICE) {
  console.log('⚠️  Email not configured yet!');
  console.log('Please set up your email configuration in .env.local first.');
  console.log('See MIGRATION-SETUP.md for detailed instructions.');
  process.exit(1);
}

// Run the test
testEmailConfiguration();