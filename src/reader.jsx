// src/reader.jsx — reader view shell
function Reader() {
  const { state, dispatch, chapterCacheRef } = React.useContext(AppContext);
  const { activeBookId, settings } = state;
  const [book, setBook] = React.useState(null);
  const [chapterHtml, setChapterHtml] = React.useState('');
  const [chapterExtraCss, setChapterExtraCss] = React.useState('');
  const [currentChapterId, setCurrentChapterId] = React.useState(null);
  const [permIssue, setPermIssue] = React.useState(false);
  const [blob, setBlob] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const b = await booksStore.get(activeBookId);
      setBook(b);
      const bl = await loadBookBlob(b, setPermIssue);
      if (!bl) return;
      setBlob(bl);
      const chId = b.lastChapterId || b.chaptersMeta[0]?.id;
      if (chId) await openChapter(b, bl, chId, b.lastScroll || 0);
    })();
    return () => { chapterCacheRef.current.clear(); };
    // eslint-disable-next-line
  }, [activeBookId]);

  async function openChapter(b, bl, chapterId, restoreScroll = 0) {
    const key = `${b.id}:${chapterId}`;
    const cache = chapterCacheRef.current;
    let res = cache.get(key);
    if (!res) {
      const parser = b.sourceType === 'txt' ? txtParser : epubParser;
      const parsed = await parser.parseMetadata(bl);
      res = await parser.getChapter(bl, parsed, chapterId, { preserveCss: b.preserveOriginalCss });
      cache.set(key, res);
    }
    setChapterHtml(res.html); setChapterExtraCss(res.extraCss);
    setCurrentChapterId(chapterId);
    // restore scroll after next paint
    setTimeout(() => {
      if (scrollRef.current) {
        const max = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        scrollRef.current.scrollTop = max * restoreScroll;
      }
    }, 0);
    await booksStore.update(b.id, { lastChapterId: chapterId, lastScroll: restoreScroll, lastReadAt: Date.now() });
    const fresh = await booksStore.get(b.id);
    setBook(fresh);
  }

  // Debounced scroll save
  const saveTimer = React.useRef(null);
  function onScroll() {
    if (!scrollRef.current || !book) return;
    const max = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const frac = max > 0 ? scrollRef.current.scrollTop / max : 0;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      booksStore.update(book.id, { lastScroll: frac });
    }, 500);
  }

  async function nextChapter() {
    if (!book || !blob) return;
    const idx = book.chaptersMeta.findIndex((c) => c.id === currentChapterId);
    const next = book.chaptersMeta[idx + 1];
    if (next) await openChapter(book, blob, next.id, 0);
  }
  async function prevChapter() {
    if (!book || !blob) return;
    const idx = book.chaptersMeta.findIndex((c) => c.id === currentChapterId);
    const prev = book.chaptersMeta[idx - 1];
    if (prev) await openChapter(book, blob, prev.id, 0);
  }

  async function backToLibrary() {
    dispatch({ type: 'SET_VIEW', view: 'library' });
    const newBooks = await booksStore.list();
    dispatch({ type: 'SET_BOOKS', books: newBooks });
  }

  if (!book) return <div className="loading-screen">載入中…</div>;
  if (permIssue) return <PermissionBanner book={book} onRetry={() => window.location.reload()} onBack={backToLibrary}/>;

  const chapterIdx = Math.max(0, book.chaptersMeta.findIndex((c) => c.id === currentChapterId));
  const chapterTitle = book.chaptersMeta[chapterIdx]?.title || '';

  return (
    <div className="nr-root nr-reading-scope" style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
    }}>
      {chapterExtraCss && <style>{chapterExtraCss}</style>}
      <ReaderTopBar book={book} chapterTitle={chapterTitle} onBack={backToLibrary}/>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        <ReaderContent
          book={book}
          html={chapterHtml}
          settings={settings}
          scrollRef={scrollRef}
          onScroll={onScroll}
          onPrev={prevChapter}
          onNext={nextChapter}
          canPrev={chapterIdx > 0}
          canNext={chapterIdx < book.chaptersMeta.length - 1}
        />
      </div>
      <ReaderFooter book={book} chapterIdx={chapterIdx}/>
    </div>
  );
}
window.Reader = Reader;

async function loadBookBlob(book, setPermIssue) {
  if (!book.fileHandle && !book.rootId) return null;
  try {
    let handle = book.fileHandle;
    if (!handle && book.rootId) {
      const root = (await rootsStore.list()).find((r) => r.id === book.rootId);
      if (!root) return null;
      const granted = await rootsStore.ensurePermission(root.dirHandle, 'read');
      if (!granted) { setPermIssue(true); return null; }
      // traverse relPath
      const parts = book.relPath.split('/');
      let dir = root.dirHandle;
      for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i]);
      handle = await dir.getFileHandle(parts[parts.length - 1]);
    } else if (handle) {
      const granted = await rootsStore.ensurePermission(handle, 'read');
      if (!granted) { setPermIssue(true); return null; }
    }
    return await handle.getFile();
  } catch (err) {
    console.warn('Failed to open book blob', err);
    setPermIssue(true);
    return null;
  }
}

function ReaderTopBar({ book, chapterTitle, onBack }) {
  return (
    <div style={{
      height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--ui)', fontSize: 12, flexShrink: 0,
    }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 8px' }}>← 書庫</button>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 500 }}>{book.title}</div>
      <div style={{ opacity: 0.5 }}>·</div>
      <div style={{ opacity: 0.7 }}>{chapterTitle}</div>
      <div style={{ flex: 1 }}/>
    </div>
  );
}

function ReaderContent({ book, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  return (
    <main
      ref={scrollRef}
      onScroll={onScroll}
      className="scroll scroll-thin"
      style={{ flex: 1, padding: '56px 0', background: '#FCFBF8' }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 60px' }}>
        <div className="reading-body" style={{
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          fontSize: settings.tweaks.fontSize,
          lineHeight: settings.tweaks.lineHeight,
          color: '#2B241B',
        }} dangerouslySetInnerHTML={{ __html: html || '<p style="opacity:0.5">載入章節中…</p>' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 30, borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3 }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function ReaderFooter({ book, chapterIdx }) {
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 40px', borderTop: '0.5px solid rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--ui)', fontSize: 11, color: 'rgba(0,0,0,0.55)', flexShrink: 0,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: '#8C3A2E' }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

function PermissionBanner({ book, onRetry, onBack }) {
  return (
    <div className="nr-root" style={{
      width: '100%', height: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, background: '#F7F5F0', color: '#2B241B',
    }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>無法讀取「{book.title}」</div>
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', maxWidth: 360, textAlign: 'center', lineHeight: 1.8 }}>
        瀏覽器的權限已失效（重新整理 / 開新分頁時會發生）。點下面的按鈕重新授權，或回書庫。
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onRetry} style={btnStyle()}>重新授權</button>
        <button onClick={onBack} style={btnStyle()}>回書庫</button>
      </div>
    </div>
  );
}
