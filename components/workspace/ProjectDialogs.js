"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Upload,
  ArrowRight,
  Check,
  AlertCircle,
  Layers,
  FileJson,
  ShieldCheck,
} from "lucide-react";
import Dialog from "../ui/Dialog";
import { labels, rules, uid, packageProject } from "../../lib/project";
import {
  palette,
  parsePackage,
  continuityIssues,
  enrich,
} from "../../lib/editor";
import { seed } from "../../data/seed";
import { Compare, SequenceReview } from "./Review";
import { DirectionDiff } from "./DirectionDiff";
import Storyboard from "./Storyboard";
import Media from "./Media";
import { suppliedMedia } from "../../lib/supplied-media";
function download(project) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(packageProject(project), null, 2)], {
      type: "application/json",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.replace(/[^a-z0-9]/gi, "-")}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function ProjectDialogs({
  modal,
  onClose,
  project,
  shot,
  take,
  update,
  setState,
  choose,
  cancel,
  clearHistory,
  setShotId,
  setNotice,
  storyboard,
  editor,
  resetGeneration,
}) {
  const [draft, setDraft] = useState(
      modal === "rename" ? project.name : "Untitled campaign",
    ),
    [pending, setPending] = useState(null),
    [error, setError] = useState("");
  const missing = project.shots.filter((s) => !s.chosen),
    issues = continuityIssues(project),
    total = project.shots.reduce((n, s) => n + s.duration, 0);
  async function importFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    setError("");
    setPending(null);
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024)
        throw Error("Choose a project package smaller than 5 MB.");
      setPending(parsePackage(await file.text()));
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <Dialog
      title={
        {
          dna: "Creative DNA",
          samples: "Full sample films",
          brief: "The creative brief",
          compare: "Compare alternatives",
          review: "Sequence review",
          export: "Export project package",
          delete: "Delete this shot?",
          reset: "Reset this workspace?",
          create: "Create a project",
          rename: "Rename project",
          settings: "How this version was made",
          import: "Bring your project back",
          continuity: "Check sequence",
          project: "Project tools",
          shots: "Shot storyboard",
          shortcuts: "A little faster, by keyboard",
        }[modal]
      }
      onClose={onClose}
      wide={["compare", "review", "dna", "continuity", "samples"].includes(modal)}
    >
      {modal === "samples" && <>
        <p className="muted">These full films show the supplied footage. They are separate examples, may show different products, and are not versions of your selected shot. The app does not generate them.</p>
        <div className="sample-film-grid">{suppliedMedia.map(t => <section key={t.id}>
          <h3>{t.name}</h3><Media take={{...t, mediaOrigin:"user-supplied"}} compact />
          <p>{t.duration.toFixed(1)} seconds · portrait. Your sequence uses short shot clips instead.</p>
          <a className="button" href={t.src} download>Download sample film</a>
        </section>)}</div>
      </>}
      {modal === "project" && (
        <>
          <p className="muted" role="status">
            {editor.save}. Projects are stored in this browser.
          </p>
          <div className="project-tool-grid">
            {[
              ["create", "Create project"],
              ["rename", "Rename project"],
              ["import", "Import project package"],
              ["brief", "Creative brief"],
              ["dna", "Creative DNA"],
              ["continuity", "Continuity review"],
              ["shortcuts", "Keyboard shortcuts"],
              ["reset", "Reset demo"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => storyboard.setModal(id)}>
                {label}
                <ArrowRight size={14} />
              </button>
            ))}
            <button
              disabled={!editor.canUndo}
              onClick={() => {
                editor.undo();
                onClose();
              }}
            >
              Undo last edit
            </button>
            <button
              disabled={!editor.canRedo}
              onClick={() => {
                editor.redo();
                onClose();
              }}
            >
              Redo last edit
            </button>
          </div>
        </>
      )}
      {modal === "dna" && (
        <>
          <div className="dna-dialog-heading">
            <span className="dna-mark">✳</span>
            <div>
              <p className="dialog-intro">One set of style rules for every shot.</p>
              <p className="muted">
                Creative DNA is your project's shared style: the product, look,
                light, colors and camera movement. Changes apply to new requests.
                Older versions keep the settings they used before.
              </p>
            </div>
          </div>
          <div className="dna-dialog-grid">
            <div className="dna-visual">
              <Image
                src={project.references?.[0]?.src || "/demo/study-reveal.webp"}
                alt="After Hours fragrance product reference"
                width={600}
                height={400}
                unoptimized
              />
              <div className="palette-label">
                <span className="eyebrow">THE CAMPAIGN PALETTE</span>
                <div className="palette-swatches">
                  {palette.map((c) => (
                    <span key={c} style={{ background: c }} title={c} />
                  ))}
                </div>
                <p>Amber / Tobacco / Warm ivory</p>
              </div>
              <p className="muted">
                Visual mood references. This demonstration saves direction and
                reference metadata; it does not enforce model consistency.
              </p>
            </div>
            <div className="dna-fields">
              {rules.map((k) => (
                <label className="field" key={k}>
                  {labels[k]}
                  <textarea
                    maxLength={1000}
                    value={project.dna[k]}
                    onChange={(e) =>
                      update(
                        (p) => ({
                          ...p,
                          dna: { ...p.dna, [k]: e.target.value },
                        }),
                        { label: `Edit ${labels[k]}` },
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="dialog-bottom">
            <span className="muted">Automatically saved in this browser.</span>
            <button className="primary" onClick={onClose}>
              Done <Check size={14} />
            </button>
          </div>
        </>
      )}
      {modal === "brief" && (
        <>
          <span className="eyebrow">AFTER HOURS / THE INTENTION</span>
          <p className="dialog-intro">
            The city falls quiet.
            <br />A private ritual begins.
          </p>
          <label className="field">
            Campaign brief
            <textarea
              className="brief-editor"
              maxLength={5000}
              value={project.brief}
              onChange={(e) =>
                update((p) => ({ ...p, brief: e.target.value }), {
                  label: "Edit creative brief",
                })
              }
            />
          </label>
          <p className="muted">
            A living brief, kept alongside the shots it informs.
          </p>
        </>
      )}
      {["create", "rename"].includes(modal) && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            if (modal === "rename")
              update((p) => ({ ...p, name: draft.trim() }), {
                label: "Rename project",
              });
            else {
              const p = enrich({
                id: uid(),
                name: draft.trim(),
                brief: "Define the intention for this campaign.",
                dna: { ...project.dna },
                shots: [],
                references: [],
              });
              setState((s) => ({
                ...s,
                active: p.id,
                projects: [...s.projects, p],
              }));
            }
            onClose();
          }}
        >
          <p className="muted">
            Your work stays in this browser. Export a package whenever you need
            a portable copy.
          </p>
          <label className="field">
            Project name
            <input
              autoFocus
              required
              maxLength={100}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <button className="primary">
            {modal === "create" ? "Create project" : "Save name"}{" "}
            <ArrowRight size={15} />
          </button>
        </form>
      )}
      {modal === "compare" && shot && (
        <Compare
          shot={shot}
          choose={choose}
          project={project}
          onNote={(id, note) =>
            update(
              (p) => ({
                ...p,
                shots: p.shots.map((s) =>
                  s.id === shot.id
                    ? {
                        ...s,
                        takes: s.takes.map((t) =>
                          t.id === id ? { ...t, note } : t,
                        ),
                        ...(s.chosen === id ? { note } : {}),
                      }
                    : s,
                ),
              }),
              { label: "Edit decision note" },
            )
          }
        />
      )}
      {modal === "review" && <SequenceReview project={project} />}
      {modal === "settings" && take && (
        <>
          <div className="provenance-title">
            <span className="take-tag">{take.name}</span>
            <span className="muted">
              {new Date(take.createdAt).toLocaleString()}
            </span>
          </div>
          <p>{take.request.prompt}</p>
          {take.mediaOrigin === "user-supplied" && <p className="muted">Supplied sample footage · {take.actualDuration?.toFixed(1)}s · portrait 9:16. Direction below is illustrative demo metadata, not the request that produced this footage. Different product examples do not demonstrate model consistency.</p>}
          <DirectionDiff project={project} take={take} />
          <div className="request-facts">
            <span>{take.request.duration}s requested</span>
            <span>{take.request.aspect}</span>
            <span>{take.request.references?.length || 0} references</span>
          </div>
          <p className="muted">
            Prepared cinematic fixture. Request settings do not change the
            pixels. Playback uses the complete original clip; planned duration and requested format do not trim or reframe footage.
          </p>
          <details className="raw-request">
            <summary>Full submitted request</summary>
            <pre>{JSON.stringify(take.request, null, 2)}</pre>
          </details>
          <a className="button" href={take.src} download>
            <Download size={14} /> Download fixture clip
          </a>
        </>
      )}
      {modal === "continuity" && (
        <>
          <p className="dialog-intro">A final look at the creative thread.</p>
          <p className="muted">
            These checks compare project metadata and saved decisions. They do
            not inspect the footage or guarantee visual consistency.
          </p>
          <div className="review-summary">
            <ShieldCheck size={22} />
            <div>
              <strong>
                {missing.length
                  ? `${missing.length} shot(s) need a chosen take`
                  : "Every shot has a chosen take"}
              </strong>
              <small>
                {issues.length} review {issues.length === 1 ? "note" : "notes"}{" "}
                · decision notes are optional
              </small>
            </div>
          </div>
          <div className="continuity-list">
            {issues.map((issue, i) => (
              <button
                key={`${issue.shotId}-${i}`}
                onClick={() => {
                  setShotId(issue.shotId);
                  onClose();
                }}
              >
                <span className={`issue-icon ${issue.kind}`}>
                  {issue.kind === "selection" ? (
                    <AlertCircle size={18} />
                  ) : (
                    <Layers size={18} />
                  )}
                </span>
                <span>
                  <small>{issue.kind.toUpperCase()}</small>
                  <strong>{issue.title}</strong>
                  <p>{issue.detail}</p>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
            {!issues.length && (
              <p className="muted">
                No metadata issues to review. Play the sequence and trust your
                editorial judgment.
              </p>
            )}
          </div>
        </>
      )}
      {modal === "export" && (
        <>
          <div className="package-icon">
            <FileJson size={27} />
          </div>
          <p className="dialog-intro">Take the thinking with you.</p>
          <p>
            Download the brief, Creative DNA, references, ordered shots, every
            submitted request, chosen takes and decision history.
          </p>
          <div className="export-summary">
            <span>{project.shots.length} shots</span>
            <span>{total}s planned</span>
            <span>{project.shots.length - missing.length} chosen</span>
          </div>
          {missing.length > 0 && (
            <p className="warning">
              Missing selections: {missing.map((s) => s.name).join(", ")}. These
              shots remain unselected in the package.
            </p>
          )}
          <div className="export-check">
            <Check size={15} />
            <span>
              Includes your current edits, even while autosave is pending.
            </span>
          </div>
          <div className="export-check">
            <Check size={15} />
            <span>
              Import later as a separate project. Your existing work stays
              intact.
            </span>
          </div>
          <p className="muted">
            JSON project package, not a rendered MP4. Fixture clips are
            referenced by local paths; download them individually in Take
            details. Uploaded reference thumbnails are included.
          </p>
          <button
            className="primary full-width"
            onClick={() => download(project)}
          >
            <Download size={15} /> Download project JSON
          </button>
        </>
      )}
      {modal === "import" && (
        <>
          <p className="dialog-intro">Pick up the creative thread.</p>
          <p className="muted">
            Choose a previously exported Fomi JSON package. We validate it
            before adding a separate project. Existing projects are never
            replaced.
          </p>
          <label className="upload-package">
            <Upload size={23} />
            <strong>Choose project package</strong>
            <small>JSON · maximum 5 MB</small>
            <input
              type="file"
              accept="application/json,.json"
              aria-label="Choose project package"
              aria-describedby="import-error"
              onChange={importFile}
            />
          </label>
          {error && (
            <p className="field-error" id="import-error" role="alert">
              {error}
            </p>
          )}
          {pending && (
            <div className="import-preview">
              <Check size={18} />
              <div>
                <strong>{pending.name}</strong>
                <p>
                  {pending.shots.length} shots · {pending.references.length}{" "}
                  references · validated
                </p>
              </div>
            </div>
          )}
          <button
            className="primary full-width"
            disabled={!pending}
            onClick={() => {
              setState((s) => ({
                ...s,
                active: pending.id,
                projects: [...s.projects, pending],
              }));
              setNotice(
                "Package imported as a separate project. Original projects are unchanged.",
              );
              onClose();
            }}
          >
            Import as a new project <ArrowRight size={15} />
          </button>
        </>
      )}
      {modal === "delete" && (
        <>
          <p>
            Remove “{shot?.name}”, its takes and editorial decisions from this
            project?
          </p>
          <p className="muted">
            You can undo this action during this session. Running generation for
            the shot will be cancelled.
          </p>
          <div className="dialog-actions">
            <button onClick={onClose}>Keep shot</button>
            <button
              className="danger"
              onClick={() => {
                cancel(shot.id);
                update(
                  (p) => ({
                    ...p,
                    shots: p.shots.filter((s) => s.id !== shot.id),
                  }),
                  { label: "Delete shot" },
                );
                onClose();
              }}
            >
              Delete shot
            </button>
          </div>
        </>
      )}
      {modal === "reset" && (
        <>
          <p>
            This replaces all browser-local projects and edits with the original
            demo. Export a package first if you need to keep your work.
          </p>
          <p className="warning">
            Reset clears session undo history and cannot be undone.
          </p>
          <div className="dialog-actions">
            <button onClick={onClose}>Keep my work</button>
            <button
              className="danger"
              onClick={() => {
                resetGeneration();
                const s = seed();
                setState({ ...s, projects: s.projects.map(enrich) });
                clearHistory();
                onClose();
                setNotice("Demo reset. Original campaign restored.");
              }}
            >
              Reset all local projects
            </button>
          </div>
        </>
      )}
      {modal === "shots" && <Storyboard {...storyboard} embedded />}
      {modal === "shortcuts" && (
        <>
          <p className="muted">
            Shortcuts stay out of the way while you type in a field.
          </p>
          <div className="shortcut-list">
            {[
              ["Undo editorial change", "Ctrl / ⌘ + Z"],
              ["Redo editorial change", "Ctrl / ⌘ + Shift + Z"],
              ["Previous / next shot", "Alt + ← / →"],
              ["Exit focus mode", "Escape"],
              ["Open this guide", "?"],
              ["Move through controls", "Tab / Shift + Tab"],
            ].map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <kbd>{b}</kbd>
              </div>
            ))}
          </div>
          <p className="muted">
            Up to 25 grouped edits are kept per session. Completed generations
            are retained when undoing editorial changes.
          </p>
        </>
      )}
    </Dialog>
  );
}
