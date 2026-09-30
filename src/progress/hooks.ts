import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  CONTENT_BASE_URL,
  indexLesson,
  type LessonIndex,
  lessonContentUrl,
} from "@/content";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { newId } from "@/lib/id";
import { now } from "@/lib/time";
import {
  ACTIVE_PROFILE_KEY,
  type AttemptRecord,
  type CardStateRecord,
  type ChildScope,
  DEVICE_SCOPE,
  getCardStates,
  getSectionProgress,
  getSetting,
  listActivityDays,
  listAttempts,
  listOverviewsSeen,
  listProfiles,
  listSectionProgress,
  listStickers,
  markOverviewSeen,
  type ProfileRecord,
  putProfile,
  type SectionProgressRecord,
  SOUND_ENABLED_KEY,
  type StickerRecord,
  setSetting,
  TutorDb,
} from "@/progress/db";
import {
  type ContentIndex,
  ContentIndexSchema,
  LessonSchema,
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

export function childScope(childId: string): ChildScope {
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
  // Vietnam day keys the child studied on, oldest first.
  activityDays: string[];
  // Lessons whose overview the child has been through.
  overviewsSeen: string[];
};

export async function readChildProgress(
  db: TutorDb,
  childId: string,
): Promise<ChildProgress> {
  const scope = childScope(childId);
  const [attempts, sections, stickers, activityDays, overviewsSeen] =
    await Promise.all([
      listAttempts(db, scope),
      listSectionProgress(db, scope),
      listStickers(db, scope),
      listActivityDays(db, scope),
      listOverviewsSeen(db, scope),
    ]);
  return { attempts, sections, stickers, activityDays, overviewsSeen };
}

export function useChildProgress(childId: string): ChildProgress | undefined {
  return useLiveQuery(() => readChildProgress(appDb(), childId), [childId]);
}

// Sound is on until the child turns it off.
export async function readSoundEnabled(
  db: TutorDb,
  childId: string,
): Promise<boolean> {
  const value = await getSetting(db, childScope(childId), SOUND_ENABLED_KEY);
  return value !== false;
}

// `undefined` while the first read is in flight.
export function useSoundEnabled(childId: string): boolean | undefined {
  return useLiveQuery(() => readSoundEnabled(appDb(), childId), [childId]);
}

export async function setSoundEnabled(
  childId: string,
  enabled: boolean,
): Promise<void> {
  await setSetting(appDb(), childScope(childId), SOUND_ENABLED_KEY, enabled);
}

export type LessonProgress = {
  sections: SectionProgressRecord[];
  cardStates: CardStateRecord[];
  sticker: StickerRecord | undefined;
  // Answers given in review sessions of this lesson, oldest first.
  reviewAttempts: AttemptRecord[];
  // The child has been through the lesson's overview.
  overviewSeen: boolean;
};

export async function readLessonProgress(
  db: TutorDb,
  childId: string,
  lessonId: string,
): Promise<LessonProgress> {
  const scope = childScope(childId);
  const [sections, cardStates, sticker, attempts, seen] = await Promise.all([
    getSectionProgress(db, scope, lessonId),
    getCardStates(db, scope, lessonId),
    db.stickers.get([scope.familyId, scope.childId, lessonId]),
    db.attempts
      .where("[familyId+childId+lessonId]")
      .equals([scope.familyId, scope.childId, lessonId])
      .sortBy("at"),
    listOverviewsSeen(db, scope),
  ]);
  return {
    sections,
    cardStates,
    sticker,
    reviewAttempts: attempts.filter((a) => a.context === "review"),
    overviewSeen: seen.includes(lessonId),
  };
}

export async function setOverviewSeen(
  childId: string,
  lessonId: string,
): Promise<void> {
  await markOverviewSeen(appDb(), childScope(childId), lessonId);
}

export function useLessonProgress(
  childId: string,
  lessonId: string,
): LessonProgress | undefined {
  return useLiveQuery(
    () => readLessonProgress(appDb(), childId, lessonId),
    [childId, lessonId],
  );
}

// ---------------------------------------------------------------------------
// Content index

export const CONTENT_INDEX_URL = `${CONTENT_BASE_URL}/index.json`;

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

// ---------------------------------------------------------------------------
// Lessons

export type LessonState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; index: LessonIndex };

// Like the index, a lesson file only changes with a new build: fetched once
// per page load and shared by the lesson, section and review screens.
const LESSON_LOADING: LessonState = { status: "loading" };
const lessonStates = new Map<string, LessonState>();
const lessonListeners = new Set<() => void>();

function setLessonState(lessonId: string, next: LessonState): void {
  lessonStates.set(lessonId, next);
  for (const listener of lessonListeners) listener();
}

async function fetchLesson(lessonId: string): Promise<LessonIndex> {
  const url = lessonContentUrl(lessonId);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return indexLesson(LessonSchema.parse(await response.json()));
}

// Starts the fetch unless one is running or already succeeded; after an error
// calling it again retries.
export function requestLesson(lessonId: string): void {
  const current = lessonStates.get(lessonId);
  if (current && current.status !== "error") return;
  setLessonState(lessonId, LESSON_LOADING);
  fetchLesson(lessonId).then(
    (index) => setLessonState(lessonId, { status: "ready", index }),
    () => setLessonState(lessonId, { status: "error" }),
  );
}

export function resetLessonsForTesting(): void {
  lessonStates.clear();
  lessonListeners.clear();
}

function subscribeLessons(listener: () => void): () => void {
  lessonListeners.add(listener);
  return () => lessonListeners.delete(listener);
}

export function useLesson(lessonId: string): LessonState {
  useEffect(() => requestLesson(lessonId), [lessonId]);
  return useSyncExternalStore(
    subscribeLessons,
    () => lessonStates.get(lessonId) ?? LESSON_LOADING,
    () => LESSON_LOADING,
  );
}

// Several lessons at once (e.g. every lesson a child has progress in), each
// fetched through the same shared store as `useLesson`.
export function useLessons(
  lessonIds: readonly string[],
): ReadonlyMap<string, LessonState> {
  const key = lessonIds.join("\n");
  useEffect(() => {
    for (const id of key.split("\n")) if (id) requestLesson(id);
  }, [key]);
  // A string snapshot stays equal while nothing changes, which
  // useSyncExternalStore needs; the map is rebuilt only when it changes.
  const statuses = useSyncExternalStore(
    subscribeLessons,
    () =>
      key
        .split("\n")
        .map((id) => lessonStates.get(id)?.status ?? "loading")
        .join(","),
    () => "",
  );
  return useMemo(() => {
    // The map reads the store directly; `statuses` only signals a change.
    void statuses;
    const ids = key.split("\n").filter(Boolean);
    return new Map(
      ids.map((id) => [id, lessonStates.get(id) ?? LESSON_LOADING]),
    );
  }, [key, statuses]);
}
