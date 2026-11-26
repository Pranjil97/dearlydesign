"use client";

import { motion } from "motion/react";
import { CountdownUnit } from "@/components/countdown/CountdownUnit";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { GoldParticles } from "@/components/invitation/GoldParticles";
import { easings } from "@/lib/animations";
import { COUNTDOWN_COPY } from "@/lib/constants/events";
import {
  getCoupleNames,
  getWeddingDateLabel,
  WEDDING,
} from "@/config/wedding";
import { useCountdown } from "@/lib/hooks/useCountdown";

type CountdownProps = {
  reducedMotion?: boolean;
};

export function Countdown({ reducedMotion = false }: CountdownProps) {
  const { days, hours, minutes, seconds, phase } = useCountdown();

  // Use mount animation (not whileInView) so Lenis smooth-scroll cannot
  // leave the timer stuck at opacity 0.
  const entrance = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reducedMotion ? 0 : 0.9,
      delay: reducedMotion ? 0 : delay,
      ease: easings.cinematicOut,
    },
  });

  const title =
    phase === "upcoming"
      ? COUNTDOWN_COPY.title
      : phase === "weddingDay"
        ? COUNTDOWN_COPY.weddingDayTitle
        : COUNTDOWN_COPY.completeTitle;

  const body =
    phase === "weddingDay"
      ? COUNTDOWN_COPY.weddingDayBody
      : COUNTDOWN_COPY.completeBody;

  return (
    <section
      id="countdown"
      className="relative flex min-h-[70dvh] items-center justify-center overflow-hidden bg-burgundy px-5 py-24 sm:px-8 sm:py-32"
      aria-label="Wedding countdown"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, color-mix(in srgb, var(--wine) 65%, transparent), transparent 72%)",
        }}
      />
      <GoldParticles count={16} />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.p
          className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-champagne sm:text-xs"
          {...entrance(0)}
        >
          {COUNTDOWN_COPY.eyebrow}
        </motion.p>

        <motion.h2
          className="mt-5 font-heading text-balance text-[2.35rem] leading-[1.2] text-ivory sm:text-5xl md:text-6xl"
          {...entrance(0.1)}
        >
          {title}
        </motion.h2>

        <motion.div className="mt-8 w-full max-w-sm" {...entrance(0.18)}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-champagne/70 to-transparent" />
          <OrnamentalDivider className="mx-auto -mt-[7px] bg-burgundy px-3 text-champagne" />
        </motion.div>

        {phase === "upcoming" ? (
          <motion.div
            className="mt-12 flex w-full max-w-3xl flex-wrap items-start justify-center gap-x-4 gap-y-8 sm:gap-x-8 md:gap-x-10"
            {...entrance(0.28)}
            aria-live="polite"
            aria-atomic="true"
          >
            <CountdownUnit
              value={days}
              label="Days"
              reducedMotion={reducedMotion}
            />
            <span
              className="mt-2 hidden font-heading text-3xl text-champagne/50 sm:mt-3 sm:block md:text-4xl"
              aria-hidden
            >
              :
            </span>
            <CountdownUnit
              value={hours}
              label="Hours"
              reducedMotion={reducedMotion}
            />
            <span
              className="mt-2 hidden font-heading text-3xl text-champagne/50 sm:mt-3 sm:block md:text-4xl"
              aria-hidden
            >
              :
            </span>
            <CountdownUnit
              value={minutes}
              label="Minutes"
              reducedMotion={reducedMotion}
            />
            <span
              className="mt-2 hidden font-heading text-3xl text-champagne/50 sm:mt-3 sm:block md:text-4xl"
              aria-hidden
            >
              :
            </span>
            <CountdownUnit
              value={seconds}
              label="Seconds"
              reducedMotion={reducedMotion}
            />
          </motion.div>
        ) : (
          <motion.div
            className="mt-12 flex max-w-lg flex-col items-center gap-5"
            {...entrance(0.28)}
          >
            <p className="font-serif text-lg italic leading-relaxed text-ivory/80 sm:text-xl">
              {body}
            </p>
            <p className="font-heading text-3xl text-champagne sm:text-4xl">
              {getCoupleNames(WEDDING)}
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-ivory/55 sm:text-xs">
              {getWeddingDateLabel(WEDDING)}
            </p>
          </motion.div>
        )}

        {phase === "upcoming" ? (
          <motion.p
            className="mt-10 text-[0.6rem] uppercase tracking-[0.28em] text-champagne/65 sm:text-[0.65rem]"
            {...entrance(0.4)}
          >
            {getWeddingDateLabel(WEDDING)} · {WEDDING.location}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
