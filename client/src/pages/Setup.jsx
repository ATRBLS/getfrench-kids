import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Rocky from '../components/Logo';
import { isAuthenticated } from '../lib/auth';

export default function Setup() {
  const navigate = useNavigate();
  const [childName, setChildName] = useState(sessionStorage.getItem('gf_kids_childName') || '');
  const [childAge, setChildAge] = useState(sessionStorage.getItem('gf_kids_childAge') || '8');
  const [schoolLevel, setSchoolLevel] = useState(sessionStorage.getItem('gf_kids_schoolLevel') || 'grade_1_3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated()) { navigate('/auth', { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!childName.trim()) { setError("Please enter your child's name."); return; }
    setLoading(true);
    setError('');
    try {
      await api.kidsSetup({ childName: childName.trim(), childAge: Number(childAge), schoolLevel });
      navigate('/app', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#fff7e6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'max(32px, env(safe-area-inset-top)) 24px 40px' }}>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        <div className="rocky-bob"><Rocky size={120} /></div>

        <div style={{ position: 'relative', background: 'white', border: '2px solid #1e1b4b', borderRadius: 16, padding: '14px 20px', textAlign: 'center', maxWidth: 280, boxShadow: '3px 3px 0 #1e1b4b' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', fontFamily: 'Nunito, sans-serif' }}>
            Salut! Je suis Rocky! 🦝<br/>Tell me about your French learner!
          </span>
          <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '14px solid #1e1b4b' }} />
        </div>

        <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 24, fontWeight: 600, color: '#1e1b4b', textAlign: 'center' }}>
          Tell us about your learner! 🍁
        </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>Child's first name:</label>
            <input
              type="text"
              placeholder="Emma, Liam, Sofia..."
              value={childName}
              onChange={e => setChildName(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>How old are they?</label>
            <select
              value={childAge}
              onChange={e => setChildAge(e.target.value)}
              style={{ height: 48, borderRadius: 12, border: '1.5px solid rgba(30,27,75,0.15)', padding: '0 12px', fontSize: 16, background: 'white', color: '#1e1b4b' }}
            >
              {[5,6,7,8,9,10,11,12,13,14].map(a => <option key={a} value={a}>{a} years old</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>What year are they in?</label>
            <select
              value={schoolLevel}
              onChange={e => setSchoolLevel(e.target.value)}
              style={{ height: 48, borderRadius: 12, border: '1.5px solid rgba(30,27,75,0.15)', padding: '0 12px', fontSize: 16, background: 'white', color: '#1e1b4b' }}
            >
              <option value="jk_sk">Kindergarten / Maternelle (JK/SK)</option>
              <option value="grade_1_3">Grade 1-3 (Early immersion)</option>
              <option value="grade_4_6">Grade 4-6 (Mid immersion)</option>
              <option value="grade_7_plus">Grade 7+ (Late immersion)</option>
            </select>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 14, textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !childName.trim()}
            style={{
              background: loading || !childName.trim() ? '#d1d5db' : '#ef4444',
              color: 'white', border: '2px solid #1e1b4b', borderRadius: 50,
              height: 56, fontSize: 17, fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
              boxShadow: '3px 3px 0 #1e1b4b', cursor: loading || !childName.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Setting up...' : 'Meet Rocky! 🦝 →'}
          </button>
        </form>
      </div>
    </div>
  );
}
