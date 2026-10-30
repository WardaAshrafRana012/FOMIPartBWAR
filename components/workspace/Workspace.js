"use client";
import Storyboard from "./Storyboard";
import DirectionPanel from "./DirectionPanel";
import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Copy,
  Trash2,
  Clapperboard,
  Layers,
  Download,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useProject } from "../../hooks/useProject";
import { useGeneration } from "../../hooks/useGeneration";
import {
  labels,
  rules,
  signature,
  newShot,
  duplicateShot,
  uid,
  packageProject,
} from "../../lib/project";
import { seed } from "../../data/seed";
import Dialog from "../ui/Dialog";
import Media from "./Media";
import { Compare, SequenceReview } from "./Review";
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
export default function Workspace() {
  const { state, setState, project, update, save, notice, setNotice } =
    useProject();
  const { jobs, start, cancel } = useGeneration(setState);
  const shotId = project?.selectedShot;
  const setShotId = (id) => update((p) => ({ ...p, selectedShot: id }));
  const [modal, setModal] = useState(null),
    [collapsed, setCollapsed] = useState(false),
    [advanced, setAdvanced] = useState(false),
    [fail, setFail] = useState(false),
    [tab, setTab] = useState("direction"),
    [draft, setDraft] = useState("");
  if (!project)
    return (
      <main className="loading">
        <span className="brand">
          fomi<span>✳</span>
        </span>
        <p>Returning to your creative workspace…</p>
      </main>
    );
  const shot = project.shots.find((s) => s.id === shotId) || project.shots[0];
  const take =
    shot?.takes.find((t) => t.id === shot.preview) ||
    shot?.takes.find((t) => t.id === shot.chosen) ||
    shot?.takes[0];
  const job = jobs[shot?.id];
  const busy = ["queued", "generating"].includes(job?.status);
  const total = project.shots.reduce((n, s) => n + s.duration, 0);
  const missing = project.shots.filter((s) => !s.chosen);
  const editShot = (patch) =>
    update((p) => ({
      ...p,
      shots: p.shots.map((s) => (s.id === shot.id ? { ...s, ...patch } : s)),
    }));
  const add = () => {
    const s = newShot(
      `Shot ${String(project.shots.length + 1).padStart(2, "0")}`,
    );
    update((p) => ({ ...p, shots: [...p.shots, s] }));
    setShotId(s.id);
  };
  const choose = (id) => editShot({ chosen: id, preview: id });
  const openName = (type) => {
    setDraft(type === "rename" ? project.name : "Untitled campaign");
    setModal(type);
  };
  return (
    <div className={`workspace ${collapsed ? "rail-collapsed" : ""}`}>
      <aside className="project-rail" aria-label="Project navigation">
        <a className="brand" href="/" aria-label="Fomi Continuity">
          fomi<span>✳</span>
        </a>
        <div className="rail-icons">
          <button
            className="active-icon"
            title="Video workspace"
            aria-label="Video workspace"
          >
            <Clapperboard size={21} />
          </button>
          <button
            title="Creative DNA"
            aria-label="Open Creative DNA"
            onClick={() => setModal("dna")}
          >
            <Layers size={21} />
          </button>
        </div>
        <span className="rail-bottom">AC</span>
      </aside>
      <header className="topbar">
        <div className="project-heading">
          <span className="eyebrow">
            WORKSPACE <span>/</span> CONTINUITY
          </span>
          <div className="project-switch">
            <select
              aria-label="Switch project"
              value={project.id}
              onChange={(e) => {
                setState((s) => ({ ...s, active: e.target.value }));
              }}
            >
              {state.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              aria-label="Rename project"
              title="Rename project"
              onClick={() => openName("rename")}
            >
              ↗
            </button>
          </div>
        </div>
        <div className="top-actions">
          <span className="save-status" role="status">
            <span
              className={
                save.startsWith("Save failed") ? "error-dot" : "save-dot"
              }
            />{" "}
            {save}
          </span>
          <button
            className="quiet new-project"
            onClick={() => openName("create")}
          >
            <Plus size={15} /> Project
          </button>
          <button className="export-button" onClick={() => setModal("export")}>
            <Download size={15} /> Export package
          </button>
        </div>
      </header>
      <Storyboard
        project={project}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setModal={setModal}
        jobs={jobs}
        shot={shot}
        setShotId={setShotId}
        update={update}
        add={add}
      />
      <main className="main-workspace">
        <div className="workspace-meta">
          <span>
            <span className="live-dot" /> Demo generation
          </span>
          <span>
            CAMPAIGN FILM <span className="meta-divider">/</span> {total} SEC
            PLANNED
          </span>
        </div>
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
              ✕
            </button>
          </div>
        )}
        {shot ? (
          <>
            <div className="shot-heading">
              <div>
                <span className="eyebrow">
                  SHOT{" "}
                  {String(project.shots.indexOf(shot) + 1).padStart(2, "0")}{" "}
                  <span>/</span> {shot.description}
                </span>
                <h1>{shot.name}</h1>
              </div>
              <div className="shot-tools">
                <button
                  title="Duplicate shot"
                  aria-label="Duplicate shot"
                  onClick={() => {
                    const copy = duplicateShot(shot);
                    update((p) => ({
                      ...p,
                      shots: [
                        ...p.shots.slice(0, p.shots.indexOf(shot) + 1),
                        copy,
                        ...p.shots.slice(p.shots.indexOf(shot) + 1),
                      ],
                    }));
                    setShotId(copy.id);
                  }}
                >
                  <Copy size={16} />
                </button>
                <button
                  title="Delete shot"
                  aria-label="Delete shot"
                  onClick={() => setModal("delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="work-area">
              <section className="preview-column" aria-label="Shot preview">
                <div className="stage">
                  <div className="stage-top">
                    <span>{take?.name || "NO TAKE YET"}</span>
                    <span>
                      {shot.aspect} <span>·</span> {shot.duration}s planned
                    </span>
                  </div>
                  <Media key={take?.id || "empty"} take={take} />
                </div>
                <div className="preview-caption">
                  <span>
                    {take?.id === shot.chosen ? (
                      <>
                        <Check size={14} /> Chosen for sequence
                      </>
                    ) : (
                      "Previewing alternative"
                    )}{" "}
                    {take && take.dnaSignature !== signature(project.dna) && (
                      <em>Earlier DNA</em>
                    )}
                  </span>
                  {take && (
                    <button
                      className="quiet"
                      onClick={() => setModal("settings")}
                    >
                      Take details <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
                <div className="takes-heading">
                  <h2>
                    Explore takes <span>{shot.takes.length}</span>
                  </h2>
                  <button
                    disabled={shot.takes.length < 2}
                    onClick={() => setModal("compare")}
                  >
                    <span>◫</span> Compare takes
                  </button>
                </div>
                <div
                  className="take-strip"
                  tabIndex={0}
                  aria-label="Takes, scroll horizontally"
                >
                  {shot.takes.map((t) => (
                    <button
                      key={t.id}
                      className={`take-card ${take?.id === t.id ? "previewing" : ""}`}
                      onClick={() => editShot({ preview: t.id })}
                    >
                      <div>
                        <Image
                          src={t.poster}
                          alt={`${t.name} product study`}
                          width={180}
                          height={102}
                          unoptimized
                        />
                        {shot.chosen === t.id && (
                          <span className="chosen-badge">
                            <Check size={11} /> In sequence
                          </span>
                        )}
                      </div>
                      <span>
                        {t.name}
                        <small>
                          {t.dnaSignature !== signature(project.dna)
                            ? "Earlier DNA"
                            : `${t.request.duration}s · ${t.request.aspect}`}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
                {take && (
                  <div className="decision-row">
                    <button
                      className={
                        shot.chosen === take.id ? "chosen-button" : "primary"
                      }
                      onClick={() => choose(take.id)}
                    >
                      {shot.chosen === take.id ? (
                        <>
                          <Check size={14} /> Chosen take
                        </>
                      ) : (
                        "Choose this take"
                      )}
                    </button>
                    <label>
                      DECISION NOTE
                      <input
                        aria-label="Decision note"
                        placeholder="Why does this take work?"
                        value={shot.note}
                        maxLength={500}
                        onChange={(e) => editShot({ note: e.target.value })}
                      />
                    </label>
                  </div>
                )}
              </section>
              <DirectionPanel
                shot={shot}
                project={project}
                tab={tab}
                setTab={setTab}
                editShot={editShot}
                advanced={advanced}
                setAdvanced={setAdvanced}
                fail={fail}
                setFail={setFail}
                job={job}
                busy={busy}
                start={start}
                cancel={cancel}
              />
            </div>
          </>
        ) : (
          <section className="empty-workspace">
            <h1>Every story starts with a shot.</h1>
            <p>Your Creative DNA is ready. Add the first moment.</p>
            <button className="primary" onClick={add}>
              Add a shot
            </button>
          </section>
        )}
        <section className="sequence-tray" aria-label="Selected sequence">
          <div className="sequence-title">
            <div>
              <span className="eyebrow">THE BIG PICTURE</span>
              <h2>
                Your sequence <span>{total}s</span>
              </h2>
            </div>
            <button
              onClick={() => setModal("review")}
              disabled={!project.shots.some((s) => s.chosen)}
            >
              ▷ Review sequence
            </button>
          </div>
          <div className="sequence-clips">
            {project.shots.map((s, i) => {
              const t = s.takes.find((t) => t.id === s.chosen);
              return (
                <button
                  key={s.id}
                  onClick={() => setShotId(s.id)}
                  className={shot?.id === s.id ? "sequence-active" : ""}
                >
                  <span className="sequence-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t && (
                    <Image
                      src={t.poster}
                      alt=""
                      width={80}
                      height={48}
                      unoptimized
                    />
                  )}
                  <span>
                    <strong>{s.name}</strong>
                    <small>
                      {t ? t.name : "Choose a take"} · {s.duration}s
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <footer className="workspace-footer">
          <span>FOMI / CONTINUITY</span>
          <span>A considered sequence. One shot at a time.</span>
        </footer>
      </main>
      {modal && (
        <Dialog
          title={
            {
              dna: "Creative DNA",
              brief: "The creative brief",
              compare: "Compare alternatives",
              review: "Sequence review",
              export: "Export project package",
              delete: "Delete this shot?",
              reset: "Reset this workspace?",
              create: "Create a project",
              rename: "Rename project",
              settings: "Take provenance",
            }[modal]
          }
          onClose={() => setModal(null)}
          wide={["compare", "review"].includes(modal)}
        >
          {modal === "dna" && (
            <>
              <p className="dialog-intro">
                One creative thread, across every shot.
              </p>
              <p className="muted">
                These rules appear in future generation requests. They do not
                guarantee model consistency or change existing footage.
              </p>
              {rules.map((k) => (
                <label key={k} className="field">
                  {labels[k]}
                  <textarea
                    maxLength={1000}
                    value={project.dna[k]}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        dna: { ...p.dna, [k]: e.target.value },
                      }))
                    }
                  />
                </label>
              ))}
              <button className="primary" onClick={() => setModal(null)}>
                Done
              </button>
            </>
          )}
          {modal === "brief" && (
            <label className="field">
              CAMPAIGN BRIEF
              <textarea
                className="brief-editor"
                maxLength={5000}
                value={project.brief}
                onChange={(e) =>
                  update((p) => ({ ...p, brief: e.target.value }))
                }
              />
            </label>
          )}
          {["create", "rename"].includes(modal) && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                if (modal === "rename")
                  update((p) => ({ ...p, name: draft.trim() }));
                else {
                  const p = {
                    id: uid(),
                    name: draft.trim(),
                    brief: "Define the intention for this campaign.",
                    dna: { ...project.dna },
                    shots: [],
                  };
                  setState((s) => ({
                    ...s,
                    active: p.id,
                    projects: [...s.projects, p],
                  }));
                }
                setModal(null);
              }}
            >
              <label className="field">
                PROJECT NAME
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
              </label>
              <button className="primary">
                {modal === "create" ? "Create project" : "Save name"}
              </button>
            </form>
          )}
          {modal === "compare" && shot && (
            <Compare shot={shot} choose={choose} />
          )}
          {modal === "review" && <SequenceReview project={project} />}
          {modal === "settings" && take && (
            <>
              <p>
                {take.name} · {new Date(take.createdAt).toLocaleString()}
              </p>
              <p className="muted">
                Original motion fixture. Saved request metadata is not an
                analysis of the footage.
              </p>
              <pre>{JSON.stringify(take.request, null, 2)}</pre>
              <a className="button" href={take.src} download>
                Download fixture clip
              </a>
            </>
          )}
          {modal === "export" && (
            <>
              <p className="dialog-intro">Take the thinking with you.</p>
              <p>
                Includes the brief, Creative DNA, ordered shots, every take’s
                request, chosen versions, and decision notes.
              </p>
              <div className="export-summary">
                <span>{project.shots.length} shots</span>
                <span>{total}s planned</span>
                <span>{project.shots.length - missing.length} chosen</span>
              </div>
              {missing.length > 0 && (
                <p className="warning">
                  Missing selections: {missing.map((s) => s.name).join(", ")}.
                  The package will retain these as unselected shots.
                </p>
              )}
              <p className="muted">
                JSON project package, not a rendered MP4. Clip paths refer to
                the included local demo assets. Save status reflects browser
                storage only.
              </p>
              <button className="primary" onClick={() => download(project)}>
                <Download size={15} /> Download project JSON
              </button>
            </>
          )}
          {modal === "delete" && (
            <>
              <p>
                Remove “{shot?.name}”, its takes and decision note from this
                project? This cannot be undone.
              </p>
              <div className="dialog-actions">
                <button onClick={() => setModal(null)}>Keep shot</button>
                <button
                  className="danger"
                  onClick={() => {
                    cancel(shot.id);
                    update((p) => ({
                      ...p,
                      shots: p.shots.filter((s) => s.id !== shot.id),
                    }));
                    setModal(null);
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
                This replaces all browser-local projects and edits with the
                original demo. Download a project package first if you need to
                keep your work.
              </p>
              <div className="dialog-actions">
                <button onClick={() => setModal(null)}>Keep my work</button>
                <button
                  className="danger"
                  onClick={() => {
                    Object.keys(jobs).forEach(cancel);
                    setState(seed());
                    setModal(null);
                    setNotice("Demo reset. Original campaign restored.");
                  }}
                >
                  Reset all local projects
                </button>
              </div>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
