import { Region, RegionSvg } from "@/visuals/shared/region";
import type { ClockSpec } from "./catalog";
import { toRoman } from "./logic";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const CENTER = 100;
const NUMERAL_RADIUS = 74;

// Where the numeral (or hand) of an hour sits: 12 at the top, clockwise.
function polar(hour: number, radius: number): { x: number; y: number } {
  const angle = (hour / 12) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

// A wall clock with Roman numerals I–XII, the hour hand on `hour`.
export function Clock({ spec }: { spec: ClockSpec }) {
  const hand = polar(spec.hour, 46);
  const minute = polar(12, 66);
  return (
    <svg
      role="img"
      aria-label={`Đồng hồ treo tường ghi giờ bằng số La Mã, kim giờ chỉ ${spec.hour} giờ`}
      viewBox="0 0 200 200"
      className="h-auto w-full max-w-xs"
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={96}
        className="fill-surface stroke-foreground"
        strokeWidth={4}
      />
      {HOURS.map((hour) => {
        const { x, y } = polar(hour, NUMERAL_RADIUS);
        return (
          <text
            key={hour}
            x={x}
            y={y + 7}
            textAnchor="middle"
            fontSize={21}
            fontWeight={700}
            className="fill-foreground font-heading"
          >
            {toRoman(hour)}
          </text>
        );
      })}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minute.x}
        y2={minute.y}
        className="stroke-muted-foreground"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hand.x}
        y2={hand.y}
        className="stroke-concept-sky"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <circle cx={CENTER} cy={CENTER} r={6} className="fill-foreground" />
    </svg>
  );
}

// The same clock face without hands, every numeral a button.
export function ClockPick() {
  return (
    <RegionSvg
      label="Đồng hồ có các số La Mã từ I đến XII: chạm vào một số"
      viewBox="0 0 200 200"
      className="h-auto w-full max-w-xs"
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={96}
        className="fill-surface stroke-foreground"
        strokeWidth={4}
      />
      {HOURS.map((hour) => {
        const { x, y } = polar(hour, NUMERAL_RADIUS);
        return (
          <Region
            key={hour}
            id={`h${hour}`}
            label={`Số La Mã ${toRoman(hour)}`}
          >
            <circle cx={x} cy={y} r={15} className="fill-muted" />
            <text
              x={x}
              y={y + 7}
              textAnchor="middle"
              fontSize={21}
              fontWeight={700}
              className="fill-foreground font-heading"
            >
              {toRoman(hour)}
            </text>
          </Region>
        );
      })}
    </RegionSvg>
  );
}
