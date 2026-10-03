import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SESSION_API_PATH } from "@/access/gate";
import {
  FAMILY_CODE_NOTE,
  FAMILY_CODE_TITLE,
  FamilyCodePanel,
} from "@/components/parent/family-code-panel";

const CODE = "OWL4K7MQ-9QX2P8RT";

function answer(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => Response.json(body, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("FamilyCodePanel", () => {
  it("shows the code the server gives for this device's cookie", async () => {
    const fetchMock = answer(200, { familyId: "OWL4K7MQ", code: CODE });
    render(<FamilyCodePanel />);
    const panel = await screen.findByRole("region", {
      name: FAMILY_CODE_TITLE,
    });
    expect(panel).toHaveTextContent(CODE);
    expect(panel).toHaveTextContent(FAMILY_CODE_NOTE);
    expect(fetchMock).toHaveBeenCalledWith(SESSION_API_PATH, {
      cache: "no-store",
    });
  });

  it("copies the code and says so", async () => {
    answer(200, { familyId: "OWL4K7MQ", code: CODE });
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<FamilyCodePanel />);
    fireEvent.click(await screen.findByRole("button", { name: "Chép mã" }));
    await screen.findByRole("button", { name: "Đã chép mã" });
    expect(writeText).toHaveBeenCalledWith(CODE);
  });

  it("shows nothing without a gate, without a cookie or offline", async () => {
    for (const setup of [
      () => answer(404, { error: "no-gate" }),
      () => answer(401, { error: "unauthorized" }),
      () =>
        vi.stubGlobal(
          "fetch",
          vi.fn(async () => {
            throw new TypeError("offline");
          }),
        ),
    ]) {
      setup();
      const { container, unmount } = render(<FamilyCodePanel />);
      await waitFor(() => expect(fetch).toHaveBeenCalled());
      expect(container).toBeEmptyDOMElement();
      unmount();
    }
  });
});
