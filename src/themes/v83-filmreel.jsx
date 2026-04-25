// src/themes/v83-filmreel.jsx — celluloid film reel: perforation borders, sepia tint, clapperboard header
const V83_BG_TONES = {
  nitrate:  { bg: '#0F0A05', frame: '#000000', card: '#28201A', ink: '#E8D8B8', mute: '#9C8458', rule: '#3A2818', tint: '#D4A848' },
  kodak:    { bg: '#1A1208', frame: '#080404', card: '#2A1F14', ink: '#F0DCB8', mute: '#A88858', rule: '#3A2818', tint: '#E8B458' },
  agfa:     { bg: '#181818', frame: '#000000', card: '#2A2A2A', ink: '#D8D8D0', mute: '#888880', rule: '#383838', tint: '#A8A898' },
  nightshow:{ bg: '#080A14', frame: '#000000', card: '#141A28', ink: '#D8DCE0', mute: '#7088A0', rule: '#1F2840', tint: '#5878A0' },
  vintage:  { bg: '#1F1808', frame: '#0A0804', card: '#2A1F10', ink: '#E8C898', mute: '#A07050', rule: '#3A2418', tint: '#C88838' },
  noir:     { bg: '#000000', frame: '#000000', card: '#1A1A1A', ink: '#E0DCD0', mute: '#888070', rule: '#2A2A2A', tint: '#D8C898' },
  cream:    { bg: '#E8DCC0', frame: '#1A1408', card: '#FFFCEC', ink: '#1A1408', mute: '#5A4828', rule: '#A88858', tint: '#8B5828' },
  sepia:    { bg: '#28200F', frame: '#0A0804', card: '#3A2A18', ink: '#F0D8A8', mute: '#A88858', rule: '#4A3818', tint: '#D8A858' },
  slate:    { bg: '#0F1418', frame: '#000000', card: '#1A2128', ink: '#D8DCE0', mute: '#7888A0', rule: '#2A3038', tint: '#7088A0' },
};

function V83Perforation({ side, color }) {
  return (
    <div style={{
      position: 'sticky', top: 0,
      [side]: 0, width: 28, alignSelf: 'stretch',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      paddingTop: 12, background: color, flexShrink: 0,
    }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{
          width: 14, height: 10, background: '#000', borderRadius: 2,
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
        }}/>
      ))}
    </div>
  );
}

function V83Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V83_BG_TONES[settings.themeColors.v83.bgTone] || V83_BG_TONES.nitrate;
  const accent = settings.themeColors.v83.accent;
  const { bg, frame, card, ink, mute, rule, tint } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
      display: 'flex',
    }}>
      {/* film perforations on both edges */}
      <V83Perforation side="left" color={frame}/>

      <div style={{ flex: 1, padding: '40px 30px 60px', position: 'relative' }}>
        {/* clapperboard header */}
        <div style={{
          background: '#000', color: tint, padding: '10px 16px', marginBottom: 24,
          border: `2px solid ${tint}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: '"Courier Prime",monospace', fontSize: 11, fontWeight: 800, letterSpacing: '0.2em',
          backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, ${tint}33 14px 28px)`,
        }}>
          <span>SCENE: {String(chapterIdx + 1).padStart(2, '0')}</span>
          <span>TAKE: {String((chapterIdx % 9) + 1).padStart(2, '0')}</span>
          <span>ROLL: {String(Math.floor(chapterIdx / 9) + 1).padStart(2, '0')}</span>
          <span>—</span>
          <span>DIR: {(book.author || 'A.N.').slice(0, 12).toUpperCase()}</span>
        </div>

        {/* sepia film card */}
        <article style={{
          background: card, color: ink, padding: '32px 36px',
          maxWidth: 760, margin: '0 auto',
          boxShadow: `inset 0 0 60px ${tint}22, 0 0 0 1px ${rule}`,
          position: 'relative',
        }}>
          {/* film grain noise */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>")`,
            mixBlendMode: 'overlay',
          }}/>

          <div style={{
            fontFamily: '"Courier Prime",monospace', fontSize: 10, color: tint,
            letterSpacing: '0.4em', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase',
          }}>
            ▣ REEL № {String(chapterIdx + 1).padStart(3, '0')} of {String(total).padStart(3, '0')}
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
            margin: '0 0 12px', letterSpacing: '0.04em', color: ink,
            textShadow: `0 1px 0 rgba(0,0,0,0.2)`,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26,
            fontSize: 10, color: mute, letterSpacing: '0.3em', textTransform: 'uppercase',
          }}>
            <div style={{ flex: 1, height: 0.5, background: rule }}/>
            <span>FOOTAGE BEGINS HERE</span>
            <div style={{ flex: 1, height: 0.5, background: rule }}/>
          </div>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': tint,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          <div style={{
            marginTop: 32, padding: '8px 0', textAlign: 'center',
            fontFamily: '"Courier Prime",monospace', fontSize: 10, color: mute,
            letterSpacing: '0.4em', borderTop: `0.5px dashed ${rule}`, borderBottom: `0.5px dashed ${rule}`,
          }}>
            — END OF REEL — CUT — {Math.round((chapterIdx + 1) / total * 100)}% RUNTIME —
          </div>
        </article>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, maxWidth: 760, margin: '24px auto 0' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: tint, border: `1px solid ${tint}`,
            fontFamily: '"Courier Prime",monospace', letterSpacing: '0.3em', fontSize: 10, fontWeight: 800,
          }}>◀ PREV REEL</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: tint, color: bg, border: `1px solid ${tint}`,
            fontFamily: '"Courier Prime",monospace', letterSpacing: '0.3em', fontSize: 10, fontWeight: 800,
          }}>NEXT REEL ▶</button>
        </div>
      </div>

      <V83Perforation side="right" color={frame}/>
    </main>
  );
}

function V83Footer({ book, chapterIdx, settings }) {
  const tone = V83_BG_TONES[settings.themeColors.v83.bgTone] || V83_BG_TONES.nitrate;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.frame, borderTop: `1px solid ${tone.tint}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Courier Prime",monospace', fontSize: 10, color: tone.mute, letterSpacing: '0.3em', fontWeight: 700,
    }}>
      <span style={{ color: tone.tint }}>▣ R{String(chapterIdx + 1).padStart(3, '0')}/T{String(total).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.tint }}/>
      </div>
      <span style={{ color: tone.tint }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V83Reader = V83Reader;
window.V83Footer = V83Footer;
