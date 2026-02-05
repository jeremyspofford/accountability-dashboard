import { getMember, getMembers } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import VotingCharts from "@/components/VotingCharts";
import GradeBadge from "@/components/GradeBadge";

export function generateStaticParams() {
  return getMembers().map((member) => ({
    id: member.bioguide_id,
  }));
}

export default function RepPage({ params }: { params: { id: string } }) {
  const member = getMember(params.id);
  
  if (!member) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/congress" className="text-slate-400 hover:text-white transition">
          ← Back to Congress
        </Link>
      </div>
      
      {/* Header */}
      <div className="card mb-8">
        <div className="flex gap-6 items-start">
          {/* Corruption Grade - Most Prominent */}
          <div className="flex-shrink-0">
            <GradeBadge 
              grade={member.corruption_grade} 
              score={member.corruption_score}
              size="lg"
              showScore={true}
            />
            <p className="text-xs text-slate-400 text-center mt-2">Accountability<br/>Grade</p>
          </div>
          
          {member.photo_url ? (
            <img 
              src={member.photo_url} 
              alt={member.full_name}
              className="w-24 h-24 rounded-full object-cover bg-slate-800"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl">
              {member.party === "D" ? "🔵" : member.party === "R" ? "🔴" : "🟣"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{member.full_name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-400">{member.party_alignment_pct}%</div>
          <div className="text-slate-400 mt-1">Party Alignment</div>
          <div className="text-xs text-slate-400 mt-1">
            Votes with {member.party === "D" ? "Democrats" : member.party === "R" ? "Republicans" : "caucus"}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-400">{member.votes_cast}</div>
          <div className="text-slate-400 mt-1">Votes Cast</div>
          <div className="text-xs text-slate-400 mt-1">
            119th Congress roll calls
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-400">{member.bills_sponsored}</div>
          <div className="text-slate-400 mt-1">Bills Sponsored</div>
          <div className="text-xs text-slate-400 mt-1">119th Congress</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-400">${(member.total_raised / 1000000).toFixed(1)}M</div>
          <div className="text-slate-400 mt-1">Total Raised</div>
          <div className="text-xs text-slate-400 mt-1">2024 cycle</div>
        </div>
      </div>

      {/* Data Notice */}
      <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-8">
        <p className="text-blue-300 text-sm">
          ℹ️ <strong>Data sources:</strong> Member info & bills from Congress.gov API. 
          Party alignment & votes from Voteview. Campaign finance is placeholder (OpenSecrets coming soon).
        </p>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Voting Record */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Voting Record</h2>
          <VotingCharts member={member} />
        </div>

        {/* Top Donors */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Donors</h2>
          <div className="text-slate-400 text-sm py-8 text-center">
            Campaign finance data coming soon...
            <p className="text-xs text-slate-400 mt-2">
              Will include data from OpenSecrets/FEC
            </p>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Official Resources</h2>
        <div className="flex flex-wrap gap-4">
          <a 
            href={`https://www.congress.gov/member/${member.bioguide_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm"
          >
            Congress.gov Profile →
          </a>
          <a 
            href={`https://bioguide.congress.gov/search/bio/${member.bioguide_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm"
          >
            Biographical Directory →
          </a>
        </div>
      </div>
    </div>
  );
}
