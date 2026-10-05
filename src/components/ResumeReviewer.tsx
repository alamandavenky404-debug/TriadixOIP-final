import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Zap,
  TrendingUp,
  ShieldCheck,
  Target
} from 'lucide-react';
import { ResumeReviewResult } from '../types/career';
import { SAMPLE_RESUMES } from '../data/mockData';
import { reviewResumeApi } from '../services/api';

interface ResumeReviewerProps {
  initialResumeText?: string;
  targetRole: string;
  setTargetRole: (role: string) => void;
}

export const ResumeReviewer: React.FC<ResumeReviewerProps> = ({
  initialResumeText = SAMPLE_RESUMES.mern.content,
  targetRole,
  setTargetRole,
}) => {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ResumeReviewResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunReview = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reviewResumeApi(resumeText, targetRole);
      setReviewResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (key: 'mern' | 'cyber' | 'data') => {
    setResumeText(SAMPLE_RESUMES[key].content);
    setTargetRole(SAMPLE_RESUMES[key].targetRole);
    setReviewResult(null);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Placement AI Evaluator</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Resume Review & Bullet Optimizer
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Get an executive-level critique scored against Tier-1 product company standards. Includes Google X-Y-Z formula bullet point rewrites, quantified metrics evaluation, and recruiter red-flags.
            </p>
          </div>

          {/* Quick Sample Resume Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Load Template:</span>
            <button
              onClick={() => handleLoadSample('mern')}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-indigo-600 hover:text-white transition-all border border-slate-700/60"
            >
              Full-Stack MERN
            </button>
            <button
              onClick={() => handleLoadSample('cyber')}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-rose-600 hover:text-white transition-all border border-slate-700/60"
            >
              Cyber Security
            </button>
            <button
              onClick={() => handleLoadSample('data')}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-amber-600 hover:text-white transition-all border border-slate-700/60"
            >
              Data Analyst
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Role & Resume Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-indigo-400" />
                Target Placement Role
              </label>
              <span className="text-[11px] text-slate-500">Benchmark reference</span>
            </div>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. SDE-1, Full Stack Software Engineer, Cyber Security Analyst"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Resume Plaintext / Markdown</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {resumeText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setResumeText('')}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Clear Text
              </button>

              <button
                onClick={handleRunReview}
                disabled={loading || !resumeText.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing Structure & Metrics...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    <span>Run AI Placement Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="lg:col-span-6 space-y-4">
          {!reviewResult && !loading && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Ready for Review</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Click <strong>"Run AI Placement Review"</strong> to generate placement grading, metric audit, and Google X-Y-Z bullet rewrites.
              </p>
              <button
                onClick={handleRunReview}
                className="mt-4 rounded-lg bg-indigo-600/30 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/40"
              >
                Quick Analyze Default Resume
              </button>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
                <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">Evaluating against Placement Benchmarks...</p>
                <p className="text-xs text-slate-400">Scoring action verbs, metric density, and role relevancy</p>
              </div>
            </div>
          )}

          {reviewResult && !loading && (
            <div className="space-y-4">
              {/* Scorecard Hero */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Placement Readiness Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-extrabold text-white">{reviewResult.overallScore}</span>
                      <span className="text-sm text-slate-400 font-medium">/ 100</span>
                      <span
                        className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          reviewResult.overallScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : reviewResult.overallScore >= 70
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        Grade: {reviewResult.formattingGrade}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-right">
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Quantified Impact</p>
                      <p className="text-sm font-bold text-indigo-300">{reviewResult.quantifiedImpactScore}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Tone & Clarity</p>
                      <p className="text-sm font-bold text-emerald-300">{reviewResult.toneAndClarityScore}%</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                  {reviewResult.summaryFeedback}
                </p>

                {/* Strengths & Critical Fixes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Key Strengths</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {reviewResult.strengths.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Priority Fixes for Placements</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {reviewResult.criticalFixes.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  Section-by-Section Health
                </h3>
                <div className="space-y-2">
                  {reviewResult.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{sec.name}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              sec.status === 'good'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : sec.status === 'warning'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {sec.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{sec.suggestions[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google X-Y-Z Bullet Point Rewrites */}
              {reviewResult.bulletRewrites && reviewResult.bulletRewrites.length > 0 && (
                <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        Google X-Y-Z Formula Bullet Rewrites
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      High Impact
                    </span>
                  </div>

                  <div className="space-y-3">
                    {reviewResult.bulletRewrites.map((rw, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold uppercase text-rose-400">Before (Vague):</span>
                          <p className="text-slate-400 italic font-mono bg-rose-950/20 p-2 rounded border border-rose-900/30">
                            "{rw.original}"
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase text-emerald-400">
                              After (Measurable Impact):
                            </span>
                            <button
                              onClick={() => copyToClipboard(rw.improved, idx)}
                              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-white transition-colors"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy Bullet</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-emerald-200 font-mono bg-emerald-950/20 p-2.5 rounded border border-emerald-800/30 font-medium">
                            {rw.improved}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                          <span>
                            <strong className="text-slate-300">Why:</strong> {rw.reason}
                          </span>
                          {rw.metricsAdded && (
                            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                              +{rw.metricsAdded}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
