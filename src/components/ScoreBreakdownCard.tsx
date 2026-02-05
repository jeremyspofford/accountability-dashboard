"use client";

/**
 * Score Breakdown Card - Shows the 4 scoring factors
 */
import React from "react";

interface ScoreBreakdownProps {
  donorScore: number;
  votingScore: number;
  transparencyScore: number;
  financialScore: number;
}

export default function ScoreBreakdownCard({
  donorScore,
  votingScore,
  transparencyScore,
  financialScore,
}: ScoreBreakdownProps) {
  const factors = [
    {
      name: "Donor Transparency",
      score: donorScore,
      description: "Sources of campaign funding and PAC influence",
      icon: "💰",
    },
    {
      name: "Voting Alignment",
      score: votingScore,
      description: "Consistency between public statements and votes",
      icon: "🗳️",
    },
    {
      name: "Disclosure",
      score: transparencyScore,
      description: "Timely financial disclosures and reporting",
      icon: "📊",
    },
    {
      name: "Financial Ethics",
      score: financialScore,
      description: "Stock trading practices and conflict of interest",
      icon: "⚖️",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 80) return "text-lime-600 bg-lime-50 border-lime-200";
    if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
    if (score >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-lime-500";
    if (score >= 70) return "bg-amber-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all duration-300">
      <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
        Score Breakdown
      </h3>

      <div className="space-y-8">
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl flex-shrink-0">{factor.icon}</span>
                <div className="flex-1">
                  <div className="text-lg font-black text-slate-900 mb-1">
                    {factor.name}
                  </div>
                  <div className="text-base text-slate-600 leading-relaxed">
                    {factor.description}
                  </div>
                </div>
              </div>
              <div
                className={`px-5 py-2.5 rounded-xl border-2 font-mono font-black text-2xl flex-shrink-0 ${getScoreColor(
                  factor.score
                )}`}
              >
                {factor.score}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${getBarColor(factor.score)} transition-all duration-500`}
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
