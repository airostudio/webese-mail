import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, fromName } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, message: "Missing required field: to" },
        { status: 400 }
      );
    }

    // Prefer inline credentials from the request body (allows testing before
    // Vercel redeployment completes). Fall back to environment variables.
    const host = smtpHost || process.env.SMTP_HOST;
    const port = parseInt(smtpPort || process.env.SMTP_PORT || "587", 10);
    const user = smtpUser || process.env.SMTP_USER;
    const pass = smtpPassword || process.env.SMTP_PASSWORD;
    const from = fromEmail || process.env.EMAIL_FROM || user;
    const displayName = fromName || process.env.EMAIL_FROM_NAME || from;

    if (!host || !user || !pass || !from) {
      const missing = [
        !host && "SMTP Host",
        !user && "SMTP Username",
        !pass && "SMTP Password",
        !from && "From Email",
      ].filter(Boolean);

      return NextResponse.json(
        {
          success: false,
          message: `Cannot send test email — missing: ${missing.join(", ")}. Fill in the settings form above first.`,
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: displayName ? `"${displayName}" <${from}>` : from,
      to,
      subject: "Test Email from Email Settings Manager",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f0f9ff; border-radius: 8px;">
          <h1 style="color: #0f172a; margin-bottom: 16px;">Test Email</h1>
          <p style="color: #475569; line-height: 1.6;">
            This is a test email from your <strong>Email Settings Manager</strong>.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            If you received this, your SMTP configuration is working correctly!
          </p>
          <div style="margin-top: 24px; padding: 16px; background: #e0f2fe; border-radius: 6px;">
            <p style="color: #0369a1; font-size: 14px; margin: 0;">
              SMTP Host: <code>${host}</code><br />
              SMTP Port: <code>${port}</code><br />
              From: <code>${from}</code>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${to}!`,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to send test email: ${String(error)}`,
      },
      { status: 500 }
    );
  }
}
