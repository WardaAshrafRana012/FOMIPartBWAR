"use client";
import { useRef } from "react";
import Image from "next/image";
import { Check, Columns2, ChevronLeft, ChevronRight } from "lucide-react";
import { signature } from "../../lib/project";
import { shotVersions } from "../../lib/takes";
export default function TakeStrip({
  shot,
  take,
  project,
  editShot,
  choose,
  setModal,
}) {
  const strip = useRef(null);
  const versions = shotVersions(shot);
  return (
    <div className="take-review">
      <div className="takes-heading">
        <h2>
          Versions of this shot{" "}
          <span>{String(versions.length).padStart(2, "0")}</span>
        </h2>
        <div>
          <button
            aria-label="Previous takes"
            onClick={() =>
              strip.current?.scrollBy({ left: -220, behavior: "smooth" })
            }
          >
            <ChevronLeft size={14} />
          </button>
          <button
            aria-label="Next takes"
            onClick={() =>
              strip.current?.scrollBy({ left: 220, behavior: "smooth" })
            }
          >
            <ChevronRight size={14} />
          </button>
          <button
            disabled={versions.length < 2}
            onClick={() => setModal("compare")}
          >
            <Columns2 size={14} /> Compare takes
          </button>
        </div>
      </div>
      <div
        className="take-strip"
        ref={strip}
        tabIndex={0}
        aria-label="Takes, scroll horizontally"
      >
        {versions.map((t) => (
          <button
            key={t.id}
            aria-pressed={take?.id === t.id}
            className={`take-card ${take?.id === t.id ? "previewing" : ""}`}
            onClick={() => editShot({ preview: t.id }, { history: false })}
          >
            <div>
              <Image
                src={t.poster}
                alt={`${t.name} campaign study`}
                width={220}
                height={124}
                unoptimized
              />
              {shot.chosen === t.id && (
                <span className="chosen-badge">
                  <Check size={10} /> In sequence
                </span>
              )}
              <span className="take-duration">{t.actualDuration ? `${t.actualDuration.toFixed(1)}s · 9:16` : `${t.request.duration}s`}</span>
            </div>
            <span>
              <strong>{t.name}</strong>
              <small>
                {t.dnaSignature !== signature(project.dna)
                  ? "Uses earlier style rules"
                  : take?.id === t.id
                    ? "Previewing"
                    : "Alternative"}
              </small>
            </span>
          </button>
        ))}
      </div>
      {take && (
        <div className="decision-row">
          <button
            className={shot.chosen === take.id ? "chosen-button" : "primary"}
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
            WHY YOU CHOSE IT
            <input
              aria-label="Decision note"
              placeholder="For example: the slower movement works better"
              value={take.note ?? (take.id === shot.chosen ? shot.note : "")}
              maxLength={500}
              onChange={(e) => {
                const note = e.target.value;
                editShot(
                  {
                    takes: shot.takes.map((t) =>
                      t.id === take.id ? { ...t, note } : t,
                    ),
                    ...(take.id === shot.chosen ? { note } : {}),
                  },
                  { label: "Edit decision note" },
                );
              }}
            />
          </label>
        </div>
      )}
      <p className="versions-help">A take is one version of a shot. Preview it, then choose it for your sequence. This demo may reuse the same clip for two versions.</p>
      <button className="source-films-link" onClick={() => setModal("samples")}>Watch full sample films <span>Separate examples, not shot versions ↗</span></button>
    </div>
  );
}
