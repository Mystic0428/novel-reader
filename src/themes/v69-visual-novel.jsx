// src/themes/v69-visual-novel.jsx — Japanese visual novel: scenery gradient + translucent dialogue box
const V69_BG_TONES = {
  sakura:  { sky: 'linear-gradient(180deg,#FFD0E0 0%, #FFE0E8 50%, #F8C0D0 100%)', box: 'rgba(40,20,30,0.78)', ink: '#FFFFFF', name: '#FFB3CC', mute: '#D8B0C0' },
  twilight:{ sky: 'linear-gradient(180deg,#3A1A48 0%, #6B3060 50%, #C04878 100%)', box: 'rgba(20,10,30,0.82)', ink: '#FFFFFF', name: '#FFA0CC', mute: '#C090C0' },
  ocean:   { sky: 'linear-gradient(180deg,#1A3868 0%, #3A6098 50%, #6088B8 100%)', box: 'rgba(10,20,40,0.82)', ink: '#FFFFFF', name: '#9CC8FF', mute: '#90B0C8' },
  forest:  { sky: 'linear-gradient(180deg,#1A3018 0%, #3A6028 50%, #688838 100%)', box: 'rgba(10,20,10,0.82)', ink: '#FFFFFF', name: '#C8E898', mute: '#A0C898' },
  snow:    { sky: 'linear-gradient(180deg,#E8F0F8 0%, #FFFFFF 60%, #D0DCEC 100%)', box: 'rgba(20,30,50,0.78)', ink: '#FFFFFF', name: '#88B0E0', mute: '#A8C0E0' },
  night:   { sky: 'linear-gradient(180deg,#08081A 0%, #181838 60%, #2A2A50 100%)', box: 'rgba(0,0,0,0.78)', ink: '#FFFFFF', name: '#A8B8FF', mute: '#9098B8' },
  sunset:  { sky: 'linear-gradient(180deg,#1A0A0A 0%, #6B2820 40%, #FF7848 80%, #FFB870 100%)', box: 'rgba(20,10,5,0.8)', ink: '#FFFFFF', name: '#FFC078', mute: '#D89878' },
  rain:    { sky: 'linear-gradient(180deg,#3A4858 0%, #587890 50%, #788090 100%)', box: 'rgba(10,15,25,0.82)', ink: '#FFFFFF', name: '#A0C0E0', mute: '#A8B8C8' },
  cherry:  { sky: 'linear-gradient(180deg,#3A0814 0%, #6B1A28 50%, #A03048 100%)', box: 'rgba(10,5,8,0.82)', ink: '#FFFFFF', name: '#FF98AC', mute: '#C898A8' },
};

function V69Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V69_BG_TONES[settings.themeColors.v69.bgTone] || V69_BG_TONES.sakura;
  const accent = settings.themeColors.v69.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: tone.sky, padding: 0, position: 'relative',
      fontFamily: '"Noto Serif TC","Hiragino Mincho",var(--serif)',
    }}>
      {/* faint sparkles overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.5,
        backgroundImage: `radial-gradient(circle at 20% 18%, rgba(255,255,255,0.7) 0, transparent 1.5px),
                          radial-gradient(circle at 70% 25%, rgba(255,255,255,0.6) 0, transparent 1.5px),
                          radial-gradient(circle at 40% 55%, rgba(255,255,255,0.7) 0, transparent 1.5px),
                          radial-gradient(circle at 85% 65%, rgba(255,255,255,0.5) 0, transparent 1.5px),
                          radial-gradient(circle at 15% 80%, rgba(255,255,255,0.6) 0, transparent 1.5px)`,
      }}/>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '50px 30px 30px', position: 'relative', zIndex: 1 }}>
        {/* speaker name tag */}
        <div style={{
          display: 'inline-block', padding: '6px 18px',
          background: tone.box, color: tone.name, borderRadius: '12px 12px 0 0',
          fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          borderLeft: `2px solid ${tone.name}`, borderTop: `2px solid ${tone.name}`, borderRight: `2px solid ${tone.name}`,
        }}>
          ❀ {book.author || 'narrator'} ❀
        </div>

        {/* dialogue box */}
        <div style={{
          background: tone.box, color: tone.ink,
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          padding: '22px 26px', borderRadius: '0 14px 14px 14px',
          border: `1px solid ${tone.name}`,
          boxShadow: `0 12px 36px rgba(0,0,0,0.3)`,
        }}>
          {/* chapter marker */}
          <div style={{
            fontSize: 11, color: tone.name, letterSpacing: '0.3em', fontWeight: 600, marginBottom: 6,
          }}>
            ✦ Scene {String(chapterIdx + 1).padStart(2, '0')} of {String(total).padStart(2, '0')} ✦
          </div>
          {/* title */}
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 600,
            margin: '0 0 14px', color: tone.ink, letterSpacing: '0.04em',
            textShadow: `0 2px 8px rgba(0,0,0,0.4)`,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: tone.ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': tone.name,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* triangle continue */}
          <div style={{
            textAlign: 'right', marginTop: 14, fontSize: 18, color: tone.name,
            animation: 'v69bounce 1.4s ease-in-out infinite',
          }}>▼</div>
          <style>{`@keyframes v69bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(3px);} }`}</style>
        </div>

        {/* control row — Skip / Auto / Log style buttons */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end',
        }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '6px 14px', borderRadius: 16,
            background: tone.box, color: tone.ink, border: `1px solid ${tone.name}`,
            backdropFilter: 'blur(10px)',
            fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 600,
          }}>◀ BACK</button>
          <button style={{
            ...btnStyle(), padding: '6px 14px', borderRadius: 16,
            background: tone.box, color: tone.mute, border: `1px solid ${tone.name}`, opacity: 0.5,
            fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontSize: 11,
          }} disabled>AUTO</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '6px 14px', borderRadius: 16,
            background: tone.name, color: tone.box, border: `1px solid ${tone.name}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>NEXT ▶</button>
        </div>
      </article>
    </main>
  );
}

function V69Footer({ book, chapterIdx, settings }) {
  const tone = V69_BG_TONES[settings.themeColors.v69.bgTone] || V69_BG_TONES.sakura;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.box,
      backdropFilter: 'blur(10px)',
      borderTop: `1px solid ${tone.name}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontSize: 11, color: tone.ink, letterSpacing: '0.2em',
    }}>
      <span style={{ color: tone.name }}>❀ scene {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.18)', borderRadius: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.name, borderRadius: 1 }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V69Reader = V69Reader;
window.V69Footer = V69Footer;
