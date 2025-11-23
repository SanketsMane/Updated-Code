/**
 * Email Notifications Service
 * High-level email functions for specific use cases
 */

import { sendTemplatedEmail } from './email';

interface CourseEnrollmentData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  courseDescription: string;
  courseUrl: string;
}

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  platformUrl: string;
}

interface PasswordResetData {
  userName: string;
  userEmail: string;
  resetUrl: string;
  expirationTime?: string;
}

/**
 * Send course enrollment confirmation email
 */
export async function sendCourseEnrollmentEmail(data: CourseEnrollmentData): Promise<boolean> {
  return await sendTemplatedEmail(
    'courseEnrollment',
    data.userEmail,
    `Welcome to ${data.courseTitle}!`,
    {
      userName: data.userName,
      courseTitle: data.courseTitle,
      courseDescription: data.courseDescription,
      courseUrl: data.courseUrl,
      enrollmentDate: new Date().toLocaleDateString()
    }
  );
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  return await sendTemplatedEmail(
    'welcome',
    data.userEmail,
    'Welcome to Our Learning Platform!',
    {
      userName: data.userName,
      platformUrl: data.platformUrl
    }
  );
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
  return await sendTemplatedEmail(
    'passwordReset',
    data.userEmail,
    'Reset Your Password',
    {
      userName: data.userName,
      resetUrl: data.resetUrl,
      expirationTime: data.expirationTime || '1 hour'
    }
  );
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  userEmail: string,
  userName: string,
  title: string,
  messageTitle: string,
  message: string
): Promise<boolean> {
  return await sendTemplatedEmail(
    'notification',
    userEmail,
    title,
    {
      userName,
      title,
      messageTitle,
      message
    }
  );
}

/**
 * Send purchase receipt email
 */
export async function sendReceiptEmail(
  userEmail: string,
  userName: string,
  courseTitle: string,
  amount: string,
  transactionId: string
): Promise<boolean> {
  return await sendTemplatedEmail(
    'receipt',
    userEmail,
    'Purchase Receipt',
    {
      userName,
      courseTitle,
      amount,
      transactionId,
      purchaseDate: new Date().toLocaleDateString()
    }
  );
}