"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import { PinPrompt } from "@/components/parent/pin-prompt";
import { FEEDBACK_NOTE_MAX_CHARS } from "@/lib/config";
import { PARENT_PATH } from "@/lib/routes";
import { appDb } from "@/progress/hooks";
import { readPinState } from "@/progress/parent-pin";
import type { FeedbackContext } from "./context";
import { buildReport, Thanks } from "./feedback-sheet";
import { REASON_LABELS } from "./labels";
import {
  FEEDBACK_REASONS,
  type FeedbackReason,
  type FeedbackRequest,
} from "./schema";

// The counter is read out only near and at the limit, not on every key.
const NOTE_WARN_AT = 450;

// The parent's report with an optional note, behind the device's parent PIN,
// asked for every note: a right PIN opens this one form only, never the parent
// page's session, so a parent handing the iPad back leaves no note field open
// to the child. Without a PIN on the device no free text is offered.
export function ParentFeedback({
  context,
  onClose,
  send,
}: {
  context: FeedbackContext;
  onClose: () => void;
  send: (report: FeedbackRequest) => Promise<void>;
}) {
  const pin = useLiveQuery(() => readPinState(appDb()), []);
  const [stage, setStage] = useState<"pin" | "form" | "thanks">("pin");

  if (stage === "thanks") {
    return <Thanks text="Đã gửi. Cảm ơn bạn đã góp ý!" onClose={onClose} />;
  }
  return (
    <div
      className="flex flex-col gap-4"
      data-feedback-sheet={`parent-${stage}`}
    >
      <h2 className="pr-12 font-heading text-block font-bold md:text-block-lg">
        Phụ huynh góp ý
      </h2>
      {stage === "form" ? (
        <ParentForm
          context={context}
          send={send}
          onSent={() => setStage("thanks")}
        />
      ) : pin === undefined ? null : pin.hash === null ? (
        <>
          <p>Đặt PIN ở trang phụ huynh để góp ý kèm ghi chú.</p>
          <Link href={PARENT_PATH} className={bigButtonClassName("secondary")}>
            Mở trang phụ huynh
          </Link>
        </>
      ) : (
        <PinPrompt submitLabel="Tiếp tục" onUnlock={() => setStage("form")} />
      )}
    </div>
  );
}

function ParentForm({
  context,
  send,
  onSent,
}: {
  context: FeedbackContext;
  send: (report: FeedbackRequest) => Promise<void>;
  onSent: () => void;
}) {
  const noteId = useId();
  const helpId = useId();
  const [reason, setReason] = useState<FeedbackReason | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const length = Array.from(note).length;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reason === null || busy) return;
    setBusy(true);
    try {
      await send(
        buildReport(context, reason, {
          source: "phu-huynh",
          note: note.trim(),
        }),
      );
    } catch {
      // The device could not keep it; the thank-you still shows.
    }
    onSent();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Lý do</legend>
        {FEEDBACK_REASONS.map((value) => (
          <label
            key={value}
            className="flex min-h-touch items-center gap-3 rounded-lg border-2 border-border bg-surface px-4"
          >
            <input
              type="radio"
              name="feedback-reason"
              value={value}
              checked={reason === value}
              onChange={() => setReason(value)}
              className="size-5 accent-primary"
            />
            {REASON_LABELS[value]}
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-2">
        <label htmlFor={noteId} className="font-semibold">
          Ghi chú (không bắt buộc)
        </label>
        <textarea
          id={noteId}
          aria-describedby={helpId}
          rows={4}
          maxLength={FEEDBACK_NOTE_MAX_CHARS}
          value={note}
          onChange={(event) =>
            setNote(
              Array.from(event.target.value)
                .slice(0, FEEDBACK_NOTE_MAX_CHARS)
                .join(""),
            )
          }
          className="w-full rounded-lg border-2 border-border bg-surface p-3 focus-visible:border-primary"
        />
        <div className="flex justify-between gap-2 text-caption text-muted-foreground">
          <p id={helpId}>
            Tối đa {FEEDBACK_NOTE_MAX_CHARS} ký tự. Đừng ghi tên bé hay thông
            tin cá nhân.
          </p>
          <p aria-hidden data-note-counter>
            {length}/{FEEDBACK_NOTE_MAX_CHARS}
          </p>
        </div>
        <p aria-live="polite" className="sr-only" data-note-announce>
          {length >= FEEDBACK_NOTE_MAX_CHARS
            ? `Đã đủ ${FEEDBACK_NOTE_MAX_CHARS} ký tự`
            : length >= NOTE_WARN_AT
              ? `Sắp đủ ${FEEDBACK_NOTE_MAX_CHARS} ký tự`
              : ""}
        </p>
      </div>
      <BigButton type="submit" disabled={reason === null || busy}>
        Gửi góp ý
      </BigButton>
    </form>
  );
}
