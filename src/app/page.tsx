import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Bold gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-20 md:py-32">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-blue-300 text-sm font-medium">Tracking 538 Members of Congress</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Hold Your Reps
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Accountable
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Clear A-F grades based on voting records, campaign finance, and transparency. 
            No spin. Just data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/congress"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              View All Grades
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
            >
              How We Grade
            </Link>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="relative max-w-5xl mx-auto mt-16 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "538", label: "Members", sublabel: "House + Senate" },
              { value: "50", label: "States", sublabel: "Plus territories" },
              { value: "A-F", label: "Grades", sublabel: "Clear ratings" },
              { value: "100%", label: "Open", sublabel: "Public data" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
                <div className="text-sm text-slate-500">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How We Grade Accountability
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our scoring system analyzes four key factors to give you a clear picture of your representative's integrity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: "💰", 
                title: "Campaign Finance", 
                desc: "Who funds them? Track donations from PACs, corporations, and individuals.",
                color: "from-amber-500 to-orange-600"
              },
              { 
                icon: "🗳️", 
                title: "Voting Record", 
                desc: "Independent voting or party line? We analyze patterns to measure true independence.",
                color: "from-blue-500 to-indigo-600"
              },
              { 
                icon: "📊", 
                title: "Transparency", 
                desc: "Full disclosure matters. We track financial reporting compliance.",
                color: "from-emerald-500 to-teal-600"
              },
              { 
                icon: "📈", 
                title: "Wealth Growth", 
                desc: "Suspicious wealth spikes raise red flags. We monitor net worth changes.",
                color: "from-purple-500 to-pink-600"
              },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-slate-50 hover:bg-white rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-100 hover:border-slate-200">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Hold Your Representatives Accountable?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Browse all 538 members of Congress with clear, data-driven accountability grades.
          </p>
          <Link 
            href="/congress"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            View All Grades →
          </Link>
        </div>
      </section>
    </div>
  );
}
