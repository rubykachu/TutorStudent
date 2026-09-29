// Owl expressions and sizes, kept free of React so scripts
// (`pnpm visual:shot mascot`) can list them without loading the component.
export const MASCOT_EXPRESSIONS = [
  "idle",
  "happy",
  "hint",
  "cheer",
  "welcome",
] as const;

export type MascotExpression = (typeof MASCOT_EXPRESSIONS)[number];

export function isMascotExpression(value: string): value is MascotExpression {
  return (MASCOT_EXPRESSIONS as readonly string[]).includes(value);
}

// Rendered sizes: 96px on the home screen, 56px beside an exercise, and a
// large preview the /dev/mascot page uses to inspect details.
export const MASCOT_SIZES = {
  home: "size-24",
  exercise: "size-14",
  preview: "size-60",
} as const;

export type MascotSize = keyof typeof MASCOT_SIZES;

export function isMascotSize(value: string): value is MascotSize {
  return Object.hasOwn(MASCOT_SIZES, value);
}
