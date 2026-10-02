import "fake-indexeddb/auto";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewPlayer } from "@/learn/review-player";
import { SectionPlayer } from "@/learn/section-player";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { type ChildScope, SECTION_START, TutorDb } from "@/progress/db";
import { recordAttempt } from "@/progress/record";
import { applyChildDoc, readChildDoc } from "@/sync/local";
import { childStateScope, PENDING_MONTH, updateSyncState } from "@/sync/state";
import { CARD_A, LESSON_ID, learnIndex, SECTION_ID } from "./helpers";

const requestSync = vi.fn();
vi.mock("@/sync/request", () => ({ requestSync: () => requestSync() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const AT = new Date("2026-03-02T01:00:00Z");

let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
  requestSync.mockClear();
  let tick = 0;
  setNowForTesting(() => new Date(AT.getTime() + 1000 * tick++));
});

afterEach(async () => {
  await db.delete();
  setNowForTesting(null);
});

function tap(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function renderSection() {
  const index = learnIndex();
  const section = index.sectionById.get(SECTION_ID);
  if (!section) throw new Error("section missing");
  return render(
    <SectionPlayer
      db={db}
      index={index}
      section={section}
      scope={scope}
      initialPosition={SECTION_START}
    />,
  );
}

async function answer(question: string, options: string[]) {
  for (const option of options) {
    tap(option);
    tap("Kiểm tra");
  }
  tap("Tiếp");
  await waitFor(() => expect(screen.queryByText(question)).toBeNull());
}

const SYNC_TEXT = /đồng bộ|sync|đám mây|cloud/i;

describe("sync triggers on the learning screens", () => {
  it("asks for a sync once when a section is finished, and shows nothing about it", async () => {
    renderSection();
    tap("Tiếp");
    tap("Tiếp");
    await answer("Câu kiểm tra", ["Sai", "Đúng"]);
    await answer("Câu luyện A", ["Sai", "Đúng"]);
    await answer("Câu luyện B", ["Đúng"]);
    expect(requestSync).not.toHaveBeenCalled();
    tap("Xong phần");
    expect(await screen.findByText("Giỏi quá!")).toBeInTheDocument();
    expect(requestSync).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).not.toMatch(SYNC_TEXT);
  });

  it("opens the section and the review while old months are still pending", async () => {
    await updateSyncState(db, childStateScope(scope.childId), (state) => ({
      ...state,
      months: { "2026-07": PENDING_MONTH },
    }));
    renderSection();
    expect(screen.getByText("Khối thứ nhất")).toBeInTheDocument();
    cleanup();
    render(
      <ReviewPlayer
        db={db}
        index={learnIndex()}
        scope={scope}
        onAgain={vi.fn()}
      />,
    );
    await waitFor(() =>
      expect(document.querySelector("[data-review-step]")).not.toBeNull(),
    );
  });

  it("stays on its screen when a synced doc moves the section's position", async () => {
    renderSection();
    tap("Tiếp");
    expect(screen.getByText("Khối thứ hai")).toBeInTheDocument();
    await waitFor(async () =>
      expect(
        (
          await db.sectionProgress.get([
            scope.familyId,
            scope.childId,
            SECTION_ID,
          ])
        )?.position,
      ).toEqual({ phase: "blocks", index: 1 }),
    );

    const doc = await readChildDoc(db, scope.childId, "fam");
    doc.sections = doc.sections.map((s) => ({
      ...s,
      position: { phase: "practice", index: 1 },
      updatedAt: "2030-01-01T00:00:00.000Z",
    }));
    await applyChildDoc(db, doc);
    expect(
      (
        await db.sectionProgress.get([
          scope.familyId,
          scope.childId,
          SECTION_ID,
        ])
      )?.position,
    ).toEqual({ phase: "practice", index: 1 });

    expect(screen.getByText("Khối thứ hai")).toBeInTheDocument();
    expect(screen.queryByText("Câu luyện B")).toBeNull();
  });

  it("asks for a sync once when a review session ends, not before", async () => {
    await recordAttempt(
      db,
      {
        ...scope,
        lessonId: LESSON_ID,
        context: "practice",
        exerciseId: `${LESSON_ID}.ex.luyen-a`,
        cardIds: [CARD_A],
        firstTryCorrect: true,
        wrongCount: 0,
      },
      AT,
    );
    render(
      <ReviewPlayer
        db={db}
        index={learnIndex()}
        scope={scope}
        onAgain={vi.fn()}
        random={() => 0}
      />,
    );
    expect(await screen.findByText("Câu luyện A")).toBeInTheDocument();
    expect(requestSync).not.toHaveBeenCalled();
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    expect(await screen.findByText("Ôn xong rồi!")).toBeInTheDocument();
    expect(requestSync).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).not.toMatch(SYNC_TEXT);
  });
});
