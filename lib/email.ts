import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Creates a nodemailer transporter using SMTP environment variables.
 *
 * Required env vars:
 *   SMTP_HOST     — e.g. mail.saturnia.io
 *   SMTP_USER     — full email address used for auth
 *   SMTP_PASSWORD — email account password
 *
 * Optional env vars:
 *   SMTP_PORT     — defaults to 587
 *   EMAIL_FROM    — sender address, defaults to SMTP_USER
 *   EMAIL_FROM_NAME — display name, defaults to EMAIL_FROM
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP configuration is incomplete. Ensure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are set."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for SSL (465), false for TLS (587)
    auth: { user, pass },
    tls: {
      // Allow self-signed certs (common on shared hosting / Plesk)
      rejectUnauthorized: false,
    },
  });
}

/**
 * Sends an email using the configured SMTP server.
 *
 * @example
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Hello!',
 *   html: '<h1>Hello World</h1>',
 * });
 */
export async function sendEmail(options: SendEmailOptions) {
  const transporter = createTransporter();

  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || "";
  const fromName = process.env.EMAIL_FROM_NAME || fromEmail;

  const info = await transporter.sendMail({
    from: fromName ? `"${fromName}" <${fromEmail}>` : fromEmail,
    to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });

  return info;
}
