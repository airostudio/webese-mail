"use client";

import { useState } from "react";

interface EmailFormData {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  details?: string;
}

export default function EmailSettings() {
  const [formData, setFormData] = useState<EmailFormData>({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving settings..." });

    try {
      const response = await fetch("/api/update-email-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: data.message || "Email settings saved successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to save settings.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setTestStatus({ type: "error", message: "Please enter a test email address." });
      return;
    }

    setTestStatus({ type: "loading", message: "Sending test email..." });

    try {
      const response = await fetch("/api/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        setTestStatus({
          type: "success",
          message: data.message || "Test email sent successfully!",
        });
      } else {
        setTestStatus({
          type: "error",
          message: data.message || "Failed to send test email.",
        });
      }
    } catch {
      setTestStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  const inputClass =
    "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">SMTP Configuration</h2>
        <p className="text-blue-200 text-sm mt-1">
          Configure your email server settings below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* SMTP Host & Port */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>SMTP Host</label>
            <input
              type="text"
              name="smtpHost"
              value={formData.smtpHost}
              onChange={handleChange}
              placeholder="mail.saturnia.io"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Port</label>
            <input
              type="number"
              name="smtpPort"
              value={formData.smtpPort}
              onChange={handleChange}
              placeholder="587"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* SMTP User */}
        <div>
          <label className={labelClass}>SMTP Username</label>
          <input
            type="email"
            name="smtpUser"
            value={formData.smtpUser}
            onChange={handleChange}
            placeholder="your-email@saturnia.io"
            className={inputClass}
            required
          />
        </div>

        {/* SMTP Password */}
        <div>
          <label className={labelClass}>SMTP Password</label>
          <input
            type="password"
            name="smtpPassword"
            value={formData.smtpPassword}
            onChange={handleChange}
            placeholder="Your email password"
            className={inputClass}
            required
          />
        </div>

        {/* From Email & Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>From Email</label>
            <input
              type="email"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              placeholder="noreply@saturnia.io"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>From Name</label>
            <input
              type="text"
              name="fromName"
              value={formData.fromName}
              onChange={handleChange}
              placeholder="My App"
              className={inputClass}
            />
          </div>
        </div>

        {/* Port hint */}
        <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-slate-400">
          <span className="font-medium text-slate-300">Port guide:</span>{" "}
          Use <code className="text-blue-400">587</code> for TLS (recommended) or{" "}
          <code className="text-blue-400">465</code> for SSL
        </div>

        {/* Status message */}
        {status.type !== "idle" && (
          <div
            className={`rounded-lg p-3 text-sm font-medium ${
              status.type === "success"
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : status.type === "error"
                ? "bg-red-900/50 text-red-300 border border-red-700"
                : "bg-blue-900/50 text-blue-300 border border-blue-700"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status.type === "loading" ? "Saving..." : "Save Email Settings"}
        </button>
      </form>

      {/* Test Email Section */}
      <div className="border-t border-slate-700 px-6 py-5">
        <h3 className="text-base font-semibold text-slate-200 mb-3">
          Send Test Email
        </h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testStatus.type === "loading"}
            className="px-5 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
          >
            {testStatus.type === "loading" ? "Sending..." : "Send Test"}
          </button>
        </div>

        {testStatus.type !== "idle" && (
          <div
            className={`mt-3 rounded-lg p-3 text-sm font-medium ${
              testStatus.type === "success"
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : testStatus.type === "error"
                ? "bg-red-900/50 text-red-300 border border-red-700"
                : "bg-blue-900/50 text-blue-300 border border-blue-700"
            }`}
          >
            {testStatus.message}
          </div>
        )}
      </div>
    </div>
  );
}
