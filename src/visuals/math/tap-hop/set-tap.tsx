import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import { CASE_ITEMS, ITEM_LABELS, ItemShape } from "./set-parts";

// Figures for "tap the part". The tappable parts are drawn in the plain text
// colour: in this lesson colour names a concept, so colouring them would
// answer the question. Region ids match the registry entries.

const ITEM_REGION_LABELS = {
  but: "Cái bút",
  thuoc: "Cái thước",
  tay: "Cục tẩy",
} as const;
const CARD_WIDTH = 76;
const CARD_TOP = 50;
const CARD_HEIGHT = 130;
const ICON_SCALE = 1.25;
const ICON_SIZE = 48 * ICON_SCALE;

// A box with a pencil, a ruler and an eraser in it: tap one of the items.
export function HopCham() {
  return (
    <RegionSvg
      label="Hộp có bút, thước, tẩy"
      viewBox="0 0 300 200"
      className="h-auto w-full max-w-sm"
    >
      <rect
        {...decorative}
        x={10}
        y={10}
        width={280}
        height={180}
        rx={20}
        className="fill-muted stroke-foreground"
        strokeWidth={3}
      />
      {CASE_ITEMS.map((kind, i) => {
        const left = 22 + i * 90;
        return (
          <Region key={kind} id={kind} label={ITEM_REGION_LABELS[kind]}>
            <rect
              {...decorative}
              x={left}
              y={CARD_TOP}
              width={CARD_WIDTH}
              height={CARD_HEIGHT - 30}
              rx={12}
              className="fill-surface"
            />
            <g
              {...decorative}
              transform={`translate(${left + (CARD_WIDTH - ICON_SIZE) / 2} ${CARD_TOP + 8}) scale(${ICON_SCALE})`}
            >
              <ItemShape kind={kind} />
            </g>
            <text
              x={left + CARD_WIDTH / 2}
              y={CARD_TOP + 82}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={20}
              stroke="none"
              className="fill-foreground font-heading font-bold"
            >
              {ITEM_LABELS[kind]}
            </text>
          </Region>
        );
      })}
    </RegionSvg>
  );
}

const TEXT = "fill-foreground font-heading font-bold";

// "A = { x | x là số chẵn nhỏ hơn 9 }" with three tappable parts: the sample
// element x, the vertical bar, and the characteristic property after it.
export function DauHieuCham() {
  return (
    <RegionSvg
      label="Tập hợp A gồm các số x, với x là số chẵn nhỏ hơn 9"
      viewBox="0 0 330 180"
      className="h-auto w-full max-w-sm"
    >
      <text
        x={60}
        y={50}
        dominantBaseline="central"
        fontSize={28}
        stroke="none"
        className={TEXT}
      >
        A = {"{"}
      </text>
      <Region id="phan-tu-mau" label="Chữ x đứng đầu">
        <rect
          {...decorative}
          x={142}
          y={20}
          width={56}
          height={60}
          rx={12}
          className="fill-muted"
        />
        <text
          x={170}
          y={50}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={30}
          stroke="none"
          className={TEXT}
        >
          x
        </text>
      </Region>
      <Region id="vach-dung" label="Vạch đứng">
        <rect
          {...decorative}
          x={214}
          y={20}
          width={52}
          height={60}
          rx={12}
          className="fill-muted"
        />
        <text
          x={240}
          y={50}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={30}
          stroke="none"
          className={TEXT}
        >
          |
        </text>
      </Region>
      <Region id="dau-hieu" label="Phần sau vạch đứng">
        <rect
          {...decorative}
          x={10}
          y={110}
          width={290}
          height={60}
          rx={12}
          className="fill-muted"
        />
        <text
          x={155}
          y={140}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={21}
          stroke="none"
          className={TEXT}
        >
          x là số chẵn nhỏ hơn 9
        </text>
      </Region>
      <text
        x={312}
        y={140}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={28}
        stroke="none"
        className={TEXT}
      >
        {"}"}
      </text>
    </RegionSvg>
  );
}
