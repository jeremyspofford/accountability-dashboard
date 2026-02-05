"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const input = searchInput.trim();
    if (!input) return;

    setError("");
    
    // Check if it's a ZIP code (5 digits)
    if (/^\d{5}$/.test(input)) {
      setLoading(true);
      try {
        // Use Zippopotam.us directly (free, no CORS issues)
        const res = await fetch(`https://api.zippopotam.us/us/${input}`);
        
        if (!res.ok) {
          setError("ZIP code not found. Please check and try again.");
          return;
        }
        
        const data = await res.json();
        const state = data.places?.[0]?.["state abbreviation"];
        
        if (state) {
          router.push(`/congress?state=${state}`);
        } else {
          setError("Could not determine state for this ZIP code.");
        }
      } catch {
        setError("Failed to look up ZIP code. Try again.");
      } finally {
        setLoading(false);
      }
    } 
    // Check if it's a 2-letter state code
    else if (/^[A-Za-z]{2}$/.test(input)) {
      router.push(`/congress?state=${input.toUpperCase()}`);
    }
    // Otherwise treat as state name or search term
    else {
      router.push(`/congress?search=${encodeURIComponent(input)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Grade Your Representatives
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4">
          Who do they <span className="font-semibold text-blue-400">really</span> represent? You or their donors?
        </p>
        <p className="text-base text-slate-400 max-w-2xl mx-auto mb-8">
          Clear A-F grades based on voting records, campaign finance, and transparency.
          No spin. Just facts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/congress" className="btn-primary text-lg px-8 py-3">
            View All Grades →
          </Link>
          <Link href="/about" className="text-slate-300 hover:text-white py-2 px-4 transition">
            How We Grade
          </Link>
        </div>
      </section>

      {/* Find Your Rep - Featured */}
      <section className="card text-center py-10 mb-12 bg-gradient-to-r from-slate-900 to-slate-800 border-blue-900/50">
        <h2 className="text-2xl font-bold mb-4">🔍 Find Your Representatives</h2>
        <p className="text-slate-400 mb-6">
          Enter your ZIP code or state to see who represents you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto px-4">
          <input
            type="text"
            placeholder="ZIP code or state (e.g., 10001 or NY)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary px-6 py-3 disabled:opacity-50"
          >
            {loading ? "Looking up..." : "Search"}
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}
        <p className="text-slate-500 text-xs mt-4">
          Shows all representatives from your state. For exact district, visit{" "}
          <a href="https://www.house.gov/representatives/find-your-representative" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-400 hover:underline">
            house.gov
          </a>
        </p>
      </section>

      {/* Stats Preview */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 py-8">
        <div className="card text-center py-6">
          <div className="text-3xl md:text-4xl font-bold text-blue-400">538</div>
          <div className="text-slate-400 mt-2 text-sm md:text-base">Members of Congress</div>
          <div className="text-xs text-slate-500 mt-1">435 House + 100 Senate + 3 Delegates</div>
        </div>
        <div className="card text-center py-6">
          <div className="text-3xl md:text-4xl font-bold text-green-400">50</div>
          <div className="text-slate-400 mt-2 text-sm md:text-base">States Represented</div>
          <div className="text-xs text-slate-500 mt-1">Plus DC & territories</div>
        </div>
        <div className="card text-center py-6 col-span-2 md:col-span-1">
          <div className="text-3xl md:text-4xl font-bold text-purple-400">Real Data</div>
          <div className="text-slate-400 mt-2 text-sm md:text-base">From Official Sources</div>
          <div className="text-xs text-slate-500 mt-1">Congress.gov + Voteview + FEC</div>
        </div>
      </section>

      {/* What We Track */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How We Grade Accountability</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="card">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-lg mb-2">Campaign Finance</h3>
            <p className="text-slate-400 text-sm">
              Who funds them? PACs, corporations, or small donors? OpenFEC data reveals the truth.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">🗳️</div>
            <h3 className="font-semibold text-lg mb-2">Voting Independence</h3>
            <p className="text-slate-400 text-sm">
              Do they think for themselves or just vote party line? Voteview DW-NOMINATE analysis.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">Financial Transparency</h3>
            <p className="text-slate-400 text-sm">
              Do they disclose everything? Track net worth changes and compliance.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-lg mb-2">Wealth Growth</h3>
            <p className="text-slate-400 text-sm">
              Sudden wealth spikes raise red flags. We track suspicious patterns.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <Link href="/congress" className="btn-primary text-lg px-8 py-3">
          Browse All 538 Members →
        </Link>
      </section>
    </div>
  );
}
