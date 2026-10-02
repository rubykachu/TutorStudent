import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearMediaNetworkFailure,
  isNetworkError,
  reportMediaNetworkFailure,
  resetNetworkStatusForTesting,
  useNetworkStatus,
} from "@/lib/network-status";

function Probe() {
  const { offline, recheck } = useNetworkStatus();
  return (
    <button type="button" onClick={recheck}>
      {offline ? "offline" : "online"}
    </button>
  );
}

function setOnLine(value: boolean) {
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(value);
}

afterEach(() => {
  cleanup();
  resetNetworkStatusForTesting();
  vi.restoreAllMocks();
});

describe("useNetworkStatus", () => {
  it("is online when the browser says so and no download failed", () => {
    render(<Probe />);
    expect(screen.getByRole("button").textContent).toBe("online");
  });

  it("follows the browser's offline and online events", () => {
    render(<Probe />);
    setOnLine(false);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByRole("button").textContent).toBe("offline");
    setOnLine(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.getByRole("button").textContent).toBe("online");
  });

  it("is offline after a media download failed while the browser still says online", () => {
    render(<Probe />);
    act(() => reportMediaNetworkFailure());
    expect(screen.getByRole("button").textContent).toBe("offline");
  });

  it("forgets a failure on the online event, when the page shows again, on a tap and on a success", () => {
    render(<Probe />);
    const failAgain = () => act(() => reportMediaNetworkFailure());

    failAgain();
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.getByRole("button").textContent).toBe("online");

    failAgain();
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(screen.getByRole("button").textContent).toBe("online");

    failAgain();
    act(() => screen.getByRole("button").click());
    expect(screen.getByRole("button").textContent).toBe("online");

    failAgain();
    act(() => clearMediaNetworkFailure());
    expect(screen.getByRole("button").textContent).toBe("online");
  });

  it("shares one answer between every user of the hook", () => {
    render(
      <>
        <Probe />
        <Probe />
      </>,
    );
    act(() => reportMediaNetworkFailure());
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual([
      "offline",
      "offline",
    ]);
  });

  it("stops listening when the last user unmounts", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Probe />);
    unmount();
    expect(remove).toHaveBeenCalledWith("online", expect.any(Function));
  });
});

describe("isNetworkError", () => {
  it("is a TypeError, not an HTTP error or an abort", () => {
    expect(isNetworkError(new TypeError("Failed to fetch"))).toBe(true);
    expect(isNetworkError(new Error("HTTP 404"))).toBe(false);
    expect(isNetworkError(new DOMException("aborted", "AbortError"))).toBe(
      false,
    );
  });
});
