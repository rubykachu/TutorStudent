import Link from "next/link";
import {
  MASCOT_EXPRESSIONS,
  MASCOT_SIZES,
  type MascotSize,
} from "@/mascot/expressions";
import { Owl } from "@/mascot/owl";

// Every owl expression at every size side by side, for manual review.
export default function MascotIndexPage() {
  return (
    <main className="mx-auto w-full max-w-content px-gutter py-8 md:px-gutter-lg">
      <h1 className="font-heading text-title font-bold md:text-title-lg">
        Linh vật
      </h1>
      <ul className="mt-6 flex flex-col gap-6">
        {MASCOT_EXPRESSIONS.map((expression) => (
          <li
            key={expression}
            className="flex flex-wrap items-end gap-6 rounded-lg bg-surface p-4 shadow-card"
          >
            <Link
              href={`/dev/mascot/${expression}`}
              className="inline-flex min-h-touch w-24 items-center text-primary underline"
            >
              {expression}
            </Link>
            {(Object.keys(MASCOT_SIZES) as MascotSize[]).map((size) => (
              <Owl key={size} expression={expression} size={size} />
            ))}
          </li>
        ))}
      </ul>
    </main>
  );
}
