// src/themes/v9-brutalist.jsx — Brutalist grotesk: bold black frame, lime accent
const V9_BG_TONES = {
  bone:   { bg: '#EEEBE4', ink: '#0A0A0A' },
  cream:  { bg: '#F5F1E5', ink: '#0A0A0A' },
  gray:   { bg: '#D8D5CC', ink: '#0A0A0A' },
  black:  { bg: '#0A0A0A', ink: '#EEEBE4' },
  navy:   { bg: '#0D1B2A', ink: '#EEEBE4' },
  pink:   { bg: '#F5D8DC', ink: '#0A0A0A' },
};

function V9Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V9_BG_TONES[settings.themeColors.v9.bgTone] || V9_BG_TONES.bone;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v9.accent;
  const total = book.chaptersMeta.length;
  const rawTitle = stripChapterPrefix(chapterTitle);
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: 'var(--ui)',
    }}>
      {/* header strip */}
      <div style={{
        height: 32, borderBottom: `2px solid ${ink}`, display: 'flex', alignItems: 'stretch',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.02em', background: bg,
      }}>
        <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', borderRight: `2px solid ${ink}` }}>READER/04</div>
        <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', borderRight: `2px solid ${ink}`, overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 320, textOverflow: 'ellipsis' }}>{book.title} [{String(chapterIdx + 1).padStart(3, '0')}/{String(total).padStart(3, '0')}]</div>
        <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', background: accent, color: ink, borderRight: `2px solid ${ink}` }}>NOW READING</div>
        <div style={{ flex: 1 }}/>
        <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', borderLeft: `2px solid ${ink}`, fontFamily: 'var(--mono)' }}>§ {String(chapterIdx + 1).padStart(3, '0')}</div>
      </div>

      {/* huge chapter block */}
      <div style={{ padding: '28px 40px 20px', borderBottom: `2px solid ${ink}`, position: 'relative' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', marginBottom: 6 }}>CH. {String(chapterIdx + 1).padStart(2, '0')} — OF {String(total).padStart(3, '0')}</div>
        <h1 style={{ fontSize: Math.min(96, settings.tweaks.fontSize * 5 + 10), fontWeight: 900, margin: 0, lineHeight: 0.95, letterSpacing: '-0.05em', fontFamily: 'var(--ui)' }}>
          {splitTitleForBrutalist(rawTitle, accent)}
        </h1>
        {book.author && (
          <div style={{ position: 'absolute', right: 40, bottom: 20, fontSize: 11, fontFamily: 'var(--mono)', textAlign: 'right', lineHeight: 1.4, fontWeight: 700 }}>
            {book.author}
          </div>
        )}
      </div>

      {/* body with paragraph number gutter */}
      <div style={{ padding: '28px 40px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div className="reading-body v9-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 20, borderTop: `2px solid ${ink}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: bg, color: ink, border: `2px solid ${ink}`, fontWeight: 700, letterSpacing: '0.2em' }}>← PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg, border: `2px solid ${ink}`, fontWeight: 700, letterSpacing: '0.2em' }}>NEXT →</button>
        </div>
      </div>
      <style>{`.v9-body p:first-child::first-line { background: ${accent}; }`}</style>
    </main>
  );
}

function V9Footer({ book, chapterIdx, settings }) {
  const tone = V9_BG_TONES[settings.themeColors.v9.bgTone] || V9_BG_TONES.bone;
  const accent = settings.themeColors.v9.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 16px', borderTop: `2px solid ${tone.ink}`, background: tone.bg,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)',
      fontSize: 11, color: tone.ink, fontWeight: 700, letterSpacing: '0.18em',
    }}>
      <span>{String(chapterIdx + 1).padStart(4, '0')}</span>
      <div style={{ flex: 1, height: 14, border: `2px solid ${tone.ink}`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{String(total).padStart(4, '0')}</span>
    </div>
  );
}

function splitTitleForBrutalist(title, accent) {
  if (!title) return null;
  const t = title.trim();
  if (t.length <= 3) return <span style={{ background: accent, padding: '0 6px' }}>{t}</span>;
  const mid = Math.floor(t.length / 2);
  const a = t.slice(0, mid), b = t.slice(mid);
  return <>{a}<br/><span style={{ background: accent, padding: '0 6px' }}>{b}</span></>;
}

window.V9Reader = V9Reader;
window.V9Footer = V9Footer;
