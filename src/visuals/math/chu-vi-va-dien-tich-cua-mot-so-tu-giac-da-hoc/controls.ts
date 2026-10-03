// Look of the buttons under the interactive pictures of this lesson, the same
// as the buttons of the step player so the lesson reads as one.
const BUTTON =
  "inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-lg px-4 font-semibold motion-safe:transition-transform motion-safe:active:scale-97 disabled:opacity-50";

export const PRIMARY_BUTTON = `${BUTTON} bg-primary text-primary-foreground`;
export const SECONDARY_BUTTON = `${BUTTON} border-2 border-border bg-surface text-foreground`;

// A drawing's piece or marker that glides: only transform and opacity
// change, and not at all with reduced motion.
export const GLIDE_MS = 700;

export function glide(reducedMotion: boolean): string | undefined {
  return reducedMotion
    ? undefined
    : `transform ${GLIDE_MS}ms ease, opacity ${GLIDE_MS}ms ease`;
}
