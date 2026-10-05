import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { AtsAnalysisResult } from '../types/career';
import { SAMPLE_RESUMES } from '../data/mockData';
import { analyzeAtsApi } from '../services/api';

const SAMPLE_JDS: Record<string, { title: string; jd: string; role: string }> = {
  sde1: {
    title: 'Tier-1 Product SDE-1 (Amazon / Google / Startup)',
    role: 'Software Development Engineer - 1',
    jd: `We are looking for an Associate Software Development Engineer (SDE-1) to build scalable, distributed backend services and high-performance client applications.
Requirements:
- Strong foundations in Data Structures, Algorithms, and Object-Oriented Design.
- Proficiency in modern JavaScript/TypeScript, React, Node.js, or Java/Python.
- Experience building RESTful APIs, database schema modeling (PostgreSQL / MongoDB), and Redis caching.
- Familiarity with Docker, Git workflows, CI/CD pipelines, and AWS/GCP cloud environments.
- Excellent communication skills, STAR-method problem solving, and writing test suites (Jest/Vitest).`
  },
  mern: {
    title: 'Full Stack MERN Specialist',
    role: 'Full Stack Developer',
    jd: `Seeking a skilled Full Stack MERN Developer to lead responsive frontend engineering and scalable Node.js microservices.
Requirements:
- 1+ years hands-on project experience with React 18/19, TypeScript, Tailwind CSS, and state management.
- Deep understanding of Express.js, MongoDB aggregation pipelines, indexing, and authentication (JWT/OAuth).
- Experience with WebSockets, real-time data handling, and automated unit testing.
- Proven track record of shipping production-ready web applications with high Lighthouse performance scores.`
  },
  cyber: {
    title: 'Cyber Security & SOC Triage Analyst',
    role: 'Cyber Security Analyst',
    jd: `Sentinel Global is seeking a Junior SOC Analyst to monitor security events, investigate phishing and malware incidents, and perform threat triage.
Requirements:
- Knowledge of NIST CSF, MITRE ATT&CK, SIEM platforms (Splunk, Elastic), and Wireshark traffic analysis.
- Understanding of firewall rules, Linux system hardening, and SHA-256 evidence validation.
- Scripting ability in Python or Bash for incident automation and IOC correlation.
- Relevant certification (CompTIA Security+, CEH, or equivalent coursework).`
  }
};

export const AtsAnalyzer: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.mern.content);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JDS.mern.jd);
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsAnalysisResult | null>(null);

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeAtsApi(resumeText, targetRole, jobDescription);
      setAtsResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSampleJd = (key: 'sde1' | 'mern' | 'cyber') => {
    setJobDescription(SAMPLE_JDS[key].jd);
    setTargetRole(SAMPLE_JDS[key].role);
    if (key === 'cyber') setResumeText(SAMPLE_RESUMES.cyber.content);
    else setResumeText(SAMPLE_RESUMES.mern.content);
    setAtsResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-emerald-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <FileCheck className="h-3.5 w-3.5" />
              <span>ATS Parser Compatibility Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ATS Score & Keyword Alignment Analysis
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Test how Applicant Tracking Systems (Workday, Greenhouse, Lever) parse your resume against a specific target Job Description. Pinpoint missing keywords before recruiter bots screen you out.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Sample JDs:</span>
            <button
              onClick={() => handleSelectSampleJd('sde1')}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-emerald-600 hover:text-white transition-all border border-slate-700/60"
            >
              SDE-1 Tier-1
            </button>
            <button
              onClick={() => handleSelectSampleJd('mern')}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-indigo-600 hover:text-white transition-all border border-slate-700/60"
            >
              Full Stack MERN
            </button>
            <button
              onClick={() => handleSelectSampleJd('cyber')}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-rose-600 hover:text-white transition-all border border-slate-700/60"
            >
              Cyber Analyst
            </button>
          </div>
        </div>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Description & Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Target Role:</span>
              <span className="text-[11px] text-slate-500">Matches ATS parsing profile</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Target Job Description (JD)</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {jobDescription.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={7}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste company job description here..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Your Resume Content</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {resumeText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <button
              onClick={handleRunAnalysis}
              disabled={loading || !resumeText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Computing ATS Keyword Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Calculate ATS Match Score</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: ATS Report */}
        <div className="lg:col-span-6 space-y-4">
          {!atsResult && !loading && (
            <div className="flex h-full min-h-[440px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                <FileCheck className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">ATS Audit Pending</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Run ATS analysis to calculate your keyword density, parseability rate, and missing critical technical competencies.
              </p>
              <button
                onClick={handleRunAnalysis}
                className="mt-4 rounded-lg bg-emerald-600/30 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/40"
              >
                Scan Current Resume vs Sample JD
              </button>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[440px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
                <Search className="absolute inset-0 m-auto h-6 w-6 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-200">Simulating ATS Keyword Parser & Regex Tokenizer...</p>
            </div>
          )}

          {atsResult && !loading && (
            <div className="space-y-4">
              {/* ATS Gauge Hero */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      ATS Match Percentage
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white">{atsResult.matchScore}%</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          atsResult.matchScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : atsResult.matchScore >= 70
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {atsResult.matchScore >= 85 ? 'High Placement Match' : atsResult.matchScore >= 70 ? 'Moderate Match' : 'High Rejection Risk'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Target Role</span>
                    <p className="text-xs font-bold text-slate-200">{atsResult.targetRole}</p>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      atsResult.matchScore >= 85
                        ? 'bg-emerald-500'
                        : atsResult.matchScore >= 70
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${atsResult.matchScore}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                  {atsResult.summary}
                </p>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Keywords */}
                <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Matched Keywords ({atsResult.matchedKeywords.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matchedKeywords.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/20"
                      >
                        <span>{item.keyword}</span>
                        {item.count > 1 && (
                          <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-bold text-emerald-200">
                            {item.count}x
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="rounded-xl border border-rose-500/20 bg-slate-900/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      Missing Keywords ({atsResult.missingKeywords.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {atsResult.missingKeywords.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between rounded-lg bg-rose-950/20 p-2 text-xs border border-rose-900/30"
                      >
                        <div>
                          <p className="font-semibold text-rose-300">{item.keyword}</p>
                          <p className="text-[10px] text-slate-400">{item.reason}</p>
                        </div>
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400 uppercase">
                          {item.importance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section Health & Formatting Checks */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  ATS Parsing Health by Section
                </span>
                <div className="space-y-2">
                  {atsResult.sectionPasses.map((sec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {sec.status === 'pass' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                        {sec.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                        {sec.status === 'fail' && <XCircle className="h-4 w-4 text-rose-400" />}
                        <span className="font-semibold text-slate-200">{sec.section}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate max-w-xs">{sec.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Issues */}
              {atsResult.formatIssues && atsResult.formatIssues.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Layout & Formatting Warnings
                  </span>
                  <div className="space-y-2">
                    {atsResult.formatIssues.map((issue, idx) => (
                      <div key={idx} className="text-xs text-slate-300">
                        <strong className="text-amber-300">{issue.issue}:</strong> {issue.recommendation}
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
