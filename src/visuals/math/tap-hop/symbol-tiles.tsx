import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import {
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GLYPHS,
  type GlyphKey,
  GlyphPaths,
} from "./glyphs";

const TILE_WIDTH = 96;
const TILE_HEIGHT = 120;
const TILE_GAP = 14;
const GLYPH_SCALE = 0.68;
// The glyph is drawn small here, so its pen is thickened to stay bold.
const GLYPH_THICKNESS = 1.35;
const MAX_COLUMNS = 4;
// A fifth tile starts a second row, so every tile stays wide enough to tap.
const COLUMNS_FOR_MANY = 3;
// Room for the selection ring around the tiles.
const MARGIN = 14;

function columnsFor(count: number): number {
  return count <= MAX_COLUMNS ? count : COLUMNS_FOR_MANY;
}

// Big tiles, one mark each, for "tap the mark that …" questions. A tile keeps
// the plain text colour: the child has to pick the mark by its shape, so no
// colour may answer for her. One region per key, in the order given.
export function SymbolTiles({ keys }: { keys: readonly GlyphKey[] }) {
  const columns = columnsFor(keys.length);
  const rows = Math.ceil(keys.length / columns);
  const width = columns * TILE_WIDTH + (columns - 1) * TILE_GAP + 2 * MARGIN;
  const height = rows * TILE_HEIGHT + (rows - 1) * TILE_GAP + 2 * MARGIN;
  const inkX = (TILE_WIDTH - GLYPH_WIDTH * GLYPH_SCALE) / 2;
  const inkY = (TILE_HEIGHT - GLYPH_HEIGHT * GLYPH_SCALE) / 2;
  return (
    <RegionSvg
      label="Các kí hiệu"
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-w-md"
    >
      {keys.map((key, i) => {
        const x = MARGIN + (i % columns) * (TILE_WIDTH + TILE_GAP);
        const y = MARGIN + Math.floor(i / columns) * (TILE_HEIGHT + TILE_GAP);
        return (
          <Region key={key} id={key} label={GLYPHS[key].label}>
            <rect
              {...decorative}
              x={x}
              y={y}
              width={TILE_WIDTH}
              height={TILE_HEIGHT}
              rx={16}
              className="fill-muted"
            />
            <g
              transform={`translate(${x + inkX} ${y + inkY}) scale(${GLYPH_SCALE})`}
            >
              <GlyphPaths name={key} thickness={GLYPH_THICKNESS} />
            </g>
          </Region>
        );
      })}
    </RegionSvg>
  );
}
