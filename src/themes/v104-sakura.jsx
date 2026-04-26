// src/themes/v104-sakura.jsx — Pastel Sakura 櫻霞: soft pink light-novel aesthetic
const V104_BG_TONES = {
  sakura:   { bg: '#FCEFEF', ink: '#5A3848' },
  peach:    { bg: '#FDEFE5', ink: '#5A3838' },
  lavender: { bg: '#F2EDF8', ink: '#4A3858' },
  mist:     { bg: '#F0EFF5', ink: '#3F4458' },
  cream:    { bg: '#FAF4EC', ink: '#4A3838' },
  lilac:    { bg: '#F4ECF6', ink: '#503848' },
  blush:    { bg: '#FAEDED', ink: '#5A3848' },
  rose:     { bg: '#FCE8EC', ink: '#5A3848' },
  dawn:     { bg: '#FBEFE8', ink: '#5A4438' },
};

function V104Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V104_BG_TONES[settings.themeColors.v104.bgTone] || V104_BG_TONES.sakura;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v104.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: bg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: accent, fontWeight: 600, marginBottom: 12 }}>
          ✿ 第 {chapterIdx + 1} 話 · {total} 話
        </div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 12, color: ink,
          margin: '0 0 16px', lineHeight: 1.3, letterSpacing: '0.005em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, color: accent }}>
          <span style={{ fontSize: 14 }}>❀</span>
          <span style={{ flex: 1, height: 1, background: accent, opacity: 0.4 }}/>
          <span style={{ fontSize: 14 }}>❀</span>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}22` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 999, padding: '6px 14px', fontFamily: 'var(--sans)' }}>← 上一話</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FFF', border: `0.5px solid ${accent}`, borderRadius: 999, padding: '6px 14px', fontFamily: 'var(--sans)', fontWeight: 600 }}>下一話 →</button>
        </div>
      </div>
    </main>
  );
}

function V104Footer({ book, chapterIdx, settings }) {
  const tone = V104_BG_TONES[settings.themeColors.v104.bgTone] || V104_BG_TONES.sakura;
  const accent = settings.themeColors.v104.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--sans)', fontSize: 11,
    }}>
      <span>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 4, background: `${tone.ink}1A`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, borderRadius: 2 }}/>
      </div>
      <span style={{ color: accent, fontWeight: 600 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V104Reader = V104Reader;
window.V104Footer = V104Footer;
