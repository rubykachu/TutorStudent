import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiNoi from "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/ai-noi";
import ChamTu from "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/cham-tu";
import TramNghin from "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/tram-nghin";
import TruocSau from "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/truoc-sau";
import XichLaiGan from "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/xich-lai-gan";

describe("neu-cau-muon-co-mot-nguoi-ban visuals", () => {
  it("reveals who says a line only once its bubble is tapped", () => {
    render(<AiNoi />);
    const bubble = screen.getByRole("button", { name: /Bạn là ai\?/ });
    expect(bubble).toHaveAttribute("aria-pressed", "false");
    expect(bubble).not.toHaveTextContent("Hoàng tử bé");
    fireEvent.click(bubble);
    expect(bubble).toHaveAttribute("aria-pressed", "true");
    expect(bubble).toHaveTextContent("Hoàng tử bé");
  });

  it("marks the one unique face after taming and can start over", () => {
    render(<TramNghin />);
    expect(screen.getAllByText("một trong trăm nghìn")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Cảm hoá" }));
    expect(screen.getAllByText("duy nhất trên đời")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Xem lại" }));
    expect(screen.getAllByText("một trong trăm nghìn")).toHaveLength(2);
  });

  it("switches the fox's life between before and after taming", () => {
    render(<TruocSau />);
    expect(screen.getByText("trốn vào lòng đất")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Đã cảm hoá/ }));
    expect(
      screen.getByText("ra khỏi hang, như tiếng nhạc"),
    ).toBeInTheDocument();
    expect(screen.queryByText("trốn vào lòng đất")).toBeNull();
  });

  it("steps through the days without going past the first or last", () => {
    render(<XichLaiGan />);
    const before = screen.getByRole("button", { name: /Ngày trước/ });
    const after = screen.getByRole("button", { name: /Ngày sau/ });
    expect(before).toBeDisabled();
    for (let i = 0; i < 3; i++) fireEvent.click(after);
    expect(screen.getByText("Ngày 4")).toBeInTheDocument();
    expect(after).toBeDisabled();
  });

  it("names a word's kind once tapped", () => {
    render(<ChamTu />);
    const word = screen.getByRole("button", { name: /xinh xắn/ });
    expect(word).not.toHaveTextContent("Từ láy");
    fireEvent.click(word);
    expect(word).toHaveTextContent("Từ láy");
  });
});
