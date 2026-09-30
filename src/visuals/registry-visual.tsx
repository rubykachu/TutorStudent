"use client";

import {
  type ComponentType,
  type LazyExoticComponent,
  lazy,
  type ReactNode,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { findVisual, type VisualProps } from "@/visuals/registry";

type LazyVisual = LazyExoticComponent<ComponentType<VisualProps>>;
type VisualComponent = ComponentType<VisualProps>;

// Visual code already fetched, drawn at once without a loading placeholder.
const loadedVisuals = new Map<string, VisualComponent>();
// One lazy component per id for the page's lifetime: creating it again on each
// render would remount the visual and restart its animation.
const lazyVisuals = new Map<string, LazyVisual>();
// Height each visual was drawn at, so its placeholder on a later screen keeps
// the same room and nothing jumps when it arrives.
const drawnHeights = new Map<string, number>();

function entryOf(id: string) {
  const entry = findVisual(id);
  // `content:check` guarantees every referenced visual is registered.
  if (!entry) throw new Error(`Visual "${id}" is not in the registry`);
  return entry;
}

function load(id: string): Promise<{ default: VisualComponent }> {
  return entryOf(id)
    .load()
    .then((module) => {
      loadedVisuals.set(id, module.default);
      return module;
    });
}

function lazyVisual(id: string): LazyVisual {
  const cached = lazyVisuals.get(id);
  if (cached) return cached;
  const component = lazy(() => load(id));
  lazyVisuals.set(id, component);
  return component;
}

// Starts fetching the code of visuals the child is about to see (the next
// screen, the hint of the exercise on screen), so they are drawn at once.
export function preloadVisuals(ids: Iterable<string>): void {
  for (const id of ids) {
    if (loadedVisuals.has(id) || !findVisual(id)) continue;
    // A failed preload is not an error yet: the visual loads again when drawn.
    load(id).catch(() => undefined);
  }
}

// Every visual id named anywhere inside a piece of content (`visualId`,
// `hintVisualId`, `solutionVisualId`, nested blocks and items included), so
// one walk finds what a block, an exercise or a recap will draw.
export function visualIdsIn(content: unknown): string[] {
  const ids: string[] = [];
  const walk = (value: unknown, key: string) => {
    if (typeof value === "string") {
      if (/visualId$/i.test(key)) ids.push(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item, key);
      return;
    }
    if (typeof value === "object" && value !== null) {
      for (const [k, v] of Object.entries(value)) walk(v, k);
    }
  };
  walk(content, "");
  return ids;
}

// Scales a visual down to its column when its narrowest layout (min-content:
// the width its drawings and unbreakable rows cannot shrink below) is wider
// than the column, e.g. a board and its zoom side by side in the narrow
// answer column of a landscape tablet. A visual that fits is left as drawn.
function FitWidth({ id, children }: { id: string; children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const fitToRoom = () => {
      const room = outer.getBoundingClientRect().width;
      inner.style.zoom = "1";
      inner.style.width = "min-content";
      const needed = inner.getBoundingClientRect().width;
      inner.style.width = "";
      const scale = room > 0 && needed > room ? room / needed : 1;
      inner.style.zoom = scale === 1 ? "" : String(scale);
      outer.toggleAttribute("data-visual-scaled", scale !== 1);
      const height = outer.getBoundingClientRect().height;
      if (height > 0) drawnHeights.set(id, height);
    };
    fitToRoom();
    if (typeof ResizeObserver === "undefined") return;
    // Width changes (rotation, a column appearing) and content changes (a
    // longer number after a tap) both change the fit.
    let last = "";
    const observer = new ResizeObserver(() => {
      const key = `${outer.clientWidth}:${inner.scrollWidth}`;
      if (key === last) return;
      last = key;
      fitToRoom();
    });
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={outerRef} className="w-full min-w-0" data-visual-fit={id}>
      <div ref={innerRef} className="w-full">
        {children}
      </div>
    </div>
  );
}

type RegistryVisualProps = VisualProps & { id: string };

// Renders a registered visual by id. Code already fetched (see
// `preloadVisuals`) is drawn at once; otherwise it loads behind a transparent
// placeholder that keeps the visual's room without a grey flash. The
// component is chosen once per id, so a visual never remounts (and restarts
// its animation or loses the child's taps) when its code arrives.
export function RegistryVisual({ id, ...props }: RegistryVisualProps) {
  const Visual = useMemo(
    (): VisualComponent => loadedVisuals.get(id) ?? lazyVisual(id),
    [id],
  );
  const height = drawnHeights.get(id);
  return (
    <Suspense
      fallback={
        <div
          aria-busy
          className={`w-full ${height === undefined ? "h-visual-frame" : ""}`}
          style={height === undefined ? undefined : { height }}
        />
      }
    >
      <FitWidth id={id}>
        <Visual {...props} />
      </FitWidth>
    </Suspense>
  );
}
