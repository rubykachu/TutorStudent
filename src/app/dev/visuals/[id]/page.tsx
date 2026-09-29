import { notFound } from "next/navigation";
import { findVisual } from "@/visuals/registry";
import { visualFrame } from "@/visuals/shared/markers";

// Renders one visual alone in the size budget a lesson gives it, for manual
// review and for `pnpm visual:shot`.
export default async function VisualPage({
  params,
}: PageProps<"/dev/visuals/[id]">) {
  const { id } = await params;
  const entry = findVisual(decodeURIComponent(id));
  if (!entry) notFound();
  const { default: Visual } = await entry.load();

  return (
    <main className="mx-auto w-full max-w-content px-gutter py-6 md:px-gutter-lg">
      <h1 className="mb-4 text-caption text-muted-foreground">{id}</h1>
      <div
        {...visualFrame}
        className="flex h-visual-frame w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-4"
      >
        <Visual />
      </div>
    </main>
  );
}
