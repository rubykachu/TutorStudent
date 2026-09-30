"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

// CSS variable holding the bar's current height on <html>. globals.css turns
// it into the document's scroll-padding, so anything scrolled into view (a
// feedback visual, a focused field) stops above the bar instead of under it.
export const BOTTOM_BAR_HEIGHT_VAR = "--bottom-bar-height";

// Holds the main "Tiếp" / "Kiểm tra" action in the thumb zone: pushed to the
// bottom of a flex-column screen and kept on screen while long content
// scrolls. Being sticky, it keeps its own place in the flow, so at the end of
// the page it never covers the last content; `bar-surface` paints a
// full-width background with a hairline top edge so content passing under
// it reads as going beneath.
export function BottomBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const root = document.documentElement;
    // A bar hidden with its screen (an exercise kept in progress while the
    // child looks back at an earlier screen) leaves the height to the bar on
    // show.
    const publish = () => {
      if (bar.closest("[hidden]")) return;
      root.style.setProperty(
        BOTTOM_BAR_HEIGHT_VAR,
        `${bar.getBoundingClientRect().height}px`,
      );
    };
    publish();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(publish);
    observer?.observe(bar);
    return () => {
      observer?.disconnect();
      root.style.removeProperty(BOTTOM_BAR_HEIGHT_VAR);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-bottom-bar
      className="bar-surface sticky bottom-0 z-10 mt-auto flex w-full flex-col self-stretch gap-3 bg-background pt-4 pb-4 md:pb-6"
    >
      {children}
    </div>
  );
}
