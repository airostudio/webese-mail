import { NextRequest, NextResponse } from "next/server";
import { saveSmtpSettings } from "@/lib/email-settings";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["smtpHost", "smtpPort", "smtpUser", "smtpPassword", "fromEmail"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await saveSmtpSettings({
      smtpHost: body.smtpHost,
      smtpPort: body.smtpPort,
      smtpUser: body.smtpUser,
      smtpPassword: body.smtpPassword,
      fromEmail: body.fromEmail,
      fromName: body.fromName || body.fromEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Email settings saved successfully!",
    });
  } catch (error) {
    console.error("Error saving email settings:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save settings — see details below.",
        details: detail,
      },
      { status: 500 }
    );
  }
}
