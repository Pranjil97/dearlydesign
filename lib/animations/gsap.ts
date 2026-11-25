"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsapEases } from "./easings";

let registered = false;

/**
 * Register GSAP plugins once on the client.
 * Safe to call from multiple client components.
 */
export function registerGsap(): typeof gsap {
  if (typeof window === "undefined") return gsap;

  if (!registered) {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    gsap.defaults({
      ease: gsapEases.cinematicOut,
      duration: 1,
    });
    registered = true;
  }

  return gsap;
}

export { gsap, ScrollTrigger, useGSAP };
