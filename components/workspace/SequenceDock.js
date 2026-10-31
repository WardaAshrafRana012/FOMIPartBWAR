import Image from "next/image";
import { Play, Check, ArrowRight, Film } from "lucide-react";
export default function SequenceDock({ project, shot, setShotId, setModal }) {
  const total = project.shots.reduce((n, s) => n + s.duration, 0);
  return (
    <section className="sequence-tray" aria-label="Selected sequence">
      <div className="sequence-title">
        <div>
          <span className="eyebrow">THE FILM, COMING TOGETHER</span>
          <h2>
            Your sequence{" "}
            <span>
              {String(project.shots.length).padStart(2, "0")} shots <i />{" "}
              {total}s planned
            </span>
          </h2>
        </div>
        <button
          onClick={() => setModal("review")}
          disabled={!project.shots.some((s) => s.chosen)}
        >
          <Play size={13} /> Review sequence <ArrowRight size={14} />
        </button>
      </div>
      <div className="sequence-clips">
        {project.shots.map((s, i) => {
          const t = s.takes.find((t) => t.id === s.chosen);
          return (
            <button
              key={s.id}
              className={shot?.id === s.id ? "sequence-active" : ""}
              onClick={() => setShotId(s.id)}
            >
              <span className="sequence-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t ? (
                <Image
                  src={t.poster}
                  alt=""
                  width={100}
                  height={60}
                  unoptimized
                />
              ) : (
                <div className="sequence-missing">
                  <Film size={16} />
                </div>
              )}
              <span>
                <strong>{s.name}</strong>
                <small>
                  {t ? t.name : "Choose a take"} · {s.duration}s
                </small>
              </span>
              {t && <Check className="sequence-check" size={12} />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
