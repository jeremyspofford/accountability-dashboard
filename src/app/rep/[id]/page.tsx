import { getMember, getMembers } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScoreBreakdownCard from "@/components/ScoreBreakdownCard";
import DonorAnalysisSection from "@/components/DonorAnalysisSection";
import VotingRecordSection from "@/components/VotingRecordSection";
import CommitteeMemberships from "@/components/CommitteeMemberships";
import FinancialSection from "@/components/FinancialSection";

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

  // Generate placeholder scores (will be replaced with real data)
  const scoreFactors = {
    donorScore: Math.floor(member.corruption_score * 0.9),
    votingScore: Math.floor(member.corruption_score * 1.1),
    transparencyScore: member.corruption_score,
    financialScore: Math.floor(member.corruption_score * 0.95),
  };

  // Generate placeholder donor data
  const totalRaised = member.total_raised;
  const donorData = {
    pacAmount: totalRaised * 0.45,
    individualAmount: totalRaised * 0.35,
    smallDonorAmount: totalRaised * 0.2,
    topDonors: [
      { name: "Tech Industry PAC", amount: 450000, type: "PAC" as const },
      { name: "Energy Corp Alliance", amount: 380000, type: "PAC" as const },
      { name: "Finance Group", amount: 320000, type: "PAC" as const },
      { name: "Healthcare Providers", amount: 280000, type: "PAC" as const },
      { name: "Real Estate Assn", amount: 250000, type: "PAC" as const },
      { name: "Manufacturing PAC", amount: 220000, type: "PAC" as const },
      { name: "Retail Coalition", amount: 190000, type: "PAC" as const },
      { name: "Agriculture Group", amount: 175000, type: "PAC" as const },
      { name: "Transportation PAC", amount: 160000, type: "PAC" as const },
      { name: "Education Alliance", amount: 145000, type: "PAC" as const },
    ],
    industries: [
      { name: "Technology", amount: 850000 },
      { name: "Energy & Natural Resources", amount: 720000 },
      { name: "Finance & Banking", amount: 650000 },
      { name: "Healthcare", amount: 580000 },
      { name: "Real Estate", amount: 420000 },
    ],
  };

  // Placeholder committee data
  const committees = [
    {
      name: "Ways and Means Committee",
      role: "Member" as const,
      subcommittees: ["Subcommittee on Trade", "Subcommittee on Health"],
    },
    {
      name: "Budget Committee",
      role: "Member" as const,
    },
  ];

  // Placeholder key votes
  const keyVotes = [
    {
      date: "2024-01-15",
      bill: "H.R. 2847",
      title: "Climate Investment Act",
      vote: "Yea" as const,
      partyPosition: "Yea" as const,
      aligned: true,
    },
    {
      date: "2024-01-10",
      bill: "H.R. 1234",
      title: "Tax Reform Bill",
      vote: "Nay" as const,
      partyPosition: "Yea" as const,
      aligned: false,
    },
  ];

  // Placeholder financial data
  const financialData = {
    netWorth: null,
    netWorthChange: null,
    netWorthChangePercent: null,
    stockTrades: [],
  };

  const getGradeBadgeClasses = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-emerald-50 border-emerald-500 text-emerald-700";
      case "B":
        return "bg-lime-50 border-lime-500 text-lime-700";
      case "C":
        return "bg-amber-50 border-amber-500 text-amber-700";
      case "D":
        return "bg-orange-50 border-orange-500 text-orange-700";
      case "F":
        return "bg-red-50 border-red-500 text-red-700";
      default:
        return "bg-slate-50 border-slate-500 text-slate-700";
    }
  };

  const getGradeLabel = (grade: string) => {
    switch (grade) {
      case "A":
        return "Transparent";
      case "B":
        return "Trustworthy";
      case "C":
        return "Concerning";
      case "D":
        return "Questionable";
      case "F":
        return "Corrupt";
      default:
        return "Unknown";
    }
  };

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
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/congress"
              className="text-slate-600 hover:text-slate-900 text-base font-medium transition"
            >
              ← Back to Representatives
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* Photo */}
            <div className="flex-shrink-0">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className="w-40 h-40 md:w-56 md:h-56 rounded-3xl object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl bg-slate-200 flex items-center justify-center text-7xl border-4 border-white shadow-2xl">
                  {member.party === "D"
                    ? "🔵"
                    : member.party === "R"
                    ? "🔴"
                    : "🟣"}
                </div>
              )}
            </div>

            <div className="flex-1">
              {/* Name & Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
                {member.full_name}
              </h1>

              {/* Party & District */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span
                  className={`px-4 py-2 rounded-xl font-bold text-base ${getPartyBadgeClass(
                    member.party
                  )}`}
                >
                  {getPartyName(member.party)}
                </span>
                <span className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  {member.state}
                  {member.district ? `-${member.district}` : ""} •{" "}
                  {member.chamber === "house" ? "Representative" : "Senator"}
                </span>
              </div>

              {/* PROMINENT Grade Badge - Now CENTERED and LARGER */}
              <div className="flex justify-center md:justify-start mb-8">
                <div
                  className={`inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-8 sm:px-12 py-6 sm:py-8 rounded-3xl border-4 shadow-2xl hover:shadow-3xl transition-all duration-300 ${getGradeBadgeClasses(
                    member.corruption_grade
                  )}`}
                >
                  <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-black leading-none">
                    {member.corruption_grade}
                  </span>
                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <span className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider">
                      Accountability Score
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-black">
                      {getGradeLabel(member.corruption_grade)}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg opacity-75 font-mono font-bold">
                      {member.corruption_score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <a
                  href={`https://www.congress.gov/member/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:scale-105 flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[44px]"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Official Profile</span>
                </a>

                <button className="px-6 sm:px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-400 hover:scale-105 flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[44px]">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        {/* Data Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-12">
          <p className="text-blue-900 text-base leading-relaxed">
            ℹ️ <strong className="font-bold">Data sources:</strong> Member info & bills from
            Congress.gov API. Party alignment & votes from Voteview. Campaign
            finance and financial disclosures are placeholder data (OpenSecrets
            & FEC coming soon).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Score Breakdown */}
            <ScoreBreakdownCard {...scoreFactors} />

            {/* Donor Analysis */}
            <DonorAnalysisSection {...donorData} />

            {/* Voting Record */}
            <VotingRecordSection
              partyLoyalty={member.party_alignment_pct}
              ideologyScore={member.ideology_score}
              keyVotes={keyVotes}
            />

            {/* Financial Section */}
            <FinancialSection {...financialData} />
          </div>

          {/* Sidebar (1/3 width) */}
          <aside className="space-y-10">
            {/* Committee Memberships */}
            <CommitteeMemberships committees={committees} />

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <h4 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6">
                Quick Stats
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-black uppercase tracking-wider text-slate-600 mb-2">
                    Bills Sponsored
                  </div>
                  <div className="font-mono text-4xl font-black text-slate-900">
                    {member.bills_sponsored}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-wider text-slate-600 mb-2">
                    Bills Cosponsored
                  </div>
                  <div className="font-mono text-4xl font-black text-slate-900">
                    {member.bills_cosponsored}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-wider text-slate-600 mb-2">
                    Votes Cast
                  </div>
                  <div className="font-mono text-4xl font-black text-slate-900">
                    {member.votes_cast}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-wider text-slate-600 mb-2">
                    Total Raised (2024)
                  </div>
                  <div className="font-mono text-4xl font-black text-slate-900">
                    ${(member.total_raised / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <h4 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6">
                Official Resources
              </h4>
              <div className="space-y-3 text-base">
                <a
                  href={`https://www.congress.gov/member/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline block leading-relaxed"
                >
                  Congress.gov Profile →
                </a>
                <a
                  href={`https://bioguide.congress.gov/search/bio/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline block leading-relaxed"
                >
                  Biographical Directory →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
