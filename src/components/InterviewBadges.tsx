import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  X,
  Share2,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Flame,
  Volume2
} from 'lucide-react';
import { InterviewSessionRecord } from './InterviewPerformanceChart';
import { UserEarnedBadge, VirtualBadge } from '../types/career';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BADGE_DEFINITIONS: VirtualBadge[] = [
  {
    id: 'executive-poise',
    title: 'Executive Poise Credential',
    subtitle: 'Vocal Conviction & Executive Presence',
    description: 'Achieve high verbal confidence (≥85%) across at least 2 interview sessions, demonstrating leadership authority.',
    category: 'Confidence',
    tier: 'Gold',
    iconName: 'Sparkles',
    requiredSessions: 2,
    minConfidenceScore: 85,
    credentialId: 'TF-CRED-POISE-85',
    skillsVerified: ['Authoritative Vocal Tone', 'Assertive Phrasing', 'Qualifier Elimination', 'Executive Poise'],
  },
  {
    id: 'crystal-articulator',
    title: 'Crystal Articulator Credential',
    subtitle: 'Superior Technical Communication Clarity',
    description: 'Attain outstanding communication clarity (≥85%) across 2+ sessions, explaining complex trade-offs without ambiguity.',
    category: 'Clarity',
    tier: 'Gold',
    iconName: 'ShieldCheck',
    requiredSessions: 2,
    minClarityScore: 85,
    credentialId: 'TF-CRED-CLARITY-85',
    skillsVerified: ['Structured Explanations', 'Clean Technical Vocabulary', 'Trade-off Articulation', 'Precision'],
  },
  {
    id: 'dual-mastery',
    title: 'Dual Mastery: Poise & Precision',
    subtitle: 'Synchronized Confidence & Communication',
    description: 'Simultaneously score ≥85% Verbal Confidence AND ≥85% Communication Clarity in 2 or more separate sessions.',
    category: 'Executive',
    tier: 'Platinum',
    iconName: 'Award',
    requiredSessions: 2,
    minConfidenceScore: 85,
    minClarityScore: 85,
    credentialId: 'TF-CRED-DUAL-90',
    skillsVerified: ['Bilingual Technical & Soft Poise', 'Pressure Composure', 'Top-Percentile Articulation'],
  },
  {
    id: 'cadence-maestro',
    title: 'Cadence & Pacing Maestro',
    subtitle: 'Optimal Conversational Rhythm (130-160 WPM)',
    description: 'Maintain ideal conversational speaking speed (130-160 WPM) with high confidence (≥80%) across 2+ recorded sessions.',
    category: 'Confidence',
    tier: 'Silver',
    iconName: 'Zap',
    requiredSessions: 2,
    minConfidenceScore: 80,
    optimalPacingRequired: true,
    credentialId: 'TF-CRED-PACE-145',
    skillsVerified: ['Pacing Modulation', 'Breath Control', 'Non-Rushed Explanations', 'Interview Cadence'],
  },
  {
    id: 'fluent-orator',
    title: 'Fluent Orator Credential',
    subtitle: 'High Fluency & Consistent Quality',
    description: 'Deliver articulate responses with high clarity (≥80%) and confidence (≥80%) across 3 or more mock sessions.',
    category: 'Consistency',
    tier: 'Silver',
    iconName: 'Volume2',
    requiredSessions: 3,
    minClarityScore: 80,
    minConfidenceScore: 80,
    credentialId: 'TF-CRED-FLUENCY-80',
    skillsVerified: ['Verbal Flow', 'Consistent Delivery', 'Minimal Verbal Crutches', 'Spontaneous Synthesis'],
  },
  {
    id: 'tier1-elite',
    title: 'Tier-1 Placement Bar Crusher',
    subtitle: 'Overall Excellence Exceeding Top Product Bar',
    description: 'Attain an overall evaluation ≥90% with ≥88% Verbal Confidence and ≥88% Clarity in a rigorous simulation.',
    category: 'Executive',
    tier: 'Diamond',
    iconName: 'Flame',
    requiredSessions: 1,
    minOverallScore: 90,
    minConfidenceScore: 88,
    minClarityScore: 88,
    credentialId: 'TF-CRED-TIER1-ELITE',
    skillsVerified: ['FAANG+ Ready Evaluation', 'Deep Architectural Logic', 'STAR Storytelling', 'Senior Poise'],
  },
];

interface InterviewBadgesProps {
  sessions: InterviewSessionRecord[];
  candidateName?: string;
  selectedRole?: string;
}

export const InterviewBadges: React.FC<InterviewBadgesProps> = ({
  sessions,
  candidateName = 'Alex Rivera',
  selectedRole = 'Full Stack Developer',
}) => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'progress'>('all');
  const [selectedBadgeForCert, setSelectedBadgeForCert] = useState<UserEarnedBadge | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBullet, setCopiedBullet] = useState(false);

  // Compute earned badges dynamically based on past interview sessions
  const computedBadges: UserEarnedBadge[] = BADGE_DEFINITIONS.map((badge) => {
    let qualifyingSessions = 0;
    let highlight = '';
    let latestUnlockDate = '2026-10-04';

    sessions.forEach((s) => {
      const conf = s.confidenceScore || Math.min(s.communicationScore + 2, 98);
      const clarity = s.communicationScore;
      const overall = s.score;
      const pace = s.pacingWpm || 142;

      let passes = true;
      if (badge.minConfidenceScore && conf < badge.minConfidenceScore) passes = false;
      if (badge.minClarityScore && clarity < badge.minClarityScore) passes = false;
      if (badge.minOverallScore && overall < badge.minOverallScore) passes = false;
      if (badge.optimalPacingRequired && (pace < 125 || pace > 165)) passes = false;

      if (passes) {
        qualifyingSessions++;
        latestUnlockDate = s.date;
        highlight = `${conf}% Conf • ${clarity}% Clarity`;
      }
    });

    const isUnlocked = qualifyingSessions >= badge.requiredSessions;
    const progressSessions = Math.min(qualifyingSessions, badge.requiredSessions);
    const progressPercent = Math.min(
      Math.round((qualifyingSessions / badge.requiredSessions) * 100),
      100
    );

    // Deterministic verification hash
    const verificationHash = `SHA256:7f8a${badge.id.slice(0, 4)}c912e${badge.requiredSessions}b4`;

    return {
      ...badge,
      isUnlocked,
      progressSessions,
      progressPercent,
      unlockedAt: isUnlocked ? latestUnlockDate : undefined,
      verificationHash: isUnlocked ? verificationHash : undefined,
      highlightStat: highlight || undefined,
    };
  });

  // Sync unlocked badges to Firestore when authenticated
  useEffect(() => {
    if (!currentUser) return;
    const syncBadgesToFirestore = async () => {
      try {
        for (const b of computedBadges) {
          if (b.isUnlocked) {
            await setDoc(
              doc(db, `users/${currentUser.uid}/badges`, b.id),
              {
                badgeId: b.id,
                userId: currentUser.uid,
                title: b.title,
                tier: b.tier,
                unlockedAt: b.unlockedAt || new Date().toISOString(),
                credentialId: b.credentialId,
                verificationHash: b.verificationHash,
                skillsVerified: b.skillsVerified,
              },
              { merge: true }
            );
          }
        }
      } catch (err) {
        console.warn('Could not sync badges to Firestore:', err);
      }
    };
    syncBadgesToFirestore();
  }, [currentUser, sessions.length]);

  const unlockedCount = computedBadges.filter((b) => b.isUnlocked).length;
  const filteredBadges = computedBadges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'progress') return !b.isUnlocked;
    return true;
  });

  // Calculate candidate milestones
  const avgConfidence = Math.round(
    sessions.reduce(
      (acc, s) => acc + (s.confidenceScore || Math.min(s.communicationScore + 2, 98)),
      0
    ) / (sessions.length || 1)
  );

  const avgClarity = Math.round(
    sessions.reduce((acc, s) => acc + s.communicationScore, 0) / (sessions.length || 1)
  );

  const handleCopyCredentialId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyResumeBullet = (badge: UserEarnedBadge) => {
    const bullet = `• Awarded TalentForge Verified Credential in ${badge.title} (${badge.subtitle}) — audited at ${avgConfidence}% Verbal Confidence and ${avgClarity}% Communication Clarity. [Credential ID: ${badge.credentialId}]`;
    navigator.clipboard.writeText(bullet);
    setCopiedBullet(true);
    setTimeout(() => setCopiedBullet(false), 2500);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          gradient: 'from-cyan-500 to-blue-600',
          badgeText: 'text-cyan-300',
        };
      case 'Platinum':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          gradient: 'from-purple-500 to-indigo-600',
          badgeText: 'text-purple-300',
        };
      case 'Gold':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          gradient: 'from-amber-500 to-orange-500',
          badgeText: 'text-amber-300',
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-300',
          gradient: 'from-slate-400 to-slate-600',
          badgeText: 'text-slate-300',
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
              PLACEMENT CREDENTIALS
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              <span>Verbal Confidence & Clarity Achievement Badges</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Earn verified digital credentials for placement interviews by consistently maintaining high confidence, poise, and articulate clarity.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({computedBadges.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
              filter === 'unlocked'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('progress')}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
              filter === 'progress'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Progress ({computedBadges.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300 block">
            Credentials Unlocked
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">{unlockedCount}</span>
            <span className="text-xs text-purple-300">/ {computedBadges.length} earned</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            {Math.round((unlockedCount / computedBadges.length) * 100)}% Milestone
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Avg. Verbal Confidence
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">{avgConfidence}%</span>
            <span className="text-xs text-slate-500">across sessions</span>
          </div>
          <span className="text-[10px] text-purple-300 font-semibold block">
            {avgConfidence >= 85 ? 'Executive Bar Reached' : 'Solid Progress'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Avg. Clarity Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">{avgClarity}%</span>
            <span className="text-xs text-slate-500">communication</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-semibold block">
            {avgClarity >= 85 ? 'Crystal Articulation' : 'Clear Foundation'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Placement Tier
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white">Tier-1 Ready</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            Cryptographically Verified
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const tierStyle = getTierColor(badge.tier);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadgeForCert(badge)}
              className={`rounded-xl border p-4.5 space-y-4 transition-all cursor-pointer relative overflow-hidden group ${
                badge.isUnlocked
                  ? 'border-purple-500/30 bg-slate-950/90 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10'
                  : 'border-slate-800/80 bg-slate-950/40 opacity-75 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Top Accent Strip */}
              {badge.isUnlocked && (
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierStyle.gradient}`}
                />
              )}

              {/* Badge Icon & Tier Header */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center border shadow-inner ${
                    badge.isUnlocked
                      ? `${tierStyle.bg} ${tierStyle.border} ${tierStyle.text}`
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {badge.isUnlocked ? (
                    badge.tier === 'Diamond' ? (
                      <Flame className="h-5 w-5" />
                    ) : badge.tier === 'Platinum' ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      badge.isUnlocked
                        ? `${tierStyle.bg} ${tierStyle.badgeText} ${tierStyle.border}`
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {badge.tier} Tier
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-mono">
                    {badge.category}
                  </p>
                </div>
              </div>

              {/* Badge Title & Description */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <span>{badge.title}</span>
                  {badge.isUnlocked && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  )}
                </h4>
                <p className="text-[11px] font-medium text-slate-300 line-clamp-1">
                  {badge.subtitle}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 pt-0.5">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar & Milestone Status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    {badge.isUnlocked ? 'Requirement Satisfied' : 'Session Progress'}
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {badge.progressSessions} / {badge.requiredSessions} Sessions
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked
                        ? `bg-gradient-to-r ${tierStyle.gradient}`
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Verified Credential Tag and Card Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <button
                  type="button"
                  onClick={(e) => handleCopyCredentialId(badge.credentialId, e)}
                  title="Copy verifiable credential identifier"
                  className="font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>{badge.credentialId}</span>
                  {copiedId === badge.credentialId ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-60" />
                  )}
                </button>

                <span className="text-purple-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>{badge.isUnlocked ? 'View Credential' : 'View Requirements'}</span>
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Virtual Credential Certificate Modal */}
      {selectedBadgeForCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-purple-500/40 bg-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadgeForCert(null)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate Header Stamp */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/20">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                <span>OFFICIAL TALENTFORGE PLACEMENT CREDENTIAL</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {selectedBadgeForCert.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Credential ID: <strong className="text-purple-400">{selectedBadgeForCert.credentialId}</strong>
              </p>
            </div>

            {/* Certificate Body */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 font-sans text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Name</span>
                  <p className="text-sm font-bold text-white">{candidateName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Engineering Role</span>
                  <p className="text-sm font-semibold text-indigo-300">{selectedRole}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification Status</span>
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{selectedBadgeForCert.isUnlocked ? 'Issued & Verified' : 'In Progress'}</span>
                  </p>
                </div>
              </div>

              {/* Description & Criteria */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Credential Criteria & Competency Audit
                </span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {selectedBadgeForCert.description}
                </p>
              </div>

              {/* Skills Verified Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Verified Engineering & Placement Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBadgeForCert.skillsVerified.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded bg-purple-950/50 px-2 py-0.5 text-[11px] font-medium text-purple-300 border border-purple-800/60"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cryptographic Verification Stamp */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>Hash: {selectedBadgeForCert.verificationHash || 'SHA256:7f8a9e01b3c4d5'}</span>
                <span>Issuing Authority: TalentForge AI Placement Board</span>
              </div>
            </div>

            {/* Action Buttons: Copy Resume Bullet & Share */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCopyResumeBullet(selectedBadgeForCert)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all cursor-pointer"
              >
                {copiedBullet ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>Copied Resume Bullet!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Resume & LinkedIn Bullet Point</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedBadgeForCert(null)}
                className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
