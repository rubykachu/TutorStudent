import type { ReactNode } from "react";

// Profile avatars: flat animal faces, a masked hero and a race car, drawn in
// a 100×100 box on a soft disc.
// Stored on the profile by id, so ids must never be renamed.

export const AVATARS = [
  { id: "cat", label: "Mèo" },
  { id: "bear", label: "Gấu" },
  { id: "rabbit", label: "Thỏ" },
  { id: "fox", label: "Cáo" },
  { id: "panda", label: "Gấu trúc" },
  { id: "chick", label: "Gà con" },
  { id: "spider", label: "Người nhện" },
  { id: "racecar", label: "Xe đua" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export const DEFAULT_AVATAR: AvatarId = "cat";

export function isAvatarId(value: string): value is AvatarId {
  return AVATARS.some((a) => a.id === value);
}

function Eyes({ y = 50, gap = 14 }: { y?: number; gap?: number }) {
  return (
    <g className="fill-foreground">
      <circle cx={50 - gap} cy={y} r={4.5} />
      <circle cx={50 + gap} cy={y} r={4.5} />
    </g>
  );
}

function Cheeks({ y = 60 }: { y?: number }) {
  return (
    <g className="fill-avatar-cheek" opacity={0.8}>
      <circle cx={28} cy={y} r={5} />
      <circle cx={72} cy={y} r={5} />
    </g>
  );
}

function Smile({ y = 62 }: { y?: number }) {
  return (
    <path
      d={`M44 ${y} Q50 ${y + 6} 56 ${y}`}
      className="fill-none stroke-foreground"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function Nose({ y = 57 }: { y?: number }) {
  return <ellipse cx={50} cy={y} rx={4} ry={3} className="fill-foreground" />;
}

// The web of the spider hero's mask: radial threads from the centre of the
// forehead to the edge of the head (an ellipse), joined by sagging rings.
const HEAD = { cx: 50, cy: 50, rx: 28, ry: 32 };
const THREAD_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function threadPoint(angleDeg: number, scale: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [
    HEAD.cx + HEAD.rx * scale * Math.cos(a),
    HEAD.cy + HEAD.ry * scale * Math.sin(a),
  ];
}

const WEB_RADIALS = THREAD_ANGLES.map((angle) => {
  const [x, y] = threadPoint(angle, 1);
  return `M${HEAD.cx} ${HEAD.cy} L${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ");

// One ring: each step to the next thread bows toward the centre.
function webRing(scale: number): string {
  const points = THREAD_ANGLES.map((angle) => threadPoint(angle, scale));
  return points
    .map(([x, y], i) => {
      const [nx, ny] = points[(i + 1) % points.length] as [number, number];
      const mx = (x + nx) / 2;
      const my = (y + ny) / 2;
      const cx = HEAD.cx + (mx - HEAD.cx) * 0.8;
      const cy = HEAD.cy + (my - HEAD.cy) * 0.8;
      return `${i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ""} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    })
    .join(" ");
}

const WEB_RINGS = [0.4, 0.7, 0.95].map(webRing).join(" ");

const FACES: Record<AvatarId, { bg: string; face: ReactNode }> = {
  cat: {
    bg: "fill-avatar-cat-bg",
    face: (
      <>
        <path d="M22 44 L26 16 L46 32 Z" className="fill-avatar-cat" />
        <path d="M78 44 L74 16 L54 32 Z" className="fill-avatar-cat" />
        <path d="M28 36 L29 24 L39 32 Z" className="fill-avatar-cheek" />
        <path d="M72 36 L71 24 L61 32 Z" className="fill-avatar-cheek" />
        <circle cx={50} cy={56} r={30} className="fill-avatar-cat" />
        <ellipse cx={50} cy={64} rx={13} ry={10} className="fill-surface" />
        <Eyes />
        <Nose y={59} />
        <Cheeks y={62} />
      </>
    ),
  },
  bear: {
    bg: "fill-avatar-bear-bg",
    face: (
      <>
        <circle cx={27} cy={32} r={11} className="fill-avatar-bear" />
        <circle cx={73} cy={32} r={11} className="fill-avatar-bear" />
        <circle cx={27} cy={32} r={5} className="fill-avatar-cheek" />
        <circle cx={73} cy={32} r={5} className="fill-avatar-cheek" />
        <circle cx={50} cy={55} r={30} className="fill-avatar-bear" />
        <ellipse cx={50} cy={65} rx={14} ry={11} className="fill-surface" />
        <Eyes />
        <Nose y={60} />
        <Smile y={65} />
      </>
    ),
  },
  rabbit: {
    bg: "fill-avatar-rabbit-bg",
    face: (
      <>
        <ellipse cx={37} cy={24} rx={8} ry={20} className="fill-surface" />
        <ellipse cx={63} cy={24} rx={8} ry={20} className="fill-surface" />
        <ellipse cx={37} cy={25} rx={4} ry={14} className="fill-avatar-cheek" />
        <ellipse cx={63} cy={25} rx={4} ry={14} className="fill-avatar-cheek" />
        <circle cx={50} cy={60} r={28} className="fill-surface" />
        <Eyes y={56} gap={12} />
        <Nose y={63} />
        <Cheeks y={66} />
        <Smile y={67} />
      </>
    ),
  },
  fox: {
    bg: "fill-avatar-fox-bg",
    face: (
      <>
        <path d="M20 46 L24 14 L46 30 Z" className="fill-avatar-fox" />
        <path d="M80 46 L76 14 L54 30 Z" className="fill-avatar-fox" />
        <path d="M27 36 L28 24 L38 30 Z" className="fill-foreground" />
        <path d="M73 36 L72 24 L62 30 Z" className="fill-foreground" />
        <path
          d="M18 46 Q22 30 50 28 Q78 30 82 46 Q78 72 50 84 Q22 72 18 46 Z"
          className="fill-avatar-fox"
        />
        <path
          d="M26 54 Q38 56 50 68 Q62 56 74 54 Q70 74 50 84 Q30 74 26 54 Z"
          className="fill-surface"
        />
        <Eyes y={50} />
        <Nose y={70} />
      </>
    ),
  },
  panda: {
    bg: "fill-avatar-panda-bg",
    face: (
      <>
        <circle cx={27} cy={32} r={11} className="fill-foreground" />
        <circle cx={73} cy={32} r={11} className="fill-foreground" />
        <circle cx={50} cy={56} r={30} className="fill-surface" />
        <ellipse
          cx={36}
          cy={52}
          rx={8}
          ry={10}
          transform="rotate(-20 36 52)"
          className="fill-foreground"
        />
        <ellipse
          cx={64}
          cy={52}
          rx={8}
          ry={10}
          transform="rotate(20 64 52)"
          className="fill-foreground"
        />
        <g className="fill-surface">
          <circle cx={37} cy={51} r={3} />
          <circle cx={63} cy={51} r={3} />
        </g>
        <Nose y={63} />
        <Smile y={67} />
        <Cheeks y={66} />
      </>
    ),
  },
  spider: {
    bg: "fill-avatar-spider-bg",
    face: (
      <>
        <path
          d="M18 84 Q50 66 82 84 Q72 97 50 98 Q28 97 18 84 Z"
          className="fill-avatar-spider-suit"
        />
        <ellipse
          cx={HEAD.cx}
          cy={HEAD.cy}
          rx={HEAD.rx}
          ry={HEAD.ry}
          className="fill-avatar-spider"
        />
        <g
          className="fill-none stroke-avatar-spider-web"
          strokeWidth={1.2}
          strokeLinecap="round"
        >
          <path d={WEB_RADIALS} />
          <path d={WEB_RINGS} />
        </g>
        <g
          className="fill-surface stroke-foreground"
          strokeWidth={3}
          strokeLinejoin="round"
        >
          <path d="M23 43 Q37 38 47 54 Q36 63 25 54 Z" />
          <path d="M77 43 Q63 38 53 54 Q64 63 75 54 Z" />
        </g>
      </>
    ),
  },
  racecar: {
    bg: "fill-avatar-car-bg",
    face: (
      <>
        <g
          className="fill-none stroke-foreground"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.35}
        >
          <path d="M8 56 H17 M5 63 H15 M9 70 H17" />
        </g>
        <path d="M13 42 H25 V49 H13 Z" className="fill-foreground" />
        <path
          d="M17 70 L19 56 L40 51 L50 38 L68 38 L75 51 L87 56 Q91 62 88 70 Z"
          className="fill-avatar-car"
        />
        <path
          d="M51 41 L66 41 L71 50 L47 50 Z"
          className="fill-avatar-car-window"
        />
        <path
          d="M20 61 H85"
          className="fill-none stroke-surface"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <g>
          <circle cx={34} cy={71} r={10} className="fill-foreground" />
          <circle cx={34} cy={71} r={4} className="fill-surface" />
          <circle cx={72} cy={71} r={10} className="fill-foreground" />
          <circle cx={72} cy={71} r={4} className="fill-surface" />
        </g>
      </>
    ),
  },
  chick: {
    bg: "fill-avatar-chick-bg",
    face: (
      <>
        <path
          d="M46 24 Q48 12 54 16 Q52 20 50 26 Z"
          className="fill-avatar-chick"
        />
        <circle cx={50} cy={56} r={31} className="fill-avatar-chick" />
        <Eyes y={50} gap={13} />
        <path d="M42 58 L58 58 L50 68 Z" className="fill-avatar-beak" />
        <Cheeks y={62} />
      </>
    ),
  },
};

type AvatarProps = { avatar: string; className?: string };

// Unknown ids (e.g. from a newer app version via sync) fall back to the
// default face instead of rendering nothing.
export function Avatar({ avatar, className }: AvatarProps) {
  const id = isAvatarId(avatar) ? avatar : DEFAULT_AVATAR;
  const { bg, face } = FACES[id];
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      data-avatar={id}
      className={className}
    >
      <circle cx={50} cy={50} r={50} className={bg} />
      {face}
    </svg>
  );
}
