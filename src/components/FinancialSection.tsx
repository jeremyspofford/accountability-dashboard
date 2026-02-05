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
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        Financial Disclosures
      </h3>

      {/* Net Worth */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Net Worth
        </div>

        {netWorth !== null ? (
          <div>
            <div className="font-mono text-4xl font-bold text-slate-900 mb-2">
              {formatCurrency(netWorth)}
            </div>
            {netWorthChange !== null && netWorthChangePercent !== null && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    netWorthChange > 0
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {netWorthChange > 0 ? "↑" : "↓"}{" "}
                  {formatCurrency(Math.abs(netWorthChange))} (
                  {Math.abs(netWorthChangePercent)}%)
                </span>
                <span className="text-sm text-slate-500">
                  Since entering Congress
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-400 py-4">
            Net worth data coming soon...
          </div>
        )}
      </div>

      {/* Stock Trades */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Recent Stock Trades
        </div>

        {stockTrades.length > 0 ? (
          <div className="space-y-3">
            {stockTrades.slice(0, 10).map((trade, idx) => (
              <div key={idx} className="border-l-4 border-slate-200 pl-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {trade.type === "Buy" ? "Bought" : "Sold"} {trade.ticker}
                    </div>
                    <div className="text-xs text-slate-500">{trade.company}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono text-sm font-bold ${
                        trade.type === "Sell" ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {trade.type === "Sell" ? "-" : "+"}
                      {trade.amount}
                    </div>
                    <div className="text-xs text-slate-500">{trade.date}</div>
                  </div>
                </div>

                {trade.daysBeforeEvent && (
                  <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="text-xs text-amber-900">
                        <strong>Potential conflict:</strong> {trade.type} {trade.daysBeforeEvent.days} days before {trade.daysBeforeEvent.event}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-400 text-center py-4">
            Stock trading data coming soon...
            <p className="text-xs text-slate-400 mt-2">
              Will include data from financial disclosures
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
