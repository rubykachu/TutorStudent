"use client";

import { DotGrid } from "@/visuals/shared/dot-grid";
import { StepPlayer } from "@/visuals/shared/step-player";

const ROWS = 2;
const COLUMNS = 3;

// Counts the grid row by row: first row lit, then both rows.
const STEPS = [
  { highlighted: [], label: "Hai hàng, mỗi hàng ba chấm" },
  { highlighted: [0, 1, 2], label: "Hàng thứ nhất có ba chấm" },
  { highlighted: [0, 1, 2, 3, 4, 5], label: "Hai hàng có tất cả sáu chấm" },
] as const;

export default function DotGridVisual() {
  return (
    <StepPlayer steps={STEPS.length} label="Đếm chấm theo hàng">
      {(step) => (
        <DotGrid
          rows={ROWS}
          columns={COLUMNS}
          label={STEPS[step]?.label ?? ""}
          highlighted={STEPS[step]?.highlighted}
        />
      )}
    </StepPlayer>
  );
}
