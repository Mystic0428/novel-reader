// src/ui/stats-panel.jsx — reading stats modal: hero strip + activity heatmap + tiles
function StatsPanel({ books, open, onClose, onOpenBook }) {
  const [stats, setStats] = React.useState(null);
  const [heatmap, setHeatmap] = React.useState([]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const [s, h] = await Promise.all([
        readingEventsStore.computeStats(),
        readingEventsStore.getHeatmap(365),
      ]);
      if (cancelled) return;
      setStats(s);
      setHeatmap(h);
    })();
    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  // Theme — dark with gold accent, matches library page palette
  const bg = '#0B0B0E', surface = '#16161C', card = '#1A1A22', ink = '#F4F4F6';
  const mute = 'rgba(244,244,246,0.55)', rule = 'rgba(255,255,255,0.08)';
  const gold = '#E8A93A', red = '#E50914', cyan = '#5EC8E5';

  const finishedBooks = (books || []).filter((b) => {
    if (!b.lastChapterId || !b.chaptersMeta || !b.chaptersMeta.length) return false;
    return b.chaptersMeta[b.chaptersMeta.length - 1].id === b.lastChapterId
      && (b.lastScroll || 0) >= 0.9;
  });

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 950,
      }}/>
      <div style={{
        position: 'fixed', inset: '40px 40px', maxWidth: 1100, margin: '0 auto',
        background: bg, color: ink, zIndex: 951, borderRadius: 12,
        border: `0.5px solid ${rule}`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: '"Inter","Noto Sans TC",sans-serif',
      }}>
        {/* topbar */}
        <div style={{
          padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: `0.5px solid ${rule}`, flexShrink: 0,
        }}>
          <div style={{
            fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em',
            background: `linear-gradient(90deg,${gold},#FF8855)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>📊 閱讀統計</div>
          <div style={{ flex: 1 }}/>
          <button onClick={onClose} style={{
            background: 'transparent', color: mute, border: `1px solid ${rule}`,
            padding: '4px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: '0.15em',
          }}>關閉 ✕</button>
        </div>

        {/* body */}
        <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 32px' }}>
          {!stats && (
            <div style={{ padding: 80, textAlign: 'center', color: mute, fontSize: 13 }}>
              載入中…
            </div>
          )}
          {stats && stats.totalChapters === 0 && (
            <div style={{ padding: 80, textAlign: 'center', color: mute, fontSize: 13, lineHeight: 1.8 }}>
              還沒有閱讀紀錄。<br/>
              開一本書讀一章後再回來看看。
            </div>
          )}
          {stats && stats.totalChapters > 0 && (
            <>
              <HeroRibbon stats={stats} ink={ink} mute={mute} card={card} gold={gold} red={red} cyan={cyan}/>
              <div style={{ height: 24 }}/>
              <ActivityHeatmap heatmap={heatmap} card={card} mute={mute} ink={ink} gold={gold}/>
              <div style={{ height: 24 }}/>
              <StatTiles stats={stats} card={card} mute={mute} ink={ink} gold={gold} red={red} cyan={cyan}/>
              {finishedBooks.length > 0 && (
                <>
                  <div style={{ height: 24 }}/>
                  <FinishedList books={finishedBooks} card={card} mute={mute} ink={ink} gold={gold} onOpenBook={onOpenBook}/>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function HeroRibbon({ stats, ink, mute, card, gold, red, cyan }) {
  const xpPct = (stats.xpInLevel / stats.xpForNext) * 100;
  return (
    <div style={{
      padding: 22, background: card, borderRadius: 10,
      border: `1px solid ${gold}33`,
      boxShadow: `0 0 30px ${gold}15, inset 0 0 24px rgba(0,0,0,0.4)`,
      display: 'grid', gridTemplateColumns: '180px 1fr 220px', gap: 26, alignItems: 'center',
    }}>
      {/* avatar/level badge */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', width: 80, height: 80, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${gold}, ${gold}99 60%, #1A1408 110%)`,
          border: `2px solid ${gold}`,
          display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 900,
          color: '#1A1408', boxShadow: `0 0 20px ${gold}55`,
        }}>{stats.level}</div>
        <div style={{
          fontSize: 10, color: gold, letterSpacing: '0.4em', fontWeight: 800, marginTop: 6,
        }}>LV. {stats.level} READER</div>
      </div>

      {/* streak + xp bar */}
      <div>
        <div style={{ fontSize: 11, color: gold, letterSpacing: '0.4em', fontWeight: 800 }}>
          🔥 CURRENT STREAK
        </div>
        <div style={{
          fontSize: 56, fontWeight: 900, color: ink, letterSpacing: '-0.02em', lineHeight: 1,
          fontFamily: '"Noto Serif TC",serif',
        }}>
          {stats.currentStreak} <span style={{ fontSize: 18, color: mute, fontWeight: 600, letterSpacing: '0.1em' }}>連續天</span>
        </div>
        <div style={{
          marginTop: 14, display: 'flex', justifyContent: 'space-between',
          fontSize: 10, color: mute, letterSpacing: '0.2em', fontWeight: 700, marginBottom: 4,
        }}>
          <span>NEXT LEVEL</span>
          <span style={{ color: gold }}>{stats.xpInLevel} / {stats.xpForNext} 章</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${xpPct}%`,
            background: `linear-gradient(90deg, ${gold}, #FF9444)`,
            boxShadow: `0 0 8px ${gold}80`,
          }}/>
        </div>
      </div>

      {/* secondary stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <HeroStat label="🏆 LONGEST" value={`${stats.longestStreak}d`} color={gold}/>
        <HeroStat label="⚡ ACTIVE" value={`${stats.activeDays}d`} color={cyan}/>
        <HeroStat label="📚 CHAPTERS" value={stats.totalChapters} color="#88FFAA"/>
      </div>
    </div>
  );
}

function HeroStat({ label, value, color }) {
  return (
    <div style={{
      padding: '8px 12px', background: 'rgba(0,0,0,0.3)',
      border: `1px solid ${color}44`, borderRadius: 4,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 10, color, fontWeight: 800, letterSpacing: '0.15em', minWidth: 80 }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 800, color: '#F4F4F6', fontVariantNumeric: 'tabular-nums', flex: 1, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

// GitHub-style activity heatmap. 53 weeks × 7 days, color intensity by count.
function ActivityHeatmap({ heatmap, card, mute, ink, gold }) {
  // Bucket by week (column). First column may be partial.
  const weeks = [];
  let week = new Array(7).fill(null);
  if (heatmap.length > 0) {
    // Pad start so first day's weekday lands in correct row
    const firstWeekday = heatmap[0].weekday;
    for (let i = 0; i < firstWeekday; i++) week[i] = { date: null, count: 0 };
  }
  for (const day of heatmap) {
    week[day.weekday] = day;
    if (day.weekday === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  }
  if (week.some((d) => d !== null)) weeks.push(week);

  const intensity = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  };
  const colors = [
    'rgba(255,255,255,0.05)',
    `${gold}30`,
    `${gold}66`,
    `${gold}aa`,
    gold,
  ];

  // Month labels — just label first column of each month
  const monthLabels = weeks.map((w, wIdx) => {
    const firstDay = w.find((d) => d && d.date);
    if (!firstDay) return null;
    const day = new Date(firstDay.date).getDate();
    const month = new Date(firstDay.date).getMonth();
    if (day <= 7 && wIdx > 0) return { wIdx, month };
    if (wIdx === 0) return { wIdx, month };
    return null;
  }).filter(Boolean);
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const cellSize = 11, cellGap = 3;
  return (
    <div style={{ padding: 22, background: card, borderRadius: 10, border: `1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: gold, letterSpacing: '0.4em', fontWeight: 800 }}>
          ▦ ACTIVITY · 過去 365 天
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 10, color: mute, letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>少</span>
          {colors.map((c, i) => (
            <span key={i} style={{ width: cellSize, height: cellSize, background: c, borderRadius: 2, border: `0.5px solid rgba(255,255,255,0.04)` }}/>
          ))}
          <span>多</span>
        </div>
      </div>
      <div style={{ overflow: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'inline-block', position: 'relative', minWidth: '100%' }}>
          {/* month labels row */}
          <div style={{ display: 'flex', gap: cellGap, marginLeft: 22, marginBottom: 4, height: 12 }}>
            {weeks.map((_, wIdx) => {
              const m = monthLabels.find((x) => x.wIdx === wIdx);
              return (
                <div key={wIdx} style={{ width: cellSize, fontSize: 9, color: mute, letterSpacing: '0.05em' }}>
                  {m ? monthNames[m.month] : ''}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: cellGap, alignItems: 'flex-start' }}>
            {/* weekday labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: cellGap, fontSize: 9, color: mute, marginRight: 4, width: 18 }}>
              {['', '一', '', '三', '', '五', ''].map((d, i) => (
                <div key={i} style={{ height: cellSize, lineHeight: `${cellSize}px` }}>{d}</div>
              ))}
            </div>
            {/* cells */}
            <div style={{ display: 'flex', gap: cellGap }}>
              {weeks.map((w, wIdx) => (
                <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: cellGap }}>
                  {w.map((d, dIdx) => (
                    <div key={dIdx}
                      title={d && d.date ? `${d.date} · ${d.count} 章` : ''}
                      style={{
                        width: cellSize, height: cellSize,
                        background: d ? colors[intensity(d.count)] : 'transparent',
                        borderRadius: 2,
                        border: d && d.date ? `0.5px solid rgba(255,255,255,0.04)` : 'none',
                      }}/>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTiles({ stats, card, mute, ink, gold, red, cyan }) {
  const tiles = [
    { label: '總章節數',   value: stats.totalChapters, color: gold },
    { label: '總字數',     value: formatNum(stats.totalWords), color: cyan },
    { label: '累計天數',   value: stats.activeDays, color: '#88FFAA' },
    { label: '最長連讀',   value: `${stats.longestStreak}d`, color: red },
    { label: '當前等級',   value: `Lv.${stats.level}`, color: gold },
    { label: '首次閱讀',   value: stats.firstDate || '—', color: mute, small: true },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
      {tiles.map((t) => (
        <div key={t.label} style={{
          padding: '14px 14px', background: card, borderRadius: 8,
          border: `1px solid ${t.color}33`,
        }}>
          <div style={{
            fontSize: 9, color: t.color, letterSpacing: '0.25em', fontWeight: 800,
          }}>{t.label.toUpperCase()}</div>
          <div style={{
            fontSize: t.small ? 14 : 28, fontWeight: 900, color: ink,
            letterSpacing: '-0.02em', marginTop: 4,
            fontVariantNumeric: 'tabular-nums',
            fontFamily: t.small ? 'inherit' : '"Noto Serif TC",serif',
          }}>{t.value}</div>
        </div>
      ))}
    </div>
  );
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000) return (n / 10_000).toFixed(1) + '萬';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function FinishedList({ books, card, mute, ink, gold, onOpenBook }) {
  const sorted = [...books].sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0));
  return (
    <div style={{ padding: 22, background: card, borderRadius: 10, border: `1px solid rgba(255,255,255,0.06)` }}>
      <div style={{
        fontSize: 10, color: gold, letterSpacing: '0.4em', fontWeight: 800, marginBottom: 14,
      }}>
        🏆 已讀完 · {books.length} 本
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {sorted.slice(0, 30).map((b) => (
          <div key={b.id}
            onClick={() => onOpenBook && onOpenBook(b.id)}
            style={{
              padding: '6px 12px', background: 'rgba(255,255,255,0.04)',
              border: `0.5px solid ${gold}33`, borderRadius: 16,
              fontSize: 12, color: ink, cursor: 'pointer',
              maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }} title={`${b.title}${b.author ? ' · ' + b.author : ''}`}>
            {b.title}
          </div>
        ))}
        {sorted.length > 30 && (
          <div style={{ padding: '6px 12px', fontSize: 12, color: mute }}>… +{sorted.length - 30}</div>
        )}
      </div>
    </div>
  );
}

window.StatsPanel = StatsPanel;
