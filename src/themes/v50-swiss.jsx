// src/themes/v50-swiss.jsx — Swiss International typographic style: 12-col baseline grid, Helvetica-tight, red accent
const V50_BG_TONES = {
  bone:     { bg: '#F4F2ED', ink: '#0A0A0A', accent: '#E53935' },
  paper:    { bg: '#FAFAFA', ink: '#0A0A0A', accent: '#E53935' },
  warm:     { bg: '#F2EEE5', ink: '#0A0A0A', accent: '#E53935' },
  cream:    { bg: '#F5F0E0', ink: '#1A1A1A', accent: '#E53935' },
  ash:      { bg: '#E8E6E1', ink: '#0A0A0A', accent: '#E53935' },
  ink:      { bg: '#0A0A0A', ink: '#F4F2ED', accent: '#FF4040' },
  graphite: { bg: '#1A1A1A', ink: '#F4F2ED', accent: '#FF4040' },
  navy:     { bg: '#0E1828', ink: '#F4F2ED', accent: '#FF4040' },
  olive:    { bg: '#1A1A0E', ink: '#F4F2ED', accent: '#FF4040' },
};

function V50Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V50_BG_TONES[settings.themeColors.v50.bgTone] || V50_BG_TONES.bone;
  const { bg, ink } = tone;
  const red = settings.themeColors.v50.accent;
  const mute = ink === '#0A0A0A' || ink === '#1A1A1A' ? 'rgba(10,10,10,0.45)' : 'rgba(244,242,237,0.5)';
  const soft = ink === '#0A0A0A' || ink === '#1A1A1A' ? 'rgba(10,10,10,0.78)' : 'rgba(244,242,237,0.85)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '34px 50px',
      fontFamily: '"Helvetica Neue","Inter",sans-serif',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* baseline grid header */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, borderBottom: `1px solid ${ink}`, paddingBottom: 6, marginBottom: 24 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>N°{String(chapterIdx + 1).padStart(3, '0')} / Q2·2026</span>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>{book.title.toUpperCase()}</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: soft }}>Zürich · Basel · Tokyo</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: red }}>CHAPTER {String(chapterIdx + 1).padStart(2, '0')}</span>
        </div>

        {/* hero meta + title */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', marginBottom: 6 }}>AUTHOR</div>
            <div style={{ fontSize: 17, fontWeight: 500 }}>{book.author || 'Anonymous'}</div>
            <div style={{ height: 14 }}/>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', marginBottom: 6 }}>CHAPTER</div>
            <div style={{ fontSize: 14 }}>{chapterIdx + 1} of {total}</div>
            <div style={{ height: 14 }}/>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', marginBottom: 6 }}>PROGRESS</div>
            <div style={{ fontSize: 14 }}>{total ? Math.round(((chapterIdx + 1) / total) * 100) : 0}%</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', color: soft, marginBottom: 4 }}>
              CH. {chapterIdx + 1}
            </div>
            <div style={{
              fontSize: settings.tweaks.fontSize + 60, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.95,
              fontFamily: '"Noto Serif TC",serif',
            }}>
              {stripChapterPrefix(chapterTitle)}<span style={{ color: red }}>.</span>
            </div>
          </div>
        </div>

        {/* article body */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 30, borderTop: `1px solid ${ink}`, paddingTop: 16 }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            color: ink,
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : '"Noto Sans TC","Inter",sans-serif',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': red,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <aside>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', color: red, marginBottom: 10 }}>PULL QUOTE</div>
            <div style={{ fontSize: 22, lineHeight: 1.3, fontWeight: 500, fontFamily: '"Noto Serif TC",serif', letterSpacing: '0.02em' }}>
              "真事隱去，<br/>假語存焉。"
            </div>
            <div style={{ height: 1, background: ink, margin: '14px 0' }}/>
            <div style={{ fontSize: 11, color: soft, lineHeight: 1.6 }}>
              Set in Neue Haas Grotesk &amp; Noto Serif TC. Printed on Munken Pure 120g.
            </div>
            <div style={{ height: 14 }}/>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em' }}>KEYWORDS</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['DREAM', 'STONE', 'GARDEN', 'DUST', 'KARMA'].map(k => (
                <span key={k} style={{ padding: '3px 8px', border: `1px solid ${ink}`, fontSize: 10, fontWeight: 500, letterSpacing: '0.15em' }}>{k}</span>
              ))}
            </div>
          </aside>
        </div>

        <div style={{ borderTop: `1px solid ${ink}`, marginTop: 28, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', color: soft }}>
          <span>SET IN NEUE HAAS GROTESK &amp; NOTO SERIF TC</span>
          <span>— {String(chapterIdx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')} —</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: bg, color: ink, border: `1px solid ${ink}`, borderRadius: 0, fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700 }}>← PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: red, color: bg, border: `1px solid ${red}`, borderRadius: 0, fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700 }}>NEXT →</button>
        </div>
      </div>
    </main>
  );
}

function V50Footer({ book, chapterIdx, settings }) {
  const tone = V50_BG_TONES[settings.themeColors.v50.bgTone] || V50_BG_TONES.bone;
  const red = settings.themeColors.v50.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Helvetica Neue","Inter",sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
    }}>
      <span>CH. {String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: red }}/>
      </div>
      <span style={{ color: red }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V50Reader = V50Reader;
window.V50Footer = V50Footer;
