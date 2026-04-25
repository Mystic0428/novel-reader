// src/ui/scan-report.jsx — modal that replaces native alert() for scan / addFile
// failures. Library state holds a `report` object; pass it in as props.
//
// Shape: { kind, title, summary, failures, hints }
//   kind: 'partial' | 'crash' | 'addFile' — drives the icon + accent only
//   title: short heading (e.g. "掃描完成 — 1 個檔案沒進來")
//   summary: optional one-line description under the title
//   failures: [{ relPath, reason }] — list rendered as a scrollable card
//   hints: string[] — bulleted countermeasures at the bottom
function ScanReport({ report, onClose }) {
  if (!report) return null;
  const { kind = 'partial', title, summary, failures = [], hints = [] } = report;

  // Theme tokens — matches the dark library palette
  const bg = '#0B0B0E', surface = '#16161C', card = '#1A1A22', ink = '#F4F4F6';
  const mute = 'rgba(244,244,246,0.55)', rule = 'rgba(255,255,255,0.08)';
  const accent = kind === 'crash' ? '#E50914' : (kind === 'addFile' ? '#FFB454' : '#FFB454');
  const icon = kind === 'crash' ? '✕' : '⚠';

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1100,
      }}/>
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(640px, calc(100vw - 40px))', maxHeight: 'calc(100vh - 60px)',
        background: bg, color: ink, zIndex: 1101, borderRadius: 12,
        border: `0.5px solid ${rule}`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: '"Inter","Noto Sans TC",sans-serif',
      }}>
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '18px 22px',
          borderBottom: `0.5px solid ${rule}`, flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `${accent}20`, color: accent,
            display: 'grid', placeItems: 'center',
            fontSize: 16, fontWeight: 800, flexShrink: 0,
          }}>{icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: ink, letterSpacing: '0.02em',
              fontFamily: '"Noto Serif TC",serif',
            }}>{title}</div>
            {summary && (
              <div style={{ fontSize: 12, color: mute, marginTop: 2, lineHeight: 1.5 }}>
                {summary}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', color: mute, border: `0.5px solid ${rule}`,
            width: 28, height: 28, borderRadius: 6, fontSize: 13, fontFamily: 'inherit',
            cursor: 'pointer', flexShrink: 0, padding: 0,
          }} title="關閉">✕</button>
        </div>

        {/* body — scrollable */}
        <div className="scroll-thin" style={{
          flex: 1, overflowY: 'auto', padding: '18px 22px 16px',
        }}>
          {failures.length > 0 && (
            <div style={{
              background: card, border: `0.5px solid ${rule}`, borderRadius: 8,
              marginBottom: hints.length > 0 ? 16 : 0, overflow: 'hidden',
            }}>
              {failures.slice(0, 20).map((f, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  borderBottom: i < Math.min(19, failures.length - 1) ? `0.5px solid ${rule}` : 'none',
                }}>
                  <div style={{
                    fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: ink,
                    wordBreak: 'break-all', marginBottom: 4,
                  }}>{f.relPath}</div>
                  <div style={{
                    fontSize: 11, color: mute, lineHeight: 1.5,
                    paddingLeft: 8, borderLeft: `2px solid ${accent}66`,
                  }}>{f.reason}</div>
                </div>
              ))}
              {failures.length > 20 && (
                <div style={{
                  padding: '8px 14px', fontSize: 11, color: mute, textAlign: 'center',
                  fontStyle: 'italic',
                }}>
                  … 另外 {failures.length - 20} 個未列出（DevTools console 看完整 list）
                </div>
              )}
            </div>
          )}

          {hints.length > 0 && (
            <div style={{
              background: card, border: `0.5px solid ${rule}`, borderRadius: 8,
              padding: '14px 16px',
            }}>
              <div style={{
                fontSize: 10, color: accent, letterSpacing: '0.3em',
                fontWeight: 700, marginBottom: 10, textTransform: 'uppercase',
              }}>常見對策</div>
              {hints.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, fontSize: 12, color: ink,
                  lineHeight: 1.6, marginBottom: i < hints.length - 1 ? 6 : 0,
                }}>
                  <span style={{ color: accent, fontWeight: 700, flexShrink: 0, minWidth: 16 }}>{i + 1}.</span>
                  <span style={{ flex: 1 }}>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{
          padding: '12px 22px', borderTop: `0.5px solid ${rule}`,
          display: 'flex', justifyContent: 'flex-end', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: '8px 22px', background: accent, color: bg,
            border: 'none', borderRadius: 6, fontFamily: 'inherit',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer',
          }}>知 道 了</button>
        </div>
      </div>
    </>
  );
}

window.ScanReport = ScanReport;
