// src/themes/v10-vertical-classic.jsx — Classical Chinese book: fishtail markers, binding dots, vertical title
const V10_BG_TONES = {
  vermillion: { bg: '#F3E8D0', bg2: '#F8EEDC', ink: '#2A1F14', red: '#8A2A1F' },
  plain:      { bg: '#F5EDD8', bg2: '#FAF3DF', ink: '#2A1F14', red: '#8A2A1F' },
  parchment:  { bg: '#EDE2C2', bg2: '#F2EAD0', ink: '#2A1F14', red: '#8A2A1F' },
  bamboo:     { bg: '#E5DEC0', bg2: '#EBE5C8', ink: '#222018', red: '#7A331F' },
  cinnabar:   { bg: '#F2DDC2', bg2: '#F8E5CC', ink: '#2A140C', red: '#A0341E' },
  ash:        { bg: '#E0D8C2', bg2: '#E8E1CC', ink: '#1F1A14', red: '#6F2A1A' },
  tea:        { bg: '#DCCEAB', bg2: '#E4D7B4', ink: '#241B10', red: '#8C3A22' },
  ivory:      { bg: '#F4ECD2', bg2: '#FAF3DC', ink: '#2A1F14', red: '#8A2A1F' },
  dusk:       { bg: '#D8CDB0', bg2: '#DEDABA', ink: '#1A140C', red: '#6B2A1A' },
};

function V10FishTail({ color, size = 14 }) {
  return (
    <svg viewBox="0 0 30 14" width={size * 2} height={size}>
      <path d="M0,7 L9,0 L21,0 L30,7 L21,14 L9,14 Z" fill="none" stroke={color} strokeWidth="1.2"/>
      <path d="M9,0 L21,14 M21,0 L9,14" stroke={color} strokeWidth="0.5" opacity="0.5"/>
    </svg>
  );
}

function V10Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V10_BG_TONES[settings.themeColors.v10.bgTone] || V10_BG_TONES.vermillion;
  const { bg, bg2, ink, red } = tone;
  const accent = settings.themeColors.v10.accent;
  const mute = 'rgba(42,31,20,0.55)', rule = 'rgba(42,31,20,0.35)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg, color: ink, padding: '36px 0', fontFamily: 'var(--serif)',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 48px' }}>
        <div style={{
          background: bg2, padding: '28px 36px',
          border: `0.5px solid ${rule}`, position: 'relative',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px rgba(60,40,20,0.08)',
        }}>
          {/* binding dots */}
          <div style={{ position: 'absolute', left: 8, top: 40, bottom: 40, width: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: red, opacity: 0.7 }}/>
            ))}
          </div>
          {/* top fishtail */}
          <div style={{ textAlign: 'center', fontSize: 13, color: red, letterSpacing: '0.4em', marginBottom: 14 }}>
            ❙ 第 {chapterIdx + 1} 回 ❙
          </div>
          {/* vertical title */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, padding: '12px 0', borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}` }}>
            <div style={{
              writingMode: 'vertical-rl', textOrientation: 'upright',
              fontSize: settings.tweaks.fontSize + 8, color: red, fontWeight: 500, letterSpacing: '0.4em',
              padding: '8px 14px', maxHeight: 320, overflow: 'hidden',
            }}>
              {stripChapterPrefix(chapterTitle)}
            </div>
          </div>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          {/* bottom fishtail */}
          <div style={{ textAlign: 'center', fontSize: 11, color: mute, letterSpacing: '0.3em', marginTop: 24 }}>
            ❙ 卷 {chapterIdx + 1} · 共 {total} 卷 ❙
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 18, borderTop: `1px solid ${rule}` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: red, border: `1px solid ${red}55`, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>← 前 回</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: red, border: `1px solid ${red}55`, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>下 回 →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V10Footer({ book, chapterIdx, settings }) {
  const tone = V10_BG_TONES[settings.themeColors.v10.bgTone] || V10_BG_TONES.vermillion;
  const accent = settings.themeColors.v10.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `1px solid rgba(42,31,20,0.2)`, background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.24em', opacity: 0.7 }}>第 {chapterIdx + 1} / {total} 回</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(42,31,20,0.18)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 600, letterSpacing: '0.18em' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V10Reader = V10Reader;
window.V10Footer = V10Footer;
