// src/ui/book-card.jsx — library-card-style book detail modal
// Triggered from right-click menu → 「📋 書本資訊」.
function BookCard({ book, open, onClose, onOpenBook, onChanged }) {
  const [coverUrl, setCoverUrl] = React.useState(null);
  const [events, setEvents] = React.useState(null);

  React.useEffect(() => {
    if (!open || !book) return;
    if (book.coverBlob) {
      const u = URL.createObjectURL(book.coverBlob);
      setCoverUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setCoverUrl(null);
  }, [open, book && book.id, book && book.coverBlob]);

  React.useEffect(() => {
    if (!open || !book) return;
    let cancelled = false;
    (async () => {
      try {
        const all = await idb.listByIndex('readingEvents', 'byBook', book.id);
        if (cancelled) return;
        // newest first
        all.sort((a, b) => (b.ts || 0) - (a.ts || 0));
        setEvents(all);
      } catch (_) {
        if (!cancelled) setEvents([]);
      }
    })();
    return () => { cancelled = true; };
  }, [open, book && book.id]);

  if (!open || !book) return null;

  // Theme: dark with parchment-card surface, library-card vibe
  const bg = '#0B0B0E', card = '#F4ECD8', cardInk = '#1A1408';
  const cardSub = '#5A4828', stamp = '#B82820', rule = '#A88858';
  const total = (book.chaptersMeta || []).length;
  const chapterIdx = (book.chaptersMeta || []).findIndex((c) => c.id === book.lastChapterId);
  const progress = total ? (chapterIdx + 1) / total : 0;
  const finished = chapterIdx === total - 1 && (book.lastScroll || 0) >= 0.9;
  const status = !book.lastReadAt ? '未開始' : finished ? '已讀完' : `第 ${chapterIdx + 1} / ${total} 章`;
  const dewey = `${800 + (book.id ? (book.id.length * 7) % 100 : 0)}.${(book.title || '').length.toString().padStart(2, '0')}`;
  const newCount = newChapterCount(book);
  const accent = book.accent || stamp;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 950,
      }}/>
      <div style={{
        position: 'fixed', inset: '40px 40px', maxWidth: 760, margin: '0 auto',
        background: card, color: cardInk, zIndex: 951, borderRadius: 6,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.4)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: '"Special Elite","Courier Prime","Courier New",monospace',
      }}>
        {/* paper texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06, mixBlendMode: 'multiply',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23p)'/></svg>")`,
        }}/>

        {/* topbar — call number + DUE stamp + close */}
        <div style={{
          padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: `1.5px solid ${cardInk}`, position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <div style={{
            padding: '6px 12px', background: 'rgba(0,0,0,0.05)', border: `1.5px solid ${cardInk}`,
            fontSize: 14, fontWeight: 800, letterSpacing: '0.04em',
          }}>{dewey}</div>
          <div style={{ fontSize: 10, color: cardSub, letterSpacing: '0.3em', fontWeight: 700 }}>
            CATALOG CARD · BOOK ID {book.id ? book.id.slice(0, 8).toUpperCase() : '—'}
          </div>
          <div style={{ flex: 1 }}/>
          {finished ? (
            <div style={{
              transform: 'rotate(8deg)', padding: '4px 10px',
              border: `2px solid ${stamp}`, color: stamp,
              fontWeight: 900, fontSize: 11, letterSpacing: '0.3em',
            }}>FINISHED</div>
          ) : book.lastReadAt ? (
            <div style={{
              transform: 'rotate(-4deg)', padding: '4px 10px',
              border: `2px solid ${cardInk}`, color: cardInk,
              fontWeight: 900, fontSize: 11, letterSpacing: '0.3em',
            }}>BORROWED</div>
          ) : null}
          <button onClick={onClose} style={{
            background: 'transparent', color: cardInk, border: `1px solid ${rule}`,
            padding: '4px 12px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer',
            letterSpacing: '0.2em', fontWeight: 700,
          }}>✕</button>
        </div>

        {/* body */}
        <div className="scroll-thin" style={{
          flex: 1, overflowY: 'auto', padding: '24px 26px 24px',
          position: 'relative', zIndex: 1,
        }}>
          {/* header — cover + title meta */}
          <div style={{ display: 'flex', gap: 22, marginBottom: 20 }}>
            <div style={{ flexShrink: 0 }}>
              {coverUrl ? (
                <img src={coverUrl} alt="" style={{
                  width: 140, aspectRatio: '2/3', objectFit: 'cover', display: 'block',
                  border: `1.5px solid ${cardInk}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
                }}/>
              ) : (
                <div style={{
                  width: 140, aspectRatio: '2/3', background: accent,
                  border: `1.5px solid ${cardInk}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--serif)', fontSize: 18, color: '#fff', fontWeight: 700,
                  textAlign: 'center', padding: 10, lineHeight: 1.3,
                }}>{(book.title || '').slice(0, 20)}</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, color: cardSub, letterSpacing: '0.3em', fontWeight: 700, marginBottom: 4 }}>
                TITLE
              </div>
              <div style={{
                fontFamily: '"Noto Serif TC","Songti TC",serif', fontSize: 26, fontWeight: 700,
                color: cardInk, lineHeight: 1.2, marginBottom: 8,
              }}>{book.title}</div>
              <div style={{ fontSize: 9, color: cardSub, letterSpacing: '0.3em', fontWeight: 700, marginBottom: 4 }}>
                AUTHOR
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: cardInk, marginBottom: 14 }}>
                {book.author || '— anonymous —'}
              </div>

              {/* tags + collections */}
              {(book.tags || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {book.tags.map((t) => (
                    <span key={t} style={{
                      padding: '2px 8px', background: 'rgba(0,0,0,0.06)',
                      border: `0.5px dashed ${rule}`, fontSize: 10,
                      letterSpacing: '0.1em', color: cardInk, fontFamily: 'inherit',
                    }}># {t}</span>
                  ))}
                </div>
              )}
              {(book.collections || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {book.collections.map((c) => (
                    <span key={c} style={{
                      padding: '2px 8px', background: 'rgba(0,0,0,0.06)',
                      border: `0.5px dashed ${rule}`, fontSize: 10,
                      letterSpacing: '0.1em', color: cardInk, fontFamily: 'inherit',
                    }}>📁 {c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 16px',
          }}>
            <div style={{ flex: 1, height: 1, background: cardInk, opacity: 0.4 }}/>
            <span style={{ fontSize: 9, color: cardSub, letterSpacing: '0.4em', fontWeight: 700 }}>
              CIRCULATION RECORD
            </span>
            <div style={{ flex: 1, height: 1, background: cardInk, opacity: 0.4 }}/>
          </div>

          {/* stat grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18,
          }}>
            <CardStat label="加入" value={fmtDate(book.addedAt)} mute={cardSub} ink={cardInk}/>
            <CardStat label="上次閱讀" value={book.lastReadAt ? fmtDate(book.lastReadAt) : '—'} mute={cardSub} ink={cardInk}/>
            <CardStat label="狀態" value={status} mute={cardSub} ink={finished ? stamp : cardInk}/>
            <CardStat label="章節" value={`${total} 章`} mute={cardSub} ink={cardInk}/>
            <CardStat label="字數" value={fmtNum(book.wordCount || 0)} mute={cardSub} ink={cardInk}/>
            <CardStat label="進度" value={`${Math.round(progress * 100)}%`} mute={cardSub} ink={cardInk} accent={accent}/>
          </div>

          {newCount > 0 && (
            <div style={{
              padding: '10px 14px', marginBottom: 18,
              border: `1.5px solid ${stamp}`, background: `${stamp}10`,
              fontSize: 12, color: stamp, fontWeight: 700, letterSpacing: '0.15em',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span>有 {newCount} 章新增 — 上次離開後檔案有更新</span>
            </div>
          )}

          {/* recent events */}
          {events && events.length > 0 && (
            <>
              <div style={{
                fontSize: 9, color: cardSub, letterSpacing: '0.4em', fontWeight: 700, marginBottom: 8,
              }}>RECENT ACTIVITY</div>
              <div style={{
                border: `0.5px dashed ${rule}`, marginBottom: 18,
              }}>
                {events.slice(0, 5).map((e, i) => {
                  const ch = (book.chaptersMeta || []).find((c) => c.id === e.chapterId);
                  const chTitle = ch ? stripChapterPrefix(ch.title) : '—';
                  const chIdx = (book.chaptersMeta || []).findIndex((c) => c.id === e.chapterId);
                  return (
                    <div key={e.id} style={{
                      display: 'grid', gridTemplateColumns: '90px 60px 1fr',
                      padding: '6px 12px', fontSize: 11,
                      borderBottom: i < Math.min(4, events.length - 1) ? `0.5px dashed ${rule}` : 'none',
                    }}>
                      <span style={{ color: stamp, fontWeight: 700, letterSpacing: '0.1em' }}>{e.date}</span>
                      <span style={{ color: cardSub, fontVariantNumeric: 'tabular-nums' }}>
                        {chIdx >= 0 ? `第 ${chIdx + 1} 章` : '—'}
                      </span>
                      <span style={{ color: cardInk, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chTitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 14px',
          }}>
            <div style={{ flex: 1, height: 1, background: cardInk, opacity: 0.4 }}/>
            <span style={{ fontSize: 9, color: cardSub, letterSpacing: '0.4em', fontWeight: 700 }}>
              ACTIONS
            </span>
            <div style={{ flex: 1, height: 1, background: cardInk, opacity: 0.4 }}/>
          </div>

          {/* primary actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => { onOpenBook(book.id); onClose(); }} style={{
              padding: '10px 22px', background: cardInk, color: card,
              border: `1.5px solid ${cardInk}`, fontFamily: 'inherit', fontWeight: 800,
              fontSize: 13, letterSpacing: '0.25em', cursor: 'pointer',
            }}>{book.lastReadAt ? '▶ 繼續閱讀' : '▶ 開始閱讀'}</button>
            {book.lastReadAt && (
              <button onClick={async () => {
                if (!confirm(`回到第一章？\n（會清除目前閱讀進度）`)) return;
                await booksStore.update(book.id, {
                  lastChapterId: book.chaptersMeta[0]?.id || null,
                  lastScroll: 0, lastReadAt: null,
                });
                onChanged && (await onChanged());
                onClose();
              }} style={{
                padding: '10px 18px', background: 'transparent', color: cardInk,
                border: `1.5px solid ${cardInk}`, fontFamily: 'inherit', fontWeight: 700,
                fontSize: 12, letterSpacing: '0.2em', cursor: 'pointer',
              }}>↺ 從頭開始</button>
            )}
            <button onClick={async () => {
              const next = window.prompt(
                `# Tags（逗號分隔）：`,
                (book.tags || []).join(', ')
              );
              if (next === null) return;
              const tags = next.split(',').map((s) => s.trim()).filter(Boolean);
              await booksStore.update(book.id, { tags });
              onChanged && (await onChanged());
            }} style={{
              padding: '10px 14px', background: 'transparent', color: cardInk,
              border: `1px dashed ${rule}`, fontFamily: 'inherit', fontWeight: 600,
              fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer',
            }}># Tags</button>
            <button onClick={async () => {
              const next = window.prompt(
                `📁 Collections（逗號分隔）：`,
                (book.collections || []).join(', ')
              );
              if (next === null) return;
              const collections = next.split(',').map((s) => s.trim()).filter(Boolean);
              await booksStore.update(book.id, { collections });
              onChanged && (await onChanged());
            }} style={{
              padding: '10px 14px', background: 'transparent', color: cardInk,
              border: `1px dashed ${rule}`, fontFamily: 'inherit', fontWeight: 600,
              fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer',
            }}>📁 Collections</button>
            <div style={{ flex: 1 }}/>
            <button onClick={async () => {
              if (!confirm(`從書庫移除「${book.title}」？\n（檔案本身不會刪）`)) return;
              await booksStore.remove(book.id);
              onChanged && (await onChanged());
              onClose();
            }} style={{
              padding: '10px 14px', background: 'transparent', color: stamp,
              border: `1px solid ${stamp}`, fontFamily: 'inherit', fontWeight: 700,
              fontSize: 11, letterSpacing: '0.25em', cursor: 'pointer',
            }}>🗑 REMOVE</button>
          </div>

          {/* date stamps row at bottom — visual flair */}
          <div style={{
            marginTop: 22, paddingTop: 14, borderTop: `0.5px dashed ${rule}`,
            display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {(events || []).slice(0, 8).map((e, i) => (
              <div key={e.id} style={{
                padding: '3px 8px', border: `1px dashed ${stamp}`,
                color: stamp, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                fontFamily: 'inherit',
              }}>
                {e.date.slice(5)}
              </div>
            ))}
            {(!events || events.length === 0) && (
              <div style={{ fontSize: 10, color: cardSub, letterSpacing: '0.3em' }}>
                — 尚無閱讀紀錄 —
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CardStat({ label, value, mute, ink, accent }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: mute, letterSpacing: '0.3em', fontWeight: 700, marginBottom: 2 }}>
        {label.toUpperCase()}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700, color: ink,
        fontVariantNumeric: 'tabular-nums',
        borderBottom: accent ? `2px solid ${accent}` : 'none',
        paddingBottom: accent ? 2 : 0, display: 'inline-block',
      }}>{value}</div>
    </div>
  );
}

function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtNum(n) {
  if (n >= 10_000) return (n / 10_000).toFixed(1) + '萬';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

window.BookCard = BookCard;
