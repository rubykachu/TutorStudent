"use client";

import { ConceptShape } from "@/visuals/shared/concept-mark";
import { LineAxis, lineViewBox } from "@/visuals/shared/number-line";
import {
  DOT_RADIUS,
  type LineRange,
  NAME_RISE,
  planLine,
  TEXT_SIZE,
  tickX,
} from "@/visuals/shared/number-line-geometry";
import { Region, RegionSvg } from "@/visuals/shared/region";
import type { TapPoint } from "./logic";

// A number line whose named points are tappable regions, for "chạm vào điểm
// biểu diễn số …". Region ids are the lower-case names; every point is drawn
// the same way, so nothing but its position tells which one is right.

export type LineTapSpec = LineRange & {
  label: string;
  points: readonly TapPoint[];
  // Ticks that carry their number; every tick when absent.
  labelAt?: readonly number[];
};

const POINT_COLOR = "amber";

export function LineTap({ spec }: { spec: LineTapSpec }) {
  const plan = planLine({ names: true, arrowRows: 0, zoneTags: false });
  return (
    <RegionSvg
      label={spec.label}
      viewBox={lineViewBox(plan)}
      className="h-auto w-full max-w-md"
    >
      <LineAxis range={spec} plan={plan} labelAt={spec.labelAt}>
        {spec.points.map((point) => {
          const x = tickX(spec, point.at);
          return (
            <Region
              key={point.name}
              id={point.name.toLocaleLowerCase("vi")}
              label={`Điểm ${point.name}`}
            >
              <ConceptShape
                color={POINT_COLOR}
                cx={x}
                cy={plan.axisY}
                r={DOT_RADIUS}
              />
              <text
                x={x}
                y={plan.axisY - DOT_RADIUS - NAME_RISE / 2 - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={TEXT_SIZE}
                stroke="none"
                className="fill-foreground font-bold font-heading"
              >
                {point.name}
              </text>
            </Region>
          );
        })}
      </LineAxis>
    </RegionSvg>
  );
}
