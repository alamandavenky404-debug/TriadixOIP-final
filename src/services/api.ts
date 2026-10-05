import {
  AtsAnalysisResult,
  CareerRoadmapResult,
  InterviewEvaluationResult,
  InterviewQuestion,
  ResumeReviewResult,
  SkillGapResult,
} from '../types/career';

export async function reviewResumeApi(resumeText: string, targetRole: string): Promise<ResumeReviewResult> {
  const response = await fetch('/api/career/resume-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, targetRole }),
  });
  if (!response.ok) {
    throw new Error(`Resume review failed with status: ${response.status}`);
  }
  return response.json();
}

export async function analyzeAtsApi(resumeText: string, targetRole: string, jobDescription?: string): Promise<AtsAnalysisResult> {
  const response = await fetch('/api/career/ats-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, targetRole, jobDescription }),
  });
  if (!response.ok) {
    throw new Error(`ATS analysis failed with status: ${response.status}`);
  }
  return response.json();
}

export async function generateInterviewQuestionApi(
  role: string,
  difficulty: string,
  type: string,
  previousQuestions: string[] = []
): Promise<InterviewQuestion> {
  const response = await fetch('/api/career/interview-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, difficulty, type, previousQuestions }),
  });
  if (!response.ok) {
    throw new Error(`Question generation failed with status: ${response.status}`);
  }
  return response.json();
}

export async function evaluateInterviewAnswerApi(
  role: string,
  question: string,
  answer: string,
  difficulty: string,
  audioDurationSeconds?: number
): Promise<InterviewEvaluationResult> {
  const response = await fetch('/api/career/interview-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, question, answer, difficulty, audioDurationSeconds }),
  });
  if (!response.ok) {
    throw new Error(`Answer evaluation failed with status: ${response.status}`);
  }
  return response.json();
}

export async function generateRoadmapApi(
  role: string,
  currentLevel: string,
  durationWeeks: number,
  targetCompanyTier: string
): Promise<CareerRoadmapResult> {
  const response = await fetch('/api/career/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, currentLevel, durationWeeks, targetCompanyTier }),
  });
  if (!response.ok) {
    throw new Error(`Roadmap generation failed with status: ${response.status}`);
  }
  return response.json();
}

export async function analyzeSkillGapApi(targetRole: string, userSkills: string[]): Promise<SkillGapResult> {
  const response = await fetch('/api/career/skill-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetRole, userSkills }),
  });
  if (!response.ok) {
    throw new Error(`Skill gap analysis failed with status: ${response.status}`);
  }
  return response.json();
}

export async function generateCoverLetterApi(params: {
  candidateName: string;
  targetRole: string;
  company: string;
  jobDescription: string;
  keyHighlights: string;
}): Promise<{ coverLetter: string; coldEmail: string; elevatorPitch: string }> {
  const response = await fetch('/api/career/cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error(`Cover letter generation failed with status: ${response.status}`);
  }
  return response.json();
}

// 1. Google Search Grounding with gemini-3.5-flash
export async function searchMarketGroundingApi(
  query: string,
  role?: string,
  region?: string
): Promise<{ summary: string; sources: { title: string; url: string }[] }> {
  const response = await fetch('/api/career/live-market-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, role, region }),
  });
  if (!response.ok) {
    throw new Error(`Live market search failed with status: ${response.status}`);
  }
  return response.json();
}

// 2. Audio Transcription with gemini-3.5-transcribe
export async function transcribeAudioApi(
  audioBase64: string,
  mimeType: string = 'audio/webm'
): Promise<{ transcript: string }> {
  const response = await fetch('/api/career/transcribe-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  });
  if (!response.ok) {
    throw new Error(`Audio transcription failed with status: ${response.status}`);
  }
  return response.json();
}

// 3. Multi-Turn Gemini Career Chat
export async function sendChatMessageApi(
  messages: { role: string; content: string }[],
  rolePersona: string = 'career-coach',
  modelType: string = 'gemini-3.5-flash'
): Promise<{ reply: string; modelUsed: string }> {
  const response = await fetch('/api/career/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, rolePersona, modelType }),
  });
  if (!response.ok) {
    throw new Error(`Chat API failed with status: ${response.status}`);
  }
  return response.json();
}
