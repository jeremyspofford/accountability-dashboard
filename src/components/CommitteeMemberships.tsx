/**
 * Committee Memberships Component
 */
import React from "react";

interface Committee {
  name: string;
  role: "Chair" | "Ranking Member" | "Member" | "Vice Chair";
  subcommittees?: string[];
}

interface CommitteeMembershipsProps {
  committees: Committee[];
}

export default function CommitteeMemberships({
  committees,
}: CommitteeMembershipsProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Chair":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Ranking Member":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Vice Chair":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isLeadership = (role: string) =>
    ["Chair", "Ranking Member", "Vice Chair"].includes(role);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        Committee Memberships
      </h3>

      {committees.length > 0 ? (
        <div className="space-y-4">
          {committees.map((committee, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                isLeadership(committee.role)
                  ? "bg-blue-50 border-blue-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 mb-1">
                    {committee.name}
                  </div>
                  {committee.subcommittees &&
                    committee.subcommittees.length > 0 && (
                      <div className="text-xs text-slate-500 space-y-1 mt-2">
                        <div className="font-medium">Subcommittees:</div>
                        <ul className="list-disc list-inside pl-2">
                          {committee.subcommittees.map((sub, subIdx) => (
                            <li key={subIdx}>{sub}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getRoleBadge(
                    committee.role
                  )}`}
                >
                  {committee.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400 text-center py-8">
          Committee information coming soon...
        </div>
      )}
    </div>
  );
}
