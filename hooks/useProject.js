"use client";
import { useEffect, useRef, useState } from "react";
import { seed } from "../data/seed";
import { recover } from "../lib/project";
export const STORAGE = "fomi-continuity-v1";
export function useProject() {
  const [state, setState] = useState(null),
    [save, setSave] = useState("Opening"),
    [notice, setNotice] = useState("");
  const ready = useRef(false);
  const latest = useRef(null);
  latest.current = state;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      const result = raw ? recover(raw, seed) : { state: seed() };
      setState(result.state);
      if (result.recovered)
        setNotice("Unreadable local data was replaced with the demo.");
    } catch {
      setState(seed());
      setNotice(
        "Browser storage is unavailable. Edits may not survive reload.",
      );
    }
    ready.current = true;
  }, []);
  useEffect(() => {
    if (!state || !ready.current) return;
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
  const update = (fn) =>
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === project.id ? fn(p) : p)),
    }));
  return { state, setState, project, update, save, notice, setNotice };
}
