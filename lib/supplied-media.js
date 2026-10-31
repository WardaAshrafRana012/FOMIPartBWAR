import { requestFor, signature } from "./project.js";

export const suppliedMedia = [
  { id: "sample-supplied-one", name: "Sample 01 · Product film", src: "/demo/supplied-01.mp4", poster: "/demo/supplied-01.webp", duration: 17.066667 },
  { id: "sample-supplied-two", name: "Sample 02 · Ingredient film", src: "/demo/supplied-02.mp4", poster: "/demo/supplied-02.webp", duration: 10.005011 },
];

/** Add the supplied examples once, preserving every existing editorial choice. */
export function withSuppliedMedia(project) {
  if (project.id !== "after-hours" || project.suppliedMediaVersion === 1) return project;
  const shot = project.shots.find(s => s.id === "shot-0");
  if (!shot) return { ...project, suppliedMediaVersion: 1 };
  const samples = suppliedMedia.filter(m => !shot.takes.some(t => t.id === m.id)).map(m => ({
    ...m, actualDuration: m.duration, actualAspect: "9:16", mediaOrigin: "user-supplied",
    createdAt: "2026-10-31T16:45:00Z", fixture: true,
    request: requestFor(project, shot), dnaSignature: signature(project.dna),
    provenance: "User-supplied sample footage. The attached direction is demo metadata; this footage was not generated from that request.",
  }));
  return { ...project, suppliedMediaVersion: 1, shots: project.shots.map(s => s.id === shot.id ? { ...s, takes: [...samples, ...s.takes], preview: samples[0]?.id || s.preview } : s) };
}
