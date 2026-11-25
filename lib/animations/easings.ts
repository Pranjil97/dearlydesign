/**
 * Shared easing curves for Motion and GSAP.
 * Keep cinematic motion soft and luxurious — avoid snappy UI defaults.
 */
export const easings = {
  /** Soft cinematic ease-out for entrances */
  cinematicOut: [0.22, 1, 0.36, 1] as const,
  /** Gentle ease-in-out for ambient transitions */
  cinematicInOut: [0.65, 0, 0.35, 1] as const,
  /** Subtle overshoot for decorative flourishes */
  softBack: [0.34, 1.4, 0.64, 1] as const,
} as const;

/** GSAP-compatible easing strings */
export const gsapEases = {
  cinematicOut: "power3.out",
  cinematicInOut: "power2.inOut",
  softBack: "back.out(1.4)",
  silk: "expo.out",
} as const;
