export const rules = ["subject", "style", "lighting", "palette", "camera"];
export const labels = {
  subject: "Subject / product",
  style: "Visual style",
  lighting: "Lighting",
  palette: "Color palette",
  camera: "Camera principles",
};
export const uid = () => globalThis.crypto.randomUUID();
/** Combine project defaults with non-empty shot overrides, without mutating either. */
export function effective(project, shot) {
  return Object.fromEntries(
    rules.map((k) => [k, shot.overrides[k]?.trim() || project.dna[k]]),
  );
}
export function signature(dna) {
  return JSON.stringify(dna);
}
export function requestFor(project, shot) {
  return {
    prompt: shot.prompt,
    direction: effective(project, shot),
    inherited: { ...project.dna },
    overrides: { ...shot.overrides },
    duration: shot.duration,
    aspect: shot.aspect,
    reference: shot.reference || null,
    dnaSignature: signature(project.dna),
  };
}
export function moveShot(shots, id, delta) {
  const copy = [...shots],
    i = copy.findIndex((s) => s.id === id),
    j = i + delta;
  if (i < 0 || j < 0 || j >= copy.length) return shots;
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}
export function newShot(name = "Untitled shot") {
  return {
    id: uid(),
    name,
    description: "A new moment in the campaign.",
    prompt: "",
    duration: 5,
    aspect: "16:9",
    overrides: {},
    takes: [],
    chosen: null,
    preview: null,
    note: "",
  };
}
/** Duplicate editorial content while assigning independent shot and take identities. */
export function duplicateShot(shot) {
  const copy = structuredClone(shot);
  copy.id = uid();
  copy.name = `${shot.name} — copy`;
  const ids = new Map(copy.takes.map((t) => [t.id, uid()]));
  copy.takes = copy.takes.map((t) => ({ ...t, id: ids.get(t.id) }));
  copy.chosen = ids.get(copy.chosen) || null;
  copy.preview = ids.get(copy.preview) || null;
  return copy;
}
export function validateRequest(r) {
  if (
    !r ||
    typeof r.prompt !== "string" ||
    r.prompt.trim().length < 8 ||
    r.prompt.length > 3000
  )
    return "Direction must contain 8–3000 characters.";
  if (![4, 5, 6, 8].includes(r.duration)) return "Choose a supported duration.";
  if (!["16:9", "9:16", "1:1"].includes(r.aspect))
    return "Choose a supported aspect ratio.";
  if (
    !r.direction ||
    rules.some(
      (k) =>
        typeof r.direction[k] !== "string" ||
        !r.direction[k].trim() ||
        r.direction[k].length > 1000,
    )
  )
    return "Complete all Creative DNA fields (maximum 1000 characters each).";
  return null;
}
export function packageProject(p) {
  return {
    format: "fomi-project-package",
    version: 1,
    exportedAt: new Date().toISOString(),
    ...p,
    shotOrder: p.shots.map((s) => s.id),
    notice: "Fixture footage. This package is not a rendered video.",
  };
}
export function recover(raw, seed) {
  try {
    const v = JSON.parse(raw);
    if (v.version !== 1 || !Array.isArray(v.projects) || !v.projects.length)
      throw Error();
    for (const p of v.projects) {
      if (
        !p.id ||
        typeof p.id !== "string" ||
        typeof p.name !== "string" ||
        typeof p.brief !== "string" ||
        !p.dna ||
        rules.some((k) => typeof p.dna[k] !== "string") ||
        !Array.isArray(p.shots)
      )
        throw Error();
      for (const s of p.shots) {
        if (
          !s.id ||
          typeof s.id !== "string" ||
          typeof s.name !== "string" ||
          typeof s.description !== "string" ||
          typeof s.note !== "string" ||
          typeof s.prompt !== "string" ||
          !s.overrides ||
          typeof s.overrides !== "object" ||
          rules.some(
            (k) =>
              s.overrides[k] !== undefined &&
              typeof s.overrides[k] !== "string",
          ) ||
          !Array.isArray(s.takes) ||
          ![4, 5, 6, 8].includes(s.duration) ||
          !["16:9", "9:16", "1:1"].includes(s.aspect)
        )
          throw Error();
        for (const t of s.takes)
          if (
            !t.id ||
            typeof t.id !== "string" ||
            typeof t.name !== "string" ||
            typeof t.createdAt !== "string" ||
            !Number.isFinite(Date.parse(t.createdAt)) ||
            ![
              "/demo/amber.webm",
              "/demo/veil.webm",
              "/demo/ritual.webm",
              "/demo/signature.webm",
            ].includes(t.src) ||
            !t.request ||
            typeof t.request.prompt !== "string" ||
            ![
              "/demo/amber.svg",
              "/demo/veil.svg",
              "/demo/ritual.svg",
              "/demo/signature.svg",
            ].includes(t.poster)
          )
            throw Error();
        if (s.chosen && !s.takes.some((t) => t.id === s.chosen)) throw Error();
        if (s.preview && !s.takes.some((t) => t.id === s.preview))
          throw Error();
      }
      if (new Set(p.shots.map((s) => s.id)).size !== p.shots.length)
        throw Error();
    }
    if (new Set(v.projects.map((p) => p.id)).size !== v.projects.length)
      throw Error();
    return { state: v, recovered: false };
  } catch {
    return { state: seed(), recovered: true };
  }
}
