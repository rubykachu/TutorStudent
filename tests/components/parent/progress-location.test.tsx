import "fake-indexeddb/auto";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BACKUP_NOTE,
  REPORT_SOURCE_NOTE,
  ReportSourceNote,
} from "@/components/parent/progress-location";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";
import { writeSyncFamily } from "@/sync/state";

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
});

describe("where the parent page says progress lives", () => {
  it("says it is on this device only while the device does not sync", async () => {
    render(<ReportSourceNote />);
    expect(await screen.findByText(REPORT_SOURCE_NOTE.off)).toBeInTheDocument();
  });

  it("says other devices show up after they sync once the device syncs", async () => {
    await writeSyncFamily(appDb(), "nha-minh");
    render(<ReportSourceNote />);
    expect(await screen.findByText(REPORT_SOURCE_NOTE.on)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(REPORT_SOURCE_NOTE.off)).toBeNull(),
    );
  });

  it("keeps the two backup sentences apart and neither claims the other's fact", () => {
    expect(BACKUP_NOTE.off).toContain("chỉ nằm trên máy này");
    expect(BACKUP_NOTE.on).not.toContain("chỉ nằm trên máy này");
    expect(REPORT_SOURCE_NOTE.on).not.toContain("chưa hiện");
  });
});
