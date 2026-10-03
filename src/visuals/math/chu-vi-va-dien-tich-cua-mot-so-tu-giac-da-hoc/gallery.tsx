import { Figure } from "@/visuals/shared/plane/figure";
import type { GallerySpec } from "./models";

// Pictures side by side, each with a caption; one picture alone is shown
// larger, with its caption (the formula to remember) in body size. A caption
// may hold a second line (after "\n"): the meaning of the letters.

const COLUMNS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
} as const;

const MAX_WIDTH_CLASS = {
  1: "max-w-sm",
  2: "max-w-56",
  3: "max-w-44",
} as const;

export function Gallery({ spec }: { spec: GallerySpec }) {
  const columns = spec.columns ?? (spec.items.length >= 3 ? 3 : 2);
  return (
    <figure aria-label={spec.label} className="w-full">
      <ul className={`grid items-start gap-2 ${COLUMNS_CLASS[columns]}`}>
        {spec.items.map((item) => (
          <li
            key={item.caption}
            className="flex min-w-0 flex-col items-center gap-1"
          >
            <div className={`w-full ${MAX_WIDTH_CLASS[columns]}`}>
              <Figure spec={item.figure} />
            </div>
            <Caption text={item.caption} large={columns === 1} />
          </li>
        ))}
      </ul>
    </figure>
  );
}

function Caption({ text, large }: { text: string; large: boolean }) {
  const [first, ...rest] = text.split("\n");
  return (
    <>
      <span
        className={`text-center ${large ? "font-heading text-block font-semibold" : "text-caption"}`}
      >
        {first}
      </span>
      {rest.map((line) => (
        <span
          key={line}
          className="text-center text-caption text-muted-foreground"
        >
          {line}
        </span>
      ))}
    </>
  );
}
