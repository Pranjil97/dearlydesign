"use client";

import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { EventCard } from "@/components/events/EventCard";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings } from "@/lib/animations";
import {
  CELEBRATIONS_COPY,
  WEDDING_EVENTS,
  type WeddingEventId,
} from "@/lib/constants/events";
import { cn } from "@/lib/utils/cn";

type CelebrationsProps = {
  reducedMotion?: boolean;
};

/** Desktop asymmetric placement for editorial rhythm */
const desktopPlacement: Record<WeddingEventId, string> = {
  mehendi: "md:col-span-5 md:translate-y-4",
  haldi: "md:col-span-7 md:pt-16",
  sangeet: "md:col-span-7 md:-translate-y-6",
  ceremony: "md:col-span-5 md:pt-10",
  reception: "md:col-span-8 md:col-start-3 md:pt-6",
};

export function Celebrations({ reducedMotion = false }: CelebrationsProps) {
  const [expandedId, setExpandedId] = useState<WeddingEventId | null>(null);

  const handleToggle = useCallback((id: WeddingEventId) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-burgundy px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40"
      aria-label="Wedding celebrations"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 10% 20%, color-mix(in srgb, var(--wine) 55%, transparent), transparent 70%)",
        }}
      />

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
          {CELEBRATIONS_COPY.eyebrow}
        </motion.p>

        <motion.h2
          className="mt-5 font-heading text-balance text-4xl font-medium tracking-wide text-ivory sm:text-5xl md:text-6xl"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.95,
            delay: reducedMotion ? 0 : 0.08,
            ease: easings.cinematicOut,
          }}
        >
          {CELEBRATIONS_COPY.title}
        </motion.h2>

        <OrnamentalDivider className="mx-auto mt-7 text-champagne" />

        <motion.p
          className="mt-6 font-heading text-lg font-light text-ivory/70 sm:text-xl"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.85,
            delay: reducedMotion ? 0 : 0.14,
            ease: easings.cinematicOut,
          }}
        >
          {CELEBRATIONS_COPY.subtitle}
        </motion.p>
      </div>

      {/* Desktop asymmetric editorial grid */}
      <div className="relative mx-auto hidden max-w-6xl md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16">
        {WEDDING_EVENTS.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            expanded={expandedId === event.id}
            onToggle={() => handleToggle(event.id)}
            reducedMotion={reducedMotion}
            priority={index === 0}
            className={desktopPlacement[event.id]}
          />
        ))}
      </div>

      {/* Mobile / small tablet: touch-friendly horizontal carousel */}
      <div className="relative max-w-[100vw] overflow-x-hidden md:hidden">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {WEDDING_EVENTS.map((event, index) => (
            <div
              key={event.id}
              className={cn(
                "w-[82vw] max-w-[22rem] shrink-0 snap-center",
                index === 0 && "ml-0",
                index === WEDDING_EVENTS.length - 1 && "mr-1",
              )}
            >
              <EventCard
                event={event}
                expanded={expandedId === event.id}
                onToggle={() => handleToggle(event.id)}
                reducedMotion={reducedMotion}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
