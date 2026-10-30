"use client";
import { useEffect, useRef, useState } from "react";
export function useGeneration(setState) {
  const [jobs, setJobs] = useState({});
  const running = useRef({}),
    timers = useRef([]),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
      Object.values(running.current).forEach((c) => c.abort());
      running.current = {};
    };
  }, []);
  const put = (id, value) => {
    if (alive.current) setJobs((j) => ({ ...j, [id]: value }));
  };
  const cancel = (id) => {
    running.current[id]?.abort();
    delete running.current[id];
    put(id, {
      status: "cancelled",
      message: "Cancelled. Your selected take is unchanged.",
    });
  };
  async function start(projectId, shotId, request, fail = false) {
    if (running.current[shotId]) return;
    const controller = new AbortController();
    running.current[shotId] = controller;
    put(shotId, { status: "queued" });
    const delay = (ms) =>
      new Promise((resolve) => {
        const timer = setTimeout(() => {
          timers.current = timers.current.filter((t) => t !== timer);
          resolve();
        }, ms);
        timers.current.push(timer);
      });
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      await delay(900);
      if (controller.signal.aborted) return;
      put(shotId, { status: "generating" });
      await delay(3200);
      if (controller.signal.aborted) return;
      if (fail)
        throw Error(
          "Demonstration failure. No takes were added. Retry when ready.",
        );
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id !== projectId
            ? p
            : {
                ...p,
                shots: p.shots.map((shot) =>
                  shot.id !== shotId
                    ? shot
                    : {
                        ...shot,
                        takes: [
                          ...shot.takes,
                          ...result.takes.map((t, i) => ({
                            ...t,
                            name: `Take ${String(shot.takes.length + i + 1).padStart(2, "0")}`,
                          })),
                        ],
                      },
                ),
              },
        ),
      }));
      put(shotId, {
        status: "completed",
        message: "Two alternatives ready. Your chosen take is unchanged.",
      });
    } catch (e) {
      if (e.name !== "AbortError")
        put(shotId, { status: "failed", message: e.message });
    } finally {
      if (running.current[shotId] === controller)
        delete running.current[shotId];
    }
  }
  return { jobs, start, cancel };
}
