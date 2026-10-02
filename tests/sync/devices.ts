import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  localScope,
  type ProfileRecord,
  putProfile,
  TutorDb,
} from "@/progress/db";
import { recordAttempt } from "@/progress/record";
import { createSyncApi } from "@/sync/client";
import type { CycleDeps } from "@/sync/cycle";
import { CHILD } from "../api/sync-helpers";
import type { Network } from "./network";

// Devices for sync tests: a Dexie database each, talking through a fake
// network.

let counter = 0;

export function openDevice(): TutorDb {
  counter += 1;
  return new TutorDb(`tutor-sync-device-${counter}`);
}

export async function closeDevices(devices: readonly TutorDb[]) {
  for (const db of devices) {
    db.close();
    await db.delete();
  }
}

export const scope = localScope(CHILD);

export const PROFILE_TIME = "2026-09-01T00:00:00.000Z";

export function profile(id = CHILD, name = "Na"): ProfileRecord {
  return {
    id,
    familyId: LOCAL_FAMILY_ID,
    name,
    avatar: "owl",
    grade: 6,
    series: {},
    createdAt: PROFILE_TIME,
    updatedAt: PROFILE_TIME,
  };
}

export async function addProfile(db: TutorDb, id = CHILD, name = "Na") {
  await putProfile(db, profile(id, name));
}

// Minute `n` of 2 October 2026, Vietnam time: before the fake server's clock
// (10:00 on that day).
export function at(n: number, month = "2026-10"): Date {
  return new Date(
    month === "2026-10"
      ? `2026-10-02T02:${String(n).padStart(2, "0")}:00.000Z`
      : `${month}-15T02:${String(n).padStart(2, "0")}:00.000Z`,
  );
}

export async function answer(
  db: TutorDb,
  when: Date,
  options: {
    lessonId?: string;
    card?: string;
    context?: "practice" | "check";
  } = {},
) {
  const lessonId = options.lessonId ?? "l-one";
  return recordAttempt(
    db,
    {
      ...scope,
      lessonId,
      exerciseId: `${lessonId}.ex.a`,
      cardIds: [options.card ?? `${lessonId}.card.a`],
      firstTryCorrect: true,
      wrongCount: 0,
      context: options.context ?? "practice",
    },
    when,
  );
}

export function cycleDeps(
  net: Network,
  overrides: Partial<CycleDeps> = {},
): CycleDeps & { waits: number[] } {
  const waits: number[] = [];
  return {
    api: createSyncApi(net.fetch),
    family: { id: null },
    onServerTime: () => undefined,
    sleep: async (ms) => {
      waits.push(ms);
    },
    random: () => 0.5,
    ...overrides,
    waits,
  };
}
