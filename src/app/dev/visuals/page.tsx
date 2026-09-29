import Link from "next/link";
import { visualRegistry } from "@/visuals/registry";

export default function VisualIndexPage() {
  return (
    <main className="mx-auto w-full max-w-content px-gutter py-8 md:px-gutter-lg">
      <h1 className="font-heading text-title font-bold md:text-title-lg">
        Visual
      </h1>
      <ul className="mt-6 flex flex-col gap-3">
        {Object.keys(visualRegistry).map((id) => (
          <li key={id}>
            <Link
              href={`/dev/visuals/${id}`}
              className="inline-flex min-h-touch items-center text-primary underline"
            >
              {id}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
