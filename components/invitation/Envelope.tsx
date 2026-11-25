"use client";

import { motion } from "motion/react";
import { InvitationCard } from "./InvitationCard";
import { WaxSeal } from "./WaxSeal";
import { easings } from "@/lib/animations";
import { cn } from "@/lib/utils/cn";
import "./envelope.css";

export type EnvelopePhase = "closed" | "opening" | "revealed";

type EnvelopeProps = {
  phase: EnvelopePhase;
  reducedMotion?: boolean;
  onOpen: () => void;
  onEnterExperience: () => void;
};

export function Envelope({
  phase,
  reducedMotion = false,
  onOpen,
  onEnterExperience,
}: EnvelopeProps) {
  const isOpen = phase !== "closed";
  const isRevealed = phase === "revealed";
  const canOpen = phase === "closed";

  const flapRotate = isOpen ? -165 : 0;

  const cardY =
    phase === "revealed" ? "-58%" : phase === "opening" ? "-28%" : "22%";

  return (
    <div className="envelope-scene">
      <motion.div
        className="envelope-stage"
        initial={false}
        animate={
          canOpen && !reducedMotion
            ? { y: [0, -6, 0] }
            : { y: 0 }
        }
        transition={
          canOpen && !reducedMotion
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4 }
        }
      >
        <motion.div
          className="envelope"
          role={canOpen ? "button" : undefined}
          tabIndex={canOpen ? 0 : undefined}
          aria-label={canOpen ? "Open the invitation envelope" : undefined}
          onClick={() => {
            if (canOpen) onOpen();
          }}
          onKeyDown={(event) => {
            if (!canOpen) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen();
            }
          }}
          whileHover={
            canOpen && !reducedMotion ? { scale: 1.02, y: -4 } : undefined
          }
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{ cursor: canOpen ? "pointer" : "default" }}
        >
          <div className={cn("envelope-pocket", isOpen && "is-open")}>
            <div className="envelope-inner-shadow" />

            <div
              className={cn(
                "envelope-card-slot",
                isRevealed && "is-interactive",
              )}
            >
              <motion.div
                className="h-full w-full"
                initial={false}
                animate={{ y: cardY }}
                transition={{
                  duration: reducedMotion ? 0 : 1.15,
                  delay: reducedMotion ? 0 : isOpen ? 0.35 : 0,
                  ease: easings.cinematicOut,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <InvitationCard
                  revealed={isRevealed}
                  reducedMotion={reducedMotion}
                  onEnterExperience={onEnterExperience}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            className="envelope-flap"
            initial={false}
            animate={{ rotateX: flapRotate }}
            transition={{
              duration: reducedMotion ? 0 : 1.05,
              ease: easings.cinematicInOut,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="envelope-flap-face" />
            <div className="envelope-flap-back" />
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 0 : 1,
              scale: isOpen ? 0.85 : 1,
              pointerEvents: isOpen ? "none" : "auto",
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.45,
              ease: easings.cinematicOut,
            }}
          >
            <WaxSeal
              interactive={canOpen}
              reducedMotion={reducedMotion}
              onOpen={onOpen}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
