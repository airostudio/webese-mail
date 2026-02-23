import EmailSettings from "@/components/EmailSettings";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Email Settings Manager
          </h1>
          <p className="text-slate-400">
            Configure your SMTP email settings and deploy them across all your
            Vercel applications
          </p>
        </div>
        <EmailSettings />
      </div>
    </main>
  );
}
