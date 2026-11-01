"use client";
import Image from "next/image";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { palette } from "../../lib/editor";

export default function CreativeRibbon({
  project,
  view,
  onView,
  onDNA,
  onReview,
}) {
  return (
    <div className="creative-ribbon">
      <nav aria-label="Creative workspace views" className="atelier-views">
        <button
          aria-pressed={view === "storyboard"}
          onClick={() =>
            onView(view === "storyboard" ? "director" : "storyboard")
          }
        >
          Storyboard
        </button>
        <button
          aria-pressed={view === "director"}
          onClick={() => onView("director")}
        >
          Director
        </button>
        <button onClick={onReview}>
          <Play size={13} /> Sequence
        </button>
      </nav>
      <button
        className="ribbon-dna"
        onClick={onDNA}
        aria-label="Edit project Creative DNA"
      >
        <span className="ribbon-title" title="Creative DNA means the style rules shared by every shot.">
          <Sparkles size={15} /> Creative DNA
        </span>
        <Image src={project.references?.[0]?.src || "/demo/study-reveal.webp"} alt="" width={68} height={36} />
        <span className="ribbon-palette">
          {palette.slice(1, 5).map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
        <span className="ribbon-rule">
          <small>LIGHTING</small>
          <strong>{project.dna.lighting}</strong>
        </span>
        <span className="ribbon-rule">
          <small>CAMERA</small>
          <strong>{project.dna.camera}</strong>
        </span>
        <span className="ribbon-edit">
          Edit DNA <ArrowUpRight size={13} />
        </span>
      </button>
    </div>
  );
}
