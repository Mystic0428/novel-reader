// src/themes/v61-codex.jsx — D&D Player's Handbook: stat-block banner + HP-bar progress
const V61_BG_TONES = {
  crimson:   { bg: '#1F0A0A', surface: '#2D1212', ink: '#F0E4C4', mute: '#A88058', rule: '#5A1F1F' },
  parchment: { bg: '#F2E8C8', surface: '#E8DCB0', ink: '#2A1810', mute: '#6B4828', rule: '#A88848' },
  gold:      { bg: '#2A1F0A', surface: '#3A2E14', ink: '#F0E4B8', mute: '#A89060', rule: '#5A4318' },
  emerald:   { bg: '#0A1F14', surface: '#142D1E', ink: '#E0E8C8', mute: '#80A080', rule: '#1F4A30' },
  sapphire:  { bg: '#0A1228', surface: '#141E36', ink: '#D8E0F0', mute: '#7088A8', rule: '#1F2F5A' },
  slate:     { bg: '#1A1A1F', surface: '#252530', ink: '#E0DCD0', mute: '#9090A0', rule: '#404050' },
  amber:     { bg: '#241408', surface: '#3A2010', ink: '#F0DCA0', mute: '#B89048', rule: '#5A301A' },
  silver:    { bg: '#E8E4D8', surface: '#D8D4C8', ink: '#1A1810', mute: '#5A5848', rule: '#A8A498' },
  obsidian:  { bg: '#08080C', surface: '#141420', ink: '#E0DCD0', mute: '#9090A0', rule: '#28283A' },
};

function V61Stat({ label, value, accent, mute }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 0 }}>
      <div style={{ fontSize: 9, color: mute, letterSpacing: '0.2em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 17, color: accent, fontWeight: 800, fontFamily: 'var(--serif)', marginTop: 2, fontVariantNumeric: 'tabular-nums', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

function V61Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V61_BG_TONES[settings.themeColors.v61.bgTone] || V61_BG_TONES.crimson;
  const accent = settings.themeColors.v61.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const isLight = bg === '#F2E8C8' || bg === '#E8E4D8';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"EB Garamond","Bookman",var(--serif)',
    }}>
      {/* faint dragon-wing watermark */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: isLight ? 0.06 : 0.04,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><g fill='${encodeURIComponent(accent)}'><path d='M200 80 Q160 110 130 160 Q100 200 110 250 Q140 240 170 220 Q160 270 200 300 Q240 270 230 220 Q260 240 290 250 Q300 200 270 160 Q240 110 200 80 Z'/></g></svg>")`,
        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '480px',
      }}/>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* codex banner with stat block */}
        <div style={{
          border: `1.5px solid ${accent}`, background: surface,
          padding: '14px 20px', marginBottom: 28,
          boxShadow: isLight ? '2px 2px 0 rgba(0,0,0,0.08)' : '2px 2px 0 rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontSize: 10, color: accent, letterSpacing: '0.45em', fontWeight: 800, marginBottom: 4 }}>
            ⚔ ADVENTURER'S CODEX
          </div>
          <div style={{ fontSize: 13, color: ink, fontWeight: 700, letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            CAMPAIGN: {book.title}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14, paddingTop: 12, borderTop: `0.5px dashed ${rule}` }}>
            <V61Stat label="CHAPTER" value={String(chapterIdx + 1).padStart(2, '0')} accent={accent} mute={mute}/>
            <V61Stat label="OF" value={String(total).padStart(2, '0')} accent={accent} mute={mute}/>
            <V61Stat label="LEVEL" value={`Lv.${Math.min(chapterIdx + 1, 99)}`} accent={accent} mute={mute}/>
            <V61Stat label="QUEST" value={`${Math.round(progress * 100)}%`} accent={accent} mute={mute}/>
          </div>
        </div>

        {/* title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: accent, textAlign: 'center', margin: '0 0 8px',
          paddingBottom: 14, borderBottom: `1px solid ${rule}`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic', marginBottom: 28, letterSpacing: '0.1em' }}>
          ◆ Encounter № {chapterIdx + 1} ◆ Chronicled by {book.author || 'an anonymous adventurer'} ◆
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* HP-bar style quest progress */}
        <div style={{ marginTop: 38 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: mute, letterSpacing: '0.25em', marginBottom: 6, fontWeight: 700 }}>
            <span>♥ QUEST PROGRESS</span>
            <span>{chapterIdx + 1} / {total}</span>
          </div>
          <div style={{
            height: 16, background: bg, border: `1px solid ${accent}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${progress * 100}%`,
              background: `linear-gradient(180deg, ${accent}, ${accent}aa)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}/>
            {/* tick marks every 10% */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(10% - 0.5px), ${rule} calc(10% - 0.5px), ${rule} 10%)`,
            }}/>
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1px solid ${rule}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.25em', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
          }}>◀ Retreat</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.25em', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
          }}>Advance ▶</button>
        </div>
      </article>
    </main>
  );
}

function V61Footer({ book, chapterIdx, settings }) {
  const tone = V61_BG_TONES[settings.themeColors.v61.bgTone] || V61_BG_TONES.crimson;
  const accent = settings.themeColors.v61.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `1px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontSize: 11, color: tone.mute, letterSpacing: '0.25em', fontWeight: 700,
    }}>
      <span style={{ color: accent }}>⚔ Lv.{Math.min(chapterIdx + 1, 99)}</span>
      <div style={{ flex: 1, height: 8, background: tone.bg, border: `1px solid ${tone.rule}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: `linear-gradient(180deg, ${accent}, ${accent}aa)` }}/>
      </div>
      <span>{chapterIdx + 1}/{total}</span>
    </div>
  );
}

window.V61Reader = V61Reader;
window.V61Footer = V61Footer;
