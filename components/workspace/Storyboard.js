"use client";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  Check,
  Film,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { moveShot } from "../../lib/project";
import { palette } from "../../lib/editor";
export default function Storyboard({
  project,
  collapsed,
  setCollapsed,
  setModal,
  jobs,
  shot,
  setShotId,
  update,
  add,
  embedded = false,
}) {
  const chosen = project.shots.filter((s) => s.chosen).length;
  return (
    <aside
      className={`storyboard ${embedded ? "embedded-storyboard" : ""}`}
      aria-label="Shot storyboard"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">CAMPAIGN / 01</span>
          <h2>
            Storyboard{" "}
            <span>{String(project.shots.length).padStart(2, "0")}</span>
          </h2>
        </div>
        {!embedded && (
          <button
            aria-label={collapsed ? "Expand storyboard" : "Collapse storyboard"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        )}
      </div>
      <div className="story-content">
        <button className="dna-card" onClick={() => setModal("dna")}>
          <div className="dna-card-top">
            <span className="dna-mark">✳</span>
            <span>
              <strong>Creative DNA</strong>
              <small>5 rules. One creative thread.</small>
            </span>
            <ArrowUpRight size={15} />
          </div>
          <div className="dna-palette">
            {palette.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </div>
          <span className="dna-card-bottom">
            Shared across {project.shots.length} shots <span>↗</span>
          </span>
        </button>
        <div className="story-progress">
          <span>THE SHOT LIST</span>
          <small>
            {chosen}/{project.shots.length} chosen
          </small>
        </div>
        <div className="shot-list">
          {project.shots.map((s, i) => {
            const t = s.takes.find((t) => t.id === s.chosen) || s.takes[0];
            return (
              <div
                key={s.id}
                className={`shot-item ${s.id === shot?.id ? "current" : ""}`}
              >
                <button
                  className="shot-select"
                  onClick={() => {
                    setShotId(s.id);
                    if (embedded) setModal(null);
                  }}
                >
                  <div className="shot-thumb">
                    {t ? (
                      <Image
                        src={t.poster}
                        alt=""
                        fill
                        sizes="90px"
                        unoptimized
                      />
                    ) : (
                      <Film size={20} />
                    )}
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="shot-info">
                    <strong>{s.name}</strong>
                    <small>
                      {s.duration}s <span>·</span> {s.aspect}
                    </small>
                    <span
                      className={`shot-state ${s.chosen ? "has-choice" : ""}`}
                    >
                      {["queued", "generating"].includes(jobs[s.id]?.status) ? (
                        `${jobs[s.id].status}…`
                      ) : s.chosen ? (
                        <>
                          <Check size={10} /> Chosen
                        </>
                      ) : (
                        "Needs a take"
                      )}
                    </span>
                  </div>
                </button>
                <div className="shot-moves">
                  <button
                    aria-label={`Move ${s.name} up`}
                    disabled={i === 0}
                    onClick={() =>
                      update(
                        (p) => ({ ...p, shots: moveShot(p.shots, s.id, -1) }),
                        { label: "Reorder shots" },
                      )
                    }
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    aria-label={`Move ${s.name} down`}
                    disabled={i === project.shots.length - 1}
                    onClick={() =>
                      update(
                        (p) => ({ ...p, shots: moveShot(p.shots, s.id, 1) }),
                        { label: "Reorder shots" },
                      )
                    }
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="add-shot"
          onClick={() => {
            add();
            if (embedded) setModal(null);
          }}
        >
          <Plus size={15} /> Add a shot
        </button>
        <div className="story-bottom">
          <button className="brief-link" onClick={() => setModal("brief")}>
            <BookOpen size={15} />
            <span>
              Creative brief<small>The city falls quiet.</small>
            </span>
            <ArrowUpRight size={13} />
          </button>
          <div className="local-note">
            <span>
              <span className="save-dot" /> Browser-local project
            </span>
            <button onClick={() => setModal("reset")} aria-label="Reset demo">
              <RotateCcw size={12} /> Reset demo
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
