"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { getMembers, getPartyBreakdown, getStates, Member } from "@/lib/data";

export default function CongressPage() {
  const allMembers = getMembers();
  const stats = getPartyBreakdown();
  const states = getStates();
  
  // Filter state
  const [chamber, setChamber] = useState<string>("");
  const [party, setParty] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Congress Members</h1>
            <p className="text-slate-400 mt-2">
              {isFiltered 
                ? `Showing ${filteredStats.total} of ${stats.total} members`
                : `All ${stats.total} members of the 119th United States Congress`}
            </p>
          </div>
          
          {isFiltered && (
            <button 
              onClick={() => { setChamber(""); setParty(""); setState(""); setSearch(""); }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear filters ✕
            </button>
          )}
        </div>
        
        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto md:flex-1 md:max-w-xs"
          />
          <select 
            value={chamber}
            onChange={(e) => setChamber(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Chambers</option>
            <option value="house">House ({stats.house})</option>
            <option value="senate">Senate ({stats.senate})</option>
          </select>
          <select 
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Parties</option>
            <option value="D">Democrat ({stats.democrats})</option>
            <option value="R">Republican ({stats.republicans})</option>
            <option value="I">Independent ({stats.independents})</option>
          </select>
          <select 
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
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

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card py-4">
          <div className="text-2xl font-bold text-center">{filteredStats.total}</div>
          <div className="text-slate-400 text-sm text-center">
            {isFiltered ? "Showing" : "Total Members"}
          </div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-blue-400">{filteredStats.democrats}</div>
          <div className="text-slate-400 text-sm text-center">Democrats</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-red-400">{filteredStats.republicans}</div>
          <div className="text-slate-400 text-sm text-center">Republicans</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-purple-400">{filteredStats.independents}</div>
          <div className="text-slate-400 text-sm text-center">Independents</div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No members match your filters. Try adjusting your search.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Link
              key={member.bioguide_id}
              href={`/rep/${member.bioguide_id}`}
              className="card hover:border-slate-600 transition group"
            >
              <div className="flex gap-4">
                {member.photo_url ? (
                  <img 
                    src={member.photo_url} 
                    alt={member.full_name}
                    className="w-16 h-16 rounded-full object-cover bg-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                    {member.party === "D" ? "🔵" : member.party === "R" ? "🔴" : "🟣"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-blue-400 transition truncate">
                    {member.full_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`badge ${member.party === "D" ? "badge-dem" : member.party === "R" ? "badge-rep" : "badge-ind"}`}>
                      {member.party === "D" ? "Democrat" : member.party === "R" ? "Republican" : "Independent"}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {member.state}{member.district ? `-${member.district}` : ""} • {member.chamber === "house" ? "House" : "Senate"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">{member.party_alignment_pct}%</div>
                  <div className="text-xs text-slate-500">Party Align</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-400">{member.votes_cast}</div>
                  <div className="text-xs text-slate-500">Votes Cast</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-400">{member.bills_sponsored}</div>
                  <div className="text-xs text-slate-500">Bills</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
