"use client";

import { motion } from "motion/react";
import { GoldParticles } from "@/components/invitation/GoldParticles";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings } from "@/lib/animations";
import { RSVP_COPY } from "@/lib/constants/rsvp";
import type { Attendance } from "@/lib/rsvp/types";

type RsvpConfirmationProps = {
  guestName: string;
  attendance: Attendance;
  demo: boolean;
  reducedMotion?: boolean;
};

export function RsvpConfirmation({
  guestName,
  attendance,
  demo,
  reducedMotion = false,
}: RsvpConfirmationProps) {
  const accepted = attendance === "accept";
  const title = accepted
    ? RSVP_COPY.confirmation.acceptTitle
    : RSVP_COPY.confirmation.declineTitle;
  const bodyTemplate = accepted
    ? RSVP_COPY.confirmation.acceptBody
    : RSVP_COPY.confirmation.declineBody;
  const body = bodyTemplate.replace("{name}", guestName);

  return (
    <motion.div
      className="relative mx-auto flex w-full max-w-xl flex-col items-center px-2 text-center"
      initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reducedMotion ? 0.2 : 0.9,
        ease: easings.cinematicOut,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GoldParticles count={14} />
      </div>

      <motion.div
        className="relative mb-8 flex size-20 items-center justify-center"
        initial={reducedMotion ? false : { rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{
          duration: reducedMotion ? 0 : 1.1,
          ease: easings.softBack,
        }}
        aria-hidden
      >
        <span className="absolute inset-0 rounded-full border border-champagne/40" />
        <span className="absolute inset-2 rounded-full border border-champagne/20" />
        <span className="font-heading text-3xl text-champagne">
          {accepted ? "❧" : "✦"}
        </span>
      </motion.div>

      {demo ? (
        <p className="relative mb-4 text-[0.6rem] uppercase tracking-[0.3em] text-champagne/70">
          {RSVP_COPY.confirmation.demoBadge}
        </p>
      ) : null}

      <h3 className="relative font-heading text-balance text-[2.25rem] leading-[1.2] text-ivory sm:text-4xl">
        {title}
      </h3>

      <OrnamentalDivider className="relative mt-7 text-champagne" />

      <p className="relative mt-7 font-serif text-lg font-light leading-relaxed text-ivory/75 sm:text-xl">
        {body}
      </p>
    </motion.div>
  );
}
