"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { appDb } from "@/progress/hooks";
import { childStateScope, readSyncState } from "@/sync/state";
import { formatMonthKey } from "./format";

// A line under the study totals while months of this child's history are
// still coming from the family's storage on a new device: the totals grow as
// older months arrive. Gone once every listed month is here.
export function HistoryLoading({ childId }: { childId: string }) {
  const months = useLiveQuery(
    async () => (await readSyncState(appDb(), childStateScope(childId))).months,
    [childId],
  );
  if (!months) return null;
  const entries = Object.entries(months);
  if (entries.every(([, state]) => state.applied)) return null;
  const earliest = entries
    .filter(([, state]) => state.applied)
    .map(([month]) => month)
    .sort()[0];
  return (
    <p
      role="status"
      data-history-loading
      className="px-1 text-caption text-muted-foreground"
    >
      Đang tải lịch sử học…
      {earliest !== undefined &&
        ` (đã có từ tháng ${formatMonthKey(earliest)})`}
    </p>
  );
}
