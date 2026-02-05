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
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/congress"
              className="text-slate-500 hover:text-slate-900 text-sm transition"
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
                  className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-slate-200 flex items-center justify-center text-6xl border-4 border-white shadow-lg">
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                {member.full_name}
              </h1>

              {/* Party & District */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full font-medium ${getPartyBadgeClass(
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

              {/* PROMINENT Grade Badge */}
              <div
                className={`inline-flex items-center gap-4 px-8 py-4 rounded-2xl border-2 mb-6 ${getGradeBadgeClasses(
                  member.corruption_grade
                )}`}
              >
                <span className="font-mono text-6xl font-bold">
                  {member.corruption_grade}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Accountability Score
                  </span>
                  <span className="text-lg font-medium">
                    {getGradeLabel(member.corruption_grade)}
                  </span>
                  <span className="text-sm opacity-75">
                    {member.corruption_score}/100
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <a
                  href={`https://www.congress.gov/member/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
                >
                  <svg
                    className="w-5 h-5"
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
                  Official Profile
                </a>

                <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 transition">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Data Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-900 text-sm">
            ℹ️ <strong>Data sources:</strong> Member info & bills from
            Congress.gov API. Party alignment & votes from Voteview. Campaign
            finance and financial disclosures are placeholder data (OpenSecrets
            & FEC coming soon).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
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
          <aside className="space-y-8">
            {/* Committee Memberships */}
            <CommitteeMemberships committees={committees} />

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
                Quick Stats
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Bills Sponsored
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900">
                    {member.bills_sponsored}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Bills Cosponsored
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900">
                    {member.bills_cosponsored}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Votes Cast
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900">
                    {member.votes_cast}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Total Raised (2024)
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900">
                    ${(member.total_raised / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
                Official Resources
              </h4>
              <div className="space-y-2 text-sm">
                <a
                  href={`https://www.congress.gov/member/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Congress.gov Profile →
                </a>
                <a
                  href={`https://bioguide.congress.gov/search/bio/${member.bioguide_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
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
