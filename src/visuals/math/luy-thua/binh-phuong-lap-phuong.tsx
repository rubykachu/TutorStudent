"use client";

import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { stateSet } from "@/visuals/shared/markers";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { PowerText } from "@/visuals/shared/power-text";
import { CubeBlocks, PICTURE, SquareTiles } from "./blocks";
import { FactorRow, MATH_LINE } from "./parts";

const SIDE = { min: 1, max: 5 } as const;
const SHAPES = [
  { exponent: 2, name: "Bình phương" },
  { exponent: 3, name: "Lập phương" },
] as const;
const START = { base: 2, exponent: 2 };

const TOGGLE =
  "inline-flex min-h-touch items-center justify-center whitespace-nowrap rounded-lg px-4 font-semibold motion-safe:transition-transform motion-safe:active:scale-97 disabled:opacity-40";

// Why a² is called "bình phương" and a³ "lập phương": the child picks a base
// and sees it as the side of a square of tiles or of a cube of small cubes.
export default function BinhPhuongLapPhuong({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [own, setOwn] = useState(START);
  const base = shownState?.base ?? own.base;
  const exponent = shownState?.exponent ?? own.exponent;
  const locked = disabled || shownState !== undefined;
  const shape = SHAPES.find((s) => s.exponent === exponent) ?? SHAPES[0];
  const count = base ** exponent;

  function update(next: { base: number; exponent: number }) {
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-3">
        {/* Radio-like pair: the pressed one is the shape on show. */}
        <fieldset className="flex flex-wrap justify-center gap-3">
          <legend className="sr-only">Chọn hình</legend>
          {SHAPES.map((s) => {
            const pressed = s.exponent === exponent;
            return (
              <button
                key={s.exponent}
                type="button"
                aria-pressed={pressed}
                {...stateSet("exponent", s.exponent)}
                disabled={locked}
                onClick={() => update({ base, exponent: s.exponent })}
                className={`${TOGGLE} ${pressed ? "border-3 border-primary bg-surface text-foreground" : "border-2 border-border bg-surface text-muted-foreground"}`}
              >
                {s.name}
              </button>
            );
          })}
        </fieldset>
        <NumberStepper
          label="Cơ số"
          stateKey="base"
          color="blue"
          value={base}
          {...SIDE}
          disabled={locked}
          onChange={(value) => update({ base: value, exponent })}
        />
      </div>
      <div
        className="flex items-center justify-center"
        style={{ height: PICTURE }}
      >
        {exponent === 2 ? (
          <SquareTiles
            side={base}
            label={`Hình vuông cạnh ${base}, có ${count} ô`}
          />
        ) : (
          <CubeBlocks
            side={base}
            label={`Hình lập phương cạnh ${base}, có ${count} khối nhỏ`}
          />
        )}
      </div>
      <p className={MATH_LINE} aria-live="polite">
        <PowerText base={base} exponent={exponent} />
        <span>=</span>
        <FactorRow base={base} count={exponent} />
        <span>=</span>
        <span>{count}</span>
      </p>
      <p className="text-body md:text-body-lg">
        {`Đọc là: “${base} ${shape.name.toLocaleLowerCase("vi")}”`}
      </p>
    </div>
  );
}
