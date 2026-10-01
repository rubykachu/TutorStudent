"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Circle, CircleCheck, Download, Flame } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import { BigButton } from "@/components/big-button";
import { Formula } from "@/components/blocks/formula";
import { Sticker } from "@/components/sticker";
import type { LessonIndex } from "@/content";
import { PARENT_RECENT_DAYS, PARENT_WRONG_WINDOW_DAYS } from "@/lib/config";
import { now, vnDayKey } from "@/lib/time";
import type { ProfileRecord, WritingRecord } from "@/progress/db";
import {
  appDb,
  childScope,
  useContentIndex,
  useLessons,
} from "@/progress/hooks";
import {
  buildProgressExport,
  type ParentData,
  progressExportFileName,
  readParentData,
} from "@/progress/parent-data";
import {
  cardConceptNames,
  type DayStudy,
  type ForgettingCard,
  lessonHasProgress,
  lessonIdOfContentId,
  lessonSections,
  promptSummary,
  recentStudyDays,
  type SkippedExercise,
  shorten,
  skippedExercises,
  topForgettingCards,
  topWrongExercises,
  touchedLessonIds,
  type WrongExercise,
} from "@/progress/parent-report";
import { computeStreak } from "@/progress/streak";
import { lessonsForSubject } from "@/progress/summary";
import type { ContentIndex } from "@/schema/content";
import {
  formatDateTime,
  formatDayKey,
  WEEKDAY_LONG,
  WEEKDAY_SHORT,
} from "./format";
import { ResetLessonDialog } from "./reset-lesson-dialog";

const CARD = "flex flex-col gap-4 rounded-lg bg-surface p-4 shadow-card md:p-6";

function Panel({
  title,
  note,
  children,
  label,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <section className={CARD} aria-label={label} data-parent-panel={label}>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-block font-bold md:text-block-lg">
          {title}
        </h2>
        {note && <p className="text-caption text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

// ---------------------------------------------------------------------------
// Study time

function StudyBars({ days }: { days: DayStudy[] }) {
  const max = Math.max(...days.map((d) => d.minutes), 1);
  return (
    <ol
      className="grid h-44 grid-cols-7 items-end gap-2"
      aria-label={`Thời gian học ${PARENT_RECENT_DAYS} ngày qua`}
    >
      {days.map((d, i) => {
        const today = i === days.length - 1;
        return (
          <li
            key={d.day}
            className="flex h-full flex-col items-center justify-end gap-1"
          >
            <span className="sr-only">
              {WEEKDAY_LONG[d.weekday]} {formatDayKey(d.day)}: {d.minutes} phút
            </span>
            <span aria-hidden className="text-caption font-semibold">
              {d.minutes}
            </span>
            <span
              aria-hidden
              className={`w-full max-w-10 rounded-t-sm ${today ? "bg-primary" : "bg-primary/40"}`}
              style={{ height: `${(d.minutes / max) * 100}%`, minHeight: 4 }}
            />
            <span
              aria-hidden
              className={`text-caption ${today ? "font-semibold" : "text-muted-foreground"}`}
            >
              {today ? "Nay" : WEEKDAY_SHORT[d.weekday]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StudyTime({ data }: { data: ParentData }) {
  const today = vnDayKey(now());
  const days = recentStudyDays(data.attempts, today);
  const todayMinutes = days[days.length - 1]?.minutes ?? 0;
  const weekMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const streak = computeStreak(data.activityDays, today);
  return (
    <Panel
      label="Thời gian học"
      title="Thời gian học"
      note="Ước tính từ thời điểm con trả lời các câu hỏi, nên có thể thấp hơn thực tế một chút."
    >
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Hôm nay" value={`${todayMinutes} phút`} />
        <Stat
          label={`${PARENT_RECENT_DAYS} ngày qua`}
          value={`${weekMinutes} phút`}
        />
        <Stat
          label="Chuỗi ngày học"
          value={streak.days > 0 ? `${streak.days} ngày` : "Chưa có"}
          icon={
            <Flame
              aria-hidden
              className={`size-5 ${streak.studiedToday ? "fill-streak text-streak" : "text-muted-foreground"}`}
            />
          }
        />
        <Stat
          label="Tổng số ngày đã học"
          value={`${data.activityDays.length} ngày`}
        />
      </dl>
      <StudyBars days={days} />
    </Panel>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-sm bg-muted px-3 py-2">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2 font-heading text-block font-bold">
        {icon}
        {value}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lessons

type LessonIndexRow = { id: string; title: string };

function LessonsProgress({
  index,
  profile,
  data,
}: {
  index: ContentIndex;
  profile: ProfileRecord;
  data: ParentData;
}) {
  const [resetting, setResetting] = useState<LessonIndexRow | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const closeReset = useCallback(() => setResetting(null), []);
  const subjects = index.subjects
    .map((subject) => ({
      subject,
      rows: lessonSections(
        lessonsForSubject(index, subject.id, profile.series[subject.id]),
        data.sections,
        data.stickers,
      ),
    }))
    .filter((s) => s.rows.length > 0);
  return (
    <Panel label="Tiến độ bài học" title="Tiến độ bài học">
      {notice && (
        <p
          role="status"
          className="rounded-sm bg-muted px-3 py-2 font-semibold"
        >
          {notice}
        </p>
      )}
      {subjects.length === 0 && <Empty>Chưa có bài học nào.</Empty>}
      {subjects.map(({ subject, rows }) => (
        <div key={subject.id} className="flex flex-col gap-3">
          <h3 className="font-semibold">{subject.name}</h3>
          <ul className="flex flex-col gap-3">
            {rows.map(({ lesson, done, total, sticker }) => (
              <li
                key={lesson.id}
                data-parent-lesson={lesson.id}
                className="flex items-center gap-3"
              >
                <Sticker
                  visualId={lesson.sticker.visualId}
                  name={lesson.sticker.name}
                  // A kept sticker stays in colour after a reset.
                  done={sticker ? total : done}
                  total={total}
                  className="size-12 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="break-words">{lesson.title}</span>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
                    >
                      <span
                        className="block h-full rounded-full bg-correct"
                        style={{
                          width: `${total ? (done / total) * 100 : 0}%`,
                        }}
                      />
                    </span>
                    <span className="shrink-0 text-caption text-muted-foreground">
                      Xong {done}/{total} phần
                      {sticker ? " · có sticker" : ""}
                    </span>
                  </div>
                  {lessonHasProgress(lesson.id, data) && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotice(null);
                        setResetting({ id: lesson.id, title: lesson.title });
                      }}
                      className="flex min-h-12 items-center self-start rounded-sm px-1 font-semibold text-destructive underline underline-offset-4"
                    >
                      Học lại bài này
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {resetting && (
        <ResetLessonDialog
          childId={profile.id}
          childName={profile.name}
          lessonId={resetting.id}
          lessonTitle={resetting.title}
          onClose={closeReset}
          onDone={() => {
            setNotice(
              `Đã cho ${profile.name} học lại bài “${resetting.title}”. Sticker vẫn được giữ.`,
            );
            setResetting(null);
          }}
        />
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Forgetting cards and wrong questions

function lessonTitle(index: ContentIndex, lessonId: string): string {
  return index.lessons.find((l) => l.id === lessonId)?.title ?? lessonId;
}

function ForgettingCards({
  cards,
  index,
}: {
  cards: ForgettingCard[];
  index: ContentIndex;
}) {
  return (
    <Panel
      label="Thẻ hay quên"
      title="Thẻ hay quên"
      note="Những kiến thức con dễ quên nhất lúc này. Nhắc con bấm “Ôn bài này” ở bài tương ứng."
    >
      {cards.length === 0 ? (
        <Empty>
          Hiện chưa có thẻ nào con sắp quên. Thẻ sẽ hiện ở đây khi con lâu chưa
          ôn một kiến thức đã học.
        </Empty>
      ) : (
        <ol className="flex flex-col gap-3">
          {cards.map((c) => {
            const concepts = cardConceptNames(c.card, c.index);
            const recap = c.card.recap;
            return (
              <li
                key={c.cardId}
                data-parent-card={c.cardId}
                className="flex flex-col gap-1 rounded-sm border-2 border-border p-3"
              >
                <span className="font-semibold">
                  {concepts.length > 0 ? concepts.join(", ") : "Ghi nhớ"}
                </span>
                {recap.type === "formula" ? (
                  <Formula tex={recap.tex} className="text-body" />
                ) : (
                  recap.caption && <span>{recap.caption}</span>
                )}
                <span className="text-caption text-muted-foreground">
                  Còn nhớ khoảng {Math.round(c.recall * 100)}% ·{" "}
                  {lessonTitle(index, c.lessonId)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

function WrongQuestions({
  items,
  lessons,
  index,
}: {
  items: WrongExercise[];
  lessons: ReadonlyMap<string, LessonIndex>;
  index: ContentIndex;
}) {
  return (
    <Panel
      label="Câu hay sai"
      title="Câu hay sai"
      note={`Trong ${PARENT_WRONG_WINDOW_DAYS} ngày qua, tính cả những câu con đã tự sửa đúng sau gợi ý.`}
    >
      {items.length === 0 ? (
        <Empty>Chưa có câu nào con làm sai gần đây.</Empty>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item) => {
            const exercise = lessons
              .get(item.lessonId)
              ?.exerciseById.get(item.exerciseId)?.exercise;
            const summary = exercise ? promptSummary(exercise) : null;
            return (
              <li
                key={item.exerciseId}
                data-parent-wrong={item.exerciseId}
                className="flex flex-col gap-1 rounded-sm border-2 border-border p-3"
              >
                <span className="font-semibold">
                  {summary?.text || "Câu hỏi đã được thay đổi"}
                </span>
                {summary?.tex && (
                  <Formula tex={summary.tex} className="text-body" />
                )}
                <span className="text-caption text-muted-foreground">
                  Sai {item.wrongCount} lần trong {item.misses} lượt làm ·{" "}
                  {lessonTitle(index, item.lessonId)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

function SkippedQuestions({
  items,
  lessons,
  index,
}: {
  items: SkippedExercise[];
  lessons: ReadonlyMap<string, LessonIndex>;
  index: ContentIndex;
}) {
  return (
    <Panel
      label="Câu đã bỏ qua"
      title="Câu đã bỏ qua"
      note={`Trong ${PARENT_WRONG_WINDOW_DAYS} ngày qua. Con chọn “Bỏ qua” nên các câu này không được tính đúng hay sai.`}
    >
      {items.length === 0 ? (
        <Empty>Con chưa bỏ qua câu nào gần đây.</Empty>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item) => {
            const exercise = lessons
              .get(item.lessonId)
              ?.exerciseById.get(item.exerciseId)?.exercise;
            const summary = exercise ? promptSummary(exercise) : null;
            return (
              <li
                key={item.exerciseId}
                data-parent-skipped={item.exerciseId}
                className="flex flex-col gap-1 rounded-sm border-2 border-border p-3"
              >
                <span className="font-semibold">
                  {summary?.text || "Câu hỏi đã được thay đổi"}
                </span>
                {summary?.tex && (
                  <Formula tex={summary.tex} className="text-body" />
                )}
                <span className="text-caption text-muted-foreground">
                  Bỏ qua {item.skips} lần · {lessonTitle(index, item.lessonId)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Writings

function Writings({
  writings,
  lessons,
}: {
  writings: WritingRecord[];
  lessons: ReadonlyMap<string, LessonIndex>;
}) {
  const newestFirst = [...writings].reverse();
  return (
    <Panel
      label="Bài viết của con"
      title="Bài viết của con"
      note="Mỗi lần con nộp bài đều được giữ lại. Dấu tích do con tự đánh."
    >
      {newestFirst.length === 0 ? (
        <Empty>Con chưa viết bài nào.</Empty>
      ) : (
        <ul className="flex flex-col gap-4">
          {newestFirst.map((w) => {
            const exercise = lessons
              .get(lessonIdOfContentId(w.exerciseId))
              ?.exerciseById.get(w.exerciseId)?.exercise;
            return (
              <li
                key={w.id}
                data-parent-writing={w.id}
                className="flex flex-col gap-3 rounded-sm border-2 border-border p-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {exercise
                      ? shorten(promptSummary(exercise, 200).text, 200)
                      : "Bài viết"}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {formatDateTime(new Date(w.at))}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words rounded-sm bg-muted p-3 font-body text-passage md:text-passage-lg">
                  {w.text}
                </p>
                {w.checks.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {w.checks.map((check) => (
                      <li
                        key={check.criterion}
                        className="flex items-start gap-2"
                      >
                        {check.met ? (
                          <CircleCheck
                            aria-hidden
                            className="mt-1 size-5 shrink-0 text-correct"
                          />
                        ) : (
                          <Circle
                            aria-hidden
                            className="mt-1 size-5 shrink-0 text-muted-foreground"
                          />
                        )}
                        <span>
                          <span className="sr-only">
                            {check.met ? "Đã tích: " : "Chưa tích: "}
                          </span>
                          {check.criterion}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Backup

function download(fileName: string, text: string): void {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Backup({ profile }: { profile: ProfileRecord }) {
  const [busy, setBusy] = useState(false);
  async function handleExport() {
    setBusy(true);
    const at = now();
    const backup = await buildProgressExport(appDb(), profile, at);
    download(
      progressExportFileName(profile.name, vnDayKey(at)),
      JSON.stringify(backup, null, 2),
    );
    setBusy(false);
  }
  return (
    <Panel
      label="Sao lưu"
      title="Sao lưu tiến độ"
      note="Tiến độ hiện chỉ nằm trên máy này. Thỉnh thoảng hãy tải một bản sao lưu để giữ lại."
    >
      <BigButton
        variant="secondary"
        onClick={handleExport}
        disabled={busy}
        className="md:w-auto md:self-start"
      >
        <Download aria-hidden className="size-6" />
        Tải bản sao lưu (JSON)
      </BigButton>
    </Panel>
  );
}

// ---------------------------------------------------------------------------

function ReportBody({
  profile,
  data,
  index,
}: {
  profile: ProfileRecord;
  data: ParentData;
  index: ContentIndex;
}) {
  const states = useLessons(touchedLessonIds(data));
  const lessons = new Map<string, LessonIndex>();
  for (const [id, state] of states) {
    if (state.status === "ready") lessons.set(id, state.index);
  }
  const at = now();
  return (
    <>
      <StudyTime data={data} />
      <LessonsProgress index={index} profile={profile} data={data} />
      <ForgettingCards
        cards={topForgettingCards(data.cardStates, lessons, at)}
        index={index}
      />
      <WrongQuestions
        items={topWrongExercises(data.attempts, at)}
        lessons={lessons}
        index={index}
      />
      <SkippedQuestions
        items={skippedExercises(data.attempts, at)}
        lessons={lessons}
        index={index}
      />
      <Writings writings={data.writings} lessons={lessons} />
      <Backup profile={profile} />
    </>
  );
}

// One child's progress on this device, for a parent to scan on a phone.
export function ChildReport({ profile }: { profile: ProfileRecord }) {
  const data = useLiveQuery(
    () => readParentData(appDb(), childScope(profile.id)),
    [profile.id],
  );
  const content = useContentIndex();
  if (!data || content.status === "loading") return null;
  if (content.status === "error") {
    return (
      <p className={CARD}>
        Chưa tải được danh sách bài. Bạn kiểm tra mạng rồi mở lại trang nhé.
      </p>
    );
  }
  return <ReportBody profile={profile} data={data} index={content.index} />;
}
