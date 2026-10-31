export const storyboardMedia = ["reveal", "texture", "ritual", "signature"].map((name, i) => ({
  src: `/demo/study-${name}.webm`, poster: `/demo/study-${name}.webp`,
  mediaOrigin: "user-supplied", actualDuration: 4, actualAspect: "9:16",
  provenance: "Silent four-second excerpt from supplied video 01. Not app-generated. Alternate takes reuse this excerpt; video 02 remains a distinct sample alternative.",
}));

/** Migrate bundled fixtures, preserving custom takes, settings and decisions. */
export function withMatchedStoryboard(project) {
  if (project.id !== "after-hours" || project.storyboardMediaVersion === 1) return project;
  const oldNames = ["The invitation", "Light through amber", "The evening ritual", "A lasting impression"];
  const names = ["The product reveal", "The crafted detail", "Light and silhouette", "The signature"];
  const refs = { "/demo/signature.webp": storyboardMedia[0].poster, "/demo/material.webp": storyboardMedia[1].poster, "/demo/invitation.webp": storyboardMedia[3].poster };
  return { ...project, storyboardMediaVersion: 1,
    dna: { ...project.dna,
      subject: project.dna.subject.startsWith("AFTER HOURS eau de parfum.") ? "Supplied frosted fragrance bottle with dark cap and cream label. Preserve original branding." : project.dna.subject,
      lighting: project.dna.lighting.startsWith("A single warm sidelight.") ? "Soft directional light and shadows on ivory fabric." : project.dna.lighting,
    },
    references: project.references?.map(r => refs[r.src] ? { ...r, src: refs[r.src], name: r.id === "ref-product" ? "Supplied product frame" : r.id === "ref-light" ? "Ingredient texture frame" : "Supplied campaign frame" } : r),
    shots: project.shots.map(s => { const i = ["shot-0", "shot-1", "shot-2", "shot-3"].indexOf(s.id); if (i < 0) return s;
      return { ...s, name: s.name === oldNames[i] ? names[i] : s.name,
        takes: s.takes.map(t => t.id === `take-${i}-1` || t.id === `take-${i}-2` ? { ...t, ...storyboardMedia[i] } : t) };
    }),
  };
}
