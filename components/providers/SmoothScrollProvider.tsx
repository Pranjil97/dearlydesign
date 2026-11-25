"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Bridges Lenis smooth scrolling with GSAP ScrollTrigger.
 * Uses the GSAP ticker as the single RAF source for frame-aligned updates.
 */
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
  }, []);

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
