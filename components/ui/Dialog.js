"use client";
import { useEffect, useRef } from "react";
export default function Dialog({ title, children, onClose, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    const d = ref.current;
    const prior = document.activeElement;
    d.showModal();
    return () => {
      d.close();
      prior?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      className={wide ? "dialog wide" : "dialog"}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const elements = [
          ...ref.current.querySelectorAll(
            'button:not(:disabled), a[href], input, textarea, select, summary, video[controls], [tabindex="0"]',
          ),
        ].filter((el) => el.getClientRects().length);
        const first = elements[0],
          last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header>
        <h2 id="dialog-title">{title}</h2>
        <button aria-label="Close dialog" onClick={onClose}>
          ✕
        </button>
      </header>
      {children}
    </dialog>
  );
}
