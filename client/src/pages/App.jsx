import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, streamMessage } from '../lib/api';
import { isAuthenticated, clearAuth } from '../lib/auth';
import { useSpeechRecognition, useSpeechSynthesis, requestMicPermission, unlockAudio } from '../hooks/useSpeech';
import RecapModal from '../components/RecapModal';
import Rocky from '../components/Logo';
import './App.css';

const STATE = { IDLE: 'idle', LISTENING: 'listening', THINKING: 'thinking', SPEAKING: 'speaking' };

const BUDDIES = [
  { id: 'rocky',   name: 'Rocky',   emoji: null,  color: '#38bdf8', bg: '#fbbf24', trait: 'Loves Timbits 🍩' },
  { id: 'castor',  name: 'Castor',  emoji: '🦫',  color: '#f59e0b', bg: '#fbbf24', trait: 'Tells dad jokes 😄' },
  { id: 'orignal', name: 'Orignal', emoji: '🫎',  color: '#34d399', bg: '#34d399', trait: 'Story master 📖' },
  { id: 'outarde', name: 'Outarde', emoji: '🪿',  color: '#ef4444', bg: '#ef4444', trait: 'Total goofball 😂' },
];

const STORIES = [
  { id: 'timbits', emoji: '🍩', titleEn: 'Timbit Hunt', titleFr: 'La chasse aux Timbits', descEn: 'Rocky lost his Timbits!', duration: '~10 min', ageMin: 5, color: '#fbbf24', prompt: 'timbits_hunt' },
  { id: 'hockey', emoji: '🏒', titleEn: 'Hockey Final', titleFr: 'La grande finale', descEn: "You're playing for Les Canadiens!", duration: '~10 min', ageMin: 6, color: '#38bdf8', prompt: 'hockey_final' },
  { id: 'forest', emoji: '🌲', titleEn: 'Lost in the Forest', titleFr: 'Perdu dans la forêt', descEn: 'Lost in Algonquin Park!', duration: '~10 min', ageMin: 6, color: '#34d399', prompt: 'lost_forest' },
  { id: 'space', emoji: '🚀', titleEn: 'Space Mission', titleFr: 'Mission spatiale', descEn: "You're a Canadian astronaut!", duration: '~15 min', ageMin: 8, color: '#818cf8', prompt: 'space_mission' },
  { id: 'halloween', emoji: '🎃', titleEn: 'Halloween Night', titleFr: "La nuit d'Halloween", descEn: 'A spooky night in Toronto!', duration: '~10 min', ageMin: 7, color: '#f97316', prompt: 'halloween_night' },
  { id: 'cn_tower', emoji: '🏙️', titleEn: 'CN Tower Climb', titleFr: "L'ascension du CN Tower", descEn: 'The elevator is broken!', duration: '~10 min', ageMin: 6, color: '#ef4444', prompt: 'cn_tower' },
  { id: 'sugar_shack', emoji: '🍁', titleEn: 'Sugar Shack', titleFr: 'La cabane à sucre', descEn: 'A magical Quebec visit!', duration: '~10 min', ageMin: 5, color: '#f43f5e', prompt: 'sugar_shack' },
  { id: 'dinosaurs', emoji: '🦕', titleEn: 'ROM Dinosaurs', titleFr: 'Les dinosaures du ROM', descEn: 'Museum dinosaurs came alive!', duration: '~15 min', ageMin: 6, color: '#84cc16', prompt: 'rom_dinosaurs' },
];

function getGreeting(name, buddyName) {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return `Good morning ${name}! 🌞`;
  if (h >= 12 && h < 18) return `Hey ${name}! 👋`;
  return `Good evening ${name}! 🌙`;
}

function BuddyAvatar({ buddy, size = 160 }) {
  if (buddy.id === 'rocky') return <Rocky size={size} />;
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.6, lineHeight: 1, userSelect: 'none' }}>
      {buddy.emoji}
    </div>
  );
}

export default function AppPage() {
  const navigate = useNavigate();
  const [childProfile, setChildProfile] = useState(null);
  const [selectedBuddy, setSelectedBuddy] = useState(() => {
    const saved = localStorage.getItem('getfrench-kids_buddy');
    return BUDDIES.find(b => b.id === saved) || BUDDIES[0];
  });
  const [appMode, setAppMode] = useState('home');
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStorySheet, setShowStorySheet] = useState(false);
  const [mapleCount, setMapleCount] = useState(0);
  const [timbitCount, setTimbitCount] = useState(0);
  const [lang, setLang] = useState(localStorage.getItem('getfrench-kids_lang') || 'en');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState({});
  const [voiceState, setVoiceState] = useState(STATE.IDLE);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [recap, setRecap] = useState(null);
  const [recapLoading, setRecapLoading] = useState(false);

  const messagesRef = useRef([]);
  const sessionIdRef = useRef(null);
  const sessionStartRef = useRef(null);
  const childProfileRef = useRef(null);
  const aiTextRef = useRef('');
  const appModeRef = useRef('home');
  const selectedStoryRef = useRef(null);
  const selectedBuddyRef = useRef(selectedBuddy);

  const UI = lang === 'fr' ? {
    talkToRocky: `Parler avec ${selectedBuddy.name}`, freeConvo: 'Conversation libre',
    storyTime: 'Une histoire', adventure: 'Aventure interactive',
    tapToSpeak: `Appuie pour parler avec ${selectedBuddy.name}!`,
    chooseAdventure: 'Choisis ton aventure! 📖', again: 'Encore! 🦝',
    thatsAll: "C'est tout pour aujourd'hui", newWords: 'Nouveaux mots',
    spokenMin: 'parlé!', mapleLeaves: 'feuilles!', parentSettings: 'Paramètres parents',
    chooseBuddy: 'Ton ami français',
  } : {
    talkToRocky: `Talk to ${selectedBuddy.name}`, freeConvo: 'Free conversation',
    storyTime: 'Story time', adventure: 'Interactive adventure',
    tapToSpeak: `Tap to talk with ${selectedBuddy.name}!`,
    chooseAdventure: 'Choose your adventure! 📖', again: 'Again! 🎉',
    thatsAll: "That's enough for today", newWords: 'New words',
    spokenMin: 'spoken!', mapleLeaves: 'maple leaves!', parentSettings: 'Parent Settings',
    chooseBuddy: 'Your French buddy',
  };

  const speech = useSpeechSynthesis();
  const stt = useSpeechRecognition({
    onResult: useCallback((text) => { setTranscript(text); handleUserInput(text); }, []),
    onEnd: useCallback(() => { setVoiceState(s => s === STATE.LISTENING ? STATE.THINKING : s); }, []),
    onError: useCallback((e) => { setError(typeof e === 'string' ? e : 'Microphone error.'); setVoiceState(STATE.IDLE); }, []),
  });

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/auth', { replace: true }); return; }
    api.kidsProfile()
      .then((profile) => {
        if (!profile || !profile.child_name) { navigate('/setup', { replace: true }); return; }
        setChildProfile(profile);
        childProfileRef.current = profile;
        setMapleCount(profile.maple_count || 0);
        setTimbitCount(profile.timbit_count || 0);
        setSettingsDraft({ childName: profile.child_name, childAge: profile.child_age, schoolLevel: profile.school_level, ttsSpeed: localStorage.getItem('getfrench-kids_speed') || 'normal', lang: localStorage.getItem('getfrench-kids_lang') || 'en' });
      })
      .catch(() => navigate('/setup', { replace: true }));
  }, [navigate]);

  useEffect(() => {
    if (!sessionStart) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStartRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const handleBuddySelect = useCallback((buddy) => {
    setSelectedBuddy(buddy);
    selectedBuddyRef.current = buddy;
    localStorage.setItem('getfrench-kids_buddy', buddy.id);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleUserInput = useCallback(async (text) => {
    const profile = childProfileRef.current;
    if (!profile) return;
    const newMsg = { role: 'user', content: text };
    const next = [...messagesRef.current, newMsg];
    messagesRef.current = next;
    setMessages([...next]);
    setVoiceState(STATE.THINKING);
    setSuggestions([]);
    aiTextRef.current = '';
    const kidsParams = {
      kidsMode: true,
      childName: profile.child_name,
      childAge: profile.child_age,
      schoolLevel: profile.school_level,
      storyMode: appModeRef.current === 'story',
      storyId: selectedStoryRef.current?.prompt || null,
      buddyId: selectedBuddyRef.current?.id || 'rocky',
    };
    try {
      let full = '';
      let sentenceBuf = '';
      setVoiceState(STATE.SPEAKING);
      await streamMessage(next, sessionIdRef.current, kidsParams, (chunk) => {
        full += chunk; sentenceBuf += chunk; aiTextRef.current = full;
        const match = sentenceBuf.match(/^(.*[.!?])\s*/);
        if (match) { speech.enqueueSentence(match[1]); sentenceBuf = sentenceBuf.slice(match[0].length); }
      });
      if (sentenceBuf.trim()) speech.enqueueSentence(sentenceBuf.trim());
      speech.finalize(() => {
        const aiMsg = { role: 'assistant', content: aiTextRef.current };
        const updated = [...messagesRef.current, aiMsg];
        messagesRef.current = updated;
        setMessages([...updated]);
        setVoiceState(STATE.IDLE);
        if (profile.child_age <= 9) {
          api.getSuggestions({ cefrLevel: 'A1', scenario: 'kids', lastAiMessage: aiTextRef.current })
            .then(({ suggestions: s }) => setSuggestions(s || [])).catch(() => {});
        }
      });
    } catch { setError('Something went wrong. Try again!'); setVoiceState(STATE.IDLE); }
  }, [speech]);

  const startSession = useCallback(async (mode, story = null) => {
    if (!childProfileRef.current) return;
    speech.cancel();
    setMessages([]); messagesRef.current = [];
    setTranscript(''); aiTextRef.current = '';
    setSuggestions([]); setError(''); setElapsed(0);
    appModeRef.current = mode;
    selectedStoryRef.current = story;
    setAppMode(mode);
    if (story) setSelectedStory(story);
    try { const { session_id } = await api.startSession(); sessionIdRef.current = session_id; setSessionId(session_id); } catch {}
    const now = Date.now();
    sessionStartRef.current = now; setSessionStart(now);
    speech.createAudioSession();
    await requestMicPermission(); unlockAudio();
    handleUserInput('Bonjour!');
  }, [speech, handleUserInput]);

  const handleMicPress = useCallback(async () => {
    if (voiceState === STATE.SPEAKING) { speech.cancel(); setVoiceState(STATE.IDLE); return; }
    if (voiceState === STATE.THINKING) return;
    if (voiceState === STATE.LISTENING) { stt.stop(); setVoiceState(STATE.IDLE); return; }
    await requestMicPermission(); unlockAudio();
    speech.cancel(); setTranscript(''); setError('');
    setVoiceState(STATE.LISTENING); stt.start();
  }, [voiceState, speech, stt]);

  const handleEndSession = useCallback(async () => {
    stt.stop(); speech.cancel(); speech.closeAudioSession();
    const sessionMinutes = Math.max(1, Math.floor(elapsed / 60));
    const mapleEarned = Math.max(1, Math.floor(sessionMinutes / 3));
    const timbitEarned = sessionMinutes >= 5 ? 1 : 0;
    setRecapLoading(true);
    try {
      const [summary] = await Promise.all([
        api.summarize({ messages: messagesRef.current, existing_memory: {} }),
        api.kidsRewards({ mapleEarned, timbitEarned }).then(() => { setMapleCount(c => c + mapleEarned); setTimbitCount(c => c + timbitEarned); }).catch(() => {}),
        api.endSession({ session_id: sessionIdRef.current }).catch(() => {}),
      ]);
      setRecap({ ...summary, sessionMinutes, mapleEarned, timbitEarned, storyMode: appMode === 'story', storyTitle: selectedStory?.titleEn });
    } catch {
      setRecap({ sessionMinutes, mapleEarned, timbitEarned, storyMode: appMode === 'story', encouragement: "Super travail aujourd'hui! 🎉", words_to_remember: [] });
    } finally { setRecapLoading(false); }
  }, [elapsed, appMode, selectedStory, stt, speech]);

  const handleRecapClose = useCallback(() => {
    setRecap(null); setAppMode('home'); setSelectedStory(null);
    setMessages([]); messagesRef.current = [];
    setSessionStart(null); sessionStartRef.current = null;
    setElapsed(0); setVoiceState(STATE.IDLE);
  }, []);

  const handleSaveSettings = useCallback(async () => {
    const d = settingsDraft;
    try {
      await api.kidsSetup({ childName: d.childName, childAge: Number(d.childAge), schoolLevel: d.schoolLevel });
      localStorage.setItem('getfrench-kids_speed', d.ttsSpeed);
      localStorage.setItem('getfrench-kids_lang', d.lang);
      setLang(d.lang);
      const updated = { ...childProfileRef.current, child_name: d.childName, child_age: Number(d.childAge), school_level: d.schoolLevel };
      setChildProfile(updated); childProfileRef.current = updated;
      setSettingsOpen(false);
    } catch {}
  }, [settingsDraft]);

  const profile = childProfile;
  const inSession = appMode !== 'home';

  if (!profile) return (
    <div className="app-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="rocky-bob"><Rocky size={80} /></div>
    </div>
  );

  return (
    <div className="app-page">
      {/* Top bar */}
      <div className="app-topbar">
        <div className="topbar-left"><Rocky size={28} /></div>
        <div className="topbar-title">{profile.child_name}'s French Time! 🍁</div>
        <div className="topbar-right">
          <button className="settings-btn" onClick={() => setSettingsOpen(true)}>⚙️</button>
        </div>
      </div>

      {/* Reward strip */}
      <div className="reward-strip">
        <span className="reward-pill">🍁 {mapleCount}</span>
        <span className="reward-pill">🍩 {timbitCount}</span>
        <span className="reward-pill">🔥 {profile.streak_count || 0}</span>
      </div>

      {/* Home */}
      {!inSession ? (
        <div className="home-content">
          {/* Big buddy avatar */}
          <div className="rocky-center">
            <div className="rocky-bob">
              <div className="buddy-circle" style={{ background: selectedBuddy.bg, borderColor: '#1e1b4b' }}>
                <BuddyAvatar buddy={selectedBuddy} size={150} />
              </div>
            </div>
            <div className="greeting-text">{getGreeting(profile.child_name, selectedBuddy.name)}</div>
            <div className="rocky-bubble">Salut {profile.child_name}! On parle français? 😄</div>
          </div>

          {/* Buddy selector */}
          <div className="buddy-selector">
            <div className="buddy-selector-label">{UI.chooseBuddy}</div>
            <div className="buddy-row">
              {BUDDIES.map(b => (
                <button
                  key={b.id}
                  className={`buddy-card${selectedBuddy.id === b.id ? ' buddy-card--active' : ''}`}
                  style={{ '--buddy-color': b.color }}
                  onClick={() => handleBuddySelect(b)}
                >
                  <div className="buddy-card-avatar" style={{ background: b.id === selectedBuddy.id ? b.color : '#f3f4f6' }}>
                    {b.id === 'rocky' ? <Rocky size={36} /> : <span style={{ fontSize: 24 }}>{b.emoji}</span>}
                  </div>
                  <span className="buddy-card-name">{b.name}</span>
                  <span className="buddy-card-trait">{b.trait}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode buttons */}
          <div className="mode-buttons">
            <button className="mode-btn mode-btn--convo" onClick={() => startSession('conversation')}>
              <span className="mode-btn-icon">💬</span>
              <span className="mode-btn-title">{UI.talkToRocky}</span>
              <span className="mode-btn-sub">{UI.freeConvo}</span>
            </button>
            <button className="mode-btn mode-btn--story" onClick={() => setShowStorySheet(true)}>
              <span className="mode-btn-icon">📖</span>
              <span className="mode-btn-title">{UI.storyTime}</span>
              <span className="mode-btn-sub">{UI.adventure}</span>
              <span className="mode-btn-badge">NEW ✨</span>
            </button>
          </div>

          <p className="app-bottom-label">15 min · {selectedBuddy.name} only speaks French 🇫🇷</p>
        </div>
      ) : (
        /* Session */
        <div className="session-content">
          <div className="rocky-session">
            <div className={voiceState === STATE.SPEAKING ? 'rocky-speaking' : 'rocky-bob'}>
              <div className="buddy-circle buddy-circle--sm" style={{ background: selectedBuddy.bg }}>
                <BuddyAvatar buddy={selectedBuddy} size={100} />
              </div>
            </div>
            <span className="mode-badge">{appMode === 'story' ? `📖 ${selectedStory?.titleEn}` : `💬 ${selectedBuddy.name}`}</span>
          </div>
          <div className="session-spacer" />
          {voiceState === STATE.THINKING && <div className="thinking-dots"><span/><span/><span/></div>}
          {suggestions.length > 0 && voiceState === STATE.IDLE && (
            <div className="suggestions-container">
              <div className="suggestions-row">
                {suggestions.map((s, i) => <button key={i} className="suggestion-chip" onClick={() => handleUserInput(s)}>{s}</button>)}
              </div>
            </div>
          )}
          <button className={`mic-btn mic-btn--${voiceState}`} onClick={handleMicPress} disabled={voiceState === STATE.THINKING || recapLoading}>
            <div className="mic-rings">
              <div className="ring ring-1"/><div className="ring ring-2"/><div className="ring ring-3"/>
            </div>
            <div className="mic-inner" style={{ background: selectedBuddy.color }}>
              {voiceState === STATE.THINKING && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path className="spinner-path" d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>}
              {voiceState === STATE.SPEAKING && <div className="wave-bars"><div className="bar"/><div className="bar"/><div className="bar"/><div className="bar"/><div className="bar"/></div>}
              {(voiceState === STATE.LISTENING || voiceState === STATE.IDLE) && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="13" rx="3" fill="white"/><path d="M5 11a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
            </div>
          </button>
          <div className="state-label">
            {voiceState === STATE.IDLE && UI.tapToSpeak}
            {voiceState === STATE.LISTENING && 'Listening...'}
            {voiceState === STATE.THINKING && `${selectedBuddy.name} is thinking...`}
            {voiceState === STATE.SPEAKING && `${selectedBuddy.name} is speaking...`}
          </div>
          {transcript && voiceState !== STATE.LISTENING && <div className="transcript-bubble">"{transcript}"</div>}
          {error && <div className="app-error">{error}</div>}
          <div className="session-timer">{formatTime(elapsed)}</div>
          <div className="session-spacer" />
        </div>
      )}

      {inSession && (
        <div className="app-footer">
          <button className="end-session-btn" onClick={handleEndSession} disabled={recapLoading}>
            {recapLoading ? 'Loading...' : 'End session'}
          </button>
        </div>
      )}

      {/* Story sheet */}
      {showStorySheet && (
        <>
          <div className="story-overlay" onClick={() => setShowStorySheet(false)} />
          <div className="story-sheet">
            <div className="story-sheet-header">
              <span className="story-sheet-title">{UI.chooseAdventure}</span>
              <button className="story-sheet-close" onClick={() => setShowStorySheet(false)}>✕</button>
            </div>
            <div className="story-grid">
              {STORIES.map(s => {
                const locked = profile.child_age < s.ageMin;
                return (
                  <button key={s.id} className={`story-card${locked ? ' story-card--locked' : ''}`}
                    style={{ background: locked ? '#f3f4f6' : s.color + '33' }}
                    onClick={() => { if (locked) return; setShowStorySheet(false); startSession('story', s); }} disabled={locked}>
                    <span className="story-emoji">{s.emoji}</span>
                    <span className="story-title-en">{s.titleEn}</span>
                    <span className="story-title-fr">{s.titleFr}</span>
                    <span className="story-desc">{s.descEn}</span>
                    <span className="story-duration">{s.duration}</span>
                    {locked && <span className="story-locked-badge">Coming soon! 🌟</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Settings */}
      <div className={`sp-overlay${settingsOpen ? ' sp-overlay--on' : ''}`} onClick={() => setSettingsOpen(false)}>
        <div className={`sp-drawer${settingsOpen ? ' sp-drawer--open' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="sp-header">
            <span className="sp-title">{UI.parentSettings} 👨‍👩‍👧</span>
            <button className="sp-close" onClick={() => setSettingsOpen(false)}>✕</button>
          </div>
          <div className="sp-body">
            <div className="sp-section">
              <div className="sp-label">Child Profile</div>
              <div className="sp-options">
                <input type="text" placeholder="First name" value={settingsDraft.childName || ''} onChange={e => setSettingsDraft(d => ({ ...d, childName: e.target.value }))} />
                <select value={settingsDraft.childAge || ''} onChange={e => setSettingsDraft(d => ({ ...d, childAge: e.target.value }))} style={{ height: 48, borderRadius: 12, border: '1.5px solid var(--border)', padding: '0 12px', fontSize: 15 }}>
                  {[5,6,7,8,9,10,11,12,13,14].map(a => <option key={a} value={a}>{a} years old</option>)}
                </select>
                <select value={settingsDraft.schoolLevel || ''} onChange={e => setSettingsDraft(d => ({ ...d, schoolLevel: e.target.value }))} style={{ height: 48, borderRadius: 12, border: '1.5px solid var(--border)', padding: '0 12px', fontSize: 15 }}>
                  <option value="jk_sk">Kindergarten (JK/SK)</option>
                  <option value="grade_1_3">Grade 1-3</option>
                  <option value="grade_4_6">Grade 4-6</option>
                  <option value="grade_7_plus">Grade 7+</option>
                </select>
              </div>
            </div>
            <div className="sp-section">
              <div className="sp-label">App Language</div>
              <div className="sp-options sp-options--row">
                {[['en','English'],['fr','Français']].map(([v,l]) => (
                  <button key={v} className={`sp-option sp-option--compact${settingsDraft.lang === v ? ' sp-option--on' : ''}`} onClick={() => setSettingsDraft(d => ({ ...d, lang: v }))}>
                    <span className="sp-option-title">{l}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="sp-section">
              <button className="sp-save-btn" onClick={handleSaveSettings}>Save changes</button>
            </div>
            <div className="sp-section">
              <button className="sp-signout-btn" onClick={() => { clearAuth(); navigate('/'); }}>Sign out</button>
            </div>
          </div>
        </div>
      </div>

      {recap && (
        <RecapModal childName={profile.child_name} sessionMinutes={recap.sessionMinutes} wordsToRemember={recap.words_to_remember} encouragement={recap.encouragement} mapleEarned={recap.mapleEarned} timbitEarned={recap.timbitEarned} storyMode={recap.storyMode} storyTitle={recap.storyTitle} streak={profile.streak_count || 0} onClose={handleRecapClose} lang={lang} UI={UI} />
      )}
    </div>
  );
}
