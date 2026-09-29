import { STREAK_REST_DAYS_PER_WEEK } from "@/lib/config";
import { dayNumber, weekdayOfDay } from "@/lib/time";

export type Streak = {
  // Study days in the unbroken chain that ends today, or yesterday while
  // today is still open. Rest days keep the chain but do not add to it.
  days: number;
  studiedToday: boolean;
  // Rest days of the current Monday–Sunday week the chain has not used yet.
  restDaysLeft: number;
};

function weekStart(day: number): number {
  return day - weekdayOfDay(day);
}

// Counts the study streak from Vietnam day keys (`vnDayKey`). Walking back
// from today, each missed day is covered by a rest day of its own week, up to
// `restDaysPerWeek` per week; the first miss that finds none ends the chain.
// Today is never a miss: the child may still study later in the day.
export function computeStreak(
  activityDays: readonly string[],
  today: string,
  restDaysPerWeek: number = STREAK_REST_DAYS_PER_WEEK,
): Streak {
  const todayNumber = dayNumber(today);
  const studied = new Set(activityDays.map(dayNumber));
  const studiedToday = studied.has(todayNumber);
  const earliest = Math.min(...studied);
  const restUsed = new Map<number, number>();
  let days = 0;
  // Stops at the first study day ever: nothing before it can be a missed day.
  for (let day = todayNumber; day >= earliest; day--) {
    if (studied.has(day)) {
      days++;
      continue;
    }
    if (day === todayNumber) continue;
    const week = weekStart(day);
    const used = restUsed.get(week) ?? 0;
    if (used >= restDaysPerWeek) break;
    restUsed.set(week, used + 1);
  }
  const usedThisWeek = restUsed.get(weekStart(todayNumber)) ?? 0;
  return {
    days,
    studiedToday,
    restDaysLeft: Math.max(0, restDaysPerWeek - usedThisWeek),
  };
}
