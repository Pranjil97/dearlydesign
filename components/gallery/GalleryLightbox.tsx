"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/config/wedding";
import { easings } from "@/lib/animations";
import { cn } from "@/lib/utils/cn";

type GalleryLightboxProps = {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
  reducedMotion?: boolean;
};

export function GalleryLightbox({
  items,
  index,
  onClose,
  onChange,
  reducedMotion = false,
}: GalleryLightboxProps) {
  const open = index !== null;
  const touchStartX = useRef<number | null>(null);
  const active = index !== null ? items[index] : null;

  const goPrev = useCallback(() => {
    if (index === null || items.length === 0) return;
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const goNext = useCallback(() => {
    if (index === null || items.length === 0) return;
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open && active ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[color-mix(in_srgb,var(--burgundy)_92%,black)] px-3 py-16 sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full border border-champagne/40 text-champagne transition-colors hover:border-champagne hover:bg-champagne/10 sm:right-6 sm:top-6"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/35 text-champagne transition-colors hover:border-champagne hover:bg-champagne/10 sm:left-5 sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/35 text-champagne transition-colors hover:border-champagne hover:bg-champagne/10 sm:right-5 sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>

          <motion.figure
            key={active.id}
            className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{
              duration: reducedMotion ? 0 : 0.4,
              ease: easings.cinematicOut,
            }}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current;
              const end = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (start == null || end == null) return;
              const delta = end - start;
              if (Math.abs(delta) < 48) return;
              if (delta > 0) goPrev();
              else goNext();
            }}
          >
            <div
              className={cn(
                "relative w-full overflow-hidden bg-wine",
                active.aspect === "portrait"
                  ? "aspect-[3/4] max-h-[min(78dvh,860px)] max-w-[min(92vw,520px)]"
                  : active.aspect === "wide"
                    ? "aspect-[16/10] max-h-[min(72dvh,780px)] max-w-[min(94vw,1100px)]"
                    : "aspect-[4/3] max-h-[min(72dvh,780px)] max-w-[min(94vw,960px)]",
              )}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 768px) 94vw, 1100px"
                className="object-cover"
                priority
              />
            </div>

            <figcaption className="mt-5 flex w-full max-w-xl items-center justify-between gap-4 px-2 text-ivory">
              <span className="font-heading text-xs tracking-[0.28em] text-champagne">
                {active.id} / {String(items.length).padStart(2, "0")}
              </span>
              <span className="font-heading text-sm italic text-ivory/85 sm:text-base">
                {active.caption}
              </span>
            </figcaption>

            <div className="mt-6 flex gap-3 sm:hidden">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="flex size-11 items-center justify-center rounded-full border border-champagne/40 text-champagne"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="flex size-11 items-center justify-center rounded-full border border-champagne/40 text-champagne"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
