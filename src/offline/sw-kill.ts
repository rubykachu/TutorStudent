/// <reference lib="webworker" />
import { retireWorker } from "./kill-switch";

// The worker written to `public/sw.js` instead of `sw.ts` when the kill
// switch is on: it replaces whatever worker a device runs (the browser
// fetches this path on every launch), takes over at once and retires.
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  void self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    retireWorker({
      caches: self.caches,
      unregister: () => self.registration.unregister(),
    }),
  );
});
