import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Building,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { searchMarketGroundingApi } from '../services/api';

export const SearchGroundingPanel: React.FC = () => {
  const [query, setQuery] = useState('2026 campus placement hiring trends and compensation packages for Full Stack Engineers in India and Global');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; sources: { title: string; url: string }[] } | null>(null);

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await searchMarketGroundingApi(q, 'Software Engineer', 'Global / India');
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    '2026 campus placement compensation packages and hiring startups',
    'Most asked SDE-1 coding and system design interview questions 2026',
    'Cyber security analyst entry level salary benchmarks and demand',
    'Top skills required for AI Engineer freshers in 2026'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
              <Globe className="h-3.5 w-3.5" />
              <span>Google Search Grounding • Real-Time Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Live Placement Market Intelligence
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Search grounded against live Google Search web data using <strong>gemini-3.5-flash</strong>. Get verified current salary data, active placement drives, and recent hiring rounds with live source citations.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search current tech placement news, hiring companies, or salary benchmarks..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 hover:from-cyan-500 hover:to-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Searching Google...</span>
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5" />
                <span>Search Live Data</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Quick Queries:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleSearch(p);
              }}
              className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs text-slate-300 border border-slate-800 hover:border-cyan-500/50 hover:text-white transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Live Grounded Search Summary (gemini-3.5-flash)
              </span>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                Google Search Tool Active
              </span>
            </div>

            <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {result.summary}
            </div>

            {/* Citations & Source Links */}
            {result.sources && result.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Grounding Sources & Citations
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs text-cyan-300 border border-slate-800 hover:border-cyan-500 hover:text-white transition-all"
                    >
                      <span className="truncate max-w-xs">{src.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
