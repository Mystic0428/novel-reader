// src/themes/v78-fieldjournal.jsx — researcher's expedition logbook: legal pad lines, date stamp, hand annotation
const V78_BG_TONES = {
  legal:      { bg: '#F8E89C', surface: '#E8D88C', ink: '#1A1A0A', mute: '#5A5A28', rule: '#A89048', line: 'rgba(80,90,160,0.25)' },
  field:      { bg: '#E8D8B8', surface: '#D8C8A8', ink: '#1A1408', mute: '#6B5028', rule: '#A88858', line: 'rgba(80,90,140,0.2)' },
  expedition: { bg: '#0F1F18', surface: '#1A2D24', ink: '#E0E8C8', mute: '#90A878', rule: '#1F3A2A', line: 'rgba(160,200,180,0.15)' },
  mountain:   { bg: '#1F2838', surface: '#2A3448', ink: '#E0E8F0', mute: '#90A0B8', rule: '#3A4858', line: 'rgba(180,200,220,0.18)' },
  desert:     { bg: '#E8D8A8', surface: '#D8C898', ink: '#2A1808', mute: '#6B4828', rule: '#B89058', line: 'rgba(140,80,40,0.18)' },
  arctic:     { bg: '#E8EEF0', surface: '#D8DEE0', ink: '#0A1828', mute: '#5878A0', rule: '#A8C0D8', line: 'rgba(80,120,170,0.22)' },
  jungle:     { bg: '#1A2A14', surface: '#243422', ink: '#E0E8C0', mute: '#90A878', rule: '#2A4220', line: 'rgba(160,200,180,0.16)' },
  safari:     { bg: '#D8C898', surface: '#C8B888', ink: '#2A1808', mute: '#6B4828', rule: '#A88848', line: 'rgba(120,90,40,0.2)' },
  midnight:   { bg: '#0A0F1A', surface: '#141A28', ink: '#E0E4F0', mute: '#7088A8', rule: '#1F2840', line: 'rgba(120,160,220,0.18)' },
};

function V78Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V78_BG_TONES[settings.themeColors.v78.bgTone] || V78_BG_TONES.legal;
  const accent = settings.themeColors.v78.accent;
  const { bg, surface, ink, mute, rule, line } = tone;
  const total = book.chaptersMeta.length;
  // ruled paper
  const lineSpacing = settings.tweaks.fontSize * settings.tweaks.lineHeight;
  const ruled = `repeating-linear-gradient(0deg, transparent 0 ${lineSpacing - 1}px, ${line} ${lineSpacing - 1}px ${lineSpacing}px)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Caveat","Marker Felt",cursive',
    }}>
      <article style={{ maxWidth: 700, margin: '0 auto', padding: '40px 50px 60px', position: 'relative' }}>
        {/* red margin line on the left */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 60, width: 1.5,
          background: '#E04848', opacity: 0.5,
        }}/>

        {/* date stamp top-right */}
        <div style={{
          position: 'absolute', top: 30, right: 30, transform: 'rotate(-3deg)',
          padding: '6px 14px', border: `2px solid ${accent}`,
          fontFamily: '"Courier New",monospace', fontSize: 10, fontWeight: 800, letterSpacing: '0.3em',
          color: accent, opacity: 0.7,
        }}>
          DAY № {String(chapterIdx + 1).padStart(3, '0')}
        </div>

        {/* expedition header */}
        <div style={{
          fontFamily: '"Caveat",cursive', fontSize: 20, color: accent,
          marginBottom: 4, letterSpacing: '0.04em',
        }}>
          ~ Field Notes, day {chapterIdx + 1} ~
        </div>
        <div style={{
          fontFamily: '"Courier New",monospace', fontSize: 10, color: mute, letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: 20,
        }}>
          PI: {(book.author || 'unknown').toUpperCase()} · STUDY: {book.title.slice(0, 36)}
        </div>

        {/* handwritten title */}
        <h1 style={{
          fontFamily: '"Caveat",cursive', fontSize: settings.tweaks.fontSize + 18, fontWeight: 600,
          margin: '0 0 8px', letterSpacing: '0.02em', color: ink, lineHeight: 1.1,
          borderBottom: `1.5px solid ${accent}`, paddingBottom: 6,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* body — keep readable on ruled paper */}
        <div style={{
          padding: `${settings.tweaks.fontSize * 0.4}px 0`,
          backgroundImage: ruled,
          backgroundPosition: `0 ${settings.tweaks.fontSize * 0.4}px`,
        }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        {/* margin annotation */}
        <div style={{
          marginTop: 24, transform: 'rotate(-1deg)',
          padding: '8px 14px', display: 'inline-block',
          fontFamily: '"Caveat",cursive', fontSize: 18, color: accent,
          borderLeft: `3px solid ${accent}`, fontStyle: 'italic',
        }}>
          → see entry no. {chapterIdx + 2} for follow-up...
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 14, borderTop: `1.5px dashed ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '6px 14px', borderRadius: 6,
            background: 'transparent', color: mute, border: `1px dashed ${rule}`,
            fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic',
          }}>‹ yesterday</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '6px 14px', borderRadius: 6,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic', fontWeight: 600,
          }}>tomorrow ›</button>
        </div>
      </article>
    </main>
  );
}

function V78Footer({ book, chapterIdx, settings }) {
  const tone = V78_BG_TONES[settings.themeColors.v78.bgTone] || V78_BG_TONES.legal;
  const accent = settings.themeColors.v78.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `1.5px dashed ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat",cursive', fontSize: 14, fontStyle: 'italic', color: tone.mute,
    }}>
      <span style={{ color: accent }}>~ day {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V78Reader = V78Reader;
window.V78Footer = V78Footer;
