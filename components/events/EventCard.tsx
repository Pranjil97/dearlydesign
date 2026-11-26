"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";
import { easings } from "@/lib/animations";
import {
  CELEBRATIONS_COPY,
  type WeddingEvent,
} from "@/lib/constants/events";
import { cn } from "@/lib/utils/cn";

type EventCardProps = {
  event: WeddingEvent;
  expanded: boolean;
  onToggle: () => void;
  reducedMotion?: boolean;
  /** Skip whileInView fade — used by the mobile carousel. */
  skipEntrance?: boolean;
  /** Uniform image crop for mobile carousel readability. */
  compactMobile?: boolean;
  className?: string;
  priority?: boolean;
};

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
} as const;

export function EventCard({
  event,
  expanded,
  onToggle,
  reducedMotion = false,
  skipEntrance = false,
  compactMobile = false,
  className,
  priority = false,
}: EventCardProps) {
  const disableEntrance = reducedMotion || skipEntrance;

  return (
    <motion.article
      layout={!reducedMotion}
      className={cn(
        "group relative flex flex-col overflow-hidden bg-wine/40",
        className,
      )}
      initial={disableEntrance ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: disableEntrance ? 0 : 0.85,
        ease: easings.cinematicOut,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="relative block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
        aria-expanded={expanded}
        aria-controls={`event-details-${event.id}`}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-burgundy",
            compactMobile ? "aspect-[4/5]" : aspectClass[event.aspect],
          )}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={
              reducedMotion ? undefined : { scale: 1.05 }
            }
            transition={{ duration: 0.7, ease: easings.cinematicOut }}
          >
            <Image
              src={event.image}
              alt={`${event.title} celebration photograph`}
              fill
              sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 30vw"
              className="object-cover"
              {...(priority ? { priority: true } : { loading: "lazy" as const })}
            />
          </motion.div>

          <div
            className="absolute inset-0 transition-opacity duration-500"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--burgundy) 78%, transparent) 100%)",
            }}
          />

          {/* Gold hover frame — decorative, not card chrome */}
          <div
            className="pointer-events-none absolute inset-3 border border-transparent transition-colors duration-500 group-hover:border-champagne/40 max-md:hidden"
            aria-hidden
          />
        </div>

        <div
          className={cn(
            "relative px-1 pb-1",
            compactMobile ? "pt-4" : "pt-5 sm:pt-6",
          )}
        >
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-champagne/80 sm:text-[0.65rem]">
            {event.dateLabel} · {event.timeLabel}
          </p>
          <h3
            className={cn(
              "mt-2 font-heading font-medium tracking-wide text-ivory",
              compactMobile ? "text-xl leading-snug" : "text-2xl sm:text-3xl",
            )}
          >
            {event.title}
          </h3>
          <p
            className={cn(
              "mt-3 max-w-md font-heading font-light leading-relaxed text-ivory/70",
              compactMobile ? "text-[0.95rem]" : "text-base sm:text-lg",
            )}
          >
            {event.description}
          </p>
          <span className="mt-4 inline-block text-[0.65rem] uppercase tracking-[0.28em] text-champagne transition-opacity group-hover:opacity-100 md:opacity-80">
            {expanded
              ? CELEBRATIONS_COPY.collapseLabel
              : CELEBRATIONS_COPY.expandLabel}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={`event-details-${event.id}`}
            key="details"
            initial={
              reducedMotion ? false : { height: 0, opacity: 0 }
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={{
              duration: reducedMotion ? 0.15 : 0.45,
              ease: easings.cinematicOut,
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-champagne/20 px-1 pb-5 pt-4">
              <p className="font-heading text-base font-light leading-relaxed text-ivory/75">
                {event.details}
              </p>

              <div className="mt-5 space-y-1">
                <p className="font-heading text-lg text-ivory">
                  {event.venueName}
                </p>
                <p className="text-sm leading-relaxed text-ivory/60">
                  {event.venueAddress}
                </p>
              </div>

              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-champagne transition-colors hover:text-ivory"
                onClick={(eventClick) => eventClick.stopPropagation()}
              >
                <MapPin className="size-3.5" aria-hidden />
                {CELEBRATIONS_COPY.directionsLabel}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
