import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import type { GapsSpec } from "./catalog";
import { digitsOf } from "./logic";

// Digit tiles in a row, with an arrow under each gap between and around them:
// the arrows are what the child taps, so the chosen ring never covers a digit.
const TILE = { w: 34, h: 56, gap: 44, pad: 8 } as const;
const ARROW = { half: 15, height: 22, drop: 8 } as const;

function gapLabel(k: number, digits: readonly number[]): string {
  if (k === 0) return `Chỗ trước chữ số ${digits[0]}`;
  if (k === digits.length) return `Chỗ sau chữ số ${digits[k - 1]} ở cuối`;
  return `Chỗ giữa chữ số ${digits[k - 1]} và chữ số ${digits[k]}`;
}

// A number whose digits have a gap before, between and after them: the child
// taps the arrow of the gap where the extra digit goes. The exercise's answer
// region decides what is right.
export function Gaps({ spec }: { spec: GapsSpec }) {
  const digits = digitsOf(Number(spec.digits));
  const count = digits.length;
  const step = TILE.w + TILE.gap;
  const width = TILE.pad * 2 + count * step + TILE.gap;
  const tileTop = TILE.pad;
  const arrowTop = tileTop + TILE.h + ARROW.drop;
  const height = arrowTop + ARROW.height + TILE.pad;
  const gapIds = Array.from({ length: count + 1 }, (_, k) => `g${k}`);
  // Gap k is the space left of digit k, digit k starts right after it.
  const digitLeft = (i: number) => TILE.pad + TILE.gap + i * step;
  const gapCentre = (k: number) => TILE.pad + k * step + TILE.gap / 2;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="flex items-center gap-2 text-body font-semibold">
        Chữ số viết thêm:
        <span
          aria-hidden
          className="flex h-11 w-9 items-center justify-center rounded-lg border-2 border-concept-sky bg-concept-sky/15 font-heading text-block font-bold text-concept-sky"
        >
          {spec.add}
        </span>
        <span className="sr-only">{spec.add}</span>
      </p>
      <RegionSvg
        label={`Số ${spec.digits}: chạm vào mũi tên để viết thêm chữ số ${spec.add}`}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full max-w-md"
      >
        {digits.map((digit, i) => (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
            key={`t${i}`}
            aria-hidden
            {...decorative}
          >
            <rect
              x={digitLeft(i)}
              y={tileTop}
              width={TILE.w}
              height={TILE.h}
              rx={8}
              className="fill-concept-blue/15"
            />
            <text
              x={digitLeft(i) + TILE.w / 2}
              y={tileTop + TILE.h / 2 + 10}
              textAnchor="middle"
              fontSize={30}
              fontWeight={700}
              className="fill-concept-blue font-heading"
            >
              {digit}
            </text>
          </g>
        ))}
        {gapIds.map((gapId, k) => {
          const cx = gapCentre(k);
          return (
            <Region key={gapId} id={gapId} label={gapLabel(k, digits)}>
              <polygon
                points={`${cx},${arrowTop} ${cx + ARROW.half},${arrowTop + ARROW.height} ${cx - ARROW.half},${arrowTop + ARROW.height}`}
                className="fill-muted-foreground"
              />
            </Region>
          );
        })}
      </RegionSvg>
    </div>
  );
}
