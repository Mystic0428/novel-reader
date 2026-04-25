// src/ui/theme-switcher.jsx — dropdown theme picker (scales to many themes)
function ThemeSwitcher({ settings, onChange }) {
  const [open, setOpen] = React.useState(false);
  const themes = [
    { key: 'v1',  label: 'Warm · 書房',       group: '經典', swatch: { bg: '#EDE4D2' } },
    { key: 'v4',  label: 'Glass · 毛玻璃',    group: '經典', swatch: { bg: 'linear-gradient(135deg,#F5DEB3,#C9A5D4)' } },
    { key: 'v5',  label: 'Dark · 典藏',       group: '經典', swatch: { bg: '#13201C' } },
    { key: 'v6',  label: 'Terminal · 終端機',  group: '復古', swatch: { bg: '#0C0A06' } },
    { key: 'v9',  label: 'Brutalist · 野獸派', group: '現代', swatch: { bg: '#EEEBE4' } },
    { key: 'v11', label: 'Apple Books · 書櫃', group: '經典', swatch: { bg: 'linear-gradient(135deg,#8B6F47,#6B5237)' } },
    { key: 'v17', label: 'Deco · 裝飾藝術',    group: '華麗', swatch: { bg: '#0A0A0A' } },
    { key: 'v18', label: 'Baroque · 巴洛克',   group: '華麗', swatch: { bg: 'radial-gradient(circle at 30% 30%,#4A1A1F,#220609)' } },
    { key: 'v19', label: 'Dunhuang · 敦煌',    group: '華麗', swatch: { bg: '#E8D7B5' } },
    { key: 'v20', label: 'Arcana · 塔羅',      group: '華麗', swatch: { bg: 'radial-gradient(circle at 50% 20%,#1A1640,#0E0B24)' } },
    { key: 'v21', label: '宋卷 · 山水',        group: '東方', swatch: { bg: 'linear-gradient(180deg,#DCCFA9,#E9DFC6)' } },
    { key: 'v25', label: '青花 · 瓷器',        group: '東方', swatch: { bg: '#F4EDDC' } },
    { key: 'v30', label: 'Gothic · 哥德',      group: '華麗', swatch: { bg: 'radial-gradient(ellipse,#1A1410,#0A0A0A)' } },
    { key: 'v31', label: 'Memphis · 80s',     group: '現代', swatch: { bg: '#FFF4E0' } },
    { key: 'v32', label: 'Wes · 對稱',         group: '現代', swatch: { bg: '#F7ECD8' } },
    { key: 'v33', label: 'Cyberpunk · 霓虹',   group: '現代', swatch: { bg: 'radial-gradient(ellipse at 20% 20%,#8E3DF033,#050218)' } },
    { key: 'v37', label: 'Editorial · 極黑',   group: '現代', swatch: { bg: '#000' } },
    { key: 'v38', label: '紙墨 · 純讀',        group: '經典', swatch: { bg: '#FDFBF7' } },
    { key: 'v39', label: '浮世繪 · 北齋',      group: '東方', swatch: { bg: '#F4ECD8' } },
    { key: 'v40', label: '水墨 · 沉硯',        group: '東方', swatch: { bg: '#F2EBDB' } },
  ];
  const active = themes.find(t => t.key === settings.activeTheme) || themes[0];
  const groups = ['經典', '復古', '現代', '華麗', '東方'];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(v => !v)} title="切換風格" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 28, padding: '0 10px 0 6px',
        background: 'transparent', border: '0.5px solid rgba(0,0,0,0.18)', borderRadius: 6,
        cursor: 'pointer', fontFamily: 'var(--ui)', fontSize: 12,
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: 9, display: 'inline-block',
          background: active.swatch.bg,
          boxShadow: `inset 0 0 0 2px ${settings.themeColors[active.key].accent}`,
          flexShrink: 0,
        }}/>
        <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{active.label}</span>
        <span style={{ fontSize: 8, opacity: 0.6 }}>▾</span>
      </button>
      {open && <>
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 850 }}/>
        <div style={{
          position: 'absolute', right: 0, top: 34, width: 260, maxHeight: 420,
          overflow: 'auto', background: '#fff',
          border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 10,
          boxShadow: '0 10px 34px rgba(0,0,0,0.16)',
          padding: 6, zIndex: 851, fontFamily: 'var(--ui)',
        }} className="scroll-thin">
          {groups.map(g => {
            const items = themes.filter(t => t.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <div style={{ padding: '8px 10px 4px', fontSize: 9, letterSpacing: '0.2em', fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>
                  {g.toUpperCase()}
                </div>
                {items.map(t => {
                  const isActive = t.key === settings.activeTheme;
                  return (
                    <button key={t.key} onClick={() => { onChange(t.key); setOpen(false); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '6px 10px', border: 'none', borderRadius: 6,
                      background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
                      color: 'rgba(0,0,0,0.85)', textAlign: 'left',
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 10, display: 'inline-block', flexShrink: 0,
                        background: t.swatch.bg,
                        boxShadow: `inset 0 0 0 2px ${settings.themeColors[t.key].accent}`,
                      }}/>
                      <span style={{ flex: 1 }}>{t.label}</span>
                      {isActive && <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>}
    </div>
  );
}
window.ThemeSwitcher = ThemeSwitcher;
