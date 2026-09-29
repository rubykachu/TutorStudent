type SectionStepperProps = { total: number; current: number };

// Position inside a section as a row of dots: no numbers, no percentages.
export function SectionStepper({ total, current }: SectionStepperProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-section-stepper
      data-current={current}
    >
      <span className="sr-only">{`Bước ${current + 1} trên ${total}`}</span>
      {Array.from({ length: total }, (_, index) => (
        <span
          // Dots only mark position.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={index}
          aria-hidden
          className={`h-3 rounded-full motion-safe:transition-all motion-safe:duration-300 ${
            index === current
              ? "w-8 bg-primary"
              : index < current
                ? "w-3 bg-primary"
                : "w-3 bg-border"
          }`}
        />
      ))}
    </div>
  );
}
