import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./email";
import { admin } from "better-auth/plugins";

const authOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  secret: process.env.BETTER_AUTH_SECRET || "dummy_secret_for_build_only",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://16.176.20.69",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  // socialProviders: {
  //   github: {
  //     clientId: env.AUTH_GITHUB_CLIENT_ID,
  //     clientSecret: env.AUTH_GITHUB_SECRET,
  //   },
  // },

  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }: { user: any; url: string }) {
      await sendEmail({
        to: user.email,
        subject: "KIDOKOOL - Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <p>Hi ${user.name || "there"},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string" as const,
      },
      bio: {
        type: "string" as const,
        required: false,
      },
      education: {
        type: "string" as const,
        required: false,
      },
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        console.log("AUTH DEBUG: sendVerificationOTP called for:", email);
        console.log("AUTH DEBUG: OTP generated:", otp);
        try {
          const success = await sendEmail({
            to: email,
            subject: "KIDOKOOL - Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
                    <h1>🔐 Email Verification</h1>
                  </div>
                  <p>Hi there,</p>
                  <p>Please use the following OTP to verify your email address:</p>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #667eea;">
                    <h2 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 4px;">${otp}</h2>
                  </div>
                  <p>This OTP will expire in 10 minutes for security reasons.</p>
                  <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                    <p>If you didn't request this verification, please ignore this email.</p>
                  </div>
                </div>
              `,
          });
          console.log("AUTH DEBUG: sendEmail result:", success);
          if (!success) throw new Error("sendEmail returned false");
        } catch (e: any) {
          console.error("AUTH DEBUG: sendVerificationOTP FAILED:", e);
          throw e; // Rethrow to let better-auth know it failed
        }
      },
    }),
    admin(),
  ],
};

// Singleton pattern to prevent multiple Better Auth instances - Author: Sanket
// This is critical for async local storage to work correctly
const globalForAuth = globalThis as unknown as {
  auth: ReturnType<typeof betterAuth> | undefined;
};

export const auth = globalForAuth.auth ?? betterAuth(authOptions);

// Always cache the instance globally, not just in development
if (!globalForAuth.auth) {
  globalForAuth.auth = auth;
}
