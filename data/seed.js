import { requestFor, signature } from "../lib/project.js";
import { withSuppliedMedia } from "../lib/supplied-media.js";
import { withMatchedStoryboard } from "../lib/storyboard-media.js";
import { openChosenVersion } from "../lib/takes.js";
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
    references: [
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
      {
        id: "ref-world",
        name: "The evening world",
        role: "Style",
        src: "/demo/invitation.webp",
      },
    ],
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
    fixtureIndex: i,
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
      src: `/demo/${fixtures[i]}${v ? "-alt" : ""}.webm`,
      poster: `/demo/${["invitation", "material", "ritual", "signature"][i]}.webp`,
      createdAt: "2026-10-28T16:30:00Z",
      request: requestFor(p, s),
      dnaSignature: signature(p.dna),
      fixture: true,
    }));
  });
  p.brief = "AFTER HOURS is the working campaign title. Plan a fragrance film around the supplied product and ingredient footage: frosted bottle reveal, warm aromatic textures, sensory detail, final signature. Prepared sample excerpts are not generated output or proof of product consistency.";
  p.dna.subject = "Fragrance study: supplied frosted glass bottle, dark cap, cream label and aromatic ingredient textures. Preserve original branding.";
  p.dna.lighting = "Soft directional light on ivory fabric, contrasted with warm light on aromatic textures.";
  p.dna.palette = "Warm ivory, frosted white, aromatic brown, amber, near-black.";
  const directions = ["Reveal the frosted fragrance bottle against softly lit ivory fabric. Keep the original product label readable.", "Move into the dark cap and frosted glass details from the supplied product film. Emphasize the material finish.", "Hold the bottle silhouette in soft directional light against ivory fabric. Keep the source label intact.", "Return to a product signature with the citrus and floral elements visible in the supplied film. Preserve original branding and portrait composition."];
  p.shots.forEach((s,i) => { s.prompt = directions[i]; s.aspect = "9:16"; s.duration = 4; s.takes.forEach(t => { t.request = requestFor(p,s); t.dnaSignature = signature(p.dna); }); });
  return { version: 1, active: p.id, projects: [openChosenVersion(withMatchedStoryboard(withSuppliedMedia(p)))] };
}
