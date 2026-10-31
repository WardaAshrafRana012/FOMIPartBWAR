"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload, Check, Plus, X, ImagePlus } from "lucide-react";
import { uid } from "../../lib/project";
export async function readReference(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw Error("Choose a JPG, PNG or WebP image.");
  if (file.size > 4 * 1024 * 1024)
    throw Error("Choose an image smaller than 4 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = new window.Image();
    img.src = url;
    await img.decode();
    if (img.width * img.height > 30000000)
      throw Error("This image is too large. Use a smaller reference.");
    const canvas = document.createElement("canvas"),
      scale = Math.min(1, 720 / img.width, 720 / img.height);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    const src = canvas.toDataURL("image/webp", 0.78);
    if (src.length >= 350000)
      throw Error("Image is too detailed. Try a smaller file.");
    return {
      id: uid(),
      name: file.name.replace(/\.[^.]+$/, ""),
      role: "Style",
      src,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
export default function References({ project, shot, editShot, update }) {
  const [error, setError] = useState(""),
    [uploading, setUploading] = useState(false);
  const refs = project.references || [],
    inherited = shot.referenceIds == null;
  async function upload(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      if (refs.length >= 12)
        throw Error(
          "Keep up to 12 references per project. Remove one to add another.",
        );
      const ref = await readReference(file);
      update((p) => ({ ...p, references: [...(p.references || []), ref] }), {
        label: "Add reference",
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="references-panel">
      <div className="inspector-intro">
        <span className="eyebrow">A SHARED VISUAL LANGUAGE</span>
        <h3>Keep the look close.</h3>
        <p>
          Project references are inherited by each shot. Choose explicit
          references to make an exception.
        </p>
      </div>
      <div className="reference-scope">
        <span>
          {inherited
            ? "↳ Inheriting project references"
            : "Shot-specific references"}
        </span>
        {!inherited && (
          <button onClick={() => editShot({ referenceIds: null })}>
            Reset
          </button>
        )}
      </div>
      <div className="reference-grid">
        {refs.map((r) => {
          const selected = inherited || shot.referenceIds.includes(r.id);
          return (
            <div
              className={`reference-card ${selected ? "is-used" : ""}`}
              key={r.id}
            >
              <button
                className="reference-image"
                aria-label={`${selected ? "Remove" : "Use"} ${r.name} for this shot`}
                aria-pressed={selected}
                onClick={() => {
                  const ids = inherited
                    ? refs.map((r) => r.id)
                    : shot.referenceIds;
                  editShot({
                    referenceIds: selected
                      ? ids.filter((id) => id !== r.id)
                      : [...ids, r.id],
                  });
                }}
              >
                <Image
                  src={r.src}
                  alt={r.name}
                  width={220}
                  height={150}
                  unoptimized
                />
                {selected && (
                  <span>
                    <Check size={13} />
                  </span>
                )}
              </button>
              <label className="sr-only" htmlFor={`ref-${r.id}`}>
                Reference name
              </label>
              <input
                id={`ref-${r.id}`}
                value={r.name}
                maxLength={80}
                onChange={(e) =>
                  update(
                    (p) => ({
                      ...p,
                      references: p.references.map((x) =>
                        x.id === r.id ? { ...x, name: e.target.value } : x,
                      ),
                    }),
                    { label: "Rename reference" },
                  )
                }
              />
              <div className="reference-actions">
                <select
                  aria-label={`Role for ${r.name}`}
                  value={r.role}
                  onChange={(e) =>
                    update(
                      (p) => ({
                        ...p,
                        references: p.references.map((x) =>
                          x.id === r.id ? { ...x, role: e.target.value } : x,
                        ),
                      }),
                      { label: "Change reference role" },
                    )
                  }
                >
                  {[
                    "Product",
                    "Style",
                    "Lighting",
                    "Composition",
                    "Start frame",
                    "End frame",
                  ].map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <button
                  aria-label={`Remove reference ${r.name}`}
                  onClick={() =>
                    update(
                      (p) => ({
                        ...p,
                        references: p.references.filter((x) => x.id !== r.id),
                        shots: p.shots.map((s) => ({
                          ...s,
                          referenceIds:
                            s.referenceIds?.filter((id) => id !== r.id) ?? null,
                        })),
                      }),
                      { label: "Remove reference" },
                    )
                  }
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <label className="upload-reference">
        <Upload size={17} />
        <strong>
          {uploading ? "Preparing reference…" : "Add a visual reference"}
        </strong>
        <small>JPG, PNG or WebP · up to 4 MB</small>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Upload reference image"
          onChange={upload}
          disabled={uploading}
        />
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <div className="reference-disclosure">
        <ImagePlus size={16} />
        <p>
          Pause a take and use <strong>Save frame</strong> below the stage to
          capture a composition. References are saved in this browser and in
          submitted request metadata; fixtures do not change.
        </p>
      </div>
    </div>
  );
}
