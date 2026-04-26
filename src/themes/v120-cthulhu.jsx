// src/themes/v120-cthulhu.jsx — Cthulhu 克蘇魯: cosmic eye + non-Euclidean tentacles + sigil margins
const V120_BG_TONES = {
  abyssgreen: { from: '#0F2828', to: '#050F0F', ink: '#A8C8C0' },
  mire:       { from: '#142824', to: '#080F0E', ink: '#A8C8B8' },
  kelp:       { from: '#0F2A20', to: '#04140A', ink: '#A0C8B0' },
  slime:      { from: '#1A2820', to: '#08140A', ink: '#B0C8A8' },
  rlyeh:      { from: '#0A1A28', to: '#040A14', ink: '#A8C0D0' },
  tentacle:   { from: '#1A1A2A', to: '#080814', ink: '#B0B0C8' },
  voidocean:  { from: '#04141A', to: '#020608', ink: '#A0B8C0' },
  fungus:     { from: '#1F2814', to: '#0E1408', ink: '#B8C098' },
  dredge:     { from: '#1A1A14', to: '#0A0A08', ink: '#B0B098' },
};

const V120_GREEK = ['', 'Ι', 'ΙΙ', 'ΙΙΙ', 'ΙV', 'V', 'VΙ', 'VΙΙ', 'VΙΙΙ', 'ΙΧ', 'Χ',
  'ΧΙ', 'ΧΙΙ', 'ΧΙΙΙ', 'ΧΙV', 'ΧV', 'ΧVΙ', 'ΧVΙΙ', 'ΧVΙΙΙ', 'ΧΙΧ', 'ΧΧ'];
function v120Numeral(n) {
  if (n <= 20) return V120_GREEK[n];
  // Fall back to plain digits wrapped in non-Euclidean sigils
  return `Ω${n}`;
}

function V120Eye({ accent, ink, size = 96 }) {
  // A staring cosmic eye — circle with vertical slit pupil, faint glow.
  const r = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden style={{ display: 'block' }}>
      <defs>
        <radialGradient id="v120iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95"/>
          <stop offset="55%" stopColor={accent} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0.05"/>
        </radialGradient>
      </defs>
      {/* outer eye almond */}
      <path d={`M${r * 0.05} ${r} Q${r} ${r * 0.18} ${r * 1.95} ${r} Q${r} ${r * 1.82} ${r * 0.05} ${r} Z`}
        fill="none" stroke={ink} strokeWidth={0.8} opacity={0.65}/>
      {/* iris */}
      <circle cx={r} cy={r} r={r * 0.55} fill="url(#v120iris)"/>
      {/* vertical slit pupil */}
      <ellipse cx={r} cy={r} rx={r * 0.08} ry={r * 0.45} fill="#000" opacity={0.95}/>
      {/* highlight */}
      <ellipse cx={r * 0.78} cy={r * 0.78} rx={r * 0.08} ry={r * 0.05} fill={accent} opacity={0.7}/>
    </svg>
  );
}

function V120Tentacle({ accent, x, y, w = 120, h = 80, flip, vflip }) {
  // Curling tentacle that frames a corner.
  const t = `${flip ? 'scaleX(-1) ' : ''}${vflip ? 'scaleY(-1) ' : ''}`.trim();
  return (
    <svg viewBox="0 0 120 80" width={w} height={h}
      style={{ position: 'absolute', left: x, top: y, transform: t || undefined, opacity: 0.22, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`v120tg-${x}-${y}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0"/>
          <stop offset="40%" stopColor={accent} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      <path d="M0 78 Q12 62 24 70 Q40 56 36 38 Q56 38 52 22 Q68 24 74 12 Q92 16 100 6 Q112 14 118 4"
        fill="none" stroke={`url(#v120tg-${x}-${y})`} strokeWidth={2.2} strokeLinecap="round"/>
      {/* suckers */}
      {[[18,68],[36,52],[52,32],[72,20],[96,12]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.6} fill={accent} opacity={0.8}/>
      ))}
    </svg>
  );
}

function V120Sigil({ accent, ink, side }) {
  // Vertical strip of arcane sigil-like glyphs along the side margin.
  const left = side === 'L';
  return (
    <div aria-hidden style={{
      position: 'absolute', top: 80, bottom: 80, [left ? 'left' : 'right']: 14,
      width: 18, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-around', opacity: 0.42, pointerEvents: 'none',
    }}>
      {['☌','⌬','⌑','〄','⏃','◉','⏀','⌖','✷'].map((g, i) => (
        <span key={i} style={{
          fontFamily: 'var(--serif)', fontSize: 14, color: i % 3 === 0 ? accent : ink,
          letterSpacing: 0, lineHeight: 1,
        }}>{g}</span>
      ))}
    </div>
  );
}

function V120Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V120_BG_TONES[settings.themeColors.v120.bgTone] || V120_BG_TONES.abyssgreen;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v120.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `radial-gradient(ellipse at 50% 110%, ${from} 0%, ${to} 75%)`,
    }}>
      {/* Faint moving-deep-water noise overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18, mixBlendMode: 'screen',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='3' seed='17'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.65  0 0 0 0 0.55  0 0 0 0.35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23c)'/></svg>")`,
      }}/>

      {/* Corner tentacles — all 4 corners, framing the page like something is gripping it */}
      <V120Tentacle accent={accent} x={-10} y={-6} w={180} h={120}/>
      <V120Tentacle accent={accent} x={'auto'} y={-6} w={180} h={120} flip/>
      <V120Tentacle accent={accent} x={-10} y={'auto'} w={180} h={120} vflip/>
      <V120Tentacle accent={accent} x={'auto'} y={'auto'} w={180} h={120} flip vflip/>
      {/* Side margin sigils — only show when viewport wide enough */}
      <V120Sigil accent={accent} ink={ink} side="L"/>
      <V120Sigil accent={accent} ink={ink} side="R"/>

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        {/* Cosmic eye centered over the chapter slug */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, filter: `drop-shadow(0 0 22px ${accent}44)` }}>
          <V120Eye accent={accent} ink={ink} size={84}/>
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.55em', color: accent,
          fontWeight: 600, marginBottom: 14, fontStyle: 'italic', textAlign: 'center', textTransform: 'uppercase',
          textShadow: `0 0 12px ${accent}55`,
        }}>
          ⌬ {v120Numeral(chapterIdx + 1)} · {v120Numeral(total)} ⌬
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.2, letterSpacing: '0.06em', textAlign: 'center',
          // Chromatic-shift "wrong" effect — slight color split on title only
          textShadow: `1px 0 0 ${accent}66, -1px 0 0 #5A2A3A55, 0 0 28px ${accent}55`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        {/* Wavering rule */}
        <svg viewBox="0 0 240 6" width="100%" height="6" aria-hidden style={{ display: 'block', marginBottom: 32 }}>
          <path d="M0 3 Q12 0 24 3 T48 3 T72 3 T96 3 T120 3 T144 3 T168 3 T192 3 T216 3 T240 3"
            fill="none" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.85"/>
        </svg>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          letterSpacing: '0.005em',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* End sigil cluster */}
        <div style={{ textAlign: 'center', marginTop: 40, color: accent, fontSize: 18, letterSpacing: '0.6em', opacity: 0.85, textShadow: `0 0 10px ${accent}66` }}>
          ⏃ ◉ ⏃
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}44`, borderRadius: 0, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em' }}>◁ 前述</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `0.5px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.18em', boxShadow: `0 0 18px ${accent}66` }}>後述 ▷</button>
        </div>
      </div>
    </main>
  );
}

function V120Footer({ book, chapterIdx, settings }) {
  const tone = V120_BG_TONES[settings.themeColors.v120.bgTone] || V120_BG_TONES.abyssgreen;
  const accent = settings.themeColors.v120.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.35em', color: accent }}>◉ {v120Numeral(chapterIdx + 1)} / {v120Numeral(total)}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
        <div style={{ position: 'absolute', top: -2, left: `calc(${progress * 100}% - 3px)`, width: 5, height: 5, borderRadius: 3, background: accent, boxShadow: `0 0 10px ${accent}` }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V120Reader = V120Reader;
window.V120Footer = V120Footer;
