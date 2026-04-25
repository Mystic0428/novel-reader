// src/reader.jsx — reader view shell

function renderThemeContent(props) {
  switch (props.settings.activeTheme) {
    case 'v1':  return <V1Reader {...props}/>;
    case 'v4':  return <V4Reader {...props}/>;
    case 'v5':  return <V5Reader {...props}/>;
    case 'v6':  return <V6Reader {...props}/>;
    case 'v9':  return <V9Reader {...props}/>;
    case 'v11': return <V11Reader {...props}/>;
    case 'v17': return <V17Reader {...props}/>;
    case 'v18': return <V18Reader {...props}/>;
    case 'v19': return <V19Reader {...props}/>;
    case 'v20': return <V20Reader {...props}/>;
    case 'v21': return <V21Reader {...props}/>;
    case 'v25': return <V25Reader {...props}/>;
    case 'v30': return <V30Reader {...props}/>;
    case 'v31': return <V31Reader {...props}/>;
    case 'v32': return <V32Reader {...props}/>;
    case 'v33': return <V33Reader {...props}/>;
    case 'v37': return <V37Reader {...props}/>;
    case 'v38': return <V38Reader {...props}/>;
    case 'v39': return <V39Reader {...props}/>;
    case 'v40': return <V40Reader {...props}/>;
    case 'v41': return <V41Reader {...props}/>;
    case 'v42': return <V42Reader {...props}/>;
    case 'v43': return <V43Reader {...props}/>;
    case 'v10': return <V10Reader {...props}/>;
    case 'v16': return <V16Reader {...props}/>;
    case 'v22': return <V22Reader {...props}/>;
    case 'v23': return <V23Reader {...props}/>;
    case 'v24': return <V24Reader {...props}/>;
    case 'v26': return <V26Reader {...props}/>;
    case 'v27': return <V27Reader {...props}/>;
    case 'v28': return <V28Reader {...props}/>;
    case 'v29': return <V29Reader {...props}/>;
    case 'v44': return <V44Reader {...props}/>;
    case 'v45': return <V45Reader {...props}/>;
    case 'v46': return <V46Reader {...props}/>;
    case 'v47': return <V47Reader {...props}/>;
    case 'v48': return <V48Reader {...props}/>;
    case 'v49': return <V49Reader {...props}/>;
    case 'v50': return <V50Reader {...props}/>;
    case 'v51': return <V51Reader {...props}/>;
    case 'v34': return <V34Reader {...props}/>;
    case 'v35': return <V35Reader {...props}/>;
    case 'v36': return <V36Reader {...props}/>;
    case 'v2':  return <V2Reader {...props}/>;
    case 'v3':  return <V3Reader {...props}/>;
    case 'v7':  return <V7Reader {...props}/>;
    case 'v8':  return <V8Reader {...props}/>;
    case 'v12': return <V12Reader {...props}/>;
    case 'v13': return <V13Reader {...props}/>;
    case 'v14': return <V14Reader {...props}/>;
    case 'v15': return <V15Reader {...props}/>;
    case 'v52': return <V52Reader {...props}/>;
    case 'v53': return <V53Reader {...props}/>;
    case 'v54': return <V54Reader {...props}/>;
    case 'v55': return <V55Reader {...props}/>;
    default:    return <V1Reader {...props}/>;
  }
}
function renderThemeFooter(props) {
  switch (props.settings.activeTheme) {
    case 'v1':  return <V1Footer {...props}/>;
    case 'v4':  return <V4Footer {...props}/>;
    case 'v5':  return <V5Footer {...props}/>;
    case 'v6':  return <V6Footer {...props}/>;
    case 'v9':  return <V9Footer {...props}/>;
    case 'v11': return <V11Footer {...props}/>;
    case 'v17': return <V17Footer {...props}/>;
    case 'v18': return <V18Footer {...props}/>;
    case 'v19': return <V19Footer {...props}/>;
    case 'v20': return <V20Footer {...props}/>;
    case 'v21': return <V21Footer {...props}/>;
    case 'v25': return <V25Footer {...props}/>;
    case 'v30': return <V30Footer {...props}/>;
    case 'v31': return <V31Footer {...props}/>;
    case 'v32': return <V32Footer {...props}/>;
    case 'v33': return <V33Footer {...props}/>;
    case 'v37': return <V37Footer {...props}/>;
    case 'v38': return <V38Footer {...props}/>;
    case 'v39': return <V39Footer {...props}/>;
    case 'v40': return <V40Footer {...props}/>;
    case 'v41': return <V41Footer {...props}/>;
    case 'v42': return <V42Footer {...props}/>;
    case 'v43': return <V43Footer {...props}/>;
    case 'v10': return <V10Footer {...props}/>;
    case 'v16': return <V16Footer {...props}/>;
    case 'v22': return <V22Footer {...props}/>;
    case 'v23': return <V23Footer {...props}/>;
    case 'v24': return <V24Footer {...props}/>;
    case 'v26': return <V26Footer {...props}/>;
    case 'v27': return <V27Footer {...props}/>;
    case 'v28': return <V28Footer {...props}/>;
    case 'v29': return <V29Footer {...props}/>;
    case 'v44': return <V44Footer {...props}/>;
    case 'v45': return <V45Footer {...props}/>;
    case 'v46': return <V46Footer {...props}/>;
    case 'v47': return <V47Footer {...props}/>;
    case 'v48': return <V48Footer {...props}/>;
    case 'v49': return <V49Footer {...props}/>;
    case 'v50': return <V50Footer {...props}/>;
    case 'v51': return <V51Footer {...props}/>;
    case 'v34': return <V34Footer {...props}/>;
    case 'v35': return <V35Footer {...props}/>;
    case 'v36': return <V36Footer {...props}/>;
    case 'v2':  return <V2Footer {...props}/>;
    case 'v3':  return <V3Footer {...props}/>;
    case 'v7':  return <V7Footer {...props}/>;
    case 'v8':  return <V8Footer {...props}/>;
    case 'v12': return <V12Footer {...props}/>;
    case 'v13': return <V13Footer {...props}/>;
    case 'v14': return <V14Footer {...props}/>;
    case 'v15': return <V15Footer {...props}/>;
    case 'v52': return <V52Footer {...props}/>;
    case 'v53': return <V53Footer {...props}/>;
    case 'v54': return <V54Footer {...props}/>;
    case 'v55': return <V55Footer {...props}/>;
    default:    return <V1Footer {...props}/>;
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
  const parsedRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      chapterCacheRef.current.clear();
      parsedRef.current = null;
      const stored = await booksStore.get(activeBookId);
      setBook(stored);
      const bl = await loadBookBlob(stored, setPermIssue);
      if (!bl) return;
      setBlob(bl);
      // Always re-parse the live file so external edits (added/removed chapters,
      // retitled, new cover) show up without requiring a re-scan.
      const parser = stored.sourceType === 'txt' ? txtParser : epubParser;
      const parsed = await parser.parseMetadata(bl);
      parsedRef.current = parsed;
      // For legacy books with no baseline, treat current count as "known" so we
      // don't badge every book with its entire chapter count on first open.
      const baseline = stored.lastKnownChapterCount == null
        ? parsed.chaptersMeta.length
        : stored.lastKnownChapterCount;
      const b = await booksStore.update(stored.id, {
        chaptersMeta: parsed.chaptersMeta,
        title: parsed.title || stored.title,
        author: parsed.author || stored.author,
        coverBlob: parsed.coverBlob || stored.coverBlob,
        wordCount: parsed.chaptersMeta.reduce((s, c) => s + (c.wordCount || 0), 0),
        lastKnownChapterCount: baseline,
      });
      setBook(b);
      const hasStoredCh = b.lastChapterId && b.chaptersMeta.some(c => c.id === b.lastChapterId);
      const chId = hasStoredCh ? b.lastChapterId : b.chaptersMeta[0]?.id;
      if (chId) await openChapter(b, bl, chId, hasStoredCh ? (b.lastScroll || 0) : 0);
    })();
    return () => { chapterCacheRef.current.clear(); parsedRef.current = null; };
    // eslint-disable-next-line
  }, [activeBookId]);

  async function openChapter(b, bl, chapterId, restoreScroll = 0) {
    const key = `${b.id}:${chapterId}`;
    const cache = chapterCacheRef.current;
    let res = cache.get(key);
    if (!res) {
      const parser = b.sourceType === 'txt' ? txtParser : epubParser;
      const parsed = parsedRef.current || await parser.parseMetadata(bl);
      if (!parsedRef.current) parsedRef.current = parsed;
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
    // Acknowledge exposure: user has now seen up to (chapter index + 1) entries.
    // Badge = chaptersMeta.length - lastKnownChapterCount drops as they read further.
    const idx = b.chaptersMeta.findIndex(c => c.id === chapterId);
    const ackCount = idx >= 0 ? Math.max(b.lastKnownChapterCount || 0, idx + 1) : (b.lastKnownChapterCount || 0);
    await booksStore.update(b.id, {
      lastChapterId: chapterId,
      lastScroll: restoreScroll,
      lastReadAt: Date.now(),
      lastKnownChapterCount: ackCount,
    });
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
  const [colorOpen, setColorOpen] = React.useState(false);

  async function changeTheme(key) {
    await setSettings({ activeTheme: key });
  }

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
  const chapterTitle = stripChapterPrefix(book.chaptersMeta[chapterIdx]?.title || '');

  return (
    <div className="nr-root nr-reading-scope" style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: settings.activeTheme === 'v4' ? 'transparent' : undefined,
      position: 'relative',
    }}>
      {chapterExtraCss && <style>{chapterExtraCss}</style>}
      <ReaderTopBar
        book={book} chapterTitle={chapterTitle} onBack={backToLibrary}
        onOpenToc={() => setTocOpen(true)} onOpenTweaks={() => setTweaksOpen(true)}
        onOpenColor={() => setColorOpen(true)}
        settings={settings} onThemeChange={changeTheme}
      />
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
      <ColorPicker settings={settings} open={colorOpen} onClose={() => setColorOpen(false)}
        onChange={async (patch) => { await setSettings(patch); }}/>
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

function ReaderTopBar({ book, chapterTitle, onBack, onOpenToc, onOpenTweaks, onOpenColor, settings, onThemeChange }) {
  return (
    <div style={{
      height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--ui)', fontSize: 12, flexShrink: 0, zIndex: 5, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0, color: 'inherit', fontFamily: 'inherit', lineHeight: 1, opacity: 0.55 }}>← 書庫</button>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 500, lineHeight: 1 }}>{book.title}</div>
        <div style={{ opacity: 0.5, lineHeight: 1 }}>·</div>
        <div style={{ opacity: 0.7, fontSize: 12, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chapterTitle}</div>
      </div>
      <div style={{ flex: 1 }}/>
      <ThemeSwitcher settings={settings} onChange={onThemeChange}/>
      <button onClick={onOpenToc} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>目錄 (T)</button>
      <button onClick={onOpenTweaks} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>Aa (,)</button>
      <button onClick={onOpenColor} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>🎨</button>
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
