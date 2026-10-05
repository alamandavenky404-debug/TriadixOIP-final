import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Filter,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { JobRecommendation } from '../types/career';
import { INITIAL_JOB_RECOMMENDATIONS } from '../data/mockData';
import { generateCoverLetterApi } from '../services/api';

export const JobRecommendations: React.FC = () => {
  const [jobs, setJobs] = useState<JobRecommendation[]>(INITIAL_JOB_RECOMMENDATIONS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'HighMatch'>('All');
  const [activeTab, setActiveTab] = useState<'listings' | 'tracker'>('listings');
  
  // Cover letter modal state
  const [activeJobForLetter, setActiveJobForLetter] = useState<JobRecommendation | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState<{
    coverLetter: string;
    coldEmail: string;
    elevatorPitch: string;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    if (selectedFilter === 'Remote') return job.location.toLowerCase().includes('remote');
    if (selectedFilter === 'Hybrid') return job.location.toLowerCase().includes('hybrid');
    if (selectedFilter === 'HighMatch') return job.matchScore >= 90;
    return true;
  });

  const updateJobStatus = (id: string, newStatus: JobRecommendation['applicationStatus']) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, applicationStatus: newStatus, appliedDate: new Date().toISOString().split('T')[0] } : j))
    );
  };

  const handleGenerateCoverLetter = async (job: JobRecommendation) => {
    setActiveJobForLetter(job);
    setGeneratingLetter(true);
    setCoverLetterData(null);

    try {
      const data = await generateCoverLetterApi({
        candidateName: 'Alex Rivera',
        targetRole: job.title,
        company: job.company,
        jobDescription: job.description,
        keyHighlights: `Proficient in ${job.matchedSkills.join(', ')}. Built AI Career Coach and Cyber Incident Portal capstone projects.`,
      });
      setCoverLetterData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Campus Hiring Opportunities</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Job Recommendations & Application Tracker
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Curated placement openings matched against your verified skills. Track ongoing applications across screening rounds and generate targeted cover letters and cold outreach emails with AI.
            </p>
          </div>

          {/* Switcher: Listings vs Tracker */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('listings')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'listings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recommended Roles ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Application Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'listings' ? (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-300">Filter By:</span>
              {(['All', 'HighMatch', 'Remote', 'Hybrid'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedFilter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f === 'HighMatch' ? '90%+ Match' : f}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredJobs.length}</strong> active matches
            </span>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-xl border border-slate-700">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{job.title}</h3>
                        <p className="text-xs text-slate-400">{job.company}</p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="rounded-xl bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 text-right">
                      <span className="text-[10px] text-emerald-400 font-semibold block leading-none">FIT SCORE</span>
                      <span className="text-sm font-extrabold text-emerald-300">{job.matchScore}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {job.location}
                    </span>
                    <span className="text-emerald-400 font-semibold">{job.salary}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((sk, idx) => {
                        const isMatched = job.matchedSkills.includes(sk);
                        return (
                          <span
                            key={idx}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${
                              isMatched
                                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            {sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions & Status Dropdown */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Status:</span>
                    <select
                      value={job.applicationStatus || 'Saved'}
                      onChange={(e) => updateJobStatus(job.id, e.target.value as any)}
                      className="rounded bg-slate-950 border border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-200 focus:outline-none"
                    >
                      <option value="Saved">Saved</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateCoverLetter(job)}
                      className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>AI Cover Letter</span>
                    </button>

                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
                    >
                      <span>Apply</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Application Pipeline Tracker */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['Saved', 'Applied', 'Interviewing', 'Offer'] as const).map((columnStatus) => {
            const columnJobs = jobs.filter((j) => (j.applicationStatus || 'Saved') === columnStatus);
            return (
              <div key={columnStatus} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {columnStatus}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                    {columnJobs.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {columnJobs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">No applications here yet</p>
                  ) : (
                    columnJobs.map((cj) => (
                      <div
                        key={cj.id}
                        className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-200 line-clamp-1">{cj.title}</h4>
                            <p className="text-[11px] text-slate-400">{cj.company}</p>
                          </div>
                          <span className="rounded bg-emerald-500/10 px-1 text-[10px] font-bold text-emerald-400">
                            {cj.matchScore}%
                          </span>
                        </div>

                        {cj.appliedDate && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>Updated: {cj.appliedDate}</span>
                          </div>
                        )}

                        <div className="pt-1 flex items-center justify-between">
                          <button
                            onClick={() => handleGenerateCoverLetter(cj)}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <Sparkles className="h-2.5 w-2.5" /> Pitch
                          </button>

                          <select
                            value={cj.applicationStatus}
                            onChange={(e) => updateJobStatus(cj.id, e.target.value as any)}
                            className="rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 px-1.5 py-0.5"
                          >
                            <option value="Saved">Saved</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Cover Letter & Cold Email Modal */}
      {activeJobForLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  AI Placement Materials: {activeJobForLetter.title}
                </h3>
                <p className="text-xs text-slate-400">{activeJobForLetter.company}</p>
              </div>

              <button
                onClick={() => setActiveJobForLetter(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {generatingLetter ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mx-auto" />
                <p className="text-sm font-semibold text-slate-200">Writing Tailored Cover Letter & Cold Email...</p>
                <p className="text-xs text-slate-400">Highlighting your capstone projects and matching competencies</p>
              </div>
            ) : coverLetterData ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Cold Email Section */}
                <div className="rounded-xl border border-indigo-500/20 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Recruiter Cold Outreach Email
                    </span>
                    <button
                      onClick={() => handleCopy(coverLetterData.coldEmail, 'email')}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-white"
                    >
                      {copiedType === 'email' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedType === 'email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {coverLetterData.coldEmail}
                  </pre>
                </div>

                {/* 30-Second Elevator Pitch */}
                <div className="rounded-xl border border-emerald-500/20 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      30-Second Spoken Pitch (Interview Intro)
                    </span>
                    <button
                      onClick={() => handleCopy(coverLetterData.elevatorPitch, 'pitch')}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-white"
                    >
                      {copiedType === 'pitch' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedType === 'pitch' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-emerald-200/90 italic leading-relaxed">
                    "{coverLetterData.elevatorPitch}"
                  </p>
                </div>

                {/* Full Cover Letter */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Full Cover Letter
                    </span>
                    <button
                      onClick={() => handleCopy(coverLetterData.coverLetter, 'letter')}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      {copiedType === 'letter' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedType === 'letter' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {coverLetterData.coverLetter}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
