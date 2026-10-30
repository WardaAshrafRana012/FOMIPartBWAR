"use client";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { rules, labels, effective, requestFor } from "../../lib/project";
export default function DirectionPanel({
  shot,
  project,
  tab,
  setTab,
  editShot,
  advanced,
  setAdvanced,
  fail,
  setFail,
  job,
  busy,
  start,
  cancel,
}) {
  return (
    <section className="direction-panel" aria-label="Shot direction">
      <div className="panel-tabs">
        <button
          className={tab === "direction" ? "active" : ""}
          onClick={() => setTab("direction")}
        >
          Direction
        </button>
        <button
          className={tab === "inherited" ? "active" : ""}
          onClick={() => setTab("inherited")}
        >
          Effective direction
        </button>
      </div>
      {tab === "direction" ? (
        <>
          <div className="direction-body">
            <label className="field">
              SHOT NAME
              <input
                value={shot.name}
                maxLength={100}
                onChange={(e) => editShot({ name: e.target.value })}
              />
            </label>
            <label className="field">
              STORY BEAT
              <input
                value={shot.description}
                maxLength={180}
                onChange={(e) => editShot({ description: e.target.value })}
              />
            </label>
            <div className="field-label">
              <label htmlFor="prompt">SHOT DIRECTION</label>
              <span>Your creative intent</span>
            </div>
            <textarea
              aria-describedby="generation-status"
              aria-invalid={job?.status === "failed"}
              id="prompt"
              value={shot.prompt}
              maxLength={3000}
              onChange={(e) => editShot({ prompt: e.target.value })}
              placeholder="Describe the moment, movement, and composition…"
            />
            <p className="inherit-note">
              <span>✳</span> Inheriting your project’s Creative DNA
            </p>
            <div className="control-pair">
              <label className="field">
                DURATION
                <select
                  value={shot.duration}
                  onChange={(e) =>
                    editShot({ duration: Number(e.target.value) })
                  }
                >
                  {[4, 5, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} seconds
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                ASPECT RATIO
                <select
                  value={shot.aspect}
                  onChange={(e) => editShot({ aspect: e.target.value })}
                >
                  {["16:9", "9:16", "1:1"].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <button
              className="advanced-toggle"
              aria-expanded={advanced}
              onClick={() => setAdvanced(!advanced)}
            >
              <SlidersHorizontal size={14} /> Shot overrides & reference{" "}
              <span>{advanced ? "−" : "+"}</span>
            </button>
            {advanced && (
              <div className="advanced">
                {rules.map((k) => (
                  <label className="field" key={k}>
                    {labels[k]}{" "}
                    <span>{shot.overrides[k] ? "OVERRIDE" : "INHERITED"}</span>
                    <input
                      placeholder={project.dna[k]}
                      value={shot.overrides[k] || ""}
                      maxLength={1000}
                      onChange={(e) =>
                        editShot({
                          overrides: { ...shot.overrides, [k]: e.target.value },
                        })
                      }
                    />
                  </label>
                ))}
                <label className="field">
                  VISUAL REFERENCE
                  <select
                    value={shot.reference || ""}
                    onChange={(e) => editShot({ reference: e.target.value })}
                  >
                    <option value="">None</option>
                    {project.shots.flatMap((s) =>
                      s.takes.map((t) => (
                        <option key={`${s.id}-${t.id}`} value={t.id}>
                          {s.name} / {t.name}
                        </option>
                      )),
                    )}
                  </select>
                </label>
                <p className="muted">
                  Reference is saved metadata. It does not alter fixture
                  footage.
                </p>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={fail}
                    onChange={(e) => setFail(e.target.checked)}
                  />{" "}
                  Demonstrate generation failure
                </label>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="effective-summary">
          <p>
            The exact direction sent with the next request. Existing takes keep
            their original snapshot.
          </p>
          <blockquote>
            {shot.prompt || "Add shot direction to begin."}
          </blockquote>
          {rules.map((k) => (
            <div key={k}>
              <span className="eyebrow">
                {labels[k]}{" "}
                <b>{shot.overrides[k] ? "OVERRIDE" : "INHERITED"}</b>
              </span>
              <p>{effective(project, shot)[k]}</p>
            </div>
          ))}
        </div>
      )}
      <div className="generate-footer">
        {job && (
          <div
            id="generation-status"
            className={`job ${job.status}`}
            role="status"
          >
            <strong>
              {job.status === "generating"
                ? "Developing alternatives…"
                : job.status === "queued"
                  ? "Request queued…"
                  : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </strong>
            <small>
              {job.message || "You can keep working on other shots."}
            </small>
          </div>
        )}
        {busy ? (
          <button className="cancel-button" onClick={() => cancel(shot.id)}>
            Cancel generation
          </button>
        ) : (
          <button
            className="generate-button"
            onClick={() =>
              start(project.id, shot.id, requestFor(project, shot), fail)
            }
          >
            <Sparkles size={16} />
            {job?.status === "failed" || job?.status === "cancelled"
              ? "Retry · 2 alternatives"
              : "Generate 2 alternatives"}
            <span>↗</span>
          </button>
        )}
        <p>Curated local fixtures · no credits or API keys</p>
      </div>
    </section>
  );
}
