import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32 lg:py-40">
        {/* Modern gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 opacity-50 blur-3xl" />
          <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-50 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/60 rounded-full px-5 py-2.5 mb-12 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-blue-700 text-sm font-bold tracking-wide">Tracking 538 Members of Congress</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight text-slate-900 mb-8">
            Follow the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
              Money
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            See who funds your representatives, track their stock trades, and discover 
            who really benefits from their votes. No spin. Just data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/congress"
              className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 text-lg"
            >
              Explore Congress
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all duration-300 border-2 border-slate-200 hover:border-slate-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              How It Works
            </Link>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="relative max-w-5xl mx-auto mt-24 px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "538", label: "Members", sublabel: "House + Senate" },
              { value: "50", label: "States", sublabel: "Plus territories" },
              { value: "$B+", label: "Tracked", sublabel: "Campaign funds" },
              { value: "100%", label: "Open", sublabel: "Public data" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:border-slate-300/60 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-2 sm:mb-3 tabular-nums leading-tight">{stat.value}</div>
                <div className="text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-xs sm:text-sm text-slate-500 leading-relaxed">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 md:py-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              What We Track
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Real data from the Federal Election Commission, Congress.gov, and financial disclosures.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: "💰", 
                title: "Campaign Finance", 
                desc: "Who funds them? See PAC money, corporate donors, and small donor percentages.",
                color: "from-amber-500 to-orange-600"
              },
              { 
                icon: "📊", 
                title: "Voting Record", 
                desc: "How they vote on healthcare, climate, taxes, and more. By category.",
                color: "from-blue-500 to-indigo-600"
              },
              { 
                icon: "📈", 
                title: "Stock Trades", 
                desc: "Their trades vs committee assignments. Spot potential insider trading.",
                color: "from-emerald-500 to-teal-600",
                soon: true
              },
              { 
                icon: "💵", 
                title: "Wealth Growth", 
                desc: "Net worth changes since taking office. Salary vs actual wealth.",
                color: "from-purple-500 to-pink-600",
                soon: true
              },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 border border-slate-200 hover:border-blue-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 sm:mb-4 leading-tight tracking-tight">
                    {feature.title}
                    {feature.soon && (
                      <span className="ml-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">SOON</span>
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 text-center">
            Why This Matters
          </h2>
          <div className="prose prose-lg prose-slate mx-auto">
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Politicians work for the people who fund them. When 50% of a campaign comes from PACs 
              and corporate interests, whose priorities do you think get attention?
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              We believe transparency is the first step to accountability. By making campaign finance, 
              voting records, and financial data easily accessible, we empower citizens to make informed decisions.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              All data comes from official government sources: the FEC, Congress.gov, and required 
              financial disclosures. We don't editorialize — we just show you the numbers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Ready to Follow the Money?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
            Browse all 538 members of Congress. See who funds them, how they vote, and who they really represent.
          </p>
          <Link 
            href="/congress"
            className="inline-flex items-center justify-center px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            Explore Congress →
          </Link>
        </div>
      </section>
    </div>
  );
}
