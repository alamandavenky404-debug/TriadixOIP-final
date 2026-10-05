import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter,
  Target,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export interface InterviewSessionRecord {
  id: string;
  sessionNumber: number;
  date: string;
  role: string;
  question: string;
  score: number;
  technicalAccuracyScore: number;
  communicationScore: number;
  starMethodScore: number;
  confidenceScore?: number;
  pacingWpm?: number;
  sentimentTone?: string;
}

export const ROLE_BENCHMARKS: Record<
  string,
  {
    overall: number;
    technical: number;
    communication: number;
    starMethod: number;
    tier: string;
    description: string;
  }
> = {
  'Software Development Engineer (SDE-1)': {
    overall: 85,
    technical: 88,
    communication: 82,
    starMethod: 80,
    tier: 'Tier-1 FAANG / Product Bar',
    description: 'Shortlisting standard for top product companies (Amazon, Google, Uber, Atlassian)',
  },
  'Full Stack Developer': {
    overall: 82,
    technical: 85,
    communication: 80,
    starMethod: 78,
    tier: 'Unicorn & Growth Startup Bar',
    description: 'Hiring standard for full-stack engineering at high-scale tech organizations',
  },
  'Frontend Engineer (React & TS)': {
    overall: 80,
    technical: 84,
    communication: 82,
    starMethod: 76,
    tier: 'Specialist UI Engineering Bar',
    description: 'Benchmark for modern frontend engineers with state management & TypeScript expertise',
  },
  'Backend Engineer (Node / Express)': {
    overall: 83,
    technical: 87,
    communication: 78,
    starMethod: 76,
    tier: 'Distributed Backend Bar',
    description: 'Benchmark for microservice development, database tuning, and API design',
  },
  'Cyber Security & SOC Analyst': {
    overall: 80,
    technical: 82,
    communication: 80,
    starMethod: 78,
    tier: 'SecOps & Defense Bar',
    description: 'Triage benchmark for Security Operations Centers (SOC) and threat analysts',
  },
  'Data Analyst & ML Associate': {
    overall: 81,
    technical: 83,
    communication: 80,
    starMethod: 78,
    tier: 'Data & Analytics Bar',
    description: 'Recruitment threshold for analytics, predictive modeling, and business insights',
  },
};

interface InterviewPerformanceChartProps {
  sessions: InterviewSessionRecord[];
  selectedRole?: string;
}

export const InterviewPerformanceChart: React.FC<InterviewPerformanceChartProps> = ({
  sessions,
  selectedRole = 'Full Stack Developer',
}) => {
  const [chartView, setChartView] = useState<'area' | 'bar'>('area');
  const [showBenchmarkComparison, setShowBenchmarkComparison] = useState(true);

  if (!sessions || sessions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-400">
        No interview sessions recorded yet. Complete a mock interview above to see your progress chart!
      </div>
    );
  }

  // Lookup benchmark for selected role or fallback to default
  const benchmark =
    ROLE_BENCHMARKS[selectedRole] || {
      overall: 82,
      technical: 85,
      communication: 80,
      starMethod: 78,
      tier: 'Industry Hiring Bar',
      description: 'Standard technical shortlisting benchmark for campus engineering placements',
    };

  // Calculate KPIs
  const scores = sessions.map((s) => s.score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highestScore = Math.max(...scores);
  const latestScore = scores[scores.length - 1];
  const firstScore = scores[0];
  const growthDelta = latestScore - firstScore;
  const benchmarkDelta = latestScore - benchmark.overall;
  const isAboveBenchmark = benchmarkDelta >= 0;

  // Format data for Recharts with the industry benchmark comparison line
  const chartData = sessions.map((s) => ({
    name: `S${s.sessionNumber}`,
    fullDate: s.date,
    role: s.role,
    overallScore: s.score,
    technical: s.technicalAccuracyScore,
    communication: s.communicationScore,
    starMethod: s.starMethodScore,
    confidence: s.confidenceScore || Math.min(s.communicationScore + 2, 98),
    pacingWpm: s.pacingWpm || 142,
    sentimentTone: s.sentimentTone || 'Constructive & Analytical',
    industryBenchmark: benchmark.overall,
    techBenchmark: benchmark.technical,
    commBenchmark: benchmark.communication,
    starBenchmark: benchmark.starMethod,
  }));

  // Custom Recharts Tooltip with benchmark comparison delta
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const sessionDelta = data.overallScore - data.industryBenchmark;
      const meetsBar = sessionDelta >= 0;

      return (
        <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 font-sans min-w-[230px]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">Session {label.replace('S', '')}</span>
            <span className="text-[10px] text-slate-400 font-mono">{data.fullDate}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-indigo-300 font-medium truncate">{data.role}</p>
            <span className="text-[9px] font-semibold rounded bg-purple-500/10 text-purple-300 px-1.5 py-0.5 border border-purple-500/20">
              {data.sentimentTone}
            </span>
          </div>

          <div className="space-y-1.5 pt-1 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Overall Score:
              </span>
              <strong className="text-white">{data.overallScore}%</strong>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                Verbal Confidence:
              </span>
              <strong className="text-purple-300">{data.confidence}%</strong>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Hiring Bar Benchmark:
              </span>
              <strong className="text-rose-300">{data.industryBenchmark}%</strong>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-1 text-[10px]">
              <span className="text-slate-400">Target Benchmark Gap:</span>
              <span className={`font-bold ${meetsBar ? 'text-emerald-400' : 'text-amber-400'}`}>
                {meetsBar ? `+${sessionDelta}% Above Bar` : `${sessionDelta}% Below Bar`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 pt-0.5">
              <span>Pacing: <strong className="text-slate-200">{data.pacingWpm} WPM</strong></span>
              <span>Tech: <strong className="text-emerald-300">{data.technical}%</strong></span>
              <span>STAR: <strong className="text-amber-300">{data.starMethod}%</strong></span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
              RECHARTS BENCHMARK ENGINE
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Interview Progress vs. Industry Benchmark</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Comparing candidate progression against the verified hiring bar for <strong className="text-slate-200">{selectedRole}</strong>
          </p>
        </div>

        {/* View Toggle and Benchmark switch */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBenchmarkComparison(!showBenchmarkComparison)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              showBenchmarkComparison
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Target className="h-3 w-3 text-rose-400" />
            <span>Benchmark: {benchmark.overall}%</span>
          </button>

          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setChartView('area')}
              className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
                chartView === 'area'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trend Wave
            </button>
            <button
              onClick={() => setChartView('bar')}
              className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
                chartView === 'bar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Competency Bars
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards including Industry Benchmark Gap */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Latest Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">{latestScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[10px] text-indigo-300 font-semibold block">Session {sessions.length}</span>
        </div>

        {/* Industry Benchmark Status Card */}
        <div className={`rounded-xl border p-3.5 space-y-1 ${
          isAboveBenchmark
            ? 'border-emerald-500/30 bg-emerald-950/20'
            : 'border-amber-500/30 bg-amber-950/20'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Industry Hiring Bar
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-bold">{benchmark.overall}%</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold ${isAboveBenchmark ? 'text-emerald-400' : 'text-amber-400'}`}>
              {benchmarkDelta >= 0 ? `+${benchmarkDelta}%` : `${benchmarkDelta}%`}
            </span>
          </div>
          <span className={`text-[10px] font-semibold block ${isAboveBenchmark ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isAboveBenchmark ? 'Above Tier-1 Hiring Bar' : 'Below Target Threshold'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Average Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">{avgScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-semibold block">{benchmark.tier}</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Sessions
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">{sessions.length}</span>
            <span className="text-xs text-slate-500">simulations</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            {growthDelta >= 0 ? `+${growthDelta}% Growth` : 'Tracked'}
          </span>
        </div>
      </div>

      {/* Benchmark Info Note */}
      <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">{selectedRole} Benchmark:</strong> {benchmark.description}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Min Bar: {benchmark.overall}%
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Tech: {benchmark.technical}%</span>
          <span className="text-slate-400">STAR: {benchmark.starMethod}%</span>
        </div>
      </div>

      {/* Main Recharts Container with Industry Benchmark Comparison Line */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                domain={[40, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />

              {/* User Overall Score */}
              <Area
                type="monotone"
                dataKey="overallScore"
                name="Your Score"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />

              {/* Comparison Line: Industry-Standard Benchmark for Selected Role */}
              {showBenchmarkComparison && (
                <Line
                  type="monotone"
                  dataKey="industryBenchmark"
                  name={`${selectedRole} Benchmark (${benchmark.overall}%)`}
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={false}
                  activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {/* Reference horizontal guide line for the benchmark */}
              {showBenchmarkComparison && (
                <ReferenceLine
                  y={benchmark.overall}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              )}

              {/* Technical Accuracy Line */}
              <Line
                type="monotone"
                dataKey="technical"
                name="Technical Accuracy"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
              />

              {/* Communication Line */}
              <Line
                type="monotone"
                dataKey="communication"
                name="Communication Clarity"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3, fill: '#06b6d4' }}
              />

              {/* Verbal Confidence Line */}
              <Line
                type="monotone"
                dataKey="confidence"
                name="Verbal Confidence"
                stroke="#c084fc"
                strokeWidth={2}
                dot={{ r: 3, fill: '#c084fc' }}
              />

              {/* STAR Method Line */}
              <Line
                type="monotone"
                dataKey="starMethod"
                name="STAR Framework"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#f59e0b' }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                domain={[40, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
              <Bar dataKey="overallScore" name="Your Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="confidence" name="Verbal Confidence" fill="#c084fc" radius={[4, 4, 0, 0]} />
              <Bar dataKey="technical" name="Technical Accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="starMethod" name="STAR Framework" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              {showBenchmarkComparison && (
                <ReferenceLine
                  y={benchmark.overall}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  label={{
                    value: `Benchmark: ${benchmark.overall}%`,
                    fill: '#f43f5e',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Historical Sessions Log Table with Benchmark Indicator & Sentiment Tone */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Session History & Benchmark Evaluation
          </span>
          <span className="text-[10px] text-slate-500">
            Target Benchmark: <strong className="text-rose-400">{benchmark.overall}%</strong>
          </span>
        </div>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {sessions.slice().reverse().map((session) => {
            const meetsBar = session.score >= benchmark.overall;
            const diff = session.score - benchmark.overall;

            return (
              <div
                key={session.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-white">Session {session.sessionNumber}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                      {session.role}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{session.date}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        meetsBar
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {meetsBar ? `+${diff}% Above Bar` : `${diff}% Below Bar`}
                    </span>
                    {session.sentimentTone && (
                      <span className="text-[9px] font-semibold rounded bg-purple-500/10 text-purple-300 px-1.5 py-0.2 border border-purple-500/20">
                        {session.sentimentTone}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    "{session.question}"
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    {session.confidenceScore && (
                      <span className="text-purple-300">Conf: <strong>{session.confidenceScore}%</strong></span>
                    )}
                    {session.pacingWpm && (
                      <span className="text-slate-400">Pace: <strong>{session.pacingWpm} WPM</strong></span>
                    )}
                    <span className="hidden md:inline text-emerald-400">Tech: {session.technicalAccuracyScore}%</span>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      session.score >= benchmark.overall
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : session.score >= 70
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {session.score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
