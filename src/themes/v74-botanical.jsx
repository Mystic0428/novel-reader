// src/themes/v74-botanical.jsx — pressed-flower herbarium specimen: aged paper, leaf ghost, Latin label
const V74_BG_TONES = {
  specimen:  { bg: '#F0E8D0', surface: '#E0D8C0', ink: '#1A1808', mute: '#5A4828', rule: '#A89860' },
  moss:      { bg: '#1F2818', surface: '#2A3424', ink: '#E0E8C0', mute: '#90A878', rule: '#3A4830' },
  lavender:  { bg: '#E8DCEC', surface: '#D8CCDC', ink: '#241828', mute: '#605068', rule: '#A89AB0' },
  rose:      { bg: '#F0DCDC', surface: '#E0CCCC', ink: '#2A1818', mute: '#705858', rule: '#B89898' },
  fern:      { bg: '#142818', surface: '#1F3424', ink: '#D0E4C0', mute: '#80A878', rule: '#2A4828' },
  amber:     { bg: '#F0DCB0', surface: '#E0CC98', ink: '#2A1808', mute: '#6B5018', rule: '#B89048' },
  iris:      { bg: '#1A1838', surface: '#242350', ink: '#D8D8F0', mute: '#9098C0', rule: '#3A3868' },
  snow:      { bg: '#F8F8F4', surface: '#E8E8E4', ink: '#1A1A14', mute: '#787870', rule: '#B8B8AC' },
  twilight:  { bg: '#28202A', surface: '#3A2A3C', ink: '#E0D8E8', mute: '#9888A0', rule: '#4A3A4C' },
};

function V74LeafGhost({ color, opacity }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'><g fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1' stroke-linecap='round'><path d='M200 80 Q170 200 200 380 Q230 200 200 80 Z'/><path d='M200 90 L200 360'/><path d='M200 120 Q170 130 150 145 M200 120 Q230 130 250 145'/><path d='M200 160 Q160 175 130 195 M200 160 Q240 175 270 195'/><path d='M200 210 Q150 230 110 255 M200 210 Q250 230 290 255'/><path d='M200 270 Q140 295 95 320 M200 270 Q260 295 305 320'/></g></svg>")`,
      backgroundPosition: 'center 30%', backgroundRepeat: 'no-repeat', backgroundSize: '300px',
    }}/>
  );
}

function V74Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V74_BG_TONES[settings.themeColors.v74.bgTone] || V74_BG_TONES.specimen;
  const accent = settings.themeColors.v74.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"EB Garamond","Cormorant Garamond",var(--serif)',
    }}>
      <V74LeafGhost color={ink} opacity={0.06}/>

      {/* paper texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.08, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23p)'/></svg>")`,
      }}/>

      <article style={{ maxWidth: 660, margin: '0 auto', padding: '50px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* herbarium specimen tag — corner */}
        <div style={{
          position: 'absolute', top: 30, right: 30,
          background: surface, border: `1px solid ${ink}`, padding: '6px 10px',
          fontSize: 9, color: ink, fontFamily: 'var(--serif)', fontStyle: 'italic',
          letterSpacing: '0.05em', lineHeight: 1.5,
        }}>
          № {String(chapterIdx + 1).padStart(3, '0')}<br/>
          coll. {1850 + chapterIdx}
        </div>

        {/* Latin binomial header */}
        <div style={{
          fontSize: 10, color: mute, letterSpacing: '0.3em', fontWeight: 700,
          textTransform: 'uppercase', marginBottom: 4,
        }}>
          Herbarium · Folio {chapterIdx + 1}
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: accent,
          marginBottom: 14, letterSpacing: '0.04em',
        }}>
          spec. {(book.title || 'incognita').slice(0, 18).toLowerCase()} · {(book.author || 'anon.').slice(0, 18).toLowerCase()}
        </div>

        <div style={{ height: 1, background: ink, marginBottom: 18, opacity: 0.4 }}/>

        {/* italic title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 12, fontWeight: 500,
          margin: '0 0 8px', letterSpacing: '0.03em', color: ink,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        <div style={{
          fontSize: 10, color: mute, letterSpacing: '0.3em', fontWeight: 700, marginBottom: 26,
        }}>
          ❀ FAMILIA · HABITAT · NOTAE ❀
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end ornament */}
        <div style={{
          textAlign: 'center', marginTop: 32, color: accent, fontSize: 16, letterSpacing: '0.5em',
        }}>
          ❀ ✿ ❀
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 16, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>← prior folio</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: ink, color: bg, border: `1px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12, fontWeight: 600,
          }}>next folio →</button>
        </div>
      </article>
    </main>
  );
}

function V74Footer({ book, chapterIdx, settings }) {
  const tone = V74_BG_TONES[settings.themeColors.v74.bgTone] || V74_BG_TONES.specimen;
  const accent = settings.themeColors.v74.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accent }}>❀ folio {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>spec. {chapterIdx + 1}</span>
    </div>
  );
}

window.V74Reader = V74Reader;
window.V74Footer = V74Footer;
