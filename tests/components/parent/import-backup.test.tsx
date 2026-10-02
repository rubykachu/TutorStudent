import "fake-indexeddb/auto";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImportBackup } from "@/components/parent/import-backup";
import { BACKUP_IMPORT_MAX_BYTES, LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { listAttempts, listProfiles } from "@/progress/db";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";
import { buildProgressExport } from "@/progress/parent-data";
import { recordAttempt } from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";

const syncNow = vi.fn(async (_options?: unknown) => undefined);
vi.mock("@/sync/request", () => ({ syncNow: (o: unknown) => syncNow(o) }));

const NOW = new Date("2026-10-02T03:00:00.000Z");
const CHILD = "3f9c2a7be1d04c58a6b7f0e2c4d91a35";
const scope = { familyId: LOCAL_FAMILY_ID, childId: CHILD };

beforeEach(() => {
  setNowForTesting(() => NOW);
  syncNow.mockClear();
});

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  setNowForTesting(null);
});

async function backupText(lessonId = "l-one"): Promise<string> {
  const db = appDb();
  const profile = {
    id: CHILD,
    familyId: LOCAL_FAMILY_ID,
    name: "Bé Na",
    avatar: "fox",
    grade: 6,
    series: {},
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
  };
  await db.profiles.put(profile);
  for (const [i, id] of [lessonId, "l-two"].entries()) {
    await recordAttempt(
      db,
      {
        ...scope,
        lessonId: id,
        exerciseId: `${id}.ex.a`,
        cardIds: [`${id}.card.a`],
        firstTryCorrect: true,
        wrongCount: 0,
        context: "practice",
      },
      new Date(NOW.getTime() - (10 - i) * 60_000),
    );
  }
  const text = JSON.stringify(await buildProgressExport(db, profile, NOW));
  await db.delete();
  resetAppDbForTesting();
  return text;
}

function choose(content: string, name = "tien-do.json") {
  const input = screen.getByLabelText("Chọn tệp sao lưu");
  const file = new File([content], name, { type: "application/json" });
  fireEvent.change(input, { target: { files: [file] } });
}

describe("ImportBackup", () => {
  it("shows what the file holds, then imports it and says how many records were added", async () => {
    const text = await backupText();
    render(<ImportBackup />);
    choose(text);
    const sheet = await screen.findByRole("dialog");
    expect(
      within(sheet).getByText("Nhập bản sao lưu của Bé Na?"),
    ).toBeInTheDocument();
    expect(sheet).toHaveTextContent("Của bé: Bé Na (máy sẽ tạo hồ sơ cho bé)");
    expect(sheet).toHaveTextContent("Sao lưu lúc: 10:00 2/10/2026");
    expect(sheet).toHaveTextContent(
      "Có 2 câu đã làm, 0 bài viết, 2 thẻ ôn tập",
    );
    // Looking writes nothing.
    expect(await appDb().profiles.count()).toBe(0);

    fireEvent.click(
      within(sheet).getByRole("button", { name: "Nhập vào máy" }),
    );
    const done = await screen.findByText(/Đã thêm \d+ bản ghi vào máy\./);
    expect(done).toHaveAttribute("data-import-result", "done");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      (await listProfiles(appDb(), LOCAL_FAMILY_ID)).map((p) => p.id),
    ).toEqual([CHILD]);
    expect(await listAttempts(appDb(), scope)).toHaveLength(2);
    expect(syncNow).toHaveBeenCalledWith({ full: true });
  });

  it("says nothing new when the same file is imported again", async () => {
    const text = await backupText();
    render(<ImportBackup />);
    for (const _ of [1, 2]) {
      choose(text);
      fireEvent.click(
        await screen.findByRole("button", { name: "Nhập vào máy" }),
      );
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    }
    expect(
      screen.getByText(
        "Không có gì mới để thêm: bản sao lưu này đã có trên máy.",
      ),
    ).toBeInTheDocument();
    expect(await listAttempts(appDb(), scope)).toHaveLength(2);
  });

  it("tells how many records a later reset kept out", async () => {
    const text = await backupText();
    const db = appDb();
    await db.profiles.put({
      id: CHILD,
      familyId: LOCAL_FAMILY_ID,
      name: "Bé Na",
      avatar: "fox",
      grade: 6,
      series: {},
      createdAt: NOW.toISOString(),
      updatedAt: NOW.toISOString(),
    });
    await resetLessonProgress(db, scope, "l-two", NOW);
    render(<ImportBackup />);
    choose(text);
    fireEvent.click(
      await screen.findByRole("button", { name: "Nhập vào máy" }),
    );
    expect(
      await screen.findByText(/Bỏ qua 2 bản ghi vì bài đó đã được học lại/),
    ).toBeInTheDocument();
    expect((await listAttempts(db, scope)).map((a) => a.lessonId)).toEqual([
      "l-one",
    ]);
  });

  it("does nothing when the preview is cancelled", async () => {
    const text = await backupText();
    render(<ImportBackup />);
    choose(text);
    fireEvent.click(await screen.findByRole("button", { name: "Hủy" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(await appDb().profiles.count()).toBe(0);
    expect(syncNow).not.toHaveBeenCalled();
  });

  it.each([
    ["a file that is not JSON", "{ nope", /không phải bản sao lưu của app/],
    [
      "a file of another format",
      JSON.stringify({ format: "other" }),
      /không phải bản sao lưu của app/,
    ],
    [
      "a newer version",
      JSON.stringify({ format: "tutor-progress", version: 9 }),
      /mới hơn/,
    ],
    [
      "a damaged backup",
      JSON.stringify({ format: "tutor-progress", version: 2 }),
      /bị lỗi nên chưa nhập được/,
    ],
  ])(
    "shows a plain error for %s and writes nothing",
    async (_name, content, pattern) => {
      render(<ImportBackup />);
      choose(content);
      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(pattern);
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(await appDb().profiles.count()).toBe(0);
      expect(syncNow).not.toHaveBeenCalled();
    },
  );

  it("refuses a file over the size limit without reading it", async () => {
    render(<ImportBackup />);
    const input = screen.getByLabelText("Chọn tệp sao lưu");
    const file = new File(["{}"], "big.json", { type: "application/json" });
    Object.defineProperty(file, "size", { value: BACKUP_IMPORT_MAX_BYTES + 1 });
    const read = vi.spyOn(file, "text");
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tệp lớn hơn 5 MB",
    );
    expect(read).not.toHaveBeenCalled();
  });
});
