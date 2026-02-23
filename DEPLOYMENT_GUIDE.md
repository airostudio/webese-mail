# Deployment Guide

## Quick Start (10 Minutes)

### Step 1: Push to GitHub

```bash
cd email-settings-app

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Email settings manager"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/email-settings-manager.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import" next to your GitHub repository
3. Click "Deploy" (don't configure anything yet)
4. Wait for initial deployment to complete

### Step 3: Get Your Vercel API Credentials

#### A) Create API Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "Email Settings Manager"
4. Scope: Full access (or at least deployments + env variables)
5. Copy the token — you won't see it again!

#### B) Get Project ID

1. In your Vercel project dashboard, click "Settings"
2. Look at the URL: `https://vercel.com/[team]/[project]/settings`
3. Or in your terminal:

```bash
npx vercel project ls
```

4. Copy your Project ID (starts with `prj_`)

#### C) Get Team ID (if applicable)

1. If you're on a team account, find it in the URL
2. Team IDs start with `team_`
3. If you're on a personal account, skip this

### Step 4: Add Environment Variables to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these variables for Production, Preview, and Development:

| Name | Value |
|---|---|
| `VERCEL_API_TOKEN` | Paste your token from Step 3A |
| `VERCEL_PROJECT_ID` | `prj_xxxxxxxxxxxxx` from Step 3B |
| `VERCEL_TEAM_ID` | `team_xxxxxxxxxxxxx` from Step 3C (optional) |

3. Click "Save" for each
4. Trigger a redeployment: Settings → Deployments → click "..." → Redeploy

### Step 5: Configure Your Email

1. Visit your deployed URL (e.g., `https://email-settings-manager.vercel.app`)
2. Fill in your Plesk SMTP details:
   - **SMTP Host:** `mail.saturnia.io` (or your domain)
   - **Port:** `587` (TLS recommended)
   - **Email:** `your-email@saturnia.io`
   - **Password:** Your email account password
3. Click "Save Email Settings"
4. Wait 1–2 minutes for automatic redeployment

### Step 6: Test It Works

```bash
curl -X POST https://YOUR-APP.vercel.app/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com"}'
```

Check your inbox for the test email!

---

## Getting SMTP Details from Plesk

### Finding Your SMTP Settings

1. Log into Plesk at your server address
2. Go to **Mail** → **Mail Settings**
3. Your details should be:
   - **Host:** `mail.saturnia.io` (or `mail.yourdomain.com`)
   - **Port:** `587` (TLS) or `465` (SSL)
   - **Username:** Your full email address
   - **Password:** Your email password

### Creating a New Email Account in Plesk

1. Go to **Mail** → **Email Addresses**
2. Click "Create Email Address"
3. Enter:
   - Email address: `noreply@yourdomain.com`
   - Password: Create a strong password
4. Save
5. Use these credentials in the settings form

---

## Using Email in Your Other Vercel Apps

Once configured, you can use the same email settings across all your Vercel projects in the same team/account.

### Example: Contact Form

```typescript
// app/api/contact/route.ts
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  await sendEmail({
    to: 'you@yourdomain.com',
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Message</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  return Response.json({ success: true });
}
```

### Copy the Email Utility to Your Projects

Just copy `/lib/email.ts` to any Vercel project and import it:

```typescript
import { sendEmail } from '@/lib/email';
```

The environment variables are shared across all your Vercel projects!

---

## Customization

### Change the UI

Edit `/components/EmailSettings.tsx` to customize:

- Colors (Tailwind classes)
- Form fields
- Help text
- Branding

### Add More Features

Ideas for expansion:

- Display current settings (masked passwords)
- Support multiple email accounts
- Add email templates
- Email sending history/logs

---

## Troubleshooting

| Error | Solution |
|---|---|
| "Missing Vercel credentials" | Environment variables must be added in Vercel Dashboard, not just `.env.local` |
| SMTP connection failed | Verify password, check account exists in Plesk, try port 465, check firewall |
| Deployment doesn't trigger | Add `VERCEL_GIT_REPO_ID` env var; verify GitHub integration is connected |
| Email sends but doesn't arrive | Check spam folder, verify sender domain, review Plesk email logs |

---

## Security Best Practices

1. Never commit `.env.local` to Git (it's in `.gitignore`)
2. Use strong passwords for email accounts
3. Consider app-specific passwords if your provider supports them
4. Rotate API tokens periodically
5. Vercel encrypts environment variables automatically

---

## Next Steps

### For Your Current Projects

1. Copy `/lib/email.ts` to your other Vercel apps
2. Use the same environment variables (already set in Vercel)
3. Start sending emails!

### For New Projects

1. Install nodemailer: `npm install nodemailer`
2. Install types: `npm install -D @types/nodemailer`
3. Copy `/lib/email.ts` from this project
4. Import and use `sendEmail()`

---

## Setup Checklist

- [ ] Repository created on GitHub
- [ ] Deployed to Vercel
- [ ] Vercel API Token created
- [ ] Project ID obtained
- [ ] Environment variables added to Vercel:
  - [ ] `VERCEL_API_TOKEN`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `VERCEL_TEAM_ID` (if applicable)
- [ ] Vercel project redeployed
- [ ] SMTP details obtained from Plesk
- [ ] Email settings configured via UI
- [ ] Test email sent successfully
- [ ] Ready to use in other projects!
