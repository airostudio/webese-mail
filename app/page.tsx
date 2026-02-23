import EmailSettings from "@/components/EmailSettings";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-start justify-center p-4 pt-12 pb-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Email Settings Manager
          </h1>
          <p className="text-slate-500">
            Configure your SMTP credentials and deploy them across all your
            Vercel applications
          </p>
        </div>
        <EmailSettings />
      </div>
    </main>
  );
}
