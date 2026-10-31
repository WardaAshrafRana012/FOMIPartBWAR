import { directionChanges } from "../../lib/editor";
import { labels, rules } from "../../lib/project";
export function DirectionDiff({ project, take }) {
  const changes = directionChanges(project, take);
  return (
    <section className="direction-diff">
      <span className="eyebrow">SAVED TAKE → CURRENT PROJECT</span>
      <h3>
        {changes.length
          ? `${changes.length} creative ${changes.length === 1 ? "rule has" : "rules have"} changed`
          : "This take uses your current Creative DNA"}
      </h3>
      <p className="muted">
        A comparison of saved requests, not an analysis of the video.
      </p>
      {changes.map((c) => (
        <div className="diff-item" key={c.key}>
          <strong>{labels[c.key]}</strong>
          <del>{c.before}</del>
          <ins>{c.after}</ins>
        </div>
      ))}
    </section>
  );
}
export function SettingsDiff({ left, right }) {
  const fields = [
    ["prompt", "Prompt"],
    ["duration", "Duration"],
    ["aspect", "Aspect ratio"],
    ...rules.map((k) => [`direction.${k}`, labels[k]]),
  ];
  const get = (t, k) =>
    k.startsWith("direction.")
      ? t.request.direction?.[k.split(".")[1]]
      : t.request[k];
  const changed = fields.filter(([k]) => get(left, k) !== get(right, k));
  return (
    <div className="settings-diff">
      <span className="eyebrow">WHAT CHANGED BETWEEN THESE TAKES</span>
      {changed.length ? (
        changed.map(([k, label]) => (
          <div key={k}>
            <strong>{label}</strong>
            <p>
              <span>A</span> {get(left, k)}
            </p>
            <p>
              <span>B</span> {get(right, k)}
            </p>
          </div>
        ))
      ) : (
        <p>
          Same submitted direction and settings. Compare the fixture composition
          and camera study.
        </p>
      )}
    </div>
  );
}
