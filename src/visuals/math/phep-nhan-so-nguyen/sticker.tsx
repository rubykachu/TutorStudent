import { decorative } from "@/visuals/shared/markers";

// Lesson sticker: a round badge with a big amber multiplication sign and, under
// it, the sign rule in miniature: a pink minus times a pink minus gives a lime
// plus.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu phép nhân số nguyên, dấu nhân và quy tắc dấu"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <circle
          cx={50}
          cy={50}
          r={40}
          className="fill-surface stroke-concept-amber"
          strokeWidth={3}
        />
        <g
          className="stroke-concept-amber"
          strokeWidth={7}
          strokeLinecap="round"
        >
          <line x1={38} y1={22} x2={62} y2={46} />
          <line x1={62} y1={22} x2={38} y2={46} />
        </g>
        <g
          className="stroke-concept-pink"
          strokeWidth={3.5}
          strokeLinecap="round"
        >
          <line x1={20} y1={68} x2={30} y2={68} />
          <line x1={43} y1={68} x2={53} y2={68} />
        </g>
        <g
          className="stroke-concept-pink"
          strokeWidth={2.5}
          strokeLinecap="round"
        >
          <line x1={34.5} y1={63.5} x2={38.5} y2={72.5} />
          <line x1={38.5} y1={63.5} x2={34.5} y2={72.5} />
        </g>
        <g
          className="stroke-foreground"
          strokeWidth={2.5}
          strokeLinecap="round"
        >
          <line x1={57} y1={66} x2={63} y2={66} />
          <line x1={57} y1={71} x2={63} y2={71} />
        </g>
        <g
          className="stroke-concept-lime"
          strokeWidth={3.5}
          strokeLinecap="round"
        >
          <line x1={68} y1={68} x2={80} y2={68} />
          <line x1={74} y1={62} x2={74} y2={74} />
        </g>
      </g>
    </svg>
  );
}
