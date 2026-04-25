// src/themes/v77-transcript.jsx — court transcript: numbered lines, monospace, page header, gavel motif
const V77_BG_TONES = {
  legal:    { bg: '#F8F4D8', surface: '#E8E4C8', ink: '#0A0A0A', mute: '#5A5A48', rule: '#A8A488' },
  brief:    { bg: '#E8E8E0', surface: '#D8D8D0', ink: '#0A0A0A', mute: '#585848', rule: '#A8A498' },
  gavel:    { bg: '#1F1408', surface: '#2A1F10', ink: '#E8DCB8', mute: '#A88858', rule: '#3A2818' },
  fbi:      { bg: '#0F1838', surface: '#1A2348', ink: '#E0DCD0', mute: '#9098B8', rule: '#28336A' },
  evidence: { bg: '#E0D4B8', surface: '#D0C4A8', ink: '#1A1408', mute: '#6B5028', rule: '#9C7848' },
  reporter: { bg: '#FFFFFF', surface: '#F0F0F0', ink: '#0A0A0A', mute: '#787878', rule: '#A8A8A8' },
  chamber:  { bg: '#0F0F0A', surface: '#1A1A14', ink: '#E0DCC0', mute: '#888470', rule: '#2A2A20' },
  exhibit:  { bg: '#F0DCCC', surface: '#E0CCBC', ink: '#2A1010', mute: '#8B4030', rule: '#B89888' },
  archive:  { bg: '#E8DCC8', surface: '#D8CCB8', ink: '#1A140A', mute: '#5A4828', rule: '#A89058' },
};

function V77Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V77_BG_TONES[settings.themeColors.v77.bgTone] || V77_BG_TONES.legal;
  const accent = settings.themeColors.v77.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Courier Prime","Courier New",var(--mono)',
    }}>
      <article style={{ maxWidth: 740, margin: '0 auto', padding: '40px 50px 60px', position: 'relative' }}>
        {/* court reporter header */}
        <div style={{
          padding: '10px 14px', border: `1.5px solid ${ink}`, background: surface,
          marginBottom: 24, fontFamily: '"Courier New",monospace', fontSize: 10,
          color: ink, letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 800 }}>IN THE MATTER OF:</span>
            <span style={{ color: mute }}>DAY {String(chapterIdx + 1).padStart(3, '0')} OF {String(total).padStart(3, '0')}</span>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {book.title}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ color: mute }}>REPORTED BY: {(book.author || 'C. REPORTER').toUpperCase()}</span>
            <span style={{ color: accent, fontWeight: 700 }}>EXHIBIT №{String(chapterIdx + 1).padStart(2, '0')}</span>
          </div>
        </div>

        {/* docket title */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: mute, fontWeight: 700, letterSpacing: '0.3em' }}>§</span>
          <span style={{ fontSize: 10, color: accent, fontWeight: 800, letterSpacing: '0.4em' }}>
            DOCKET ENTRY {String(chapterIdx + 1).padStart(3, '0')}
          </span>
        </div>
        <h1 style={{
          fontFamily: '"Courier New",monospace', fontSize: settings.tweaks.fontSize + 8, fontWeight: 700,
          margin: '4px 0 18px', letterSpacing: '0.02em', color: ink, textTransform: 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        <div style={{ height: 1, background: ink, opacity: 0.4, marginBottom: 24 }}/>

        {/* body in monospace, with line-numbered left margin */}
        <div style={{
          display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14,
          fontFamily: '"Courier New",monospace',
        }}>
          <V77LineNumbers ink={mute} count={36}/>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: '"Courier New",monospace', color: ink,
            fontSize: settings.tweaks.fontSize - 1, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        {/* certification stamp */}
        <div style={{
          marginTop: 36, padding: '10px 16px',
          border: `2px solid ${ink}`, background: surface,
          fontFamily: '"Courier New",monospace', fontSize: 10, color: ink,
          letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center',
        }}>
          ⚖ CERTIFIED TRUE TRANSCRIPT · PAGE {chapterIdx + 1} OF {total} · STENOGRAPHER'S MARK ⚖
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.25em', fontSize: 10, fontWeight: 800,
          }}>◀ PREV PAGE</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: ink, color: bg, border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.25em', fontSize: 10, fontWeight: 800,
          }}>NEXT PAGE ▶</button>
        </div>
      </article>
    </main>
  );
}

function V77LineNumbers({ ink, count }) {
  return (
    <div style={{
      borderRight: `1px solid ${ink}66`, paddingRight: 8,
      fontFamily: '"Courier New",monospace', fontSize: 10,
      color: ink, opacity: 0.55, fontVariantNumeric: 'tabular-nums',
      lineHeight: 'inherit', textAlign: 'right',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{String(i + 1).padStart(2, '0')}</div>
      ))}
    </div>
  );
}

function V77Footer({ book, chapterIdx, settings }) {
  const tone = V77_BG_TONES[settings.themeColors.v77.bgTone] || V77_BG_TONES.legal;
  const accent = settings.themeColors.v77.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Courier New",monospace', fontSize: 10, color: tone.mute, letterSpacing: '0.3em', fontWeight: 700,
    }}>
      <span style={{ color: accent }}>⚖ DAY {String(chapterIdx + 1).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V77Reader = V77Reader;
window.V77Footer = V77Footer;
