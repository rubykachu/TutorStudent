"use client";

import { Eye } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

// A guided "cùng làm" screen: an interactive visual on a lesson screen that
// the child has to do (pick the right chips, fix the cut, tap each operation)
// before the screen's "Tiếp" works. The player wraps the screen in
// `GuidedStepProvider`; each visual that is a task calls `useGuidedTask` with
// whether it is finished (done right, or its answer shown). Outside a
// provider (an exercise, a gallery, an earlier screen looked at again) a task
// is free and nothing waits.

type Tasks = {
  set: (id: string, done: boolean) => void;
  remove: (id: string) => void;
};

const TasksContext = createContext<Tasks | null>(null);
const HeldContext = createContext(false);

export function GuidedStepProvider({
  enabled = true,
  children,
}: {
  // False for a screen that was already passed: nothing waits there.
  enabled?: boolean;
  children: ReactNode;
}) {
  const [done, setDone] = useState<Readonly<Record<string, boolean>>>({});
  const tasks = useMemo<Tasks>(
    () => ({
      set: (id, value) =>
        setDone((all) => (all[id] === value ? all : { ...all, [id]: value })),
      remove: (id) =>
        setDone((all) => {
          const { [id]: _gone, ...rest } = all;
          return rest;
        }),
    }),
    [],
  );
  const held = enabled && Object.values(done).some((finished) => !finished);
  return (
    <TasksContext value={enabled ? tasks : null}>
      <HeldContext value={held}>{children}</HeldContext>
    </TasksContext>
  );
}

// Whether the screen still waits for the child: `Tiếp` stays off while true.
export function useGuidedHold(): boolean {
  return useContext(HeldContext);
}

// Registers the calling visual as a task of its screen, finished or not. A
// task that was finished once stays finished (the child may keep playing with
// it or start it over), so "Tiếp" never locks again. A layout effect, so the
// screen waits from its first paint.
export function useGuidedTask(finished: boolean): void {
  const tasks = useContext(TasksContext);
  const id = useId();
  const [reached, setReached] = useState(false);
  if (finished && !reached) setReached(true);
  useLayoutEffect(() => {
    tasks?.set(id, reached);
  }, [tasks, id, reached]);
  useLayoutEffect(() => () => tasks?.remove(id), [tasks, id]);
}

// The small way out of a task: shows how it is done, so a child who is stuck
// can go on. The visual draws the answer and counts itself finished.
export function ShowHowButton({ onShow }: { onShow: () => void }) {
  return (
    <button
      type="button"
      data-guided-show
      onClick={onShow}
      className="inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border-2 border-border bg-surface px-4 text-caption font-semibold text-muted-foreground motion-safe:transition-transform motion-safe:active:scale-97"
    >
      <Eye aria-hidden className="size-5" />
      Xem cách làm
    </button>
  );
}
