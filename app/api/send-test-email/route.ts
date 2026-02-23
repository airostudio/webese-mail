import { NextRequest, NextResponse } from "next/server";
import { sendEmailWithSettings } from "@/lib/email";
import { getSmtpSettings, type SmtpSettings } from "@/lib/email-settings";

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

    // Use inline credentials from the form if provided (allows testing before
    // saving). Fall back to stored KV settings if not.
    let settings: SmtpSettings | null = null;

    if (smtpHost && smtpUser && smtpPassword && fromEmail) {
      settings = { smtpHost, smtpPort: smtpPort || "587", smtpUser, smtpPassword, fromEmail, fromName: fromName || fromEmail };
    } else {
      settings = await getSmtpSettings();
    }

    if (!settings?.smtpHost || !settings?.smtpUser || !settings?.smtpPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot send test email — fill in all SMTP fields above first.",
        },
        { status: 400 }
      );
    }

    await sendEmailWithSettings(settings, {
      to,
      subject: "Test Email — Email Settings Manager",
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
              SMTP Host: <code>${settings.smtpHost}</code><br />
              SMTP Port: <code>${settings.smtpPort || "587"}</code><br />
              From: <code>${settings.fromEmail}</code>
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
        message: `Failed to send test email: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
