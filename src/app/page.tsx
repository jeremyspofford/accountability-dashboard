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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Track Congressional <span className="text-blue-600">Accountability</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            See how your representatives vote, who funds them, and whether they're working for you or special interests.
          </p>
          
          {/* Search CTA */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, state, or ZIP code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/congress?grade=F" className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition">
              View All F-Rated
            </Link>
            <Link href="/congress" className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition">
              Browse All Members
            </Link>
            <Link href="/about" className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition">
              How We Grade
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">538</div>
              <div className="text-slate-600 font-medium">Members Tracked</div>
              <div className="text-sm text-slate-500 mt-1">House + Senate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">50</div>
              <div className="text-slate-600 font-medium">States</div>
              <div className="text-sm text-slate-500 mt-1">Plus territories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">A-F</div>
              <div className="text-slate-600 font-medium">Grade Scale</div>
              <div className="text-sm text-slate-500 mt-1">Clear ratings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">100%</div>
              <div className="text-slate-600 font-medium">Open Source</div>
              <div className="text-sm text-slate-500 mt-1">Public data</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Track */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-12 text-center">
            How We Grade Accountability
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Campaign Finance</h3>
              <p className="text-slate-600 leading-relaxed">
                Who funds them? Track donations from PACs, corporations, and individuals to see who really has influence.
              </p>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🗳️</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Voting Record</h3>
              <p className="text-slate-600 leading-relaxed">
                Independent voting or party line? We analyze voting patterns to measure true independence.
              </p>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Transparency</h3>
              <p className="text-slate-600 leading-relaxed">
                Full disclosure matters. We track financial reporting compliance and public accessibility.
              </p>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Wealth Growth</h3>
              <p className="text-slate-600 leading-relaxed">
                Suspicious wealth spikes raise red flags. We monitor net worth changes during tenure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Hold Your Representatives Accountable?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Browse all 538 members of Congress with clear, data-driven accountability grades.
          </p>
          <Link href="/congress" className="btn-primary text-lg px-8 py-3 inline-block">
            View All Grades →
          </Link>
        </div>
      </section>
    </div>
  );
}
