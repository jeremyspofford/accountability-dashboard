import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen antialiased">
      {/* Hero Section - Light with gradient mesh (Stripe/Vercel style) */}
      <section className="relative overflow-hidden bg-white py-20 md:py-32">
        {/* Modern gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 opacity-50 blur-3xl" />
          <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-50 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Status badge with ping animation */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/60 rounded-full px-5 py-2.5 mb-8 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-blue-700 text-sm font-bold tracking-wide">Tracking 538 Members of Congress</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-6">
            Hold Your Reps
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
              Accountable
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Clear A-F grades based on voting records, campaign finance, and transparency. 
            No spin. Just data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/congress"
              className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 text-lg"
            >
              View All Grades
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all duration-300 border-2 border-slate-200 hover:border-slate-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              How We Grade
            </Link>
          </div>
        </div>
        
        {/* Stats bar with refined glassmorphism */}
        <div className="relative max-w-5xl mx-auto mt-20 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "538", label: "Members", sublabel: "House + Senate" },
              { value: "50", label: "States", sublabel: "Plus territories" },
              { value: "A-F", label: "Grades", sublabel: "Clear ratings" },
              { value: "100%", label: "Open", sublabel: "Public data" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:border-slate-300/60 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">{stat.label}</div>
                <div className="text-sm text-slate-500 font-medium mt-1">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              How We Grade Accountability
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
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
              <div key={i} className="group relative bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 border border-slate-200 hover:border-blue-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Ready to Hold Your Representatives Accountable?
          </h2>
          <p className="text-xl text-slate-600 mb-10 font-medium">
            Browse all 538 members of Congress with clear, data-driven accountability grades.
          </p>
          <Link 
            href="/congress"
            className="inline-flex items-center justify-center px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            View All Grades →
          </Link>
        </div>
      </section>
    </div>
  );
}
