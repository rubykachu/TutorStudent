import { type RefObject, useEffect, useState } from "react";

// True while at least half of the element is on screen. Without
// IntersectionObserver (an old engine, a test) it counts as on screen.
export function useMostlyInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.intersectionRatio >= 0.5);
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
