export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-6">
            How We Grade
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Our methodology is transparent, data-driven, and free for everyone.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 space-y-12">
        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tight">Our Mission</h2>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">
            Democracy works best when citizens can easily understand how their representatives 
            actually vote, who funds them, and whether they serve the people or special interests.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            We use public data to create simple A-F grades that cut through the noise.
            No spin. No bias. Just facts.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tight">Grading Methodology</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Each representative receives a score from 0-100, converted to a letter grade.
            The score is based on four weighted factors:
          </p>
          
          <div className="space-y-8">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                💰 Donor Influence (35%)
              </h3>
              <p className="text-base text-amber-800 leading-relaxed">
                What percentage of their funding comes from PACs and large donors vs. small individual 
                contributions? Representatives funded primarily by special interests score lower.
              </p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                🗳️ Voting Independence (30%)
              </h3>
              <p className="text-base text-blue-800 leading-relaxed">
                Do they vote their conscience or just follow the party line? We measure how often 
                they break from their party on key votes. Independent thinkers score higher.
              </p>
            </div>
            
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-bold text-emerald-900 mb-3">
                📊 Financial Transparency (25%)
              </h3>
              <p className="text-base text-emerald-800 leading-relaxed">
                Do they file complete financial disclosures on time? Are their stock trades 
                properly reported? Full compliance with ethics rules earns higher scores.
              </p>
            </div>
            
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-bold text-purple-900 mb-3">
                📈 Wealth Growth (10%)
              </h3>
              <p className="text-base text-purple-800 leading-relaxed">
                How much has their net worth increased since taking office? Suspicious wealth 
                accumulation relative to their salary raises red flags.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-slate-900 tracking-tight">Grade Scale</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="grade-badge grade-a mx-auto mb-3 text-3xl font-black px-5 py-3">A</div>
              <p className="text-slate-900 font-bold text-sm mb-1">90-100</p>
              <p className="text-slate-600 text-xs">Transparent</p>
            </div>
            <div>
              <div className="grade-badge grade-b mx-auto mb-3 text-3xl font-black px-5 py-3">B</div>
              <p className="text-slate-900 font-bold text-sm mb-1">80-89</p>
              <p className="text-slate-600 text-xs">Trustworthy</p>
            </div>
            <div>
              <div className="grade-badge grade-c mx-auto mb-3 text-3xl font-black px-5 py-3">C</div>
              <p className="text-slate-900 font-bold text-sm mb-1">70-79</p>
              <p className="text-slate-600 text-xs">Concerning</p>
            </div>
            <div>
              <div className="grade-badge grade-d mx-auto mb-3 text-3xl font-black px-5 py-3">D</div>
              <p className="text-slate-900 font-bold text-sm mb-1">60-69</p>
              <p className="text-slate-600 text-xs">Questionable</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="grade-badge grade-f mx-auto mb-3 text-3xl font-black px-5 py-3">F</div>
              <p className="text-slate-900 font-bold text-sm mb-1">&lt;60</p>
              <p className="text-slate-600 text-xs">Corrupt</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tight">Data Sources</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">📊</span>
              <div>
                <strong className="text-slate-900 font-bold">Congress.gov</strong>
                <span className="text-slate-600"> — Official voting records, bill sponsorship, committee assignments</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">💵</span>
              <div>
                <strong className="text-slate-900 font-bold">OpenFEC</strong>
                <span className="text-slate-600"> — Campaign finance data, donor breakdowns, PAC contributions</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">📈</span>
              <div>
                <strong className="text-slate-900 font-bold">Voteview</strong>
                <span className="text-slate-600"> — DW-NOMINATE ideology scores, party loyalty analysis</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">🔍</span>
              <div>
                <strong className="text-slate-900 font-bold">OpenSecrets</strong>
                <span className="text-slate-600"> — Industry contributions, lobbying data</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200 p-8 md:p-10 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 tracking-tight">Open Source</h2>
          <p className="text-lg text-slate-700 mb-4 leading-relaxed">
            Democracy shouldn't be paywalled. This project is open source and free to use.
            Our methodology is transparent and our data is verifiable.
          </p>
          <p className="text-base text-slate-600">
            Built by <a href="https://arialabs.ai" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">Aria Labs</a>
          </p>
        </section>
      </div>
    </div>
  );
}
