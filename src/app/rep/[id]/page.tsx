import { getMember, getMembers, getMemberFinance } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import DonorAnalysisSection from "@/components/DonorAnalysisSection";
import VotingRecordSection from "@/components/VotingRecordSection";
import CommitteeMemberships from "@/components/CommitteeMemberships";

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

  // Get real finance data
  const finance = getMemberFinance(params.id);

  // Placeholder committee data (will be replaced with real data)
  const committees = [
    {
      name: "Committee data coming soon",
      role: "Member" as const,
    },
  ];

  // Placeholder key votes (will be replaced with real data)
  const keyVotes = [
    {
      date: "2024-01-15",
      bill: "H.R. 2847",
      title: "Voting record data coming soon",
      vote: "Yea" as const,
      partyPosition: "Yea" as const,
      aligned: true,
    },
  ];

  const getPartyBadgeClass = (party: string) => {
    switch (party) {
      case "D":
        return "bg-blue-100 text-blue-700";
      case "R":
        return "bg-red-100 text-red-700";
      case "I":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPartyName = (party: string) => {
    switch (party) {
      case "D":
        return "Democrat";
      case "R":
        return "Republican";
      case "I":
        return "Independent";
      default:
        return party;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/congress"
              className="text-slate-600 hover:text-slate-900 text-base font-medium transition"
            >
              ← Back to Representatives
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className="w-32 h-32 md:w-44 md:h-44 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-slate-200 flex items-center justify-center text-5xl border-4 border-white shadow-xl">
                  {member.party === "D"
                    ? "🔵"
                    : member.party === "R"
                    ? "🔴"
                    : "🟣"}
                </div>
              )}
            </div>

            <div className="flex-1">
              {/* Name */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-3 leading-tight">
                {member.full_name}
              </h1>

              {/* Party & District */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm ${getPartyBadgeClass(
                    member.party
                  )}`}
                >
                  {getPartyName(member.party)}
                </span>
                <span className="text-lg text-slate-600">
                  {member.state}
                  {member.district ? `-${member.district}` : ""} •{" "}
                  {member.chamber === "house" ? "Representative" : "Senator"}
                </span>
              </div>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-slate-500">Bills Sponsored</span>
                  <span className="ml-2 font-bold text-slate-900">{member.bills_sponsored}</span>
                </div>
                <div>
                  <span className="text-slate-500">Bills Cosponsored</span>
                  <span className="ml-2 font-bold text-slate-900">{member.bills_cosponsored}</span>
                </div>
                <div>
                  <span className="text-slate-500">Votes Cast</span>
                  <span className="ml-2 font-bold text-slate-900">{member.votes_cast}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href={`https://www.congress.gov/member/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Congress.gov Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Finance - Now the main focus */}
            <DonorAnalysisSection finance={finance} />

            {/* Voting Record */}
            <VotingRecordSection
              partyLoyalty={member.party_alignment_pct}
              ideologyScore={member.ideology_score}
              keyVotes={keyVotes}
            />

            {/* Coming Soon sections */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-4">
                📈 Coming Soon
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">💵 Wealth Tracking</h4>
                  <p className="text-sm text-slate-600">Net worth changes since taking office</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">📊 Stock Trades</h4>
                  <p className="text-sm text-slate-600">Committee assignments vs trading activity</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">🎯 Campaign Promises</h4>
                  <p className="text-sm text-slate-600">Stated positions vs actual votes</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">👥 Who Benefits</h4>
                  <p className="text-sm text-slate-600">Analysis of who their votes serve</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (1/3 width) */}
          <aside className="space-y-8">
            {/* Committee Memberships */}
            <CommitteeMemberships committees={committees} />

            {/* External Links */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-4">
                Resources
              </h4>
              <div className="space-y-2 text-sm">
                <a
                  href={`https://www.congress.gov/member/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline block"
                >
                  Congress.gov Profile →
                </a>
                <a
                  href={`https://bioguide.congress.gov/search/bio/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline block"
                >
                  Biographical Directory →
                </a>
                <a
                  href={`https://www.opensecrets.org/search?q=${encodeURIComponent(member.full_name)}&type=politicians`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline block"
                >
                  OpenSecrets Profile →
                </a>
                <a
                  href={`https://www.fec.gov/data/candidates/?q=${encodeURIComponent(member.last_name)}&office=${member.chamber === 'house' ? 'H' : 'S'}&state=${member.state}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline block"
                >
                  FEC Filings →
                </a>
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">📊 Data Sources</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Congress.gov API</li>
                <li>• Federal Election Commission</li>
                <li>• Voteview (voting records)</li>
              </ul>
              <p className="text-xs text-slate-400 mt-3">
                Data updated regularly. Last build: {new Date().toLocaleDateString()}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
