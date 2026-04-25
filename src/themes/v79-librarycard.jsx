// src/themes/v79-librarycard.jsx — library card catalog: index card, Dewey decimal, due-date stamps
const V79_BG_TONES = {
  card:       { bg: '#F4ECD8', surface: '#E8DCC0', ink: '#1A1408', mute: '#5A4828', rule: '#A88858', stamp: '#B82820' },
  catalog:    { bg: '#DCE8F0', surface: '#C8DCE4', ink: '#0A1828', mute: '#5878A0', rule: '#A8C0D0', stamp: '#B82820' },
  archive:    { bg: '#E8DCC0', surface: '#D8CCA8', ink: '#1A140A', mute: '#5A4828', rule: '#A89058', stamp: '#1A1408' },
  librarian:  { bg: '#F0E8E0', surface: '#E0D8D0', ink: '#1F1010', mute: '#7A4848', rule: '#B89898', stamp: '#8B1A1A' },
  closed:     { bg: '#E0E8DC', surface: '#D0D8CC', ink: '#0F1A0F', mute: '#406048', rule: '#A0B8A0', stamp: '#5A8038' },
  dewey:      { bg: '#F8F4D8', surface: '#E8E4C8', ink: '#0A0A0A', mute: '#5A5A48', rule: '#A8A488', stamp: '#B82820' },
  microfiche: { bg: '#28282A', surface: '#34343A', ink: '#D8DCE0', mute: '#9098A0', rule: '#48484C', stamp: '#FFB454' },
  midnight:   { bg: '#0A0F1A', surface: '#141A28', ink: '#E0E4F0', mute: '#7088A8', rule: '#1F2840', stamp: '#FFB454' },
  vellum:     { bg: '#E8DCB8', surface: '#D8CCA8', ink: '#1A140A', mute: '#5A4828', rule: '#A88848', stamp: '#8B1A1A' },
};

function V79Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V79_BG_TONES[settings.themeColors.v79.bgTone] || V79_BG_TONES.card;
  const accent = settings.themeColors.v79.accent;
  const { bg, surface, ink, mute, rule, stamp } = tone;
  const total = book.chaptersMeta.length;
  // Dewey-like classification
  const dewey = `${800 + (chapterIdx % 100)}.${String(chapterIdx).padStart(2, '0')}`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Special Elite","Courier Prime","Courier New",var(--mono)',
    }}>
      {/* fiber paper texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.1, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='1.0' numOctaves='2' seed='8'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23f)'/></svg>")`,
      }}/>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 50px 60px', position: 'relative' }}>
        {/* index card top — call number */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'flex-start',
          paddingBottom: 14, borderBottom: `1.5px solid ${ink}`,
        }}>
          <div style={{
            padding: '8px 12px', background: surface,
            border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', fontSize: 14, fontWeight: 800,
            color: ink, letterSpacing: '0.05em',
          }}>{dewey}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, color: mute, letterSpacing: '0.3em', fontWeight: 700, textTransform: 'uppercase',
            }}>Catalog Card</div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: ink, marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
            }}>{book.title}</div>
            <div style={{
              fontSize: 10, color: mute, fontStyle: 'italic', marginTop: 2,
            }}>{book.author || 'Anon.'} · {total} chapters</div>
          </div>
          {/* DUE stamp */}
          <div style={{
            transform: 'rotate(8deg)',
            padding: '4px 10px', border: `2px solid ${stamp}`,
            color: stamp, fontFamily: '"Courier New",monospace', fontWeight: 900,
            fontSize: 11, letterSpacing: '0.3em',
          }}>DUE</div>
        </div>

        {/* card body label */}
        <div style={{
          margin: '20px 0 8px', display: 'flex', alignItems: 'baseline', gap: 12,
        }}>
          <span style={{
            background: ink, color: bg, padding: '2px 10px',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.3em',
            fontFamily: '"Courier New",monospace',
          }}>CARD {String(chapterIdx + 1).padStart(3, '0')}</span>
          <span style={{
            fontSize: 10, color: mute, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700,
          }}>~ checked out ~</span>
        </div>

        <h1 style={{
          fontFamily: '"Courier New",monospace', fontSize: settings.tweaks.fontSize + 6, fontWeight: 700,
          margin: '0 0 14px', letterSpacing: '0.02em', color: ink, textTransform: 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* due dates row — fake stamps */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
          paddingBottom: 16, borderBottom: `0.5px dashed ${rule}`,
        }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const isCurrent = i === Math.min(5, chapterIdx % 6);
            return (
              <div key={i} style={{
                padding: '3px 8px',
                border: `1px dashed ${isCurrent ? stamp : rule}`,
                color: isCurrent ? stamp : mute,
                fontSize: 9, fontFamily: '"Courier New",monospace',
                letterSpacing: '0.15em', fontWeight: isCurrent ? 700 : 500,
                opacity: isCurrent ? 1 : 0.6,
              }}>
                {String(i + 1).padStart(2, '0')}/{String((chapterIdx + i) % 28 + 1).padStart(2, '0')}
              </div>
            );
          })}
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Courier New",monospace', color: ink,
          fontSize: settings.tweaks.fontSize - 1, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* return reminder */}
        <div style={{
          marginTop: 32, padding: '10px 16px',
          border: `1px solid ${rule}`, background: surface,
          fontFamily: '"Courier New",monospace', fontSize: 10, color: mute,
          letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center',
        }}>
          ◆ RETURN BY · CARD {chapterIdx + 1} OF {total} · {Math.round((chapterIdx + 1) / total * 100)}% READ ◆
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: surface, color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.25em', fontSize: 10, fontWeight: 700,
          }}>◀ PREV CARD</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: ink, color: bg, border: `1.5px solid ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.25em', fontSize: 10, fontWeight: 700,
          }}>NEXT CARD ▶</button>
        </div>
      </article>
    </main>
  );
}

function V79Footer({ book, chapterIdx, settings }) {
  const tone = V79_BG_TONES[settings.themeColors.v79.bgTone] || V79_BG_TONES.card;
  const accent = settings.themeColors.v79.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `1.5px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Courier New",monospace', fontSize: 10, color: tone.mute, letterSpacing: '0.3em', fontWeight: 700, textTransform: 'uppercase',
    }}>
      <span style={{ color: tone.stamp }}>◆ card {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V79Reader = V79Reader;
window.V79Footer = V79Footer;
