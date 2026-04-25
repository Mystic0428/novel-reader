// src/themes/v24-shanghai.jsx — Shanghai 1934 月份牌: red+gold+green poster, italic title with gold offset shadow
const V24_BG_TONES = {
  cream:    { bg: '#F4E6D0', bg2: '#E8CFA8', red: '#C23A2A', green: '#3A6B4E', gold: '#C89A3E' },
  rose:     { bg: '#F4DCD0', bg2: '#E8BFA8', red: '#C8483A', green: '#3A6B4E', gold: '#C89A3E' },
  ivory:    { bg: '#F8EDD8', bg2: '#EDD9B5', red: '#C23A2A', green: '#3A6B4E', gold: '#D4A848' },
  jade:     { bg: '#E8E5C8', bg2: '#D5D0A8', red: '#C23A2A', green: '#3A6B4E', gold: '#B89030' },
  peach:    { bg: '#F8DCC0', bg2: '#EDC598', red: '#D04E32', green: '#3A6B4E', gold: '#C89A3E' },
  sand:     { bg: '#EDDCC2', bg2: '#DCC59C', red: '#B83A2A', green: '#3A6B4E', gold: '#A88030' },
  red:      { bg: '#F0D0C8', bg2: '#E0B0A0', red: '#A82A1A', green: '#3A6B4E', gold: '#A8843A' },
  emerald:  { bg: '#DCE5D0', bg2: '#C5D2B0', red: '#B83A2A', green: '#2E5A40', gold: '#B89030' },
  dusk:     { bg: '#E0D0BC', bg2: '#CCB898', red: '#A8382A', green: '#3A5E48', gold: '#A88030' },
};

function V24Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V24_BG_TONES[settings.themeColors.v24.bgTone] || V24_BG_TONES.cream;
  const { bg, bg2, red, green, gold } = tone;
  const accent = settings.themeColors.v24.accent;
  const ink = '#2A1A12', soft = 'rgba(42,26,18,0.78)', mute = 'rgba(42,26,18,0.55)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: `radial-gradient(ellipse at top, ${bg} 0%, ${bg2} 100%)`,
      color: ink, fontFamily: 'var(--serif)', padding: 0,
    }}>
      <header style={{
        padding: '20px 50px 16px', borderBottom: `3px solid ${red}`, position: 'relative',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20,
        background: 'rgba(255,245,225,0.5)',
      }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -7, height: 1, background: red, opacity: 0.35 }}/>
        <div>
          <div style={{ fontSize: 11, color: mute, letterSpacing: '0.5em', marginBottom: 6 }}>SHANGHAI · 1934</div>
          <div style={{
            fontSize: settings.tweaks.fontSize + 22, color: red, fontWeight: 700, letterSpacing: '0.12em',
            textShadow: `2px 2px 0 ${gold}`, fontStyle: 'italic',
          }}>
            {book.title || '紅樓夢'}
          </div>
          <div style={{ fontSize: 11, color: soft, letterSpacing: '0.25em', marginTop: 4 }}>
            CHAPTER {chapterIdx + 1} OF {total}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block', padding: '4px 10px', border: `1px solid ${green}`, color: green, fontSize: 11, letterSpacing: '0.3em' }}>PROMO · 月份牌</div>
          <div style={{ fontSize: 10, color: mute, marginTop: 6, letterSpacing: '0.2em' }}>大東書局發行 · 民國廿三年</div>
        </div>
      </header>

      <div style={{ padding: '32px 50px', maxWidth: 760, margin: '0 auto', background: 'rgba(255,248,234,0.5)' }}>
        <div style={{ fontSize: settings.tweaks.fontSize + 9, fontWeight: 700, color: red, letterSpacing: '0.1em', textShadow: `1px 1px 0 ${gold}`, marginBottom: 6 }}>
          第 {chapterIdx + 1} 回
        </div>
        <div style={{ fontSize: settings.tweaks.fontSize + 1, color: soft, letterSpacing: '0.15em', marginBottom: 22 }}>
          {stripChapterPrefix(chapterTitle)}
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 18, borderTop: `2px solid ${red}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: red, border: `1px solid ${red}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em', fontWeight: 700 }}>← 上回</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: red, color: bg, border: `1px solid ${red}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em', fontWeight: 700, textShadow: `1px 1px 0 ${gold}` }}>下回 →</button>
        </div>
      </div>
    </main>
  );
}

function V24Footer({ book, chapterIdx, settings }) {
  const tone = V24_BG_TONES[settings.themeColors.v24.bgTone] || V24_BG_TONES.cream;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `2px solid ${tone.red}`, background: tone.bg, color: '#2A1A12',
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ color: tone.red, fontWeight: 700, letterSpacing: '0.3em' }}>CH. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.red}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.red }}/>
      </div>
      <span style={{ color: tone.gold, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V24Reader = V24Reader;
window.V24Footer = V24Footer;
