"use client";
import { useState } from "react";
export default function Media({ take, onEnded, autoPlay = false }) {
  const [failed, setFailed] = useState(false);
  if (!take)
    return (
      <div className="empty-stage">
        <span>◇</span>
        <h2>A moment, waiting to happen.</h2>
        <p>Write a direction and generate your first alternatives.</p>
      </div>
    );
  return (
    <div className="media-wrap">
      {failed ? (
        <div className="empty-stage">
          <h2>Clip unavailable</h2>
          <p>The saved direction is still available. Try another take.</p>
        </div>
      ) : (
        <video
          key={take.id}
          aria-label={`${take.name} fixture preview`}
          src={take.src}
          poster={take.poster}
          controls
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
          onEnded={onEnded}
          onPlay={(event) => {
            document.querySelectorAll("video").forEach((video) => {
              if (video !== event.currentTarget) video.pause();
            });
          }}
          onError={() => setFailed(true)}
        />
      )}
      <span className="fixture-label">
        Original motion study · fixture footage
      </span>
    </div>
  );
}
