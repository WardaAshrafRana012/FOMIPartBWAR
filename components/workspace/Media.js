"use client";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Maximize,
  Camera,
  Volume2,
  VolumeX,
  Film,
} from "lucide-react";
export default function Media({
  take,
  onEnded,
  autoPlay = false,
  onCapture,
  allowConcurrent = false,
  compact = false,
}) {
  const ref = useRef(null),
    wrap = useRef(null);
  const [failed, setFailed] = useState(false),
    [playing, setPlaying] = useState(false),
    [time, setTime] = useState(0),
    [duration, setDuration] = useState(0),
    [muted, setMuted] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    if (autoPlay)
      ref.current
        ?.play()
        .catch(() => setError("Press play to begin this clip."));
  }, [autoPlay, take?.id]);
  async function toggle() {
    const v = ref.current;
    if (!v) return;
    try {
      if (v.paused) await v.play();
      else v.pause();
      setError("");
    } catch {
      setError("Playback could not start. Try again.");
    }
  }
  function capture() {
    const v = ref.current;
    if (!v || v.readyState < 2) {
      setError("Play or seek the clip before saving a frame.");
      return;
    }
    try {
      v.pause();
      const c = document.createElement("canvas");
      c.width = 640;
      c.height = Math.round((640 * v.videoHeight) / v.videoWidth);
      c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
      onCapture?.(c.toDataURL("image/webp", 0.8), v.currentTime);
    } catch {
      setError("This clip does not allow frame capture.");
    }
  }
  if (!take)
    return (
      <div className="empty-stage">
        <Film size={30} />
        <h2>A moment, waiting to happen.</h2>
        <p>Write a direction and generate your first alternatives.</p>
      </div>
    );
  return (
    <div
      className={`media-player ${compact ? "compact-player" : ""}`}
      ref={wrap}
    >
      <div className="media-wrap">
        {failed ? (
          <div className="empty-stage">
            <Film size={28} />
            <h2>Clip unavailable</h2>
            <p>Your direction and decisions are safe. Try another take.</p>
          </div>
        ) : (
          <video
            ref={ref}
            key={take.id}
            aria-label={`${take.name} fixture preview`}
            src={take.src}
            poster={take.poster}
            playsInline
            preload="metadata"
            muted={muted}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onPlay={(e) => {
              setPlaying(true);
              if (!allowConcurrent)
                document.querySelectorAll("video").forEach((v) => {
                  if (v !== e.currentTarget) v.pause();
                });
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              onEnded?.();
            }}
            onError={() => setFailed(true)}
          />
        )}
        <span className="fixture-label">
          <span /> {take.mediaOrigin === "user-supplied" ? "SUPPLIED SAMPLE · NOT APP-GENERATED" : "CINEMATIC MOTION STUDY"}
        </span>
        {!playing && !failed && (
          <button
            className="stage-play"
            aria-label={`Play ${take.name}`}
            onClick={toggle}
          >
            <Play size={23} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="player-controls">
        <button
          aria-label={playing ? "Pause preview" : "Play preview"}
          onClick={toggle}
          disabled={failed}
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <span className="timecode">
          {time.toFixed(1)}{" "}
          <span>
            / {Number.isFinite(duration) ? duration.toFixed(1) : "0.0"}s
          </span>
        </span>
        <input
          className="seek"
          type="range"
          aria-label="Seek clip"
          min="0"
          max={Number.isFinite(duration) && duration > 0 ? duration : 5}
          step="0.05"
          value={Math.min(time, Number.isFinite(duration) ? duration : 0)}
          onChange={(e) => {
            if (ref.current) {
              ref.current.currentTime = Number(e.target.value);
              setTime(Number(e.target.value));
            }
          }}
        />
        {onCapture && (
          <button
            className="save-frame"
            onClick={capture}
            aria-label="Save current frame as reference"
          >
            <Camera size={15} />
            <span>Save frame</span>
          </button>
        )}
        <button
          aria-label={muted ? "Unmute preview" : "Mute preview"}
          onClick={() => setMuted(!muted)}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          aria-label="Fullscreen preview"
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen?.();
            else
              wrap.current
                ?.requestFullscreen?.()
                .catch(() =>
                  setError("Fullscreen is unavailable in this browser."),
                );
          }}
        >
          <Maximize size={16} />
        </button>
      </div>
      {error && (
        <p className="player-error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
