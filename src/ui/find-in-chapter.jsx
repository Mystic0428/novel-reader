// src/ui/find-in-chapter.jsx — in-chapter text search bar that takes over the
// reader topbar while open. Highlights all hits via DOM injection of <mark>
// nodes inside `.reading-body`; clears them on close or chapter change.

const NR_FIND_HIT_CLASS = 'nr-find-hit';
const NR_FIND_ACTIVE_CLASS = 'nr-find-hit-active';

// Strip every previously injected <mark.nr-find-hit> back into plain text. Done
// before each re-search and on close so we never double-wrap or leave stale
// marks in the DOM.
function clearHits(root) {
  if (!root) return;
  const marks = root.querySelectorAll(`mark.${NR_FIND_HIT_CLASS}`);
  const parents = new Set();
  marks.forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    while (m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parents.add(parent);
  });
  parents.forEach((p) => p.normalize());
}

// Walk text nodes and wrap each occurrence of `needle` (case-insensitive). CJK
// is unaffected by lowercase. Returns the number of hits inserted; each <mark>
// gets data-nr-hit="N" so we can scroll/activate by index.
function applyHits(root, needle) {
  if (!root || !needle) return 0;
  const lower = needle.toLowerCase();
  const len = needle.length;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // Skip empty / whitespace-only nodes and anything inside an existing mark
      // (we cleared first, but a defensive guard is cheap).
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
      const p = node.parentNode;
      if (p && p.nodeName === 'MARK' && p.classList.contains(NR_FIND_HIT_CLASS)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const targets = [];
  let n;
  while ((n = walker.nextNode())) targets.push(n);

  let hitIdx = 0;
  for (const node of targets) {
    const text = node.nodeValue;
    const lowerText = text.toLowerCase();
    let from = 0;
    let pos = lowerText.indexOf(lower, from);
    if (pos < 0) continue;
    const frag = document.createDocumentFragment();
    while (pos >= 0) {
      if (pos > from) frag.appendChild(document.createTextNode(text.slice(from, pos)));
      const mark = document.createElement('mark');
      mark.className = NR_FIND_HIT_CLASS;
      mark.dataset.nrHit = String(hitIdx);
      mark.textContent = text.slice(pos, pos + len);
      frag.appendChild(mark);
      from = pos + len;
      hitIdx += 1;
      pos = lowerText.indexOf(lower, from);
    }
    if (from < text.length) frag.appendChild(document.createTextNode(text.slice(from)));
    node.parentNode.replaceChild(frag, node);
  }
  return hitIdx;
}

function FindInChapterBar({ scrollRef, onClose }) {
  const [query, setQuery] = React.useState('');
  const [hitCount, setHitCount] = React.useState(0);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef(null);

  // Focus the input on mount; clear hits on unmount so closing or switching
  // chapter never leaves stray <mark>s in the DOM.
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    return () => {
      const body = scrollRef.current?.querySelector('.reading-body');
      clearHits(body);
    };
  }, []);

  // Re-run search whenever the query changes. Empty query just clears.
  React.useEffect(() => {
    const body = scrollRef.current?.querySelector('.reading-body');
    if (!body) { setHitCount(0); return; }
    clearHits(body);
    if (!query) { setHitCount(0); setActiveIdx(0); return; }
    const count = applyHits(body, query);
    setHitCount(count);
    setActiveIdx(0);
  }, [query]);

  // Move active highlight + scroll the active hit into view.
  React.useEffect(() => {
    const body = scrollRef.current?.querySelector('.reading-body');
    if (!body) return;
    body.querySelectorAll(`mark.${NR_FIND_ACTIVE_CLASS}`).forEach((m) => {
      m.classList.remove(NR_FIND_ACTIVE_CLASS);
    });
    if (hitCount === 0) return;
    const target = body.querySelector(`mark[data-nr-hit="${activeIdx}"]`);
    if (target) {
      target.classList.add(NR_FIND_ACTIVE_CLASS);
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [activeIdx, hitCount, query]);

  function step(dir) {
    if (hitCount === 0) return;
    setActiveIdx((i) => (i + dir + hitCount) % hitCount);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      step(e.shiftKey ? -1 : 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div style={{
      height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--ui)', fontSize: 12, flexShrink: 0, zIndex: 5, position: 'relative',
    }}>
      <style>{`
        mark.${NR_FIND_HIT_CLASS} {
          background: rgba(255,213,0,0.45) !important;
          color: inherit !important;
          padding: 0 !important;
          border-radius: 2px !important;
        }
        mark.${NR_FIND_ACTIVE_CLASS} {
          background: rgba(255,140,0,0.9) !important;
          color: #fff !important;
          box-shadow: 0 0 0 2px rgba(255,140,0,0.35) !important;
        }
      `}</style>
      <span style={{ opacity: 0.55, fontSize: 12 }}>🔍</span>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="在本章搜尋…"
        style={{
          flex: 1, minWidth: 0, height: 28, padding: '0 10px',
          border: '0.5px solid rgba(0,0,0,0.18)', borderRadius: 4,
          background: 'rgba(255,255,255,0.85)', color: 'inherit',
          fontFamily: 'inherit', fontSize: 12, outline: 'none',
        }}
      />
      <div style={{ opacity: 0.6, minWidth: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {query ? `${hitCount === 0 ? 0 : activeIdx + 1} / ${hitCount}` : '—'}
      </div>
      <button onClick={() => step(-1)} disabled={hitCount === 0} style={navBtnStyle(hitCount === 0)} title="上一筆 (Shift+Enter)">↑</button>
      <button onClick={() => step(1)} disabled={hitCount === 0} style={navBtnStyle(hitCount === 0)} title="下一筆 (Enter)">↓</button>
      <button onClick={onClose} style={navBtnStyle(false)} title="關閉 (Esc)">✕</button>
    </div>
  );
}

function navBtnStyle(disabled) {
  return {
    width: 28, height: 28, padding: 0,
    border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 6,
    background: '#fff', color: 'inherit',
    fontSize: 13, fontFamily: 'inherit', lineHeight: 1,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.35 : 1,
  };
}

window.FindInChapterBar = FindInChapterBar;
