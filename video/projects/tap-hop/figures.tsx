import {
  GLYPH_HEIGHT,
  GLYPHS,
  type GlyphKey,
  strokeStart,
  strokeWidth,
} from "@/visuals/math/tap-hop/glyphs";

// The marks of the sets lesson drawn as its visuals draw them (same stroke
// paths), one `path.stroke` per pen movement and one `g.badge` (numbered start
// dot) per stroke, so a video can ink the strokes one at a time.
// Sized by the composition's `.glyph` rule.
function Mark({ name }: { name: GlyphKey }) {
  const { crop, strokes } = GLYPHS[name];
  return (
    <svg
      className="glyph"
      viewBox={`${crop[0] - 14} 0 ${crop[1] - crop[0] + 28} ${GLYPH_HEIGHT}`}
      aria-hidden
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((stroke) => (
          <path
            key={stroke.d}
            className="stroke"
            d={stroke.d}
            stroke="currentColor"
            strokeWidth={strokeWidth(stroke)}
          />
        ))}
      </g>
      {strokes.map((stroke, index) => {
        const start = strokeStart(stroke);
        const [x, y] = stroke.badge ?? [start.x, start.y];
        return (
          <g key={stroke.d} className="badge" transform={`translate(${x} ${y})`}>
            <circle r="15" fill="#db2777" />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="20"
              fontWeight="800"
              fill="#ffffff"
              fontFamily="Baloo 2, sans-serif"
            >
              {index + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const figures = {
  "glyph-ngoac-nhon-mo": <Mark name="ngoac-nhon-mo" />,
  "glyph-ngoac-nhon-dong": <Mark name="ngoac-nhon-dong" />,
  "glyph-thuoc": <Mark name="thuoc" />,
  "glyph-khong-thuoc": <Mark name="khong-thuoc" />,
};

export default figures;
