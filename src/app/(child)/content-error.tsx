"use client";

import { RotateCw } from "lucide-react";
import { BigButton } from "@/components/big-button";
import { requestContentIndex } from "@/progress/hooks";

// Shown when the lesson list could not be loaded (e.g. offline before the app
// was installed); retrying is the only thing a child can do about it.
export function ContentError() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg bg-surface p-6 text-center shadow-card">
      <p>Chưa tải được danh sách bài. Mình thử lại nhé!</p>
      <BigButton
        variant="secondary"
        onClick={requestContentIndex}
        className="md:w-auto"
      >
        <RotateCw aria-hidden className="size-6" />
        Thử lại
      </BigButton>
    </div>
  );
}
