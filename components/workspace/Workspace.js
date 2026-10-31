"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Copy,
  Trash2,
  Download,
  Check,
  Undo2,
  Redo2,
  Upload,
  ChevronDown,
  PanelLeft,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  ClipboardCheck,
  Film,
  SlidersHorizontal,
  Layers,
  Keyboard,
  MoreHorizontal,
} from "lucide-react";
import { useProject } from "../../hooks/useProject";
import { useGeneration } from "../../hooks/useGeneration";
import { newShot, duplicateShot, uid, signature } from "../../lib/project";
import { continuityIssues } from "../../lib/editor";
import Storyboard from "./Storyboard";
import DirectionPanel from "./DirectionPanel";
import Media from "./Media";
import TakeStrip from "./TakeStrip";
import SequenceDock from "./SequenceDock";
import ProjectDialogs from "./ProjectDialogs";
import CreativeRibbon from "./CreativeRibbon";
export default function Workspace() {
  const store = useProject(),
    {
      state,
      setState,
      project,
      update,
      save,
      notice,
      setNotice,
      undo,
      redo,
      canUndo,
      canRedo,
      clearHistory,
    } = store;
  const { jobs, start, cancel, resetGeneration } = useGeneration(setState);
  const [modal, setModal] = useState(null),
    [collapsed, setCollapsed] = useState(false),
    [advanced, setAdvanced] = useState(false),
    [fail, setFail] = useState(false),
    [tab, setTab] = useState("direction"),
    [mobileMode, setMobileMode] = useState("preview"),
    [focusMode, setFocusMode] = useState(false);
  const [view, setView] = useState("director");
  const shot =
    project?.shots.find((s) => s.id === project.selectedShot) ||
    project?.shots[0];
  const setShotId = (id) =>
    update((p) => ({ ...p, selectedShot: id }), { history: false });
  const editShot = (patch, options = {}) =>
    update(
      (p) => ({
        ...p,
        shots: p.shots.map((s) => (s.id === shot.id ? { ...s, ...patch } : s)),
      }),
      options,
    );
  const add = () => {
    const s = newShot(
      `Shot ${String(project.shots.length + 1).padStart(2, "0")}`,
    );
    update((p) => ({ ...p, shots: [...p.shots, s], selectedShot: s.id }), {
      label: "Add shot",
    });
    setMobileMode("direction");
    setTab("direction");
  };
  useEffect(() => {
    function keys(e) {
      const editing = e.target.closest(
        "input,textarea,select,[contenteditable=true]",
      );
      if (editing || document.querySelector("dialog[open]")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if (e.key === "Escape") setFocusMode(false);
      if (e.key === "?") {
        e.preventDefault();
        setModal("shortcuts");
      }
      if (
        e.altKey &&
        ["ArrowLeft", "ArrowRight"].includes(e.key) &&
        project?.shots.length
      ) {
        e.preventDefault();
        const i = project.shots.findIndex((s) => s.id === shot?.id),
          index = Math.max(
            0,
            Math.min(
              project.shots.length - 1,
              i + (e.key === "ArrowRight" ? 1 : -1),
            ),
          );
        setShotId(project.shots[index].id);
      }
    }
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [project, shot, undo, redo]);
  useEffect(() => {
    if (modal) document.querySelectorAll("video").forEach((v) => v.pause());
  }, [modal]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice, setNotice]);
  if (!project)
    return (
      <main className="loading">
        <span className="brand">
          fomi<span>✳</span>
        </span>
        <p>Returning to your creative workspace…</p>
      </main>
    );
  const take =
      shot?.takes.find((t) => t.id === shot.preview) ||
      shot?.takes.find((t) => t.id === shot.chosen) ||
      shot?.takes[0],
    job = jobs[shot?.id],
    busy = ["queued", "generating"].includes(job?.status),
    issues = continuityIssues(project);
  const choose = (id) => {
    const t = shot.takes.find((t) => t.id === id);
    update(
      (p) => ({
        ...p,
        shots: p.shots.map((s) =>
          s.id === shot.id
            ? { ...s, chosen: id, preview: id, note: t.note || "" }
            : s,
        ),
        activity: [
          ...(p.activity || []).slice(-59),
          {
            id: uid(),
            shotId: shot.id,
            message: `${t.name} chosen for the sequence.`,
            at: new Date().toISOString(),
          },
        ],
      }),
      { label: "Choose take" },
    );
  };
  const capture = (src, time) => {
    if ((project.references || []).length >= 12) {
      setNotice(
        "Reference library is full. Remove a reference before saving another frame.",
      );
      return;
    }
    update(
      (p) => ({
        ...p,
        references: [
          ...(p.references || []),
          {
            id: uid(),
            name: `${shot.name} · ${time.toFixed(1)}s`,
            role: "Composition",
            src,
          },
        ],
      }),
      { label: "Save frame" },
    );
    setNotice(
      "Frame saved to project references. Use the References tab to assign its role.",
    );
  };
  const storyboard = {
    project,
    collapsed,
    setCollapsed,
    setModal,
    jobs,
    shot,
    setShotId,
    update,
    add,
  };
  return (
    <div
      className={`workspace atelier view-${view} ${collapsed ? "rail-collapsed" : ""} ${focusMode ? "focus-mode" : ""} mobile-mode-${mobileMode}`}
    >
      <header className="topbar">
        <a href="/" className="header-brand" aria-label="Fomi WAR">
          <span className="brand">
            fomi<span>✳</span>
          </span>
          <span className="brand-divider" />
          <span className="brand-product">WAR</span>
        </a>
        <div className="project-heading">
          <span className="eyebrow">DIRECTOR’S WORKSPACE</span>
          <div className="project-switch">
            <select
              aria-label="Switch project"
              value={project.id}
              onChange={(e) => {
                setState((s) => ({ ...s, active: e.target.value }));
                setNotice("");
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
              onClick={() => setModal("rename")}
            >
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
        <div className="top-actions">
          <span className="save-status" role="status">
            <span
              className={
                save.startsWith("Save failed") ? "error-dot" : "save-dot"
              }
            />
            {save}
          </span>
          <div className="undo-group">
            <button
              aria-label="Undo"
              title="Undo · Ctrl+Z"
              disabled={!canUndo}
              onClick={undo}
            >
              <Undo2 size={16} />
            </button>
            <button
              aria-label="Redo"
              title="Redo · Ctrl+Shift+Z"
              disabled={!canRedo}
              onClick={redo}
            >
              <Redo2 size={16} />
            </button>
          </div>
          <button
            className="quiet icon-only"
            aria-label="Create project"
            title="Create project"
            onClick={() => setModal("create")}
          >
            <Plus size={17} />
          </button>
          <button
            className="quiet icon-only import-button"
            aria-label="Import project package"
            title="Import project package"
            onClick={() => setModal("import")}
          >
            <Upload size={16} />
          </button>
          <button
            className="continuity-button"
            onClick={() => setModal("continuity")}
          >
            <ClipboardCheck size={15} />
            <span>Continuity</span>
            <small>{issues.length}</small>
          </button>
          <button className="export-button" onClick={() => setModal("export")}>
            <Download size={15} />
            <span>Export package</span>
          </button>
          <button
            className="quiet project-tools-button"
            aria-label="Project tools"
            title="Project tools"
            onClick={() => setModal("project")}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>
      <CreativeRibbon
        project={project}
        view={view}
        onView={setView}
        onDNA={() => setModal("dna")}
        onReview={() => setModal("review")}
      />
      <Storyboard {...storyboard} />
      <main className="main-workspace">
        {save.startsWith("Save failed") && (
          <div className="save-failure" role="alert">
            {save}. Export a package to keep your work.
          </div>
        )}
        <div className="mobile-shot-bar">
          <button onClick={() => setModal("shots")}>
            <PanelLeft size={16} /> Shots <ChevronDown size={13} />
          </button>
          <span>
            {shot
              ? `${project.shots.indexOf(shot) + 1} of ${project.shots.length}`
              : "No shots yet"}
          </span>
          <button onClick={() => setModal("dna")}>
            <Layers size={15} /> DNA
          </button>
        </div>
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
              ×
            </button>
          </div>
        )}
        {shot ? (
          <div className="work-area">
            <section className="preview-column" aria-label="Shot preview">
              <div className="shot-heading">
                <div>
                  <span className="eyebrow">
                    <span className="shot-number">
                      SHOT{" "}
                      {String(project.shots.indexOf(shot) + 1).padStart(2, "0")}
                    </span>
                    <span className="heading-separator">/</span>
                    {shot.description}
                  </span>
                  <h1>{shot.name}</h1>
                </div>
                <div className="shot-tools">
                  <button
                    aria-label="Duplicate shot"
                    title="Duplicate shot"
                    onClick={() => {
                      const copy = duplicateShot(shot);
                      update(
                        (p) => ({
                          ...p,
                          shots: [
                            ...p.shots.slice(
                              0,
                              p.shots.findIndex((s) => s.id === shot.id) + 1,
                            ),
                            copy,
                            ...p.shots.slice(
                              p.shots.findIndex((s) => s.id === shot.id) + 1,
                            ),
                          ],
                          selectedShot: copy.id,
                        }),
                        { label: "Duplicate shot" },
                      );
                    }}
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    aria-label="Delete shot"
                    title="Delete shot"
                    onClick={() => setModal("delete")}
                  >
                    <Trash2 size={15} />
                  </button>
                  <span />
                  <button
                    aria-label={
                      focusMode ? "Exit focus mode" : "Enter focus mode"
                    }
                    title="Focus mode · Escape to exit"
                    onClick={() => setFocusMode(!focusMode)}
                  >
                    {focusMode ? (
                      <Minimize2 size={16} />
                    ) : (
                      <Maximize2 size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="stage">
                <div className="stage-top">
                  <span>
                    <span className="stage-dot" />
                    {take?.name || "NO TAKE YET"}
                    <span className="stage-mode">
                      {take?.id === shot.chosen
                        ? "SELECTED VERSION"
                        : "EXPLORING"}
                    </span>
                  </span>
                  <span>
                    {take?.actualAspect || shot.aspect} <span>·</span> {take?.actualDuration ? `${take.actualDuration.toFixed(1)}s source / ` : ""}{shot.duration}s planned
                  </span>
                </div>
                <Media
                  key={take?.id || "empty"}
                  take={take}
                  onCapture={capture}
                />
              </div>
              <div className="preview-caption">
                <span>
                  {take?.id === shot.chosen ? (
                    <>
                      <Check size={13} /> Chosen for sequence
                    </>
                  ) : (
                    "Previewing an alternative"
                  )}
                  {take && take.dnaSignature !== signature(project.dna) && (
                    <button
                      className="earlier-dna"
                      onClick={() => setModal("settings")}
                    >
                      Earlier DNA · see changes
                    </button>
                  )}
                </span>
                <div>
                  <span className="demo-indicator">
                    <span className="live-dot" /> Demo generation
                  </span>
                  {take && (
                    <button
                      className="quiet"
                      onClick={() => setModal("settings")}
                    >
                      Take details <ArrowUpRight size={12} />
                    </button>
                  )}
                </div>
              </div>
              <TakeStrip
                shot={shot}
                take={take}
                project={project}
                editShot={editShot}
                choose={choose}
                setModal={setModal}
              />
            </section>
            <DirectionPanel
              shot={shot}
              project={project}
              tab={tab}
              setTab={setTab}
              editShot={editShot}
              update={update}
              advanced={advanced}
              setAdvanced={setAdvanced}
              fail={fail}
              setFail={setFail}
              job={job}
              busy={busy}
              start={start}
              cancel={cancel}
              setModal={setModal}
            />
          </div>
        ) : (
          <section className="empty-workspace">
            <Film size={30} />
            <span className="eyebrow">A NEW CHAPTER</span>
            <h1>Every story starts with a shot.</h1>
            <p>Your Creative DNA is ready. Add the first moment.</p>
            <button className="primary" onClick={add}>
              <Plus size={16} /> Add a shot
            </button>
          </section>
        )}
      </main>
      <SequenceDock
        project={project}
        shot={shot}
        setShotId={(id) => {
          setShotId(id);
          setMobileMode("preview");
        }}
        setModal={setModal}
      />
      <nav className="mobile-work-modes" aria-label="Workspace mode">
        {[
          ["preview", Film, "Preview"],
          ["direction", SlidersHorizontal, "Direction"],
          ["sequence", Layers, "Sequence"],
        ].map(([id, Icon, label]) => (
          <button
            key={id}
            className={mobileMode === id ? "active" : ""}
            aria-pressed={mobileMode === id}
            onClick={() => setMobileMode(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <button
        className="shortcut-hint"
        aria-label="Keyboard shortcuts"
        onClick={() => setModal("shortcuts")}
      >
        <Keyboard size={14} />
        <span>Shortcuts</span>
      </button>
      {modal && (
        <ProjectDialogs
          key={modal}
          modal={modal}
          onClose={() => setModal(null)}
          project={project}
          shot={shot}
          take={take}
          update={update}
          setState={setState}
          choose={choose}
          cancel={cancel}
          clearHistory={clearHistory}
          setShotId={(id) => {
            setShotId(id);
            setMobileMode("preview");
          }}
          setNotice={setNotice}
          storyboard={storyboard}
          editor={{ undo, redo, canUndo, canRedo, save }}
          resetGeneration={resetGeneration}
        />
      )}
    </div>
  );
}
