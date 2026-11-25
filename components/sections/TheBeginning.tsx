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

          gsap.fromTo(
            "[data-beginning-bg]",
            { scale: 1.08 },
            {
              scale: isDesktop ? 1.2 : 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            "[data-beginning-copy]",
            { y: isDesktop ? 48 : 28, opacity: 0.15 },
            {
              y: isDesktop ? -36 : -18,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
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

  return (
    <section
      ref={sectionRef}
      id="beginning"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-burgundy"
      aria-label="The beginning"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          data-beginning-bg
          className="absolute inset-[-8%] will-change-transform"
        >
          <Image
            src={IMAGE_PATHS.beginningBg}
            alt="Wedding portrait — the beginning of forever"
            fill
            sizes="100vw"
            className="object-cover object-center"
            loading="lazy"
          />
        </div>
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background: `
              linear-gradient(180deg,
                color-mix(in srgb, var(--burgundy) 70%, transparent) 0%,
                color-mix(in srgb, #000 45%, transparent) 45%,
                color-mix(in srgb, var(--burgundy) 80%, transparent) 100%
              )
            `,
          }}
        />
      </div>

      <div
        data-beginning-copy
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center will-change-transform"
      >
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
          className="mt-6 font-heading text-balance text-4xl font-medium tracking-wide text-ivory sm:text-5xl md:text-6xl lg:text-7xl"
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

        <OrnamentalDivider className="mt-8 text-champagne" />

        <motion.p
          className="mt-7 max-w-xl font-heading text-lg font-light leading-relaxed text-ivory/75 sm:text-xl"
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
      </div>
    </section>
  );
}
