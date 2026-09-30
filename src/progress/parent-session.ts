import { PARENT_SESSION_MINUTES } from "@/lib/config";

// Whether the parent page is open after a correct PIN. Kept in memory only:
// a reload, a closed tab or PARENT_SESSION_MINUTES after the PIN, whichever
// comes first, asks for the PIN again. Nothing about the session is stored,
// so a child picking up the device later cannot find it still open.

const MS_PER_MINUTE = 60_000;

let unlockedUntil: number | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function openParentSession(now: Date): void {
  unlockedUntil = now.getTime() + PARENT_SESSION_MINUTES * MS_PER_MINUTE;
  notify();
}

export function closeParentSession(): void {
  unlockedUntil = null;
  notify();
}

// Milliseconds the session stays open, or 0 when it is closed or expired.
export function parentSessionRemainingMs(now: Date): number {
  return unlockedUntil === null
    ? 0
    : Math.max(0, unlockedUntil - now.getTime());
}

export function subscribeParentSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The raw expiry, as a stable snapshot for `useSyncExternalStore`.
export function parentSessionSnapshot(): number | null {
  return unlockedUntil;
}
