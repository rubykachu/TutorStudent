// Build-time switch that retires the service worker on every device: with
// `NEXT_PUBLIC_OFFLINE_KILL_SWITCH=1` the build writes a worker that deletes
// the offline caches and unregisters itself (`sw-kill.ts`), and the page code
// stops registering one. The runbook is in `docs/operations.md`.
//
// Kept apart from `config.ts` because that file is bundled into the worker,
// which has no `process`; this one is for the build step and the page code,
// and is written out in full so Next inlines it into the browser bundle.
export const OFFLINE_KILL_SWITCH =
  process.env.NEXT_PUBLIC_OFFLINE_KILL_SWITCH === "1";
