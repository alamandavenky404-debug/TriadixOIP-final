import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Activity,
  AlertCircle
} from 'lucide-react';

interface LiveVoiceInterviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceInterview: React.FC<LiveVoiceInterviewProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Click "Start Voice Session" to connect with Gemini 3.8 Live API.');
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const pcmToBase64 = (pcmData: Float32Array): string => {
    const l = pcmData.length;
    const arrayBuffer = new ArrayBuffer(l * 2);
    const view = new DataView(arrayBuffer);
    for (let i = 0; i < l; i++) {
      let s = Math.max(-1, Math.min(1, pcmData[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playNextInQueue = () => {
    if (!outputAudioCtxRef.current || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsAiSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsAiSpeaking(true);
    const chunk = audioQueueRef.current.shift()!;
    const buffer = outputAudioCtxRef.current.createBuffer(1, chunk.length, 24000);
    buffer.copyToChannel(chunk as any, 0);

    const source = outputAudioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(outputAudioCtxRef.current.destination);
    source.onended = () => {
      playNextInQueue();
    };
    source.start();
  };

  const handleReceivePcmChunk = (base64String: string) => {
    try {
      const binary = atob(base64String);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const dataView = new DataView(bytes.buffer);
      const sampleCount = bytes.length / 2;
      const float32 = new Float32Array(sampleCount);
      for (let i = 0; i < sampleCount; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
      }

      audioQueueRef.current.push(float32);
      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (e) {
      console.error('Error decoding PCM chunk:', e);
    }
  };

  const startLiveSession = async () => {
    setError(null);
    setStatusMessage('Connecting to Gemini 3.8 Live API server...');

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      if (outputAudioCtxRef.current.state === 'suspended') {
        await outputAudioCtxRef.current.resume();
      }

      ws.onopen = async () => {
        setIsConnected(true);
        setStatusMessage('Connected! Capturing microphone at 16kHz for real-time conversation.');

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
          inputAudioCtxRef.current = inputAudioCtx;
          const source = inputAudioCtx.createMediaStreamSource(stream);
          const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);

          source.connect(processor);
          processor.connect(inputAudioCtx.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64Audio = pcmToBase64(inputData);
              ws.send(JSON.stringify({ audio: base64Audio }));
            }
          };

          setIsMicActive(true);
        } catch (micErr: any) {
          setError('Microphone access denied: ' + micErr.message);
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            handleReceivePcmChunk(msg.audio);
          }
          if (msg.interrupted) {
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            setIsAiSpeaking(false);
          }
        } catch (e) {
          console.error('Error processing websocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('Connection to Gemini Live API failed. Ensure GEMINI_API_KEY is configured.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsMicActive(false);
        setStatusMessage('Live voice session disconnected.');
      };
    } catch (err: any) {
      console.error('Start session error:', err);
      setError(err.message || 'Failed to start Live API session');
    }
  };

  const stopLiveSession = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsConnected(false);
    setIsMicActive(false);
    setIsAiSpeaking(false);
    setStatusMessage('Live session stopped.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-2xl border border-indigo-500/40 bg-slate-900 p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 shadow-md">
              <Radio className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gemini 3.8 Live Voice Studio</span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                  gemini-3.8-live
                </span>
              </h2>
              <p className="text-xs text-slate-400">Bidirectional low-latency real-time voice conversations</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopLiveSession();
              onClose();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Audio Visualizer Stage */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 flex flex-col items-center justify-center space-y-5 text-center min-h-[220px]">
          {/* Animated Pulsing Wave Circles */}
          <div className="relative flex items-center justify-center">
            {isConnected && (
              <>
                <div
                  className={`absolute h-36 w-36 rounded-full transition-all duration-300 ${
                    isAiSpeaking
                      ? 'bg-rose-500/20 animate-ping'
                      : isMicActive
                      ? 'bg-indigo-500/20 animate-pulse'
                      : 'bg-slate-800/20'
                  }`}
                />
                <div
                  className={`absolute h-28 w-28 rounded-full border transition-all duration-300 ${
                    isAiSpeaking
                      ? 'border-rose-500/40 bg-rose-500/10'
                      : isMicActive
                      ? 'border-indigo-500/40 bg-indigo-500/10'
                      : 'border-slate-800'
                  }`}
                />
              </>
            )}

            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                isAiSpeaking
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white scale-110 shadow-rose-500/30'
                  : isConnected
                  ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-indigo-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isAiSpeaking ? (
                <Volume2 className="h-8 w-8 animate-bounce" />
              ) : isMicActive ? (
                <Mic className="h-8 w-8 animate-pulse" />
              ) : (
                <MicOff className="h-8 w-8" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {isAiSpeaking
                ? 'Interviewer is speaking...'
                : isMicActive
                ? 'Listening to you speak (16kHz PCM)...'
                : 'Session Idle'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm">{statusMessage}</p>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-950/40 border border-rose-900/50 p-2 text-xs text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {!isConnected ? (
            <button
              onClick={startLiveSession}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-400 transition-all cursor-pointer"
            >
              <Radio className="h-4 w-4" />
              <span>Start Live Voice Conversation</span>
            </button>
          ) : (
            <button
              onClick={stopLiveSession}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all cursor-pointer"
            >
              <MicOff className="h-4 w-4" />
              <span>End Live Conversation</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          Powered by Gemini 3.8 Live API with full duplex audio streaming.
        </div>
      </div>
    </div>
  );
};
