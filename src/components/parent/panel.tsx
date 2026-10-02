import type { ReactNode } from "react";

// The card every block of the parent page sits in.
export const CARD =
  "flex flex-col gap-4 rounded-lg bg-surface p-4 shadow-card md:p-6";

export function Panel({
  title,
  note,
  children,
  label,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <section className={CARD} aria-label={label} data-parent-panel={label}>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-block font-bold md:text-block-lg">
          {title}
        </h2>
        {note && <p className="text-caption text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}
