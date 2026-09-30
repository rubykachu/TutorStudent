import type { Page } from "@playwright/test";
import type { Lesson } from "@/schema/content";

// Test-only changes to the served fixture lesson, made by intercepting its
// JSON, so specs can reach renderer paths the committed fixture leaves out
// (a lesson video, a recorded overview narration) without media files.

type LessonPatch = (lesson: Lesson) => void;

export async function patchFixtureLesson(page: Page, patch: LessonPatch) {
  await page.route("**/content/fixture.json", async (route) => {
    const response = await route.fetch();
    const lesson = (await response.json()) as Lesson;
    patch(lesson);
    await route.fulfill({ response, json: lesson });
  });
}

export const FIXTURE_VIDEO_ID = "fixture.video.gioi-thieu";

// A lesson video at the start of the first section, with a clip for `cardId`
// so a review recap of that card offers "Xem lại đoạn video".
export function withVideo(cardId: string): LessonPatch {
  return (lesson) => {
    lesson.videos = [
      {
        id: FIXTURE_VIDEO_ID,
        lessonId: lesson.id,
        url: "video/fixture/gioi-thieu.mp4",
        vttUrl: "video/fixture/gioi-thieu.vtt",
        posterUrl: "video/fixture/gioi-thieu.jpg",
        durationSec: 30,
        clips: [{ id: "phep-nhan", start: 0, end: 10, cardIds: [cardId] }],
        voice: { engine: "local", voiceName: "Hải Đăng", model: "test" },
      },
    ];
    lesson.sections[0]?.blocks.unshift({
      type: "video",
      videoId: FIXTURE_VIDEO_ID,
    });
  };
}

const NARRATION_AUDIO = "narration/fixture/overview.m4a";
const NARRATION_VTT = "narration/fixture/overview.vtt";

// A mono 16-bit WAV of silence, standing in for the narration audio.
function silentWav(seconds: number): Buffer {
  const rate = 8000;
  const data = Buffer.alloc(rate * seconds * 2);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// A recorded narration on the fixture's overview: `vtt` is served as its
// captions and silence as its audio.
export async function withNarration(page: Page, vtt: string) {
  await patchFixtureLesson(page, (lesson) => {
    if (lesson.overview) {
      lesson.overview.narration = {
        audioUrl: NARRATION_AUDIO,
        vttUrl: NARRATION_VTT,
      };
    }
  });
  await page.route(`**/media/${NARRATION_VTT}`, (route) =>
    route.fulfill({ contentType: "text/vtt", body: vtt }),
  );
  await page.route(`**/media/${NARRATION_AUDIO}`, (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav(20) }),
  );
}
