import { expect } from "@playwright/test";
import { test } from "./test";

// The dev server runs with CONTENT_INCLUDE_FIXTURE=1, so the emitted static
// content lists the fixture lesson and serves it whole. The index names every
// subject, hidden ones included: only the screens' lists leave them out.
test("static content lists and serves the fixture lesson", async ({
  request,
}) => {
  const index = await request.get("/content/index.json");
  expect(index.ok()).toBe(true);
  const body = await index.json();
  expect(body.subjects.map((s: { id: string }) => s.id)).toEqual([
    "math",
    "literature",
    "geography",
    "history",
    "science",
  ]);
  expect(body.lessons.map((l: { id: string }) => l.id)).toContain("fixture");

  const lesson = await request.get("/content/fixture.json");
  expect(lesson.ok()).toBe(true);
  expect((await lesson.json()).exercises).toHaveLength(12);
});
