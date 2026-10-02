"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { BigButton } from "@/components/big-button";
import { Sheet } from "@/components/sheet";
import { BACKUP_IMPORT_MAX_BYTES } from "@/lib/config";
import { appDb } from "@/progress/hooks";
import {
  type BackupError,
  type BackupPlan,
  type ImportSummary,
  importBackup,
  readBackup,
} from "@/sync/import";
import { syncNow } from "@/sync/request";
import { formatDateTime } from "./format";

const ERROR_TEXT: Record<BackupError, string> = {
  "too-large": `Tệp lớn hơn ${BACKUP_IMPORT_MAX_BYTES / 1_000_000} MB nên chưa nhập được.`,
  "not-json": "Tệp này không phải bản sao lưu của app.",
  "wrong-format": "Tệp này không phải bản sao lưu của app.",
  "too-new":
    "Bản sao lưu này do một phiên bản app mới hơn tạo ra. Bạn cập nhật app rồi thử lại nhé.",
  invalid:
    "Bản sao lưu bị lỗi nên chưa nhập được. Chưa có gì thay đổi trên máy.",
  "no-profile":
    "Bản sao lưu này là của một bé chưa có hồ sơ trên máy. Bạn nhập ở máy đã có hồ sơ của bé nhé.",
};

function summaryText({ added, skipped }: ImportSummary): string {
  const parts =
    added === 0
      ? ["Không có gì mới để thêm: bản sao lưu này đã có trên máy."]
      : [`Đã thêm ${added} bản ghi vào máy.`];
  if (skipped > 0) {
    parts.push(
      `Bỏ qua ${skipped} bản ghi vì bài đó đã được học lại sau thời điểm sao lưu.`,
    );
  }
  return parts.join(" ");
}

function Preview({
  plan,
  busy,
  onImport,
  onClose,
}: {
  plan: BackupPlan;
  busy: boolean;
  onImport: () => void;
  onClose: () => void;
}) {
  const { counts } = plan;
  return (
    <Sheet label="Nhập bản sao lưu" onClose={onClose}>
      <h2 className="pr-12 font-heading text-block font-bold">
        Nhập bản sao lưu của {plan.childName}?
      </h2>
      <ul className="flex list-disc flex-col gap-1 pl-6" data-import-preview>
        <li>
          Của bé: {plan.childName}
          {plan.createsProfile && " (máy sẽ tạo hồ sơ cho bé)"}
        </li>
        {plan.exportedAt !== null && (
          <li>Sao lưu lúc: {formatDateTime(new Date(plan.exportedAt))}</li>
        )}
        <li>
          Có {counts.attempts} câu đã làm, {counts.writings} bài viết,{" "}
          {counts.cards} thẻ ôn tập, {counts.sections} phần học và{" "}
          {counts.stickers} sticker.
        </li>
      </ul>
      <p className="font-semibold">
        Tiến độ đang có trên máy được giữ nguyên. Bản sao lưu chỉ được trộn thêm
        vào, không ghi đè.
      </p>
      <div className="flex flex-col gap-3">
        <BigButton onClick={onImport} disabled={busy}>
          {busy ? "Đang nhập…" : "Nhập vào máy"}
        </BigButton>
        <BigButton variant="secondary" onClick={onClose} disabled={busy}>
          Hủy
        </BigButton>
      </div>
    </Sheet>
  );
}

// "Nhập bản sao lưu": picks a file, shows what it holds, and on a yes merges
// it into this device. Any problem with the file is told in plain words and
// writes nothing.
export function ImportBackup() {
  const input = useRef<HTMLInputElement>(null);
  const [plan, setPlan] = useState<BackupPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    kind: "error" | "done";
    text: string;
  } | null>(null);

  async function handleFile(file: File) {
    setMessage(null);
    // A file past the limit is refused without reading it.
    const text = file.size > BACKUP_IMPORT_MAX_BYTES ? "" : await file.text();
    const result = await readBackup(appDb(), text, file.size);
    if (result.ok) setPlan(result.plan);
    else setMessage({ kind: "error", text: ERROR_TEXT[result.error] });
  }

  async function handleImport() {
    if (!plan) return;
    setBusy(true);
    try {
      const summary = await importBackup(appDb(), plan);
      setMessage({ kind: "done", text: summaryText(summary) });
      // Sends what the import changed, month by month.
      void syncNow({ full: true });
    } catch {
      setMessage({
        kind: "error",
        text: "Chưa nhập được. Bạn thử lại nhé; nhập lại cùng một tệp không làm trùng dữ liệu.",
      });
    }
    setBusy(false);
    setPlan(null);
  }

  return (
    <>
      <BigButton
        variant="secondary"
        onClick={() => input.current?.click()}
        className="md:w-auto md:self-start"
      >
        <Upload aria-hidden className="size-6" />
        Nhập bản sao lưu
      </BigButton>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        hidden
        aria-label="Chọn tệp sao lưu"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Picking the same file again must fire a change.
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          data-import-result={message.kind}
          className="font-semibold md:basis-full"
        >
          {message.text}
        </p>
      )}
      {plan && (
        <Preview
          plan={plan}
          busy={busy}
          onImport={handleImport}
          onClose={() => setPlan(null)}
        />
      )}
    </>
  );
}
