// src/themes/v121-cathedral.jsx — Gothic Cathedral 哥德教堂: rose window + arcade + illuminated drop cap
const V121_BG_TONES = {
  cathedral: { from: '#181420', to: '#0A0814', ink: '#D8D0E0', accentAlt: '#D4A848' },
  nave:      { from: '#1A141C', to: '#08060E', ink: '#D4CCD8', accentAlt: '#D4A848' },
  crypt:     { from: '#0F0E1A', to: '#06060E', ink: '#C8C0CC', accentAlt: '#D4A848' },
  rose:      { from: '#28142C', to: '#100614', ink: '#E0CCD8', accentAlt: '#FFD848' },
  reliquary: { from: '#1F141C', to: '#0F0810', ink: '#E0D0C0', accentAlt: '#FFD848' },
  pulpit:    { from: '#1A1418', to: '#080608', ink: '#D4C8C8', accentAlt: '#D4A848' },
  requiem:   { from: '#0E0E14', to: '#04040A', ink: '#C8C8D4', accentAlt: '#D4A848' },
  incense:   { from: '#1A1814', to: '#0A0908', ink: '#E0D4C0', accentAlt: '#FFD848' },
  votive:    { from: '#28201A', to: '#14100F', ink: '#F0DCB8', accentAlt: '#FFD848' },
};

function V121RoseWindow({ accent, accentAlt, size = 92 }) {
  // Stained-glass rose window: 12 petal slices in alternating blue/red/gold/green
  const r = size / 2;
  const colors = ['#3858E8', '#C8242C', accentAlt, '#3A6B4E', '#3858E8', '#C8242C',
                  accentAlt, '#3A6B4E', '#3858E8', '#C8242C', accentAlt, '#3A6B4E'];
  const slice = (i) => {
    const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
    const x0 = r + Math.cos(a0) * r * 0.85;
    const y0 = r + Math.sin(a0) * r * 0.85;
    const x1 = r + Math.cos(a1) * r * 0.85;
    const y1 = r + Math.sin(a1) * r * 0.85;
    return `M${r} ${r} L${x0} ${y0} A${r * 0.85} ${r * 0.85} 0 0 1 ${x1} ${y1} Z`;
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden style={{ display: 'block' }}>
      <defs>
        <radialGradient id="v121rose" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentAlt} stopOpacity="0.95"/>
          <stop offset="60%" stopColor={accent} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* outer glow */}
      <circle cx={r} cy={r} r={r} fill="url(#v121rose)"/>
      {/* twelve petals */}
      {colors.map((c, i) => (
        <path key={i} d={slice(i)} fill={c} opacity={0.62} stroke={accent} strokeWidth={0.6}/>
      ))}
      {/* inner ring */}
      <circle cx={r} cy={r} r={r * 0.32} fill={accentAlt} opacity={0.75}/>
      <circle cx={r} cy={r} r={r * 0.32} fill="none" stroke={accent} strokeWidth={0.8}/>
      {/* central cross */}
      <path d={`M${r} ${r * 0.78} L${r} ${r * 1.22} M${r * 0.82} ${r} L${r * 1.18} ${r}`}
        stroke={'#1A1408'} strokeWidth={1.2} strokeLinecap="round"/>
    </svg>
  );
}

function V121Arcade({ accent, accentAlt, count = 5 }) {
  // A row of pointed gothic arches at the top — like looking up at a nave arcade.
  const arches = [];
  const totalW = 1000; // viewBox width
  const archW = totalW / count;
  for (let i = 0; i < count; i++) {
    const x = i * archW;
    arches.push(
      <path key={i}
        d={`M${x + 6} 80 L${x + 6} 36 Q${x + archW / 2} 0 ${x + archW - 6} 36 L${x + archW - 6} 80`}
        fill="none" stroke={accent} strokeWidth={1.2} opacity={0.55}/>
    );
    // inner arch fill (gradient suggesting candlelit interior)
    arches.push(
      <path key={`f-${i}`}
        d={`M${x + 12} 80 L${x + 12} 38 Q${x + archW / 2} 6 ${x + archW - 12} 38 L${x + archW - 12} 80 Z`}
        fill={`url(#v121nave-${i})`} opacity={0.4}/>
    );
  }
  return (
    <svg viewBox={`0 0 ${totalW} 80`} preserveAspectRatio="none" width="100%" height="60" aria-hidden
      style={{ display: 'block', opacity: 0.85, marginBottom: 18 }}>
      <defs>
        {Array.from({ length: count }).map((_, i) => (
          <linearGradient key={i} id={`v121nave-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentAlt} stopOpacity="0.55"/>
            <stop offset="100%" stopColor={accent} stopOpacity="0"/>
          </linearGradient>
        ))}
      </defs>
      {arches}
    </svg>
  );
}

function v121InjectIlluminatedCap(html, accent, accentAlt, size) {
  // First Latin character gets a gilded illuminated drop cap; CJK skipped.
  const m = html.match(/<p([^>]*)>(\s*)(.)/);
  if (!m) return html;
  const ch = m[3];
  if (!/[A-Za-z]/.test(ch)) return html;
  const firstPEnd = html.indexOf('</p>');
  const firstPText = firstPEnd > 0 ? html.slice(0, firstPEnd).replace(/<[^>]+>/g, '').trim() : '';
  if (firstPText.length < 15) return html;
  return html.replace(/<p([^>]*)>(\s*)(.)/, (_m, attrs, lead, c) =>
    `<p${attrs}>${lead}<span style="float:left;font-family:'EB Garamond',var(--serif);font-size:${size}px;line-height:0.85;color:${accentAlt};font-weight:700;padding:6px 10px 0 0;text-shadow:0 0 12px ${accent}66;letter-spacing:0;">${c}</span>`
  );
}

function V121Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V121_BG_TONES[settings.themeColors.v121.bgTone] || V121_BG_TONES.cathedral;
  const { from, to, ink, accentAlt } = tone;
  const accent = settings.themeColors.v121.accent;
  const total = book.chaptersMeta.length;
  const decorated = book.preserveOriginalCss ? html : v121InjectIlluminatedCap(html, accent, accentAlt, settings.tweaks.fontSize * 3);
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '36px 0 64px', position: 'relative',
      background: `radial-gradient(ellipse at 50% 0%, ${from}cc 0%, ${to} 75%)`,
    }}>
      {/* Faint candlelight haze at the top */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% -10%, ${accentAlt}1F 0%, transparent 35%)`,
      }}/>

      {/* Top: gothic arch arcade spanning full width */}
      <V121Arcade accent={accent} accentAlt={accentAlt}/>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        {/* Stained-glass rose window centered above title */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, filter: `drop-shadow(0 0 24px ${accentAlt}55)` }}>
          <V121RoseWindow accent={accent} accentAlt={accentAlt} size={88}/>
        </div>

        <div style={{
          fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.55em', color: accentAlt,
          fontWeight: 700, marginBottom: 16, textAlign: 'center', textTransform: 'uppercase',
        }}>
          ✟ Cantus {chapterIdx + 1} · ex {total} ✟
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 700,
          fontSize: settings.tweaks.fontSize + 18, color: ink,
          margin: '0 0 16px', lineHeight: 1.16, letterSpacing: '0.06em', textAlign: 'center',
          textTransform: 'uppercase', fontVariant: 'small-caps',
          textShadow: `0 0 28px ${accent}77, 0 0 56px ${accentAlt}33`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* Cruciform divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${accent})` }}/>
          <span style={{ color: accentAlt, fontSize: 22, letterSpacing: 0, textShadow: `0 0 10px ${accentAlt}88` }}>✟</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)` }}/>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accentAlt,
        }} dangerouslySetInnerHTML={{ __html: decorated }}/>

        {/* Closing benediction mark — Alpha & Omega flanking a cross */}
        <div style={{ textAlign: 'center', marginTop: 48, color: accentAlt, fontFamily: 'var(--serif)',
          fontSize: 18, letterSpacing: '0.5em', textShadow: `0 0 12px ${accentAlt}66` }}>
          Α  ✟  Ω
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${accent}44` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px',
            background: 'transparent', color: ink, border: `1px solid ${accent}66`, borderRadius: 0,
            fontFamily: 'var(--serif)', letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 11, fontWeight: 700,
          }}>◀ Ante</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px',
            background: accent, color: to, border: `1px solid ${accent}`, borderRadius: 0,
            fontFamily: 'var(--serif)', letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 11, fontWeight: 800,
            boxShadow: `0 0 16px ${accent}66`,
          }}>Post ▶</button>
        </div>
      </div>
    </main>
  );
}

function V121Footer({ book, chapterIdx, settings }) {
  const tone = V121_BG_TONES[settings.themeColors.v121.bgTone] || V121_BG_TONES.cathedral;
  const accent = settings.themeColors.v121.accent;
  const accentAlt = tone.accentAlt;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${accent}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.22em',
    }}>
      <span style={{ color: accentAlt }}>✟ {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
        <div style={{ position: 'absolute', top: -3, left: `calc(${progress * 100}% - 4px)`,
          width: 7, height: 7, borderRadius: 4, background: accentAlt, boxShadow: `0 0 8px ${accentAlt}` }}/>
      </div>
      <span style={{ color: accentAlt, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V121Reader = V121Reader;
window.V121Footer = V121Footer;
