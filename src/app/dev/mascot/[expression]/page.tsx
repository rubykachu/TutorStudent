import { notFound } from "next/navigation";
import { isMascotExpression, isMascotSize } from "@/mascot/expressions";
import { Owl } from "@/mascot/owl";
import { visualFrame } from "@/visuals/shared/markers";

// One owl expression at one size (`?size=home|exercise|preview`), framed
// tightly so `pnpm visual:shot mascot` can check no part leaves the owl's box.
export default async function MascotPage({
  params,
  searchParams,
}: PageProps<"/dev/mascot/[expression]">) {
  const { expression } = await params;
  const { size = "preview" } = await searchParams;
  if (!isMascotExpression(expression)) notFound();
  if (typeof size !== "string" || !isMascotSize(size)) notFound();

  return (
    <main className="mx-auto w-full max-w-content px-gutter py-6 md:px-gutter-lg">
      <h1 className="mb-4 text-caption text-muted-foreground">
        {expression} · {size}
      </h1>
      <div {...visualFrame} className="inline-flex bg-surface">
        <Owl expression={expression} size={size} />
      </div>
    </main>
  );
}
