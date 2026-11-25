"use client";

import { AnimatePresence, motion } from "motion/react";
import { easings } from "@/lib/animations";
import { cn } from "@/lib/utils/cn";

type CountdownUnitProps = {
  value: number;
  label: string;
  reducedMotion?: boolean;
  className?: string;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function CountdownUnit({
  value,
  label,
  reducedMotion = false,
  className,
}: CountdownUnitProps) {
  const display = pad(value);

  return (
    <div
      className={cn(
        "flex min-w-[4.5rem] flex-col items-center sm:min-w-[5.5rem] md:min-w-[6.5rem]",
        className,
      )}
    >
      <div className="relative h-[2.6rem] overflow-hidden sm:h-[3.4rem] md:h-[4.2rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            className="absolute inset-0 flex items-center justify-center font-heading text-4xl tracking-wide text-champagne sm:text-5xl md:text-6xl"
            initial={
              reducedMotion ? false : { y: 18, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            exit={
              reducedMotion ? undefined : { y: -18, opacity: 0 }
            }
            transition={{
              duration: reducedMotion ? 0 : 0.45,
              ease: easings.cinematicOut,
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-[0.58rem] font-medium uppercase tracking-[0.32em] text-ivory/65 sm:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}
