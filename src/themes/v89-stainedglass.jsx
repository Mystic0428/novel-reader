// src/themes/v89-stainedglass.jsx — cathedral stained glass: lead-line geometric, jewel-tone panels, Latin hymn
const V89_BG_TONES = {
  cathedral: { bg: '#08081A', card: '#1A1F38', ink: '#F0E8C8', mute: '#9098B8', lead: '#000000', jewel: '#3858E8' },
  rose:      { bg: '#1A0820', card: '#2A1438', ink: '#F8E0E8', mute: '#B098C0', lead: '#0A0414', jewel: '#E848A8' },
  forest:    { bg: '#0A1F14', card: '#1A2D24', ink: '#E0E8C8', mute: '#88A088', lead: '#040A08', jewel: '#48A858' },
  amber:     { bg: '#1F1208', card: '#2A1F10', ink: '#F8DCB0', mute: '#B89058', lead: '#0A0804', jewel: '#FFB838' },
  ruby:      { bg: '#1F0810', card: '#2A1218', ink: '#F8D0DC', mute: '#B07088', lead: '#0A0408', jewel: '#E8284C' },
  sapphire:  { bg: '#08081F', card: '#10142A', ink: '#D8E0F8', mute: '#7888B0', lead: '#040414', jewel: '#3878E8' },
  emerald:   { bg: '#0A1F18', card: '#142D24', ink: '#D0F0DC', mute: '#78A888', lead: '#04140A', jewel: '#28B868' },
  charcoal:  { bg: '#1A1A1A', card: '#262626', ink: '#F0E0B0', mute: '#A89058', lead: '#000000', jewel: '#FFC848' },
  gold:      { bg: '#1F1808', card: '#2A2410', ink: '#FFE0B0', mute: '#C8A058', lead: '#0A0804', jewel: '#FFD448' },
};

function V89GlassPattern({ jewel, lead }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.10,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='200' viewBox='0 0 160 200'><g fill='none' stroke='${encodeURIComponent(lead)}' stroke-width='3'><path d='M0 0 L80 0 L80 100 L0 100 Z M80 0 L160 0 L160 100 L80 100 Z M0 100 L80 100 L80 200 L0 200 Z M80 100 L160 100 L160 200 L80 200 Z'/><circle cx='80' cy='100' r='30'/><path d='M50 50 L110 50 L110 150 L50 150 Z'/></g><g fill='${encodeURIComponent(jewel)}' fill-opacity='0.3'><circle cx='80' cy='100' r='28'/></g></svg>")`,
    }}/>
  );
}

function V89Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V89_BG_TONES[settings.themeColors.v89.bgTone] || V89_BG_TONES.cathedral;
  const accent = settings.themeColors.v89.accent;
  const { bg, card, ink, mute, lead, jewel } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      <V89GlassPattern jewel={jewel} lead={lead}/>

      {/* light beam from above */}
      <div style={{
        position: 'fixed', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 600, pointerEvents: 'none',
        background: `radial-gradient(ellipse at top, ${jewel}26, transparent 70%)`,
      }}/>

      <article style={{ maxWidth: 660, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* gothic arch frame */}
        <div style={{
          background: card, color: ink,
          padding: '36px 40px 32px',
          borderTop: `8px solid ${jewel}`,
          borderRadius: '60% 60% 4px 4px / 30px 30px 4px 4px',
          boxShadow: `inset 0 0 30px ${lead}, 0 0 0 4px ${lead}, 0 0 40px ${jewel}33`,
          position: 'relative',
        }}>
          {/* Latin canto */}
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: jewel,
            letterSpacing: '0.4em', fontWeight: 700, textAlign: 'center', marginBottom: 6,
            textTransform: 'uppercase', textShadow: `0 0 10px ${jewel}80`,
          }}>
            ✚ Canticum {chapterIdx + 1} ✚
          </div>

          <h1 style={{
            fontFamily: '"UnifrakturCook","UnifrakturMaguntia","Noto Serif TC",var(--serif)',
            fontSize: settings.tweaks.fontSize + 18, fontWeight: 700,
            textAlign: 'center', margin: '4px 0 12px', letterSpacing: '0.04em', color: ink,
            textShadow: `0 0 14px ${jewel}50`,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          {/* hymn divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            color: jewel, fontSize: 16, marginBottom: 24,
          }}>
            <span>✚</span>
            <span style={{ fontSize: 12, fontStyle: 'italic', color: mute, letterSpacing: '0.3em' }}>
              IN HOC SIGNO VINCES
            </span>
            <span>✚</span>
          </div>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': jewel,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          <div style={{
            textAlign: 'center', marginTop: 30, color: jewel, fontSize: 16, letterSpacing: '0.5em',
          }}>
            ✚
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: jewel, border: `1.5px solid ${jewel}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12,
          }}>← canticum praecedens</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: jewel, color: bg, border: `1.5px solid ${jewel}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12, fontWeight: 700,
          }}>canticum sequens →</button>
        </div>
      </article>
    </main>
  );
}

function V89Footer({ book, chapterIdx, settings }) {
  const tone = V89_BG_TONES[settings.themeColors.v89.bgTone] || V89_BG_TONES.cathedral;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.card, borderTop: `1px solid ${tone.jewel}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.25em',
    }}>
      <span style={{ color: tone.jewel }}>✚ {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.lead, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.jewel, boxShadow: `0 0 6px ${tone.jewel}` }}/>
      </div>
      <span style={{ color: tone.jewel }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V89Reader = V89Reader;
window.V89Footer = V89Footer;
