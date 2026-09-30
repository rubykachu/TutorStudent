import { decorative } from "@/visuals/shared/markers";

// Lesson sticker: the fox's face in front of a wheat-coloured sun.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Chú cáo nhỏ"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <polygon points="22,18 42,36 28,50" className="fill-concept-pink" />
        <polygon points="78,18 58,36 72,50" className="fill-concept-pink" />
        <polygon points="18,38 82,38 50,86" className="fill-concept-pink" />
        <polygon points="30,52 50,52 50,82" className="fill-surface" />
        <polygon points="70,52 50,52 50,82" className="fill-surface" />
        <circle cx={39} cy={50} r={4} className="fill-foreground" />
        <circle cx={61} cy={50} r={4} className="fill-foreground" />
        <circle cx={50} cy={79} r={4} className="fill-foreground" />
        <path
          d="M43 66 Q50 72 57 66"
          className="fill-none stroke-foreground"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
