import { getMockMember, getMockMembers } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getMockMembers().map((member) => ({
    id: member.bioguide_id,
  }));
}

export default function RepPage({ params }: { params: { id: string } }) {
  const member = getMockMember(params.id);
  
  if (!member) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="card mb-8">
        <div className="flex gap-6 items-start">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl">
            {member.party === "D" ? "🔵" : member.party === "R" ? "🔴" : "🟣"}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{member.full_name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${member.party === "D" ? "badge-dem" : member.party === "R" ? "badge-rep" : "badge-ind"}`}>
                {member.party === "D" ? "Democrat" : member.party === "R" ? "Republican" : "Independent"}
              </span>
              <span className="text-slate-400">
                {member.chamber === "house" ? "Representative" : "Senator"} • {member.state}{member.district ? `-${member.district}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-400">{member.party_alignment_pct}%</div>
          <div className="text-slate-400 mt-1">Party Alignment</div>
          <div className="text-xs text-slate-500 mt-1">
            Votes with {member.party === "D" ? "Democrats" : member.party === "R" ? "Republicans" : "caucus"}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-400">{member.missed_votes_pct}%</div>
          <div className="text-slate-400 mt-1">Missed Votes</div>
          <div className="text-xs text-slate-500 mt-1">
            {member.missed_votes_pct < 5 ? "Better than average" : "Above average"}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-400">{member.bills_sponsored}</div>
          <div className="text-slate-400 mt-1">Bills Sponsored</div>
          <div className="text-xs text-slate-500 mt-1">118th Congress</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-400">${(member.total_raised / 1000000).toFixed(1)}M</div>
          <div className="text-slate-400 mt-1">Total Raised</div>
          <div className="text-xs text-slate-500 mt-1">2024 cycle</div>
        </div>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Voting Record */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Votes</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <div>
                <div className="font-medium">H.R. 1234 - Infrastructure Bill</div>
                <div className="text-sm text-slate-500">Jan 15, 2024</div>
              </div>
              <span className="badge bg-green-900/50 text-green-300 border-green-800">Yes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <div>
                <div className="font-medium">H.R. 5678 - Tax Reform Act</div>
                <div className="text-sm text-slate-500">Jan 10, 2024</div>
              </div>
              <span className="badge bg-red-900/50 text-red-300 border-red-800">No</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <div>
                <div className="font-medium">S. 9012 - Defense Authorization</div>
                <div className="text-sm text-slate-500">Jan 5, 2024</div>
              </div>
              <span className="badge bg-green-900/50 text-green-300 border-green-800">Yes</span>
            </div>
          </div>
          <button className="text-blue-400 text-sm mt-4 hover:underline">View all votes →</button>
        </div>

        {/* Top Donors */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Donors</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <div>
                <div className="font-medium">Tech Industry PAC</div>
                <div className="text-sm text-slate-500">Industry</div>
              </div>
              <span className="text-green-400 font-semibold">$125,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <div>
                <div className="font-medium">Healthcare Workers Union</div>
                <div className="text-sm text-slate-500">PAC</div>
              </div>
              <span className="text-green-400 font-semibold">$98,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <div>
                <div className="font-medium">Small Donors (&lt;$200)</div>
                <div className="text-sm text-slate-500">Individual</div>
              </div>
              <span className="text-green-400 font-semibold">$450,000</span>
            </div>
          </div>
          <button className="text-blue-400 text-sm mt-4 hover:underline">View all donors →</button>
        </div>
      </div>
    </div>
  );
}
