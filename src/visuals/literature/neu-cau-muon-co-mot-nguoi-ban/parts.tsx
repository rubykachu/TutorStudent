import { ArrowDown, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";

// Pieces shared by the visuals of this lesson. The colours are the lesson's
// concept colours (lesson.json `concepts`), so the fox, the prince and each
// language point look the same in every picture, highlight and recap.

export const FOX_COLOR: ConceptColor = "pink";
export const PRINCE_COLOR: ConceptColor = "amber";
export const TAMING_COLOR: ConceptColor = "lime";
export const DIALOGUE_COLOR: ConceptColor = "blue";
export const SIMILE_COLOR: ConceptColor = "sky";
export const COMPOUND_COLOR: ConceptColor = "teal";
export const REDUPLICATIVE_COLOR: ConceptColor = "violet";

export type Mood = "happy" | "calm" | "sad";

export type Character = "fox" | "prince";

export const CHARACTERS: Readonly<
  Record<Character, { name: string; color: ConceptColor }>
> = {
  fox: { name: "Cáo", color: FOX_COLOR },
  prince: { name: "Hoàng tử bé", color: PRINCE_COLOR },
};

function Mouth({ mood, y }: { mood: Mood; y: number }) {
  const d =
    mood === "happy"
      ? `M42 ${y} Q50 ${y + 8} 58 ${y}`
      : mood === "sad"
        ? `M42 ${y + 5} Q50 ${y - 3} 58 ${y + 5}`
        : `M43 ${y + 2} L57 ${y + 2}`;
  return (
    <path
      d={d}
      className="fill-none stroke-foreground"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function Tear() {
  return (
    <path d="M30 58 q-4 7 0 10 q4 -3 0 -10z" className="fill-concept-sky" />
  );
}

// The fox's face in its concept colour. Decorative: a name or label always
// stands next to it.
export function Fox({
  mood = "calm",
  className = "size-12",
}: {
  mood?: Mood;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points="14,8 40,30 22,48" className="fill-concept-pink" />
      <polygon points="86,8 60,30 78,48" className="fill-concept-pink" />
      <polygon points="10,34 90,34 50,92" className="fill-concept-pink" />
      <polygon points="24,50 50,50 50,88" className="fill-surface" />
      <polygon points="76,50 50,50 50,88" className="fill-surface" />
      <circle cx={36} cy={48} r={5} className="fill-foreground" />
      <circle cx={64} cy={48} r={5} className="fill-foreground" />
      <circle cx={50} cy={84} r={5} className="fill-foreground" />
      <Mouth mood={mood} y={68} />
      {mood === "sad" && <Tear />}
    </svg>
  );
}

// The little prince's face with his golden hair, in its concept colour.
export function Prince({
  mood = "calm",
  className = "size-12",
}: {
  mood?: Mood;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle
        cx={50}
        cy={56}
        r={32}
        className="fill-surface stroke-foreground"
        strokeWidth={3}
      />
      <polygon
        points="16,50 24,14 36,30 44,8 54,28 66,8 70,30 84,16 84,50 70,36 50,40 30,36"
        className="fill-concept-amber"
      />
      <circle cx={39} cy={58} r={4.5} className="fill-foreground" />
      <circle cx={61} cy={58} r={4.5} className="fill-foreground" />
      <Mouth mood={mood} y={70} />
      {mood === "sad" && <Tear />}
    </svg>
  );
}

export function Face({
  who,
  mood,
  className,
}: {
  who: Character;
  mood?: Mood;
  className?: string;
}) {
  return who === "fox" ? (
    <Fox mood={mood} className={className} />
  ) : (
    <Prince mood={mood} className={className} />
  );
}

// Name of a character with its colour and shape, e.g. "◆ Cáo".
export function Speaker({ who }: { who: Character }) {
  const { name, color } = CHARACTERS[who];
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold ${CONCEPT_CLASSES[color].text}`}
    >
      <ConceptMark color={color} className="size-4" />
      {name}
    </span>
  );
}

// A short label under or beside a picture.
export function Label({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-caption text-muted-foreground ${className}`}>
      {children}
    </span>
  );
}

// A word or short phrase set in a chip, optionally in a concept colour.
export function Chip({
  children,
  color,
  className = "",
}: {
  children: ReactNode;
  color?: ConceptColor;
  className?: string;
}) {
  const tone = color
    ? `${CONCEPT_CLASSES[color].border} ${CONCEPT_CLASSES[color].text}`
    : "border-border text-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border-2 bg-surface px-3 py-1 font-semibold ${tone} ${className}`}
    >
      {color && <ConceptMark color={color} className="size-4" />}
      {children}
    </span>
  );
}

// A labelled example: parts stacked with even space. Its sentence is the
// note or caption in lesson.json that goes with it.
export function Example({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      {children}
    </div>
  );
}

// Points from one idea to the next: right on a tablet, down on a phone.
export function Flow({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <ArrowDown aria-hidden className="size-6 shrink-0 text-muted-foreground" />
  ) : (
    <ArrowRight aria-hidden className="size-6 shrink-0 text-muted-foreground" />
  );
}

// A quoted line of the story, as the fox or the prince said it.
export function Quote({ children }: { children: ReactNode }) {
  return <q className="font-semibold">{children}</q>;
}
