/**
 * Professional Email Service using Nodemailer
 * Replaces Resend with multi-provider support and professional templates
 */

import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface TemplateData {
  [key: string]: string | number;
}

/**
 * Create nodemailer transporter based on configuration
 */
function createTransporter() {
  const service = process.env.EMAIL_SERVICE;
  
  if (service === 'gmail') {
    // Gmail configuration
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    });
  } else {
    // Custom SMTP configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    });
  }
}

/**
 * Professional email templates
 */
const emailTemplates = {
  courseEnrollment: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Course Enrollment Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .course-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Your New Course!</h1>
        </div>
        
        <p>Hi ${data.userName},</p>
        
        <p>Congratulations! You have successfully enrolled in:</p>
        
        <div class="course-info">
          <h3>${data.courseTitle}</h3>
          <p>${data.courseDescription}</p>
          <p><strong>Enrollment Date:</strong> ${data.enrollmentDate}</p>
        </div>
        
        <p>You can now access your course materials and start learning immediately.</p>
        
        <div style="text-align: center;">
          <a href="${data.courseUrl}" class="cta-button">Start Learning Now →</a>
        </div>
        
        <p>If you have any questions, feel free to reach out to our support team.</p>
        
        <div class="footer">
          <p>Thank you for choosing our platform!</p>
          <p>Happy Learning! 📚</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcome: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome to Our Platform</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .feature { display: flex; align-items: center; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .feature-icon { font-size: 24px; margin-right: 15px; }
        .cta-button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Our Learning Platform!</h1>
        </div>
        
        <p>Hi ${data.userName},</p>
        
        <p>Welcome to our learning community! We're excited to have you on board.</p>
        
        <div class="feature">
          <div class="feature-icon">📚</div>
          <div>
            <h4>Access Quality Courses</h4>
            <p>Explore our extensive library of professional courses.</p>
          </div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">🎓</div>
          <div>
            <h4>Learn at Your Own Pace</h4>
            <p>Study whenever and wherever you want.</p>
          </div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">💬</div>
          <div>
            <h4>Community Support</h4>
            <p>Connect with fellow learners and instructors.</p>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${data.platformUrl}" class="cta-button">Start Exploring →</a>
        </div>
        
        <div class="footer">
          <p>Happy Learning! 🚀</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .reset-info { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .cta-button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .security-note { background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        
        <p>Hi ${data.userName},</p>
        
        <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${data.resetUrl}" class="cta-button">Reset Password →</a>
        </div>
        
        <div class="reset-info">
          <p><strong>Important:</strong> This password reset link will expire in ${data.expirationTime || '1 hour'}.</p>
        </div>
        
        <div class="security-note">
          <p><strong>Security Note:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
        
        <div class="footer">
          <p>For security reasons, this link will only work once.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  notification: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .notification-content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #74b9ff; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 ${data.title || 'Notification'}</h1>
        </div>
        
        <p>Hi ${data.userName},</p>
        
        <div class="notification-content">
          <h3>${data.messageTitle}</h3>
          <p>${data.message}</p>
        </div>
        
        <div class="footer">
          <p>Thank you!</p>
        </div>
      </div>
    </body>
    </html>
  `,

  receipt: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Purchase Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .receipt-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .receipt-row:last-child { border-bottom: none; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧾 Payment Receipt</h1>
        </div>
        
        <p>Hi ${data.userName},</p>
        
        <p>Thank you for your purchase! Here are your receipt details:</p>
        
        <div class="receipt-details">
          <div class="receipt-row">
            <span>Course:</span>
            <span>${data.courseTitle}</span>
          </div>
          <div class="receipt-row">
            <span>Purchase Date:</span>
            <span>${data.purchaseDate}</span>
          </div>
          <div class="receipt-row">
            <span>Transaction ID:</span>
            <span>${data.transactionId}</span>
          </div>
          <div class="receipt-row">
            <span>Amount Paid:</span>
            <span>$${data.amount}</span>
          </div>
        </div>
        
        <p>You can now access your course and start learning immediately!</p>
        
        <div class="footer">
          <p>Keep this receipt for your records.</p>
          <p>Happy Learning! 🎓</p>
        </div>
      </div>
    </body>
    </html>
  `
};

/**
 * Send email using the configured transporter
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: emailData.from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send templated email
 */
export async function sendTemplatedEmail(
  template: keyof typeof emailTemplates,
  to: string,
  subject: string,
  data: TemplateData
): Promise<boolean> {
  const templateFunction = emailTemplates[template];
  if (!templateFunction) {
    console.error(`Template "${template}" not found`);
    return false;
  }

  const html = templateFunction(data);
  
  return await sendEmail({
    to,
    subject,
    html
  });
}