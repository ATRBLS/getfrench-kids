import { useEffect, useRef } from 'react';
import Rocky from './Logo';
import './RecapModal.css';

function getStreakMilestone(streak) {
  if (streak === 30) return "30 days! You're a star! ⭐";
  if (streak === 7)  return 'One week! 🔥';
  if (streak === 3)  return '3 days strong! 💪';
  return null;
}

export default function RecapModal({ childName, sessionMinutes, wordsToRemember, encouragement, mapleEarned, timbitEarned, storyMode, storyTitle, streak, onClose, UI }) {
  const milestone = getStreakMilestone(streak);
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const colors = ['#ef4444', '#fbbf24', '#38bdf8', '#34d399', '#818cf8'];
    const dots = Array.from({ length: 20 }, (_, i) => {
      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;width:8px;height:8px;border-radius:50%;background:${colors[i % colors.length]};left:calc(50% + ${(Math.random() - 0.5) * 300}px);top:calc(50% + ${(Math.random() - 0.5) * 400}px);opacity:0;animation:confettiBurst 0.6s ease-out ${i * 0.03}s forwards;`;
      el.appendChild(dot);
      return dot;
    });
    return () => dots.forEach(d => d.remove());
  }, []);

  return (
    <div ref={overlayRef} className="recap-overlay" onClick={onClose}>
      <div className="kids-recap-card" onClick={e => e.stopPropagation()}>

        <div className="recap-rocky">
          <div className="rocky-bob"><Rocky size={100} /></div>
        </div>

        <h2 className="recap-title">Awesome, {childName}! 🎉</h2>

        {storyMode && storyTitle && (
          <p className="recap-story-label">You finished: <strong>{storyTitle}</strong></p>
        )}

        <div className="recap-stats-row">
          <div className="recap-stat-card recap-stat-sky">
            <span className="recap-stat-icon">🗣️</span>
            <span className="recap-stat-value">{sessionMinutes} min</span>
            <span className="recap-stat-label">{UI?.spokenMin || 'spoken!'}</span>
          </div>
          <div className="recap-stat-card recap-stat-sun">
            <span className="recap-stat-icon">🍁</span>
            <span className="recap-stat-value">+{mapleEarned}</span>
            <span className="recap-stat-label">{UI?.mapleLeaves || 'maple leaves!'}</span>
          </div>
          <div className="recap-stat-card recap-stat-mint">
            <span className="recap-stat-icon">🍩</span>
            <span className="recap-stat-value">+{timbitEarned}</span>
            <span className="recap-stat-label">Timbits!</span>
          </div>
        </div>

        {encouragement && (
          <div className="recap-rocky-says">
            <span className="recap-rocky-label">Rocky says:</span>
            <div className="recap-rocky-bubble">"{encouragement}"</div>
          </div>
        )}

        {wordsToRemember?.length > 0 && (
          <div className="recap-words">
            <span className="recap-words-label">{UI?.newWords || 'New words'} 🆕</span>
            <div className="recap-chips">
              {wordsToRemember.slice(0, 3).map((w, i) => (
                <span key={i} className="recap-chip">{w}</span>
              ))}
            </div>
          </div>
        )}

        {milestone && <div className="recap-milestone">{milestone}</div>}

        <div className="recap-actions">
          <button className="recap-again-btn" onClick={onClose}>{UI?.again || 'Again! 🦝'}</button>
          <button className="recap-done-btn" onClick={onClose}>{UI?.thatsAll || "That's enough for today"}</button>
        </div>

      </div>
    </div>
  );
}
