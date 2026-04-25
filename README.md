# Novel Reader

**English** · [繁體中文](README.zh-TW.md)

A local-first, zero-build, desktop novel reader for **EPUB** and **TXT**, designed for Chinese serialized web novels (zh-TW / zh-CN) but works for anything.

- **Library-first UX** — Netflix-style home with hero, horizontal rows (繼續閱讀 / 有新章節 / per-tag / per-collection), search with `/` shortcut, dark filtered grid
- **~75 atmospheric reader themes** across 10 groups (經典 / 復古 / 現代 / 華麗 / 東方 / 奇幻 / 暗黑 / 遊戲 / 自然 / 檔案), each with 4–9 background variants and 6 accent presets, ★ favorites + search in the picker
- **Reading stats** — 📊 modal with Lv.N reader badge, current/longest streak, GitHub-style 365-day activity heatmap, totals (chapters / words / active days)
- **Book detail card** — right-click any cover → 📋 書本資訊 → manila library-card overlay with circulation record, recent activity, tags, collections, actions
- **Tachiyomi-style "+N" badges** for newly added chapters when an EPUB updates on disk
- **Recursive folder scan** via the File System Access API — point at a scraper output dir, filter sub-folders (`ko`, `raw`, etc.), every `.epub` appears
- **IndexedDB** persistence for books, reading position, per-book settings, tags, collections, reading events
- **Immersive reading mode** — topbar/footer auto-fade after 3s of inactivity; Chinese typography controls (段首縮排 / 段距 / 字重)
- **Everything runs in the browser** — no server, no build step, no bundler

> Born to read the output of my [esjzone-scraper](https://github.com/Mystic0428/esjzone-scraper), so it has first-class support for serialized fiction that gains chapters over time.

---

## Prerequisites

On a fresh machine you need **two things**:

| What | Why | Install |
| ---- | --- | ------- |
| **Python 3** | The launcher (`start.bat` / `start.sh`) uses `python -m http.server` to serve the folder. | Windows: [python.org](https://www.python.org/downloads/) — **tick "Add Python to PATH"** during install.<br>macOS: `brew install python` (macOS 12.3+ no longer ships Python).<br>Linux: usually pre-installed; if not, `sudo apt install python3`. |
| **A Chromium browser** | Folder scanning needs the File System Access API (`showDirectoryPicker`), which only Chromium has. | Windows: Microsoft Edge is pre-installed and works. Otherwise install Chrome / Brave.<br>macOS / Linux: install Chrome / Edge / Brave. |

Firefox and Safari will run the app but only support **single-file mode** (no folder scan). Everything else — IndexedDB, EPUB parsing, themes — works in any modern browser.

No Node.js, no npm, no build step. This is by design.

---

## Quick Start

No build. No install. Just start the bundled launcher:

**Windows** — double-click `start.bat` (or run from terminal).
**macOS / Linux** — `./start.sh` (first time: `chmod +x start.sh`).

Both scripts launch `python -m http.server 8080` in the project folder and open <http://localhost:8080/novel-reader.html> in your default browser.

Or do it manually:

```sh
cd novel-reader
python -m http.server 8080
# then open http://localhost:8080/novel-reader.html
```

> The `http://` URL is **required** for the File System Access API — `file://` will not work.

### Adding books

- **📁 根目錄** (top-right dropdown) — Pick a folder. Every `.epub` under it (recursively) gets indexed. You'll be prompted for sub-folders to **exclude** (e.g. `ko, raw, ja` — handy when scraper output mixes raw + translated copies).
- **＋ 加檔** — Pick a single `.epub` or `.txt` file.

The library auto-scans permitted roots on load, so newly-scraped books appear without manual action. When an EPUB on disk gains chapters, the source file is re-parsed on next open and the card shows a red **+N** badge until you read past those chapters.

### Keyboard shortcuts

| Key | Where | Action |
| --- | ----- | ------ |
| `/` | Library | Focus the search input |
| `Esc` | Library search | Clear search + blur |
| `←` / `→` | Reader | Previous / next chapter |
| `PgUp` / `PgDn` / `Space` | Reader | Page scroll |
| `T` | Reader | Toggle TOC drawer |
| `,` | Reader | Toggle tweaks panel |
| `F` | Reader | Toggle browser fullscreen |
| `Esc` | Reader | Back to library |

---

## Themes

About **75 reader themes** across **10 groups**. Each theme has **4–9 background variants** and **6 accent presets** (color picker 🎨). The theme picker has a search box (matches Chinese label or group name) and ★ favorites that pin to the top.

| Group | Vibe | Example themes |
| ----- | ---- | -------------- |
| **經典** | Quiet defaults | Warm 書房 / Glass 毛玻璃 / Dark 典藏 / Apple Books 書櫃 / 紙墨 純讀 / Bookshop / Notebook 札記本 / Long-form 長文雜誌 |
| **復古** | Pre-2000 print + tech | Terminal 終端機 / Polaroid 拍立得 / 8-bit 像素 / Diner 50s / Newsprint 老報紙 / Cassette 卡帶 / Typewriter 打字機 / Pulp 廉價小說 / Vinyl 黑膠 |
| **現代** | Contemporary editorial | Brutalist 野獸派 / Editorial 極黑 / Memphis 80s / Wes 對稱 / Cyberpunk 霓虹 / Riso 印刷 / Swiss 編輯部 / Rams Braun T1000 / Frutiger Aero / Vaporwave / Solarpunk / Neumorphism / Claymorphism / Mesh Aurora / VisionOS |
| **華麗** | Ornate decorative | Deco 裝飾藝術 / Baroque 巴洛克 / Dunhuang 敦煌 / Arcana 塔羅 / Gothic 哥德 / Art Nouveau / Illuminated 抄本 / First Folio / Byzantine / Ex Libris 維多利亞 / Cloisonné 景泰藍 / Leather & Gilt 燙金皮革 / Marbled / Ivory 象牙雕刻 / 上海 1934 月份牌 |
| **東方** | CJK aesthetics | 宋卷 山水 / 青花 瓷器 / 浮世繪 北齋 / 水墨 沉硯 / 直書 線裝古籍 / 雕版 / Rinpa 和風金屏 / 敦煌 殘卷 / 蘇州 漏窗 / 侘寂 殘缺 |
| **奇幻** | RPG / fantasy literature | Grimoire 魔典 / Adventurer's Codex 冒險者手冊 / Rune Stone 符文石碑 / Fae Codex 精靈卷宗 |
| **暗黑** | Macabre / gothic | Mourning 維多利亞遺照 / Dossier 命案檔案 / Ghost Story 鬼故事筆記 / Bestiary 怪物百科 |
| **遊戲** | Game UI imitations | RPG Textbox 對話框 / Visual Novel 視覺小說 / Board Game 桌遊規則書 / Steam Deck 掌機介面 |
| **自然** | Outdoor / botanical | Mountain Cabin 山屋木紋 / Tide Pool 潮間 / Pressed Botanical 壓花標本 / Campfire 營火 |
| **檔案** | Bureaucratic / forensic | Bulletin 公報 / Transcript 法庭逐字 / Field Journal 田野筆記 / Library Card 圖書館卡 |

Every theme affects only the **reading area**; the library home and TOC drawer stay consistent across themes. Per-book accent and background are stored in settings, so switching theme remembers your last picks.

---

## Library Home (Netflix-style)

- **Sticky top bar** — logo, search input (with `/` focus shortcut + ✕ clear), 📊 stats, sort dropdown, 📁 根目錄, ＋ 加檔
- **Hero** — most recently read book (or the first available one), with blurred cover backdrop, progress bar, 繼續閱讀 CTA
- **Rows** (horizontal scroll, drag-to-pan with momentum):
  - 🔥 有新章節 — books whose on-disk chapter count grew since your last read
  - 繼續閱讀 — books you've touched, sorted by `lastReadAt` desc (finished books stay so re-readers can return)
  - 全部藏書 · {sort} — all books in the chosen sort order
  - One row per `📁` collection with ≥ 3 books
  - One row per `#` tag with ≥ 3 books
- **分類瀏覽** — category cards (tags + collections); click to filter
- **Search / filter mode** — switches to a dark grid view with chip-style tag/collection filters and an empty state with a "清除全部條件" button when nothing matches
- **Right-click any cover** → 📋 書本資訊, # tags, 📁 collection, ↺ clear progress, 🗑 remove

### Reading stats (📊)

A modal pulled from the H2 + H7 design variants in the design bundle:

- **Hero ribbon** — `Lv.N READER` badge (1 level per 10 chapters), current 連續天數 with XP-bar to next level, secondary tiles for longest streak / active days / total chapters
- **Activity heatmap** — GitHub-style 53-week × 7-day grid, gold intensity by chapters read that day, hover tooltip
- **Stat tiles** — total chapters / total words / active days / longest streak / current level / first-read date
- **已讀完** — books at the final chapter with `lastScroll ≥ 0.9`; click to open

Reading events are logged idempotently per (book, chapter, day) when you open a chapter — re-opening the same chapter mid-day doesn't inflate counts.

### Book detail card (📋)

Right-click → 書本資訊 opens a manila library-card overlay:

- Cover, title (large serif), author, tags, collections
- Dewey-style call number (decorative) + BORROWED / FINISHED stamp
- 6-tile circulation record: 加入 / 上次閱讀 / 狀態 / 章節 / 字數 / 進度
- 新章節 notice when source file has new chapters since last read
- Recent activity strip pulled from `readingEvents` (last 5 reads with chapter title)
- Action row: 繼續閱讀 / 從頭開始 / # Tags / 📁 Collections / 🗑 REMOVE

---

## Reading UX

- Per-book **「保留原始 EPUB 排版」** toggle — when EPUB has intentional styling (poetry, manga, special layouts), enable to keep its embedded CSS. The theme still wraps around, but inline typography is preserved.
- **Tweaks panel** (`,` key):
  - **排版**: 字級 (10–32 px), 行距 (0.6–2.4), 字體 (黑體 / 宋體), 段首縮排 (0–4 字), 段距 (0–2 em), 字重 (300–700)
  - **質感**: 紙張紋理 toggle, **沉浸式** toggle — 3s without input fades the topbar/footer; mouse / key / wheel / touch reveals them. Forced visible while a panel is open.
- **TOC drawer** (`T` key):
  - Search box (case-insensitive substring over chapter titles)
  - Active chapter is auto-centered when the drawer opens
  - Active chapter highlighted with a 3px accent left bar + bolder larger text
- **Theme picker**:
  - Search box (matches label and group name in zh / en)
  - ★ favorites pinned to a top section
  - Auto-centers the active theme when the dropdown opens
- **Chapter prefetch** — after loading a chapter, the next chapter is parsed in idle time so forward navigation hits the cache instantly.
- **Re-parses EPUB on open** — if new chapters were added on disk, the reader sees them immediately. `lastKnownChapterCount` bumps as you navigate past new chapters, clearing the +N badge.
- **Drop-cap handling** — `injectDropCap` auto-skips CJK characters so only Latin openings get enlarged first letters.

---

## Custom favicon

Drop a `favicon.png` (any image, square ≥ 32px) in the repo root. Reload — the tab icon swaps to it. The default 📚 emoji is the inline SVG fallback, and a small inline script in `novel-reader.html` probes `favicon.png` with `new Image()` and only swaps the icon if it loads. `favicon.png` is gitignored so your personal/branded image never lands in the repo.

---

## File Structure

```
novel-reader.html            — entry point (loads all scripts)
src/
  app.jsx                    — AppContext, root router (library ↔ reader)
  library.jsx                — Netflix home + filtered grid
  reader.jsx                 — reader shell, chapter cache, prefetch, immersive
  storage/
    idb.js                   — tiny IndexedDB wrapper (per-store config, indexes)
    books.js                 — books store (CRUD, tags, collections)
    roots.js                 — FS-handle store for scanned folders (with excludeDirs)
    settings.js              — global app settings (active theme, tweaks, favorites)
    reading-events.js        — append-only event log feeding the stats panel
  parsers/
    epub.js                  — EPUB parser using JSZip (+ CSS scoping when preserveOriginalCss)
    txt.js                   — TXT parser with CJK chapter detection
  ui/
    cover.jsx                — cover blob or fallback vertical-title block
    book-menu.jsx            — right-click menu (info / tags / collection / clear / remove)
    book-card.jsx            — library-card-style book detail modal
    toc-drawer.jsx           — slide-in chapter list (with search + auto-center)
    tweaks-panel.jsx         — typography + immersive controls
    stats-panel.jsx          — reading stats modal (hero + heatmap + tiles)
    theme-switcher.jsx       — grouped theme picker (search + favorites)
    color-picker.jsx         — per-theme accent + bg-tone presets
  themes/
    v{N}-{name}.jsx          — one file per theme (Reader + Footer components)
styles/
  shared.css                 — reading-body, fonts, scrollbars, paper texture
  v{1,4,5}-*.css             — CSS-heavy themes (others are JSX-inline)
```

Non-JSX scripts are consumed raw — all functions are hoisted top-level and attached to `window` where needed. Dependency order in `novel-reader.html` is: storage → parsers → UI → themes → library → reader → app.

---

## Storage Schema

IndexedDB object stores (DB version 2):

- **books** — `{ id, rootId, relPath, fileHandle, sourceType, title, author, coverBlob, chaptersMeta, wordCount, lastChapterId, lastScroll, tags, collections, lastKnownChapterCount, preserveOriginalCss, addedAt, lastReadAt, fileLastModified }`
- **roots** — `{ id, name, dirHandle, excludeDirs, bookCount, lastScannedAt }`
- **settings** — single row, `id: 'global'`, holds `activeTheme`, `themeColors[v1..v79]`, `tweaks` (fontSize / lineHeight / font / texture / paragraphIndent / paragraphSpacing / fontWeight / immersive), `favoriteThemes`, `sortBy`, `sortOrder`, `filterTag`, `filterCollection`
- **readingEvents** — append-only, `{ id (auto), bookId, chapterId, date (YYYY-MM-DD), ts, words }`. Indexed by `byDate` and `byBook`. Logged by `openChapter`, idempotent per (book, chapter, day).
- **kv** — generic key-value scratch space

`chaptersMeta` stores metadata only (title, href, wordCount); chapter HTML is parsed on-demand by `getChapter` and cached in-memory per session.

---

## Browser Support

| Browser | Folder scan | Single file | IndexedDB | Status |
|---------|-------------|-------------|-----------|--------|
| Chrome / Edge / Brave | ✅ | ✅ | ✅ | Full |
| Firefox / Safari | ❌ | ✅ | ✅ | Single-file mode |

Folder scanning requires `showDirectoryPicker` from the File System Access API (Chromium-only).

---

## Tech Stack

- **React 18** via UMD CDN
- **Babel Standalone** — compiles JSX in the browser (one-time per load)
- **JSZip** — EPUB container parsing
- **IndexedDB** — persistence (via a ~100-line wrapper)
- **File System Access API** — folder handles + permission renewal
- **Noto Serif TC / Noto Sans TC / Inter / EB Garamond / Cormorant Garamond / Caveat / JetBrains Mono / Press Start 2P** — fonts via Google Fonts
- Zero npm dependencies. Zero build step.

---

## Development

Edit any file and refresh. If you're editing JSX, Babel Standalone recompiles on next load.

**If your changes aren't showing up**: hard-refresh with **Ctrl+Shift+R** (or open DevTools → Network → check "Disable cache"). Babel Standalone doesn't bust HTTP cache by itself.

To add a new theme:

1. Create `src/themes/vN-name.jsx` exporting `VNReader` + `VNFooter` on `window`
2. Add the script tag to `novel-reader.html` (after existing themes, before `library.jsx`)
3. Add switch cases in `src/reader.jsx` (both `renderThemeContent` and `renderThemeFooter`)
4. Add defaults to `src/storage/settings.js` (`themeColors.vN`)
5. Add accent + tone presets to `src/ui/color-picker.jsx`
6. Add an entry to the themes array in `src/ui/theme-switcher.jsx` (set `group` to one of the existing 10 groups, or append a new group name to `groups`)

**Reader prop contract**: `{ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }`. Respect `book.preserveOriginalCss` (skip inline typography when true). Use the global `injectDropCap(html, size)` helper for drop caps — it skips CJK automatically. Use the global `stripChapterPrefix(title)` helper to clean "第N章：" / numeric prefixes. Set `--accent` CSS var on your root if you want it to inherit into any child CSS.

---

## License

MIT — do whatever.

## Credits

- Themes originated from a Claude Design mock-up session (Novel Reader home + reader prototypes)
- Stats panel + book detail card visuals taken from the H2 (RPG) + H7 (terminal) + H9 (library card) home variants of the same bundle
- Built collaboratively with Claude Code
