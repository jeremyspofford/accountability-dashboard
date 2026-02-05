"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getMembers, getPartyBreakdown, getStates, Member } from "@/lib/data";
import GradeBadge from "@/components/GradeBadge";

function CongressContent() {
  const searchParams = useSearchParams();
  const allMembers = getMembers();
  const stats = getPartyBreakdown();
  const states = getStates();
  
  // Filter state - initialize from URL params
  const [chamber, setChamber] = useState<string>("");
  const [party, setParty] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  
  // Read URL params on mount
  useEffect(() => {
    const urlState = searchParams.get("state");
    const urlSearch = searchParams.get("search");
    const urlParty = searchParams.get("party");
    const urlChamber = searchParams.get("chamber");
    const urlGrade = searchParams.get("grade");
    
    if (urlState) setState(urlState.toUpperCase());
    if (urlSearch) setSearch(urlSearch);
    if (urlParty) setParty(urlParty);
    if (urlChamber) setChamber(urlChamber);
    if (urlGrade) setGrade(urlGrade);
  }, [searchParams]);
  
  // Filter members
  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      if (chamber && m.chamber !== chamber) return false;
      if (party && m.party !== party) return false;
      if (state && m.state !== state) return false;
      if (grade && m.corruption_grade !== grade) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.full_name.toLowerCase().includes(q) && 
            !m.state.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allMembers, chamber, party, state, search, grade]);
  
  // Dynamic stats for filtered view
  const filteredStats = useMemo(() => ({
    total: filteredMembers.length,
    democrats: filteredMembers.filter(m => m.party === "D").length,
    republicans: filteredMembers.filter(m => m.party === "R").length,
    independents: filteredMembers.filter(m => m.party === "I").length,
  }), [filteredMembers]);
  
  const isFiltered = chamber || party || state || search || grade;
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Congress Members</h1>
            <p className="text-slate-600 mt-2">
              {isFiltered 
                ? `Showing ${filteredStats.total} of ${stats.total} members`
                : `All ${stats.total} members of the 119th United States Congress`}
            </p>
          </div>
          
          {isFiltered && (
            <button 
              onClick={() => { setChamber(""); setParty(""); setState(""); setSearch(""); setGrade(""); }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters ✕
            </button>
          )}
        </div>
        
        {/* Search + Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Grades</option>
              <option value="A">Grade A - Transparent</option>
              <option value="B">Grade B - Trustworthy</option>
              <option value="C">Grade C - Concerning</option>
              <option value="D">Grade D - Questionable</option>
              <option value="F">Grade F - Corrupt</option>
            </select>
            <select 
              value={chamber}
              onChange={(e) => setChamber(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Chambers</option>
              <option value="house">House ({stats.house})</option>
              <option value="senate">Senate ({stats.senate})</option>
            </select>
            <select 
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Parties</option>
              <option value="D">Democrat ({stats.democrats})</option>
              <option value="R">Republican ({stats.republicans})</option>
              <option value="I">Independent ({stats.independents})</option>
            </select>
            <select 
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center py-6">
          <div className="text-3xl font-bold text-slate-900 mb-2">{filteredStats.total}</div>
          <div className="text-slate-600 font-medium">
            {isFiltered ? "Showing" : "Total Members"}
          </div>
        </div>
        <div className="card text-center py-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{filteredStats.democrats}</div>
          <div className="text-slate-600 font-medium">Democrats</div>
        </div>
        <div className="card text-center py-6">
          <div className="text-3xl font-bold text-red-600 mb-2">{filteredStats.republicans}</div>
          <div className="text-slate-600 font-medium">Republicans</div>
        </div>
        <div className="card text-center py-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">{filteredStats.independents}</div>
          <div className="text-slate-600 font-medium">Independents</div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No members match your filters. Try adjusting your search.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Link
              key={member.bioguide_id}
              href={`/rep/${member.bioguide_id}`}
              className="card hover:shadow-lg transition cursor-pointer group"
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
                  <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition truncate">
                    {member.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className={`badge ${member.party === "D" ? "badge-dem" : member.party === "R" ? "badge-rep" : "badge-ind"}`}>
                      {member.party === "D" ? "D" : member.party === "R" ? "R" : "I"}
                    </span>
                    <span>
                      {member.state}{member.district ? `-${member.district}` : ""}
                    </span>
                  </div>
                </div>
                
                {/* Grade Badge - Focal Point */}
                <div className="flex-shrink-0">
                  <GradeBadge 
                    grade={member.corruption_grade} 
                    score={member.corruption_score}
                    size="md"
                  />
                </div>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="stat-card">
                  <div className="stat-label">Party Align</div>
                  <div className="stat-value text-slate-900">{member.party_alignment_pct}%</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-label">Votes Cast</div>
                  <div className="stat-value text-slate-900">{member.votes_cast}</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-label">Bills</div>
                  <div className="stat-value text-slate-900">{member.bills_sponsored}</div>
                </div>
              </div>
              
              {/* Quick Stats Bar */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Chamber:</span>
                  <span className="font-medium text-slate-900">
                    {member.chamber === "house" ? "House" : "Senate"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Score:</span>
                  <span className="font-medium text-slate-900">{member.corruption_score}/100</span>
                </div>
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
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">Loading...</div>}>
      <CongressContent />
    </Suspense>
  );
}
