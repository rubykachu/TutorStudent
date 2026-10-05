import { describe, expect, it } from "vitest";
import {
  hiddenData,
  ISSUE_TITLE_MAX,
  issueBody,
  issueLabels,
  issueTitle,
  lessonLabel,
} from "@/user-feedback/issue";
import { noteText } from "@/user-feedback/sanitize";
import type { FeedbackRecord, FeedbackRequest } from "@/user-feedback/schema";
import { childReport, parentReport } from "./fixtures";

function record(report: FeedbackRequest): FeedbackRecord {
  return {
    schema: "feedback",
    version: 1,
    id: report.id,
    receivedAt: "2026-10-05T20:15:03+07:00",
    family: "a1b2c3d4e5f6",
    app: "5fc3656",
    report,
    forward: {
      state: "pending",
      attempts: 0,
      claimedAt: null,
      lastError: null,
      issue: null,
      url: null,
    },
  };
}

function hidden(body: string): unknown {
  const match = /<!-- feedback-data (.*) -->/.exec(body);
  return JSON.parse(match?.[1] ?? "null");
}

// Everything outside the note's fence and the hidden comment.
function outsideFence(body: string): string {
  return body
    .replace(/```text\n[\s\S]*?\n```/, "")
    .replace(/<!-- feedback-data .* -->/, "");
}

describe("issue format", () => {
  it("renders a parent report with section, item and note", () => {
    const r = record(parentReport());
    expect(issueTitle(r)).toBe(
      "[Góp ý] Sai nội dung hoặc đáp án · Bài 6. Lũy thừa với số mũ tự nhiên · Phần 3",
    );
    expect(issueLabels(r)).toEqual([
      "feedback",
      "nguon:phu-huynh",
      "ly-do:sai-noi-dung",
      "bai:luy-thua",
      "mon:math",
      "lop:6",
      "trang-thai:moi",
    ]);
    expect(issueBody(r)).toBe(
      [
        "**Lý do:** Sai nội dung hoặc đáp án",
        "**Người gửi:** Phụ huynh",
        "**Bài:** Bài 6. Lũy thừa với số mũ tự nhiên (`luy-thua`)",
        "**Phần:** 3. Nhân hai lũy thừa cùng cơ số (`luy-thua.section.nhan-hai-luy-thua`)",
        "**Câu / màn:** Câu hỏi · `luy-thua.ex.tinh-nhanh`",
        "**Ghi chú:**",
        "```text",
        "Đáp án câu b in sai dấu",
        "```",
        "",
        "<sub>Gửi từ app bản `5fc3656` · iPad (iOS) · 05/10/2026 20:15</sub>",
        "",
        '<!-- feedback-data {"v":1,"id":"9f0c2a7be1d04c58a6b7f0e2c4d91a35","lesson":"luy-thua","section":"luy-thua.section.nhan-hai-luy-thua","item":"luy-thua.ex.tinh-nhanh","step":"check-2","screen":"exercise","reason":"sai-noi-dung","source":"phu-huynh","app":"5fc3656","device":{"kind":"ipad","os":"ios"},"family":"a1b2c3d4e5f6","at":"2026-10-05T20:15:03+07:00"} -->',
        "",
      ].join("\n"),
    );
  });

  it("renders a child report from the lesson page", () => {
    const r = record(childReport());
    expect(issueTitle(r)).toBe(
      "[Góp ý] Hay, mình thích · Bài 6. Lũy thừa với số mũ tự nhiên",
    );
    expect(issueLabels(r)[1]).toBe("nguon:be");
    expect(issueBody(r)).toBe(
      [
        "**Lý do:** Hay, mình thích",
        "**Người gửi:** Bé",
        "**Bài:** Bài 6. Lũy thừa với số mũ tự nhiên (`luy-thua`)",
        "**Câu / màn:** Trang bài",
        "",
        "<sub>Gửi từ app bản `5fc3656` · Điện thoại (Android) · 05/10/2026 20:15</sub>",
        "",
        '<!-- feedback-data {"v":1,"id":"9f0c2a7be1d04c58a6b7f0e2c4d91a35","lesson":"luy-thua","section":null,"item":null,"step":null,"screen":"lesson","reason":"thich","source":"be","app":"5fc3656","device":{"kind":"phone","os":"android"},"family":"a1b2c3d4e5f6","at":"2026-10-05T20:15:03+07:00"} -->',
        "",
      ].join("\n"),
    );
  });

  it("leaves nothing hostile outside the fence and keeps the hidden block intact", () => {
    const hostileTitles = [
      "[x](https://evil.example) ![i](https://evil.example/a.png)",
      "https://evil.example www.evil.example",
      "<script>alert(1)</script> --> @user ```",
      `a‮b\u0000c ${"y".repeat(200)}`,
    ];
    const hostileNote = `@user [x](https://e.x) <img src=x> --> \`\`\`\n\`\`\`js\n${"z".repeat(10_000)}`;
    for (const title of hostileTitles) {
      const r = record(
        parentReport({
          lessonTitle: title.slice(0, 120),
          sectionTitle: title.slice(0, 120),
          note: noteText(hostileNote),
        }),
      );
      const body = issueBody(r);
      const outside = outsideFence(body);
      expect(outside).not.toMatch(/[[\]!@]|<(?!sub>|\/sub>)|:\/\/|www\./);
      expect(outside.match(/```/g)).toBeNull();
      expect(body.match(/```/g)).toHaveLength(2);
      expect(hidden(body)).toEqual(hiddenData(r));
      expect(issueTitle(r).length).toBeLessThanOrEqual(ISSUE_TITLE_MAX);
    }
  });

  it("shortens a lesson label past 50 characters, stably", () => {
    const slug = "hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can";
    expect(slug).toHaveLength(53);
    const label = lessonLabel(slug);
    expect(label).toHaveLength(50);
    expect(label).toBe(lessonLabel(slug));
    expect(label.startsWith(`bai:${slug.slice(0, 39)}-`)).toBe(true);
    expect(lessonLabel("luy-thua")).toBe("bai:luy-thua");
  });
});
