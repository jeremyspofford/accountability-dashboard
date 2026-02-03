import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accountability Dashboard",
  description: "Track what politicians say vs what they do",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="text-xl font-bold text-white">
                🏛️ Accountability Dashboard
              </a>
              <div className="flex gap-6 text-sm">
                <a href="/" className="text-slate-300 hover:text-white transition">Home</a>
                <a href="/congress" className="text-slate-300 hover:text-white transition">Congress</a>
                <a href="/about" className="text-slate-300 hover:text-white transition">About</a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-slate-800 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>Built by Aria Labs • Data from Congress.gov, ProPublica, OpenSecrets</p>
            <p className="mt-2">Democracy shouldnt be paywalled. This is open source.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
