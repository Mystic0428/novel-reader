// src/themes/v33-cyberpunk.jsx — Night City library: neon magenta/cyan on deep purple, HUD
const V33_BG_TONES = {
  violet:    { bg: '#050218', bg2: '#0A0625' },
  midnight:  { bg: '#020611', bg2: '#060D1F' },
  emerald:   { bg: '#02100C', bg2: '#061A13' },
  blood:     { bg: '#120210', bg2: '#1A051A' },
  azure:     { bg: '#020818', bg2: '#0A142E' },
  smoke:     { bg: '#0A0A12', bg2: '#12121E' },
  neon:      { bg: '#0E0218', bg2: '#180628' },
  plasma:    { bg: '#0E0820', bg2: '#180D32' },
  darkrose:  { bg: '#160510', bg2: '#22081A' },
};

function V33Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V33_BG_TONES[settings.themeColors.v33.bgTone] || V33_BG_TONES.violet;
  const magenta = settings.themeColors.v33.accent;
  const cyan = '#00F0FF', yellow = '#FFE838', green = '#39FF88', purple = '#8E3DF0';
  const { bg, bg2 } = tone;
  const ink = '#E8E4FF', mute = 'rgba(232,228,255,0.55)', soft = 'rgba(232,228,255,0.85)';
  const grid = `linear-gradient(${cyan}22 1px, transparent 1px), linear-gradient(90deg, ${cyan}22 1px, transparent 1px)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink,
      background: `radial-gradient(ellipse at 20% 20%, ${purple}33 0%, transparent 50%),
                   radial-gradient(ellipse at 80% 80%, ${magenta}33 0%, transparent 50%),
                   linear-gradient(180deg, ${bg2} 0%, ${bg} 100%)`,
      fontFamily: '"JetBrains Mono",ui-monospace,monospace', position: 'relative', overflow: 'auto', padding: 0,
    }}>
      {/* perspective grid */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: grid,
        backgroundSize: '40px 40px', opacity: 0.3, pointerEvents: 'none',
        maskImage: 'linear-gradient(180deg, black 0%, transparent 70%)',
        WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 70%)',
      }}/>
      {/* scanlines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.04) 2px 3px)` }}/>

      <header style={{
        padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: `1px solid ${cyan}55`, background: 'rgba(0,0,0,0.35)', zIndex: 1, position: 'relative',
      }}>
        <div style={{ color: magenta, fontSize: 12, letterSpacing: '0.2em', fontWeight: 700 }}>
          [ NIGHT_CITY://library ]
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 10, fontSize: 11, color: mute }}>
          <span>status: <span style={{ color: green }}>● ONLINE</span></span>
          <span>enc: <span style={{ color: yellow }}>AES-256</span></span>
        </div>
        <div style={{ fontSize: 12, color: cyan, fontFamily: 'var(--sans)', letterSpacing: '0.3em' }}>
          {book.title}
        </div>
      </header>

      <div style={{ padding: '24px 40px', maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: Math.min(42, settings.tweaks.fontSize * 2 + 6),
            color: ink, letterSpacing: '0.04em', fontWeight: 700, lineHeight: 1,
            textShadow: `3px 0 ${magenta}, -3px 0 ${cyan}`,
          }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ fontSize: 11, color: cyan, letterSpacing: '0.3em', marginTop: 8 }}>
            [ ch_{String(chapterIdx + 1).padStart(2, '0')}.md ] // SECTOR {String(chapterIdx + 1).padStart(3, '0')} // {book.author || 'ANONYMOUS'}
          </div>
        </div>

        <div style={{ margin: '0 0 14px', color: mute, fontSize: 12, fontFamily: 'var(--mono)' }}>
          &gt; decrypting ... <span style={{ color: green }}>OK</span>
          <br/>&gt; rendering chapter_{String(chapterIdx + 1).padStart(2, '0')} ...
        </div>

        <div className="reading-body v33-body" style={book.preserveOriginalCss ? undefined : {
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
          fontFamily: '"Noto Sans TC","Noto Sans JP",sans-serif',
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ margin: '20px 0 0', color: green, fontFamily: 'var(--mono)', fontSize: 12 }}>
          &gt; _<span className="v33-cursor">█</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${cyan}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: cyan, border: `1px solid ${cyan}`, fontFamily: 'var(--mono)', letterSpacing: '0.2em', boxShadow: `0 0 12px ${cyan}33` }}>&lt; PREV.exe</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: magenta, border: `1px solid ${magenta}`, fontFamily: 'var(--mono)', letterSpacing: '0.2em', boxShadow: `0 0 12px ${magenta}33` }}>NEXT.exe &gt;</button>
        </div>
      </div>
      <style>{`@keyframes v33-blink { 50% { opacity: 0 } } .v33-cursor { animation: v33-blink 1s steps(2) infinite } .v33-body p:first-of-type::first-letter { color: ${magenta}; font-weight: 700; font-size: 1.4em; text-shadow: 0 0 16px ${magenta}; }`}</style>
    </main>
  );
}

function V33Footer({ book, chapterIdx, settings }) {
  const tone = V33_BG_TONES[settings.themeColors.v33.bgTone] || V33_BG_TONES.violet;
  const magenta = settings.themeColors.v33.accent;
  const cyan = '#00F0FF';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', borderTop: `1px solid ${cyan}55`, background: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 10, color: 'rgba(232,228,255,0.55)', letterSpacing: '0.2em', fontFamily: 'var(--mono)',
    }}>
      <span>[CH_{String(chapterIdx + 1).padStart(3, '0')}/{String(total).padStart(3, '0')}]</span>
      <div style={{ flex: 1, height: 2, background: `${cyan}22`, margin: '0 16px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: magenta, boxShadow: `0 0 8px ${magenta}` }}/>
      </div>
      <span style={{ color: magenta }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V33Reader = V33Reader;
window.V33Footer = V33Footer;
