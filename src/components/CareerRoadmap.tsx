import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Building,
  Target,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CareerRoadmapResult } from '../types/career';
import { generateRoadmapApi } from '../services/api';

export const CareerRoadmap: React.FC = () => {
  const [role, setRole] = useState('Full Stack Developer');
  const [level, setLevel] = useState('Beginner / Campus Student');
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [targetCompanyTier, setTargetCompanyTier] = useState('Product Companies & Tier-1 Startups');
  const [roadmap, setRoadmap] = useState<CareerRoadmapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    handleGenerateRoadmap();
  }, []);

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    try {
      const data = await generateRoadmapApi(role, level, durationWeeks, targetCompanyTier);
      setRoadmap(data);
      setActivePhaseIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopicCheck = (topic: string) => {
    setCheckedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Compass className="h-3.5 w-3.5" />
              <span>Campus Placement Strategy</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Career Roadmap & Milestone Generator
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Personalized multi-week preparation roadmap broken into structured milestones. Includes weekly study topics, hands-on capstone build prompts, interview checkpoint quizzes, and hiring company profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Regenerate Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Control Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Target Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Current Stage
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
          >
            <option value="Beginner / Campus Student">Beginner / Campus Student</option>
            <option value="Intermediate / 3rd-4th Year">Intermediate / 3rd-4th Year</option>
            <option value="Placement Season Blitz (Immediate)">Placement Season Blitz (Immediate)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Timeline Duration
          </label>
          <select
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
          >
            <option value={8}>8 Weeks (Intensive)</option>
            <option value={12}>12 Weeks (Recommended)</option>
            <option value={16}>16 Weeks (Comprehensive)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Target Company Tier
          </label>
          <select
            value={targetCompanyTier}
            onChange={(e) => setTargetCompanyTier(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
          >
            <option value="Product Companies & Tier-1 Startups">Product Companies & Tier-1 Startups</option>
            <option value="FAANG / Big Tech Global">FAANG / Big Tech Global</option>
            <option value="Fintech & High-Growth Scaleups">Fintech & High-Growth Scaleups</option>
          </select>
        </div>
      </div>

      {/* Roadmap View */}
      {roadmap && (
        <div className="space-y-6">
          {/* Phase Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {roadmap.phases.map((ph, idx) => {
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`text-left rounded-xl p-4 transition-all border ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 mb-1">
                    <span>Phase {ph.phaseNumber}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {ph.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{ph.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{ph.focusGoal}</p>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive */}
          {roadmap.phases[activePhaseIndex] && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">
                      Phase {roadmap.phases[activePhaseIndex].phaseNumber}: {roadmap.phases[activePhaseIndex].duration}
                    </span>
                    <h2 className="text-xl font-bold text-white">{roadmap.phases[activePhaseIndex].title}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{roadmap.phases[activePhaseIndex].focusGoal}</p>
                </div>
              </div>

              {/* Topics & Project Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Checkable Topics */}
                <div className="lg:col-span-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Essential Learning Modules
                  </h3>
                  <div className="space-y-2">
                    {roadmap.phases[activePhaseIndex].topics.map((t, i) => {
                      const isChecked = !!checkedTopics[t];
                      return (
                        <div
                          key={i}
                          onClick={() => toggleTopicCheck(t)}
                          className={`cursor-pointer rounded-lg border p-3 text-xs transition-all flex items-start gap-3 ${
                            isChecked
                              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                              : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                          />
                          <span className={isChecked ? 'line-through text-slate-400' : ''}>{t}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Hands-on Capstone Project & Verification */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Capstone Card */}
                  <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-slate-950 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                        <FolderGit2 className="h-4 w-4 text-indigo-400" />
                        Phase Portfolio Capstone Project
                      </span>
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                        Resume Star
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {roadmap.phases[activePhaseIndex].handsOnProject.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {roadmap.phases[activePhaseIndex].handsOnProject.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {roadmap.phases[activePhaseIndex].handsOnProject.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestone Quiz */}
                  {roadmap.phases[activePhaseIndex].milestoneQuiz && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4" />
                        Placement Checkpoint Questions
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {roadmap.phases[activePhaseIndex].milestoneQuiz.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Placement Context Cards: Certifications & Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-400" />
                Recommended Certifications
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {roadmap.recommendedCertifications.map((cert, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-emerald-400" />
                Target Hiring Companies
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {roadmap.topCompaniesHiring.map((comp, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200 border border-slate-700/60"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
