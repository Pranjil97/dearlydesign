"use client";

import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useMusic } from "./MusicProvider";
import { MUSIC } from "@/lib/constants/music";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";

type MusicPlayerProps = {
  className?: string;
};

const EQ_BARS = [
  { delay: 0, duration: 0.42 },
  { delay: 0.12, duration: 0.55 },
  { delay: 0.04, duration: 0.38 },
] as const;

/**
 * Minimal floating music control — small, bottom-right, no song label.
 */
export function MusicPlayer({ className }: MusicPlayerProps) {
  const { status, isPlaying, hasStarted, toggle } = useMusic();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!hasStarted) return null;

  const disabled = status === "unavailable";
  const label =
    status === "unavailable"
      ? MUSIC.unavailable
      : isPlaying
        ? MUSIC.labelPause
        : MUSIC.labelPlay;

  return (
    <div
      className={cn(
        "pointer-events-auto fixed bottom-3 right-3 z-50 sm:bottom-4 sm:right-4",
        className,
      )}
    >
      <motion.button
        type="button"
        onClick={() => {
          void toggle();
        }}
        disabled={disabled}
        aria-label={label}
        title={label}
        aria-pressed={isPlaying}
        className={cn(
          "relative flex size-8 items-center justify-center rounded-full border border-champagne/35 bg-burgundy/70 text-champagne/85 backdrop-blur-sm transition-colors sm:size-9",
          "hover:border-champagne/60 hover:text-champagne",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
          "opacity-55 hover:opacity-100 focus-visible:opacity-100",
        )}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      >
        {isPlaying && !prefersReducedMotion ? (
          <span
            className="absolute inset-0 flex items-center justify-center gap-[2px]"
            aria-hidden
          >
            {EQ_BARS.map((bar, index) => (
              <motion.span
                key={index}
                className="w-[1.5px] rounded-full bg-champagne"
                animate={{ height: ["22%", "70%", "30%", "85%", "22%"] }}
                transition={{
                  duration: bar.duration,
                  delay: bar.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ height: "35%" }}
              />
            ))}
          </span>
        ) : null}

        <span
          className={cn(
            "relative z-10 flex items-center justify-center",
            isPlaying && !prefersReducedMotion && "opacity-0",
          )}
        >
          {status === "unavailable" ? (
            <Play className="size-3 opacity-60" fill="currentColor" />
          ) : isPlaying ? (
            <Pause className="size-3" fill="currentColor" />
          ) : (
            <Play className="size-3" fill="currentColor" />
          )}
        </span>
      </motion.button>
    </div>
  );
}
