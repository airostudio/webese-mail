"use client";

import { useState } from "react";
import QuickGuide from "./QuickGuide";

type Tab = "settings" | "guide";

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

const tabs: { id: Tab; label: string }[] = [
  { id: "settings", label: "SMTP Settings" },
  { id: "guide", label: "Quick Guide" },
];

export default function EmailSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("settings");

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving settings…" });

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
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setTestStatus({
        type: "error",
        message: "Please enter a test email address.",
      });
      return;
    }

    setTestStatus({ type: "loading", message: "Sending test email…" });

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
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition text-sm";

  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

  const statusColors = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    error: "bg-red-50 text-red-600 border border-red-200",
    loading: "bg-sky-50 text-sky-600 border border-sky-200",
    idle: "",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-5">
        <h2 className="text-lg font-semibold text-white">Email Settings Manager</h2>
        <p className="text-sky-100 text-sm mt-0.5">
          Configure SMTP credentials and sync them to your Vercel apps
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200 px-6 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3.5 px-1 mr-6 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "guide" ? (
        <QuickGuide />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Host & Port */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>SMTP Host</label>
                <input
                  type="text"
                  name="smtpHost"
                  value={formData.smtpHost}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
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
                placeholder="you@yourdomain.com"
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
                placeholder="Your app password or SMTP key"
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
                  placeholder="noreply@yourdomain.com"
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
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-xs text-slate-500 flex gap-2">
              <span className="text-sky-400 mt-0.5">ⓘ</span>
              <span>
                Use port <code className="font-mono text-sky-600 font-semibold">587</code> with TLS
                (recommended) or <code className="font-mono text-sky-600 font-semibold">465</code>{" "}
                with SSL. Check the{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("guide")}
                  className="text-sky-500 underline hover:text-sky-700 font-medium"
                >
                  Quick Guide
                </button>{" "}
                for provider-specific settings.
              </span>
            </div>

            {/* Status */}
            {status.type !== "idle" && (
              <div className={`rounded-lg p-3 text-sm font-medium ${statusColors[status.type]}`}>
                {status.message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status.type === "loading"}
              className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              {status.type === "loading" ? "Saving…" : "Save Email Settings"}
            </button>
          </form>

          {/* Test Email */}
          <div className="border-t border-slate-100 px-6 py-5 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">
              Send a Test Email
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
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm whitespace-nowrap"
              >
                {testStatus.type === "loading" ? "Sending…" : "Send Test"}
              </button>
            </div>

            {testStatus.type !== "idle" && (
              <div
                className={`mt-3 rounded-lg p-3 text-sm font-medium ${statusColors[testStatus.type]}`}
              >
                {testStatus.message}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
