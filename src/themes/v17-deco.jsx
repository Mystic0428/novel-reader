// src/themes/v17-deco.jsx — Art Deco: black + gold, geometric rays, double-outlined frame
function DecoFan({ color, size = 100 }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
      <g stroke={color} strokeWidth={1} fill="none">
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 8) * Math.PI;
          const x2 = 50 + Math.cos(Math.PI + a) * 48;
          const y2 = 60 + Math.sin(Math.PI + a) * 48;
          return <line key={i} x1={50} y1={60} x2={x2} y2={y2}/>;
        })}
        <path d="M 2 60 A 48 48 0 0 1 98 60"/>
        <path d="M 14 60 A 36 36 0 0 1 86 60"/>
        <path d="M 26 60 A 24 24 0 0 1 74 60"/>
        <circle cx={50} cy={60} r={4} fill={color}/>
      </g>
    </svg>
  );
}

function DecoRays({ color }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.08, pointerEvents: 'none' }}>
      <svg width="800" height="800" viewBox="-400 -400 800 800">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 400} y2={Math.sin(a) * 400} stroke={color} strokeWidth="0.6"/>;
        })}
      </svg>
    </div>
  );
}

const V17_BG_TONES = {
  onyx:     { bg: '#0A0A0A', bg2: '#141414' },
  navy:     { bg: '#0B1532', bg2: '#14203F' },
  wine:     { bg: '#1A0A0E', bg2: '#241318' },
  forest:   { bg: '#0A1A12', bg2: '#142A1F' },
  plum:     { bg: '#1A0F1F', bg2: '#241930' },
  oxblood:  { bg: '#1F0A0A', bg2: '#2B1313' },
  graphite: { bg: '#0F1418', bg2: '#171C20' },
  cobalt:   { bg: '#0A1438', bg2: '#15214E' },
  teal:     { bg: '#0A1A1F', bg2: '#142A30' },
};

function V17Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v17;
  const gold = colors.accent;
  const goldL = '#F0D274';
  const tone = V17_BG_TONES[colors.bgTone] || V17_BG_TONES.onyx;
  const bg = tone.bg, bg2 = tone.bg2, ink = '#F0E6CC', soft = 'rgba(240,230,204,0.78)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin"
      style={{ flex: 1, background: bg, color: ink, padding: '32px 0', position: 'relative', overflow: 'auto', fontFamily: 'var(--ui)' }}>
      <DecoRays color={gold}/>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <DecoFan color={gold} size={120}/>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 11, color: gold, letterSpacing: '0.8em', fontWeight: 500 }}>CHAPTER</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 64, color: goldL, letterSpacing: 0, fontWeight: 400, lineHeight: 1, margin: '-4px 0' }}>{toRomanV17(chapterIdx + 1)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 80, height: 1, background: gold }}/>
            <div style={{ width: 6, height: 6, border: `1px solid ${gold}`, transform: 'rotate(45deg)' }}/>
            <div style={{ width: 80, height: 1, background: gold }}/>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 10, fontWeight: 400, margin: '16px 0 0', letterSpacing: '0.3em', color: ink }}>
            {stripChapterPrefix(chapterTitle)}
          </h1>
        </div>
        <div style={{ position: 'relative', padding: '40px 44px', background: bg2, border: `1px solid ${gold}`, outline: `3px double ${gold}`, outlineOffset: '4px' }}>
          {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y], i) => (
            <div key={i} style={{
              position: 'absolute', width: 16, height: 16,
              left: x === 0 ? -4 : 'auto', right: x === 1 ? -4 : 'auto',
              top: y === 0 ? -4 : 'auto', bottom: y === 1 ? -4 : 'auto',
              background: gold, transform: 'rotate(45deg)',
            }}/>
          ))}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>
        <div style={{ textAlign: 'center', marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <DecoFan color={gold} size={80}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: `1px solid ${gold}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: goldL, border: `1px solid ${gold}`, letterSpacing: '0.2em', fontFamily: 'var(--serif)' }}>← PRÆCEDENS</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: goldL, border: `1px solid ${gold}`, letterSpacing: '0.2em', fontFamily: 'var(--serif)' }}>SEQUENS →</button>
        </div>
      </div>
    </main>
  );
}

function V17Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v17;
  const gold = colors.accent;
  const tone = V17_BG_TONES[colors.bgTone] || V17_BG_TONES.onyx;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `2px solid ${gold}`, display: 'flex', alignItems: 'center', gap: 18,
      fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(240,230,204,0.5)', letterSpacing: '0.3em',
      background: tone.bg,
    }}>
      <span>{toRomanV17(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.3)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold }}/>
      </div>
      <span>{toRomanV17(total)}</span>
    </div>
  );
}

function toRomanV17(n) {
  if (!n || n < 1) return '';
  if (n > 3999) return String(n);
  const map = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
  let out = '', x = n;
  for (const [s, v] of map) { while (x >= v) { out += s; x -= v; } }
  return out;
}

window.V17Reader = V17Reader;
window.V17Footer = V17Footer;
