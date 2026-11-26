"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Envelope } from "./Envelope";
import { GoldParticles } from "./GoldParticles";
import { MusicPlayer, useMusic } from "@/components/music";
import { WeddingJourney } from "@/components/sections";
import { easings } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type ExperienceView = "envelope" | "hero";

/**
 * Screen 1: closed envelope ("Click to open")
 * Screen 2: Wedding Hero (couple photo) — entered directly on press
 * No intermediate card-rising state.
 */
export function InvitationExperience() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { playFromStart } = useMusic();
  const [view, setView] = useState<ExperienceView>("envelope");
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpen = useCallback(() => {
    if (hasOpened || view !== "envelope") return;

    setHasOpened(true);

    // Start music in the same user-gesture turn as the envelope press.
    void playFromStart();

    // Go straight to the hero — no card peek / open-invitation step.
    setView("hero");
  }, [hasOpened, view, playFromStart]);

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
              duration: prefersReducedMotion ? 0.2 : 0.85,
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

            <div className="relative z-10 mb-10 flex max-w-md flex-col items-center text-center">
              <p className="font-heading text-balance text-[2rem] leading-[1.25] text-ivory sm:text-4xl">
                A Special Invitation Awaits You
              </p>
              <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.32em] text-champagne/80 sm:text-xs">
                Click to open
              </p>
            </div>

            <div className="relative z-10">
              <Envelope
                phase="closed"
                reducedMotion={prefersReducedMotion}
                onOpen={handleOpen}
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
                : { opacity: 0, y: 28 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.95,
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
