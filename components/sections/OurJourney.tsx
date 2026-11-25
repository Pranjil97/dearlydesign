"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { GalleryLightbox } from "@/components/gallery";
import { easings } from "@/lib/animations";
import {
  WEDDING,
  WEDDING_GALLERY,
  getCoupleNames,
  type GalleryItem,
} from "@/config/wedding";
import { cn } from "@/lib/utils/cn";

type OurJourneyProps = {
  reducedMotion?: boolean;
};

/** Asymmetrical editorial placement for the premium gallery grid. */
const layoutClass: Record<string, string> = {
  "01": "md:col-span-5",
  "02": "md:col-span-7 md:pt-12",
  "03": "md:col-span-4 md:pt-4",
  "04": "md:col-span-8",
  "05": "md:col-span-7 md:pt-8",
  "06": "md:col-span-5 md:pt-2",
  "07": "md:col-span-8 md:col-start-2",
  "08": "md:col-span-4",
};

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
} as const;

export function OurJourney({ reducedMotion = false }: OurJourneyProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-burgundy px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      aria-label="Wedding gallery"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 80% 20%, color-mix(in srgb, var(--wine) 45%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
        <motion.p
          className="text-[0.65rem] font-medium uppercase tracking-[0.34em] text-champagne sm:text-xs"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.8,
            ease: easings.cinematicOut,
          }}
        >
          {WEDDING.journey.eyebrow}
        </motion.p>
        <motion.h2
          className="mt-4 font-heading text-balance text-3xl font-medium tracking-wide text-ivory sm:text-4xl md:text-5xl"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.9,
            delay: reducedMotion ? 0 : 0.08,
            ease: easings.cinematicOut,
          }}
        >
          {WEDDING.journey.title}
        </motion.h2>
        <motion.p
          className="mt-5 font-heading text-base italic text-ivory/65 sm:text-lg"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.85,
            delay: reducedMotion ? 0 : 0.14,
            ease: easings.cinematicOut,
          }}
        >
          {getCoupleNames(WEDDING)}
        </motion.p>
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-12 md:gap-7">
        {WEDDING_GALLERY.map((item, index) => (
          <GalleryFrame
            key={item.id}
            item={item}
            index={index}
            reducedMotion={reducedMotion}
            className={layoutClass[item.id]}
            onOpen={openAt}
          />
        ))}
      </div>

      <GalleryLightbox
        items={WEDDING_GALLERY}
        index={lightboxIndex}
        onClose={closeLightbox}
        onChange={setLightboxIndex}
        reducedMotion={reducedMotion}
      />
    </section>
  );
}

function GalleryFrame({
  item,
  index,
  reducedMotion,
  className,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  reducedMotion: boolean;
  className?: string;
  onOpen: (index: number) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        "group relative block w-full overflow-hidden text-left",
        className,
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reducedMotion ? 0 : 0.95,
        delay: reducedMotion ? 0 : Math.min(index * 0.05, 0.35),
        ease: easings.cinematicOut,
      }}
      aria-label={`Open photo: ${item.caption}`}
    >
      <figure className={cn("relative w-full", aspectClass[item.aspect])}>
        <div className="absolute inset-0 overflow-hidden bg-wine">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 42vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              !reducedMotion && "md:group-hover:scale-[1.04]",
            )}
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--burgundy) 70%, transparent) 100%)",
            }}
          />
        </div>

        <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-ivory">
          <span className="font-heading text-xs tracking-[0.28em] text-champagne">
            {item.id}
          </span>
          <span className="font-heading text-sm italic text-ivory/85">
            {item.caption}
          </span>
        </figcaption>
      </figure>
    </motion.button>
  );
}
