import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useSyncExternalStore } from "react";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { newId } from "@/lib/id";
import { now } from "@/lib/time";
import {
  ACTIVE_PROFILE_KEY,
  type AttemptRecord,
  type ChildScope,
  DEVICE_SCOPE,
  getSetting,
  listAttempts,
  listProfiles,
  listSectionProgress,
  listStickers,
  type ProfileRecord,
  putProfile,
  type SectionProgressRecord,
  type StickerRecord,
  setSetting,
  TutorDb,
} from "@/progress/db";
import {
  type ContentIndex,
  ContentIndexSchema,
  type Subject,
} from "@/schema/content";

// React bindings for the local progress store and the static content index.
// Progress lives on this device only, so every query uses LOCAL_FAMILY_ID.

let appDbInstance: TutorDb | null = null;

// Created on first use so importing this module during server rendering never
// touches IndexedDB, which only exists in the browser.
export function appDb(): TutorDb {
  appDbInstance ??= new TutorDb();
  return appDbInstance;
}

export function resetAppDbForTesting(): void {
  appDbInstance = null;
}

function childScope(childId: string): ChildScope {
  return { familyId: LOCAL_FAMILY_ID, childId };
}

// `undefined` while the first read is in flight.
export function useProfiles(): ProfileRecord[] | undefined {
  return useLiveQuery(() => listProfiles(appDb(), LOCAL_FAMILY_ID), []);
}

// The active child is a device setting in Dexie rather than localStorage: it
// then shares the storage partition, reactivity and reset path of the profiles
// it points to, so the two can never disagree after data is cleared.
export async function readActiveProfile(
  db: TutorDb,
): Promise<ProfileRecord | null> {
  const id = await getSetting(db, DEVICE_SCOPE, ACTIVE_PROFILE_KEY);
  if (typeof id !== "string") return null;
  const profile = await db.profiles.get(id);
  return profile?.familyId === LOCAL_FAMILY_ID ? profile : null;
}

export type ActiveProfileState =
  | { status: "loading" }
  | { status: "none" }
  | { status: "ready"; profile: ProfileRecord };

export function useActiveProfile(): ActiveProfileState {
  const profile = useLiveQuery(() => readActiveProfile(appDb()), []);
  if (profile === undefined) return { status: "loading" };
  if (profile === null) return { status: "none" };
  return { status: "ready", profile };
}

export async function setActiveProfile(id: string | null): Promise<void> {
  await setSetting(appDb(), DEVICE_SCOPE, ACTIVE_PROFILE_KEY, id);
}

export type NewProfile = { name: string; avatar: string };

// A new child starts on each subject's default series; there is no series
// picker until some subject offers more than one.
export function buildProfile(
  input: NewProfile,
  subjects: readonly Subject[],
  createdAt: Date,
): ProfileRecord {
  return {
    id: newId(),
    familyId: LOCAL_FAMILY_ID,
    name: input.name.trim(),
    avatar: input.avatar,
    series: Object.fromEntries(subjects.map((s) => [s.id, s.defaultSeries])),
    createdAt: createdAt.toISOString(),
  };
}

// Saves the profile and makes it the active child in one step, so the home
// screen never sees a new profile that is not selected yet.
export async function createProfile(
  input: NewProfile,
  subjects: readonly Subject[],
): Promise<ProfileRecord> {
  const db = appDb();
  const profile = buildProfile(input, subjects, now());
  await db.transaction("rw", db.profiles, db.settings, async () => {
    await putProfile(db, profile);
    await setSetting(db, DEVICE_SCOPE, ACTIVE_PROFILE_KEY, profile.id);
  });
  return profile;
}

export type ChildProgress = {
  attempts: AttemptRecord[];
  sections: SectionProgressRecord[];
  stickers: StickerRecord[];
};

export async function readChildProgress(
  db: TutorDb,
  childId: string,
): Promise<ChildProgress> {
  const scope = childScope(childId);
  const [attempts, sections, stickers] = await Promise.all([
    listAttempts(db, scope),
    listSectionProgress(db, scope),
    listStickers(db, scope),
  ]);
  return { attempts, sections, stickers };
}

export function useChildProgress(childId: string): ChildProgress | undefined {
  return useLiveQuery(() => readChildProgress(appDb(), childId), [childId]);
}

// ---------------------------------------------------------------------------
// Content index

export const CONTENT_INDEX_URL = "/content/index.json";

export type ContentIndexState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; index: ContentIndex };

// The index only changes with a new build, so one fetch per page load is
// shared by every screen through this module-level store.
let indexState: ContentIndexState = { status: "loading" };
let indexRequested = false;
const indexListeners = new Set<() => void>();

function setIndexState(next: ContentIndexState): void {
  indexState = next;
  for (const listener of indexListeners) listener();
}

async function fetchContentIndex(): Promise<ContentIndex> {
  const response = await fetch(CONTENT_INDEX_URL);
  if (!response.ok) {
    throw new Error(`${CONTENT_INDEX_URL} returned ${response.status}`);
  }
  return ContentIndexSchema.parse(await response.json());
}

// Starts the fetch unless one is running or already succeeded; after an error
// calling it again retries.
export function requestContentIndex(): void {
  if (indexRequested) return;
  indexRequested = true;
  setIndexState({ status: "loading" });
  fetchContentIndex().then(
    (index) => setIndexState({ status: "ready", index }),
    () => {
      indexRequested = false;
      setIndexState({ status: "error" });
    },
  );
}

export function resetContentIndexForTesting(): void {
  indexState = { status: "loading" };
  indexRequested = false;
  indexListeners.clear();
}

function subscribeContentIndex(listener: () => void): () => void {
  indexListeners.add(listener);
  return () => indexListeners.delete(listener);
}

const SERVER_INDEX_STATE: ContentIndexState = { status: "loading" };

export function useContentIndex(): ContentIndexState {
  useEffect(requestContentIndex, []);
  return useSyncExternalStore(
    subscribeContentIndex,
    () => indexState,
    () => SERVER_INDEX_STATE,
  );
}
