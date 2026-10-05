import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ResumeReviewer } from './components/ResumeReviewer';
import { AtsAnalyzer } from './components/AtsAnalyzer';
import { MockInterview } from './components/MockInterview';
import { CareerRoadmap } from './components/CareerRoadmap';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { JobRecommendations } from './components/JobRecommendations';
import { CyberIncidentPortal } from './components/CyberIncidentPortal';
import { AiShoppingAssistant } from './components/AiShoppingAssistant';
import { PlacementKitModal } from './components/PlacementKitModal';
import { CareerChatbot } from './components/CareerChatbot';
import { SearchGroundingPanel } from './components/SearchGroundingPanel';
import { LiveVoiceInterview } from './components/LiveVoiceInterview';
import { useAuth } from './context/AuthContext';
import {
  FileText,
  Search,
  Mic,
  Compass,
  BarChart3,
  Briefcase,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  MessageSquare,
  Radio,
  LogIn
} from 'lucide-react';

export default function App() {
  const { userProfile, setUserProfile, saveProfileToFirestore, currentUser, signInWithGoogle } = useAuth();
  const [activeCapstone, setActiveCapstone] = useState<'career-coach' | 'cyber-portal' | 'shopping-assistant'>('career-coach');
  const [activeTab, setActiveTab] = useState<string>('resume');
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || 'Full Stack Software Engineer');
  const [isPlacementKitOpen, setIsPlacementKitOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCapstone={activeCapstone}
        setActiveCapstone={setActiveCapstone}
        profile={userProfile}
        onOpenPlacementKit={() => setIsPlacementKitOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Flagship Capstone: AI Career Coach Platform */}
        {activeCapstone === 'career-coach' && (
          <div className="space-y-6">
            {/* Quick Feature Jump Navigation Bar for Desktop / Tablet */}
            <div className="hidden sm:grid grid-cols-8 gap-2 rounded-xl bg-slate-900/60 p-2 border border-slate-800/80">
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'resume'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Resume Review</span>
              </button>

              <button
                onClick={() => setActiveTab('ats')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'ats'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>ATS Audit</span>
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'interview'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Mock Interview</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Gemini Chatbot</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'search'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Live Search</span>
              </button>

              <button
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'roadmap'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Roadmap</span>
              </button>

              <button
                onClick={() => setActiveTab('skill-gap')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'skill-gap'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Skill Gap</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-semibold transition-all ${
                  activeTab === 'jobs'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Jobs & Tracker</span>
              </button>
            </div>

            {/* Active Sub-Module View */}
            {activeTab === 'resume' && (
              <ResumeReviewer
                targetRole={targetRole}
                setTargetRole={setTargetRole}
              />
            )}
            {activeTab === 'ats' && <AtsAnalyzer />}
            {activeTab === 'interview' && <MockInterview />}
            {activeTab === 'chat' && <CareerChatbot />}
            {activeTab === 'search' && <SearchGroundingPanel />}
            {activeTab === 'roadmap' && <CareerRoadmap />}
            {activeTab === 'skill-gap' && <SkillGapAnalyzer />}
            {activeTab === 'jobs' && <JobRecommendations />}
          </div>
        )}

        {/* Capstone Project 1 Showcase: Cyber Incident Reporting Portal */}
        {activeCapstone === 'cyber-portal' && <CyberIncidentPortal />}

        {/* Capstone Project 3 Showcase: AI Shopping Assistant Platform */}
        {activeCapstone === 'shopping-assistant' && <AiShoppingAssistant />}
      </main>

      {/* Live Voice API Conversation Modal (gemini-3.8-live) */}
      <LiveVoiceInterview
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      {/* Placement Kit & Pitch Modal */}
      <PlacementKitModal
        isOpen={isPlacementKitOpen}
        onClose={() => setIsPlacementKitOpen(false)}
        profile={userProfile}
        setProfile={setUserProfile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-300">TalentForge AI</span>
            <span>•</span>
            <span>Placement Suite & Capstone Hub</span>
            <span>•</span>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-400 border border-indigo-500/20 font-mono">
              Firebase Auth & Firestore • Gemini 3.8 Live • Gemini 3.5 Flash Search • Gemini 3.5 Transcribe
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="hover:text-rose-400 transition-colors flex items-center gap-1 font-semibold text-rose-400"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>gemini-3.8-live</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPlacementKitOpen(true)}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>Interview Pitch Script</span>
            </button>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
