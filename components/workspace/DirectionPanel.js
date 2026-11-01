"use client";
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  Camera,
  Check,
  Clock3,
} from "lucide-react";
import { rules, labels, effective, requestFor } from "../../lib/project";
import References from "./References";
import { DirectionDiff } from "./DirectionDiff";
export default function DirectionPanel({
  shot,
  project,
  tab,
  setTab,
  editShot,
  update,
  advanced,
  setAdvanced,
  fail,
  setFail,
  job,
  busy,
  start,
  cancel,
  setModal,
}) {
  return (
    <section className="direction-panel" aria-label="Shot direction">
      <div className="panel-tabs" role="tablist" aria-label="Shot inspector">
        {["direction", "references", "history"].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "references" && (
              <span>{project.references?.length || 0}</span>
            )}
          </button>
        ))}
      </div>
      <div
        className="inspector-scroll"
        role="tabpanel"
        aria-label={`${tab} panel`}
      >
        {tab === "direction" && (
          <div className="direction-body">
            <div className="inspector-intro">
              <span className="eyebrow">THE IDEA BEHIND THE FRAME</span>
              <h3>Describe this shot.</h3>
            </div>
            <div className="field-label">
              <label htmlFor="prompt">Shot direction</label>
              <span>{shot.prompt.length}/3000</span>
            </div>
            <textarea
              id="prompt"
              aria-describedby={job ? "generation-status" : "direction-help"}
              aria-invalid={job?.status === "failed"}
              value={shot.prompt}
              maxLength={3000}
              onChange={(e) => editShot({ prompt: e.target.value })}
              placeholder="Describe the moment, movement, and composition…"
            />
            <button className="inherit-note" onClick={() => setModal("dna")}>
              <span>✳</span>
              <span>
                <strong>Creative DNA · shared style rules</strong>
                <small>
                  {rules.filter((k) => shot.overrides[k]?.trim()).length
                    ? `${rules.filter((k) => shot.overrides[k]?.trim()).length} shot override(s)`
                    : "Using all 5 rules from this project"}
                </small>
              </span>
              <ArrowUpRight size={13} />
            </button>
            <div className="control-pair">
              <label className="field">
                Duration
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
                Video shape
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
            <p id="direction-help" className="setting-hint">
              These settings are saved with your request. In this demo, they do
              not change the sample video.
            </p>
            <details className="effective-details">
              <summary>
                What will be sent <span>Prompt + style rules</span>
              </summary>
              <div className="effective-summary">
                <p>
                  Your description and these rules are saved for the next
                  request. Older versions keep the settings they used before.
                </p>
                {rules.map((k) => (
                  <div key={k}>
                    <span className="eyebrow">
                      {labels[k]}
                      <b>{shot.overrides[k] ? "CHANGED FOR THIS SHOT" : "FROM PROJECT"}</b>
                    </span>
                    <p>{effective(project, shot)[k]}</p>
                  </div>
                ))}
              </div>
            </details>
            <button
              className="advanced-toggle"
              aria-expanded={advanced}
              onClick={() => setAdvanced(!advanced)}
            >
              <SlidersHorizontal size={14} /> Change rules for this shot{" "}
              <span>{advanced ? "−" : "+"}</span>
            </button>
            {advanced && (
              <div className="advanced">
                {rules.map((k) => (
                  <label key={k} className="field">
                    {labels[k]}
                    <span>{shot.overrides[k] ? "THIS SHOT ONLY" : "FROM PROJECT"}</span>
                    <input
                      maxLength={1000}
                      value={shot.overrides[k] || ""}
                      placeholder={project.dna[k]}
                      onChange={(e) =>
                        editShot({
                          overrides: { ...shot.overrides, [k]: e.target.value },
                        })
                      }
                    />
                  </label>
                ))}
                <button
                  className="text-button"
                  onClick={() => setTab("references")}
                >
                  Choose visual references <ArrowUpRight size={13} />
                </button>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={fail}
                    onChange={(e) => setFail(e.target.checked)}
                  />{" "}
                  Test a failed request
                </label>
              </div>
            )}
            <details className="shot-details">
              <summary>Edit shot details</summary>
              <label className="field">
                SHOT NAME
                <input
                  maxLength={100}
                  value={shot.name}
                  onChange={(e) => editShot({ name: e.target.value })}
                />
              </label>
              <label className="field">
                WHAT HAPPENS IN THIS SHOT
                <input
                  maxLength={180}
                  value={shot.description}
                  onChange={(e) => editShot({ description: e.target.value })}
                />
              </label>
            </details>
          </div>
        )}
        {tab === "references" && (
          <References
            project={project}
            shot={shot}
            editShot={editShot}
            update={update}
          />
        )}
        {tab === "history" && (
          <div className="history-panel">
            <div className="inspector-intro">
              <span className="eyebrow">EVERY TAKE HAS A STORY</span>
              <h3>Past versions and choices.</h3>
              <p>
                See the settings used before and why a version was chosen.
                These are saved records, not an AI check of the video.
              </p>
            </div>
            {[...shot.takes].reverse().map((t) => (
              <details key={t.id} className="history-take">
                <summary>
                  <span>
                    <strong>{t.name}</strong>
                    <small>
                      {new Date(t.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {t.request.duration}s
                    </small>
                  </span>
                  {shot.chosen === t.id ? (
                    <span className="history-chosen">
                      <Check size={12} /> Chosen
                    </span>
                  ) : (
                    <Clock3 size={14} />
                  )}
                </summary>
                <p className="history-prompt">{t.request.prompt}</p>
                {t.note && <blockquote>{t.note}</blockquote>}
                <DirectionDiff project={project} take={t} />
                <button
                  onClick={() =>
                    editShot({ preview: t.id }, { history: false })
                  }
                >
                  Preview this take
                </button>
                <details className="raw-request">
                  <summary>Full submitted request</summary>
                  <pre>{JSON.stringify(t.request, null, 2)}</pre>
                </details>
              </details>
            ))}
            {!shot.takes.length && (
              <p className="muted">
                Your first generation will begin this shot’s history.
              </p>
            )}
            <h4 className="activity-title">RECENT ACTIVITY</h4>
            {(project.activity || [])
              .filter((a) => a.shotId === shot.id)
              .slice(-10)
              .reverse()
              .map((a) => (
                <div className="activity-item" key={a.id}>
                  <span className="save-dot" />
                  <p>
                    {a.message}
                    <small>
                      {new Date(a.at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="generate-footer">
        {job && (
          <div
            id="generation-status"
            className={`job ${job.status}`}
            role="status"
          >
            <div className="job-heading">
              <span className={busy ? "spinner" : ""} />
              <strong>
                {job.status === "generating"
                  ? "Preparing two versions…"
                  : job.status === "queued"
                    ? "Waiting to start…"
                    : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </strong>
            </div>
            <small>
              {job.message ||
                "Keep working. This request stays with this shot."}
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
            {["failed", "cancelled"].includes(job?.status)
              ? "Retry · 2 alternatives"
              : "Generate 2 alternatives"}
            <ArrowUpRight size={16} />
          </button>
        )}
        <p>
          <span className="live-dot" /> Demo generation · no credits required
        </p>
        <small className="reload-hint">
          Reload cancels unfinished simulations.
        </small>
      </div>
    </section>
  );
}
