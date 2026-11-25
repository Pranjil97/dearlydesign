"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings, gsap, registerGsap, useGSAP } from "@/lib/animations";
import {
  IMAGE_PATHS,
  WEDDING,
  getCoupleNames,
} from "@/config/wedding";

type OurStoryProps = {
  reducedMotion?: boolean;
};

export function OurStory({ reducedMotion = false }: OurStoryProps) {
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
            "[data-story-reveal]",
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "top 35%",
                scrub: 0.7,
              },
            },
          );

          gsap.to("[data-story-image-inner]", {
            yPercent: isDesktop ? 12 : 6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const textEntrance = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.45 },
    transition: {
      duration: reducedMotion ? 0 : 0.9,
      delay: reducedMotion ? 0 : delay,
      ease: easings.cinematicOut,
    },
  });

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative overflow-hidden bg-burgundy px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40"
      aria-label="Our story"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 15% 35%, color-mix(in srgb, var(--wine) 60%, transparent), transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div
          data-story-reveal
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          style={
            reducedMotion
              ? undefined
              : { clipPath: "inset(100% 0% 0% 0%)" }
          }
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-wine">
            <div
              data-story-image-inner
              className="absolute inset-[-14%] will-change-transform"
            >
              <Image
                src={IMAGE_PATHS.storyEditorial}
                alt="Couple story photograph"
                fill
                sizes="(max-width: 1024px) 92vw, 42vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, transparent 50%, color-mix(in srgb, var(--burgundy) 50%, transparent) 100%)",
              }}
            />
          </div>
        </div>

        <div className="relative text-center lg:text-left">
          <motion.p
            className="text-[0.65rem] font-medium uppercase tracking-[0.34em] text-champagne sm:text-xs"
            {...textEntrance(0)}
          >
            {WEDDING.story.eyebrow}
          </motion.p>

          <motion.h2
            className="mt-5 font-heading text-balance text-4xl font-medium leading-[1.12] tracking-wide text-ivory sm:text-5xl lg:text-6xl"
            {...textEntrance(0.1)}
          >
            {WEDDING.story.title}
          </motion.h2>

          <motion.div {...textEntrance(0.18)}>
            <OrnamentalDivider className="mx-auto mt-7 text-champagne lg:mx-0" />
          </motion.div>

          <motion.p
            className="mt-7 max-w-xl font-heading text-lg font-light leading-relaxed text-ivory/75 sm:text-xl lg:mx-0"
            {...textEntrance(0.24)}
          >
            {WEDDING.story.body}
          </motion.p>

          <motion.p
            className="mt-8 font-heading text-lg tracking-wide text-ivory/90"
            {...textEntrance(0.3)}
          >
            {getCoupleNames(WEDDING)}
          </motion.p>

          <motion.p
            className="mt-3 font-heading text-base italic text-champagne/80"
            {...textEntrance(0.36)}
          >
            {WEDDING.venueHint}
          </motion.p>

          <motion.p
            className="mt-2 text-[0.62rem] uppercase tracking-[0.26em] text-ivory/50"
            {...textEntrance(0.4)}
          >
            {WEDDING.venue} · {WEDDING.location}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
