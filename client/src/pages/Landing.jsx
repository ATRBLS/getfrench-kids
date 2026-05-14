import { useState } from 'react';
import './Landing.css';

const C = {
  cream: '#fff7e6', cream2: '#ffeed1', red: '#ef4444',
  sky: '#38bdf8', sun: '#fbbf24', mint: '#34d399',
  ink: '#1e1b4b', ink2: '#312e81',
};

export default function Landing() {
  return (
    <div style={{ background: C.cream, color: C.ink, minHeight: '100vh', fontFamily: "'Nunito', ui-sans-serif, system-ui, sans-serif" }}>
      <Header />
      <Hero />
      <Strip />
      <Why />
      <How />
      <Buddies />
      <ParentsCorner />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

function LogoMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 12, background: C.red, transform: 'rotate(-6deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.35)' }}>
        <span style={{ color: 'white', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16 }}>GF</span>
      </div>
      <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>
        Get<span style={{ color: C.red }}>French</span>
        <span style={{ fontSize: 13, marginLeft: 4, opacity: 0.55, fontWeight: 600 }}>Kids</span>
      </span>
    </div>
  );
}

function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255,247,230,0.88)', borderBottom: '1px solid rgba(30,27,75,0.08)' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none' }}><LogoMark /></a>
        <nav className="lnd-nav-links">
          {[['#how','How it works'],['#parents','For parents'],['#pricing','Pricing'],['#faq','FAQ']].map(([h,l]) => (
            <a key={h} href={h} style={{ fontSize: 14, fontWeight: 700, color: C.ink, textDecoration: 'none', opacity: 0.8 }}>{l}</a>
          ))}
        </nav>
        <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.red, color: 'white', borderRadius: 50, padding: '8px 18px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          Try free →
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="lnd-blob lnd-bob" style={{ top: '8%', left: '4%', width: 96, height: 96, background: C.sun }} />
      <div className="lnd-blob lnd-bob" style={{ top: '18%', right: '6%', width: 64, height: 64, background: C.mint, borderRadius: 16, animationDelay: '1s' }} />
      <div className="lnd-blob lnd-bob" style={{ bottom: '10%', left: '8%', width: 80, height: 80, background: C.sky, animationDelay: '2s' }} />

      <div className="lnd-hero-grid" style={{ maxWidth: 1152, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: C.ink, border: `2px solid ${C.ink}`, borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 700, marginBottom: 24 }}>
            <span style={{ fontSize: 18 }}>🍁</span> Made in Canada · For French immersion kids
          </div>
          <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.01em' }}>
            School teaches them French.<br />
            <span style={{ color: C.red }}>We make them speak it.</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 18, maxWidth: 440, lineHeight: 1.65, color: C.ink2 }}>
            GetFrench Kids is your kid's silly, patient, never-tired AI buddy who <strong>only speaks French</strong>. 15 minutes a day after school, and "Comment dit-on…?" turns into "Maman, écoute ça!"
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.red, color: 'white', borderRadius: 50, padding: '14px 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(239,68,68,0.35)' }}>
              🎙️ Start 7 days free
            </a>
            <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: C.ink, border: `2px solid ${C.ink}`, borderRadius: 50, padding: '14px 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              See how it works
            </a>
          </div>
          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: C.ink2 }}>
            <div style={{ display: 'flex' }}>
              {[C.sun,C.mint,C.sky,C.red].map((bg, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: bg, border: '2px solid white', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  {['👧','👦','🧒','👶'][i]}
                </div>
              ))}
            </div>
            <span><strong>2 400+</strong> familles canadiennes · <strong>4.9★</strong></span>
          </div>
        </div>
        <PhoneMock />
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div style={{ position: 'relative', maxWidth: 320, margin: '0 auto' }}>
      <div className="lnd-bob" style={{ position: 'absolute', top: -24, left: -32, zIndex: 20, transform: 'rotate(-12deg)', animationDelay: '0.5s' }}>
        <div style={{ borderRadius: 16, padding: '8px 14px', fontSize: 13, fontWeight: 700, background: C.sun, color: C.ink, border: `2px solid ${C.ink}`, boxShadow: '3px 3px 0 rgba(30,27,75,0.15)' }}>🎉 +12 mots aujourd'hui!</div>
      </div>
      <div className="lnd-bob" style={{ position: 'absolute', bottom: -16, right: -24, zIndex: 20, transform: 'rotate(10deg)', animationDelay: '1.5s' }}>
        <div style={{ borderRadius: 16, padding: '8px 14px', fontSize: 13, fontWeight: 700, background: C.mint, color: C.ink, border: `2px solid ${C.ink}`, boxShadow: '3px 3px 0 rgba(30,27,75,0.15)' }}>🔥 Streak : 7 jours</div>
      </div>
      <div style={{ background: C.ink, border: `4px solid ${C.ink}`, borderRadius: 48, padding: 12, boxShadow: '0 24px 64px rgba(30,27,75,0.35)' }}>
        <div style={{ background: C.cream2, borderRadius: 38, overflow: 'hidden' }}>
          <div style={{ padding: '24px 20px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Léo · 9 ans</span>
              <span style={{ fontSize: 10, fontWeight: 700, background: C.red, color: 'white', borderRadius: 50, padding: '2px 8px' }}>LIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="lnd-bob" style={{ width: 88, height: 88, borderRadius: '50%', background: C.sky, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, boxShadow: '4px 4px 0 rgba(30,27,75,0.2)' }}>🦝</div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, marginTop: 8 }}>Rocky</div>
              <div style={{ fontSize: 11, color: C.ink2 }}>ton ami français</div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: 'white', border: `2px solid ${C.ink}`, borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 13, maxWidth: '85%' }}>Salut Léo ! C'était quoi ton dessert ce midi ? 🍰</div>
              <div style={{ background: C.red, borderRadius: '16px 16px 4px 16px', padding: '8px 12px', fontSize: 13, maxWidth: '85%', alignSelf: 'flex-end', color: 'white' }}>Heuuu… une cookie ?</div>
              <div style={{ background: 'white', border: `2px solid ${C.ink}`, borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 13, maxWidth: '85%' }}>Presque ! On dit <strong>un biscuit</strong>. 🍪</div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              <button className="lnd-pulse" style={{ width: 64, height: 64, borderRadius: '50%', background: C.red, color: 'white', border: 'none', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎙️</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: C.ink2, marginTop: 8 }}>Appuie et parle — Rocky t'écoute</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Strip() {
  const items = ['🎙️ 100% conversationnel','🧠 S\'adapte à ton enfant','🛡️ Sécurisé & modéré','🍁 Français québécois & européen','📵 Sans pub, sans réseau social','🏆 Streaks, pas de stress'];
  const all = [...items,...items,...items];
  return (
    <div style={{ background: C.ink, color: C.cream, overflow: 'hidden', padding: '12px 0', borderTop: `1px solid ${C.ink}`, borderBottom: `1px solid ${C.ink}` }}>
      <div className="lnd-strip-track" style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap', fontSize: 14, fontWeight: 700 }}>
        {all.map((t, i) => <span key={i} style={{ opacity: 0.9, flexShrink: 0 }}>{t}</span>)}
      </div>
    </div>
  );
}

function Why() {
  const cards = [
    { icon: '💬', color: C.red, title: 'They talk. A lot.', desc: '20+ minutes of real speaking time per session — way more than a whole week of class.' },
    { icon: '😊', color: C.sun, title: 'Zero embarrassment', desc: 'Rocky never laughs at mistakes. Kids try things they\'d never say in front of classmates.' },
    { icon: '🎓', color: C.mint, title: 'Aligned with immersion', desc: 'Topics match the Canadian curriculum: school, sports, family, hockey, cabane à sucre 🍁.' },
  ];
  return (
    <section style={{ maxWidth: 1152, margin: '0 auto', padding: '96px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: C.sun, color: C.ink, borderRadius: 50, padding: '4px 14px' }}>The immersion gap</span>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
          Their school does the grammar.<br /><span style={{ color: C.red }}>We do the talking.</span>
        </h2>
        <p style={{ marginTop: 16, fontSize: 18, color: C.ink2 }}>Most immersion kids understand French — but freeze when it's time to speak. Confidence comes from <em>conversations</em>, not worksheets.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {cards.map((c, i) => (
          <div key={i} className="lnd-card-hover" style={{ background: 'white', border: `2px solid ${C.ink}`, borderRadius: 28, padding: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: c.color, transform: 'rotate(-6deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>{c.icon}</div>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{c.title}</h3>
            <p style={{ color: C.ink2, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function How() {
  const steps = [
    { n: '01', emoji: '🦝', bg: C.sky, title: 'Pick a buddy', desc: 'Rocky the raccoon, Castor the beaver, or Orignal the moose. Each has a unique personality.' },
    { n: '02', emoji: '🎙️', bg: C.sun, title: 'Tap & talk', desc: 'One big red button. Your kid speaks however they can — French, English, gibberish. Buddy replies in French.' },
    { n: '03', emoji: '🍁', bg: C.mint, title: 'Earn maple leaves', desc: 'Every conversation unlocks stickers, new buddies, and silly stories. No timers. No guilt.' },
  ];
  return (
    <section id="how" style={{ background: C.cream2, padding: '96px 0' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700 }}>Three steps. Then they're hooked.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: 'white', border: `2px solid ${C.ink}`, borderRadius: 28, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -16, right: -16, width: 96, height: 96, borderRadius: '50%', background: s.bg, opacity: 0.3 }} />
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 72, fontWeight: 700, opacity: 0.12, position: 'absolute', top: 8, right: 16, lineHeight: 1 }}>{s.n}</div>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: s.bg, border: `2px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, transform: 'rotate(-4deg)', marginBottom: 20, position: 'relative', zIndex: 1 }}>{s.emoji}</div>
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8, position: 'relative', zIndex: 1 }}>{s.title}</h3>
              <p style={{ color: C.ink2, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Buddies() {
  const buddies = [
    { name: 'Rocky', role: 'the curious raccoon', emoji: '🦝', bg: C.sky, traits: 'Loves Timbits' },
    { name: 'Castor', role: 'the chill beaver', emoji: '🦫', bg: C.sun, traits: 'Tells dad jokes' },
    { name: 'Orignal', role: 'the wise moose', emoji: '🫎', bg: C.mint, traits: 'Story master' },
    { name: 'Outarde', role: 'the silly goose', emoji: '🪿', bg: C.red, traits: 'Total goofball' },
  ];
  return (
    <section style={{ maxWidth: 1152, margin: '0 auto', padding: '96px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700 }}>
          Meet the gang. They're <span style={{ color: C.red }}>so</span> ready to chat.
        </h2>
        <p style={{ marginTop: 12, fontSize: 18, color: C.ink2 }}>Kids pick a buddy and grow with them — like a Tamagotchi who teaches French.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {buddies.map((b, i) => (
          <div key={i} className="lnd-card-hover" style={{ background: 'white', border: `2px solid ${C.ink}`, borderRadius: 28, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: b.bg, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, margin: '0 auto 16px', boxShadow: '4px 4px 0 rgba(30,27,75,0.12)' }}>{b.emoji}</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700 }}>{b.name}</div>
            <div style={{ fontSize: 13, color: C.ink2, marginTop: 2 }}>{b.role}</div>
            <div style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 700, background: C.cream2, color: C.ink, borderRadius: 50, padding: '4px 12px' }}>{b.traits}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ParentsCorner() {
  const items = [
    { icon: '🛡️', title: 'Safe by design', desc: 'No chat with strangers. No social feed. Conversations stay between your kid and the buddy. COPPA-aligned moderation.' },
    { icon: '⏱️', title: 'Built for short bursts', desc: '15 minutes after homework is plenty. Sessions auto-pause. You set daily caps in the parent dashboard.' },
    { icon: '🏆', title: 'Real progress reports', desc: 'Weekly email: new vocabulary, sentences spoken, confidence trend. Bring it to the parent-teacher meeting.' },
    { icon: '❤️', title: 'Way cheaper than tutoring', desc: 'A French tutor in Toronto = $60/hour. GetFrench Kids = $14.99/month for daily practice. Yes, daily.' },
  ];
  return (
    <section id="parents" style={{ background: C.ink, color: C.cream, padding: '96px 0' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <div className="lnd-parents-grid" style={{ marginBottom: 56 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: C.red, color: 'white', borderRadius: 50, padding: '4px 14px' }}>For parents</span>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
              You enrolled them in immersion<br /><span style={{ color: C.sun }}>for moments like this.</span>
            </h2>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.9 }}>Your kid is in immersion because you believe French opens doors — to bilingual jobs, to family in Quebec, to half of Canada. But class alone rarely gets them speaking confidently. GetFrench Kids fills the gap, at home, on the couch, in 15 minutes.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {items.map((it, i) => (
            <div key={i} style={{ background: 'rgba(255,247,230,0.08)', border: '2px solid rgba(255,247,230,0.15)', borderRadius: 28, padding: 24, display: 'flex', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: C.sun, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{it.icon}</div>
              <div>
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{it.title}</h3>
                <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.6 }}>{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const ts = [
    { q: "My daughter went from 'I don't want to talk French' to performing a puppet show in French for her grandma. After 3 weeks.", n: 'Sarah K.', r: 'Mom of Mia, Grade 4 immersion · Ottawa', bg: C.sun },
    { q: "He literally asks for screen time… to talk to a raccoon. I'll take it.", n: 'Mathieu D.', r: 'Dad of Léo, Grade 3 · Vancouver', bg: C.mint },
    { q: "His teacher noticed within a month. She asked what we changed at home.", n: 'Priya S.', r: 'Mom of Arjun, Grade 6 · Calgary', bg: C.sky },
  ];
  return (
    <section style={{ maxWidth: 1152, margin: '0 auto', padding: '96px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700 }}>
          Parents are talking. <span style={{ color: C.red }}>Kids too.</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
        {ts.map((t, i) => (
          <figure key={i} style={{ background: t.bg, border: `2px solid ${C.ink}`, borderRadius: 28, padding: 28, margin: 0, transform: `rotate(${(i % 2 ? 1 : -1) * 1.2}deg)` }}>
            <div style={{ marginBottom: 12, fontSize: 14 }}>⭐⭐⭐⭐⭐</div>
            <blockquote style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: C.ink, margin: 0 }}>"{t.q}"</blockquote>
            <figcaption style={{ marginTop: 20, fontSize: 14, fontWeight: 700, color: C.ink }}>
              <div>{t.n}</div>
              <div style={{ opacity: 0.7 }}>{t.r}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(true);
  const plans = [
    { name: 'Discover', price: { m: '$0', y: '$0' }, sub: 'Always free', desc: 'Try it with your kid this weekend.', perks: ['1 buddy','20 min total','No card needed'], cta: 'Start free', featured: false, bg: 'white' },
    { name: 'Family', price: { m: '$14.99', y: '$9.99' }, sub: yearly ? '/mo, billed yearly' : '/mo', desc: 'The plan most immersion families pick.', perks: ['All 4 buddies','Unlimited talks','Up to 2 kids','Weekly progress email','Parent dashboard'], cta: 'Start 7 days free', featured: true, bg: C.sun },
    { name: 'Tribe', price: { m: '$24.99', y: '$17.99' }, sub: yearly ? '/mo, billed yearly' : '/mo', desc: 'Big families & homeschool co-ops.', perks: ['Everything in Family','Up to 5 kids','Curriculum mode','Priority support'], cta: 'Choose Tribe', featured: false, bg: 'white' },
  ];
  return (
    <section id="pricing" style={{ background: C.cream2, padding: '96px 0' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700 }}>Less than a coffee a week.</h2>
          <p style={{ marginTop: 12, fontSize: 18, color: C.ink2 }}>Cancel anytime, in two taps.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: 'white', border: `2px solid ${C.ink}`, borderRadius: 50 }}>
            {[['Yearly · save 33%', true],['Monthly', false]].map(([l, v]) => (
              <button key={String(v)} onClick={() => setYearly(v)} style={{ padding: '8px 18px', borderRadius: 50, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', background: yearly === v ? C.red : 'transparent', color: yearly === v ? 'white' : C.ink, transition: 'all 0.15s' }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'start' }}>
          {plans.map((p) => (
            <div key={p.name} className="lnd-card-hover" style={{ background: p.bg, border: `2px solid ${C.ink}`, borderRadius: 28, padding: 28, position: 'relative', boxShadow: p.featured ? `8px 8px 0 ${C.ink}` : 'none' }}>
              {p.featured && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 12, fontWeight: 700, background: C.red, color: 'white', border: `2px solid ${C.ink}`, borderRadius: 50, padding: '4px 14px', whiteSpace: 'nowrap' }}>⭐ Most loved</div>}
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, fontWeight: 700 }}>{p.name}</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 48, fontWeight: 700 }}>{yearly ? p.price.y : p.price.m}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink2 }}>{p.sub}</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: C.ink2 }}>{p.desc}</p>
              <ul style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, padding: 0, listStyle: 'none' }}>
                {p.perks.map((f) => <li key={f} style={{ display: 'flex', gap: 8, fontSize: 14, fontWeight: 600 }}><span style={{ color: C.red, fontWeight: 900 }}>✓</span>{f}</li>)}
              </ul>
              <a href="/onboarding" style={{ display: 'block', marginTop: 24, background: p.featured ? C.red : C.ink, color: 'white', borderRadius: 50, padding: '12px', fontSize: 15, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>{p.cta}</a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, fontWeight: 600, color: C.ink2 }}>🛡️ 30-day happy kid guarantee · We refund if your child doesn't smile at Rocky.</p>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: "Will it actually help if my kid is already in immersion?", a: "That's exactly who we built it for. Immersion gives strong receptive skills — kids understand a lot. The missing piece is speaking confidence, which only comes from low-stakes practice. GetFrench Kids is that practice." },
    { q: "Is the AI safe for kids?", a: "Yes. Conversations are moderated by a child-safety layer. There's no chat with other users, no profiles, no ads, no in-app purchases. Parents control daily limits." },
    { q: "Quebec or France French?", a: "Both. By default we use Canadian French — the accent and vocab your kid hears at school and from family in Quebec. You can switch in settings." },
    { q: "What ages is it for?", a: "Designed for ages 5–14, in elementary or early high-school immersion. Younger kids love the buddies; older ones love the silly stories and challenges." },
    { q: "Can I see what my kid talked about?", a: "Yes — the parent dashboard shows topics, new vocabulary, and a confidence trend. Transcripts available on request." },
  ];
  return (
    <section id="faq" style={{ maxWidth: 720, margin: '0 auto', padding: '96px 24px' }}>
      <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Questions? We have answers.</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: 'white', border: `2px solid ${C.ink}`, borderRadius: 24, padding: 20 }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: C.ink, gap: 12 }}>
              <span>{it.q}</span>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: C.red, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
            </button>
            {open === i && <p style={{ marginTop: 12, lineHeight: 1.7, color: C.ink2 }}>{it.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 96px' }}>
      <div style={{ background: C.red, color: 'white', border: `3px solid ${C.ink}`, borderRadius: 40, padding: 'clamp(40px, 6vw, 64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: C.sun, opacity: 0.3 }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: C.sky, opacity: 0.3 }} />
        <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 700, lineHeight: 1.1, position: 'relative' }}>
          Your kid is one tap away<br />from <span style={{ color: C.sun }}>actually speaking French.</span>
        </h2>
        <p style={{ marginTop: 20, fontSize: 18, opacity: 0.9 }}>7 days free. No card. Set up in 90 seconds.</p>
        <a href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, background: 'white', color: C.ink, borderRadius: 50, padding: '16px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', position: 'relative' }}>
          🎙️ Start free now
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(30,27,75,0.1)' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '40px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <LogoMark />
          <p style={{ fontSize: 13, marginTop: 8, color: C.ink2 }}>Made with 🍁 in Canada · For families who believe in bilingualism.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {[['#how','How it works'],['#parents','For parents'],['#pricing','Pricing'],['#faq','FAQ'],['mailto:bonjour@getfrench.app','Contact']].map(([href,label]) => (
            <a key={href} href={href} style={{ fontSize: 14, fontWeight: 600, color: C.ink2, textDecoration: 'none', opacity: 0.8 }}>{label}</a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.ink2 }}>© {new Date().getFullYear()} GetFrench Kids</div>
      </div>
    </footer>
  );
}
