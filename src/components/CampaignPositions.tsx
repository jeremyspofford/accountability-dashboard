"use client";

import { useState } from "react";

export interface Position {
  topic: string;
  stance: string;
  intensity: number;
  quotes: string[];
  votes?: unknown[];
}

interface MemberData {
  bioguide_id: string;
  name: string;
  source: string;
  source_url: string;
  last_updated: string;
  positions: Position[];
}

interface CampaignPositionsProps {
  bioguideId: string;
  positionsData?: { members: MemberData[] };
}

// Categorize positions by topic keywords
function categorizePosition(topic: string): string {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('abortion') || topicLower.includes('marriage') || topicLower.includes('gay') || topicLower.includes('gender')) {
    return 'Social Issues';
  }
  if (topicLower.includes('tax') || topicLower.includes('spending') || topicLower.includes('stimulus') || topicLower.includes('economy')) {
    return 'Economic Policy';
  }
  if (topicLower.includes('healthcare') || topicLower.includes('obamacare') || topicLower.includes('medicaid') || topicLower.includes('medicare')) {
    return 'Healthcare';
  }
  if (topicLower.includes('security') || topicLower.includes('social security') || topicLower.includes('privatize')) {
    return 'Social Security';
  }
  if (topicLower.includes('education') || topicLower.includes('school') || topicLower.includes('voucher')) {
    return 'Education';
  }
  if (topicLower.includes('environment') || topicLower.includes('epa') || topicLower.includes('climate') || topicLower.includes('energy')) {
    return 'Environment & Energy';
  }
  if (topicLower.includes('immigration') || topicLower.includes('border') || topicLower.includes('pathway to citizenship')) {
    return 'Immigration';
  }
  if (topicLower.includes('gun') || topicLower.includes('second amendment') || topicLower.includes('firearm')) {
    return 'Gun Rights';
  }
  if (topicLower.includes('foreign') || topicLower.includes('military') || topicLower.includes('defense') || topicLower.includes('war')) {
    return 'Foreign Policy & Defense';
  }
  if (topicLower.includes('drug') || topicLower.includes('marijuana') || topicLower.includes('legalize')) {
    return 'Drug Policy';
  }
  if (topicLower.includes('god') || topicLower.includes('religion') || topicLower.includes('faith')) {
    return 'Religion & Values';
  }
  if (topicLower.includes('hiring') || topicLower.includes('minorities') || topicLower.includes('affirmative')) {
    return 'Civil Rights';
  }
  
  return 'Other Issues';
}

// Get color based on stance
function getStanceColor(stance: string): { bg: string; text: string; border: string } {
  const stanceLower = stance.toLowerCase();
  
  if (stanceLower.includes('strongly supports') || stanceLower.includes('strongly favors')) {
    return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
  }
  if (stanceLower.includes('supports') || stanceLower.includes('favors')) {
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  }
  if (stanceLower.includes('strongly opposes')) {
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  }
  if (stanceLower.includes('opposes')) {
    return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
  }
  if (stanceLower.includes('neutral') || stanceLower.includes('mixed')) {
    return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
  
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

// Intensity indicator (1-5 scale)
function IntensityIndicator({ intensity }: { intensity: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`w-2 h-4 rounded-sm ${
            level <= intensity ? 'bg-blue-600' : 'bg-slate-200'
          }`}
          title={`Intensity: ${intensity}/5`}
        />
      ))}
    </div>
  );
}

// Individual position card
function PositionCard({ position }: { position: Position }) {
  const [expanded, setExpanded] = useState(false);
  const colors = getStanceColor(position.stance);
  const hasQuotes = position.quotes && position.quotes.length > 0 && position.quotes.some(q => q.trim());

  return (
    <div className={`border-2 ${colors.border} ${colors.bg} rounded-xl p-4 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-bold text-slate-900 text-sm flex-1 leading-relaxed">
          {position.topic}
        </h4>
        <IntensityIndicator intensity={position.intensity} />
      </div>
      
      <div className="flex items-center justify-between gap-3">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
          {position.stance}
        </span>
        
        {hasQuotes && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            {expanded ? 'Hide' : 'Show'} Quotes
            <svg 
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      
      {expanded && hasQuotes && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Quotes & Statements:</p>
          <ul className="space-y-2">
            {position.quotes
              .filter(q => q.trim())
              .map((quote, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-3 border-l-2 border-blue-300 leading-relaxed">
                  {quote}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Category section
function CategorySection({ 
  category, 
  positions, 
  defaultExpanded = false 
}: { 
  category: string; 
  positions: Position[];
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-slate-200 pb-6 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {category}
          <span className="ml-2 text-sm font-normal text-slate-500">({positions.length})</span>
        </h3>
        <svg 
          className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all ${expanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {positions.map((position, idx) => (
            <PositionCard key={idx} position={position} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CampaignPositions({ bioguideId, positionsData }: CampaignPositionsProps) {
  // Load positions data - either from prop or from file
  const data = positionsData || require('@/data/positions.json');
  const memberData = data.members.find((m: MemberData) => m.bioguide_id === bioguideId);
  
  if (!memberData || !memberData.positions || memberData.positions.length === 0) {
    return null;
  }

  // Group positions by category
  const positionsByCategory = memberData.positions.reduce((acc: Record<string, Position[]>, position: Position) => {
    const category = categorizePosition(position.topic);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(position);
    return acc;
  }, {});

  // Sort categories by number of positions (descending)
  const sortedCategories = Object.entries(positionsByCategory)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          Campaign Positions
        </h2>
        <p className="text-sm text-slate-600">
          {memberData.name}'s stated positions on key issues from campaign and public statements
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>📊 {memberData.positions.length} positions tracked</span>
          <span>•</span>
          <span>Source: OnTheIssues.org</span>
        </div>
      </div>

      <div className="space-y-6">
        {sortedCategories.map(([category, positions], idx) => (
          <CategorySection
            key={category}
            category={category}
            positions={positions}
            defaultExpanded={idx === 0} // First category expanded by default
          />
        ))}
      </div>

      {memberData.source_url && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <a
            href={memberData.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            View full profile on OnTheIssues.org
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
