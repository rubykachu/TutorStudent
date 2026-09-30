import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs without globals, so Testing Library cannot unmount on its own.
afterEach(cleanup);

// jsdom has no matchMedia; components query it for reduced motion and viewport.
// Suites that opt into the node environment (filesystem code) have no window.
if (typeof window !== "undefined") {
  // jsdom does not implement media playback and logs an error on every call;
  // the feedback sounds and the video player call these.
  Object.assign(HTMLMediaElement.prototype, {
    load: () => undefined,
    play: () => Promise.resolve(),
    pause: () => undefined,
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
