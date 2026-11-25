"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

type WaxSealProps = {
  className?: string;
  interactive?: boolean;
  reducedMotion?: boolean;
  onOpen?: () => void;
};

export function WaxSeal({
  className,
  interactive = true,
  reducedMotion = false,
  onOpen,
}: WaxSealProps) {
  return (
    <motion.button
      type="button"
      className={cn("wax-seal", className)}
      aria-label="Open invitation envelope"
      disabled={!interactive}
      onClick={(event) => {
        event.stopPropagation();
        onOpen?.();
      }}
      whileHover={
        interactive && !reducedMotion
          ? { scale: 1.06, rotate: -2 }
          : undefined
      }
      whileTap={interactive && !reducedMotion ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <span className="wax-seal-ring" />
      <span className="wax-seal-glyph">❧</span>
    </motion.button>
  );
}
