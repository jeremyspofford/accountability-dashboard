"use client";

import { useState } from "react";
import VoteModal from "./VoteModal";

interface BeneficiaryImpact {
  group: string;
  impact: "benefits" | "harms" | "mixed";
}

interface KeyVote {
  id: string;
  congress: number;
  chamber: "House" | "Senate";
  rollnumber: number;
  date: string;
  bill: string;
  title: string;
  description: string;
  category: string;
  yea_count: number;
  nay_count: number;
  result: "Passed" | "Failed" | "Unknown";
  beneficiaries?: BeneficiaryImpact[];
  publicBenefit?: "positive" | "negative" | "mixed";
}

interface KeyVotesProps {
  votes: KeyVote[];
  chamber?: "House" | "Senate";
  limit?: number;
  showFilters?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Healthcare": "bg-red-100 text-red-700",
  "Climate & Environment": "bg-green-100 text-green-700",
  "Voting Rights": "bg-purple-100 text-purple-700",
  "Immigration": "bg-orange-100 text-orange-700",
  "Economy & Taxes": "bg-blue-100 text-blue-700",
  "Civil Rights": "bg-pink-100 text-pink-700",
  "National Security": "bg-slate-100 text-slate-700",
  "Government Ethics": "bg-yellow-100 text-yellow-700",
  "Other": "bg-gray-100 text-gray-700",
};

const RESULT_STYLES = {
  Passed: "bg-emerald-100 text-emerald-700",
  Failed: "bg-red-100 text-red-700",
  Unknown: "bg-gray-100 text-gray-600",
};

export function KeyVotes({ votes, chamber, limit = 10, showFilters = true }: KeyVotesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedChamber, setSelectedChamber] = useState<string>(chamber || "All");
  const [expanded, setExpanded] = useState(false);
  const [selectedVote, setSelectedVote] = useState<KeyVote | null>(null);
  
  // Get unique categories
  const categories = ["All", ...new Set(votes.map(v => v.category))];
  
  // Filter votes
  let filteredVotes = votes;
  
  if (selectedCategory !== "All") {
    filteredVotes = filteredVotes.filter(v => v.category === selectedCategory);
  }
  
  if (selectedChamber !== "All") {
    filteredVotes = filteredVotes.filter(v => v.chamber === selectedChamber);
  }
  
  // Apply limit unless expanded
  const displayVotes = expanded ? filteredVotes : filteredVotes.slice(0, limit);
  
  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          {/* Chamber filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="chamber-filter" className="text-sm text-slate-500">Chamber:</label>
            <select
              id="chamber-filter"
              value={selectedChamber}
              onChange={(e) => setSelectedChamber(e.target.value)}
              className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
            >
              <option value="All">All</option>
              <option value="House">House</option>
              <option value="Senate">Senate</option>
            </select>
          </div>
          
          {/* Category filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm text-slate-500">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-slate-500 ml-auto">
            {filteredVotes.length} votes
          </div>
        </div>
      )}
      
      {/* Vote list */}
      <div className="space-y-3">
        {displayVotes.map((vote) => (
          <div
            key={vote.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedVote(vote)}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${CATEGORY_COLORS[vote.category] || CATEGORY_COLORS.Other}`}>
                  {vote.category}
                </span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {vote.chamber}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${RESULT_STYLES[vote.result]}`}>
                  {vote.result}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(vote.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
            
            <h3 className="font-semibold text-slate-900 mb-1">
              {vote.bill && (
                <span className="text-blue-600 mr-2">{vote.bill}</span>
              )}
              {vote.title || "Vote"}
            </h3>
            
            {vote.description && (
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                {vote.description}
              </p>
            )}
            
            {/* Who Benefits indicator */}
            {vote.publicBenefit && vote.publicBenefit !== "mixed" && (
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mb-2 ${
                vote.publicBenefit === "positive"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}>
                {vote.publicBenefit === "positive" ? "👍" : "👎"}
                {vote.publicBenefit === "positive" 
                  ? "Benefits working people" 
                  : "Benefits special interests"}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-600 font-medium">
                ✓ {vote.yea_count} Yea
              </span>
              <span className="text-red-600 font-medium">
                ✗ {vote.nay_count} Nay
              </span>
              <span className="text-slate-400">
                Roll #{vote.rollnumber}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show more/less */}
      {filteredVotes.length > limit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded 
            ? `Show Less ↑` 
            : `Show ${filteredVotes.length - limit} More Votes ↓`
          }
        </button>
      )}
      
      {displayVotes.length === 0 && (
        <p className="text-center text-slate-500 py-8">
          No votes found for the selected filters.
        </p>
      )}
      
      {/* Vote Modal */}
      <VoteModal vote={selectedVote} onClose={() => setSelectedVote(null)} />
    </div>
  );
}

export default KeyVotes;
