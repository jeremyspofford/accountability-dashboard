import Link from "next/link";

export default function JudicialBranch() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-5xl mb-8 shadow-2xl mx-auto">
            ⚖️
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 mb-6">
            Judicial Branch
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
            Coming Soon
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We're building transparency tools for the Judicial Branch — tracking Supreme Court justices, 
            federal judges, financial disclosures, case histories, and conflicts of interest.
          </p>
        </div>
      </section>

      {/* What's Coming Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 text-center">
            What We'll Track
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">👨‍⚖️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Supreme Court</h3>
              <p className="text-slate-600">
                Track all nine justices, their voting patterns, recusal decisions, and opinion authorship.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Federal Judges</h3>
              <p className="text-slate-600">
                Monitor Circuit and District Court judges, appointment histories, and case loads.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Financial Disclosures</h3>
              <p className="text-slate-600">
                Review financial holdings, gifts, travel, and potential conflicts of interest.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Case Histories</h3>
              <p className="text-slate-600">
                Analyze voting patterns, majority/dissent records, and ideological alignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            In the Meantime, Check Out Congress
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            While we build out the Judicial Branch dashboard, explore our complete 
            Congressional accountability tracker.
          </p>
          <Link 
            href="/congress"
            className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            View Congress →
          </Link>
        </div>
      </section>
    </div>
  );
}
