"use client";

import { useCallback, useSyncExternalStore } from "react";

// The one answer to "is the network there for media?", shared by every media
// player (video, narration, songs, the video preload). A device is offline
// when the browser says so (`navigator.onLine` false) or when a media
// download just failed with a network error (a `TypeError` from `fetch`),
// which is how wifi without internet shows: `onLine` stays true and `online`
// never fires. The failure is forgotten on the `online` event, when the page
// becomes visible again, on a tap of the offline state (`recheck`) and when a
// download succeeds.

let failed = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

// A network error, as opposed to an HTTP status or an abort.
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

export function reportMediaNetworkFailure(): void {
  if (failed) return;
  failed = true;
  emit();
}

export function clearMediaNetworkFailure(): void {
  if (!failed) return;
  failed = false;
  emit();
}

// Back online (also when no download had failed): readers recompute from
// `navigator.onLine`.
function onOnline() {
  failed = false;
  emit();
}

function onVisibility() {
  if (document.visibilityState === "visible") clearMediaNetworkFailure();
  else emit();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", emit);
    document.addEventListener("visibilitychange", onVisibility);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", emit);
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

const isOffline = () => failed || !navigator.onLine;

export function useNetworkStatus(): {
  offline: boolean;
  // The child tapped the offline state: forget the failure so the player may
  // try again (the browser's own `onLine` still counts).
  recheck: () => void;
} {
  const offline = useSyncExternalStore(subscribe, isOffline, () => false);
  const recheck = useCallback(() => clearMediaNetworkFailure(), []);
  return { offline, recheck };
}

export function resetNetworkStatusForTesting(): void {
  failed = false;
  listeners.clear();
}
