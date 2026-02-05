"use client";

/**
 * Donor Analysis Section - Shows funding sources breakdown
 */
import React from "react";

interface Donor {
  name: string;
  amount: number;
  type: "PAC" | "Individual" | "Industry";
}

interface DonorAnalysisProps {
  pacAmount: number;
  individualAmount: number;
  smallDonorAmount: number;
  topDonors: Donor[];
  industries: Array<{ name: string; amount: number }>;
}

export default function DonorAnalysisSection({
  pacAmount,
  individualAmount,
  smallDonorAmount,
  topDonors,
  industries,
}: DonorAnalysisProps) {
  const total = pacAmount + individualAmount + smallDonorAmount;
  const pacPct = total > 0 ? ((pacAmount / total) * 100).toFixed(0) : "0";
  const individualPct = total > 0 ? ((individualAmount / total) * 100).toFixed(0) : "0";
  const smallPct = total > 0 ? ((smallDonorAmount / total) * 100).toFixed(0) : "0";

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all duration-300">
      <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
        Funding Sources
      </h3>

      {/* Stacked Bar Chart */}
      <div className="mb-8">
        <div className="w-full h-20 flex rounded-xl overflow-hidden mb-6 shadow-md">
          {pacAmount > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-sm font-medium px-2"
              style={{ width: `${pacPct}%` }}
            >
              {Number(pacPct) > 15 && "PACs"}
            </div>
          )}
          {individualAmount > 0 && (
            <div
              className="bg-amber-500 flex items-center justify-center text-white text-sm font-medium px-2"
              style={{ width: `${individualPct}%` }}
            >
              {Number(individualPct) > 15 && "Large Donors"}
            </div>
          )}
          {smallDonorAmount > 0 && (
            <div
              className="bg-emerald-500 flex items-center justify-center text-white text-sm font-medium px-2"
              style={{ width: `${smallPct}%` }}
            >
              {Number(smallPct) > 15 && "Small Donors"}
            </div>
          )}
        </div>

        {/* Legend with Values */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></span>
              <span className="text-base text-slate-700 font-medium">Corporate PACs</span>
            </div>
            <span className="font-mono text-base font-bold text-slate-900">
              {formatCurrency(pacAmount)} ({pacPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-amber-500 shadow-sm"></span>
              <span className="text-base text-slate-700 font-medium">Large Individual Donors</span>
            </div>
            <span className="font-mono text-base font-bold text-slate-900">
              {formatCurrency(individualAmount)} ({individualPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm"></span>
              <span className="text-base text-slate-700 font-medium">Small Donors (&lt;$200)</span>
            </div>
            <span className="font-mono text-base font-bold text-slate-900">
              {formatCurrency(smallDonorAmount)} ({smallPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Top 10 Donors */}
      <div className="pt-8 border-t border-slate-200 mt-8">
        <div className="text-sm font-black uppercase tracking-wider text-slate-700 mb-5">
          Top 10 Contributors
        </div>
        <ol className="space-y-4 text-base">
          {topDonors.slice(0, 10).map((donor, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span className="text-slate-700 leading-relaxed">
                {idx + 1}. {donor.name}
              </span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(donor.amount)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Industry Breakdown */}
      {industries.length > 0 && (
        <div className="pt-8 border-t border-slate-200 mt-8">
          <div className="text-sm font-black uppercase tracking-wider text-slate-700 mb-5">
            Top Industries
          </div>
          <div className="space-y-4">
            {industries.slice(0, 5).map((industry, idx) => (
              <div key={idx} className="flex justify-between items-center text-base">
                <span className="text-slate-700 leading-relaxed">{industry.name}</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(industry.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
