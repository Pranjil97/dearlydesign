"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { GoldParticles } from "@/components/invitation/GoldParticles";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings } from "@/lib/animations";
import {
  IMAGE_PATHS,
  WEDDING,
  getCoupleNames,
  getWeddingDateLabel,
  getWeddingTimeLabel,
} from "@/config/wedding";

type SaveTheDateProps = {
  reducedMotion?: boolean;
};

export function SaveTheDate({ reducedMotion = false }: SaveTheDateProps) {
  const entrance = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.45 },
    transition: {
      duration: reducedMotion ? 0 : 1,
      delay: reducedMotion ? 0 : delay,
      ease: easings.cinematicOut,
    },
  });

  return (
    <section
      id="save-the-date"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-burgundy px-5 py-28 sm:px-8"
      aria-label="Save the date"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 40%, color-mix(in srgb, var(--wine) 70%, transparent), transparent 72%),
            radial-gradient(ellipse 40% 30% at 50% 85%, color-mix(in srgb, var(--champagne) 8%, transparent), transparent 70%)
          `,
        }}
      />

      <GoldParticles count={22} />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.p
          className="text-[0.65rem] font-medium uppercase tracking-[0.38em] text-champagne sm:text-xs"
          {...entrance(0)}
        >
          {WEDDING.saveTheDate.eyebrow}
        </motion.p>

        <motion.h2
          className="mt-6 font-heading text-balance text-4xl font-medium tracking-wide text-ivory sm:text-5xl md:text-6xl lg:text-7xl"
          {...entrance(0.12)}
        >
          {WEDDING.saveTheDate.title}
        </motion.h2>

        <motion.p
          className="mt-5 font-heading text-xl tracking-wide text-champagne sm:text-2xl"
          {...entrance(0.18)}
        >
          {getCoupleNames(WEDDING)}
        </motion.p>

        <motion.div className="mt-10 w-full max-w-xs" {...entrance(0.22)}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-champagne to-transparent" />
          <OrnamentalDivider className="mx-auto -mt-[7px] bg-burgundy px-3 text-champagne" />
        </motion.div>

        <motion.div
          className="relative mt-10 w-full max-w-[14rem] overflow-hidden sm:mt-12 sm:max-w-[16rem]"
          {...entrance(0.28)}
        >
          <div className="relative aspect-[3/4] border border-champagne/35">
            <Image
              src={IMAGE_PATHS.invitationDetail}
              alt="Wedding invitation detail"
              fill
              sizes="(max-width: 640px) 56vw, 256px"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          {...entrance(0.32)}
        >
          <span className="text-[0.6rem] uppercase tracking-[0.36em] text-champagne/75 sm:text-[0.65rem]">
            {WEDDING.dateLabel}
          </span>
          <motion.p
            className="font-heading text-3xl tracking-wide text-ivory sm:text-5xl md:text-6xl"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: reducedMotion ? 0 : 1.1,
              delay: reducedMotion ? 0 : 0.4,
              ease: easings.cinematicOut,
            }}
          >
            {getWeddingDateLabel(WEDDING)}
          </motion.p>
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-ivory/55 sm:text-xs">
            {getWeddingTimeLabel(WEDDING)}
          </p>
          <p className="mt-2 max-w-sm font-heading text-base italic text-ivory/70 sm:text-lg">
            {WEDDING.venue}
          </p>
          <p className="max-w-sm text-[0.7rem] leading-relaxed tracking-wide text-ivory/50 sm:text-xs">
            {WEDDING.venueAddress}
            <br />
            {WEDDING.location}
          </p>
        </motion.div>

        <motion.p
          className="mt-10 max-w-md font-heading text-lg italic leading-relaxed text-ivory/70 sm:text-xl"
          {...entrance(0.48)}
        >
          {WEDDING.saveTheDate.cta}
        </motion.p>

        <motion.div
          className="mt-16 h-px w-24 bg-gradient-to-r from-transparent via-champagne/50 to-transparent"
          aria-hidden
          {...entrance(0.56)}
        />
      </div>
    </section>
  );
}
