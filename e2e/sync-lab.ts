import { randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  type Browser,
  type BrowserContext,
  expect,
  type Page,
} from "@playwright/test";
import { createProfile } from "./flows";
import { SILENCE_MEDIA_SCRIPT } from "./silence";
import {
  e2eFamilyCode,
  SYNC_BASE_URL,
  SYNC_FAMILIES,
  type SyncFamily,
  syncStoreDir,
  TARGET_DEVICES,
  type TargetDeviceName,
} from "./targets";

// Helpers of the multi-device sync E2E: a device is a browser context with its
// own storage, unlocked for one family; the store is the folder the sync
// server writes to, read straight from disk.

// How many scenario slots each target owns; slot `n` of the second target
// starts after the first target's.
const SLOTS_PER_TARGET = 8;
const TARGETS = Object.keys(TARGET_DEVICES) as TargetDeviceName[];

export function familyFor(target: string, scenario: number): SyncFamily {
  const slot = TARGETS.indexOf(target as TargetDeviceName) * SLOTS_PER_TARGET;
  const family = SYNC_FAMILIES[slot + scenario - 1];
  if (!family) throw new Error(`No family for ${target} scenario ${scenario}`);
  return family;
}

// A family that no scenario studies in, one per target.
export function strangerFor(target: string): SyncFamily {
  const family =
    SYNC_FAMILIES[
      TARGETS.length * SLOTS_PER_TARGET +
        TARGETS.indexOf(target as TargetDeviceName)
    ];
  if (!family) throw new Error(`No stranger family for ${target}`);
  return family;
}

// ---------------------------------------------------------------------------
// The store, as the server wrote it

const ENV_PREFIX = "dev";

function storedDoc(family: SyncFamily, ...parts: string[]): unknown {
  const file = path.join(
    syncStoreDir(),
    ENV_PREFIX,
    "progress",
    family.id,
    ...parts.slice(0, -1),
    `${parts[parts.length - 1]}.json`,
  );
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

// Waits until `check` holds for what the store has; the sync runs in the
// browser a moment after the trigger.
export async function waitForStore(
  what: string,
  check: () => boolean,
  timeout = 45_000,
) {
  await expect.poll(check, { message: what, timeout }).toBe(true);
}

// The parts of each stored doc the scenarios read.
export type MainDoc = {
  sections: { sectionId: string; doneAt: string | null }[];
  historyMonths: string[];
  resets: Record<string, string>;
};
export type MonthDoc = { attempts: { lessonId: string }[] };
export type ProfileDoc = { profiles: { id: string; name: string }[] };

export const mainDoc = (family: SyncFamily, childId: string) =>
  storedDoc(family, childId) as MainDoc | null;
export const monthDoc = (family: SyncFamily, childId: string, month: string) =>
  storedDoc(family, childId, "history", month) as MonthDoc | null;
export const profileDoc = (family: SyncFamily) =>
  storedDoc(family, "profile") as ProfileDoc | null;

// ---------------------------------------------------------------------------
// Devices

export type Device = {
  context: BrowserContext;
  page: Page;
  // Requests that left localhost; the test fails if there is one.
  stray: string[];
};

export class Lab {
  private readonly devices: Device[] = [];

  constructor(
    private readonly browser: Browser,
    readonly target: string,
  ) {}

  // A fresh device (new storage) whose cookie is that of `family`.
  async device(family: SyncFamily): Promise<Device> {
    const { browserName: _name, ...options } =
      TARGET_DEVICES[this.target as TargetDeviceName];
    const context = await this.browser.newContext({
      ...options,
      baseURL: SYNC_BASE_URL,
      // Wrong-code counting is per address; each device claims its own.
      extraHTTPHeaders: { "x-forwarded-for": `sync-${randomUUID()}` },
    });
    await context.addInitScript(SILENCE_MEDIA_SCRIPT);
    const stray: string[] = [];
    await context.route(
      (url) => url.hostname !== "localhost",
      (route) => {
        stray.push(route.request().url());
        return route.abort();
      },
    );
    const response = await context.request.post("/api/session", {
      data: { code: await e2eFamilyCode(family.id) },
      headers: { origin: SYNC_BASE_URL },
    });
    expect(response.ok(), "the family code is accepted").toBe(true);
    const device = { context, page: await context.newPage(), stray };
    this.devices.push(device);
    return device;
  }

  // Closes every device and fails if one reached beyond localhost.
  async close() {
    const stray = this.devices.flatMap((d) => d.stray);
    await Promise.all(this.devices.map((d) => d.context.close()));
    expect(stray, "no request leaves localhost").toEqual([]);
  }
}

// ---------------------------------------------------------------------------
// Steps on a device

export const NAME = "Bé Na";

export async function newChild(page: Page, name = NAME) {
  await page.goto("/profiles");
  await createProfile(page, name, "Cáo");
}

// Opens the picker and takes the profile that arrived from the cloud.
export async function pickChild(page: Page, name = NAME) {
  await page.goto("/profiles");
  await page.getByText(name, { exact: true }).tap({ timeout: 30_000 });
  await expect(
    page.getByRole("heading", { level: 1, name: `Chào ${name}!`, exact: true }),
  ).toBeVisible();
}

// The fixture lesson's page with its sections. A synced device may swap the
// lesson's overview for the section list while the page is being opened, so
// the overview is passed by again until the sections show.
export async function openLesson(page: Page) {
  await page.goto("/lessons/fixture");
  const sections = page.locator("[data-section]").first();
  const browse = page.locator("[data-overview-browse]");
  await expect(async () => {
    if (await browse.isVisible()) {
      await browse.tap({ timeout: 2_000 }).catch(() => undefined);
    }
    await expect(sections).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
}

// What Dexie holds on the device, read the way the app's own E2E reads it.
export function idbAll<T = Record<string, unknown>>(
  page: Page,
  store: string,
): Promise<T[]> {
  return page.evaluate(
    (name) =>
      new Promise<T[]>((resolve, reject) => {
        const open = indexedDB.open("tutor");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const request = db.transaction(name).objectStore(name).getAll();
          request.onsuccess = () => {
            db.close();
            resolve(request.result);
          };
          request.onerror = () => reject(request.error);
        };
      }),
    store,
  );
}

export async function childIdOf(page: Page): Promise<string> {
  const [profile] = await idbAll<{ id: string }>(page, "profiles");
  if (!profile) throw new Error("no profile on the device");
  return profile.id;
}

// Makes the sync run now, as a network that came back would.
export function nudgeSync(page: Page) {
  return page.evaluate(() => window.dispatchEvent(new Event("online")));
}

const PIN = "2468";

// Opens the parent page, setting the device's PIN the first time.
export async function openParent(page: Page) {
  await page.goto("/parent");
  const fresh = page.getByLabel("PIN mới");
  const known = page.getByLabel("Nhập PIN");
  await expect(fresh.or(known)).toBeVisible();
  if (await fresh.isVisible()) {
    await fresh.fill(PIN);
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByLabel("Nhập lại PIN để xác nhận").fill(PIN);
    await page.getByRole("button", { name: "Lưu PIN" }).click();
  } else {
    await known.fill(PIN);
    await page.getByRole("button", { name: "Mở trang phụ huynh" }).click();
  }
  await expect(
    page.getByRole("heading", { level: 1, name: "Trang phụ huynh" }),
  ).toBeVisible();
}

// A backup file (export version 2) of a child with answers spread over the
// last `monthCount` months, the section `fixture.section.phep-nhan` done.
export function backupFile(
  child: { id: string; name: string },
  monthCount: number,
  now = new Date(),
): { name: string; mimeType: string; buffer: Buffer } {
  const stamp = now.toISOString();
  const attempts = Array.from({ length: monthCount }, (_, back) => {
    // The 10th of the month at 10:00 in Vietnam, or a minute ago for this one.
    const at =
      back === 0
        ? new Date(now.getTime() - 60_000)
        : new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 10, 3),
          );
    return ["a", "b"].map((suffix) => ({
      familyId: "local",
      childId: child.id,
      id: randomBytes(16).toString("hex"),
      exerciseId: "fixture.ex.dem-cham",
      lessonId: "fixture",
      cardIds: [`fixture.card.${suffix}`],
      firstTryCorrect: suffix === "a",
      wrongCount: suffix === "a" ? 0 : 2,
      at: new Date(at.getTime() + (suffix === "a" ? 0 : 60_000)).toISOString(),
      context: "practice",
    }));
  }).flat();
  const file = {
    format: "tutor-progress",
    version: 2,
    exportedAt: stamp,
    profile: {
      id: child.id,
      familyId: "local",
      name: child.name,
      avatar: "fox",
      grade: 6,
      series: {},
      createdAt: stamp,
      updatedAt: stamp,
    },
    settings: [],
    resets: {},
    attempts,
    cardStates: [],
    sections: [
      {
        familyId: "local",
        childId: child.id,
        sectionId: "fixture.section.phep-nhan",
        lessonId: "fixture",
        state: "done",
        position: { phase: "blocks", index: 0 },
        updatedAt: stamp,
        doneAt: stamp,
      },
    ],
    stickers: [],
    activityDays: [],
    writings: [],
  };
  return {
    name: "tien-do.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(file)),
  };
}

// Imports a backup on the open parent page.
export async function importBackupFile(
  page: Page,
  file: ReturnType<typeof backupFile>,
) {
  await page.getByLabel("Chọn tệp sao lưu").setInputFiles(file);
  await page.getByRole("button", { name: "Nhập vào máy" }).click();
  await expect(page.locator("[data-import-result=done]")).toBeVisible();
}
