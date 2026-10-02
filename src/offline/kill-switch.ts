import { CACHE_PREFIX } from "./config";

// What the retiring worker does once it takes over from a worker that has to
// go: delete the offline caches, then unregister, so the app runs with no
// worker at all, as before offline support. It never reloads the open pages:
// the page code stops registering in the same build, so nothing would
// register it again, and a reload would interrupt a lesson for no gain.
// Progress lives in IndexedDB, which this never touches.
export async function retireWorker({
  caches,
  unregister,
}: {
  caches: CacheStorage;
  unregister: () => Promise<boolean>;
}): Promise<void> {
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((n) => n.startsWith(CACHE_PREFIX))
      .map((n) => caches.delete(n)),
  );
  await unregister();
}
