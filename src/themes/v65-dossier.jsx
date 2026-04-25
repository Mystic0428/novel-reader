// src/themes/v65-dossier.jsx — true-crime dossier: manila folder, REDACTED bars, evidence stamp, typewriter
const V65_BG_TONES = {
  manila:   { bg: '#E8D89C', surface: '#D8C786', ink: '#1F1808', mute: '#6B5828', rule: '#9C8848' },
  redacted: { bg: '#1A1A1F', surface: '#262630', ink: '#D8D4C8', mute: '#8C8478', rule: '#404048' },
  evidence: { bg: '#2A3038', surface: '#363D48', ink: '#D8DCE0', mute: '#9098A0', rule: '#4A525E' },
  noir:     { bg: '#0A0A0A', surface: '#161616', ink: '#E0DCD0', mute: '#888478', rule: '#2A2A2A' },
  carbon:   { bg: '#3A3A3A', surface: '#484848', ink: '#E0E0E0', mute: '#A0A0A0', rule: '#5A5A5A' },
  field:    { bg: '#D8C8A0', surface: '#C8B890', ink: '#1F1408', mute: '#6B5028', rule: '#9C8048' },
  legal:    { bg: '#E0E0E8', surface: '#D0D0D8', ink: '#0A1228', mute: '#4848A8', rule: '#9098B8' },
  night:    { bg: '#0A0F1A', surface: '#141A28', ink: '#D0D8E0', mute: '#7C8898', rule: '#1F2840' },
  rust:     { bg: '#2A1A14', surface: '#3A2A20', ink: '#E0CCB8', mute: '#9C7858', rule: '#4A2C1F' },
};

function V65Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V65_BG_TONES[settings.themeColors.v65.bgTone] || V65_BG_TONES.manila;
  const accent = settings.themeColors.v65.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  const isLight = bg === '#E8D89C' || bg === '#D8C8A0' || bg === '#E0E0E8';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Special Elite","Courier New",var(--mono)',
    }}>
      {/* manila grain */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>")`,
      }}/>

      {/* CONFIDENTIAL stamp top-right */}
      <div style={{
        position: 'absolute', top: 28, right: 32,
        transform: 'rotate(-8deg)',
        border: `2.5px solid ${accent}`, padding: '6px 14px',
        color: accent, fontFamily: '"Courier New",monospace', fontWeight: 900,
        fontSize: 12, letterSpacing: '0.4em', opacity: 0.7,
        zIndex: 2,
      }}>
        CONFIDENTIAL
      </div>

      <article style={{ maxWidth: 700, margin: '0 auto', padding: '50px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* dossier header */}
        <div style={{
          fontFamily: '"Courier New",monospace', fontSize: 10, color: mute,
          marginBottom: 6, letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          CASE FILE № {String(chapterIdx + 1).padStart(4, '0')} · DOC. {String(chapterIdx + 1).padStart(2, '0')} OF {String(total).padStart(2, '0')}
        </div>
        <div style={{ height: 2, background: ink, marginBottom: 14 }}/>

        {/* file metadata table */}
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 1fr', gap: '4px 14px',
          fontFamily: '"Courier New",monospace', fontSize: 11, color: ink, marginBottom: 24,
        }}>
          <div style={{ color: mute, textTransform: 'uppercase' }}>SUBJECT:</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
          <div style={{ color: mute, textTransform: 'uppercase' }}>FILED BY:</div>
          <div>{book.author || '████████'}</div>
          <div style={{ color: mute, textTransform: 'uppercase' }}>STATUS:</div>
          <div style={{ color: accent }}>OPEN — IN PROGRESS</div>
        </div>

        {/* evidence-tag chapter title */}
        <div style={{
          background: accent, color: bg, padding: '4px 10px', display: 'inline-block',
          fontFamily: '"Courier New",monospace', fontSize: 10, fontWeight: 900,
          letterSpacing: '0.3em', marginBottom: 10,
        }}>
          EVIDENCE №{String(chapterIdx + 1).padStart(3, '0')}
        </div>
        <h1 style={{
          fontFamily: '"Special Elite","Courier New",monospace',
          fontSize: settings.tweaks.fontSize + 10, fontWeight: 700,
          margin: '0 0 8px', letterSpacing: '0.02em', color: ink,
          textTransform: 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ height: 1, background: ink, opacity: 0.4, marginBottom: 28 }}/>

        {/* body — typewriter */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Special Elite","Courier New",monospace', color: ink,
          fontSize: settings.tweaks.fontSize - 1, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'left',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* file end stamp */}
        <div style={{
          marginTop: 36, padding: '14px 18px', border: `1.5px dashed ${ink}`,
          fontFamily: '"Courier New",monospace', fontSize: 10, color: mute,
          letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center',
        }}>
          — END OF DOCUMENT — {Math.round((chapterIdx + 1) / total * 100)}% INVESTIGATION COMPLETE —
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 14px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.25em', fontSize: 10, fontWeight: 700,
          }}>◀ PREV DOC</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 14px', borderRadius: 0,
            background: ink, color: bg, border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.25em', fontSize: 10, fontWeight: 700,
          }}>NEXT DOC ▶</button>
        </div>
      </article>
    </main>
  );
}

function V65Footer({ book, chapterIdx, settings }) {
  const tone = V65_BG_TONES[settings.themeColors.v65.bgTone] || V65_BG_TONES.manila;
  const accent = settings.themeColors.v65.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Courier New",monospace', fontSize: 10, color: tone.mute, letterSpacing: '0.3em', fontWeight: 700,
    }}>
      <span style={{ color: accent }}>FILE {String(chapterIdx + 1).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V65Reader = V65Reader;
window.V65Footer = V65Footer;
