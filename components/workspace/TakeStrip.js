"use client";
import { useRef } from "react";
import Image from "next/image";
import { Check, Columns2, ChevronLeft, ChevronRight } from "lucide-react";
import { signature } from "../../lib/project";
export default function TakeStrip({
  shot,
  take,
  project,
  editShot,
  choose,
  setModal,
}) {
  const strip = useRef(null);
  return (
    <div className="take-review">
      <div className="takes-heading">
        <h2>
          Take exploration{" "}
          <span>{String(shot.takes.length).padStart(2, "0")}</span>
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
            disabled={shot.takes.length < 2}
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
        {shot.takes.map((t) => (
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
              <span className="take-duration">{t.request.duration}s</span>
            </div>
            <span>
              <strong>{t.name}</strong>
              <small>
                {t.dnaSignature !== signature(project.dna)
                  ? "Earlier DNA"
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
            WHY THIS TAKE
            <input
              aria-label="Decision note"
              placeholder="Leave a reason for your future self…"
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
    </div>
  );
}
