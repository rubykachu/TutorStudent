import type { ReactNode } from "react";

// Profile avatars: flat animal faces drawn in a 100×100 box on a soft disc.
// Stored on the profile by id, so ids must never be renamed.

export const AVATARS = [
  { id: "cat", label: "Mèo" },
  { id: "bear", label: "Gấu" },
  { id: "rabbit", label: "Thỏ" },
  { id: "fox", label: "Cáo" },
  { id: "panda", label: "Gấu trúc" },
  { id: "chick", label: "Gà con" },
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
  const { bg, face } = FACES[isAvatarId(avatar) ? avatar : DEFAULT_AVATAR];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx={50} cy={50} r={50} className={bg} />
      {face}
    </svg>
  );
}
