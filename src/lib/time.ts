import { TIMEZONE } from "@/lib/config";

let nowOverride: (() => Date) | null = null;
// How far this device's clock is behind the server's (server minus device, in
// milliseconds); 0 until the first sync has measured it.
let clockOffsetMs = 0;

// Every "current time" read goes through here so tests can pin the clock, and
// so every time the app stores (answers, reviews, section progress, resets)
// is on the server's clock rather than a device clock that may be wrong.
export function now(): Date {
  return nowOverride ? nowOverride() : new Date(Date.now() + clockOffsetMs);
}

export function setClockOffset(ms: number): void {
  clockOffsetMs = ms;
}

export function getClockOffset(): number {
  return clockOffsetMs;
}

export function setNowForTesting(fn: (() => Date) | null): void {
  nowOverride = fn;
}

const dayPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Day boundaries follow Vietnam time, not the device or server timezone.
// Built from parts so the result does not depend on locale date ordering.
export function vnDayKey(date: Date): string {
  const parts = dayPartsFormatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

const MS_PER_DAY = 86_400_000;

// Whole days since the epoch for a day key, so calendar arithmetic on Vietnam
// days never touches the device timezone.
export function dayNumber(dayKey: string): number {
  return Date.parse(`${dayKey}T00:00:00Z`) / MS_PER_DAY;
}

// Monday = 0 … Sunday = 6: Vietnamese weeks start on Monday.
export function weekdayOfDay(day: number): number {
  // Day 0 (1970-01-01) was a Thursday.
  return (day + 3) % 7;
}

// Vietnam keeps UTC+7 all year (no daylight saving).
const VN_OFFSET_MS = 7 * 3_600_000;

// A time as Vietnam local ISO text with its offset, to the second:
// `2026-10-05T20:15:03+07:00`.
export function vnIsoTime(date: Date): string {
  return `${new Date(date.getTime() + VN_OFFSET_MS).toISOString().slice(0, 19)}+07:00`;
}
