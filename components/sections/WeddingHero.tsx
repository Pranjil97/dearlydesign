"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { GoldParticles } from "@/components/invitation/GoldParticles";
import { easings, gsap, registerGsap, useGSAP } from "@/lib/animations";
import {
  IMAGE_PATHS,
  WEDDING,
  getWeddingDateLabel,
} from "@/config/wedding";

type WeddingHeroProps = {
  reducedMotion?: boolean;
};

export function WeddingHero({ reducedMotion = false }: WeddingHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (reducedMotion || !sectionRef.current) return;

      const section = sectionRef.current;
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion: mqReduce } = context.conditions!;
          // GSAP only invokes this callback when at least one query matches.
          // isMobile ensures mobile viewports still receive scrub animations.
          if (mqReduce) return;

          const bgShift = isDesktop ? 18 : 10;
          const fgShift = isDesktop ? -48 : -28;
          const midShift = isDesktop ? -24 : -14;
          const scaleTo = isDesktop ? 1.1 : 1.05;

          gsap.to("[data-hero-bg]", {
            yPercent: bgShift,
            scale: scaleTo,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to("[data-hero-floral-bg]", {
            yPercent: midShift,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });

          gsap.to("[data-hero-floral-fg]", {
            yPercent: fgShift,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });

          gsap.to("[data-hero-copy]", {
            y: isDesktop ? -80 : -48,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "65% top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const entrance = (delay: number) =>
    reducedMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 1,
            delay,
            ease: easings.cinematicOut,
          },
        };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-dvh overflow-hidden bg-burgundy md:min-h-[140vh]"
      aria-label="Wedding hero"
    >
      {/*
        Mobile: section height matches the sticky viewport so Our Story
        begins immediately after the hero (no leftover scroll gap).
        Desktop: taller section keeps the existing parallax scrub room.
      */}
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div
          data-hero-bg
          className="absolute inset-[-10%] will-change-transform"
        >
          <motion.div
            className="absolute inset-0"
            initial={reducedMotion ? false : { scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{
              duration: reducedMotion ? 0 : 4.8,
              ease: easings.cinematicOut,
            }}
          >
            <Image
              src={IMAGE_PATHS.heroPortrait}
              alt={`${WEDDING.bride} and ${WEDDING.groom} — wedding portrait`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_40%] sm:object-[center_45%] md:object-center"
            />
          </motion.div>

          {/* Softened cinematic overlay — ~10% lighter so faces & jewellery read clearly */}
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background: `
                linear-gradient(180deg,
                  color-mix(in srgb, var(--burgundy) 42%, transparent) 0%,
                  color-mix(in srgb, #000 22%, transparent) 34%,
                  color-mix(in srgb, var(--burgundy) 30%, transparent) 64%,
                  color-mix(in srgb, var(--burgundy) 78%, transparent) 86%,
                  var(--burgundy) 100%
                )
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-35 mix-blend-soft-light"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 38%, color-mix(in srgb, var(--champagne) 12%, transparent), transparent 70%)",
            }}
          />
          {/* Mobile readability veil behind lower typography only */}
          <div
            className="absolute inset-x-0 bottom-0 h-[48%] md:hidden"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--burgundy) 48%, transparent) 50%, color-mix(in srgb, var(--burgundy) 78%, transparent) 100%)",
            }}
          />
        </div>

        <div
          data-hero-floral-bg
          className="pointer-events-none absolute inset-0 hidden will-change-transform sm:block"
          aria-hidden
        >
          <Image
            src={IMAGE_PATHS.floralBgLeft}
            alt=""
            width={420}
            height={740}
            className="absolute bottom-[-8%] left-[-8%] h-[75vh] w-auto max-w-[46vw] opacity-50 sm:left-[-4%] sm:opacity-70"
          />
          <Image
            src={IMAGE_PATHS.floralBgRight}
            alt=""
            width={420}
            height={740}
            className="absolute bottom-[-8%] right-[-8%] h-[75vh] w-auto max-w-[46vw] opacity-50 sm:right-[-4%] sm:opacity-70"
          />
        </div>

        <GoldParticles count={18} />

        <div
          data-hero-floral-fg
          className="pointer-events-none absolute inset-0 z-20 will-change-transform max-[380px]:hidden"
          aria-hidden
        >
          <Image
            src={IMAGE_PATHS.floralLeft}
            alt=""
            width={360}
            height={680}
            className="absolute bottom-[-4%] left-[-6%] h-[52vh] w-auto max-w-[26vw] opacity-55 drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:left-0 sm:h-[68vh] sm:max-w-[38vw] sm:opacity-100 md:left-0"
          />
          <Image
            src={IMAGE_PATHS.floralRight}
            alt=""
            width={360}
            height={680}
            className="absolute bottom-[-4%] right-[-6%] h-[52vh] w-auto max-w-[26vw] opacity-55 drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:right-0 sm:h-[68vh] sm:max-w-[38vw] sm:opacity-100 md:right-0"
          />
        </div>

        <div
          data-hero-copy
          className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-14 pt-16 text-center sm:justify-center sm:px-6 sm:pb-20 sm:pt-20"
        >
          <motion.p
            className="mb-4 text-[0.6rem] font-medium uppercase tracking-[0.34em] text-champagne sm:mb-6 sm:text-xs sm:tracking-[0.38em]"
            {...entrance(0.15)}
          >
            {WEDDING.eyebrow}
          </motion.p>

          <motion.h1
            className="font-heading text-balance text-[2rem] font-medium leading-[1.12] tracking-wide text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
            {...entrance(0.35)}
          >
            <span className="block">{WEDDING.bride}</span>
            <span className="my-1.5 block font-heading text-xl font-light italic text-champagne sm:my-3 sm:text-3xl md:text-4xl">
              &amp;
            </span>
            <span className="block">{WEDDING.groom}</span>
          </motion.h1>

          <motion.div {...entrance(0.55)}>
            <OrnamentalDivider className="mx-auto mt-5 text-champagne sm:mt-9" />
          </motion.div>

          <motion.p
            className="mt-5 max-w-xl font-heading text-sm uppercase tracking-[0.16em] text-ivory/85 sm:mt-8 sm:text-lg sm:tracking-[0.22em] sm:text-ivory/80"
            {...entrance(0.7)}
          >
            {WEDDING.subtitle}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col items-center gap-1.5 sm:mt-10 sm:gap-2"
            {...entrance(0.9)}
          >
            <span className="text-[0.58rem] uppercase tracking-[0.32em] text-champagne/75 sm:text-[0.65rem] sm:tracking-[0.34em] sm:text-champagne/70">
              {WEDDING.dateLabel}
            </span>
            <span className="font-heading text-lg text-ivory sm:text-2xl">
              {getWeddingDateLabel(WEDDING)}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
