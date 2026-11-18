"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

const controlClass =
  "grid place-items-center w-11 h-11 rounded-full border border-white/20 bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer";

/** Full-screen image viewer: Escape closes, arrow keys move, focus stays inside and returns to the opener. */
export function Lightbox({ images, index, onChange, onClose }: LightboxProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const many = images.length > 1;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const step = (delta: number) => onChange((index + delta + images.length) % images.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) step(1);
      else if (e.key === "ArrowLeft" && many) step(-1);
      else if (e.key === "Tab") {
        // Keep Tab cycling through the dialog's own buttons.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, many, onChange, onClose]);

  const image = images[index];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("lightboxLabel")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-10 animate-fade-in-up"
    >
      <div className="relative w-full h-full pointer-events-none">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" />
      </div>

      <button ref={closeRef} type="button" onClick={onClose} aria-label={t("lightboxClose")} className={`${controlClass} absolute top-4 right-4`}>
        <X size={20} aria-hidden="true" />
      </button>

      {many && (
        <>
          <button
            type="button"
            onClick={() => onChange((index - 1 + images.length) % images.length)}
            aria-label={t("lightboxPrev")}
            className={`${controlClass} absolute left-4 top-1/2 -translate-y-1/2`}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onChange((index + 1) % images.length)}
            aria-label={t("lightboxNext")}
            className={`${controlClass} absolute right-4 top-1/2 -translate-y-1/2`}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
          <p aria-live="polite" className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 font-mono text-xs text-white">
            {index + 1} {t("imageOf")} {images.length}
          </p>
        </>
      )}
    </div>
  );
}
