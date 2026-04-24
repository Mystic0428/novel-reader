# Novel Reader

A local-first, zero-build, desktop novel reader for **EPUB** and **TXT**, designed for Chinese serialized web novels (zh-TW / zh-CN) but works for anything.

- **Library-first UX** — Netflix-style home with hero, horizontal rows (繼續閱讀 / 有新章節 / tag & collection 分組), and a dark-mode browse grid
- **17 atmospheric themes** with per-theme accent + background variations, from austere (Warm / Dark / Glass) to ornate (Baroque / Deco / Dunhuang) to experimental (Cyberpunk / Memphis / Brutalist)
- **Tachiyomi-style "+N" badges** for newly added chapters when an EPUB updates
- **Recursive folder scan** via the File System Access API — point at a scraper output dir and every `.epub` appears
- **IndexedDB** persistence for books, reading position, per-book settings, tags, collections
- **Everything runs in the browser** — no server, no build step, no bundler

> Born to read the output of my [esjzone-scraper](https://github.com/Mystic0428/esjzone-scraper) output, so it has first-class support for serialized fiction that gains chapters over time.

---

## Screenshot

Open the home, then the reader, then try switching themes from the top-right dropdown.
(Screenshots coming — for now, just run it.)

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

- **📁 根目錄** (top-right dropdown) — Pick a folder. Every `.epub` under it (recursively) gets indexed.
- **＋ 加檔** — Pick a single `.epub` or `.txt` file.

When an EPUB on disk gains new chapters, re-opening the book auto-detects them and the library card shows a red **+N** badge.

### Keyboard shortcuts (reader)

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next chapter |
| `PgUp` / `PgDn` / `Space` | Page scroll |
| `T` | Toggle TOC drawer |
| `,` | Toggle tweaks panel |
| `F` | Toggle fullscreen |
| `Esc` | Back to library |

---

## Themes

17 reader themes, each with 4–8 background variations and 6 accent presets.

| Key | Name | Vibe |
|-----|------|------|
| `v1`  | Warm · 書房         | 溫暖米白、首字下沉、赭紅點綴 |
| `v4`  | Glass · 毛玻璃       | macOS Sequoia 式漸層壁紙 + 毛玻璃卡片 |
| `v5`  | Dark · 典藏         | 深墨綠 + 金點綴 + 宋體 + 古籍線 |
| `v6`  | Terminal · 終端機    | DOS/CRT、ASCII 邊框、等寬字 |
| `v9`  | Brutalist · 野獸派   | 2px 黑框、螢光綠、巨大章節標題 |
| `v11` | Apple Books · 書櫃   | 木紋底 + 紙頁陰影 + 彩帶書籤 |
| `v17` | Deco · 裝飾藝術      | 黑金幾何、雙線邊框、羅馬章號 |
| `v18` | Baroque · 巴洛克     | 深酒紅 + 燙金、繁複花邊 |
| `v19` | Dunhuang · 敦煌      | 朱砂描金、藻井頭圖、堂號紅印 |
| `v20` | Arcana · 塔羅        | 深紫星輝金、玫瑰角標 |
| `v21` | 宋卷 · 山水         | 卷軸軸頭、遠山水墨、收藏印 |
| `v25` | 青花 · 瓷器         | 白釉 × 鈷藍纏枝、蓮花章首 |
| `v30` | Gothic · 哥德       | 黑底火焰邊 + 哥德字 + ✝ 章節 |
| `v31` | Memphis · 80s       | 螢光粉綠紫、幾何亂拼、SIDE A |
| `v32` | Wes · 對稱          | 粉橘粉綠、全置中、票根標籤 |
| `v33` | Cyberpunk · 霓虹    | 黑底洋紅青藍、scanline、HUD |
| `v37` | Editorial · 極黑    | 純黑 × Helvetica 巨字 |

Every theme affects only the **reading area**; the TOC drawer and library stay consistent across themes.

---

## Library Home (Netflix-style)

- **Sticky top bar** — logo, sort dropdown, 📁 根目錄, ＋ 加檔, search
- **Hero** — most recently read (or just added) book, with blurred cover backdrop, progress bar, 繼續閱讀 CTA
- **Rows** (horizontal scroll, auto-populated):
  - 🔥 有新章節 — books whose on-disk chapter count grew since your last read
  - 繼續閱讀 — books with `lastReadAt < 100%`
  - 全部藏書 · {排序} — all books in your chosen sort order
  - Per-collection row for each `📁` group with ≥ 3 books
  - Per-tag row for each `#` tag with ≥ 3 books
- **分類瀏覽** — category cards (tags + collections); click to filter
- **Search / filter** mode — switches to a dark grid view with chip-style tag/collection filters

---

## Reading UX

- Per-book **「保留原始 EPUB 排版」** toggle — when EPUB has intentional styling (poetry, manga, special layouts), enable to keep its embedded CSS. The theme still wraps around, but inline typography is preserved.
- **Tweaks panel** (`,` key): font size (10–32 px), line height (0.6–2.4), font family (sans / serif), paper texture toggle.
- **Re-parses EPUB on open** — so if new chapters are added to the underlying file, the reader sees them immediately. `lastKnownChapterCount` is bumped when you navigate past a new chapter, clearing the +N badge.
- **Drop-cap handling** — `injectDropCap` auto-skips CJK characters so only Latin openings get enlarged first letters (CJK glyphs look broken when resized inline).
- **Right-click any book card** for tags / collections / remove.

---

## File Structure

```
novel-reader.html            — entry point (loads all scripts)
src/
  app.jsx                    — AppContext, root router (library ↔ reader)
  library.jsx                — Netflix home + filtered grid
  reader.jsx                 — reader shell, chapter cache, TOC / tweaks state
  storage/
    idb.js                   — tiny IndexedDB wrapper
    books.js                 — books store (CRUD, tags, collections)
    roots.js                 — FS-handle store for scanned folders
    settings.js              — global app settings (active theme, tweaks, filters)
  parsers/
    epub.js                  — EPUB parser using JSZip (+ CSS scoping when preserveOriginalCss)
    txt.js                   — TXT parser with CJK chapter detection
  ui/
    cover.jsx                — cover blob or fallback vertical-title block
    book-menu.jsx            — right-click menu
    toc-drawer.jsx           — slide-in chapter list
    tweaks-panel.jsx         — font / line-height / font-family / texture sliders
    theme-switcher.jsx       — 17-theme grouped dropdown
    color-picker.jsx         — per-theme accent + bg-tone presets
  themes/
    v{N}-{name}.jsx          — one file per theme (Reader + Footer components)
styles/
  shared.css                 — reading-body, fonts, scrollbars, paper-tex
  v{1,4,5}-*.css             — CSS-heavy themes (others are JSX-inline)
```

Non-JSX scripts are consumed raw — all functions are hoisted top-level and attached to `window` where needed. Dependency order in `novel-reader.html` is: storage → parsers → UI → themes → library → reader → app.

---

## Storage Schema

IndexedDB object stores:

- **books** — `{ id, rootId, relPath, fileHandle, sourceType, title, author, coverBlob, chaptersMeta, wordCount, lastChapterId, lastScroll, tags, collections, lastKnownChapterCount, preserveOriginalCss, addedAt, lastReadAt }`
- **roots** — `{ id, name, dirHandle, bookCount, lastScannedAt }`
- **settings** — single row, `id: 'global'`, holds `activeTheme`, `themeColors[v1..v37]`, `tweaks`, `sortBy`, `sortOrder`, `filterTag`, `filterCollection`

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
- **IndexedDB** — persistence (via a ~50-line wrapper)
- **File System Access API** — folder handles + permission renewal
- **Noto Serif TC / Noto Sans TC / Inter** — fonts via Google Fonts
- Zero npm dependencies. Zero build step.

---

## Development

Edit any file and refresh. If you're editing JSX, Babel Standalone recompiles on next load.

**If your changes aren't showing up**: hard-refresh with **Ctrl+Shift+R** (or open DevTools → Network → check "Disable cache"). Babel Standalone doesn't bust HTTP cache by itself.

To add a new theme:

1. Create `src/themes/vN-name.jsx` exporting `VNReader` + `VNFooter` on `window`
2. Add the script tag to `novel-reader.html` (after existing themes)
3. Add switch cases in `src/reader.jsx` (both `renderThemeContent` and `renderThemeFooter`)
4. Add defaults to `src/storage/settings.js` (`themeColors.vN`)
5. Add accent + tone presets to `src/ui/color-picker.jsx`
6. Add entry to the themes array in `src/ui/theme-switcher.jsx`

The reader prop contract: `{ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }`. Respect `book.preserveOriginalCss` (skip inline typography when true). Use the global `injectDropCap(html, size)` helper for drop caps — it skips CJK automatically. Set `--accent` CSS var on your root if you want it to inherit into any child CSS.

---

## License

MIT — do whatever.

## Credits

- Themes originated from a Claude Design mock-up session (Novel Reader home + reader prototypes)
- Built collaboratively with Claude Code
