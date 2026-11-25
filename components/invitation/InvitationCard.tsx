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
  onEnterExperience: () => void;
  className?: string;
};

export function InvitationCard({
  revealed,
  reducedMotion = false,
  onEnterExperience,
  className,
}: InvitationCardProps) {
  return (
    <div className={cn("invitation-card", className)}>
      <div className="invitation-card-inner" />

      <motion.div
        className="relative z-10 flex flex-col items-center px-1"
        initial={false}
        animate={
          revealed
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: reducedMotion ? 0 : 12 }
        }
        transition={{
          duration: reducedMotion ? 0 : 0.7,
          delay: reducedMotion ? 0 : 0.15,
          ease: easings.cinematicOut,
        }}
      >
        <p className="font-heading text-[0.65rem] uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--burgundy)_55%,transparent)] sm:text-[0.7rem]">
          {WEDDING.envelope.brand}
        </p>

        <h2 className="mt-2.5 font-heading text-balance text-xl font-medium leading-snug tracking-wide text-burgundy sm:mt-3 sm:text-2xl md:text-3xl">
          {WEDDING.envelope.inviteLine}
        </h2>

        <OrnamentalDivider className="my-3 sm:my-4" tone="burgundy" />

        <p className="font-heading text-base tracking-wide text-burgundy sm:text-lg md:text-xl">
          {getCoupleNames(WEDDING)}
        </p>

        <p className="mt-2 font-heading text-sm italic tracking-wide text-[color-mix(in_srgb,var(--burgundy)_72%,transparent)] sm:text-base">
          {WEDDING.envelope.celebrationLine}
        </p>

        <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-[color-mix(in_srgb,var(--burgundy)_55%,transparent)] sm:text-[0.62rem]">
          {getWeddingDateLabel(WEDDING)}
        </p>

        <motion.button
          type="button"
          className="mt-5 border border-[color-mix(in_srgb,var(--champagne)_70%,var(--burgundy))] bg-[color-mix(in_srgb,var(--burgundy)_92%,black)] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-champagne transition-colors hover:bg-burgundy sm:mt-6 sm:px-6 sm:text-xs"
          onClick={onEnterExperience}
          whileHover={reducedMotion ? undefined : { scale: 1.03, y: -1 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 340, damping: 24 }}
        >
          {WEDDING.envelope.openLabel}
        </motion.button>
      </motion.div>
    </div>
  );
}
