// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: false, // Use TLS
  tls: {
    rejectUnauthorized: false, // For Mailtrap
  },
});

const sendEmailVerificationEmail = async ({ to, name, verificationUrl }) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Hello ${name},</h2>
          <p>Thanks for registering. Please verify your email address before signing in.</p>
          <p>Please click the link below to verify your email:</p>
          <p style="margin: 24px 0;">
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p style="margin-top:24px; color:#888; font-size:13px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${to}:`, error.message);
    throw error; // Re-throw to fail the register request
  }
};

const sendForgotPasswordEmail = async ({ to, name, email, resetUrl }) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset the password for <strong>${email}</strong>.</p>
          <p>Please click the link below to reset your password:</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p style="margin-top:24px; color:#888; font-size:13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = { sendForgotPasswordEmail, sendEmailVerificationEmail };