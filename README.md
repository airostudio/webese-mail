# Email Settings Manager

A Next.js application that provides a UI for configuring SMTP email credentials and automatically syncing them to Vercel environment variables — making email work across all your Vercel apps.

## What It Does

- Accepts SMTP configuration via a web form
- Upserts credentials as encrypted Vercel environment variables via the Vercel API
- Triggers an automatic redeployment so changes take effect immediately
- Provides a test-email endpoint to verify everything works
- Ships a reusable `sendEmail()` utility you can copy into any project

## File Structure

```
email-settings-app/
├── app/
│   ├── api/
│   │   ├── update-email-settings/route.ts  # Updates Vercel env vars + redeploys
│   │   └── send-test-email/route.ts        # Sends a test email
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── EmailSettings.tsx                   # Settings form UI
├── lib/
│   └── email.ts                            # Reusable sendEmail() utility
├── .env.example                            # Required environment variables
├── DEPLOYMENT_GUIDE.md                     # Step-by-step deployment instructions
└── README.md                               # This file
```

## Quick Setup

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for the full walkthrough.

**TL;DR:**

1. Deploy this repo to Vercel
2. Add `VERCEL_API_TOKEN` and `VERCEL_PROJECT_ID` as environment variables
3. Redeploy, then visit the app URL and enter your SMTP credentials
4. Done — email works across all your Vercel apps

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VERCEL_API_TOKEN` | Yes | Vercel personal access token |
| `VERCEL_PROJECT_ID` | Yes | Vercel project ID (`prj_...`) |
| `VERCEL_TEAM_ID` | No | Vercel team ID (`team_...`), only for team accounts |
| `SMTP_HOST` | Yes* | SMTP server hostname |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | Yes* | SMTP username / email address |
| `SMTP_PASSWORD` | Yes* | SMTP password |
| `EMAIL_FROM` | Yes* | Sender email address |
| `EMAIL_FROM_NAME` | No | Sender display name |

*Set automatically when you submit the settings form. Can also be set manually for local development.

## API Endpoints

### `POST /api/update-email-settings`

Saves SMTP settings to Vercel environment variables and triggers redeployment.

**Body:**
```json
{
  "smtpHost": "mail.saturnia.io",
  "smtpPort": "587",
  "smtpUser": "you@saturnia.io",
  "smtpPassword": "yourpassword",
  "fromEmail": "noreply@saturnia.io",
  "fromName": "My App"
}
```

### `POST /api/send-test-email`

Sends a test email using the currently configured SMTP settings.

**Body:**
```json
{ "to": "test@example.com" }
```

## Using `sendEmail()` in Other Projects

Copy `lib/email.ts` to any Vercel project:

```typescript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: 'user@example.com',
  subject: 'Hello!',
  html: '<h1>Hello World</h1>',
});
```

Install the dependency first:

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

## Development

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
