"use client";

import { RotateCw } from "lucide-react";
import { BigButton } from "@/components/big-button";
import { requestContentIndex } from "@/progress/hooks";

type ContentErrorProps = {
  message?: string;
  onRetry?: () => void;
};

// Shown when content could not be loaded (e.g. offline before the app was
// installed); retrying is the only thing a child can do about it.
export function ContentError({
  message = "Chưa tải được danh sách bài. Mình thử lại nhé!",
  onRetry = requestContentIndex,
}: ContentErrorProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg bg-surface p-6 text-center shadow-card">
      <p>{message}</p>
      <BigButton variant="secondary" onClick={onRetry} className="md:w-auto">
        <RotateCw aria-hidden className="size-6" />
        Thử lại
      </BigButton>
    </div>
  );
}
