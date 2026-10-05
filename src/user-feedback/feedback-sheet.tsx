"use client";

import {
  CircleCheck,
  CircleHelp,
  Heart,
  Hourglass,
  ImageOff,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { bigButtonClassName } from "@/components/big-button";
import { Sheet } from "@/components/sheet";
import { deviceClass } from "@/install/platform";
import { FEEDBACK_THANKS_CLOSE_MS } from "@/lib/config";
import { newId } from "@/lib/id";
import { now } from "@/lib/time";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Owl } from "@/mascot/owl";
import { sendFeedback as defaultSend } from "./client";
import type { FeedbackContext } from "./context";
import { REASON_LABELS } from "./labels";
import { ParentFeedback } from "./parent-form";
import {
  FEEDBACK_REASONS,
  type FeedbackReason,
  type FeedbackRequest,
} from "./schema";

export const REASON_ICONS: Record<FeedbackReason, LucideIcon> = {
  "kho-hieu": CircleHelp,
  "sai-noi-dung": TriangleAlert,
  "loi-hinh-video": ImageOff,
  "dai-chan": Hourglass,
  thich: Heart,
};

export const SHEET_LABEL = "Góp ý về bài này";

// The report of one tap, everything but what the screen gives.
export function buildReport(
  context: FeedbackContext,
  reason: FeedbackReason,
  extra: Pick<FeedbackRequest, "source"> & { note?: string },
): FeedbackRequest {
  const device = deviceClass({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
  });
  return {
    id: newId(),
    ...context,
    reason,
    source: extra.source,
    ...(extra.note ? { note: extra.note } : {}),
    device,
    createdAt: now().toISOString(),
  };
}

export type FeedbackSheetProps = {
  context: FeedbackContext;
  // Reasons already sent for this item while the screen is open.
  sent: ReadonlySet<FeedbackReason>;
  onSent: (reason: FeedbackReason) => void;
  onClose: () => void;
  send?: (report: FeedbackRequest) => Promise<void>;
};

// The child's sheet: five big reason chips, one tap sends, then the owl's
// thank-you. The thank-you shows as soon as the report is in the device
// outbox, whatever the network does later.
export function FeedbackSheet({
  context,
  sent,
  onSent,
  onClose,
  send = defaultSend,
}: FeedbackSheetProps) {
  const [thanked, setThanked] = useState(false);
  const [parent, setParent] = useState(false);

  const choose = async (reason: FeedbackReason) => {
    try {
      await send(buildReport(context, reason, { source: "be" }));
    } catch {
      // The device could not keep it; the child still sees the thank-you.
    }
    onSent(reason);
    setThanked(true);
  };

  return (
    <Sheet label={SHEET_LABEL} onClose={onClose}>
      {parent ? (
        <ParentFeedback context={context} onClose={onClose} send={send} />
      ) : thanked ? (
        <Thanks text="Cảm ơn bạn! Cú đã ghi lại rồi." onClose={onClose} />
      ) : (
        <div className="flex flex-col gap-4" data-feedback-sheet="chips">
          <h2 className="pr-12 font-heading text-block font-bold md:text-block-lg">
            Bạn thấy chỗ này thế nào?
          </h2>
          <div className="flex flex-col gap-3">
            {FEEDBACK_REASONS.map((reason) => {
              const Icon = REASON_ICONS[reason];
              const done = sent.has(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  disabled={done}
                  data-feedback-reason={reason}
                  onClick={() => void choose(reason)}
                  className="flex min-h-16 w-full items-center gap-3 rounded-lg border-2 border-border bg-surface px-4 py-3 text-left text-block font-semibold text-foreground transition-transform duration-100 ease-out active:scale-[0.97] disabled:bg-muted disabled:text-muted-foreground motion-reduce:transition-none"
                >
                  <Icon aria-hidden className="size-7 shrink-0" />
                  <span className="flex-1">{REASON_LABELS[reason]}</span>
                  {done && (
                    <span className="flex shrink-0 items-center gap-1 text-body">
                      <CircleCheck aria-hidden className="size-5" />
                      Đã gửi
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            data-feedback-parent
            onClick={() => setParent(true)}
            className="min-h-touch self-center px-2 font-semibold text-primary underline underline-offset-4"
          >
            Phụ huynh góp ý kèm ghi chú
          </button>
        </div>
      )}
    </Sheet>
  );
}

// The thank-you: a status the screen reader hears, focus on "Học tiếp", and
// it closes by itself after a few seconds unless motion is reduced.
export function Thanks({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    buttonRef.current?.focus();
    if (reducedMotion) return;
    const timer = setTimeout(onClose, FEEDBACK_THANKS_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion, onClose]);
  return (
    <div
      className="flex flex-col items-center gap-4 text-center"
      data-feedback-sheet="thanks"
    >
      <Owl expression="happy" size="home" />
      <p role="status" className="font-heading text-block font-bold">
        {text}
      </p>
      <button
        ref={buttonRef}
        type="button"
        onClick={onClose}
        className={bigButtonClassName()}
      >
        Học tiếp
      </button>
    </div>
  );
}
