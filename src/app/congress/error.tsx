'use client';

import { useEffect } from 'react';

export default function CongressError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Congress page error:', error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl border-2 border-red-200 p-8 md:p-10 shadow-lg text-center">
        <div className="text-5xl mb-6">🏛️❌</div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Unable to Load Congress Data
        </h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          We couldn't fetch the list of representatives. This might be a temporary issue.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-red-800 font-mono">
            {error.message || 'Data fetch failed'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
          <a
            href="/"
            className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-lg"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
