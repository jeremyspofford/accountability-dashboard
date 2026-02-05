import Link from "next/link";
import vpData from "@/data/vp.json";

export default function VicePresidentPage() {
  const { vice_president, senate_record, key_positions } = vpData;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo */}
            <img 
              src={vice_president.photo_url}
              alt={vice_president.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-xl border-4 border-white"
            />
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                  Republican
                </span>
                <span className="text-slate-500 text-sm">Vice President</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-2">
                {vice_president.name}
              </h1>
              <p className="text-lg text-slate-600">
                Inaugurated January 20, 2025 • Ohio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
            Background
          </h2>
          
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            {vice_president.background.summary}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {vice_president.background.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                <span className="text-slate-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Previous Role */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
            Previous Role
          </h2>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                🏛️
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {vice_president.previous_role.position}
                </h3>
                <p className="text-slate-600">
                  {vice_president.previous_role.state} • {vice_president.previous_role.party}
                </p>
              </div>
            </div>
            <p className="text-slate-700">
              Served from January 3, 2023 to January 20, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Senate Record */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
            Senate Record
          </h2>
          
          <p className="text-lg text-slate-700 mb-8 leading-relaxed">
            {senate_record.summary}
          </p>

          {/* Committees */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Committee Assignments</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {senate_record.committees.map((committee, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-sm text-slate-700">{committee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Votes */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Notable Votes</h3>
            <div className="space-y-4">
              {senate_record.key_votes.map((vote, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm ${
                      vote.vote === "Yes" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {vote.vote === "Yes" ? "✓ Yes" : "✗ No"}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {vote.bill}
                      </h4>
                      <div className="text-sm text-slate-500 mb-2">{vote.date}</div>
                      <p className="text-slate-700">{vote.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Positions */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
            Key Positions
          </h2>
          
          <div className="space-y-6">
            {key_positions.map((position, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {position.topic}
                </h3>
                <p className="text-slate-700 mb-4">
                  <span className="font-semibold">Stance:</span> {position.stance}
                </p>
                <blockquote className="pl-4 border-l-4 border-blue-500 italic text-slate-600">
                  "{position.quote}"
                </blockquote>
              </div>
            ))}
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
