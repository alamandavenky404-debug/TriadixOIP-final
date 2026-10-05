/**
 * Types & Schemas for AI Career Coach Platform & Placement Capstones
 */

export interface ResumeReviewResult {
  overallScore: number;
  summaryFeedback: string;
  formattingGrade: string;
  quantifiedImpactScore: number;
  toneAndClarityScore: number;
  strengths: string[];
  criticalFixes: string[];
  sections: {
    name: string;
    score: number;
    status: 'good' | 'warning' | 'needs-work';
    suggestions: string[];
  }[];
  bulletRewrites: {
    original: string;
    improved: string;
    reason: string;
    metricsAdded: string;
  }[];
}

export interface AtsAnalysisResult {
  matchScore: number;
  targetRole: string;
  summary: string;
  matchedKeywords: {
    keyword: string;
    category: string;
    count: number;
  }[];
  missingKeywords: {
    keyword: string;
    importance: 'high' | 'medium' | 'low';
    reason: string;
  }[];
  formatIssues: {
    issue: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }[];
  sectionPasses: {
    section: string;
    status: 'pass' | 'warning' | 'fail';
    detail: string;
  }[];
}

export interface InterviewQuestion {
  id: string;
  role: string;
  type: 'technical' | 'system_design' | 'behavioral' | 'problem_solving';
  difficulty: 'Junior' | 'Mid' | 'Senior';
  question: string;
  hints: string[];
  keyFocusAreas: string[];
  sampleAnswerOutline: string;
}

export interface VerbalToneAnalysis {
  confidenceScore: number;
  confidenceLevel: 'High / Executive' | 'Solid / Assured' | 'Hesitant / Cautious' | 'Needs Practice';
  pacingWpm: number;
  pacingVerdict: 'Optimal Pace (130-160 WPM)' | 'Slightly Rushed (>160 WPM)' | 'Too Deliberate (<110 WPM)';
  professionalismScore: number;
  sentimentTone: 'Constructive & Analytical' | 'Enthusiastic & Collaborative' | 'Defensive / Uncertain' | 'Passive';
  fillerWordDensity: 'Low (<2%)' | 'Moderate (2-5%)' | 'High (>5%)';
  detectedFillerWords: string[];
  toneFeedback: string;
  confidenceKeyTakeaway: string;
}

export interface InterviewEvaluationResult {
  score: number;
  communicationScore: number;
  technicalAccuracyScore: number;
  starMethodScore: number;
  positiveHighlights: string[];
  improvements: string[];
  idealModelAnswer: string;
  quickSummary: string;
  toneAnalysis?: VerbalToneAnalysis;
}

export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
export type BadgeCategory = 'Confidence' | 'Clarity' | 'Consistency' | 'Executive';

export interface VirtualBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: string;
  requiredSessions: number;
  minConfidenceScore?: number;
  minClarityScore?: number;
  minOverallScore?: number;
  optimalPacingRequired?: boolean;
  credentialId: string;
  skillsVerified: string[];
}

export interface UserEarnedBadge extends VirtualBadge {
  isUnlocked: boolean;
  progressSessions: number;
  progressPercent: number;
  unlockedAt?: string;
  verificationHash?: string;
  highlightStat?: string;
}

export interface CareerRoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  focusGoal: string;
  topics: string[];
  handsOnProject: {
    title: string;
    description: string;
    techStack: string[];
  };
  milestoneQuiz: string[];
}

export interface CareerRoadmapResult {
  role: string;
  durationWeeks: number;
  currentLevel: string;
  targetCompanyTier: string;
  phases: CareerRoadmapPhase[];
  recommendedCertifications: string[];
  topCompaniesHiring: string[];
  interviewFocus: string;
}

export interface SkillGapItem {
  skill: string;
  gapLevel: number; // 0 to 100
  priority: 'Critical' | 'Important' | 'Nice to have';
  estimatedHoursToLearn: number;
  bestResource: string;
}

export interface SkillGapResult {
  targetRole: string;
  readinessPercentage: number;
  userSkills: { skill: string; proficiency: number }[];
  requiredSkills: { skill: string; requiredLevel: number; priority: 'Critical' | 'Important' | 'Nice to have' }[];
  gapSkills: SkillGapItem[];
  recommendedNextProject: string;
  actionPlan: string[];
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote' | 'Hybrid';
  salary: string;
  matchScore: number;
  requiredSkills: string[];
  matchedSkills: string[];
  description: string;
  applyLink: string;
  applicationStatus?: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  notes?: string;
  appliedDate?: string;
}

export interface CandidateProfile {
  name: string;
  targetRole: string;
  degree: string;
  college: string;
  graduationYear: string;
  experienceLevel: string;
  github: string;
  linkedin: string;
  portfolio: string;
  currentSkills: string[];
}

export interface CyberIncident {
  id: string;
  title: string;
  severity: 'P1-Critical' | 'P2-High' | 'P3-Medium' | 'P4-Low';
  status: 'Reported' | 'Triaging' | 'Containment' | 'Eradicated' | 'Closed';
  category: 'Phishing' | 'Ransomware' | 'Data Breach' | 'DDoS' | 'Unauthorized Access' | 'Malware';
  reporter: string;
  timestamp: string;
  affectedSystems: string[];
  description: string;
  evidenceFiles: { name: string; size: string; hash: string; type: string }[];
  iocs: string[];
  responseActionPlan: string[];
}

export interface ShoppingProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  description: string;
  specs: string[];
  inStock: boolean;
}
