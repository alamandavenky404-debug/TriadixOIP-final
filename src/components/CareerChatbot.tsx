import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Mic,
  MicOff,
  RotateCcw,
  Zap,
  Cpu,
  Brain,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { sendChatMessageApi, transcribeAudioApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export const CareerChatbot: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: `Hello! I am your AI Placement Mentor and Career Coach. I can help you prepare for technical rounds, optimize your resume bullet points, practice behavioral STAR responses, or architect distributed system designs. What would you like to focus on today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [rolePersona, setRolePersona] = useState<'career-coach' | 'tech-lead' | 'hr-interviewer'>('career-coach');
  const [modelType, setModelType] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');

  // Audio transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history from Firestore if user is authenticated
  useEffect(() => {
    if (!currentUser) return;
    const fetchHistory = async () => {
      try {
        const chatColRef = collection(db, `users/${currentUser.uid}/chatMessages`);
        const q = query(chatColRef, orderBy('createdAt', 'asc'), limit(30));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const loaded: ChatMessageItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              role: data.role as 'user' | 'model',
              content: data.content,
              timestamp: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              modelUsed: data.modelUsed,
            };
          });
          setMessages(loaded);
        }
      } catch (err) {
        console.warn('Could not load chat history from Firestore:', err);
      }
    };
    fetchHistory();
  }, [currentUser]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    // Save user message to Firestore
    if (currentUser) {
      try {
        await addDoc(collection(db, `users/${currentUser.uid}/chatMessages`), {
          userId: currentUser.uid,
          role: 'user',
          content: userMessage.content,
          modelUsed: modelType,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore write warning:', err);
      }
    }

    try {
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessageApi(historyPayload, rolePersona, modelType);

      const botMessage: ChatMessageItem = {
        id: `msg-bot-${Date.now()}`,
        role: 'model',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.modelUsed,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save bot message to Firestore
      if (currentUser) {
        try {
          await addDoc(collection(db, `users/${currentUser.uid}/chatMessages`), {
            userId: currentUser.uid,
            role: 'model',
            content: botMessage.content,
            modelUsed: res.modelUsed,
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          console.warn('Firestore write warning:', err);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'model',
          content: 'I encountered an issue processing your response. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: modelType,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Audio recording with gemini-3.5-transcribe
  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
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

          // Convert to base64
          setTranscribing(true);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            try {
              const res = await transcribeAudioApi(base64Data, 'audio/webm');
              if (res.transcript) {
                setInputText((prev) => (prev ? prev + ' ' + res.transcript : res.transcript));
              }
            } catch (err) {
              console.error('Audio transcription error:', err);
            } finally {
              setTranscribing(false);
            }
          };
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        content: 'Conversation history reset. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelType,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Multi-Turn Gemini Career Chat</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Placement Advisor & System Architect
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Engage in multi-turn coaching sessions with specialized personas. Uses Gemini 3.5 Flash for general career strategy, Gemini 3.1 Pro Preview for complex systems, and Gemini 3.1 Flash Lite for ultra-fast advice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Thread</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Persona and Model Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        {/* Persona Selector */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Chatbot Role & System Instruction
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setRolePersona('career-coach')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                rolePersona === 'career-coach'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Career Coach
            </button>
            <button
              onClick={() => setRolePersona('tech-lead')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                rolePersona === 'tech-lead'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Tech Architect
            </button>
            <button
              onClick={() => setRolePersona('hr-interviewer')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                rolePersona === 'hr-interviewer'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              HR / STAR Round
            </button>
          </div>
        </div>

        {/* Gemini Model Selector */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Gemini Engine Selector
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setModelType('gemini-3.5-flash')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                modelType === 'gemini-3.5-flash'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3 w-3" />
              <span>3.5 Flash (General)</span>
            </button>
            <button
              onClick={() => setModelType('gemini-3.1-flash-lite')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                modelType === 'gemini-3.1-flash-lite'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>3.1 Lite (Fast)</span>
            </button>
            <button
              onClick={() => setModelType('gemini-3.1-pro-preview')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                modelType === 'gemini-3.1-pro-preview'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Brain className="h-3 w-3" />
              <span>3.1 Pro (Complex)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Thread Window */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-indigo-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={`space-y-1 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm font-sans ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-slate-500 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <span className="rounded bg-slate-800/80 px-1.5 py-0.2 text-[9px] font-mono text-indigo-400 border border-slate-700/60">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-950 p-4 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                <span>Generating thoughtful response with {modelType}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Transcription Integration */}
        <div className="border-t border-slate-800/80 bg-slate-950/80 p-3 sm:p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Audio Transcription Button (gemini-3.5-transcribe) */}
            <button
              type="button"
              onClick={handleToggleRecording}
              title="Speak to transcribe using gemini-3.5-transcribe"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                transcribing
                  ? 'Transcribing audio with gemini-3.5-transcribe...'
                  : isRecording
                  ? 'Listening to microphone...'
                  : 'Ask about interview questions, system design trade-offs, or placement roadmaps...'
              }
              disabled={transcribing}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim() || transcribing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>
              Mic button uses <strong className="text-slate-400">gemini-3.5-transcribe</strong>
            </span>
            <span>
              Role: <strong className="text-indigo-400 capitalize">{rolePersona.replace('-', ' ')}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
