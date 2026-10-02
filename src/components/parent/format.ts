import { TIMEZONE } from "@/lib/config";

// Dates and times on the parent page, always in Vietnam time.

const clock = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const dateTime = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TIMEZONE,
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// e.g. "14:05".
export function formatClock(date: Date): string {
  return clock.format(date);
}

// e.g. "14:05 30/9/2026".
export function formatDateTime(date: Date): string {
  return dateTime.format(date);
}

// A day key (yyyy-mm-dd) as "30/9".
export function formatDayKey(day: string): string {
  const [, month, date] = day.split("-");
  return `${Number(date)}/${Number(month)}`;
}

// A month key (yyyy-mm) as "9/2026".
export function formatMonthKey(month: string): string {
  const [year, mon] = month.split("-");
  return `${Number(mon)}/${year}`;
}

// Monday = 0 … Sunday = 6, as `weekdayOfDay` counts.
export const WEEKDAY_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const WEEKDAY_LONG = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
];
