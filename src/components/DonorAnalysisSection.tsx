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
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        Funding Sources
      </h3>

      {/* Stacked Bar Chart */}
      <div className="mb-6">
        <div className="w-full h-16 flex rounded-lg overflow-hidden mb-4">
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm text-slate-600">Corporate PACs</span>
            </div>
            <span className="font-mono text-sm font-medium text-slate-900">
              {formatCurrency(pacAmount)} ({pacPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-sm text-slate-600">Large Individual Donors</span>
            </div>
            <span className="font-mono text-sm font-medium text-slate-900">
              {formatCurrency(individualAmount)} ({individualPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm text-slate-600">Small Donors (&lt;$200)</span>
            </div>
            <span className="font-mono text-sm font-medium text-slate-900">
              {formatCurrency(smallDonorAmount)} ({smallPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Top 10 Donors */}
      <div className="pt-6 border-t border-slate-100">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Top 10 Contributors
        </div>
        <ol className="space-y-2 text-sm">
          {topDonors.slice(0, 10).map((donor, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span className="text-slate-600">
                {idx + 1}. {donor.name}
              </span>
              <span className="font-mono font-medium text-slate-900">
                {formatCurrency(donor.amount)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Industry Breakdown */}
      {industries.length > 0 && (
        <div className="pt-6 border-t border-slate-100 mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Top Industries
          </div>
          <div className="space-y-2">
            {industries.slice(0, 5).map((industry, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{industry.name}</span>
                <span className="font-mono font-medium text-slate-900">
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
