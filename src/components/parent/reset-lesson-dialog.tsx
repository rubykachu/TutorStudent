"use client";

import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { Sheet } from "@/components/sheet";
import { now } from "@/lib/time";
import { appDb, childScope } from "@/progress/hooks";
import { resetLessonProgress } from "@/progress/reset";
import { requestSync } from "@/sync/request";

type ResetLessonDialogProps = {
  childId: string;
  childName: string;
  lessonId: string;
  lessonTitle: string;
  // Called once the progress is erased.
  onDone: () => void;
  onClose: () => void;
};

// What a reset erases, as the parent reads it. The sticker is not on the
// list: it stays.
const ERASED = [
  "Tiến độ các phần và vị trí con đang học",
  "Dữ liệu ôn tập (các thẻ ghi nhớ)",
  "Các câu đã làm, kể cả câu con bỏ qua",
  "Bài viết con đã nộp",
];

// Two steps before one lesson of one child starts over: first what is lost,
// then a plain yes with the names spelled out. Closing at any point erases
// nothing.
export function ResetLessonDialog({
  childId,
  childName,
  lessonId,
  lessonTitle,
  onDone,
  onClose,
}: ResetLessonDialogProps) {
  const [step, setStep] = useState<"explain" | "confirm">("explain");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleReset() {
    setBusy(true);
    setFailed(false);
    try {
      await resetLessonProgress(appDb(), childScope(childId), lessonId, now());
      requestSync();
      onDone();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <Sheet label="Học lại bài này" onClose={onClose}>
      {step === "explain" ? (
        <>
          <h2 className="pr-12 font-heading text-block font-bold">
            Cho con học lại bài này?
          </h2>
          <p>
            Bài “{lessonTitle}” của {childName} sẽ về như chưa học. Những thứ
            sau sẽ bị xoá và không lấy lại được:
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-6">
            {ERASED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-semibold">
            Sticker con đã nhận vẫn được giữ. Các bài khác không đổi.
          </p>
          <div className="flex flex-col gap-3">
            <BigButton variant="destructive" onClick={() => setStep("confirm")}>
              Tiếp tục
            </BigButton>
            <BigButton variant="secondary" onClick={onClose}>
              Hủy
            </BigButton>
          </div>
        </>
      ) : (
        <>
          <h2 className="pr-12 font-heading text-block font-bold">
            Xoá và học lại từ đầu?
          </h2>
          <p>
            Bạn sắp xoá toàn bộ tiến độ bài “{lessonTitle}” của {childName}.
            Việc này không hoàn tác được.
          </p>
          {failed && (
            <p role="alert" className="font-semibold text-destructive">
              Chưa xoá được. Bạn thử lại nhé.
            </p>
          )}
          <div className="flex flex-col gap-3">
            <BigButton
              variant="destructive"
              onClick={handleReset}
              disabled={busy}
            >
              {busy ? "Đang xoá…" : "Xoá và học lại"}
            </BigButton>
            <BigButton variant="secondary" onClick={onClose} disabled={busy}>
              Hủy
            </BigButton>
          </div>
        </>
      )}
    </Sheet>
  );
}
