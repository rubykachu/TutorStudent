import "fake-indexeddb/auto";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SectionPlayer } from "@/learn/section-player";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { type ChildScope, SECTION_START, TutorDb } from "@/progress/db";
import { learnIndex, learnLesson, SECTION_ID } from "./helpers";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
// A real pick screen: pick the greatest common divisor, 4, of 20 and 24.
const PICK = "uoc-chung-uoc-chung-lon-nhat.visual.chon-uclnn-20-24";

let db: TutorDb;
beforeEach(() => {
  db = new TutorDb();
});
afterEach(async () => {
  cleanup();
  // Dexie runs transactions in start order: once this read is back, every
  // position save of the player has finished.
  await db.sectionProgress.count();
  await db.delete();
});

function renderGuided() {
  const base = learnLesson();
  const [section] = base.sections;
  if (!section) throw new Error("section missing");
  const index = learnIndex({
    sections: [
      {
        ...section,
        blocks: [
          { type: "note", text: "Khối trước" },
          { type: "visual", visualId: PICK },
          { type: "note", text: "Khối sau" },
        ],
      },
    ],
  });
  const target = index.sectionById.get(SECTION_ID);
  if (!target) throw new Error("section missing");
  return render(
    <SectionPlayer
      db={db}
      index={index}
      section={target}
      scope={scope}
      initialPosition={SECTION_START}
    />,
  );
}

const button = (name: string | RegExp) => screen.getByRole("button", { name });
const next = () => button("Tiếp");

describe("a guided theory screen", () => {
  it("keeps Tiếp off until the child picks right, with feedback on each pick", async () => {
    renderGuided();
    expect(next()).toBeEnabled();
    fireEvent.click(next());
    await screen.findByRole("button", { name: "Xem cách làm" });
    expect(next()).toBeDisabled();

    // Taking 1, 2, 5 in turn never counts "3/1": each pick replaces the last.
    for (const name of ["1", "2", "5"]) {
      fireEvent.click(button(name));
      expect(screen.queryByText(/3\/1/)).toBeNull();
    }
    expect(next()).toBeDisabled();
    expect(button("5")).toHaveAttribute("data-wrong");
    expect(screen.getByText(/Chưa đúng/)).toBeInTheDocument();

    // The greatest common divisor of 20 and 24 is 4.
    fireEvent.click(button("4"));
    expect(screen.getByText(/đúng ước chung lớn nhất/)).toBeInTheDocument();
    expect(next()).toBeEnabled();
  });

  it("lets Xem cách làm show the answer and go on", async () => {
    renderGuided();
    fireEvent.click(next());
    fireEvent.click(
      await screen.findByRole("button", { name: "Xem cách làm" }),
    );
    expect(next()).toBeEnabled();
    expect(button("4")).toHaveClass("bg-correct");
    fireEvent.click(next());
    expect(screen.getByText("Khối sau")).toBeInTheDocument();
  });

  it("does not hold a screen that is looked at again", async () => {
    renderGuided();
    fireEvent.click(next());
    fireEvent.click(
      await screen.findByRole("button", { name: "Xem cách làm" }),
    );
    fireEvent.click(next());
    expect(screen.getByText("Khối sau")).toBeInTheDocument();
    // Back to the pick screen: it was passed, so Tiếp works at once.
    fireEvent.click(screen.getByRole("button", { name: /Quay lại/ }));
    expect(next()).toBeEnabled();
  });
});
