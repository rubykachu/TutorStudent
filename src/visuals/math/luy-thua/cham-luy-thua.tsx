import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";

// A power drawn large for "tap the base / tap the exponent". Both parts are
// drawn in the plain text colour: in this lesson blue marks the base, so
// colouring them would answer the question. Region ids match the registry
// entries. Single-digit parts only, so each fits its box.
export function TapPower({
  base,
  exponent,
}: {
  base: number;
  exponent: number;
}) {
  return (
    <RegionSvg
      label={`Luỹ thừa ${base} mũ ${exponent}`}
      viewBox="0 0 250 180"
      className="h-auto w-full max-w-64"
    >
      <Region id="base" label={`Số ${base}`}>
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
          {base}
        </text>
      </Region>
      <Region id="exponent" label={`Số ${exponent}`}>
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
          {exponent}
        </text>
      </Region>
    </RegionSvg>
  );
}

export default function ChamLuyThua() {
  return <TapPower base={6} exponent={4} />;
}
