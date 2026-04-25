// src/themes/v59-longform.jsx — NYT/Atlantic editorial long-form: huge serif headline, byline, drop cap, narrow column
const V59_BG_TONES = {
  paper:     { bg: '#FFFFFF', surface: '#FAFAF7', ink: '#1A1A1A', mute: '#6B6B6B', rule: '#E5E5E0' },
  cream:     { bg: '#FAF7F0', surface: '#F5F0E5', ink: '#1A1A1A', mute: '#6B6B6B', rule: '#DDD8CB' },
  ivory:     { bg: '#FBF6E8', surface: '#F5EFD8', ink: '#1F1F1F', mute: '#6B6B6B', rule: '#DDD5BC' },
  warm:      { bg: '#F8F2E5', surface: '#F0E8D0', ink: '#1F1A14', mute: '#6B5E48', rule: '#DDD0A8' },
  cool:      { bg: '#F4F4F8', surface: '#EAEAF0', ink: '#0F1A2C', mute: '#525E7A', rule: '#D5D5DC' },
  newsprint: { bg: '#F2EAD0', surface: '#E8DEC0', ink: '#1A1408', mute: '#5A5040', rule: '#C8B898' },
  charcoal:  { bg: '#1A1A1A', surface: '#262626', ink: '#F0F0EC', mute: '#A8A8A0', rule: '#3A3A3A' },
  midnight:  { bg: '#0F1A2C', surface: '#1A2640', ink: '#F0F0F8', mute: '#A0AABC', rule: '#2E3A50' },
  ink:       { bg: '#0A0A0A', surface: '#1A1A1A', ink: '#FAFAF5', mute: '#A8A8A0', rule: '#2A2A2A' },
};

function V59Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V59_BG_TONES[settings.themeColors.v59.bgTone] || V59_BG_TONES.paper;
  const { bg, surface, ink, mute, rule } = tone;
  const accent = settings.themeColors.v59.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0,
      fontFamily: '"Inter","Helvetica Neue","Noto Sans TC",sans-serif',
    }}>
      {/* masthead bar */}
      <div style={{
        padding: '16px 32px', borderBottom: `2px solid ${ink}`, background: surface,
        display: 'flex', alignItems: 'baseline', gap: 18, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
      }}>
        <span style={{ color: accent, textTransform: 'uppercase' }}>The Reader</span>
        <span style={{ color: mute }}>·</span>
        <span style={{ color: ink, textTransform: 'uppercase' }}>VOL. {chapterIdx + 1}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ color: mute, fontWeight: 500, fontStyle: 'italic', letterSpacing: '0.05em' }}>
          A serial in {total} parts · No. {chapterIdx + 1}
        </span>
      </div>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '52px 32px 60px' }}>
        {/* category kicker */}
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', color: accent, textTransform: 'uppercase', marginBottom: 20 }}>
          ★ Long Read · Chapter {String(chapterIdx + 1).padStart(2, '0')}
        </div>

        {/* huge editorial headline */}
        <h1 style={{
          fontFamily: '"Playfair Display","Times New Roman","Noto Serif TC",serif',
          fontSize: settings.tweaks.fontSize + 36, fontWeight: 800, margin: '0 0 18px',
          lineHeight: 1.05, letterSpacing: '-0.025em', color: ink,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* deck/dek */}
        <div style={{
          fontFamily: '"Playfair Display","Times New Roman",serif',
          fontSize: settings.tweaks.fontSize + 4, fontStyle: 'italic', color: mute,
          lineHeight: 1.4, marginBottom: 24, letterSpacing: '0.01em',
        }}>
          A correspondent's report from {book.title}, filed under the byline of {(book.author || 'a certain anonymous voice')}.
        </div>

        {/* byline + date */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16,
          borderBottom: `1px solid ${rule}`, marginBottom: 28,
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18, background: accent, color: bg,
            display: 'grid', placeItems: 'center', fontFamily: '"Playfair Display",serif', fontSize: 17, fontWeight: 800,
          }}>{(book.author || 'A')[0].toUpperCase()}</div>
          <div>
            <div style={{ color: ink, textTransform: 'uppercase' }}>By {(book.author || 'Anonymous')}</div>
            <div style={{ color: mute, fontWeight: 500, fontStyle: 'italic', fontSize: 11 }}>Issued · Part {chapterIdx + 1} of {total}</div>
          </div>
        </div>

        {/* body — large serif, drop-cap-friendly */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Playfair Display","Times New Roman","Noto Serif TC",serif',
          color: ink, fontSize: settings.tweaks.fontSize + 1, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end-of-article symbol */}
        <div style={{
          textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 800, letterSpacing: '0.4em', color: ink,
        }}>
          ■
        </div>

        {/* author bio strip */}
        <div style={{
          marginTop: 30, padding: '18px 22px', background: surface,
          fontSize: 12, color: mute, lineHeight: 1.6, fontStyle: 'italic',
          borderLeft: `4px solid ${accent}`,
        }}>
          <strong style={{ color: ink, fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 11 }}>
            About the author
          </strong>
          <div style={{ marginTop: 6 }}>
            {(book.author || 'Anonymous')} continues to write {book.title}, now in its {chapterIdx + 1}-part installment.
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 18, borderTop: `2px solid ${ink}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 18px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"Playfair Display",serif', letterSpacing: '0.18em', fontWeight: 700, fontSize: 12,
          }}>← Previous Part</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 18px', borderRadius: 0,
            background: ink, color: bg, border: `1.5px solid ${ink}`,
            fontFamily: '"Playfair Display",serif', letterSpacing: '0.18em', fontWeight: 700, fontSize: 12,
          }}>Continue Reading →</button>
        </div>
      </article>
    </main>
  );
}

function V59Footer({ book, chapterIdx, settings }) {
  const tone = V59_BG_TONES[settings.themeColors.v59.bgTone] || V59_BG_TONES.paper;
  const accent = settings.themeColors.v59.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, color: tone.ink, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Inter","Helvetica Neue",sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
    }}>
      <span style={{ color: accent, textTransform: 'uppercase' }}>★ Part {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V59Reader = V59Reader;
window.V59Footer = V59Footer;
