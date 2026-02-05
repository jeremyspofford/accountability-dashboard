"use client";

/**
 * Financial Section - Net worth and stock trades (placeholder)
 */
import React from "react";

interface StockTrade {
  date: string;
  ticker: string;
  company: string;
  type: "Buy" | "Sell";
  amount: string; // Range like "$1,001-$15,000"
  daysBeforeEvent?: {
    days: number;
    event: string;
  };
}

interface FinancialSectionProps {
  netWorth: number | null;
  netWorthChange: number | null;
  netWorthChangePercent: number | null;
  stockTrades: StockTrade[];
}

export default function FinancialSection({
  netWorth,
  netWorthChange,
  netWorthChangePercent,
  stockTrades,
}: FinancialSectionProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all duration-300">
      <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
        Financial Disclosures
      </h3>

      {/* Net Worth */}
      <div className="mb-8 pb-8 border-b border-slate-200">
        <div className="text-sm font-black uppercase tracking-wider text-slate-700 mb-4">
          Net Worth
        </div>

        {netWorth !== null ? (
          <div>
            <div className="font-mono text-5xl font-black text-slate-900 mb-4">
              {formatCurrency(netWorth)}
            </div>
            {netWorthChange !== null && netWorthChangePercent !== null && (
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-black ${
                    netWorthChange > 0
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {netWorthChange > 0 ? "↑" : "↓"}{" "}
                  {formatCurrency(Math.abs(netWorthChange))} (
                  {Math.abs(netWorthChangePercent)}%)
                </span>
                <span className="text-base text-slate-600 leading-relaxed">
                  Since entering Congress
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-base text-slate-400 py-6 leading-relaxed">
            Net worth data coming soon...
          </div>
        )}
      </div>

      {/* Stock Trades */}
      <div>
        <div className="text-sm font-black uppercase tracking-wider text-slate-700 mb-5">
          Recent Stock Trades
        </div>

        {stockTrades.length > 0 ? (
          <div className="space-y-4">
            {stockTrades.slice(0, 10).map((trade, idx) => (
              <div key={idx} className="border-l-4 border-slate-300 pl-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-base font-bold text-slate-900">
                      {trade.type === "Buy" ? "Bought" : "Sold"} {trade.ticker}
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed">{trade.company}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono text-base font-black ${
                        trade.type === "Sell" ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {trade.type === "Sell" ? "-" : "+"}
                      {trade.amount}
                    </div>
                    <div className="text-sm text-slate-600">{trade.date}</div>
                  </div>
                </div>

                {trade.daysBeforeEvent && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 border-2 border-amber-200">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="text-sm text-amber-900 leading-relaxed">
                        <strong className="font-bold">Potential conflict:</strong> {trade.type} {trade.daysBeforeEvent.days} days before {trade.daysBeforeEvent.event}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-base text-slate-400 text-center py-8 leading-relaxed">
            Stock trading data coming soon...
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Will include data from financial disclosures
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
