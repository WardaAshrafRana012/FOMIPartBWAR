"use client";
import Image from "next/image";
import {
  PanelLeftOpen,
  PanelLeftClose,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Film,
} from "lucide-react";
import { moveShot } from "../../lib/project";
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
}) {
  return (
    <aside className="storyboard" aria-label="Shot storyboard">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR STORY</span>
          <h2>
            Storyboard{" "}
            <span>{project.shots.length.toString().padStart(2, "0")}</span>
          </h2>
        </div>
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
      </div>
      <div className="story-content">
        <button className="dna-card" onClick={() => setModal("dna")}>
          <span className="dna-mark">✳</span>
          <span>
            <strong>Creative DNA</strong>
            <small>The thread through every shot</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
        <div className="shot-list">
          {project.shots.map((s, i) => {
            const thumb = s.takes.find((t) => t.id === s.chosen) || s.takes[0];
            return (
              <div
                key={s.id}
                className={`shot-item ${s.id === shot?.id ? "current" : ""}`}
              >
                <button className="shot-select" onClick={() => setShotId(s.id)}>
                  <div className="shot-thumb">
                    {thumb ? (
                      <Image
                        src={thumb.poster}
                        alt=""
                        fill
                        sizes="100px"
                        unoptimized
                      />
                    ) : (
                      <Film />
                    )}
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <strong>{s.name}</strong>
                    <small>
                      {s.duration}s <span>·</span>{" "}
                      {s.chosen ? "Take chosen" : "Needs a take"}
                    </small>
                    {["queued", "generating"].includes(jobs[s.id]?.status) && (
                      <small className="accent">{jobs[s.id].status}…</small>
                    )}
                  </div>
                </button>
                <div className="shot-moves">
                  <button
                    aria-label={`Move ${s.name} up`}
                    disabled={i === 0}
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        shots: moveShot(p.shots, s.id, -1),
                      }))
                    }
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    aria-label={`Move ${s.name} down`}
                    disabled={i === project.shots.length - 1}
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        shots: moveShot(p.shots, s.id, 1),
                      }))
                    }
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="add-shot" onClick={add}>
          <Plus size={16} /> Add a shot
        </button>
        <div className="brief-snippet">
          <span className="eyebrow">THE INTENTION</span>
          <p>
            “The city falls quiet.
            <br />A private ritual begins.”
          </p>
          <button onClick={() => setModal("brief")}>
            Read creative brief <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="local-note">
          <span>◉ Browser-local workspace</span>
          <button className="mobile-brief" onClick={() => setModal("brief")}>
            Creative brief
          </button>
          <button onClick={() => setModal("reset")}>Reset demo</button>
        </div>
      </div>
    </aside>
  );
}
