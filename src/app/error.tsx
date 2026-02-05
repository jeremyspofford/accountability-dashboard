'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl border-2 border-red-200 p-8 md:p-12 shadow-xl text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            We encountered an error while loading this page. This could be due to a temporary 
            issue with our data sources or a network problem.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-red-800 font-mono break-words">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
