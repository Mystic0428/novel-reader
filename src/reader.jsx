// src/reader.jsx — reader view shell

function renderThemeContent(props) {
  switch (props.settings.activeTheme) {
    case 'v1': return <V1Reader {...props}/>;
    case 'v4': return <V4Reader {...props}/>;
    case 'v5': return <V5Reader {...props}/>;
    default:   return <V1Reader {...props}/>;
  }
}
function renderThemeFooter(props) {
  switch (props.settings.activeTheme) {
    case 'v1': return <V1Footer {...props}/>;
    case 'v4': return <V4Footer {...props}/>;
    case 'v5': return <V5Footer {...props}/>;
    default:   return <V1Footer {...props}/>;
  }
}

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

  const [tocOpen, setTocOpen] = React.useState(false);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  async function setSettings(patch) {
    const next = await settingsStore.save(patch);
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }
  async function updateBook(patch) {
    const updated = await booksStore.update(book.id, patch);
    setBook(updated);
    // invalidate cache for this book if preserveCss changed
    if ('preserveOriginalCss' in patch) {
      for (const k of Array.from(chapterCacheRef.current.keys())) {
        if (k.startsWith(`${book.id}:`)) chapterCacheRef.current.delete(k);
      }
      if (blob && currentChapterId) {
        await openChapter({ ...book, ...patch }, blob, currentChapterId, 0);
      }
    }
  }

  function pageScroll(delta) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ top: scrollRef.current.clientHeight * delta * 0.9, behavior: 'smooth' });
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e) {
      if (tocOpen || tweaksOpen) {
        if (e.key === 'Escape') { setTocOpen(false); setTweaksOpen(false); }
        return;
      }
      const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (inInput) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); prevChapter(); break;
        case 'ArrowRight': e.preventDefault(); nextChapter(); break;
        case 'PageDown': case ' ': e.preventDefault(); pageScroll(1); break;
        case 'PageUp': e.preventDefault(); pageScroll(-1); break;
        case 'T': case 't': setTocOpen((o) => !o); break;
        case ',': setTweaksOpen((o) => !o); break;
        case 'F': case 'f':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case 'Escape': backToLibrary(); break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, [book, currentChapterId, tocOpen, tweaksOpen]);

  if (!book) return <div className="loading-screen">載入中…</div>;
  if (permIssue) return <PermissionBanner book={book} onRetry={() => window.location.reload()} onBack={backToLibrary}/>;

  const chapterIdx = Math.max(0, book.chaptersMeta.findIndex((c) => c.id === currentChapterId));
  const chapterTitle = book.chaptersMeta[chapterIdx]?.title || '';

  return (
    <div className="nr-root nr-reading-scope" style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: settings.activeTheme === 'v4' ? 'transparent' : undefined,
      position: 'relative',
    }}>
      {chapterExtraCss && <style>{chapterExtraCss}</style>}
      <ReaderTopBar book={book} chapterTitle={chapterTitle} onBack={backToLibrary}
        onOpenToc={() => setTocOpen(true)} onOpenTweaks={() => setTweaksOpen(true)}/>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        {renderThemeContent({ book, chapterTitle, chapterIdx, html: chapterHtml, settings, scrollRef, onScroll, onPrev: prevChapter, onNext: nextChapter, canPrev: chapterIdx > 0, canNext: chapterIdx < book.chaptersMeta.length - 1 })}
        {settings.activeTheme === 'v4' && renderThemeFooter({ book, chapterIdx, settings })}
      </div>
      {settings.activeTheme !== 'v4' && renderThemeFooter({ book, chapterIdx, settings })}
      <TocDrawer book={book} currentChapterId={currentChapterId}
        open={tocOpen} onClose={() => setTocOpen(false)}
        onJump={(id) => openChapter(book, blob, id, 0)}/>
      <TweaksPanel book={book} settings={settings}
        open={tweaksOpen} onClose={() => setTweaksOpen(false)}
        onSettingsChange={setSettings} onBookChange={updateBook}/>
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

function ReaderTopBar({ book, chapterTitle, onBack, onOpenToc, onOpenTweaks }) {
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
      <button onClick={onOpenToc} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>目錄 (T)</button>
      <button onClick={onOpenTweaks} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>Aa (,)</button>
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
