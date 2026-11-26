"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings, gsap, registerGsap, useGSAP } from "@/lib/animations";
import { IMAGE_PATHS, WEDDING } from "@/config/wedding";

type TheBeginningProps = {
  reducedMotion?: boolean;
};

/**
 * Forever / The Beginning section.
 * Phone: full-bleed vertical portrait (as now).
 * Desktop: split editorial — portrait + copy side by side.
 */
export function TheBeginning({ reducedMotion = false }: TheBeginningProps) {
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
          if (mqReduce) return;

          // Mobile full-bleed parallax
          gsap.fromTo(
            "[data-beginning-bg-mobile]",
            { scale: 1.06 },
            {
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          if (isDesktop) {
            gsap.fromTo(
              "[data-beginning-bg-desktop]",
              { yPercent: -4 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }

          gsap.fromTo(
            "[data-beginning-copy]",
            { y: isDesktop ? 36 : 28, opacity: 0.2 },
            {
              y: isDesktop ? -12 : -18,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "center center",
                scrub: 0.6,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const copy = (
    <>
      <motion.p
        className="text-[0.65rem] font-medium uppercase tracking-[0.38em] text-champagne sm:text-xs"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{
          duration: reducedMotion ? 0 : 0.85,
          ease: easings.cinematicOut,
        }}
      >
        {WEDDING.beginning.eyebrow}
      </motion.p>

      <motion.h2
        className="mt-6 font-heading text-balance text-[2.5rem] leading-[1.2] text-ivory sm:text-5xl md:text-6xl lg:text-7xl"
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: reducedMotion ? 0 : 1,
          delay: reducedMotion ? 0 : 0.1,
          ease: easings.cinematicOut,
        }}
      >
        {WEDDING.beginning.title}
      </motion.h2>

      <OrnamentalDivider className="mt-8 text-champagne md:mx-0" />

      <motion.p
        className="mt-7 max-w-xl font-serif text-lg font-light leading-relaxed text-ivory/75 sm:text-xl"
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: reducedMotion ? 0 : 0.95,
          delay: reducedMotion ? 0 : 0.18,
          ease: easings.cinematicOut,
        }}
      >
        {WEDDING.beginning.body}
      </motion.p>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="beginning"
      className="relative overflow-hidden bg-burgundy"
      aria-label="The beginning"
    >
      {/* ——— Mobile: full-bleed vertical portrait ——— */}
      <div className="relative flex min-h-[100dvh] items-end justify-center md:hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            data-beginning-bg-mobile
            className="absolute inset-[-6%] will-change-transform"
          >
            <Image
              src={IMAGE_PATHS.beginningBg}
              alt="Couple portrait — the beginning of forever"
              fill
              sizes="100vw"
              className="object-cover object-[center_30%]"
              priority
            />
          </div>
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background: `
                linear-gradient(180deg,
                  color-mix(in srgb, var(--burgundy) 35%, transparent) 0%,
                  color-mix(in srgb, #000 25%, transparent) 40%,
                  color-mix(in srgb, var(--burgundy) 88%, transparent) 100%
                )
              `,
            }}
          />
        </div>

        <div
          data-beginning-copy
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-16 pt-28 text-center will-change-transform"
        >
          {copy}
        </div>
      </div>

      {/* ——— Desktop: split layout for portrait photo ——— */}
      <div className="relative hidden min-h-[100dvh] md:grid md:grid-cols-2 md:items-stretch">
        <div className="relative min-h-[100dvh] overflow-hidden">
          <div
            data-beginning-bg-desktop
            className="absolute inset-[-4%] will-change-transform"
          >
            <Image
              src={IMAGE_PATHS.beginningBg}
              alt="Couple portrait — the beginning of forever"
              fill
              sizes="50vw"
              className="object-cover object-[center_25%]"
              priority
            />
          </div>
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background: `
                linear-gradient(90deg,
                  transparent 55%,
                  color-mix(in srgb, var(--burgundy) 55%, transparent) 100%
                ),
                linear-gradient(180deg,
                  color-mix(in srgb, var(--burgundy) 25%, transparent) 0%,
                  transparent 30%,
                  color-mix(in srgb, var(--burgundy) 40%, transparent) 100%
                )
              `,
            }}
          />
        </div>

        <div className="relative flex items-center bg-burgundy px-10 py-24 lg:px-16 xl:px-20">
          <div
            data-beginning-copy
            className="relative z-10 flex max-w-xl flex-col items-start text-left will-change-transform"
          >
            {copy}
          </div>
        </div>
      </div>
    </section>
  );
}
