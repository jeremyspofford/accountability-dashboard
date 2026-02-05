import Link from "next/link";
import promiseData from "@/data/trump-promises.json";

export default function ExecutiveBranch() {
  const { president, summary } = promiseData;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-4xl mb-6 shadow-xl mx-auto">
            🏛️
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-4">
            Executive Branch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track presidential accountability: campaign promises, executive orders, 
            appointments, and financial transparency.
          </p>
        </div>
      </section>

      {/* Current President Card */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Current Administration</h2>
          
          <Link 
            href="/executive/president"
            className="block bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Photo placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center text-5xl shadow-lg border-4 border-white flex-shrink-0">
                🏛️
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    Republican
                  </span>
                  <span className="text-slate-500 text-sm">47th President</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  {president.name}
                </h3>
                <p className="text-slate-600 mt-1">Inaugurated January 20, 2025</p>
              </div>
              
              {/* Promise Summary */}
              <div className="flex gap-4 flex-shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-green-600">{summary.kept}</div>
                  <div className="text-xs text-slate-500 font-medium">Kept</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-red-600">{summary.broken}</div>
                  <div className="text-xs text-slate-500 font-medium">Broken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-amber-600">{summary.in_progress}</div>
                  <div className="text-xs text-slate-500 font-medium">In Progress</div>
                </div>
              </div>
              
              <div className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                View Details →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Vice President - Coming Soon */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Vice President</h2>
          
          <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center">
            <div className="text-4xl mb-4">🔜</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">J.D. Vance</h3>
            <p className="text-slate-500">Vice Presidential tracking coming soon</p>
          </div>
        </div>
      </section>

      {/* Cabinet Grid - Coming Soon */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Cabinet</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { role: "Secretary of State", name: "Marco Rubio" },
              { role: "Secretary of Defense", name: "Pete Hegseth" },
              { role: "Attorney General", name: "Pam Bondi" },
              { role: "Secretary of Treasury", name: "Scott Bessent" },
              { role: "Secretary of HHS", name: "Robert F. Kennedy Jr." },
              { role: "Secretary of Homeland Security", name: "Kristi Noem" },
              { role: "EPA Administrator", name: "Lee Zeldin" },
              { role: "DOGE", name: "Elon Musk" },
            ].map((cabinet, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-4 text-center opacity-60"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mx-auto mb-2">
                  👤
                </div>
                <div className="text-xs text-slate-500 mb-1">{cabinet.role}</div>
                <div className="text-sm font-semibold text-slate-700">{cabinet.name}</div>
                <div className="text-xs text-slate-400 mt-1">Coming soon</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Track */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">What We Track</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="font-bold text-green-900">Campaign Promises</h3>
                <p className="text-sm text-green-700">Tracking what was promised vs. what's delivered</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl">📜</div>
              <div>
                <h3 className="font-bold text-slate-700">Executive Orders</h3>
                <p className="text-sm text-slate-500">Coming soon — Federal Register integration</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="font-bold text-slate-700">Emoluments & Conflicts</h3>
                <p className="text-sm text-slate-500">Coming soon — Business interests tracking</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl">👥</div>
              <div>
                <h3 className="font-bold text-slate-700">Appointments</h3>
                <p className="text-sm text-slate-500">Coming soon — Cabinet and judiciary tracker</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
