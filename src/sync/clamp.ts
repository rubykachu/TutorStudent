import { vnDayKey } from "@/lib/time";
import type {
  ChildDoc,
  DocKind,
  DocOf,
  HistoryDoc,
  ProfileDoc,
} from "./schema";

// The server keeps no time that lies in its own future: a device whose clock
// runs ahead would otherwise win every later merge ("the later time wins")
// and keep re-sending its copy. Any time more than `limit` after now is
// replaced with `serverNow`, and an activity day after the day of `limit`
// with the day of `serverNow`. A card's `due` is a schedule, not a moment that
// happened, so it is the one time left alone.

export type Clamped<T> = { doc: T; changed: boolean };

function clamper(limit: string, serverNow: string) {
  let changed = false;
  const mark = () => {
    changed = true;
  };
  const time = (value: string): string => {
    if (value <= limit) return value;
    mark();
    return serverNow;
  };
  return { time, mark, changed: () => changed };
}

export function clampFutureTimes<K extends DocKind>(
  kind: K,
  doc: DocOf[K],
  limit: string,
  serverNow: string,
): Clamped<DocOf[K]> {
  const clamp = clamper(limit, serverNow);
  const lastDay = vnDayKey(new Date(limit));
  const today = vnDayKey(new Date(serverNow));
  const days = (list: string[]) => {
    if (list.every((day) => day <= lastDay)) return list;
    clamp.mark();
    return [...new Set(list.map((day) => (day <= lastDay ? day : today)))];
  };
  const times = (map: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(map).map(([key, value]) => [key, clamp.time(value)]),
    );
  let result: unknown;
  switch (kind) {
    case "profile": {
      const d = doc as ProfileDoc;
      result = {
        ...d,
        profiles: d.profiles.map((p) => ({
          ...p,
          createdAt: clamp.time(p.createdAt),
          updatedAt: clamp.time(p.updatedAt),
        })),
      };
      break;
    }
    case "child": {
      const d = doc as ChildDoc;
      result = {
        ...d,
        cards: d.cards.map((c) => ({
          ...c,
          lastReviewAt: clamp.time(c.lastReviewAt),
        })),
        sections: d.sections.map((s) => ({
          ...s,
          doneAt: s.doneAt === null ? null : clamp.time(s.doneAt),
          updatedAt: clamp.time(s.updatedAt),
        })),
        stickers: d.stickers.map((s) => ({ ...s, at: clamp.time(s.at) })),
        activityDays: days(d.activityDays),
        overviewSeen: times(d.overviewSeen),
        resets: times(d.resets),
      };
      break;
    }
    case "history": {
      const d = doc as HistoryDoc;
      result = {
        ...d,
        attempts: d.attempts.map((a) => ({ ...a, at: clamp.time(a.at) })),
        writings: d.writings.map((w) => ({ ...w, at: clamp.time(w.at) })),
      };
      break;
    }
    default:
      throw new Error(`Unknown doc kind: ${String(kind)}`);
  }
  return { doc: result as DocOf[K], changed: clamp.changed() };
}
