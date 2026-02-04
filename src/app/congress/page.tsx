import Link from "next/link";
import { getMembers, getPartyBreakdown, getStates } from "@/lib/data";

export default function CongressPage() {
  const members = getMembers();
  const stats = getPartyBreakdown();
  const states = getStates();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Congress Members</h1>
          <p className="text-slate-400 mt-2">
            All {stats.total} members of the 119th United States Congress
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option value="">All Chambers</option>
            <option value="house">House ({stats.house})</option>
            <option value="senate">Senate ({stats.senate})</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option value="">All Parties</option>
            <option value="D">Democrat ({stats.democrats})</option>
            <option value="R">Republican ({stats.republicans})</option>
            <option value="I">Independent ({stats.independents})</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option value="">All States</option>
            {states.map(state => (
              <option key={state.abbrev} value={state.abbrev}>
                {state.name} ({state.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card py-4">
          <div className="text-2xl font-bold text-center">{stats.total}</div>
          <div className="text-slate-400 text-sm text-center">Total Members</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-blue-400">{stats.democrats}</div>
          <div className="text-slate-400 text-sm text-center">Democrats</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-red-400">{stats.republicans}</div>
          <div className="text-slate-400 text-sm text-center">Republicans</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-purple-400">{stats.independents}</div>
          <div className="text-slate-400 text-sm text-center">Independents</div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
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
    </div>
  );
}
