import { getMockMembers } from "@/lib/mock-data";

export default function CongressPage() {
  const members = getMockMembers();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Congress Members</h1>
          <p className="text-slate-400 mt-2">
            All 535 members of the 118th United States Congress
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option value="">All Chambers</option>
            <option value="house">House</option>
            <option value="senate">Senate</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option value="">All Parties</option>
            <option value="D">Democrat</option>
            <option value="R">Republican</option>
            <option value="I">Independent</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option value="">All States</option>
            {/* TODO: Add state options */}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card py-4">
          <div className="text-2xl font-bold text-center">535</div>
          <div className="text-slate-400 text-sm text-center">Total Members</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-blue-400">212</div>
          <div className="text-slate-400 text-sm text-center">Democrats</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-red-400">220</div>
          <div className="text-slate-400 text-sm text-center">Republicans</div>
        </div>
        <div className="card py-4">
          <div className="text-2xl font-bold text-center text-purple-400">3</div>
          <div className="text-slate-400 text-sm text-center">Independents</div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <a
            key={member.bioguide_id}
            href={`/rep/${member.bioguide_id}`}
            className="card hover:border-slate-700 transition group"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                {member.party === "D" ? "🔵" : member.party === "R" ? "🔴" : "🟣"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-blue-400 transition">
                  {member.full_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
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
                <div className="text-lg font-semibold text-yellow-400">{member.missed_votes_pct}%</div>
                <div className="text-xs text-slate-500">Missed Votes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-400">{member.bills_sponsored}</div>
                <div className="text-xs text-slate-500">Bills</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
