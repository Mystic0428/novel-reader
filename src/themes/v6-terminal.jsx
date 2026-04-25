// src/themes/v6-terminal.jsx — Retro terminal / CRT
const V6_BG_TONES = {
  amber:   { bg: '#0C0A06', fg: '#FFB454', dim: 'rgba(255,180,84,0.55)',  faint: 'rgba(255,180,84,0.22)' },
  green:   { bg: '#030806', fg: '#6FE89B', dim: 'rgba(111,232,155,0.55)', faint: 'rgba(111,232,155,0.22)' },
  blue:    { bg: '#04060F', fg: '#7FB6FF', dim: 'rgba(127,182,255,0.55)', faint: 'rgba(127,182,255,0.22)' },
  paper:   { bg: '#F4ECD8', fg: '#2A2418', dim: 'rgba(42,36,24,0.55)',    faint: 'rgba(42,36,24,0.22)' },
  red:     { bg: '#0C0606', fg: '#FF4555', dim: 'rgba(255,69,85,0.55)',   faint: 'rgba(255,69,85,0.22)' },
  cyan:    { bg: '#04090C', fg: '#58E6FF', dim: 'rgba(88,230,255,0.55)',  faint: 'rgba(88,230,255,0.22)' },
  magenta: { bg: '#0A040A', fg: '#FF6BCB', dim: 'rgba(255,107,203,0.55)', faint: 'rgba(255,107,203,0.22)' },
  mono:    { bg: '#050505', fg: '#E0E0E0', dim: 'rgba(224,224,224,0.55)', faint: 'rgba(224,224,224,0.22)' },
  ivory:   { bg: '#F1E8D0', fg: '#1F1810', dim: 'rgba(31,24,16,0.55)',    faint: 'rgba(31,24,16,0.22)' },
};

function V6Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V6_BG_TONES[settings.themeColors.v6.bgTone] || V6_BG_TONES.amber;
  const { bg, fg, dim, faint } = tone;
  const accent = settings.themeColors.v6.accent;
  const total = book.chaptersMeta.length;
  const rawTitle = stripChapterPrefix(chapterTitle);
  const lineChars = 42;
  const titlePadded = rawTitle.padStart((lineChars + rawTitle.length) / 2).padEnd(lineChars);
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: fg, padding: '28px 0', position: 'relative',
      fontFamily: 'var(--mono)', fontFeatureSettings: '"calt" 0',
      backgroundImage: `repeating-linear-gradient(0deg, ${faint} 0, ${faint} 1px, transparent 1px, transparent 3px)`,
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ color: accent, marginBottom: 6, fontSize: 11 }}>
          root@reader:~/{sanitizePath(book.title)}$ cat ch{String(chapterIdx + 1).padStart(2, '0')}.txt
        </div>
        <div style={{ color: dim, fontSize: 11, marginBottom: 24 }}>{'─'.repeat(48)}</div>
        <pre style={{ color: fg, fontSize: 12, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
{`    ╔══════════════════════════════════════════╗
    ║   CHAPTER ${String(chapterIdx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}${' '.repeat(Math.max(0, 27 - String(total).length))}║
    ║   ${titlePadded}║
    ╚══════════════════════════════════════════╝`}
        </pre>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          marginTop: 28, fontFamily: 'var(--mono)', color: fg,
          fontSize: settings.tweaks.fontSize - 1, lineHeight: settings.tweaks.lineHeight,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ color: accent, marginTop: 18, fontSize: 11 }}>
          root@reader:~$ _<span className="v6-cursor">█</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 18, borderTop: `1px solid ${faint}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: fg, border: `1px solid ${faint}`, fontFamily: 'var(--mono)' }}>&lt; prev</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: fg, border: `1px solid ${faint}`, fontFamily: 'var(--mono)' }}>next &gt;</button>
        </div>
      </div>
      <style>{`@keyframes v6-blink { 50% { opacity: 0 } } .v6-cursor { animation: v6-blink 1s step-end infinite }`}</style>
    </main>
  );
}

function V6Footer({ book, chapterIdx, settings }) {
  const tone = V6_BG_TONES[settings.themeColors.v6.bgTone] || V6_BG_TONES.amber;
  const accent = settings.themeColors.v6.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', borderTop: `1px solid ${tone.faint}`, background: tone.bg,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)',
      fontSize: 10, color: tone.dim, letterSpacing: '0.08em',
    }}>
      <span>[{String(chapterIdx + 1).padStart(4, '0')}/{String(total).padStart(4, '0')}]</span>
      <div style={{ flex: 1, height: 1, background: tone.faint, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

function sanitizePath(s) {
  return (s || 'book').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase().slice(0, 16) || 'book';
}

window.V6Reader = V6Reader;
window.V6Footer = V6Footer;
