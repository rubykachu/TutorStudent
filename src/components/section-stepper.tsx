type SectionStepperProps = {
  total: number;
  current: number;
  // Spoken and shown name of each dot ("Lý thuyết 1", "Câu 2"); the dots of
  // screens already reached are buttons only when this is given.
  labels?: readonly string[];
  // The furthest screen reached; dots up to it can be tapped.
  reached?: number;
  onSelect?: (index: number) => void;
};

// Room around each dot: the gap between dots and the width of its hit area.
const DOT_PAD = "px-[3px] md:px-1.5";

const DOT =
  "h-3 min-w-1.5 rounded-full motion-safe:transition-all motion-safe:duration-300";

function dotTone(index: number, current: number): string {
  if (index === current) return "w-8 bg-primary";
  return index < current ? "w-3 bg-primary" : "w-3 bg-border";
}

// Position inside a section as a row of dots: no numbers, no percentages.
// One row always: a long section's dots squeeze instead of wrapping a lone
// dot onto a second line. A dot of a screen the child already visited jumps
// back to it, with its name shown on hover and focus; a dot ahead is only a
// mark.
export function SectionStepper({
  total,
  current,
  labels,
  reached = current,
  onSelect,
}: SectionStepperProps) {
  return (
    <div
      className="flex min-w-0 flex-1 items-center"
      data-section-stepper
      data-current={current}
    >
      <span className="sr-only">{`Bước ${current + 1} trên ${total}`}</span>
      {Array.from({ length: total }, (_, index) => {
        const label = labels?.[index];
        if (!onSelect || label === undefined || index > reached) {
          return (
            <span
              // Dots only mark position.
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={index}
              aria-hidden
              className={`flex ${DOT_PAD}`}
            >
              <span className={`${DOT} ${dotTone(index, current)}`} />
            </span>
          );
        }
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={index}
            type="button"
            data-step-dot={index}
            aria-label={label}
            aria-current={index === current ? "step" : undefined}
            onClick={() => onSelect(index)}
            // A 48px tall hit area around the small dot, as wide as the row
            // allows, keeps it easy to tap.
            className={`group relative flex h-12 min-w-0 items-center ${DOT_PAD}`}
          >
            <span aria-hidden className={`${DOT} ${dotTone(index, current)}`} />
            <span
              aria-hidden
              className="pointer-events-none absolute top-full left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 font-semibold text-background text-caption opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
