import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
          Track What Politicians Say vs What They Do
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          No fake trust scores. No spin. Just voting records, donor money, and the facts
          you need to hold your representatives accountable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/congress" className="btn-primary">
            Explore Congress →
          </Link>
          <Link href="/about" className="text-slate-300 hover:text-white py-2 px-4 transition">
            How It Works
          </Link>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="grid md:grid-cols-3 gap-6 py-12">
        <div className="card text-center">
          <div className="text-4xl font-bold text-blue-400">535</div>
          <div className="text-slate-400 mt-2">Members of Congress</div>
          <div className="text-sm text-slate-500 mt-1">435 House + 100 Senate</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-green-400">50</div>
          <div className="text-slate-400 mt-2">States Represented</div>
          <div className="text-sm text-slate-500 mt-1">Plus territories</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-purple-400">2024</div>
          <div className="text-slate-400 mt-2">Election Cycle Data</div>
          <div className="text-sm text-slate-500 mt-1">Campaign finance included</div>
        </div>
      </section>

      {/* What We Track */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">What We Track</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-2xl mb-3">🗳️</div>
            <h3 className="font-semibold text-lg mb-2">Voting Records</h3>
            <p className="text-slate-400 text-sm">
              Every vote cast, party alignment, missed votes, and how they compare to their
              stated positions.
            </p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold text-lg mb-2">Money Trail</h3>
            <p className="text-slate-400 text-sm">
              Top donors, PAC money, small donor percentage, and suspicious timing between
              donations and votes.
            </p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">📜</div>
            <h3 className="font-semibold text-lg mb-2">Bills & Legislation</h3>
            <p className="text-slate-400 text-sm">
              Bills sponsored, cosponsored, how many became law, and what they actually do.
            </p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">Effectiveness</h3>
            <p className="text-slate-400 text-sm">
              Not just votes — do they show up? Do their bills pass? Are they actually
              effective legislators?
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card text-center py-12 my-12 bg-gradient-to-r from-slate-900 to-slate-800">
        <h2 className="text-2xl font-bold mb-4">Find Your Representatives</h2>
        <p className="text-slate-400 mb-6">
          Enter your state or ZIP code to see who represents you and how theyre doing.
        </p>
        <div className="flex gap-4 justify-center max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter state or ZIP..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="btn-primary">Search</button>
        </div>
      </section>
    </div>
  );
}
