// src/themes/v11-applebooks.jsx — iBooks style: wood background, paper spread, bookmark ribbon
const V11_BG_TONES = {
  walnut:   { wood: 'linear-gradient(135deg, #8B6F47 0%, #6B5237 60%, #8B6F47 100%)', paper: '#F8F1E3' },
  oak:      { wood: 'linear-gradient(135deg, #C4A274 0%, #96734B 60%, #C4A274 100%)', paper: '#FAF5EA' },
  mahogany: { wood: 'linear-gradient(135deg, #5A2818 0%, #3F1B10 60%, #5A2818 100%)', paper: '#F5EADA' },
  ebony:    { wood: 'linear-gradient(135deg, #2C2218 0%, #1A130C 60%, #2C2218 100%)', paper: '#F4EEDF' },
  cherry:   { wood: 'linear-gradient(135deg, #7A2F26 0%, #4E1C16 60%, #7A2F26 100%)', paper: '#F9F2E4' },
  maple:    { wood: 'linear-gradient(135deg, #D4A674 0%, #A87541 60%, #D4A674 100%)', paper: '#FBF6EA' },
  rosewood: { wood: 'linear-gradient(135deg, #6B342E 0%, #4A1F1A 60%, #6B342E 100%)', paper: '#F8EFE0' },
  birch:    { wood: 'linear-gradient(135deg, #E0CFA0 0%, #C2A878 60%, #E0CFA0 100%)', paper: '#FCF7E8' },
  teak:     { wood: 'linear-gradient(135deg, #9C6B3F 0%, #6B4A2E 60%, #9C6B3F 100%)', paper: '#F8F0DA' },
};

function V11Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V11_BG_TONES[settings.themeColors.v11.bgTone] || V11_BG_TONES.walnut;
  const accent = settings.themeColors.v11.accent;
  const paper = tone.paper;
  const ink = '#2A241B', mute = 'rgba(42,36,27,0.55)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: tone.wood, position: 'relative', overflow: 'auto',
      backgroundImage: `${tone.wood}, repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 7px)`,
      padding: '32px 48px', '--accent': accent,
    }}>
      <div style={{
        position: 'relative', maxWidth: 760, margin: '0 auto',
        background: paper, padding: '56px 64px 52px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.35), 0 12px 20px rgba(0,0,0,0.18)',
        borderRadius: 2,
      }} className={settings.tweaks.texture ? 'paper-tex' : ''}>
        {/* bookmark ribbon */}
        <div style={{
          position: 'absolute', top: 0, right: 40, width: 22, height: 72,
          background: accent, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}/>
        <div style={{ fontSize: 10, letterSpacing: '0.32em', color: mute, marginBottom: 18, fontFamily: 'var(--ui)' }}>
          {(book.title || '').split('').join('　')} · 第 {chapterIdx + 1} 章
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 500, margin: '0 0 30px', letterSpacing: '0.08em', lineHeight: 1.3, color: ink }}>
          {stripChapterPrefix(chapterTitle)}
        </h1>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
        }} dangerouslySetInnerHTML={{ __html: book.preserveOriginalCss ? html : injectDropCap(html, settings.tweaks.fontSize * 2.2) }}/>
        <div style={{ textAlign: 'center', fontSize: 10, color: mute, fontFamily: 'var(--ui)', marginTop: 32 }}>
          {chapterIdx + 1}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 18, borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: '0.5px solid rgba(0,0,0,0.2)', borderRadius: 999 }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: '0.5px solid rgba(0,0,0,0.2)', borderRadius: 999 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V11Footer({ book, chapterIdx, settings }) {
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 0', display: 'flex', justifyContent: 'center',
      background: 'linear-gradient(135deg, #8B6F47 0%, #6B5237 60%, #8B6F47 100%)',
      borderTop: '1px solid rgba(0,0,0,0.3)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '6px 18px',
        background: 'rgba(30,20,10,0.45)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
        fontSize: 11, color: 'rgba(245,233,210,0.92)', fontFamily: 'var(--ui)',
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{chapterIdx + 1} / {total}</span>
        <div style={{ width: 180, height: 2, background: 'rgba(255,255,255,0.22)', borderRadius: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: '#F5E9D2', borderRadius: 1 }}/>
        </div>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

window.V11Reader = V11Reader;
window.V11Footer = V11Footer;
