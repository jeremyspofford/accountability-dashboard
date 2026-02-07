'use client';

import { useState } from 'react';

interface Position {
  topic: string;
  stance: string;
  intensity: number;
  quotes: string[];
  votes: string[];
}

interface MemberPositions {
  bioguide_id: string;
  name: string;
  source: string;
  source_url: string;
  last_updated: string;
  positions: Position[];
}

interface CampaignPositionsProps {
  bioguideId: string;
  positionsData: { members: MemberPositions[] };
}

const stanceColors: Record<string, { bg: string; text: string; border: string }> = {
  'Strongly Supports': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  'Supports': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Favors': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'No opinion': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  'Opposes': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Strongly Opposes': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
};

function getStanceStyle(stance: string) {
  return stanceColors[stance] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
}

function IntensityBar({ intensity }: { intensity: number }) {
  return (
    <div className="flex gap-0.5" title={`Intensity: ${intensity}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i <= intensity ? 'bg-slate-600' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  const [expanded, setExpanded] = useState(false);
  const style = getStanceStyle(position.stance);
  const hasQuotes = position.quotes && position.quotes.length > 0;

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-3 mb-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 text-sm">{position.topic}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${style.bg} ${style.text}`}>
              {position.stance}
            </span>
            <IntensityBar intensity={position.intensity} />
          </div>
        </div>
        {hasQuotes && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-500 hover:text-slate-700 text-xs"
          >
            {expanded ? '▲ Less' : '▼ More'}
          </button>
        )}
      </div>
      
      {expanded && hasQuotes && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Supporting evidence:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {position.quotes.slice(0, 3).map((quote, i) => (
              <li key={i} className="pl-2 border-l-2 border-slate-300">
                {quote}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CampaignPositions({ bioguideId, positionsData }: CampaignPositionsProps) {
  const member = positionsData.members.find(m => m.bioguide_id === bioguideId);
  
  if (!member) {
    return null; // No position data for this member
  }

  const positions = member.positions || [];
  
  if (positions.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Policy Positions
        </h2>
        <a
          href={member.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Source: OnTheIssues →
        </a>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">
        Based on voting record, public statements, and interest group ratings.
      </p>

      <div className="grid md:grid-cols-2 gap-2">
        {positions.map((position, index) => (
          <PositionCard key={index} position={position} />
        ))}
      </div>
    </section>
  );
}
