/// <reference lib="webworker" />
import {
  PRECACHE_STATUS_MESSAGE,
  SKIP_WAITING_MESSAGE,
  type WorkerBuildData,
} from "./config";
import { createCore } from "./sw-core";

// The service worker. The build step (`scripts/offline-worker.ts`) bundles it
// into `public/sw.js` with the build's precache list injected as
// `__WORKER_DATA__`.
declare const __WORKER_DATA__: WorkerBuildData;
declare const self: ServiceWorkerGlobalScope;

const core = createCore({
  ...__WORKER_DATA__,
  origin: self.location.origin,
  caches: self.caches,
  fetch: (input, init) => self.fetch(input, init),
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
});

// No `skipWaiting()` here: a new worker waits until a page asks for it (see
// the message below), so the open page never loses a chunk it still needs.
self.addEventListener("install", (event) => {
  event.waitUntil(core.install());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(core.activate().then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const response = core.respond(event.request);
  if (response) event.respondWith(response);
});

self.addEventListener("message", (event) => {
  const type = (event.data as { type?: string } | null)?.type;
  if (type === SKIP_WAITING_MESSAGE) {
    void self.skipWaiting();
  } else if (type === PRECACHE_STATUS_MESSAGE) {
    const reply = (event.ports[0] ?? event.source) as {
      postMessage(message: unknown): void;
    } | null;
    if (reply) {
      event.waitUntil(
        core.status().then((status) => reply.postMessage(status)),
      );
    }
  }
});
