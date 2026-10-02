"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { now } from "@/lib/time";
import { appDb, useProfiles } from "@/progress/hooks";
import {
  type DeviceSyncStatus,
  hasUnsentWork,
  isFamilyMismatch,
  readSyncStatus,
  syncMessages,
} from "@/sync/status";
import { ExportBackupButton } from "./export-backup-button";
import { FamilySwitchDialog } from "./family-switch-dialog";
import { formatDateTime } from "./format";
import { Panel } from "./panel";

const UNLOCK_PATH = "/unlock";

// The cookie is for another family than the one this device syncs. With
// unsent progress only the backup is offered; with none, the device can be
// cleared for the new family.
function FamilySwitchGuard({ status }: { status: DeviceSyncStatus }) {
  const profiles = useProfiles();
  const [open, setOpen] = useState(false);
  if (hasUnsentWork(status)) {
    return (
      <div className="flex flex-col gap-3" data-sync-guard="unsent">
        <p className="font-semibold">
          Máy này còn tiến độ chưa gửi của gia đình khác. Tải bản sao lưu trước
          khi đổi.
        </p>
        {profiles?.map((profile) => (
          <ExportBackupButton
            key={profile.id}
            profile={profile}
            label={`Tải bản sao lưu của ${profile.name}`}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3" data-sync-guard="clean">
      <p className="font-semibold">
        Mã đang dùng thuộc về một gia đình khác với gia đình mà máy này đã lưu
        tiến độ. Tiến độ trên máy đã có trên kho lưu trữ của gia đình cũ.
      </p>
      <BigButton
        variant="secondary"
        onClick={() => setOpen(true)}
        className="md:w-auto md:self-start"
      >
        Dùng máy này cho gia đình mới
      </BigButton>
      {open && <FamilySwitchDialog onClose={() => setOpen(false)} />}
    </div>
  );
}

// When this device last synced and, in plain words, what is stuck. Shown only
// on a device that has reached a server with sync on.
export function SyncStatus() {
  const status = useLiveQuery(() => readSyncStatus(appDb()), []);
  if (!status) return null;
  const messages = syncMessages(status, now());
  return (
    <Panel label="Đồng bộ" title="Đồng bộ giữa các máy">
      <p data-sync-last>
        Đồng bộ lần cuối:{" "}
        {status.lastSyncAt === null
          ? "chưa lần nào"
          : formatDateTime(new Date(status.lastSyncAt))}
      </p>
      {messages.map((message) => (
        <p
          key={`${message.id}:${message.text}`}
          role="status"
          data-sync-message={message.id}
          className="font-semibold"
        >
          {message.text}
        </p>
      ))}
      {messages.some((m) => m.id === "unauthorized") && (
        <Link
          href={UNLOCK_PATH}
          className="inline-flex min-h-touch items-center font-semibold underline"
        >
          Nhập lại mã
        </Link>
      )}
      {isFamilyMismatch(status) && <FamilySwitchGuard status={status} />}
    </Panel>
  );
}
