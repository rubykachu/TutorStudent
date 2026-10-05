import "fake-indexeddb/auto";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PARENT_PIN_MAX_FAILS } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";
import { savePin } from "@/progress/parent-pin";
import {
  closeParentSession,
  openParentSession,
  parentSessionSnapshot,
} from "@/progress/parent-session";
import { lessonFeedbackContext } from "@/user-feedback/context";
import { FeedbackSheet } from "@/user-feedback/feedback-sheet";
import type { FeedbackRequest } from "@/user-feedback/schema";
import { learnLesson } from "../learn/helpers";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const context = lessonFeedbackContext(learnLesson(), "lesson");
const NOW = new Date("2026-10-05T14:00:00.000Z");

afterEach(async () => {
  closeParentSession();
  await appDb().delete();
  resetAppDbForTesting();
  setNowForTesting(null);
});

function open() {
  const send = vi.fn((_report: FeedbackRequest) => Promise.resolve());
  render(
    <FeedbackSheet
      context={context}
      sent={new Set()}
      onSent={() => {}}
      onClose={() => {}}
      send={send}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Phụ huynh góp ý kèm ghi chú" }),
  );
  return send;
}

async function enterPin(pin: string) {
  fireEvent.change(await screen.findByLabelText("Nhập PIN"), {
    target: { value: pin },
  });
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Tiếp tục" })),
  );
}

describe("parent feedback", () => {
  it("offers no note without a PIN on the device", async () => {
    open();
    expect(
      await screen.findByText(
        "Đặt PIN ở trang phụ huynh để góp ý kèm ghi chú.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Mở trang phụ huynh" }),
    ).toHaveAttribute("href", "/parent");
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("asks the PIN even with the parent page open, and leaves its session alone", async () => {
    setNowForTesting(() => NOW);
    await savePin(appDb(), "2468");
    openParentSession(NOW);
    const before = parentSessionSnapshot();
    const send = open();
    expect(await screen.findByLabelText("Nhập PIN")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
    await enterPin("2468");
    expect(
      await screen.findByRole("textbox", { name: "Ghi chú (không bắt buộc)" }),
    ).toBeInTheDocument();
    expect(parentSessionSnapshot()).toBe(before);

    const submit = screen.getByRole("button", { name: "Gửi góp ý" });
    expect(submit).toBeDisabled();
    fireEvent.click(
      screen.getByRole("radio", { name: "Sai nội dung hoặc đáp án" }),
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: " Câu b sai dấu " },
    });
    await act(async () => fireEvent.click(submit));
    expect(send.mock.calls[0]?.[0]).toMatchObject({
      ...context,
      reason: "sai-noi-dung",
      source: "phu-huynh",
      note: "Câu b sai dấu",
    });
    expect(screen.getByRole("status").textContent).toBe(
      "Đã gửi. Cảm ơn bạn đã góp ý!",
    );
  });

  it("locks after five wrong PINs like the parent page", async () => {
    setNowForTesting(() => NOW);
    await savePin(appDb(), "2468");
    open();
    for (let i = 1; i < PARENT_PIN_MAX_FAILS; i++) {
      await enterPin("1111");
      await waitFor(() =>
        expect(screen.getByRole("alert").textContent).toContain(
          `Còn ${PARENT_PIN_MAX_FAILS - i} lần thử`,
        ),
      );
    }
    await enterPin("1111");
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain("tạm khoá"),
    );
    expect(screen.queryByLabelText("Nhập PIN")).toBeNull();
  });

  it("caps the note at 500 and announces only near the limit", async () => {
    await savePin(appDb(), "2468");
    open();
    await enterPin("2468");
    const note = await screen.findByRole("textbox");
    const announce = () =>
      document.querySelector("[data-note-announce]")?.textContent;
    fireEvent.change(note, { target: { value: "a".repeat(449) } });
    expect(announce()).toBe("");
    expect(document.querySelector("[data-note-counter]")?.textContent).toBe(
      "449/500",
    );
    fireEvent.change(note, { target: { value: "a".repeat(450) } });
    expect(announce()).toBe("Sắp đủ 500 ký tự");
    fireEvent.change(note, { target: { value: "a".repeat(600) } });
    expect(note).toHaveValue("a".repeat(500));
    expect(announce()).toBe("Đã đủ 500 ký tự");
  });
});
