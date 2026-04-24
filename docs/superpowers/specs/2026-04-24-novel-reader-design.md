# Novel Reader — Design Spec

**Date:** 2026-04-24
**Status:** Draft — pending user review
**Source design:** Claude Design bundle `novel-reader` (5 desktop variants); implementing variants **① Warm Library**, **④ Ambient Glass**, **⑤ Dark Serif** as runtime-switchable themes.

## Goal

A local-first, offline, single-file–deployable desktop novel reader that reads the user's existing EPUB library (produced by `esjzone-scraper` and `novelpia-scraper` in `C:\dev\`). Three atmospheric reading themes, per-theme accent color, a library view with tags/collections, and remembered per-book reading position.

## Non-goals

- Not an EPUB-authoring tool.
- No cloud sync, no account system, no server.
- Not attempting to be a general ebook manager (no OPDS, no Calibre integration, no DRM).
- No TTS, translation, dictionary lookup, AI summary — can come later but out of v1.
- No mobile/phone layout. Desktop only.
- Not implementing variants ② (Bionic Focus) or ③ (Kindle-like). User selected ①④⑤.

## Users & primary workflow

Single user on Windows + Chromium browser. Workflow:

1. First run — user points the app at one or more root folders (e.g. `C:\dev\esjzone-scraper\books`, `C:\dev\novelpia-scraper\books`). App recursively finds every `.epub`, extracts metadata + cover, stores in IndexedDB.
2. Subsequent runs — library view loads instantly from cache. Re-grant folder permission is a one-click gesture (browser requirement).
3. User clicks a book cover → reader view opens at last-read position.
4. User reads. Progress auto-saves. Switches theme via top-right menu; tweaks font/accent as desired.
5. Optionally: adds individual `.epub` / `.txt` files that aren't under any scanned root. These get stored with their own file-handle.

## Architecture

### Deployment model

Single project directory that can be served from the filesystem (double-click `novel-reader.html`) — **matches the prototype structure** so the original React + Babel standalone loader is reused:

```
novel-reader/
├── novel-reader.html          # entry, loads deps + mounts <App/>
├── styles/
│   ├── shared.css             # tokens (serif/sans/ui fonts), scroll helpers, paper texture
│   ├── v1-warm.css            # Warm Library style
│   ├── v4-glass.css           # Ambient Glass style
│   └── v5-dark.css            # Dark Serif style
├── src/
│   ├── app.jsx                # top-level App, route (library|reader), global state
│   ├── library.jsx            # Library shelf grid, sidebar, search, sort, add-root/add-file
│   ├── reader.jsx             # Reader shell: applies active theme, loads book content
│   ├── themes/
│   │   ├── v1-warm.jsx        # ① Warm Library layout
│   │   ├── v4-glass.jsx       # ④ Ambient Glass layout
│   │   └── v5-dark.jsx        # ⑤ Dark Serif layout
│   ├── ui/
│   │   ├── cover.jsx          # Spine-style cover component
│   │   ├── toc-drawer.jsx     # Table of contents drawer
│   │   ├── tweaks-panel.jsx   # font/line/texture
│   │   ├── theme-switcher.jsx # top-right 3-thumb switcher + color picker
│   │   └── book-meta.jsx      # title/author/progress display
│   ├── parsers/
│   │   ├── epub.js            # JSZip-based EPUB parser
│   │   └── txt.js             # TXT chapter splitter + encoding sniff
│   └── storage/
│       ├── idb.js             # thin IndexedDB wrapper (no deps)
│       ├── roots.js           # roots CRUD + permission re-request
│       ├── books.js           # books CRUD, tags, collections
│       └── settings.js        # active theme, per-theme colors, tweaks
└── README.md
```

External dependencies (all via CDN, pinned versions):

| Dep | Purpose | Size |
|---|---|---|
| `react@18.3.1` + `react-dom` | UI (dev build, same as prototype) | ~130kB gz |
| `@babel/standalone@7.29.0` | In-browser JSX transform (same as prototype) | ~350kB gz |
| `jszip@3.10.1` | EPUB = ZIP container parsing | ~100kB gz |

### Browser compatibility

Primary target: **Chromium** (Chrome, Edge, Brave) — they support `showDirectoryPicker` and persistent `FileSystemHandle` storage in IndexedDB.

Fallback for Firefox/Safari: hide the "Add root folder" button; only single-file open (`<input type="file" accept=".epub,.txt">` and drag-drop) works. Library entries persist but handles can't re-resolve — user must re-pick on next session. A banner on the library sidebar explains this.

## Data layer (IndexedDB)

Database name: `novel-reader`, version `1`. Four object stores:

### `roots`

```ts
{
  id: string,              // uuid
  name: string,            // display name, derived from dirHandle.name by default
  dirHandle: FileSystemDirectoryHandle,   // persisted; must re-request permission each session
  addedAt: number,
  lastScannedAt: number,
  bookCount: number,       // denormalized for library sidebar
}
```

### `books`

```ts
{
  id: string,              // uuid
  rootId: string | null,   // null = standalone (user opened single file)
  relPath: string | null,  // path relative to root, null for standalone
  fileHandle: FileSystemFileHandle | null,   // for standalone files
  sourceType: 'epub' | 'txt',
  title: string,
  author: string | null,
  coverBlob: Blob | null,  // extracted from EPUB; TXT = null
  accent: string,          // derived from cover OR book.coverAccent in prototype
  chaptersMeta: [{ id, title, href, wordCount }],  // not full text; indexed for TOC
  wordCount: number,       // total
  lastChapterId: string | null,
  lastScroll: number,      // 0-1 fraction within that chapter
  tags: string[],
  collections: string[],   // named shelves (user creates)
  status: 'unread' | 'reading' | 'finished',  // auto-derived from progress
  preserveOriginalCss: boolean,   // per-book override for EPUB CSS
  addedAt: number,
  lastReadAt: number | null,
}
```

Chapter **text** is never persisted to IndexedDB — re-parsed from the EPUB blob on first access each session (keeps IDB small, avoids staleness if user regenerates scraper output). Within one session, parsed chapters are held in a **memory cache** (a `Map<bookId:chapterId, sanitizedHTML>`) to make back/forward navigation between chapters instant; the cache is cleared when the book is closed or the tab is reloaded. Chapter **metadata** (id/title/href/wordCount) IS cached in IDB because it powers TOC lookup.

### `settings` (single row, id=`global`)

```ts
{
  activeTheme: 'v1' | 'v4' | 'v5',
  themeColors: {
    v1: { accent: string, paperTone: string },
    v4: { accent: string, gradient: 'dawn'|'dusk'|'sky'|'ink' | customGradientString },
    v5: { accent: string, bgTone: 'mogreen' | 'xuanhei' | 'zhehe' },
  },
  tweaks: { fontSize: 17, lineHeight: 1.9, font: 'sans'|'serif', texture: true },
  preserveOriginalCssDefault: false,
  sortBy: 'lastRead' | 'addedAt' | 'author' | 'title',
  sortOrder: 'asc' | 'desc',
  filterTag: string | null,
  filterCollection: string | null,
  filterStatus: 'all' | 'reading' | 'finished' | 'unread',
}
```

### `kv` (catchall for small state)

Key-value for things that don't need a schema: `lastOpenedBookId`, migration markers, etc.

## Views

### Library view

Layout:

```
┌───────────┬──────────────────────────────────────────┐
│ Sidebar   │  Top bar: [Search]  [Sort ▼]  [+ Root] [+File] │
│           ├──────────────────────────────────────────┤
│ 全部      │                                          │
│ 正在讀    │         ┌──┐  ┌──┐  ┌──┐  ┌──┐           │
│ 已讀完    │         │📕│  │📗│  │📘│  │📙│           │
│ 未開始    │         └──┘  └──┘  └──┘  └──┘           │
│           │         紅樓夢  浮生…  邊城   …          │
│ TAGS      │                                          │
│ # 超好看  │         ┌──┐  ┌──┐  ┌──┐  ┌──┐           │
│ # 掛機中  │         │📕│  │📗│  │📘│  │📙│           │
│           │         └──┘  └──┘  └──┘  └──┘           │
│ SHELVES   │                                          │
│ 📁 我愛…  │                                          │
│ 📁 未來看 │                                          │
│           │                                          │
│ ───       │                                          │
│ 根目錄    │                                          │
│ 📂 esjz… │                                          │
│ 📂 novel…│                                          │
│ + 加資料夾│                                          │
└───────────┴──────────────────────────────────────────┘
```

Behaviors:

- **Sidebar filters are OR within group, AND across groups.** Clicking "正在讀" + `# 掛機中` = books that are both.
- **Book card** shows: cover, title, author, tiny progress bar. Hover: tags chips + "開始/繼續閱讀" + `⋯` menu (edit tags, add to collection, remove from library, reveal in file manager if supported).
- **Right-click / `⋯`** on a book → context menu with the same options.
- **Drag a book onto a collection** in the sidebar to add it.
- **Creating tags/collections**: inline at sidebar via `+` next to section header; or via the book's tag editor.
- **Adding roots**: click `+ Root` → `showDirectoryPicker`. After permission, recursive scan starts with a progress toast (counted vs total). Each discovered `.epub` is parsed enough for metadata + cover, then stored.
- **Rescan**: right-click a root in sidebar → `Rescan`. Diffs against existing `relPath` entries. New books added; missing books marked `missingFile: true` but NOT deleted (user might have moved the folder temporarily).
- **Adding a single file**: `+ File` → `showOpenFilePicker`. Accepts `.epub`/`.txt`. Stored with `rootId=null`, remembered via its own fileHandle.
- **Sort** on top bar; sort state persists in settings.

### Reader view

Layout varies per theme but all share this shell:

```
┌─ Top bar (styled per theme) ──────────────────────────────────┐
│ [← Back]  Book · Chapter Title             [TOC] [Aa] [🎨] [▼Theme]│
├────────────────────────────────────────────────────────────────┤
│ (Theme-specific layout — V1 single column, V4 glass cards, V5 │
│  dark with side TOC)                                          │
├────────────────────────────────────────────────────────────────┤
│ Footer: [chapter X/Y]  ━━━━●────────────  [est. 12 min left]  │
└────────────────────────────────────────────────────────────────┘
```

- **TOC** is a drawer (slides from left) showing chapter titles; click to jump. For V5 the TOC is always visible in the side panel (part of the style), so the drawer button just focuses it.
- **Aa panel** = tweaks: fontSize slider, lineHeight slider, font radio (黑體/宋體), paper texture toggle, "Preserve original EPUB styling" toggle (scoped to this book).
- **🎨 panel** = per-theme color picker: accent color (free hex + presets) and style-specific background preset (paper tone / gradient / dark tone).
- **Theme switcher** = 3 thumbnails + current name; click to switch. Smooth crossfade.
- **Keyboard**: `←/→` prev/next chapter; `PgUp/PgDn` page-height scroll; `Space` next page; `J/K` chapter nav; `F` fullscreen; `Esc` back to library; `,` tweaks panel; `T` TOC.
- **Auto-save**: scroll position debounced 500ms → writes `lastChapterId` + `lastScroll` + `lastReadAt`. No explicit "save".
- **Status derivation**: `lastScroll + chapter index / total chapters >= 0.95` → `finished`. Any read progress → `reading`. Otherwise `unread`.

## Theme details

### ① Warm Library (v1)

- Palette: paper `#EDE4D2` (default) / ink `#2B241B` / accent 赭紅 `#8C3A2E` (default).
- Paper tone presets: 羊皮紙 `#EDE4D2`, 月白 `#F5F1E8`, 棉紙 `#E8DFCC`, 古書 `#E0D4B8`, 霜白 `#F0EBDC`, 竹黃 `#E5DBB9`.
- Centered single column (max-width 640px, padding 60px), paper-texture SVG overlay (opt-out via tweaks).
- First-paragraph drop cap in accent color (2.2× font size, float left).
- Title band: small "第 一 回" caption, chapter title in Noto Serif TC, 60px hairline divider below.
- Top strip: traffic-light chrome, book info, quick actions ("目錄/書籤/劃線/字體").
- Bottom progress: thin hairline with accent-colored 12% fill, chapter pos + total + estimate.

### ④ Ambient Glass (v4)

- Palette: accent `#AD4E3B` (default), ink `#1A1A1C`, muted alphas of ink.
- Wallpaper gradient presets (`linear-gradient(135deg, …)`):
  - 晨曦 (dawn, default): `#F5DEB3 → #E8B6A0 → #C9A5D4 → #A4B8DC`
  - 薄暮 (dusk): `#2D1B3D → #7B4B6B → #D4857E → #F5C98E`
  - 青空 (sky): `#E0F2FF → #B8D8E8 → #9EB8D4 → #7BA0C4`
  - 墨染 (ink wash): `#F4F1EC → #D4CFC4 → #A8A198 → #6E6A63`
- Two soft blurred radial blobs over the gradient add light.
- Glass panels: `background: rgba(255,255,255,0.38)`, `backdrop-filter: blur(36px) saturate(160%)`, `border: 0.5px solid rgba(255,255,255,0.55)`, `border-radius: 18px`, layered shadow.
- Grid: `260px` TOC glass panel | reading glass panel. Reading panel has the content centered (max 580px) with a floating glass pill progress indicator at bottom.
- Top bar: slim glass strip with traffic lights + centered title + action buttons.

### ⑤ Dark Serif (v5)

- Palette: bg `#13201C` (default) / bg2 `#1A2925` / ink `#ECE3CF` / gold `#C9A86B`.
- Background tone presets:
  - 墨綠 (default): `#13201C / #1A2925`
  - 玄黑: `#12100E / #1A1816`
  - 赭褐: `#211612 / #2A1E18`
- Noto Serif TC throughout, large character spacing (letter-spacing `0.15em`) on chapter title, characters spaced with U+3000 in headings (per prototype).
- Left panel (240px): centered large cover → title → divider → "目　錄" header → chapter list with dashed rule between → progress bar.
- Main: gold hairline top/bottom frames, centered column (max 640px), title cluster with decorative diamond `◆` between two thin hairlines.
- Only one font: serif. The tweak-panel `font` radio becomes disabled in this theme (note shown).

## Parsing

### EPUB parser (`src/parsers/epub.js`)

Uses JSZip. For each file:

1. Read as ArrayBuffer (from File or FileSystemFileHandle).
2. `JSZip.loadAsync(buffer)`.
3. Parse `META-INF/container.xml` → locate OPF (`content.opf` or similar).
4. Parse OPF:
   - `<metadata>` → title (`dc:title`), author (`dc:creator`), optional publisher / date / description.
   - `<manifest>` → id → href + mediaType map.
   - `<spine>` → ordered list of manifest ids. Build chapter array from these.
   - Cover: prefer `<meta name="cover" content="…">` pointing at an image id; fallback to manifest `properties="cover-image"`; fallback to first image in first chapter.
5. Parse nav:
   - Prefer EPUB 3 `properties="nav"` → `nav.xhtml` → `<nav epub:type="toc">`.
   - Fallback: `toc.ncx` `<navMap>`.
   - Fallback: infer from spine file names.
6. Chapter rendering (lazy, per-chapter):
   - Read spine XHTML, parse with `DOMParser('text/html')`.
   - Extract `<body>` content.
   - Rewrite `<img src="…">` to blob URLs (resolve relative to OPF dir → read zip entry → `URL.createObjectURL`).
   - If `preserveOriginalCss === false` (default): strip `<style>`, `<link>`, inline `style` attributes; keep only tag semantics (headings, paragraphs, emphasis, blockquote, lists, `<br>`, `<img>`, `<hr>`).
   - If `preserveOriginalCss === true`: inline `<style>` gets scoped (prepended with `.reading-body` selector); `<link rel=stylesheet>` content is read from zip and likewise scoped; inline `style` attributes kept as-is. Scoping uses a simple regex CSS scoper that prefixes each selector.
   - Return sanitized HTML string.

### TXT parser (`src/parsers/txt.js`)

1. Read as ArrayBuffer.
2. Encoding sniff: try UTF-8 BOM; else try UTF-8 decode with `fatal: true`; on error, try `big5` (common for zh-TW), else `gb18030`.
3. Split into chapters via regex: `/^[ \t]*第[一二三四五六七八九十百千零\d]+[章回節卷部篇][ \t]*.*$/m`. If fewer than 2 matches, treat the whole thing as a single chapter "正文".
4. Each chapter = { id, title (the matched heading), paragraphs (remaining lines, blank-separated) }.
5. Title/author: try to read from filename `書名 - 作者.txt` or `【作者】書名.txt` patterns; else filename becomes title, author null.

## State management

Single React context `AppContext` provides:

- `view`: `'library' | 'reader'`
- `activeBookId`: string | null
- `settings`: from IndexedDB
- `books`: query result, filter-aware
- `currentBook`: fully loaded book (with parsed spine) when in reader
- `chapterCache`: ephemeral `Map<string, string>` keyed `bookId:chapterId` → sanitized HTML. Lives in context ref (not state) to avoid re-renders on cache writes. Cleared on `closeBook`.
- Actions: `setView`, `openBook`, `closeBook`, `updateSettings`, `updateBook`, `addRoot`, `rescanRoot`, `addStandaloneFile`, `getChapter(bookId, chapterId)` (consults cache first), etc.

All mutations go through the action functions which persist to IDB before updating local state. A single `useReducer` under the hood.

## Error handling (boundaries only)

- EPUB parse failure (bad ZIP / missing OPF) → show toast "無法解析：<filename>" + book flagged in library with warning icon, not deleted.
- Permission revoked when trying to open a book → show banner "權限已失效，請重新授權" + button re-invoking `requestPermission` on the root handle.
- IDB quota exceeded (unlikely but possible if many covers) → error toast + book added without cover.
- No trust boundaries internal to the app: once a book is parsed, downstream components trust its shape.

## Security

- EPUBs can contain arbitrary HTML and CSS. Default (stripped) mode is safe: no scripts, no external links, no custom CSS.
- Preserve-original-CSS mode: run CSS through a scoper; still strip `<script>`, `<iframe>`, `<object>`, `<embed>`, `on*` attributes, `javascript:` URLs.
- Images are served via blob URLs — no external network requests when reading.
- Fonts/CSS from CDN are the only external network activity; page runs fully offline after first load if browser caches them (user can also self-host by downloading the three files and editing the HTML; out of scope for v1).

## Testing strategy

Manual, no test framework — this is a small single-user app and the prototype was manual too.

Test matrix:
1. Open a scraper-produced EPUB from `esjzone-scraper/books/1543764675(迷宮防守)/zh-TW/迷宮防守.epub` → parses, shows TOC, opens to chapter 1.
2. Open a novelpia-produced EPUB (zh + ko) → handles non-ASCII filenames, Korean text renders.
3. Add `C:\dev\esjzone-scraper\books` as root → recursive scan finds >10 EPUBs, covers extracted.
4. Add `C:\dev\novelpia-scraper\books` as second root → both visible in sidebar.
5. Switch theme V1 → V4 → V5; scroll position preserved.
6. Change V4 accent to `#4A90E2` → only V4 affected; switch away + back, color persists.
7. Change fontSize 17 → 20; change back; verify no layout jumps.
8. Toggle "preserve original EPUB CSS" on a book known to have embedded styles → sees original rendering; toggle off → returns to themed rendering.
9. Close browser, reopen — library visible; click book → permission re-request → opens to remembered scroll position.
10. Load a TXT (pick one from a scraper source or create one) → chapters detected, readable.
11. Firefox/Safari — single-file open works; "Add root" is hidden with explainer banner.

## Out of scope for v1

- Bookmarks, highlights, notes (could layer onto `books.annotations: []` later).
- Search within a book / across library (text search — EPUB content isn't indexed).
- Recent-books horizontal strip on library (if desired, can add a section above the grid).
- Drag-dropping a file onto the library window (adds the file). Shouldn't be hard — add later.
- Cover regeneration via canvas for TXT files (could render a stylized title card as cover).
- Import/export library JSON (user-driven backup).
- "Reveal in Explorer" (requires `showSaveFilePicker` tricks, not universal).
- Page-flip animation mode.
- TTS, translation, dictionary.
- Mobile layout.

## Resolved design decisions (user-confirmed 2026-04-24)

- **Git**: Repo initialized at `C:\dev\novel-reader\` with per-repo user `Mystic0428 <as80639as@gmail.com>` (global `Daniel Wei` config kept intact for the user's other projects like `jasmine`). This spec is the first commit.
- **Chapter text caching**: session-only memory cache (see "Data layer" and "State management" sections). Not persisted to IDB. Cleared when book closes.
- **Tags + Collections**: both modeled. Tags are flat keywords, cheap to add, book can have many. Collections are named curated lists. Sidebar has separate sections for each. A book can live in both systems simultaneously.

## Open questions for reviewer

- **Firefox/Safari fallback depth**: accepting that advanced features (persistent folder handles, recursive scan) don't work there. If user is routinely on non-Chromium, we need a bigger fallback (e.g. store EPUB files themselves in IndexedDB so they persist — adds complexity). Current plan: show an explainer banner and work single-file-only. Revisit if user reports it's a real problem.
