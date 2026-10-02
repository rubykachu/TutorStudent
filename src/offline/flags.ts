// Build-time switches of the service worker, read by the build step that
// writes `public/sw.js` and by the page code that registers it. One place, so
// the page and the worker script can never disagree.
//
// - `NEXT_PUBLIC_OFFLINE_ENABLED=1` turns offline support on. Unset (the
//   default) the page never registers a worker, unregisters any it finds, and
//   the build writes the worker that retires installed workers (`sw-kill.ts`)
//   instead of the precaching one, so a device that ran an earlier build with
//   offline on is cleaned up too. Only the offline lab and its E2E set it;
//   production turns it on in Vercel (`docs/operations.md`, "Bật offline").
// - `NEXT_PUBLIC_OFFLINE_KILL_SWITCH=1` retires the worker on every device
//   even when offline support is on: the emergency switch of
//   `docs/operations.md`, "Gỡ service worker lỗi".
//
// Kept apart from `config.ts` because that file is bundled into the worker,
// which has no `process`. Each variable is written out in full so Next
// inlines it into the browser bundle; functions, so tests can change the
// environment between cases.

export function offlineEnabled(): boolean {
  return process.env.NEXT_PUBLIC_OFFLINE_ENABLED === "1";
}

export function offlineKillSwitch(): boolean {
  return process.env.NEXT_PUBLIC_OFFLINE_KILL_SWITCH === "1";
}

// Whether this build runs the precaching worker. When false, the build's
// `/sw.js` is the retiring worker and the page registers nothing.
export function offlineWorkerOn(): boolean {
  return offlineEnabled() && !offlineKillSwitch();
}
