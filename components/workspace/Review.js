"use client";
import { useState } from "react";
import Media from "./Media";
export function Compare({ shot, choose }) {
  const [ids, setIds] = useState(shot.takes.slice(-2).map((t) => t.id));
  return (
    <>
      <p className="muted">
        Compare direction and timing. These are curated motion fixtures, not
        model outputs.
      </p>
      <div className="compare-grid">
        {ids.map((id, i) => {
          const t = shot.takes.find((t) => t.id === id);
          return (
            <section key={i}>
              <select
                aria-label={`Comparison ${i + 1}`}
                value={id}
                onChange={(e) =>
                  setIds((a) => a.map((v, n) => (n === i ? e.target.value : v)))
                }
              >
                {shot.takes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <Media take={t} />
              <p>{t.request.prompt}</p>
              <small>
                {t.request.duration}s · {t.request.aspect}
              </small>
              <details>
                <summary>Saved generation settings</summary>
                <pre>{JSON.stringify(t.request, null, 2)}</pre>
              </details>
              <button className="primary" onClick={() => choose(t.id)}>
                {shot.chosen === t.id ? "✓ In sequence" : "Choose for sequence"}
              </button>
            </section>
          );
        })}
      </div>
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
    return <p>Choose a take for at least one shot to review the sequence.</p>;
  const shot = shots[index];
  return (
    <>
      <p className="muted">
        Sequential clip preview. Fixture clips are 5 seconds; planned durations
        are metadata. Transitions are not frame-accurate.
      </p>
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
          ← Previous
        </button>
        <span>
          {index + 1} / {shots.length} · {shot.name}
        </span>
        <button
          onClick={() => {
            setIndex(0);
            setPlaying(true);
          }}
        >
          Play sequence
        </button>
        <button
          disabled={index === shots.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Next →
        </button>
      </div>
    </>
  );
}
