import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Send,
  MessageSquare,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { InterviewEvaluationResult, InterviewQuestion } from '../types/career';
import { evaluateInterviewAnswerApi, generateInterviewQuestionApi, transcribeAudioApi } from '../services/api';
import { InterviewPerformanceChart, InterviewSessionRecord } from './InterviewPerformanceChart';
import { InterviewBadges } from './InterviewBadges';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

const INITIAL_SESSIONS: InterviewSessionRecord[] = [
  {
    id: 's-1',
    sessionNumber: 1,
    date: '2026-09-24',
    role: 'Full Stack Developer',
    question: 'How do keys prevent unnecessary DOM re-renders in dynamic lists?',
    score: 68,
    technicalAccuracyScore: 70,
    communicationScore: 65,
    starMethodScore: 62,
    confidenceScore: 66,
    pacingWpm: 122,
    sentimentTone: 'Hesitant / Cautious',
  },
  {
    id: 's-2',
    sessionNumber: 2,
    date: '2026-09-27',
    role: 'Software Development Engineer (SDE-1)',
    question: 'Explain Token Bucket vs Sliding Window rate limiting algorithms.',
    score: 75,
    technicalAccuracyScore: 76,
    communicationScore: 74,
    starMethodScore: 71,
    confidenceScore: 75,
    pacingWpm: 135,
    sentimentTone: 'Passive',
  },
  {
    id: 's-3',
    sessionNumber: 3,
    date: '2026-09-30',
    role: 'Frontend Engineer (React & TS)',
    question: 'How does React Concurrent Mode and useTransition hook work?',
    score: 82,
    technicalAccuracyScore: 84,
    communicationScore: 80,
    starMethodScore: 78,
    confidenceScore: 82,
    pacingWpm: 142,
    sentimentTone: 'Constructive & Analytical',
  },
  {
    id: 's-4',
    sessionNumber: 4,
    date: '2026-10-02',
    role: 'Software Development Engineer (SDE-1)',
    question: 'Describe a situation where you resolved a production latency bottleneck.',
    score: 87,
    technicalAccuracyScore: 88,
    communicationScore: 86,
    starMethodScore: 85,
    confidenceScore: 88,
    pacingWpm: 148,
    sentimentTone: 'Enthusiastic & Collaborative',
  },
  {
    id: 's-5',
    sessionNumber: 5,
    date: '2026-10-04',
    role: 'Full Stack Developer',
    question: 'Design a high-throughput cache-aside layer using Redis and MongoDB.',
    score: 93,
    technicalAccuracyScore: 95,
    communicationScore: 92,
    starMethodScore: 90,
    confidenceScore: 94,
    pacingWpm: 146,
    sentimentTone: 'Constructive & Analytical',
  },
];

const ROLES = [
  'Full Stack Developer',
  'Software Development Engineer (SDE-1)',
  'Frontend Engineer (React & TS)',
  'Backend Engineer (Node / Express)',
  'Cyber Security & SOC Analyst',
  'Data Analyst & ML Associate'
];

const QUESTION_TYPES = [
  { id: 'technical', label: 'Technical Core' },
  { id: 'system_design', label: 'System Design & Arch' },
  { id: 'behavioral', label: 'Behavioral (STAR)' },
  { id: 'problem_solving', label: 'Problem Solving & DSA' }
];

export const MockInterview: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Junior');
  const [selectedType, setSelectedType] = useState('technical');
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluationResult | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [pastSessions, setPastSessions] = useState<InterviewSessionRecord[]>(INITIAL_SESSIONS);
  const [analyticsTab, setAnalyticsTab] = useState<'both' | 'badges' | 'chart'>('both');

  // Load past sessions from Firestore if user is authenticated
  useEffect(() => {
    if (!currentUser) return;
    const loadFirestoreSessions = async () => {
      try {
        const colRef = collection(db, `users/${currentUser.uid}/interviewSessions`);
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const loaded: InterviewSessionRecord[] = snapshot.docs.map((docSnap, idx) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              sessionNumber: idx + 1,
              date: data.createdAt ? data.createdAt.split('T')[0] : '2026-10-05',
              role: data.role || 'Software Engineer',
              question: data.question || 'Interview Question',
              score: data.score || 75,
              technicalAccuracyScore: data.technicalAccuracyScore || data.score || 75,
              communicationScore: data.communicationScore || data.score || 75,
              starMethodScore: data.starMethodScore || data.score || 75,
              confidenceScore: data.confidenceScore || data.communicationScore || 75,
              pacingWpm: data.pacingWpm || 142,
              sentimentTone: data.sentimentTone || 'Constructive & Analytical',
            };
          });
          setPastSessions([...INITIAL_SESSIONS, ...loaded]);
        }
      } catch (err) {
        console.warn('Could not load interview sessions from Firestore:', err);
      }
    };
    loadFirestoreSessions();
  }, [currentUser]);

  // Audio Duration & Recording Timer
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);
  const [liveRecordingTime, setLiveRecordingTime] = useState<number>(0);
  const recordingStartRef = useRef<number | null>(null);
  const recordingTimerIntervalRef = useRef<any>(null);

  const startRecordingTimer = () => {
    recordingStartRef.current = Date.now();
    setLiveRecordingTime(0);
    if (recordingTimerIntervalRef.current) clearInterval(recordingTimerIntervalRef.current);
    recordingTimerIntervalRef.current = setInterval(() => {
      if (recordingStartRef.current) {
        setLiveRecordingTime(Math.floor((Date.now() - recordingStartRef.current) / 1000));
      }
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerIntervalRef.current) {
      clearInterval(recordingTimerIntervalRef.current);
      recordingTimerIntervalRef.current = null;
    }
    if (recordingStartRef.current) {
      const elapsed = Math.max(Math.floor((Date.now() - recordingStartRef.current) / 1000), 1);
      setAudioDurationSeconds((prev) => prev + elapsed);
      recordingStartRef.current = null;
    }
  };

  // Gemini 3.5 Transcribe state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const windowWithSpeech = window as any;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Load first question on mount
  useEffect(() => {
    handleFetchQuestion();
  }, [selectedRole, selectedType, selectedDifficulty]);

  const handleFetchQuestion = async () => {
    setLoadingQuestion(true);
    setEvaluation(null);
    setUserAnswer('');
    setShowHints(false);
    setShowModelAnswer(false);
    setTimerSeconds(180);
    setIsTimerRunning(false);
    setAudioDurationSeconds(0);
    setLiveRecordingTime(0);

    try {
      const data = await generateInterviewQuestionApi(selectedRole, selectedDifficulty, selectedType);
      setCurrentQuestion(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleToggleSpeechPlayback = () => {
    if (!currentQuestion) return;
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer directly into the response box.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      stopRecordingTimer();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        startRecordingTimer();
        if (!isTimerRunning) setIsTimerRunning(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGeminiTranscribe = async () => {
    if (isTranscribing) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsTranscribing(false);
      stopRecordingTimer();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((track) => track.stop());

          setTranscribeLoading(true);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            try {
              const res = await transcribeAudioApi(base64Data, 'audio/webm');
              if (res.transcript) {
                setUserAnswer((prev) => (prev ? prev + ' ' + res.transcript : res.transcript));
              }
            } catch (err) {
              console.error('Audio transcription error:', err);
            } finally {
              setTranscribeLoading(false);
            }
          };
        };

        mediaRecorder.start();
        setIsTranscribing(true);
        startRecordingTimer();
        if (!isTimerRunning) setIsTimerRunning(true);
      } catch (err) {
        console.error('Error accessing microphone for Gemini transcribe:', err);
      }
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    setLoadingEvaluation(true);
    setIsTimerRunning(false);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      stopRecordingTimer();
    }
    if (isTranscribing && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsTranscribing(false);
      stopRecordingTimer();
    }

    try {
      const result = await evaluateInterviewAnswerApi(
        selectedRole,
        currentQuestion.question,
        userAnswer,
        selectedDifficulty,
        audioDurationSeconds
      );
      setEvaluation(result);
      setCompletedCount((prev) => prev + 1);

      // Create new session record for Recharts progress visualization
      const newSessionRecord: InterviewSessionRecord = {
        id: `s-${Date.now()}`,
        sessionNumber: pastSessions.length + 1,
        date: new Date().toISOString().split('T')[0],
        role: selectedRole,
        question: currentQuestion.question,
        score: result.score,
        technicalAccuracyScore: result.technicalAccuracyScore || result.score,
        communicationScore: result.communicationScore || result.score,
        starMethodScore: result.starMethodScore || result.score,
        confidenceScore: result.toneAnalysis?.confidenceScore || result.communicationScore,
        pacingWpm: result.toneAnalysis?.pacingWpm || 142,
        sentimentTone: result.toneAnalysis?.sentimentTone || 'Constructive & Analytical',
      };

      setPastSessions((prev) => [...prev, newSessionRecord]);

      // Save session to Firestore if user is authenticated
      if (currentUser) {
        try {
          const sessionDocId = `session_${Date.now()}`;
          await setDoc(doc(db, `users/${currentUser.uid}/interviewSessions`, sessionDocId), {
            sessionId: sessionDocId,
            userId: currentUser.uid,
            role: selectedRole,
            question: currentQuestion.question,
            answer: userAnswer,
            score: result.score,
            technicalAccuracyScore: result.technicalAccuracyScore,
            communicationScore: result.communicationScore,
            starMethodScore: result.starMethodScore,
            confidenceScore: result.toneAnalysis?.confidenceScore || result.communicationScore,
            pacingWpm: result.toneAnalysis?.pacingWpm || 142,
            sentimentTone: result.toneAnalysis?.sentimentTone || 'Constructive & Analytical',
            confidenceLevel: result.toneAnalysis?.confidenceLevel,
            fillerWordDensity: result.toneAnalysis?.fillerWordDensity,
            createdAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Could not persist interview session to Firestore:', dbErr);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Placement Simulator</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Mock Interview & Speech Evaluator
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Practice real technical and HR behavioral interview questions. Answer via voice or text, hear the interviewer read the question aloud, and receive instant feedback on clarity, STAR structure, and technical depth.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-right">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">Credentials</span>
              <p className="text-xl font-extrabold text-purple-400 flex items-center justify-end gap-1">
                <Award className="h-4 w-4" />
                <span>Verified</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Completed</span>
              <p className="text-xl font-extrabold text-indigo-400">{completedCount} Questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Role, Category, Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Target Interview Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Question Category
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Experience Tier
          </label>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-700/80">
            {['Junior', 'Mid', 'Senior'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`flex-1 rounded py-1 text-xs font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'Junior' ? 'Campus / Junior' : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The Question & Timer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                Interviewer Prompt
              </span>

              {/* Timer Pill */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all border ${
                    timerSeconds < 30
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                      : isTimerRunning
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTime(timerSeconds)}</span>
                </button>

                <button
                  onClick={handleToggleSpeechPlayback}
                  title="Listen to interviewer"
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                    isSpeaking
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                </button>
              </div>
            </div>

            {loadingQuestion ? (
              <div className="py-8 text-center space-y-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mx-auto" />
                <p className="text-xs text-slate-400">Formulating realistic placement question...</p>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-4">
                <p className="text-base font-semibold text-slate-100 leading-relaxed font-sans">
                  "{currentQuestion.question}"
                </p>

                {/* Focus Areas */}
                {currentQuestion.keyFocusAreas && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Evaluated on:</span>
                    {currentQuestion.keyFocusAreas.map((fa, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-700/60"
                      >
                        {fa}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hints Toggle */}
                {currentQuestion.hints && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>{showHints ? 'Hide Hints' : 'Need a hint?'}</span>
                    </button>
                    {showHints && (
                      <ul className="mt-2 space-y-1 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-900/30 text-xs text-slate-300">
                        {currentQuestion.hints.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-400">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handleFetchQuestion}
                disabled={loadingQuestion}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Next Question
              </button>

              <span className="text-[11px] text-slate-500">
                Category: <strong className="text-slate-400 capitalize">{selectedType.replace('_', ' ')}</strong>
              </span>
            </div>
          </div>

          {/* Answer Input Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                Your Spoken or Written Response
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleGeminiTranscribe}
                  disabled={transcribeLoading}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                    isTranscribing
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-indigo-950/60 text-indigo-300 border-indigo-700/60 hover:bg-indigo-900/60'
                  }`}
                  title="Record audio and transcribe precisely with gemini-3.5-transcribe"
                >
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  <span>
                    {transcribeLoading
                      ? 'Transcribing...'
                      : isTranscribing
                      ? 'Stop & Transcribe'
                      : 'Gemini 3.5 Transcribe'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleRecording}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                    isRecording
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  <span>{isRecording ? 'Listening...' : 'Browser Dictate'}</span>
                </button>
              </div>
            </div>

            {(isTranscribing || isRecording) && (
              <div className="flex items-center justify-between bg-rose-950/30 border border-rose-500/30 rounded-lg p-2.5 text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-1 bg-rose-400 h-2 animate-bounce" />
                    <span className="w-1 bg-rose-400 h-3 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 bg-rose-400 h-1.5 animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1 bg-rose-400 h-3 animate-bounce [animation-delay:0.45s]" />
                  </div>
                  <span className="font-semibold">
                    {isTranscribing ? 'Gemini 3.5 Recording & Transcribing...' : 'Browser Dictation Listening...'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-400">Tone & Pacing Sensor:</span>
                  <span className="bg-rose-900/60 px-2 py-0.5 rounded text-rose-200 font-bold border border-rose-700/50">
                    {formatTime(liveRecordingTime)}
                  </span>
                </div>
              </div>
            )}

            <textarea
              rows={8}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Speak using the microphone or type your response here. Aim for structured explanation with concrete examples and trade-offs..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                {userAnswer.split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                onClick={handleSubmitEvaluation}
                disabled={loadingEvaluation || !userAnswer.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loadingEvaluation ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Grading Response...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Evaluate My Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scorecard & Ideal Model Answer */}
        <div className="lg:col-span-6 space-y-4">
          {!evaluation && !loadingEvaluation && (
            <div className="flex h-full min-h-[440px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Evaluation Feed Pending</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Provide an answer and click <strong>"Evaluate My Answer"</strong> to receive real-time grading, STAR method compliance, and an exemplary model answer.
              </p>
            </div>
          )}

          {loadingEvaluation && (
            <div className="flex h-full min-h-[440px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">Analyzing Answer Quality & Metrics...</p>
                <p className="text-xs text-slate-400">Evaluating technical accuracy, logic flow, and clarity</p>
              </div>
            </div>
          )}

          {evaluation && !loadingEvaluation && (
            <div className="space-y-4">
              {/* Score Header */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Answer Performance Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-extrabold text-white">{evaluation.score}</span>
                      <span className="text-sm text-slate-400 font-medium">/ 100</span>
                      <span
                        className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          evaluation.score >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : evaluation.score >= 70
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {evaluation.score >= 85 ? 'Strong Hire' : evaluation.score >= 70 ? 'Promising / Pass' : 'Needs Practice'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Accuracy</p>
                      <p className="text-xs font-bold text-indigo-300">{evaluation.technicalAccuracyScore}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Clarity</p>
                      <p className="text-xs font-bold text-emerald-300">{evaluation.communicationScore}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                      <p className="text-[10px] text-slate-400">STAR Style</p>
                      <p className="text-xs font-bold text-amber-300">{evaluation.starMethodScore}%</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {evaluation.quickSummary}
                </p>

                {/* Highlights vs Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      What Went Well
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {evaluation.positiveHighlights.map((pos, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 space-y-1.5">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Key Improvement Areas
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sentiment and Tone Analysis Feature */}
              {evaluation.toneAnalysis && (
                <div className="rounded-xl border border-purple-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                          <span>Sentiment & Verbal Tone Analysis</span>
                          <span className="rounded bg-purple-500/20 text-purple-300 px-1.5 py-0.2 text-[9px] font-mono border border-purple-500/30">
                            Acoustic & Poise Matrix
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Evaluates verbal confidence, conversational pacing, filler words, and professional poise
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                        evaluation.toneAnalysis.confidenceScore >= 85
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : evaluation.toneAnalysis.confidenceScore >= 75
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {evaluation.toneAnalysis.confidenceLevel}
                    </span>
                  </div>

                  {/* 4 Tone Metrics Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Verbal Confidence */}
                    <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                        Verbal Confidence
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-purple-400">
                          {evaluation.toneAnalysis.confidenceScore}
                        </span>
                        <span className="text-xs text-slate-500">/ 100</span>
                      </div>
                      <span className="text-[10px] text-slate-300 block truncate font-medium">
                        {evaluation.toneAnalysis.confidenceLevel}
                      </span>
                    </div>

                    {/* Speaking Pacing & WPM */}
                    <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                        Speaking Pace
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-cyan-400">
                          {evaluation.toneAnalysis.pacingWpm}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">WPM</span>
                      </div>
                      <span
                        className={`text-[10px] block truncate font-medium ${
                          evaluation.toneAnalysis.pacingVerdict.includes('Optimal')
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {evaluation.toneAnalysis.pacingVerdict}
                      </span>
                    </div>

                    {/* Professional Sentiment */}
                    <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                        Sentiment Demeanor
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold text-emerald-400 line-clamp-1">
                          {evaluation.toneAnalysis.sentimentTone}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Poise: <strong className="text-slate-200">{evaluation.toneAnalysis.professionalismScore}%</strong>
                      </span>
                    </div>

                    {/* Filler Word Audit */}
                    <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                        Filler Word Density
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-sm font-extrabold ${
                            evaluation.toneAnalysis.fillerWordDensity.startsWith('Low')
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {evaluation.toneAnalysis.fillerWordDensity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {evaluation.toneAnalysis.detectedFillerWords.length} detected
                      </span>
                    </div>
                  </div>

                  {/* Detected Filler Words List */}
                  {evaluation.toneAnalysis.detectedFillerWords && evaluation.toneAnalysis.detectedFillerWords.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mr-1">
                        Detected Fillers:
                      </span>
                      {evaluation.toneAnalysis.detectedFillerWords.map((word, i) => (
                        <span
                          key={i}
                          className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-amber-300 border border-amber-500/20"
                        >
                          "{word}"
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-400 ml-auto">
                        Practice tactical pausing (1-2s silence) rather than verbal hedging.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20 text-xs text-emerald-300">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Zero vocal filler words detected — clean, articulate, and executive delivery.</span>
                    </div>
                  )}

                  {/* Tone Feedback and Executive Poise Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                        Vocal Delivery & Poise Assessment
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {evaluation.toneAnalysis.toneFeedback}
                      </p>
                    </div>

                    <div className="bg-purple-950/30 p-3 rounded-lg border border-purple-500/30 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                        <Award className="h-3 w-3 text-purple-400" />
                        Executive Presence Takeaway
                      </span>
                      <p className="text-slate-200 leading-relaxed font-sans">
                        {evaluation.toneAnalysis.confidenceKeyTakeaway}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ideal Model Answer Card */}
              <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    Tier-1 Candidate Benchmark Answer
                  </span>
                  <button
                    onClick={() => setShowModelAnswer(!showModelAnswer)}
                    className="text-xs text-indigo-400 hover:text-white transition-colors"
                  >
                    {showModelAnswer ? 'Collapse' : 'Inspect Model Answer'}
                  </button>
                </div>

                {showModelAnswer && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
                    <p>{evaluation.idealModelAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Switcher: Badges & Credentials | Recharts Performance Analytics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Placement Recognition & Analytics Suite
          </span>
        </div>

        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setAnalyticsTab('both')}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
              analyticsTab === 'both'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Show All
          </button>
          <button
            type="button"
            onClick={() => setAnalyticsTab('badges')}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              analyticsTab === 'badges'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="h-3 w-3" />
            <span>Badges & Credentials</span>
          </button>
          <button
            type="button"
            onClick={() => setAnalyticsTab('chart')}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              analyticsTab === 'chart'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            <span>Benchmark Chart</span>
          </button>
        </div>
      </div>

      {/* Virtual Credentials & Badges Section */}
      {(analyticsTab === 'both' || analyticsTab === 'badges') && (
        <InterviewBadges
          sessions={pastSessions}
          candidateName={currentUser?.displayName || 'Alex Rivera'}
          selectedRole={selectedRole}
        />
      )}

      {/* Recharts Performance Progress & Growth Tracking Chart */}
      {(analyticsTab === 'both' || analyticsTab === 'chart') && (
        <InterviewPerformanceChart sessions={pastSessions} selectedRole={selectedRole} />
      )}
    </div>
  );
};
