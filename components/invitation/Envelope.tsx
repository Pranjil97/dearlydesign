"use client";

import { motion } from "motion/react";
import { WaxSeal } from "./WaxSeal";
import "./envelope.css";

export type EnvelopePhase = "closed" | "opening" | "revealed";

type EnvelopeProps = {
  phase: EnvelopePhase;
  reducedMotion?: boolean;
  onOpen: () => void;
};

/**
 * Closed invitation envelope for the first screen.
 * Plain sealed look — no invitation card / text showing through.
 */
export function Envelope({
  phase,
  reducedMotion = false,
  onOpen,
}: EnvelopeProps) {
  const canOpen = phase === "closed";

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
            : { duration: 0.35 }
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
          <div className="envelope-pocket">
            <div className="envelope-inner-shadow" />
          </div>

          <div className="envelope-flap">
            <div className="envelope-flap-face" />
            <div className="envelope-flap-back" />
          </div>

          <WaxSeal
            interactive={canOpen}
            reducedMotion={reducedMotion}
            onOpen={onOpen}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
