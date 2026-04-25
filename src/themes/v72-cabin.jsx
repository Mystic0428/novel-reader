// src/themes/v72-cabin.jsx — mountain cabin: wood grain, carved title, antler/pinecone vibes
const V72_BG_TONES = {
  pine:       { bg: '#3A2818', surface: '#4A3422', plank: '#2A1808', ink: '#E8D8B8', mute: '#A88858', rule: '#5A4028' },
  birch:      { bg: '#E0D0B0', surface: '#D0C098', plank: '#C8B888', ink: '#1A140A', mute: '#5A4828', rule: '#A89058' },
  ebony:      { bg: '#1A100A', surface: '#241608', plank: '#0F0804', ink: '#D8C8A0', mute: '#9C8048', rule: '#3A2818' },
  spruce:     { bg: '#1F2818', surface: '#2A3424', plank: '#141A0F', ink: '#E0D8B0', mute: '#90A078', rule: '#3A4830' },
  maple:      { bg: '#3A1F14', surface: '#4A2A1F', plank: '#2A1208', ink: '#F0D8B0', mute: '#B88858', rule: '#5A2818' },
  driftwood:  { bg: '#9C9088', surface: '#888078', plank: '#787068', ink: '#1A1410', mute: '#48403A', rule: '#5A5048' },
  charred:    { bg: '#0F0A05', surface: '#1A1208', plank: '#040202', ink: '#E0C098', mute: '#9C7848', rule: '#2A1808' },
  snowy:      { bg: '#E8E4D8', surface: '#D8D4C8', plank: '#C8C4B8', ink: '#1A1410', mute: '#5A5448', rule: '#A8A498' },
  twilight:   { bg: '#28203A', surface: '#34284A', plank: '#1A1428', ink: '#E0D8C8', mute: '#A098B0', rule: '#3A3050' },
};

function V72Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V72_BG_TONES[settings.themeColors.v72.bgTone] || V72_BG_TONES.pine;
  const accent = settings.themeColors.v72.accent;
  const { bg, surface, plank, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: 0, position: 'relative',
      fontFamily: '"EB Garamond","Cormorant Garamond",var(--serif)',
      background: `repeating-linear-gradient(90deg, ${bg} 0 38px, ${plank} 38px 40px, ${bg} 40px 80px)`,
    }}>
      {/* wood grain noise */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='80'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='0.04 1.8' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23w)'/></svg>")`,
      }}/>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '50px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* burned-in cabin sign */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 24px',
            background: surface, border: `2px solid ${accent}`,
            boxShadow: `inset 0 0 0 4px ${bg}, inset 0 0 0 6px ${accent}`,
            fontSize: 11, fontWeight: 800, letterSpacing: '0.4em', color: accent,
            textTransform: 'uppercase',
          }}>
            <span>🌲</span>
            <span>Logbook · Vol. {chapterIdx + 1}</span>
            <span>🌲</span>
          </div>
        </div>

        {/* carved title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
          textAlign: 'center', margin: '0 0 8px', letterSpacing: '0.04em', color: ink,
          textShadow: `0 1px 0 rgba(0,0,0,0.4), 0 -1px 0 rgba(255,255,255,0.08)`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{
          textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic',
          marginBottom: 28, letterSpacing: '0.15em',
        }}>
          ❦ entry no. {chapterIdx + 1} of {total} ❦
        </div>

        {/* axe-cut divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 2, background: accent, opacity: 0.6 }}/>
          <span style={{ color: accent, fontSize: 14 }}>⛰</span>
          <div style={{ flex: 1, height: 2, background: accent, opacity: 0.6 }}/>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end ornament */}
        <div style={{
          textAlign: 'center', marginTop: 36, color: accent, fontSize: 16, letterSpacing: '0.6em',
        }}>
          🌲 ⛰ 🌲
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingTop: 18, borderTop: `2px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: surface, color: ink, border: `1.5px solid ${rule}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>← prior trail</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: accent, color: bg, border: `1.5px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12, fontWeight: 700,
          }}>onward →</button>
        </div>
      </article>
    </main>
  );
}

function V72Footer({ book, chapterIdx, settings }) {
  const tone = V72_BG_TONES[settings.themeColors.v72.bgTone] || V72_BG_TONES.pine;
  const accent = settings.themeColors.v72.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.plank, borderTop: `2px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accent }}>⛰ entry {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V72Reader = V72Reader;
window.V72Footer = V72Footer;
