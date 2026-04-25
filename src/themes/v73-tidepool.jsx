// src/themes/v73-tidepool.jsx — coastal tide pool: sea-glass cyan, wave curves, shell motif
const V73_BG_TONES = {
  seafoam:    { bg: '#E0EEEC', surface: '#D0E2DE', ink: '#0A2A28', mute: '#508580', rule: '#A8C8C0', wave: '#7CB8B0' },
  deepwater:  { bg: '#0A2228', surface: '#143038', ink: '#D8E8E8', mute: '#80A8A8', rule: '#1F4048', wave: '#3C7888' },
  sand:       { bg: '#E8DCC0', surface: '#D8CCB0', ink: '#1A1408', mute: '#5A4828', rule: '#A89070', wave: '#B89868' },
  coral:      { bg: '#F0D8C8', surface: '#E0C8B8', ink: '#3A1818', mute: '#80584C', rule: '#B89888', wave: '#D88878' },
  kelp:       { bg: '#1F2818', surface: '#2A3424', ink: '#D8E0B0', mute: '#90A878', rule: '#3A4828', wave: '#608C50' },
  pearl:      { bg: '#F0EEE8', surface: '#E0DED8', ink: '#1A1820', mute: '#585060', rule: '#A8A0B0', wave: '#9890A0' },
  sunset:     { bg: '#3A1818', surface: '#4A1F1F', ink: '#F8D8A0', mute: '#B88858', rule: '#5A2828', wave: '#FF7848' },
  storm:      { bg: '#28303A', surface: '#34404A', ink: '#D8DCE0', mute: '#9098A0', rule: '#48505A', wave: '#7C90A0' },
  abyss:      { bg: '#0A1828', surface: '#142340', ink: '#C8DCEC', mute: '#7090B0', rule: '#1F2F50', wave: '#406088' },
};

function V73WaveLine({ color, opacity, height = 24 }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 600 24" preserveAspectRatio="none" style={{ display: 'block', opacity }}>
      <path d="M0 12 Q60 4 120 12 T 240 12 T 360 12 T 480 12 T 600 12"
        fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M0 16 Q60 8 120 16 T 240 16 T 360 16 T 480 16 T 600 16"
        fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

function V73Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V73_BG_TONES[settings.themeColors.v73.bgTone] || V73_BG_TONES.seafoam;
  const accent = settings.themeColors.v73.accent;
  const { bg, surface, ink, mute, rule, wave } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, padding: 0, position: 'relative', color: ink,
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
      background: `linear-gradient(180deg, ${surface} 0%, ${bg} 60%, ${surface} 100%)`,
    }}>
      {/* faint shell pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g fill='none' stroke='${encodeURIComponent(wave)}' stroke-width='0.8'><path d='M60 30 Q40 50 30 80 Q60 90 90 80 Q80 50 60 30 Z'/><path d='M60 40 Q50 55 45 75 M60 40 Q70 55 75 75'/></g></svg>")`,
      }}/>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* top wave line */}
        <V73WaveLine color={wave} opacity={0.7}/>

        {/* tide entry header */}
        <div style={{ textAlign: 'center', margin: '20px 0 8px' }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 600,
          }}>
            ◌ Tide № {String(chapterIdx + 1).padStart(2, '0')} ◌
          </div>
        </div>

        {/* italic title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 14, fontWeight: 500,
          textAlign: 'center', margin: '4px 0 12px', letterSpacing: '0.02em', color: ink,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{
          textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic',
          marginBottom: 28, letterSpacing: '0.15em',
        }}>
          ~ found at low tide ~
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* shell mark */}
        <div style={{
          textAlign: 'center', marginTop: 32, fontSize: 18, color: accent, letterSpacing: '0.5em',
        }}>
          ◌ ~ ◌
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 16, borderTop: `0.5px dashed ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 18,
            background: 'transparent', color: ink, border: `1px solid ${rule}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>← receding tide</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 18,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12, fontWeight: 600,
          }}>rising tide →</button>
        </div>

        {/* bottom wave line */}
        <div style={{ marginTop: 22 }}>
          <V73WaveLine color={wave} opacity={0.5}/>
        </div>
      </article>
    </main>
  );
}

function V73Footer({ book, chapterIdx, settings }) {
  const tone = V73_BG_TONES[settings.themeColors.v73.bgTone] || V73_BG_TONES.seafoam;
  const accent = settings.themeColors.v73.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accent }}>◌ tide {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V73Reader = V73Reader;
window.V73Footer = V73Footer;
