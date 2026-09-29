"use client";

import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";

const MAX_DOTS = 10;

export default function DotCounter({ onStateChange }: VisualProps) {
  const [count, setCount] = useState(0);

  function update(next: number) {
    setCount(next);
    onStateChange?.({ count: next });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="flex min-h-touch flex-wrap gap-2" aria-live="polite">
        <span className="sr-only">{`${count} chấm`}</span>
        {Array.from({ length: count }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: dots are only added or removed at the end
            key={i}
            aria-hidden="true"
            className="size-8 rounded-full bg-concept-amber"
          />
        ))}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          className="min-h-touch min-w-touch rounded-lg border border-border px-4"
          disabled={count === 0}
          onClick={() => update(count - 1)}
        >
          Bớt một chấm
        </button>
        <button
          type="button"
          className="min-h-touch min-w-touch rounded-lg border border-border px-4"
          disabled={count === MAX_DOTS}
          onClick={() => update(count + 1)}
        >
          Thêm một chấm
        </button>
      </div>
    </div>
  );
}
