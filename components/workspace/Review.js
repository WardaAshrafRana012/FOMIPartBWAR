"use client";
import { useRef, useState } from "react";
import { Play, Pause, Check, ArrowRight, ArrowLeft } from "lucide-react";
import Media from "./Media";
import { SettingsDiff } from "./DirectionDiff";
export function Compare({ shot, choose, project, onNote }) {
  const [ids, setIds] = useState(shot.takes.slice(-2).map((t) => t.id)),
    [sync, setSync] = useState(false);
  const ref = useRef(null);
  const takes = ids.map((id) => shot.takes.find((t) => t.id === id));
  async function playBoth() {
    const videos = [...ref.current.querySelectorAll("video")];
    if (sync) {
      videos.forEach((v) => v.pause());
      setSync(false);
    } else {
      videos.forEach((v) => {
        v.currentTime = 0;
      });
      await Promise.all(videos.map((v) => v.play().catch(() => {})));
      setSync(true);
    }
  }
  return (
    <>
      <div className="comparison-toolbar">
        <div>
          <span className="eyebrow">TWO POSSIBILITIES. ONE DECISION.</span>
          <p className="muted">
            Play from the same starting point. Browser playback is approximate,
            not frame-synchronized.
          </p>
        </div>
        <button onClick={playBoth}>
          {sync ? <Pause size={14} /> : <Play size={14} />}{" "}
          {sync ? "Pause both" : "Play both"}
        </button>
      </div>
      <div className="compare-grid" ref={ref}>
        {takes.map((t, i) => (
          <section
            key={i}
            className={shot.chosen === t.id ? "comparison-chosen" : ""}
          >
            <div className="comparison-title">
              <span>{i === 0 ? "A" : "B"}</span>
              <select
                aria-label={`Comparison ${i + 1}`}
                value={ids[i]}
                onChange={(e) => {
                  ref.current
                    .querySelectorAll("video")
                    .forEach((v) => v.pause());
                  setSync(false);
                  setIds((a) =>
                    a.map((v, n) => (n === i ? e.target.value : v)),
                  );
                }}
              >
                {shot.takes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <Media
              key={t.id}
              take={t}
              allowConcurrent
              compact
              onEnded={() => setSync(false)}
            />
            <p className="comparison-prompt">{t.request.prompt}</p>
            <div className="request-facts">
              <span>{t.request.duration}s requested</span>
              <span>{t.request.aspect}</span>
              <span>{t.request.references?.length || 0} references</span>
            </div>
            <label className="field">
              Decision note
              <input
                aria-label={`Decision note for comparison ${i + 1}`}
                maxLength={500}
                value={t.note || ""}
                placeholder="What works in this version?"
                onChange={(e) => onNote?.(t.id, e.target.value)}
              />
            </label>
            <button
              className={shot.chosen === t.id ? "chosen-button" : "primary"}
              onClick={() => choose(t.id)}
            >
              {shot.chosen === t.id ? (
                <>
                  <Check size={14} /> In sequence
                </>
              ) : (
                "Choose for sequence"
              )}
            </button>
          </section>
        ))}
      </div>
      <SettingsDiff left={takes[0]} right={takes[1]} />
      <p className="muted">
        Curated fixture footage. Differences in requests are recorded metadata;
        the app does not run a video model.
      </p>
    </>
  );
}
export function SequenceReview({ project }) {
  const shots = project.shots.filter(
    (s) => s.chosen && s.takes.some((t) => t.id === s.chosen),
  );
  const [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false);
  if (!shots.length)
    return (
      <div className="empty-stage">
        <h3>Your sequence is waiting.</h3>
        <p>Choose a take for at least one shot to start reviewing.</p>
      </div>
    );
  const shot = shots[index];
  return (
    <>
      <div className="sequence-review-heading">
        <div>
          <span className="eyebrow">THE DIRECTOR’S CUT</span>
          <p>
            {shots.length} selected shots ·{" "}
            {project.shots.reduce((n, s) => n + s.duration, 0)}s planned
          </p>
        </div>
        <button
          className="primary"
          onClick={() => {
            setIndex(0);
            setPlaying(true);
          }}
        >
          <Play size={14} /> Play sequence
        </button>
      </div>
      <Media
        key={`${index}-${playing}`}
        take={shot.takes.find((t) => t.id === shot.chosen)}
        autoPlay={playing}
        onEnded={() => {
          if (index < shots.length - 1) setIndex(index + 1);
          else setPlaying(false);
        }}
      />
      <div className="review-controls">
        <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ArrowLeft size={14} /> Previous
        </button>
        <span>
          {index + 1} / {shots.length} · {shot.name}
        </span>
        <button
          disabled={index === shots.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Next <ArrowRight size={14} />
        </button>
      </div>
      <div className="review-chapters">
        {shots.map((s, i) => (
          <button
            key={s.id}
            className={index === i ? "active" : ""}
            aria-label={`Review ${s.name}`}
            onClick={() => setIndex(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s.name}
          </button>
        ))}
      </div>
      {shot.note && (
        <blockquote className="review-note">“{shot.note}”</blockquote>
      )}
      <p className="muted">
        Consecutive clip review, not a seamless render. Fixtures are
        approximately 5 seconds; planned durations and aspect ratios are request
        metadata.
      </p>
    </>
  );
}
