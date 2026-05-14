import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rocky from '../components/Logo';

const SCHOOL_LEVELS = [
  { value: 'jk_sk', label: 'Kindergarten (JK/SK)' },
  { value: 'grade_1_3', label: 'Grade 1-3 (Early immersion)' },
  { value: 'grade_4_6', label: 'Grade 4-6 (Mid immersion)' },
  { value: 'grade_7_plus', label: 'Grade 7+ (Late immersion)' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('8');
  const [schoolLevel, setSchoolLevel] = useState('grade_1_3');

  const advance = () => setScreen(s => s + 1);

  const saveAndContinue = () => {
    sessionStorage.setItem('gf_kids_childName', childName.trim());
    sessionStorage.setItem('gf_kids_childAge', childAge);
    sessionStorage.setItem('gf_kids_schoolLevel', schoolLevel);
    advance();
  };

  const page = { minHeight: '100dvh', background: '#fff7e6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'max(40px, env(safe-area-inset-top)) 24px 40px', gap: 24 };
  const card = { width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 };
  const title = { fontFamily: 'Fredoka, sans-serif', fontSize: 26, fontWeight: 600, color: '#1e1b4b', textAlign: 'center' };
  const body = { fontSize: 16, color: '#1e1b4b', textAlign: 'center', lineHeight: 1.55, opacity: 0.75 };
  const btn = { width: '100%', background: '#ef4444', color: 'white', border: '2px solid #1e1b4b', borderRadius: 50, height: 56, fontSize: 17, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, boxShadow: '3px 3px 0 #1e1b4b', cursor: 'pointer' };
  const select = { height: 48, borderRadius: 12, border: '1.5px solid rgba(30,27,75,0.15)', padding: '0 12px', fontSize: 16, background: 'white', color: '#1e1b4b', width: '100%' };
  const label = { fontWeight: 700, fontSize: 14, color: '#1e1b4b' };

  const Bubble = ({ children }) => (
    <div style={{ position: 'relative', background: 'white', border: '2px solid #1e1b4b', borderRadius: 16, padding: '12px 18px', textAlign: 'center', maxWidth: 260, boxShadow: '3px 3px 0 #1e1b4b', fontSize: 15, fontWeight: 700, color: '#1e1b4b' }}>
      {children}
      <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '14px solid #1e1b4b' }} />
    </div>
  );

  if (screen === 0) return (
    <div style={page}>
      <div style={card}>
        <div className="rocky-bob"><Rocky size={160} /></div>
        <Bubble>Salut! Je suis Rocky! 🦝<br />Je parle seulement français!</Bubble>
        <h1 style={title}>Meet Rocky, your French buddy!</h1>
        <p style={body}>Rocky will practice French with your child — 15 minutes a day, like a game!</p>
        <button style={btn} onClick={advance}>{"Let's go! →"}</button>
      </div>
    </div>
  );

  if (screen === 1) return (
    <div style={page}>
      <div style={card}>
        <Rocky size={80} />
        <h1 style={title}>Tell us about your learner! 🍁</h1>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={label}>{"Child's first name:"}</label>
            <input type="text" placeholder="Emma, Liam, Sofia..." value={childName} onChange={e => setChildName(e.target.value)} autoComplete="off" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={label}>How old are they?</label>
            <select value={childAge} onChange={e => setChildAge(e.target.value)} style={select}>
              {[5,6,7,8,9,10,11,12,13,14].map(a => <option key={a} value={a}>{a} years old</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={label}>What year are they in?</label>
            <select value={schoolLevel} onChange={e => setSchoolLevel(e.target.value)} style={select}>
              {SCHOOL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
        <button style={{ ...btn, background: !childName.trim() ? '#d1d5db' : '#ef4444' }} onClick={saveAndContinue} disabled={!childName.trim()}>Continue →</button>
      </div>
    </div>
  );

  if (screen === 2) return (
    <div style={page}>
      <div style={card}>
        <div className="rocky-bob"><Rocky size={160} /></div>
        <Bubble>On va parler français! 🦝</Bubble>
        <h1 style={title}>{childName || 'Your child'} is ready! 🎉</h1>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['🎙️', 'Rocky only speaks French'], ['🍁', 'Earn maple leaves & Timbits'], ['📖', 'Fun interactive stories']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', border: '1.5px solid rgba(30,27,75,0.12)', borderRadius: 14, padding: '12px 16px' }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1e1b4b' }}>{text}</span>
            </div>
          ))}
        </div>
        <button style={btn} onClick={() => navigate('/auth')}>Create account →</button>
      </div>
    </div>
  );

  return null;
}
