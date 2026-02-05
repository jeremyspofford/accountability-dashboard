import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rep Accountability Dashboard",
  description: "Grade your representatives based on voting records, campaign finance, and transparency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="text-xl font-bold text-slate-900 hover:text-blue-600 transition">
                🏛️ Rep Accountability
              </a>
              <div className="flex gap-6 text-sm font-medium">
                <a href="/" className="text-slate-600 hover:text-slate-900 transition">Home</a>
                <a href="/congress" className="text-slate-600 hover:text-slate-900 transition">Congress</a>
                <a href="/about" className="text-slate-600 hover:text-slate-900 transition">About</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="bg-slate-50">{children}</main>
        <footer className="bg-white border-t border-slate-200 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p className="font-medium text-slate-700">Built by Aria Labs</p>
            <p className="mt-2">Data from Congress.gov, ProPublica, and OpenSecrets</p>
            <p className="mt-1">Democracy shouldn't be paywalled. This is open source.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
