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
  { delay: 0.18, duration: 0.48 },
] as const;

/**
 * Floating champagne-gold play/pause control.
 * Uses the single global audio instance from MusicProvider.
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
        "pointer-events-auto fixed bottom-5 right-4 z-50 sm:bottom-8 sm:right-6",
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
          "relative flex size-12 items-center justify-center gap-0.5 rounded-full border border-champagne/55 bg-[color-mix(in_srgb,var(--champagne)_18%,var(--burgundy))] text-champagne shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors sm:size-14",
          "hover:border-champagne hover:bg-[color-mix(in_srgb,var(--champagne)_28%,var(--wine))]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
        )}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      >
        {isPlaying && !prefersReducedMotion ? (
          <span className="absolute inset-0 flex items-center justify-center gap-[3px]" aria-hidden>
            {EQ_BARS.map((bar, index) => (
              <motion.span
                key={index}
                className="w-[2.5px] rounded-full bg-champagne sm:w-[3px]"
                animate={{ height: ["28%", "78%", "36%", "90%", "28%"] }}
                transition={{
                  duration: bar.duration,
                  delay: bar.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ height: "40%" }}
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
            <Play className="size-4 opacity-60 sm:size-5" fill="currentColor" />
          ) : isPlaying ? (
            <Pause className="size-4 sm:size-5" fill="currentColor" />
          ) : (
            <Play className="size-4 sm:size-5" fill="currentColor" />
          )}
        </span>
      </motion.button>

      {status === "unavailable" ? (
        <p className="mt-2 max-w-[7.5rem] text-right text-[0.55rem] uppercase tracking-[0.18em] text-ivory/55 sm:max-w-[9rem]">
          {MUSIC.unavailable}
        </p>
      ) : (
        <p className="mt-2 max-w-[8.5rem] truncate text-right text-[0.55rem] uppercase tracking-[0.16em] text-champagne/70 sm:max-w-[10rem]">
          {MUSIC.title}
        </p>
      )}
    </div>
  );
}
