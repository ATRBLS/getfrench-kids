import { useRef, useCallback, useEffect } from 'react';
import { getToken } from '../lib/auth';

let micPermissionRequested = false;

export async function requestMicPermission() {
  if (micPermissionRequested) return;
  micPermissionRequested = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setTimeout(() => stream.getTracks().forEach(t => t.stop()), 500);
  } catch (err) {
    console.warn('[Speech] Mic permission denied:', err.message);
  }
}

export function unlockAudio() {
  try {
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch {}
}

// Play a 200ms near-silent buffer through an AudioContext.
// Needed to "prove" to iOS that audio happened during a user gesture.
function playUnlockBuffer(ctx) {
  try {
    const sampleRate = ctx.sampleRate || 22050;
    const buf = ctx.createBuffer(1, Math.floor(sampleRate * 0.2), sampleRate);
    // Leave data as silence (zeros) — audible enough for iOS to register
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch {}
}

export function useSpeechRecognition({ onResult, onEnd, onError }) {
  const recognitionRef = useRef(null);
  const cbRef = useRef({ onResult, onEnd, onError });
  useEffect(() => { cbRef.current = { onResult, onEnd, onError }; });

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      cbRef.current.onError?.('Speech recognition not supported. Try Chrome or Safari.');
      return;
    }
    try { recognitionRef.current?.abort(); } catch {}
    const rec = new SR();
    rec.lang = 'fr-FR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e) => { cbRef.current.onResult?.(e.results[0][0].transcript); };
    rec.onerror = (e) => { if (e.error !== 'aborted') cbRef.current.onError?.(e.error); };
    rec.onend = () => cbRef.current.onEnd?.();
    recognitionRef.current = rec;
    try { rec.start(); } catch (err) { cbRef.current.onError?.(err.message); }
  }, []);

  const stop = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch {}
    recognitionRef.current = null;
  }, []);

  return { start, stop };
}

export function useSpeechSynthesis() {
  const audioCtxRef  = useRef(null);
  const queueRef     = useRef([]);
  const playingRef   = useRef(false);
  const onDoneRef    = useRef(null);
  const finalizedRef = useRef(false);
  const currentRef   = useRef(null);
  const genRef       = useRef(0);

  // Call during a user gesture to CREATE a new AudioContext.
  // Only creates if one doesn't exist yet.
  const createAudioSession = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      playUnlockBuffer(ctx);
      audioCtxRef.current = ctx;
    } catch (e) {
      console.warn('[TTS] AudioContext creation failed:', e.message);
    }
  }, []);

  // Call during a user gesture to UNLOCK audio even if AudioContext already exists.
  // Handles the case where iOS suspended the context during the async wait.
  // MUST be called synchronously during a tap/click event.
  const forceAudioUnlock = useCallback(() => {
    if (!audioCtxRef.current) {
      // No context yet — create one fresh
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        playUnlockBuffer(ctx);
        audioCtxRef.current = ctx;
      } catch (e) {
        console.warn('[TTS] AudioContext creation failed:', e.message);
      }
      return;
    }
    const ctx = audioCtxRef.current;
    // Resume if suspended — ctx.resume() called during gesture is honored by iOS
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Play unlock buffer regardless — this is what actually unlocks iOS audio
    playUnlockBuffer(ctx);
  }, []);

  const closeAudioSession = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  const playNext = useCallback((gen) => {
    if (gen !== genRef.current) return;

    if (queueRef.current.length === 0) {
      if (finalizedRef.current) {
        playingRef.current   = false;
        finalizedRef.current = false;
        const cb = onDoneRef.current;
        onDoneRef.current = null;
        cb?.();
      } else {
        playingRef.current = false;
      }
      return;
    }

    const text    = queueRef.current.shift();
    const token   = getToken();
    const base    = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    const buddyId = localStorage.getItem('getfrench-kids_buddy') || 'rocky';

    fetch(`${base}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text, buddyId }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`TTS ${res.status}`);
        return res.arrayBuffer();
      })
      .then(arrayBuffer => {
        if (gen !== genRef.current) return Promise.reject(new Error('cancelled'));
        const ctx = audioCtxRef.current;
        if (!ctx) throw new Error('no AudioContext');
        return ctx.decodeAudioData(arrayBuffer);
      })
      .then(async audioBuffer => {
        if (gen !== genRef.current) return;
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        currentRef.current = source;
        source.onended = () => {
          currentRef.current = null;
          playNext(gen);
        };

        if (ctx.state === 'suspended') {
          try { await ctx.resume(); } catch {}
        }
        source.start(0);
      })
      .catch((err) => {
        if (gen !== genRef.current || err.message === 'cancelled') return;
        console.error('[TTS] failed, skipping:', err.message);
        playNext(gen);
      });
  }, []);

  const enqueueSentence = useCallback((text) => {
    if (!text.trim()) return;
    queueRef.current.push(text.trim());
    if (!playingRef.current) {
      playingRef.current = true;
      playNext(genRef.current);
    }
  }, [playNext]);

  const finalize = useCallback((onEnd) => {
    onDoneRef.current    = onEnd;
    finalizedRef.current = true;
    if (!playingRef.current && queueRef.current.length === 0) {
      finalizedRef.current = false;
      onEnd?.();
    }
  }, []);

  const cancel = useCallback(() => {
    genRef.current++;
    queueRef.current     = [];
    playingRef.current   = false;
    finalizedRef.current = false;
    onDoneRef.current    = null;
    if (currentRef.current) {
      try { currentRef.current.stop(); } catch {}
      currentRef.current = null;
    }
  }, []);

  return { enqueueSentence, finalize, cancel, createAudioSession, forceAudioUnlock, closeAudioSession };
}
