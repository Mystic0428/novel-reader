// src/ui/theme-switcher.jsx — 3-thumbnail theme picker in top bar
function ThemeSwitcher({ settings, onChange }) {
  const themes = [
    { key: 'v1', label: 'Warm', swatch: { bg: '#EDE4D2', accent: settings.themeColors.v1.accent } },
    { key: 'v4', label: 'Glass', swatch: { bg: 'linear-gradient(135deg,#F5DEB3,#C9A5D4)', accent: settings.themeColors.v4.accent } },
    { key: 'v5', label: 'Dark',  swatch: { bg: '#13201C', accent: settings.themeColors.v5.accent } },
  ];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {themes.map((t) => {
        const active = settings.activeTheme === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px 4px 4px',
            borderRadius: 14, fontFamily: 'var(--ui)', fontSize: 11,
            border: `0.5px solid ${active ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
            background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
            cursor: 'pointer',
          }}>
            <span style={{
              display: 'inline-block', width: 18, height: 18, borderRadius: 10,
              background: t.swatch.bg,
              boxShadow: `inset 0 0 0 2px ${t.swatch.accent}`,
            }}/>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
window.ThemeSwitcher = ThemeSwitcher;
