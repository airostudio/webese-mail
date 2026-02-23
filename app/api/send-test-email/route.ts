import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, message: "Missing required field: to" },
        { status: 400 }
      );
    }

    // Verify SMTP is configured
    const requiredVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_FROM"];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `SMTP not configured. Missing: ${missing.join(", ")}. Save your email settings first.`,
        },
        { status: 500 }
      );
    }

    await sendEmail({
      to,
      subject: "Test Email from Email Settings Manager",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
          <h1 style="color: #1e293b; margin-bottom: 16px;">Test Email</h1>
          <p style="color: #475569; line-height: 1.6;">
            This is a test email from your <strong>Email Settings Manager</strong>.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            If you received this email, your SMTP configuration is working correctly!
          </p>
          <div style="margin-top: 24px; padding: 16px; background: #e2e8f0; border-radius: 6px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              SMTP Host: <code>${process.env.SMTP_HOST}</code><br />
              SMTP Port: <code>${process.env.SMTP_PORT || "587"}</code><br />
              From: <code>${process.env.EMAIL_FROM}</code>
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
