"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Envelope, type EnvelopePhase } from "./Envelope";
import { GoldParticles } from "./GoldParticles";
import { MusicPlayer, useMusic } from "@/components/music";
import { WeddingJourney } from "@/components/sections";
import { easings } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type ExperienceView = "envelope" | "hero";

export function InvitationExperience() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { playFromStart } = useMusic();
  const [phase, setPhase] = useState<EnvelopePhase>("closed");
  const [view, setView] = useState<ExperienceView>("envelope");
  const [hasOpened, setHasOpened] = useState(false);
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (hasOpened || phase !== "closed") return;

    setHasOpened(true);

    if (prefersReducedMotion) {
      setPhase("revealed");
      return;
    }

    setPhase("opening");
    openTimerRef.current = window.setTimeout(() => {
      setPhase("revealed");
      openTimerRef.current = null;
    }, 1100);
  }, [hasOpened, phase, prefersReducedMotion]);

  const handleEnterExperience = useCallback(() => {
    if (view !== "envelope") return;
    // Start music in the same user-gesture turn as Open Invitation
    // so browsers allow playback without a second click.
    void playFromStart();
    setView("hero");
  }, [view, playFromStart]);

  return (
    <div className="relative min-h-dvh bg-burgundy">
      <AnimatePresence mode="wait">
        {view === "envelope" ? (
          <motion.section
            key="envelope-view"
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16"
            initial={false}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.04, filter: "blur(8px)" }
            }
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.9,
              ease: easings.cinematicInOut,
            }}
            aria-label="Invitation envelope"
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 50% 40%, color-mix(in srgb, var(--wine) 70%, transparent), transparent 72%)",
              }}
            />

            <GoldParticles />

            <motion.div
              className="relative z-10 mb-10 flex max-w-md flex-col items-center text-center"
              initial={false}
              animate={{
                opacity: phase === "closed" ? 1 : 0,
                y: phase === "closed" ? 0 : prefersReducedMotion ? 0 : -12,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: easings.cinematicOut,
              }}
            >
              <p className="font-heading text-balance text-2xl font-medium tracking-wide text-ivory sm:text-3xl">
                A special invitation awaits you
              </p>
              <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.32em] text-champagne/80 sm:text-xs">
                Click to open
              </p>
            </motion.div>

            <div className="relative z-10">
              <Envelope
                phase={phase}
                reducedMotion={prefersReducedMotion}
                onOpen={handleOpen}
                onEnterExperience={handleEnterExperience}
              />
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="hero-view"
            className="min-h-dvh"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 36 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.25 : 1.05,
              ease: easings.cinematicOut,
            }}
          >
            <WeddingJourney reducedMotion={prefersReducedMotion} />
          </motion.div>
        )}
      </AnimatePresence>

      <MusicPlayer />
    </div>
  );
}
