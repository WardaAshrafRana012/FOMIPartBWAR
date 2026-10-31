import { recover, rules, uid, signature } from "./project.js";
import { withSuppliedMedia } from "./supplied-media.js";
export const palette = ["#251d18", "#9f6233", "#c9a66b", "#e8dfcd", "#111313"];
export function enrich(project) {
  project = withSuppliedMedia(project);
  const activity = [...(project.activity || [])];
  for (const shot of project.shots) {
    const last = activity
      .filter(
        (a) =>
          a.shotId === shot.id &&
          /^(Generation |Two alternatives completed|Simulation interrupted)/.test(
            a.message,
          ),
      )
      .at(-1);
    if (last?.message.startsWith("Generation queued"))
      activity.push({
        id: uid(),
        shotId: shot.id,
        message:
          "Simulation interrupted by reload or import. No incomplete takes were added.",
        at: new Date().toISOString(),
      });
  }
  return {
    ...project,
    references: project.references || [
      {
        id: "ref-product",
        name: "After Hours · product",
        role: "Product",
        src: "/demo/signature.webp",
      },
      {
        id: "ref-light",
        name: "Amber sidelight",
        role: "Lighting",
        src: "/demo/material.webp",
      },
    ],
    activity: activity.slice(-60),
    shots: project.shots.map((s) => ({
      ...s,
      referenceIds: s.referenceIds ?? null,
      takes: s.takes.map((t) => ({
        ...t,
        poster:
          {
            "/demo/amber.webm": "/demo/invitation.webp",
            "/demo/veil.webm": "/demo/material.webp",
            "/demo/ritual.webm": "/demo/ritual.webp",
            "/demo/signature.webm": "/demo/signature.webp",
            "/demo/amber-alt.webm": "/demo/invitation.webp",
            "/demo/veil-alt.webm": "/demo/material.webp",
            "/demo/ritual-alt.webm": "/demo/ritual.webp",
            "/demo/signature-alt.webm": "/demo/signature.webp",
          }[t.src] || t.poster,
        note: t.note ?? (t.id === s.chosen ? s.note : ""),
      })),
    })),
  };
}
export function directionChanges(project, take) {
  if (!take) return [];
  return rules
    .filter(
      (k) =>
        (take.request.inherited?.[k] ?? take.request.direction?.[k]) !==
        project.dna[k],
    )
    .map((k) => ({
      key: k,
      before:
        take.request.inherited?.[k] ??
        take.request.direction?.[k] ??
        "Not recorded",
      after: project.dna[k],
    }));
}
export function continuityIssues(project) {
  const issues = [];
  const base = project.shots[0]?.aspect;
  for (const s of project.shots) {
    const t = s.takes.find((t) => t.id === s.chosen);
    if (!t)
      issues.push({
        shotId: s.id,
        kind: "selection",
        title: `Choose a take for “${s.name}”`,
        detail: "This shot is planned but has no version in the sequence.",
      });
    if (base && s.aspect !== base)
      issues.push({
        shotId: s.id,
        kind: "format",
        title: `Review the format of “${s.name}”`,
        detail: `Requested ${s.aspect}; the first shot requests ${base}. Fixture footage retains its original format.`,
      });
    if (t && t.dnaSignature !== signature(project.dna))
      issues.push({
        shotId: s.id,
        kind: "direction",
        title: `Review earlier direction in “${s.name}”`,
        detail: `${directionChanges(project, t).length} project rule(s) differ from this take’s saved request.`,
      });
    if (t && !(t.note || s.note)?.trim())
      issues.push({
        shotId: s.id,
        kind: "decision",
        title: `Record the decision for “${s.name}”`,
        detail:
          "Optional: leave a reason so your next session starts with context.",
      });
  }
  return issues;
}
/** Undo editorial changes without discarding takes that finished generating later. */
export function restoreEditorial(snapshot, current) {
  return {
    ...snapshot,
    activity: current.activity || [],
    shots: snapshot.shots.map((s) => {
      const now = current.shots.find((t) => t.id === s.id);
      if (!now) return s;
      const ids = new Set(s.takes.map((t) => t.id));
      return {
        ...s,
        takes: [...s.takes, ...now.takes.filter((t) => !ids.has(t.id))],
      };
    }),
  };
}
export function parsePackage(raw) {
  let p;
  try {
    p = JSON.parse(raw);
  } catch {
    throw Error("This file is not valid JSON.");
  }
  if (p.format !== "fomi-project-package" || p.version !== 1)
    throw Error("Choose a Fomi project package, version 1.");
  const checked = recover(
    JSON.stringify({ version: 1, active: p.id, projects: [p] }),
    () => null,
  );
  if (checked.recovered)
    throw Error(
      "The project contains invalid settings, references or media paths. Your work has not changed.",
    );
  const clean = enrich(checked.state.projects[0]);
  const shotMap = new Map(clean.shots.map((s) => [s.id, uid()]));
  return {
    ...clean,
    id: uid(),
    name: `${clean.name} — imported`,
    selectedShot: shotMap.get(clean.selectedShot) || null,
    shots: clean.shots.map((s) => {
      const takeMap = new Map(s.takes.map((t) => [t.id, uid()]));
      return {
        ...s,
        id: shotMap.get(s.id),
        takes: s.takes.map((t) => ({ ...t, id: takeMap.get(t.id) })),
        chosen: takeMap.get(s.chosen) || null,
        preview: takeMap.get(s.preview) || null,
      };
    }),
  };
}
export function safeImage(src) {
  return (
    typeof src === "string" &&
    (/^\/demo\/[a-z-]+\.(svg|png|webp|jpg)$/.test(src) ||
      (/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(src) &&
        src.length < 350000))
  );
}
