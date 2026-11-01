/** Full source films are examples, not alternate versions of a planned shot. */
export const isSourceFilm = (take) => /^\/demo\/supplied-0[12]\.mp4$/.test(take?.src || "");
export const shotVersions = (shot) => shot.takes.filter(t => !isSourceFilm(t));
export function openChosenVersion(project) {
  if (project.reviewClarityVersion === 1) return project;
  return { ...project, reviewClarityVersion: 1, shots: project.shots.map(s => ({ ...s,
    preview: isSourceFilm(s.takes.find(t => t.id === s.preview)) && s.preview !== s.chosen
      ? s.chosen || shotVersions(s)[0]?.id || s.preview : s.preview,
  })) };
}
