import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Code2,
  Workflow,
  Mic,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CandidateProfile } from '../types/career';

interface PlacementKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
}

export const PlacementKitModal: React.FC<PlacementKitModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'resume-bullets' | 'architecture' | 'profile'>('pitch');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const RESUME_BULLETS_TEXT = `AI Career Coach & Placement Prep Platform | React 19, TypeScript, Express, Gemini API, Tailwind CSS
- Architected and deployed an end-to-end AI career coaching platform featuring real-time ATS resume screening, regex tokenization, and Google X-Y-Z formula bullet point rewrites.
- Engineered live mock interview studio utilizing Web Speech API and Gemini generative intelligence, providing real-time STAR framework evaluation and audio feedback with <800ms latency.
- Built interactive skill gap diagnostics engine comparing student technical proficiencies against industry role benchmarks, computing actionable multi-week learning roadmaps.
- Implemented responsive full-stack REST API architecture with Express middleware, automated health probes, error boundaries, and zero-flicker Tailwind design.`;

  const ELEVATOR_PITCH_TEXT = `"Hello! For my capstone project, I built TalentForge AI — an enterprise-grade AI Career Coach and Placement Preparation platform designed to solve the campus placement preparation challenge for engineering graduates.

The platform addresses the three biggest bottlenecks students face:
First, resumes getting screened out by Applicant Tracking Systems. I built an ATS parsing engine that compares resumes against real job descriptions, calculating match percentages and identifying missing high-leverage technical competencies.
Second, interview anxiety. I implemented a live simulated mock interview studio with voice synthesis and real-time speech recognition that grades answers on technical accuracy, clarity, and STAR method structure.
Third, targeted preparation. The platform computes an interactive skill gap matrix and generates customized 12-week roadmaps with hands-on capstone specifications.

On the architecture side, it's a full-stack TypeScript application with React 19 on Vite, Express.js API gateway, and server-side Gemini AI intelligence with structured JSON schemas and robust fallback resilience."`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Campus Placement Readiness Kit</h2>
              <p className="text-xs text-slate-400">Everything needed to present and showcase your capstone to recruiters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`flex-1 rounded-lg py-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pitch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            <span>90s Interview Pitch</span>
          </button>

          <button
            onClick={() => setActiveTab('resume-bullets')}
            className={`flex-1 rounded-lg py-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'resume-bullets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume Bullets</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 rounded-lg py-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span>System Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 rounded-lg py-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Candidate Profile</span>
          </button>
        </div>

        {/* Tab 1: 90s Interview Pitch Script */}
        {activeTab === 'pitch' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Placement Interview Spoken Pitch Script
              </span>
              <button
                onClick={() => copyText(ELEVATOR_PITCH_TEXT, 'pitch')}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-white"
              >
                {copiedKey === 'pitch' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy Pitch Script'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs leading-relaxed text-slate-200">
              <p className="italic text-slate-300">
                {ELEVATOR_PITCH_TEXT}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-950/20 border border-indigo-900/30 p-3 text-xs text-indigo-300">
              💡 <strong>Interviewer Tip:</strong> Speak naturally, pause after explaining each of the three pillars, and invite them to test the live ATS scanner or mock interview on screen!
            </div>
          </div>
        )}

        {/* Tab 2: Resume Bullets for Copying */}
        {activeTab === 'resume-bullets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Action-Oriented Resume Bullets (Google X-Y-Z Formatted)
              </span>
              <button
                onClick={() => copyText(RESUME_BULLETS_TEXT, 'bullets')}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-white"
              >
                {copiedKey === 'bullets' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'bullets' ? 'Copied' : 'Copy Bullets'}</span>
              </button>
            </div>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {RESUME_BULLETS_TEXT}
            </pre>
          </div>
        )}

        {/* Tab 3: System Architecture Diagram */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Full-Stack Architecture & Data Pipeline
            </span>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-lg border border-indigo-500/40 bg-indigo-950/30 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-400">Client Tier</span>
                  <h4 className="font-bold text-white text-xs">React 19 + TypeScript</h4>
                  <p className="text-[10px] text-slate-400">Tailwind CSS, Web Speech API, Motion</p>
                </div>

                <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/30 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">API Gateway</span>
                  <h4 className="font-bold text-white text-xs">Express.js on Node.js</h4>
                  <p className="text-[10px] text-slate-400">JSON Schemas, CORS, Rate Limiting</p>
                </div>

                <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">AI Engine</span>
                  <h4 className="font-bold text-white text-xs">Gemini 3.8 Flash</h4>
                  <p className="text-[10px] text-slate-400">Server-Side GenAI SDK, Structured Parsing</p>
                </div>

                <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Persistence</span>
                  <h4 className="font-bold text-white text-xs">MongoDB / In-Memory</h4>
                  <p className="text-[10px] text-slate-400">Deterministic Fallbacks, Caching Layer</p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-900 p-3 space-y-1 text-slate-300">
                <p className="font-semibold text-white">Production Resilience Guarantee:</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The backend features an automated dual-tier execution pattern: When live external AI API credentials are authenticated, Gemini 3.8 Flash powers semantic NLP; during offline campus assessments or rate limiting, high-fidelity deterministic heuristic algorithms step in without dropped frames or user disruption.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Candidate Profile Editor */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Edit Candidate Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Placement Role</label>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">College / University</label>
                <input
                  type="text"
                  value={profile.college}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Degree & Branch</label>
                <input
                  type="text"
                  value={profile.degree}
                  onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">GitHub Profile Link</label>
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">LinkedIn Profile Link</label>
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Save & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
