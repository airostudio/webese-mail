import nodemailer from "nodemailer";
import { getSmtpSettings, type SmtpSettings } from "./email-settings";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

function buildTransporter(settings: SmtpSettings) {
  const port = parseInt(settings.smtpPort || "587", 10);
  return nodemailer.createTransport({
    host: settings.smtpHost,
    port,
    secure: port === 465,
    auth: { user: settings.smtpUser, pass: settings.smtpPassword },
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Sends an email using SMTP settings stored in Vercel KV.
 * Settings are configured via the admin Email Settings page.
 *
 * @example
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Hello</h1>',
 * });
 */
export async function sendEmail(options: SendEmailOptions) {
  const settings = await getSmtpSettings();

  if (!settings?.smtpHost || !settings?.smtpUser || !settings?.smtpPassword) {
    throw new Error(
      "Email not configured. Please set up SMTP in the admin Email Settings page."
    );
  }

  const transporter = buildTransporter(settings);
  const from = settings.fromEmail || settings.smtpUser;
  const displayName = settings.fromName || from;

  return transporter.sendMail({
    from: displayName ? `"${displayName}" <${from}>` : from,
    to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
}

/**
 * Sends an email using explicit inline credentials.
 * Used internally for testing settings before they are saved.
 */
export async function sendEmailWithSettings(
  settings: SmtpSettings,
  options: SendEmailOptions
) {
  const transporter = buildTransporter(settings);
  const from = settings.fromEmail || settings.smtpUser;
  const displayName = settings.fromName || from;

  return transporter.sendMail({
    from: displayName ? `"${displayName}" <${from}>` : from,
    to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
}
