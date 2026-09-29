import { TIMEZONE } from "@/lib/config";

let nowOverride: (() => Date) | null = null;

// Every "current time" read goes through here so tests can pin the clock.
export function now(): Date {
  return nowOverride ? nowOverride() : new Date();
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
