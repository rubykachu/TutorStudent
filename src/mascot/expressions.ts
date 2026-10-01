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

// Rendered sizes: 80px on the home screen; beside an exercise 56px on a
// phone (perched on the answer card) and 72px from tablet width up (standing
// beside it); and a large preview the /dev/mascot page uses to inspect details.
export const MASCOT_SIZES = {
  home: "size-20",
  exercise: "size-14 md:size-18",
  preview: "size-60",
} as const;

export type MascotSize = keyof typeof MASCOT_SIZES;

export function isMascotSize(value: string): value is MascotSize {
  return Object.hasOwn(MASCOT_SIZES, value);
}
