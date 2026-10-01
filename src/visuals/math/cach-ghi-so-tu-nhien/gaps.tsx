import { Region, RegionSvg } from "@/visuals/shared/region";
import type { GapsSpec } from "./catalog";
import { digitsOf } from "./logic";

const TILE = { w: 40, h: 56, gap: 32, pad: 6 } as const;

function gapLabel(k: number, digits: readonly number[]): string {
  if (k === 0) return `Chỗ trước chữ số ${digits[0]}`;
  if (k === digits.length) return `Chỗ sau chữ số ${digits[k - 1]} ở cuối`;
  return `Chỗ giữa chữ số ${digits[k - 1]} và chữ số ${digits[k]}`;
}

// A number whose digits have a gap before, between and after them: the child
// taps the gap where the extra digit goes. Not on a lesson screen to answer,
// only to place; the exercise's validator is the answer region.
export function Gaps({ spec }: { spec: GapsSpec }) {
  const digits = digitsOf(Number(spec.digits));
  const count = digits.length;
  const step = TILE.w + TILE.gap;
  const width = TILE.pad * 2 + TILE.gap + count * step;
  const height = TILE.h + TILE.pad * 2;
  const gapIds = Array.from({ length: count + 1 }, (_, k) => `g${k}`);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="flex items-center gap-2 text-body font-semibold">
        Chữ số cần thêm:
        <span
          aria-hidden
          className="flex h-11 w-9 items-center justify-center rounded-lg border-2 border-concept-amber bg-concept-amber/15 font-heading text-block font-bold text-concept-amber"
        >
          {spec.add}
        </span>
        <span className="sr-only">{spec.add}</span>
      </p>
      <RegionSvg
        label={`Số ${spec.digits}: chạm vào chỗ để viết thêm chữ số ${spec.add}`}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full max-w-sm"
      >
        {digits.map((digit, i) => (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
            key={`t${i}`}
            aria-hidden
          >
            <rect
              x={TILE.pad + TILE.gap + i * step}
              y={TILE.pad}
              width={TILE.w}
              height={TILE.h}
              rx={8}
              className="fill-concept-blue/15"
            />
            <text
              x={TILE.pad + TILE.gap + i * step + TILE.w / 2}
              y={TILE.pad + TILE.h / 2 + 10}
              textAnchor="middle"
              fontSize={30}
              fontWeight={700}
              className="fill-concept-blue font-heading"
            >
              {digit}
            </text>
          </g>
        ))}
        {gapIds.map((gapId, k) => (
          <Region key={gapId} id={gapId} label={gapLabel(k, digits)}>
            <rect
              x={TILE.pad + k * step + 4}
              y={TILE.pad + 4}
              width={TILE.gap - 8}
              height={TILE.h - 8}
              rx={6}
              className="fill-muted"
            />
          </Region>
        ))}
      </RegionSvg>
    </div>
  );
}
