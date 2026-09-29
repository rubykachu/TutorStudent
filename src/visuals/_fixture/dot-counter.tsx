"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { DotGrid } from "@/visuals/shared/dot-grid";

// A ten frame: two rows of five slots, filled as the child adds dots.
const ROWS = 2;
const COLUMNS = 5;
const MAX_DOTS = ROWS * COLUMNS;
const BUTTON =
  "inline-flex min-h-touch min-w-touch items-center gap-2 rounded-lg border-2 border-border bg-surface px-4 font-semibold disabled:opacity-50";

export default function DotCounter({ onStateChange }: VisualProps) {
  const [count, setCount] = useState(0);

  function update(next: number) {
    setCount(next);
    onStateChange?.({ count: next });
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full justify-center" aria-live="polite">
        <DotGrid
          rows={ROWS}
          columns={COLUMNS}
          filled={count}
          label={`${count} chấm`}
          className="h-auto w-full max-w-80"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className={BUTTON}
          aria-label="Bớt một chấm"
          disabled={count === 0}
          onClick={() => update(count - 1)}
        >
          <Minus aria-hidden className="size-5" />
          Bớt
        </button>
        <button
          type="button"
          className={BUTTON}
          aria-label="Thêm một chấm"
          disabled={count === MAX_DOTS}
          onClick={() => update(count + 1)}
        >
          <Plus aria-hidden className="size-5" />
          Thêm
        </button>
      </div>
    </div>
  );
}
