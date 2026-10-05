"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { appDb } from "@/progress/hooks";
import { readSyncStatus } from "@/sync/status";

// Where the progress shown on the parent page lives, in words that stay true
// whether this device syncs or not. Sync is on once the device has reached a
// server with sync enabled (the same test the sync panel uses). While that is
// being read nothing is shown, so the wrong sentence never flashes.

// `undefined` while the check runs.
export function useSyncOn(): boolean | undefined {
  const status = useLiveQuery(
    async () => (await readSyncStatus(appDb())) !== null,
    [],
  );
  return status;
}

export const REPORT_SOURCE_NOTE = {
  off: "Số liệu lấy từ tiến độ lưu trên máy này. Con học trên máy khác thì phần đó chưa hiện ở đây.",
  on: "Số liệu lấy từ tiến độ có trên máy này. Phần con học trên máy khác sẽ hiện ở đây sau khi hai máy đồng bộ với nhau.",
} as const;

export const BACKUP_NOTE = {
  off: "Tiến độ hiện chỉ nằm trên máy này. Thỉnh thoảng hãy tải một bản sao lưu để giữ lại.",
  on: "Tiến độ còn được lưu trên kho riêng của gia đình bạn. Thỉnh thoảng hãy tải thêm một bản sao lưu để giữ riêng.",
} as const;

export function ReportSourceNote() {
  const syncOn = useSyncOn();
  if (syncOn === undefined) return null;
  return (
    <p className="text-caption text-muted-foreground" data-report-source>
      {REPORT_SOURCE_NOTE[syncOn ? "on" : "off"]}
    </p>
  );
}

// What a "Góp ý" report carries and where it goes, for the parent.
export const FEEDBACK_PRIVACY_NOTE =
  "Góp ý gửi tới người làm app để sửa bài, không kèm tên bé hay mã gia đình.";

export function FeedbackPrivacyNote() {
  return (
    <p className="text-caption text-muted-foreground" data-feedback-privacy>
      {FEEDBACK_PRIVACY_NOTE}
    </p>
  );
}
