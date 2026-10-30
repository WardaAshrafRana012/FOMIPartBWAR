import { requestFor, signature } from "../lib/project.js";
export function seed() {
  const p = {
    id: "after-hours",
    name: "AFTER HOURS — Fragrance Campaign",
    brief:
      "A 20-second evening fragrance film. The city falls quiet; a private ritual begins. Reveal AFTER HOURS through amber glass, soft shadow, and tactile details. Intimate, assured, never glossy. End on a quiet product signature.",
    dna: {
      subject:
        "AFTER HOURS eau de parfum. Amber glass, black cap, understated cream label.",
      style:
        "Tactile editorial still life. Quiet luxury, fine grain, restrained composition.",
      lighting:
        "A single warm sidelight. Deep soft shadows; gentle highlights on glass.",
      palette: "Burnt amber, tobacco, warm ivory, near-black.",
      camera:
        "Slow deliberate push-ins. Locked horizon, shallow depth, no fast cuts.",
    },
    shots: [],
  };
  const names = [
    "The invitation",
    "Light through amber",
    "The evening ritual",
    "A lasting impression",
  ];
  const prompts = [
    "Open on a bottle emerging from darkness. A narrow ribbon of warm light traces the amber glass. Leave negative space to the left.",
    "Move gently toward the bottle as amber light refracts onto the tabletop. Hold the label in soft focus.",
    "A quiet orbit around the fragrance. Let a veil of warm shadow cross the glass, revealing its silhouette.",
    "Resolve on a centered product portrait. Hold the final composition with space below for the campaign signature.",
  ];
  const fixtures = ["amber", "veil", "ritual", "signature"];
  p.shots = names.map((name, i) => ({
    id: `shot-${i}`,
    name,
    description: [
      "Establish the mood",
      "Reveal the material",
      "Build the intimacy",
      "Leave a signature",
    ][i],
    prompt: prompts[i],
    duration: 5,
    aspect: "16:9",
    overrides: {},
    takes: [],
    chosen: `take-${i}-1`,
    preview: `take-${i}-1`,
    note:
      i === 0
        ? "Selected for the restrained opening and slower camera movement."
        : "",
  }));
  p.shots.forEach((s, i) => {
    s.takes = [0, 1].map((v) => ({
      id: `take-${i}-${v + 1}`,
      name: `Take 0${v + 1}`,
      src: `/demo/${fixtures[(i + v) % 4]}.webm`,
      poster: `/demo/${fixtures[(i + v) % 4]}.svg`,
      createdAt: "2026-10-28T16:30:00Z",
      request: requestFor(p, s),
      dnaSignature: signature(p.dna),
      fixture: true,
    }));
  });
  return { version: 1, active: p.id, projects: [p] };
}
