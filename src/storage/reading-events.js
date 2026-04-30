// src/storage/reading-events.js — append-only log of "user opened chapter X today"
// Drives stats panel: totals, streak, daily heatmap, etc.
(function () {
  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Log "I opened bookId/chapterId today" — but only once per (book, chapter, day).
  // This means re-opening the same chapter mid-day is idempotent; reading it again
  // tomorrow logs a new event so streaks/heatmap reflect day-to-day activity.
  //
  // Backfill exception: if the existing event's `words` is 0 (likely written
  // before EPUB chapter word counts were computed) and we now have a real
  // word count, update the row. This corrects historical 0 values without
  // changing the policy (re-reads still don't add to totals).
  async function log({ bookId, chapterId, words = 0 }) {
    if (!bookId || !chapterId) return null;
    const date = todayStr();
    const existing = await idb.listByIndex('readingEvents', 'byBook', bookId);
    const dup = (existing || []).find((e) => e.date === date && e.chapterId === chapterId);
    if (dup) {
      if ((!dup.words || dup.words === 0) && words > 0) {
        await idb.put('readingEvents', { ...dup, words });
      }
      return dup.id;
    }
    const ts = Date.now();
    return idb.add('readingEvents', { bookId, chapterId, date, ts, words });
  }

  async function listAll() {
    return idb.list('readingEvents');
  }

  // Compute stats from the full event log. Cheap enough for years of daily reading.
  async function computeStats() {
    const events = await listAll();
    if (events.length === 0) {
      return {
        totalChapters: 0, totalWords: 0, activeDays: 0,
        currentStreak: 0, longestStreak: 0,
        level: 1, xpInLevel: 0, xpForNext: 10,
        firstDate: null, lastDate: null,
      };
    }
    // Per-day aggregation (events already deduped per chapter).
    const byDate = new Map(); // date → { chapters, words }
    for (const e of events) {
      const d = byDate.get(e.date) || { chapters: 0, words: 0 };
      d.chapters += 1;
      d.words += e.words || 0;
      byDate.set(e.date, d);
    }
    const dates = Array.from(byDate.keys()).sort();
    const totalChapters = events.length;
    const totalWords = events.reduce((s, e) => s + (e.words || 0), 0);
    const activeDays = dates.length;
    // Streak: walk backwards from today; allow today-or-yesterday as start so streak
    // doesn't break the moment the day rolls over and you haven't read yet.
    const today = new Date();
    function dayOffset(n) {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    let currentStreak = 0;
    const startOffset = byDate.has(dayOffset(0)) ? 0 : (byDate.has(dayOffset(1)) ? 1 : -1);
    if (startOffset >= 0) {
      let i = startOffset;
      while (byDate.has(dayOffset(i))) { currentStreak += 1; i += 1; }
    }
    // Longest streak: scan sorted dates for consecutive runs.
    let longestStreak = 0, run = 0, prev = null;
    for (const d of dates) {
      if (prev) {
        const a = new Date(prev), b = new Date(d);
        const dayDiff = Math.round((b - a) / 86400000);
        run = dayDiff === 1 ? run + 1 : 1;
      } else {
        run = 1;
      }
      if (run > longestStreak) longestStreak = run;
      prev = d;
    }
    // RPG levels: each 10 chapters = 1 level. Lv.1 starts at 0 chapters.
    const xpForNext = 10;
    const level = Math.floor(totalChapters / xpForNext) + 1;
    const xpInLevel = totalChapters % xpForNext;
    return {
      totalChapters, totalWords, activeDays,
      currentStreak, longestStreak,
      level, xpInLevel, xpForNext,
      firstDate: dates[0], lastDate: dates[dates.length - 1],
      byDate, // expose for heatmap
    };
  }

  // Heatmap: returns an array of { date, count } for the past `days` (default 365),
  // ordered oldest → newest, dense (every day, count=0 if no read).
  async function getHeatmap(days = 365) {
    const stats = await computeStats();
    const today = new Date();
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const e = (stats.byDate || new Map()).get(key) || { chapters: 0 };
      out.push({ date: key, count: e.chapters, weekday: d.getDay() });
    }
    return out;
  }

  window.readingEventsStore = { log, listAll, computeStats, getHeatmap };
})();
