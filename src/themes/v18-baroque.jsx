// src/themes/v18-baroque.jsx — Baroque: wine red + gold, damask pattern, portrait-initial
function BaroqueFlourish({ color, deep, mirror = false }) {
  return (
    <svg width="260" height="24" viewBox="0 0 260 24" style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}>
      <g fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round">
        <path d="M130 12 q-30 -14 -60 -4 q-20 6 -40 -2 q-12 -4 -20 0"/>
        <path d="M130 12 q30 -14 60 -4 q20 6 40 -2 q12 -4 20 0"/>
        <path d="M30 8 q-3 -6 -10 -2 q6 0 10 2 z" fill={color} fillOpacity="0.4"/>
        <path d="M230 8 q3 -6 10 -2 q-6 0 -10 2 z" fill={color} fillOpacity="0.4"/>
        <path d="M70 10 q-4 -4 -8 -2"/>
        <path d="M190 10 q4 -4 8 -2"/>
        <circle cx="130" cy="12" r="4" fill={color}/>
        <circle cx="130" cy="12" r="1.5" fill={deep}/>
      </g>
    </svg>
  );
}

const V18_BG_TONES = {
  burgundy: { bg: '#3B0F14', bg2: '#4A1A1F', deep: '#220609' },
  forest:   { bg: '#102619', bg2: '#1A3423', deep: '#081610' },
  royal:    { bg: '#0F1A3B', bg2: '#1A2650', deep: '#080F22' },
  midnight: { bg: '#1A0F2B', bg2: '#281A3D', deep: '#0F0819' },
  emerald:  { bg: '#0F2E2A', bg2: '#1A3F3A', deep: '#081A17' },
  amber:    { bg: '#2D1A08', bg2: '#3D2613', deep: '#1A0E04' },
  charcoal: { bg: '#161613', bg2: '#22221E', deep: '#0A0A09' },
  oxblood:  { bg: '#260A0F', bg2: '#321319', deep: '#150508' },
  plum:     { bg: '#1F0F26', bg2: '#2D1A37', deep: '#120814' },
};

function V18Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v18;
  const gold = colors.accent;
  const tone = V18_BG_TONES[colors.bgTone] || V18_BG_TONES.burgundy;
  const bg = tone.bg, bg2 = tone.bg2, deep = tone.deep;
  const ink = '#F2E4C3', soft = 'rgba(242,228,195,0.78)';
  const initialSize = (settings.tweaks.fontSize + 8) * 2.2;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin"
      style={{
        flex: 1, overflow: 'auto', padding: '36px 0', position: 'relative',
        color: ink, fontFamily: 'var(--serif)', '--accent': gold,
        background: `radial-gradient(ellipse at top, ${bg2} 0%, ${bg} 50%, ${deep} 100%)`,
      }}>
      {/* damask pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='none' stroke='%23D6B371' stroke-width='0.6'><path d='M40 10 q14 0 14 14 q0 14 -14 14 q-14 0 -14 -14 q0 -14 14 -14 z'/><path d='M40 26 q6 0 6 6 q0 6 -6 6 q-6 0 -6 -6 q0 -6 6 -6 z'/></g></svg>")`,
      }}/>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <BaroqueFlourish color={gold} deep={deep}/>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: gold, letterSpacing: '0.6em', marginBottom: 8 }}>
            CAPUT · {toRomanV17(chapterIdx + 1)}
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 500,
            margin: '6px 0 0', letterSpacing: '0.25em', color: ink, textShadow: `0 1px 0 ${deep}`,
          }}>
            {stripChapterPrefix(chapterTitle)}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <BaroqueFlourish color={gold} deep={deep} mirror/>
          </div>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
        }} dangerouslySetInnerHTML={{ __html: book.preserveOriginalCss ? html : injectDropCap(html, settings.tweaks.fontSize * 2.2) }}/>

        <div style={{ textAlign: 'center', margin: '28px 0 0', color: gold, fontFamily: 'var(--serif)', fontSize: 18, letterSpacing: '0.4em' }}>
          ✦　✧　✦
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: `1px dashed rgba(214,179,113,0.3)` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3,
            background: 'rgba(0,0,0,0.3)', color: gold, border: `1px solid ${gold}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.15em',
          }}>← caput præcedens</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3,
            background: 'rgba(0,0,0,0.3)', color: gold, border: `1px solid ${gold}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.15em',
          }}>caput sequens →</button>
        </div>
      </div>
    </main>
  );
}

function V18Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v18;
  const gold = colors.accent;
  const tone = V18_BG_TONES[colors.bgTone] || V18_BG_TONES.burgundy;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `1px solid rgba(214,179,113,0.4)`, display: 'flex', alignItems: 'center', gap: 18,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: 'rgba(242,228,195,0.6)', letterSpacing: '0.2em',
      background: tone.deep,
    }}>
      <span>pag. {toRomanV17(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(214,179,113,0.3)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold }}/>
      </div>
      <span>ex {toRomanV17(total)}</span>
    </div>
  );
}

window.V18Reader = V18Reader;
window.V18Footer = V18Footer;
