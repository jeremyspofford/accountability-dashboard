"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getMembers, getPartyBreakdown, getStates } from "@/lib/data";
import type { Member } from "@/lib/types";

function CongressContent() {
  const searchParams = useSearchParams();
  const allMembers = getMembers();
  const stats = getPartyBreakdown();
  const states = getStates();
  
  // Filter state
  const [chamber, setChamber] = useState<string>("");
  const [party, setParty] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  
  // Read URL params on mount
  useEffect(() => {
    const urlState = searchParams.get("state");
    const urlSearch = searchParams.get("search");
    const urlParty = searchParams.get("party");
    const urlChamber = searchParams.get("chamber");
    
    if (urlState) setState(urlState.toUpperCase());
    if (urlSearch) setSearch(urlSearch);
    if (urlParty) setParty(urlParty);
    if (urlChamber) setChamber(urlChamber);
  }, [searchParams]);
  
  // Filter members
  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      if (chamber && m.chamber !== chamber) return false;
      if (party && m.party !== party) return false;
      if (state && m.state !== state) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.full_name.toLowerCase().includes(q) && 
            !m.state.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allMembers, chamber, party, state, search]);
  
  // Dynamic stats for filtered view
  const filteredStats = useMemo(() => ({
    total: filteredMembers.length,
    democrats: filteredMembers.filter(m => m.party === "D").length,
    republicans: filteredMembers.filter(m => m.party === "R").length,
    independents: filteredMembers.filter(m => m.party === "I").length,
  }), [filteredMembers]);
  
  const isFiltered = chamber || party || state || search;
  
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-8">
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900">Congress Members</h1>
            <p className="text-lg text-slate-600 mt-4 leading-relaxed">
              {isFiltered 
                ? `Showing ${filteredStats.total} of ${stats.total} members`
                : `All ${stats.total} members of the 119th United States Congress`}
            </p>
          </div>
          
          {isFiltered && (
            <button 
              onClick={() => { setChamber(""); setParty(""); setState(""); setSearch(""); }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters ✕
            </button>
          )}
        </div>
        
        {/* Search + Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:flex-1 sm:min-w-[200px] px-4 py-3 border border-slate-300 rounded-lg text-base leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[44px]"
            />
            <select 
              value={chamber}
              onChange={(e) => setChamber(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-base leading-relaxed focus:ring-2 focus:ring-blue-500 transition min-h-[44px]"
            >
              <option value="">All Chambers</option>
              <option value="house">House ({stats.house})</option>
              <option value="senate">Senate ({stats.senate})</option>
            </select>
            <select 
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-base leading-relaxed focus:ring-2 focus:ring-blue-500 transition min-h-[44px]"
            >
              <option value="">All Parties</option>
              <option value="D">Democrat ({stats.democrats})</option>
              <option value="R">Republican ({stats.republicans})</option>
              <option value="I">Independent ({stats.independents})</option>
            </select>
            <select 
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-base leading-relaxed focus:ring-2 focus:ring-blue-500 transition min-h-[44px]"
            >
              <option value="">All States</option>
              {states.map(s => (
                <option key={s.abbrev} value={s.abbrev}>
                  {s.abbrev} - {s.name} ({s.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="card text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 sm:mb-3 tabular-nums leading-tight">{filteredStats.total}</div>
          <div className="text-slate-600 font-semibold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
            {isFiltered ? "Showing" : "Total Members"}
          </div>
        </div>
        <div className="card text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-5xl font-black text-blue-600 mb-2 sm:mb-3 tabular-nums leading-tight">{filteredStats.democrats}</div>
          <div className="text-slate-600 font-semibold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">Democrats</div>
        </div>
        <div className="card text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-5xl font-black text-red-600 mb-2 sm:mb-3 tabular-nums leading-tight">{filteredStats.republicans}</div>
          <div className="text-slate-600 font-semibold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">Republicans</div>
        </div>
        <div className="card text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-5xl font-black text-purple-600 mb-2 sm:mb-3 tabular-nums leading-tight">{filteredStats.independents}</div>
          <div className="text-slate-600 font-semibold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">Independents</div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-20 text-lg text-slate-500 leading-relaxed">
          No members match your filters. Try adjusting your search.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Link
              key={member.bioguide_id}
              href={`/rep/${member.bioguide_id}`}
              className="bg-white border border-slate-200 rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-pointer group"
            >
              {/* Header: Photo + Name + Party */}
              <div className="flex items-start gap-4 mb-6">
                {/* Photo */}
                {member.photo_url ? (
                  <img 
                    src={member.photo_url} 
                    alt={member.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0 border-2 border-slate-200">
                    {member.party === "D" ? "🔵" : member.party === "R" ? "🔴" : "🟣"}
                  </div>
                )}
                
                {/* Name & Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold leading-tight text-slate-900 mb-1 group-hover:text-blue-600 transition truncate flex items-center gap-2">
                    {member.full_name}
                    {member.party_alignment_pct === 100 && (
                      <span 
                        title="Rubber Stamp: Votes 100% with party"
                        className="text-base opacity-70 hover:opacity-100 transition"
                      >
                        🤖
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      member.party === "D" 
                        ? "bg-blue-100 text-blue-700" 
                        : member.party === "R" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {member.party === "D" ? "D" : member.party === "R" ? "R" : "I"}
                    </span>
                    <span>
                      {member.state}{member.district ? `-${member.district}` : ""}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{member.chamber === "house" ? "House" : "Senate"}</span>
                  </div>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-lg py-2 px-2 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Bills</div>
                  <div className="font-mono text-lg font-bold text-slate-900">{member.bills_sponsored}</div>
                </div>
                
                <div className="bg-slate-50 rounded-lg py-2 px-2 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Votes</div>
                  <div className="font-mono text-lg font-bold text-slate-900">{member.votes_cast}</div>
                </div>
                
                <div className="bg-slate-50 rounded-lg py-2 px-2 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Cosponsor</div>
                  <div className="font-mono text-lg font-bold text-slate-900">{member.bills_cosponsored}</div>
                </div>
              </div>
              
              {/* View Details CTA */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
                  View Campaign Finance →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CongressPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="space-y-4">
            <div className="h-12 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-2/3"></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex gap-4">
              <div className="h-12 bg-slate-200 rounded-lg flex-1"></div>
              <div className="h-12 bg-slate-200 rounded-lg w-32"></div>
              <div className="h-12 bg-slate-200 rounded-lg w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="h-12 bg-slate-200 rounded w-20 mx-auto mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-14 bg-slate-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CongressContent />
    </Suspense>
  );
}
