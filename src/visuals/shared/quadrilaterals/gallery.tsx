import { Figure } from "@/visuals/shared/plane/figure";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { Scene, type SceneKind } from "./scene";

// Pictures side by side, each with a caption: everyday things, or the shapes
// with their names.

export type GalleryItem = { caption: string } & (
  | { figure: FigureSpec }
  | { scene: SceneKind }
);

export type GallerySpec = {
  label: string;
  items: readonly GalleryItem[];
  // Pictures in a row (default: as many as there are, up to 3).
  columns?: 1 | 2 | 3;
};

const COLUMNS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
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
            <div
              className={`w-full ${columns === 3 ? "max-w-44" : "max-w-56"}`}
            >
              {"scene" in item ? (
                <Scene kind={item.scene} />
              ) : (
                <Figure spec={item.figure} />
              )}
            </div>
            <span className="text-center text-caption">{item.caption}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
