"use client";

import { useState } from "react";

interface Provider {
  name: string;
  initials: string;
  badge: string;
  host: string;
  ports: { label: string; value: string }[];
  username: string;
  security: string;
  tip: string;
}

const providers: Provider[] = [
  {
    name: "Gmail",
    initials: "Gm",
    badge: "bg-red-100 text-red-600 border border-red-200",
    host: "smtp.gmail.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "your@gmail.com",
    security: "App Password (2FA must be enabled)",
    tip: "Google Account → Security → App Passwords",
  },
  {
    name: "Yahoo Mail",
    initials: "Y!",
    badge: "bg-purple-100 text-purple-600 border border-purple-200",
    host: "smtp.mail.yahoo.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "your@yahoo.com",
    security: "App Password required",
    tip: "Yahoo Account Security → Generate app password",
  },
  {
    name: "Outlook / Hotmail",
    initials: "Ol",
    badge: "bg-sky-100 text-sky-600 border border-sky-200",
    host: "smtp.office365.com",
    ports: [{ label: "STARTTLS", value: "587" }],
    username: "your@outlook.com",
    security: "Microsoft account password",
    tip: "Personal accounts: use smtp-mail.outlook.com",
  },
  {
    name: "Apple iCloud",
    initials: "iC",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    host: "smtp.mail.me.com",
    ports: [{ label: "TLS", value: "587" }],
    username: "your@icloud.com",
    security: "App-specific password required",
    tip: "appleid.apple.com → App-Specific Passwords",
  },
  {
    name: "Zoho Mail",
    initials: "Zo",
    badge: "bg-orange-100 text-orange-600 border border-orange-200",
    host: "smtp.zoho.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "your@zoho.com",
    security: "Zoho account password",
    tip: "EU accounts use smtp.zoho.eu",
  },
  {
    name: "SendGrid",
    initials: "SG",
    badge: "bg-teal-100 text-teal-600 border border-teal-200",
    host: "smtp.sendgrid.net",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "apikey",
    security: "API key as password (Mail Send permission)",
    tip: "Username is literally the string 'apikey'",
  },
  {
    name: "Mailgun",
    initials: "Mg",
    badge: "bg-rose-100 text-rose-600 border border-rose-200",
    host: "smtp.mailgun.org",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "postmaster@your-domain.com",
    security: "SMTP password from Mailgun dashboard",
    tip: "Sending → Domain settings → SMTP credentials",
  },
  {
    name: "Amazon SES",
    initials: "SE",
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    host: "email-smtp.[region].amazonaws.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "IAM SMTP user (not AWS key ID)",
    security: "IAM SMTP credentials",
    tip: "SES console → SMTP Settings → Create SMTP credentials",
  },
  {
    name: "Fastmail",
    initials: "Fm",
    badge: "bg-indigo-100 text-indigo-600 border border-indigo-200",
    host: "smtp.fastmail.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "your@fastmail.com",
    security: "App password required",
    tip: "Settings → Privacy & Security → App passwords",
  },
  {
    name: "ProtonMail",
    initials: "Pm",
    badge: "bg-violet-100 text-violet-600 border border-violet-200",
    host: "127.0.0.1",
    ports: [{ label: "Bridge", value: "1025" }],
    username: "your@proton.me",
    security: "ProtonMail Bridge app must be running locally",
    tip: "SMTP access requires the Bridge desktop app",
  },
  {
    name: "Mailchimp Transactional",
    initials: "Mc",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    host: "smtp.mandrillapp.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "your@domain.com",
    security: "Mandrill API key as password",
    tip: "Formerly Mandrill — requires paid Mailchimp plan",
  },
  {
    name: "Brevo (Sendinblue)",
    initials: "Br",
    badge: "bg-cyan-100 text-cyan-600 border border-cyan-200",
    host: "smtp-relay.brevo.com",
    ports: [
      { label: "TLS", value: "587" },
      { label: "SSL", value: "465" },
    ],
    username: "your@email.com",
    security: "Brevo SMTP key (not account password)",
    tip: "SMTP & API → Generate an SMTP key",
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600 border border-slate-200 transition font-mono"
      title="Copy to clipboard"
    >
      {copied ? "✓" : "copy"}
    </button>
  );
}

export default function QuickGuide() {
  return (
    <div className="p-6">
      <p className="text-slate-500 text-sm mb-5">
        Common SMTP settings for popular email providers. Click{" "}
        <span className="font-medium text-slate-600">copy</span> to use a value
        directly in the Settings tab.
      </p>

      <div className="grid gap-4">
        {providers.map((p) => (
          <div
            key={p.name}
            className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-sky-100 transition"
          >
            <div className="flex items-start gap-3">
              {/* Badge */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${p.badge}`}
              >
                {p.initials}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm mb-2">
                  {p.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-16 flex-shrink-0">Host</span>
                    <span className="font-mono text-slate-700 truncate">{p.host}</span>
                    <CopyButton value={p.host} />
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-400 w-16 flex-shrink-0">Port</span>
                    <span className="flex gap-1.5 flex-wrap">
                      {p.ports.map((port) => (
                        <span
                          key={port.label}
                          className="inline-flex items-center gap-1"
                        >
                          <span className="font-mono text-slate-700">
                            {port.value}
                          </span>
                          <span className="text-slate-400">({port.label})</span>
                          <CopyButton value={port.value} />
                        </span>
                      ))}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-400 w-16 flex-shrink-0">
                      User
                    </span>
                    <span className="font-mono text-slate-700 truncate">
                      {p.username}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-400 w-16 flex-shrink-0">Auth</span>
                    <span className="text-slate-600 truncate">{p.security}</span>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-sky-400 text-xs mt-0.5">ⓘ</span>
                  <span className="text-xs text-slate-400">{p.tip}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-5 p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs text-slate-500">
        <span className="font-medium text-slate-600">Port 587 + TLS</span> is
        recommended for most providers. Use{" "}
        <span className="font-medium text-slate-600">465 + SSL</span> only if
        587 doesn&apos;t work. Always use an{" "}
        <span className="font-medium text-slate-600">App Password</span> instead
        of your main account password when available.
      </div>
    </div>
  );
}
