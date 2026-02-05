import Link from "next/link";
import promiseData from "@/data/trump-promises.json";

type PromiseStatus = "kept" | "broken" | "in_progress" | "compromised";

const statusConfig: Record<PromiseStatus, { label: string; color: string; bg: string; icon: string }> = {
  kept: { label: "Kept", color: "text-green-700", bg: "bg-green-100", icon: "✅" },
  broken: { label: "Broken", color: "text-red-700", bg: "bg-red-100", icon: "❌" },
  in_progress: { label: "In Progress", color: "text-amber-700", bg: "bg-amber-100", icon: "🔄" },
  compromised: { label: "Compromised", color: "text-orange-700", bg: "bg-orange-100", icon: "⚠️" },
};

export default function PresidentPage() {
  const { president, promises, summary } = promiseData;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo */}
            <img 
              src={president.photo_url}
              alt={president.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-xl border-4 border-white"
            />
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                  Republican
                </span>
                <span className="text-slate-500 text-sm">47th President</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-2">
                {president.name}
              </h1>
              <p className="text-lg text-slate-600">
                Inaugurated January 20, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Tracker Summary */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">
            Campaign Promise Tracker
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-4xl font-black text-green-600 mb-1">{summary.kept}</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Kept</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-4xl font-black text-red-600 mb-1">{summary.broken}</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Broken</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-4xl font-black text-amber-600 mb-1">{summary.in_progress}</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">In Progress</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-4xl font-black text-slate-400 mb-1">{summary.total}</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise List */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-black text-slate-900">All Promises</h2>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusConfig).map(([status, config]) => (
                <span key={status} className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                  {config.icon} {config.label}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {promises.map((promise) => {
              const config = statusConfig[promise.status as PromiseStatus];
              return (
                <div 
                  key={promise.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Status Badge */}
                    <div className={`flex-shrink-0 px-4 py-2 rounded-xl ${config.bg} ${config.color} font-bold text-sm flex items-center gap-2`}>
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </div>
                    
                    {/* Promise Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {promise.text}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                          {promise.category}
                        </span>
                        {promise.source_url && (
                          <a 
                            href={promise.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Source →
                          </a>
                        )}
                      </div>
                      
                      {/* Updates */}
                      {promise.updates && promise.updates.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-slate-200">
                          {promise.updates.map((update, idx) => (
                            <div key={idx} className="mb-2 last:mb-0">
                              <div className="text-xs text-slate-500 mb-1">{update.date}</div>
                              <p className="text-sm text-slate-700">{update.note}</p>
                              <span className="text-xs text-slate-400">{update.source}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Executive Orders Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Presidential Actions</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/executive/president/orders" className="group">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center h-full">
                <div className="text-4xl mb-3">📜</div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Executive Orders</h3>
                <p className="text-sm text-slate-600 mb-3">Track all executive orders with summaries and impact analysis</p>
                <span className="text-blue-600 font-semibold text-sm group-hover:underline">View All Orders →</span>
              </div>
            </Link>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center opacity-60">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-slate-900 mb-2">Emoluments Watch</h3>
              <p className="text-sm text-slate-600">Foreign payments, business conflicts, and financial transparency</p>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Coming Soon</span>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center opacity-60">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-bold text-slate-900 mb-2">Cabinet & Appointments</h3>
              <p className="text-sm text-slate-600">Track who's running federal agencies</p>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <Link 
            href="/executive"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Executive Branch
          </Link>
        </div>
      </section>
    </div>
  );
}
