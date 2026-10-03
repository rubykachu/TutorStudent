import {
  type ChildDoc,
  emptyChildDoc,
  emptyHistoryDoc,
  emptyProfileDoc,
  type HistoryDoc,
  type ProfileDoc,
  type SyncAttempt,
  type SyncCard,
  type SyncSection,
  type SyncWriting,
} from "@/sync/schema";

// Seeded generators of sync docs for property tests. Values come from small
// pools so equal timestamps, equal ids and records on both sides of a reset
// show up in most generated cases.

export const FAMILY = "OWL4K7MQ";
export const CHILD = "3f9c2a7be1d04c58a6b7f0e2c4d91a35";
export const MONTH = "2026-10";

// Minute `n` of 1 October 2026 (Vietnam time, so every one is in MONTH).
export function at(n: number): string {
  return `2026-10-01T02:${String(n).padStart(2, "0")}:00.000Z`;
}

export type Rand = {
  int: (below: number) => number;
  chance: (p: number) => boolean;
  pick: <T>(items: readonly T[]) => T;
};

// mulberry32: small, fast and the same on every platform.
export function seeded(seed: number): Rand {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    int: (below) => Math.floor(next() * below),
    chance: (p) => next() < p,
    pick: (items) => items[Math.floor(next() * items.length)] as never,
  };
}

const TIME_POOL = [1, 2, 3, 4, 5, 6, 7, 8].map(at);
const LESSONS = ["l-one", "l-two"] as const;
const CARDS = ["l-one.card.a", "l-one.card.b", "l-two.card.a"] as const;
const SECTIONS = ["l-one.section.a", "l-one.section.b", "l-two.section.a"];
const DAYS = ["2026-09-30", "2026-10-01", "2026-10-02"];
const MONTHS = ["2026-09", "2026-10"];
const PHASES = ["blocks", "check", "practice", "recap"] as const;

const lessonOf = (id: string) => id.split(".")[0] as string;

export type ChildGenOptions = {
  // true: the doc keeps no record a reset of its own already dropped, like a
  // doc written by the app; false: records may lie on both sides of a reset.
  settled: boolean;
};

export function genChildDoc(
  rand: Rand,
  { settled }: ChildGenOptions,
): ChildDoc {
  const doc = emptyChildDoc(FAMILY, CHILD);
  for (const lesson of LESSONS) {
    if (rand.chance(0.5)) doc.resets[lesson] = rand.pick(TIME_POOL);
  }
  const alive = (lesson: string, time: string) =>
    !settled || doc.resets[lesson] === undefined || time > doc.resets[lesson];

  for (const cardId of CARDS) {
    if (!rand.chance(0.7)) continue;
    const lessonId = lessonOf(cardId);
    const lastReviewAt = rand.pick(TIME_POOL);
    if (!alive(lessonId, lastReviewAt)) continue;
    const card: SyncCard = {
      cardId,
      lessonId,
      due: rand.pick(TIME_POOL),
      stability: rand.pick([1, 2.5, 4]),
      difficulty: rand.pick([3, 5]),
      scheduledDays: rand.int(5),
      learningSteps: 0,
      reps: 1 + rand.int(3),
      lapses: rand.int(2),
      state: 2,
      lastReviewAt,
    };
    doc.cards.push(card);
  }

  for (const sectionId of SECTIONS) {
    if (!rand.chance(0.7)) continue;
    const lessonId = lessonOf(sectionId);
    let doneAt: string | null = rand.chance(0.5) ? rand.pick(TIME_POOL) : null;
    let updatedAt = rand.pick(TIME_POOL);
    // The app never saves a position before the completion it follows.
    if (doneAt !== null && updatedAt < doneAt) updatedAt = doneAt;
    if (!alive(lessonId, updatedAt)) continue;
    if (doneAt !== null && !alive(lessonId, doneAt)) doneAt = null;
    const section: SyncSection = {
      sectionId,
      lessonId,
      doneAt,
      position:
        doneAt !== null && updatedAt === doneAt
          ? { phase: "blocks", index: 0 }
          : { phase: rand.pick(PHASES), index: rand.int(4) },
      updatedAt,
    };
    doc.sections.push(section);
  }

  for (const lessonId of LESSONS) {
    if (rand.chance(0.5)) {
      doc.stickers.push({ lessonId, at: rand.pick(TIME_POOL) });
    }
    const seenAt = rand.pick(TIME_POOL);
    if (rand.chance(0.5) && alive(lessonId, seenAt)) {
      doc.overviewSeen[lessonId] = seenAt;
    }
  }
  doc.activityDays = DAYS.filter(() => rand.chance(0.5));
  doc.historyMonths = MONTHS.filter(() => rand.chance(0.5));
  return doc;
}

const ATTEMPT_IDS = ["a1", "a2", "a3", "a4", "a5", "a6"];
const WRITING_IDS = ["w1", "w2", "w3"];

// A record's content is fixed by its id, as in real life (records are
// immutable), except through `conflicting`.
function attemptFor(id: string, rand?: Rand): SyncAttempt {
  const n = Number(id.slice(1));
  return {
    id,
    exerciseId: `${LESSONS[n % 2]}.ex.q${n}`,
    lessonId: LESSONS[n % 2] as string,
    cardIds: [`${LESSONS[n % 2]}.card.a`],
    firstTryCorrect: n % 2 === 0,
    wrongCount: rand ? rand.int(3) : n % 3,
    at: at(1 + (n % TIME_POOL.length) + 1),
    context: "practice",
  };
}

function writingFor(id: string): SyncWriting {
  const n = Number(id.slice(1));
  return {
    id,
    exerciseId: `${LESSONS[n % 2]}.ex.viet`,
    text: `bài viết ${n}`,
    checks: [{ criterion: "mở bài", met: n % 2 === 0 }],
    at: at(2 + n),
  };
}

export function genHistoryDoc(
  rand: Rand,
  { conflicting = false }: { conflicting?: boolean } = {},
): HistoryDoc {
  const doc = emptyHistoryDoc(FAMILY, CHILD, MONTH);
  for (const id of ATTEMPT_IDS) {
    if (rand.chance(0.6)) {
      doc.attempts.push(attemptFor(id, conflicting ? rand : undefined));
    }
  }
  for (const id of WRITING_IDS) {
    if (rand.chance(0.6)) doc.writings.push(writingFor(id));
  }
  return doc;
}

export function genResets(rand: Rand): Record<string, string> {
  const resets: Record<string, string> = {};
  for (const lesson of LESSONS) {
    if (rand.chance(0.6)) resets[lesson] = rand.pick(TIME_POOL);
  }
  return resets;
}

const PROFILE_IDS = ["a".repeat(32), "b".repeat(32), "c".repeat(32)];

export function genProfileDoc(rand: Rand): ProfileDoc {
  const doc = emptyProfileDoc(FAMILY);
  for (const id of PROFILE_IDS) {
    if (!rand.chance(0.7)) continue;
    doc.profiles.push({
      id,
      name: rand.pick(["Na", "Bống", "Tí"]),
      avatar: rand.pick(["owl", "cat"]),
      grade: 6,
      series: { math: rand.pick(["kntt", "ctst"]) },
      createdAt: at(1),
      updatedAt: rand.pick(TIME_POOL),
    });
  }
  return doc;
}
