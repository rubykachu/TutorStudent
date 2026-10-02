import "fake-indexeddb/auto";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SyncStatus } from "@/components/parent/sync-status";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { putProfile } from "@/progress/db";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";
import { recordAttempt } from "@/progress/record";
import { docHash } from "@/sync/hash";
import { readChildDoc, readProfileDoc } from "@/sync/local";
import {
  childStateScope,
  profileStateScope,
  readSyncFamily,
  updateSyncState,
  writeSyncFamily,
} from "@/sync/state";

const syncNow = vi.fn(async (_options?: unknown) => undefined);
vi.mock("@/sync/request", () => ({ syncNow: (o: unknown) => syncNow(o) }));

const FAMILY = "nha-minh";
const CHILD = "kid-1";
const NOW = new Date("2026-10-02T03:00:00.000Z");
const TIME = NOW.toISOString();

beforeEach(() => {
  setNowForTesting(() => NOW);
  syncNow.mockClear();
});

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  setNowForTesting(null);
});

// A device that synced everything at `lastSyncAt`, then optionally got one
// answer afterwards (records not sent yet).
async function seed(
  options: {
    profileError?: string | null;
    childError?: string | null;
    lastSyncAt?: string | null;
    docBytes?: number | null;
    unsent?: boolean;
  } = {},
) {
  const db = appDb();
  await putProfile(db, {
    id: CHILD,
    familyId: LOCAL_FAMILY_ID,
    name: "Na",
    avatar: "owl",
    grade: 6,
    series: {},
    createdAt: TIME,
    updatedAt: TIME,
  });
  await writeSyncFamily(db, FAMILY);
  const lastSyncAt =
    options.lastSyncAt === undefined ? TIME : options.lastSyncAt;
  const profileHash = docHash("profile", await readProfileDoc(db, FAMILY));
  const childHash = docHash("child", await readChildDoc(db, CHILD, FAMILY));
  await updateSyncState(db, profileStateScope, (state) => ({
    ...state,
    syncedHash: profileHash,
    lastSyncAt,
    lastError: options.profileError ?? null,
  }));
  await updateSyncState(db, childStateScope(CHILD), (state) => ({
    ...state,
    syncedHash: childHash,
    lastSyncAt,
    lastError: options.childError ?? null,
    docBytes: options.docBytes ?? 2_000,
  }));
  if (options.unsent) {
    await recordAttempt(
      db,
      {
        familyId: LOCAL_FAMILY_ID,
        childId: CHILD,
        lessonId: "l-one",
        exerciseId: "l-one.ex.a",
        cardIds: ["l-one.card.a"],
        firstTryCorrect: true,
        wrongCount: 0,
        context: "practice",
      },
      NOW,
    );
  }
}

const messageIds = () =>
  [...document.querySelectorAll("[data-sync-message]")].map((el) =>
    el.getAttribute("data-sync-message"),
  );

describe("SyncStatus", () => {
  it("shows nothing on a device that has not reached a sync server", async () => {
    const { container } = render(<SyncStatus />);
    await act(async () => undefined);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the last sync time in Vietnam time and no message when all is in step", async () => {
    await seed();
    render(<SyncStatus />);
    expect(await screen.findByText(/Đồng bộ lần cuối:/)).toHaveTextContent(
      "Đồng bộ lần cuối: 10:00 2/10/2026",
    );
    expect(messageIds()).toEqual([]);
    expect(document.querySelector("[data-sync-guard]")).toBeNull();
  });

  it("says when nothing has synced yet", async () => {
    await seed({ lastSyncAt: null });
    render(<SyncStatus />);
    expect(
      await screen.findByText("Đồng bộ lần cuối: chưa lần nào"),
    ).toBeInTheDocument();
  });

  it.each([
    [
      "records unsent for more than a day",
      { unsent: true, lastSyncAt: "2026-09-30T03:00:00.000Z" },
      "stale",
    ],
    [
      "a cookie that was rejected",
      { profileError: "unauthorized" },
      "unauthorized",
    ],
    ["an app that is too old", { childError: "too-new" }, "app-too-old"],
    ["a doc that is too large", { childError: "too-large" }, "too-large"],
    ["a main doc past 70% of the cap", { docBytes: 800_000 }, "near-limit"],
  ] as const)("shows the message for %s", async (_name, options, id) => {
    await seed(options);
    render(<SyncStatus />);
    await waitFor(() => expect(messageIds()).toEqual([id]));
    if (id === "unauthorized") {
      expect(screen.getByRole("link", { name: "Nhập lại mã" })).toHaveAttribute(
        "href",
        "/unlock",
      );
    }
  });

  it("does not warn about records unsent for less than a day", async () => {
    await seed({ unsent: true, lastSyncAt: "2026-10-01T22:00:00.000Z" });
    render(<SyncStatus />);
    await screen.findByText(/Đồng bộ lần cuối:/);
    expect(messageIds()).toEqual([]);
  });

  describe("family switch guard", () => {
    it("offers only the backup while progress is unsent", async () => {
      await seed({ profileError: "family-mismatch", unsent: true });
      render(<SyncStatus />);
      const guard = await waitFor(() => {
        const el = document.querySelector("[data-sync-guard]");
        if (!el) throw new Error("no guard");
        return el as HTMLElement;
      });
      expect(guard).toHaveAttribute("data-sync-guard", "unsent");
      expect(
        within(guard).getByText(
          "Máy này còn tiến độ chưa gửi của gia đình khác. Tải bản sao lưu trước khi đổi.",
        ),
      ).toBeInTheDocument();
      expect(
        await within(guard).findByRole("button", {
          name: /Tải bản sao lưu của Na/,
        }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Dùng máy này cho gia đình mới" }),
      ).toBeNull();
    });

    it("clears the device after two confirmations and pulls the new family", async () => {
      await seed({ profileError: "family-mismatch" });
      render(<SyncStatus />);
      fireEvent.click(
        await screen.findByRole("button", {
          name: "Dùng máy này cho gia đình mới",
        }),
      );
      const sheet = await screen.findByRole("dialog");
      fireEvent.click(within(sheet).getByRole("button", { name: "Tiếp tục" }));
      expect(
        await screen.findByText("Xoá dữ liệu trên máy này?"),
      ).toBeInTheDocument();
      expect(await appDb().profiles.count()).toBe(1);
      fireEvent.click(
        screen.getByRole("button", { name: "Xoá và dùng cho gia đình mới" }),
      );
      await waitFor(() => expect(syncNow).toHaveBeenCalledWith({ full: true }));
      expect(await appDb().profiles.count()).toBe(0);
      expect(await readSyncFamily(appDb())).toBeNull();
    });

    it.each([
      ["the first step", 0],
      ["the second step", 1],
    ])("deletes nothing when cancelled at %s", async (_name, steps) => {
      await seed({ profileError: "family-mismatch" });
      render(<SyncStatus />);
      fireEvent.click(
        await screen.findByRole("button", {
          name: "Dùng máy này cho gia đình mới",
        }),
      );
      const sheet = await screen.findByRole("dialog");
      if (steps === 1) {
        fireEvent.click(
          within(sheet).getByRole("button", { name: "Tiếp tục" }),
        );
      }
      fireEvent.click(await screen.findByRole("button", { name: "Hủy" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      expect(await appDb().profiles.count()).toBe(1);
      expect(await readSyncFamily(appDb())).toBe(FAMILY);
      expect(syncNow).not.toHaveBeenCalled();
    });
  });
});
