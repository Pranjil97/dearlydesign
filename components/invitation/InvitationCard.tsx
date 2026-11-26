"use client";

import { motion } from "motion/react";
import { OrnamentalDivider } from "./OrnamentalDivider";
import { easings } from "@/lib/animations";
import {
  WEDDING,
  getCoupleNames,
  getWeddingDateLabel,
} from "@/config/wedding";
import { cn } from "@/lib/utils/cn";

type InvitationCardProps = {
  revealed: boolean;
  reducedMotion?: boolean;
  className?: string;
};

/**
 * Invitation card that rises from the envelope on open.
 * Content is visible immediately when opening — no delayed fade that glitches.
 */
export function InvitationCard({
  revealed,
  reducedMotion = false,
  className,
}: InvitationCardProps) {
  return (
    <div className={cn("invitation-card", className)}>
      <div className="invitation-card-inner" />

      <motion.div
        className="relative z-10 flex flex-col items-center px-1"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0 : revealed ? 0.35 : 0,
          ease: easings.cinematicOut,
        }}
      >
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--burgundy)_55%,transparent)] sm:text-[0.7rem]">
          {WEDDING.envelope.brand}
        </p>

        <h2 className="mt-2.5 font-heading text-balance text-[1.65rem] leading-snug text-burgundy sm:mt-3 sm:text-3xl md:text-4xl">
          {WEDDING.envelope.inviteLine}
        </h2>

        <OrnamentalDivider className="my-3 sm:my-4" tone="burgundy" />

        <p className="font-heading text-2xl text-burgundy sm:text-3xl md:text-4xl">
          {getCoupleNames(WEDDING)}
        </p>

        <p className="mt-2 font-heading text-lg text-[color-mix(in_srgb,var(--burgundy)_72%,transparent)] sm:text-xl">
          {WEDDING.envelope.celebrationLine}
        </p>

        <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-[color-mix(in_srgb,var(--burgundy)_55%,transparent)] sm:text-[0.62rem]">
          {getWeddingDateLabel(WEDDING)}
        </p>
      </motion.div>
    </div>
  );
}
