import React from 'react';
import {
  Briefcase,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  GraduationCap,
  Radio,
  MessageSquare,
  Globe,
  LogIn,
  LogOut
} from 'lucide-react';
import { CandidateProfile } from '../types/career';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCapstone: 'career-coach' | 'cyber-portal' | 'shopping-assistant';
  setActiveCapstone: (capstone: 'career-coach' | 'cyber-portal' | 'shopping-assistant') => void;
  profile: CandidateProfile;
  onOpenPlacementKit: () => void;
  onOpenLiveVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeCapstone,
  setActiveCapstone,
  profile,
  onOpenPlacementKit,
  onOpenLiveVoice,
}) => {
  const { currentUser, signInWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top Capstone Showcase Switcher Banner */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">Placement Capstone Showcase:</span>
            <span className="text-slate-400 hidden sm:inline">Select active capstone project to demo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveCapstone('career-coach')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                activeCapstone === 'career-coach'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-indigo-300" />
              <span>#2 AI Career Coach (Flagship)</span>
            </button>

            <button
              onClick={() => setActiveCapstone('cyber-portal')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                activeCapstone === 'cyber-portal'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
              <span>#1 Cyber Incident Portal</span>
            </button>

            <button
              onClick={() => setActiveCapstone('shopping-assistant')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                activeCapstone === 'shopping-assistant'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-amber-300" />
              <span>#3 AI Shopping Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-md shadow-indigo-500/25">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">TalentForge</span>
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-400 border border-indigo-500/20">
                AI PLACEMENT SUITE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {activeCapstone === 'career-coach' && 'Career Coach, ATS Optimizer & Mock Interview Studio'}
              {activeCapstone === 'cyber-portal' && 'Enterprise Incident Reporting & Evidence Vault'}
              {activeCapstone === 'shopping-assistant' && 'Semantic E-Commerce Assistant & Recommendations'}
            </p>
          </div>
        </div>

        {/* Career Coach Navigation Tabs */}
        {activeCapstone === 'career-coach' && (
          <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800/80">
            <button
              onClick={() => setActiveTab('resume')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Resume Review
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'ats'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              ATS Audit
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Mock Interview
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              <span>AI Chatbot</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="h-3 w-3" />
              <span>Live Search</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setActiveTab('skill-gap')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'skill-gap'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Skill Gap
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Jobs & Applied
            </button>
          </nav>
        )}

        {/* Action Buttons: Live Voice + Auth + Placement Kit */}
        <div className="flex items-center gap-2">
          {/* Gemini 3.8 Live API Trigger */}
          <button
            onClick={onOpenLiveVoice}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-all shadow-sm animate-pulse"
            title="Real-time Voice Conversation with Gemini 3.8 Live API"
          >
            <Radio className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden sm:inline">Live Voice AI</span>
          </button>

          <button
            onClick={onOpenPlacementKit}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold hidden sm:inline">Placement Kit</span>
          </button>

          {/* Firebase Authentication / User Status */}
          {currentUser ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 pl-2 pr-1 py-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white overflow-hidden">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || ''} className="h-full w-full object-cover" />
                ) : (
                  (currentUser.displayName || profile.name).charAt(0)
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {currentUser.displayName || profile.name}
                </p>
                <p className="text-[10px] text-emerald-400 leading-tight font-mono">Firebase Synced</p>
              </div>
              <button
                onClick={logout}
                title="Sign out of Firebase"
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Google Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Nav for Career Coach */}
      {activeCapstone === 'career-coach' && (
        <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/60 px-4 py-2 gap-1.5 scrollbar-none">
          {[
            { id: 'resume', label: 'Resume' },
            { id: 'ats', label: 'ATS' },
            { id: 'interview', label: 'Mock Interview' },
            { id: 'chat', label: 'AI Chat' },
            { id: 'search', label: 'Live Search' },
            { id: 'roadmap', label: 'Roadmap' },
            { id: 'skill-gap', label: 'Skill Gap' },
            { id: 'jobs', label: 'Jobs' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
