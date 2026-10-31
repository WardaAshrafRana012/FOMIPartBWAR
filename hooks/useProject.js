"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { seed } from "../data/seed";
import { recover } from "../lib/project";
import { enrich, restoreEditorial } from "../lib/editor";
export const STORAGE = "fomi-continuity-v1";
export function useProject() {
  const [state, render] = useState(null),
    [save, setSave] = useState("Opening"),
    [notice, setNotice] = useState(""),
    [historyVersion, refreshHistory] = useState(0);
  const latest = useRef(null),
    past = useRef([]),
    future = useRef([]);
  const setState = useCallback((value) => {
    const next = typeof value === "function" ? value(latest.current) : value;
    latest.current = next;
    render(next);
  }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      const result = raw ? recover(raw, seed) : { state: seed() };
      setState({
        ...result.state,
        projects: result.state.projects.map(enrich),
      });
      if (result.recovered)
        setNotice("Unreadable local data was replaced with the demo.");
    } catch {
      const s = seed();
      setState({ ...s, projects: s.projects.map(enrich) });
      setNotice(
        "Browser storage is unavailable. Export a package to keep your work.",
      );
    }
  }, [setState]);
  useEffect(() => {
    if (!state) return;
    setSave("Saving…");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE, JSON.stringify(state));
        setSave("Saved in this browser");
      } catch {
        setSave("Save failed — storage unavailable");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);
  useEffect(() => {
    const flush = () => {
      if (latest.current)
        try {
          localStorage.setItem(STORAGE, JSON.stringify(latest.current));
        } catch {}
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);
  const project =
    state?.projects.find((p) => p.id === state.active) || state?.projects[0];
  const update = (fn, options = {}) => {
    const current = latest.current;
    if (!current) return;
    const p =
        current.projects.find((p) => p.id === current.active) ||
        current.projects[0],
      next = fn(p);
    if (options.history !== false) {
      const previous = past.current.at(-1),
        now = Date.now(),
        label = options.label || "Edit direction";
      if (
        previous &&
        previous.id === p.id &&
        previous.label === label &&
        now - previous.time < 800
      ) {
        previous.after = next;
        previous.time = now;
      } else
        past.current = [
          ...past.current.slice(-24),
          { id: p.id, before: p, after: next, label, time: now },
        ];
      future.current = [];
      refreshHistory((v) => v + 1);
    }
    setState({
      ...current,
      projects: current.projects.map((item) =>
        item.id === p.id ? next : item,
      ),
    });
  };
  const travel = (back) => {
    const from = back ? past : future,
      to = back ? future : past;
    const current = latest.current,
      p =
        current.projects.find((p) => p.id === current.active) ||
        current.projects[0];
    const index = from.current.findLastIndex((e) => e.id === p.id);
    if (index < 0) return;
    const entry = from.current[index];
    from.current = from.current.filter((_, i) => i !== index);
    to.current.push(entry);
    const restored = restoreEditorial(back ? entry.before : entry.after, p);
    setState({
      ...current,
      projects: current.projects.map((item) =>
        item.id === p.id ? restored : item,
      ),
    });
    refreshHistory((v) => v + 1);
    setNotice(
      `${back ? "Undid" : "Redid"}: ${entry.label}. Completed generations are retained.`,
    );
  };
  const clearHistory = () => {
    past.current = [];
    future.current = [];
    refreshHistory((v) => v + 1);
  };
  return {
    state,
    setState,
    project,
    update,
    save,
    notice,
    setNotice,
    undo: () => travel(true),
    redo: () => travel(false),
    canUndo: past.current.some((e) => e.id === project?.id),
    canRedo: future.current.some((e) => e.id === project?.id),
    clearHistory,
    historyVersion,
  };
}
