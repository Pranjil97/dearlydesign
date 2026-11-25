"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUp, Share2 } from "lucide-react";
import { GoldParticles } from "@/components/invitation/GoldParticles";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings } from "@/lib/animations";
import {
  IMAGE_PATHS,
  WEDDING,
  getCoupleNames,
  getWeddingDateLabel,
} from "@/config/wedding";
import { SITE } from "@/lib/constants/site";
import { useLenis } from "lenis/react";

type FinalThankYouProps = {
  reducedMotion?: boolean;
};

export function FinalThankYou({ reducedMotion = false }: FinalThankYouProps) {
  const lenis = useLenis();
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: reducedMotion ? 0.2 : 1.4 });
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [lenis, reducedMotion]);

  const shareStatusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shareStatusTimerRef.current !== null) {
        window.clearTimeout(shareStatusTimerRef.current);
      }
    };
  }, []);

  const shareInvitation = useCallback(async () => {
    const shareData = {
      title: SITE.name,
      text: `${getCoupleNames(WEDDING)} — ${SITE.tagline}`,
      url: typeof window !== "undefined" ? window.location.href : SITE.name,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Shared");
      } else if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(shareData.url);
        setShareStatus("Link copied");
      } else {
        setShareStatus("Copy this page URL to share");
      }
    } catch {
      // User cancelled share sheet — stay quiet.
      setShareStatus(null);
      return;
    }

    if (shareStatusTimerRef.current !== null) {
      window.clearTimeout(shareStatusTimerRef.current);
    }
    shareStatusTimerRef.current = window.setTimeout(() => {
      setShareStatus(null);
      shareStatusTimerRef.current = null;
    }, 2400);
  }, []); // couple names read from central WEDDING config module

  return (
    <section
      id="thank-you"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-burgundy px-5 py-28 sm:px-8"
      aria-label="Thank you"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={IMAGE_PATHS.floralBgLeft}
          alt=""
          width={380}
          height={680}
          className="absolute bottom-0 left-[-8%] h-[55vh] w-auto opacity-40 sm:opacity-55"
        />
        <Image
          src={IMAGE_PATHS.floralBgRight}
          alt=""
          width={380}
          height={680}
          className="absolute bottom-0 right-[-8%] h-[55vh] w-auto opacity-40 sm:opacity-55"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, color-mix(in srgb, var(--wine) 55%, transparent), transparent 72%)",
          }}
        />
      </div>

      <GoldParticles count={18} />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.p
          className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-champagne sm:text-xs"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: reducedMotion ? 0 : 0.85,
            ease: easings.cinematicOut,
          }}
        >
          {WEDDING.thankYou.eyebrow}
        </motion.p>

        <motion.h2
          className="mt-6 font-heading text-balance text-4xl font-medium tracking-wide text-ivory sm:text-5xl md:text-6xl lg:text-7xl"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: reducedMotion ? 0 : 1,
            delay: reducedMotion ? 0 : 0.1,
            ease: easings.cinematicOut,
          }}
        >
          {WEDDING.thankYou.title}
        </motion.h2>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.8, delay: 0.18 }}
        >
          <OrnamentalDivider className="mt-8 text-champagne" />
        </motion.div>

        <motion.p
          className="mt-8 font-heading text-2xl tracking-wide text-ivory sm:text-3xl"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.9,
            delay: reducedMotion ? 0 : 0.22,
            ease: easings.cinematicOut,
          }}
        >
          {getCoupleNames(WEDDING)}
        </motion.p>

        <motion.p
          className="mt-3 text-[0.65rem] uppercase tracking-[0.32em] text-champagne/80 sm:text-xs"
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.8, delay: 0.3 }}
        >
          {WEDDING.dateLabel} · {getWeddingDateLabel(WEDDING)}
        </motion.p>

        <motion.p
          className="mt-2 text-[0.6rem] uppercase tracking-[0.26em] text-ivory/45 sm:text-[0.65rem]"
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.8, delay: 0.34 }}
        >
          {WEDDING.venue} · {WEDDING.location}
        </motion.p>

        <motion.div
          className="mt-12 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.85,
            delay: reducedMotion ? 0 : 0.36,
            ease: easings.cinematicOut,
          }}
        >
          <button
            type="button"
            onClick={shareInvitation}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-champagne/60 px-5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-champagne transition-colors hover:bg-champagne/10"
          >
            <Share2 className="size-3.5" aria-hidden />
            Share invitation
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-ivory/25 px-5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-ivory/80 transition-colors hover:border-ivory/50 hover:text-ivory"
          >
            <ArrowUp className="size-3.5" aria-hidden />
            Back to top
          </button>
        </motion.div>

        <p
          className="mt-4 min-h-5 text-sm text-ivory/60"
          aria-live="polite"
        >
          {shareStatus}
        </p>
      </div>
    </section>
  );
}
