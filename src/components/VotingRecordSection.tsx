/**
 * Voting Record Section - Party loyalty, key votes, ideology
 */
import React from "react";

interface KeyVote {
  date: string;
  bill: string;
  title: string;
  vote: "Yea" | "Nay" | "Present" | "Not Voting";
  partyPosition: "Yea" | "Nay";
  aligned: boolean;
}

interface VotingRecordProps {
  partyLoyalty: number;
  ideologyScore: number | null;
  keyVotes: KeyVote[];
}

export default function VotingRecordSection({
  partyLoyalty,
  ideologyScore,
  keyVotes,
}: VotingRecordProps) {
  const getAlignmentColor = (pct: number) => {
    if (pct >= 95) return "text-emerald-600 bg-emerald-50";
    if (pct >= 85) return "text-lime-600 bg-lime-50";
    if (pct >= 75) return "text-amber-600 bg-amber-50";
    if (pct >= 65) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getIdeologyLabel = (score: number) => {
    if (score < -0.5) return "Very Liberal";
    if (score < -0.2) return "Liberal";
    if (score < 0.2) return "Moderate";
    if (score < 0.5) return "Conservative";
    return "Very Conservative";
  };

  const getIdeologyPosition = (score: number) => {
    // Convert from -1 to 1 scale to 0-100%
    return ((score + 1) / 2) * 100;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        Voting Record
      </h3>

      {/* Party Loyalty */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-base font-semibold text-slate-700">
              Party Loyalty
            </div>
            <div className="text-sm text-slate-500">
              Votes aligned with party majority
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-lg font-mono text-3xl font-bold ${getAlignmentColor(
              partyLoyalty
            )}`}
          >
            {partyLoyalty}%
          </div>
        </div>

        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${partyLoyalty}%` }}
          />
        </div>
      </div>

      {/* Ideology Score */}
      {ideologyScore !== null && (
        <div className="mb-6 pb-6 border-b border-slate-100">
          <div className="text-base font-semibold text-slate-700 mb-3">
            Ideology Score
          </div>
          <div className="text-sm text-slate-500 mb-4">
            Based on DW-NOMINATE analysis of voting patterns
          </div>

          <div className="relative">
            <div className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full" />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-900 rounded-full"
              style={{ left: `${getIdeologyPosition(ideologyScore)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Very Liberal</span>
            <span className="font-medium text-slate-900">
              {getIdeologyLabel(ideologyScore)} ({ideologyScore.toFixed(2)})
            </span>
            <span>Very Conservative</span>
          </div>
        </div>
      )}

      {/* Key Votes */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Recent Key Votes
        </div>

        {keyVotes.length > 0 ? (
          <div className="space-y-3">
            {keyVotes.map((vote, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  vote.aligned
                    ? "bg-slate-50 border-slate-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {vote.bill}
                    </div>
                    <div className="text-xs text-slate-600">{vote.title}</div>
                  </div>
                  {!vote.aligned && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-600 text-white">
                      Broke with party
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500">{vote.date}</span>
                  <span
                    className={`font-medium ${
                      vote.vote === "Yea"
                        ? "text-emerald-600"
                        : vote.vote === "Nay"
                        ? "text-red-600"
                        : "text-slate-600"
                    }`}
                  >
                    Voted: {vote.vote}
                  </span>
                  <span className="text-slate-500">
                    Party: {vote.partyPosition}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-400 text-center py-4">
            Key votes data coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
