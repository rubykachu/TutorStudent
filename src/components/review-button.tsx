import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { bigButtonClassName } from "@/components/big-button";

type ReviewButtonProps = {
  href: string;
  // Opened cards whose predicted recall is below the forgetting threshold;
  // a gentle hint, never a requirement.
  forgetting: number;
};

// "Ôn bài này": starts an on-demand review of the lesson, any time and as
// often as the child likes.
export function ReviewButton({ href, forgetting }: ReviewButtonProps) {
  return (
    <Link
      href={href}
      data-review-button
      className={bigButtonClassName(
        "primary",
        "h-auto! min-h-14 py-3 md:h-auto! md:min-h-16",
      )}
    >
      <RotateCcw aria-hidden className="size-6 shrink-0" />
      <span className="flex flex-col items-start gap-1">
        <span>Ôn bài này</span>
        {forgetting > 0 && (
          <span
            className="text-caption font-normal"
            data-forgetting={forgetting}
          >
            {forgetting} thẻ sắp quên
          </span>
        )}
      </span>
    </Link>
  );
}
