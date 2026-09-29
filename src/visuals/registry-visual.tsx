"use client";

import {
  type ComponentType,
  type LazyExoticComponent,
  lazy,
  Suspense,
} from "react";
import { findVisual, type VisualProps } from "@/visuals/registry";

type LazyVisual = LazyExoticComponent<ComponentType<VisualProps>>;

// One lazy component per id for the page's lifetime: creating it again on each
// render would remount the visual and restart its animation.
const lazyVisuals = new Map<string, LazyVisual>();

function lazyVisual(id: string): LazyVisual {
  const cached = lazyVisuals.get(id);
  if (cached) return cached;
  const entry = findVisual(id);
  // `content:check` guarantees every referenced visual is registered.
  if (!entry) throw new Error(`Visual "${id}" is not in the registry`);
  const component = lazy(entry.load);
  lazyVisuals.set(id, component);
  return component;
}

type RegistryVisualProps = VisualProps & { id: string };

// Renders a registered visual by id, loading its code on first use.
export function RegistryVisual({ id, ...props }: RegistryVisualProps) {
  const Visual = lazyVisual(id);
  return (
    <Suspense
      fallback={
        <div aria-busy className="h-visual-frame w-full rounded-lg bg-muted" />
      }
    >
      <Visual {...props} />
    </Suspense>
  );
}
