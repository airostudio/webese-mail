import { kv } from "@vercel/kv";

const SETTINGS_KEY = "smtp:settings";

export interface SmtpSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  return await kv.get<SmtpSettings>(SETTINGS_KEY);
}

export async function saveSmtpSettings(settings: SmtpSettings): Promise<void> {
  await kv.set(SETTINGS_KEY, settings);
}
