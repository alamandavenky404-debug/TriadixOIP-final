import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Plus,
  X,
  Target,
  Clock,
  Layers,
  Zap
} from 'lucide-react';
import { SkillGapResult } from '../types/career';
import { analyzeSkillGapApi } from '../services/api';

const POPULAR_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'Tailwind CSS',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Git',
  'REST APIs',
  'GraphQL',
  'Jest / Vitest',
  'Python',
  'Linux',
  'AWS',
  'System Design'
];

export const SkillGapAnalyzer: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [userSkills, setUserSkills] = useState<string[]>([
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express',
    'Tailwind CSS',
    'MongoDB',
    'Git',
    'REST APIs'
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [gapResult, setGapResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRunAnalysis();
  }, []);

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const data = await analyzeSkillGapApi(targetRole, userSkills);
      setGapResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (userSkills.includes(skill)) {
      setUserSkills(userSkills.filter((s) => s !== skill));
    } else {
      setUserSkills([...userSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    if (!userSkills.includes(customSkillInput.trim())) {
      setUserSkills([...userSkills, customSkillInput.trim()]);
    }
    setCustomSkillInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Skill Matrix Diagnostics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Skill Gap & Readiness Analysis
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Benchmark your current technical abilities against industry hiring requirements for your target placement role. Identifies high-leverage skill gaps, learning hours, and bridge projects.
            </p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Benchmarking Skills...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Calculate Skill Gap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Role & Skill Selector */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Target Role Benchmark
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, SDE-1, Cyber Defense Analyst"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Custom Skill Input */}
          <form onSubmit={addCustomSkill} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Next.js)..."
              className="rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 border border-slate-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Skill Badges Cloud */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Click to toggle your current skills ({userSkills.length} selected):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((skill) => {
              const isSelected = userSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {gapResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Readiness Meter & Comparison Bars */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    Role Match & Readiness
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white">{gapResult.readinessPercentage}%</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        gapResult.readinessPercentage >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : gapResult.readinessPercentage >= 65
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {gapResult.readinessPercentage >= 80 ? 'Placement Ready' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Target Role</span>
                  <p className="text-xs font-bold text-slate-200">{gapResult.targetRole}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${gapResult.readinessPercentage}%` }}
                />
              </div>

              {/* Skill Proficiency Comparison Bars */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Industry Demand vs Your Current Level
                </span>

                <div className="space-y-2.5">
                  {gapResult.requiredSkills.map((req, idx) => {
                    const userSkill = gapResult.userSkills.find((u) => u.skill === req.skill);
                    const userProf = userSkill ? userSkill.proficiency : 25;
                    const hasGap = userProf < req.requiredLevel;

                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{req.skill}</span>
                          <span className="text-[11px] font-mono text-slate-400">
                            You: <strong className={hasGap ? 'text-amber-400' : 'text-emerald-400'}>{userProf}%</strong> / Target: {req.requiredLevel}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              hasGap ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${userProf}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommended Next Bridge Project */}
            {gapResult.recommendedNextProject && (
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-slate-900 p-4 space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Zap className="h-4 w-4 text-indigo-400" />
                  Recommended Fast-Track Project
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {gapResult.recommendedNextProject}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Prioritized Gaps & Action Plan */}
          <div className="lg:col-span-6 space-y-4">
            {/* Prioritized Gaps Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Priority Skills to Bridge ({gapResult.gapSkills.length})
              </span>

              <div className="space-y-2.5">
                {gapResult.gapSkills.map((gap, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{gap.skill}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase ${
                            gap.priority === 'Critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>~{gap.estimatedHoursToLearn} hrs</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-300">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="line-clamp-1">{gap.bestResource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Action Plan */}
            {gapResult.actionPlan && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  3-Step Action Plan
                </span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {gapResult.actionPlan.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
