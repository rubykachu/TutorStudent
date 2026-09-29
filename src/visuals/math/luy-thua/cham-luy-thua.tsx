import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";

// 6⁴ drawn large for "tap the base / tap the exponent". Both parts are drawn
// in the plain text colour: in this lesson blue marks the base, so colouring
// them would answer the question. Region ids match the registry entry.
export default function ChamLuyThua() {
  return (
    <RegionSvg
      label="Luỹ thừa 6 mũ 4"
      viewBox="0 0 250 180"
      className="h-auto w-full max-w-64"
    >
      <Region id="base" label="Số 6">
        <rect
          {...decorative}
          x={20}
          y={50}
          width={110}
          height={120}
          rx={16}
          className="fill-muted"
        />
        <text
          x={75}
          y={112}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={110}
          stroke="none"
          className="fill-foreground font-heading font-bold"
        >
          6
        </text>
      </Region>
      <Region id="exponent" label="Số 4">
        <rect
          {...decorative}
          x={165}
          y={10}
          width={64}
          height={76}
          rx={14}
          className="fill-muted"
        />
        <text
          x={197}
          y={50}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={60}
          stroke="none"
          className="fill-foreground font-heading font-bold"
        >
          4
        </text>
      </Region>
    </RegionSvg>
  );
}
