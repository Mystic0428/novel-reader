# Novel Reader

A local-first desktop novel reader for EPUB and TXT. Three runtime-switchable atmospheric themes (Warm Library, Ambient Glass, Dark Serif), library view with recursive folder scanning, and per-book reading position.

## Requirements

- **Chromium browser** (Chrome, Edge, Brave) for full functionality — the library scan uses the File System Access API.
- Firefox and Safari work in single-file mode only (no folder scanning).
- The app is client-side and offline once the CDN deps are cached.

## Usage

```sh
cd C:\dev\novel-reader
python -m http.server 8080
```

Then open <http://localhost:8080/novel-reader.html>.

The `http://` URL is required for the File System Access API; `file://` disables it.

### Adding books

- **＋ 加根目錄**: pick a folder like `C:\dev\esjzone-scraper\books` — all `.epub` files under it (recursive) are indexed.
- **＋ 加單檔**: pick a single `.epub` or `.txt` file.

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next chapter |
| `PgUp` / `PgDn` / `Space` | Page scroll |
| `T` | Toggle TOC drawer |
| `,` | Toggle tweaks panel |
| `F` | Toggle fullscreen |
| `Esc` | Back to library |

### Themes

Top-right chips: **Warm** / **Glass** / **Dark**. Click to switch. The `🎨` button opens a per-theme color picker (accent + background preset).

### Per-book settings

The tweaks panel (`,` or `Aa` button) includes "保留原始 EPUB 排版" — enable if a specific book has important embedded styling (e.g., poetry, manga).

## Architecture

See `docs/superpowers/specs/2026-04-24-novel-reader-design.md`.

## Stack

React 18 + Babel standalone (CDN), JSZip for EPUB parsing, IndexedDB for persistence, File System Access API for folder handles.
