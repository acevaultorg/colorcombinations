import type { Palette } from "@/types/palette";
import { palettes } from "./palettes";

/**
 * Palette of the Day — deterministic daily rotation.
 *
 * Given a Date, returns the palette for that day. Rotation is deterministic
 * so every visitor on the same day sees the same palette, which means we
 * can cache the page aggressively and still tell a "today's pick" story.
 *
 * The seed is days-since-epoch (2026-01-01, UTC), modulo the pool size.
 * Uses UTC so that the flip at midnight is globally consistent rather
 * than depending on whatever timezone the static site was built in.
 *
 * Pool is all 378 palettes — curated + Wada combined — so the cycle
 * takes just over a year to repeat. Every day is a different historical
 * combination; every year the same date surfaces the same palette.
 */

const EPOCH_UTC_MS = Date.UTC(2026, 0, 1); // 2026-01-01T00:00:00Z
const DAY_MS = 86_400_000;

function daysSinceEpoch(date: Date): number {
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return Math.floor((utcDate - EPOCH_UTC_MS) / DAY_MS);
}

/** Returns the palette for a given date. Deterministic. */
export function getPaletteForDate(date: Date): Palette {
  const pool = palettes;
  const days = daysSinceEpoch(date);
  const idx = ((days % pool.length) + pool.length) % pool.length;
  return pool[idx];
}

/** Returns today's palette (at build time). */
export function getPaletteOfTheDay(): Palette {
  return getPaletteForDate(new Date());
}

/** ISO date string `YYYY-MM-DD` in UTC — used as a stable key in the archive. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Human-readable date for display. e.g. `Friday, April 17, 2026`. */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Compact date for archive rows. e.g. `Apr 17`. */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export interface DayEntry {
  date: Date;
  isoDate: string;
  longDate: string;
  shortDate: string;
  palette: Palette;
  isToday: boolean;
}

/**
 * Returns today's entry plus the previous `days` entries, newest first.
 * Default 14 days gives a useful archive without overwhelming the page.
 */
export function getRecentPalettes(days = 14): DayEntry[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayIso = isoDate(today);

  const entries: DayEntry[] = [];
  for (let offset = 0; offset < days; offset++) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - offset);
    const iso = isoDate(d);
    entries.push({
      date: d,
      isoDate: iso,
      longDate: formatLongDate(d),
      shortDate: formatShortDate(d),
      palette: getPaletteForDate(d),
      isToday: iso === todayIso,
    });
  }
  return entries;
}
