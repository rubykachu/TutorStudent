"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// A guided "cùng làm" screen: an interactive visual on a lesson screen that
// the child has to do (pick the right chips, fix the cut, tap each operation)
// before the screen's "Tiếp" works. The player wraps the screen in
// `GuidedStepProvider`; each visual that is a task calls `useGuidedTask` with
// whether it is finished (done right, or its answer shown) and a function
// that shows how it is done. The player reads `useGuided` for its bar: "Tiếp"
// stays off while a task is open, next to a small "Xem cách làm" that runs the
// open tasks' show functions, the way out of a stuck child. Outside a
// provider (an exercise, a gallery, an earlier screen looked at again) a task
// is free and nothing waits.

type Tasks = {
  set: (id: string, done: boolean) => void;
  setShow: (id: string, show: () => void) => void;
  remove: (id: string) => void;
};

export type Guided = {
  // A task of the screen is still open: "Tiếp" stays off.
  held: boolean;
  // Shows how every open task is done; each then counts as finished.
  show: () => void;
};

const TasksContext = createContext<Tasks | null>(null);
const GuidedContext = createContext<Guided>({ held: false, show: () => {} });

export function GuidedStepProvider({
  enabled = true,
  children,
}: {
  // False for a screen that was already passed: nothing waits there.
  enabled?: boolean;
  children: ReactNode;
}) {
  const [done, setDone] = useState<Readonly<Record<string, boolean>>>({});
  const shows = useRef<Record<string, () => void>>({});
  const tasks = useMemo<Tasks>(
    () => ({
      set: (id, value) =>
        setDone((all) => (all[id] === value ? all : { ...all, [id]: value })),
      setShow: (id, show) => {
        shows.current[id] = show;
      },
      remove: (id) => {
        delete shows.current[id];
        setDone((all) => {
          const { [id]: _gone, ...rest } = all;
          return rest;
        });
      },
    }),
    [],
  );
  const open = Object.keys(done).filter((id) => !done[id]);
  const show = useCallback(() => {
    for (const id of open) shows.current[id]?.();
  }, [open]);
  const guided = useMemo<Guided>(
    () => ({ held: enabled && open.length > 0, show }),
    [enabled, open.length, show],
  );
  return (
    <TasksContext value={enabled ? tasks : null}>
      <GuidedContext value={guided}>{children}</GuidedContext>
    </TasksContext>
  );
}

// What the player needs for its bar: whether "Tiếp" waits and how to show.
export function useGuided(): Guided {
  return useContext(GuidedContext);
}

// Registers the calling visual as a task of its screen. A task that was
// finished once stays finished (the child may keep playing with it or start
// it over), so "Tiếp" never locks again. A layout effect, so the screen waits
// from its first paint.
export function useGuidedTask(finished: boolean, show: () => void): void {
  const tasks = useContext(TasksContext);
  const id = useId();
  const [reached, setReached] = useState(false);
  if (finished && !reached) setReached(true);
  useLayoutEffect(() => {
    tasks?.set(id, reached);
  }, [tasks, id, reached]);
  useLayoutEffect(() => {
    tasks?.setShow(id, show);
  });
  useLayoutEffect(() => () => tasks?.remove(id), [tasks, id]);
}
