"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { RsvpConfirmation } from "@/components/rsvp/RsvpConfirmation";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { easings } from "@/lib/animations";
import { RSVP_COPY } from "@/lib/constants/rsvp";
import { getCoupleNames, WEDDING } from "@/config/wedding";
import type { RsvpSuccessResponse } from "@/lib/rsvp/types";

type RsvpSectionProps = {
  reducedMotion?: boolean;
};

export function RsvpSection({ reducedMotion = false }: RsvpSectionProps) {
  const [result, setResult] = useState<RsvpSuccessResponse | null>(null);

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden bg-burgundy px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
      aria-label="RSVP"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in srgb, var(--wine) 60%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto mb-12 max-w-2xl text-center sm:mb-16">
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
          {RSVP_COPY.eyebrow}
        </motion.p>

        <motion.h2
          className="mt-5 font-heading text-balance text-3xl font-medium tracking-wide text-ivory sm:text-4xl md:text-5xl lg:text-6xl"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.95,
            delay: reducedMotion ? 0 : 0.08,
            ease: easings.cinematicOut,
          }}
        >
          {RSVP_COPY.title}
        </motion.h2>

        <motion.p
          className="mt-4 font-heading text-xl tracking-wide text-champagne sm:text-2xl"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.85,
            delay: reducedMotion ? 0 : 0.1,
            ease: easings.cinematicOut,
          }}
        >
          {getCoupleNames(WEDDING)}
        </motion.p>

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
          {RSVP_COPY.subtitle}
        </motion.p>
      </div>

      <div className="relative mx-auto max-w-xl">
        <AnimatePresence mode="wait">
          {result ? (
            <RsvpConfirmation
              key="confirmation"
              guestName={result.guestName}
              attendance={result.attendance}
              demo={result.mode === "demo"}
              reducedMotion={reducedMotion}
            />
          ) : (
            <RsvpForm
              key="form"
              reducedMotion={reducedMotion}
              onSuccess={setResult}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
