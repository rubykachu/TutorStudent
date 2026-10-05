import "fake-indexeddb/auto";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SectionPlayer } from "@/learn/section-player";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { type ChildScope, SECTION_START, TutorDb } from "@/progress/db";
import type { FeedbackRequest } from "@/user-feedback/schema";
import { LESSON_ID, learnIndex, SECTION_ID } from "./helpers";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
const { sendFeedback } = vi.hoisted(() => ({
  sendFeedback: vi.fn((_report: unknown) => Promise.resolve()),
}));
vi.mock("@/user-feedback/client", () => ({ sendFeedback }));

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
  sendFeedback.mockClear();
  setNowForTesting(() => new Date("2026-03-02T01:00:00Z"));
});
afterEach(async () => {
  await db.delete();
  setNowForTesting(null);
});

function renderPlayer() {
  const index = learnIndex();
  const section = index.sectionById.get(SECTION_ID);
  if (!section) throw new Error("section missing");
  render(
    <SectionPlayer
      db={db}
      index={index}
      section={section}
      scope={scope}
      initialPosition={SECTION_START}
    />,
  );
}

const tap = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name }));

async function report(reason: RegExp): Promise<FeedbackRequest> {
  tap("Góp ý về bài này");
  await act(async () => tap(reason));
  tap("Học tiếp");
  return sendFeedback.mock.calls.at(-1)?.[0] as FeedbackRequest;
}

describe("SectionPlayer feedback", () => {
  it("reports the screen shown and keeps the exercise in progress", async () => {
    renderPlayer();
    expect(await report(/Khó hiểu/)).toMatchObject({
      screen: "block",
      section: SECTION_ID,
      sectionNumber: 1,
      step: "blocks-0",
      item: null,
    });
    tap("Tiếp");
    tap("Tiếp");
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    await screen.findByText("Câu luyện A");
    // A wrong check on the practice question.
    tap("Sai");
    tap("Kiểm tra");
    const live = () =>
      document.querySelector("[data-live-step] [data-exercise] section");
    expect(live()).toHaveAttribute("data-phase", "wrong1");
    expect(await report(/Sai nội dung/)).toMatchObject({
      screen: "exercise",
      item: `${LESSON_ID}.ex.luyen-a`,
      step: "practice-0",
    });
    expect(live()).toHaveAttribute("data-phase", "wrong1");

    // Looking back: the report is about the screen shown.
    tap("Quay lại");
    expect(await report(/Khó hiểu/)).toMatchObject({
      screen: "exercise",
      item: `${LESSON_ID}.ex.kiem-tra`,
      step: "check-0",
    });
  });
});
