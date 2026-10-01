"use client";

import { Region, RegionSvg } from "@/visuals/shared/region";
import { LineAxis, lineViewBox, NamedDot } from "./line";
import {
  lineTapRegions,
  nameY,
  planLine,
  TAP_DOT_RADIUS,
  tickX,
} from "./line-logic";
import type { LineTapSpec } from "./types";

// A number line whose named points are the regions of a "tap the point"
// exercise. The numbers under the ticks are only those of `labelAt`, never the
// value of a point, so the child reads the point's place from the line.
// Outside an exercise the points are plain, non-interactive dots.

export function LineTap({ spec }: { spec: LineTapSpec }) {
  const plan = planLine({ ...spec, layers: [] }, { dotRadius: TAP_DOT_RADIUS });
  const ids = lineTapRegions(spec);
  return (
    <RegionSvg
      label={spec.label}
      viewBox={lineViewBox(plan)}
      className="h-auto w-full max-w-md"
    >
      <LineAxis geometry={spec} plan={plan}>
        {spec.points.map((point, i) => (
          <Region
            key={ids[i]}
            id={ids[i] ?? point.name}
            label={`Điểm ${point.name}`}
          >
            <NamedDot
              x={tickX(spec, point.at)}
              y={plan.axisY}
              color="amber"
              name={point.name}
              radius={TAP_DOT_RADIUS}
              nameAt={nameY(plan, TAP_DOT_RADIUS, 0)}
            />
          </Region>
        ))}
      </LineAxis>
    </RegionSvg>
  );
}
