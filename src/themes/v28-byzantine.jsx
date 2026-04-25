// src/themes/v28-byzantine.jsx — Byzantine mosaic: gold tessera grid, lapis blue band, crimson initial, Greek inscription
const V28_BG_TONES = {
  gold:     { bg1: '#E8CF7A', bg2: '#C9A84A', bg3: '#8C6B1E', cream: '#F0E2B8' },
  lapis:    { bg1: '#3E5A9A', bg2: '#1E3D7A', bg3: '#0E2050', cream: '#F0E2B8' },
  crimson:  { bg1: '#A8302A', bg2: '#7A1A14', bg3: '#4E0A08', cream: '#F0E2B8' },
  emerald:  { bg1: '#3E7A5A', bg2: '#1E5238', bg3: '#0E3018', cream: '#F0E2B8' },
  purple:   { bg1: '#8A2A8A', bg2: '#5A1A5A', bg3: '#2E0E2E', cream: '#F0E2B8' },
  teal:     { bg1: '#3E7878', bg2: '#1A4A4A', bg3: '#082828', cream: '#F0E2B8' },
  copper:   { bg1: '#C8884A', bg2: '#9A5C24', bg3: '#5E3818', cream: '#F0E2B8' },
  ivory:    { bg1: '#E8DCB8', bg2: '#C9B888', bg3: '#8C7A48', cream: '#F0E2B8' },
  obsidian: { bg1: '#3A3030', bg2: '#1F1818', bg3: '#0E0808', cream: '#F0E2B8' },
};

function V28Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V28_BG_TONES[settings.themeColors.v28.bgTone] || V28_BG_TONES.gold;
  const { bg1, bg2, bg3, cream } = tone;
  const accent = settings.themeColors.v28.accent;
  const ink = '#1A0E08';
  const goldD = '#8C6B1E';
  const lapis = '#1E3D7A';
  const crimson = '#8B1A1A';
  const total = book.chaptersMeta.length;
  // tessera background
  const tesseraBg = `repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 16px), radial-gradient(circle at 8px 8px, ${bg1} 0, ${bg2} 48%, ${bg3} 100%)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: tesseraBg, backgroundSize: '16px 16px, 16px 16px, 16px 16px',
      color: ink, fontFamily: 'var(--serif)', padding: 0,
    }}>
      <div style={{
        padding: '12px 36px', background: lapis, color: bg1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `3px solid ${goldD}`, letterSpacing: '0.4em', fontSize: 13,
      }}>
        <span>✠ ΧΡΟΝΙΚΟΝ ΕΡΥΘΡΟΥ ΘΑΛΑΜΟΥ ✠</span>
        <span style={{ fontSize: 11 }}>ΚΕΦΑΛΑΙΟΝ · {chapterIdx + 1}</span>
      </div>

      <div style={{ padding: '32px 28px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          background: cream, border: `4px solid ${goldD}`,
          boxShadow: `0 0 0 2px ${bg1}, 0 12px 32px rgba(0,0,0,0.35)`,
          padding: '28px 36px', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, border: `1px solid ${goldD}`, pointerEvents: 'none' }}/>

          <div style={{ textAlign: 'center', color: crimson, fontSize: settings.tweaks.fontSize + 2, letterSpacing: '0.25em', fontWeight: 700, paddingBottom: 12, borderBottom: `1px solid ${goldD}` }}>
            ✠ {stripChapterPrefix(chapterTitle)} ✠
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0', color: lapis }}>
            <div style={{ flex: 1, height: 1, background: goldD }}/>
            <span style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 700 }}>· {chapterIdx + 1} / {total} ·</span>
            <div style={{ flex: 1, height: 1, background: goldD }}/>
          </div>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink, marginTop: 14,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.3em', color: crimson, borderTop: `1px solid ${goldD}`, paddingTop: 10, marginTop: 16, fontWeight: 700 }}>
            ✠ Α · Ω ✠
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 12, borderTop: `1px solid ${goldD}` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: lapis, border: `1px solid ${goldD}`, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.18em' }}>‹ ΠΡΟΗΓ.</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: lapis, color: bg1, border: `1px solid ${goldD}`, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.18em' }}>ΕΠΟΜ. ›</button>
          </div>
        </div>
      </div>

      <div style={{
        padding: '10px 36px', background: lapis, color: bg1,
        display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.3em',
        borderTop: `3px solid ${goldD}`, marginTop: 18,
      }}>
        <span>ΣΕΛΙΣ {chapterIdx + 1}</span>
        <span>· ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΙΣ ·</span>
        <span>ΤΟΜΟΣ {total}</span>
      </div>
    </main>
  );
}

function V28Footer({ book, chapterIdx, settings }) {
  const tone = V28_BG_TONES[settings.themeColors.v28.bgTone] || V28_BG_TONES.gold;
  const accent = settings.themeColors.v28.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: '#1E3D7A', color: tone.bg1,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
      letterSpacing: '0.3em',
    }}>
      <span>ΚΕΦ. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.bg1}44`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V28Reader = V28Reader;
window.V28Footer = V28Footer;
