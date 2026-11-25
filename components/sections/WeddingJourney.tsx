"use client";

import { useEffect } from "react";
import { WeddingHero } from "./WeddingHero";
import { OurStory } from "./OurStory";
import { TheBeginning } from "./TheBeginning";
import { OurJourney } from "./OurJourney";
import { Countdown } from "./Countdown";
import { Celebrations } from "./Celebrations";
import { SaveTheDate } from "./SaveTheDate";
import { RsvpSection } from "./RsvpSection";
import { FinalThankYou } from "./FinalThankYou";
import { registerGsap, ScrollTrigger } from "@/lib/animations";

type WeddingJourneyProps = {
  reducedMotion?: boolean;
};

/**
 * Post-envelope cinematic journey.
 * Refresh ScrollTrigger after mount so Lenis layout is measured correctly.
 */
export function WeddingJourney({
  reducedMotion = false,
}: WeddingJourneyProps) {
  useEffect(() => {
    registerGsap();
    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    const timeout = window.setTimeout(() => ScrollTrigger.refresh(), 1100);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="overflow-x-hidden bg-burgundy">
      <WeddingHero reducedMotion={reducedMotion} />
      <OurStory reducedMotion={reducedMotion} />
      <TheBeginning reducedMotion={reducedMotion} />
      <OurJourney reducedMotion={reducedMotion} />
      <Countdown reducedMotion={reducedMotion} />
      <Celebrations reducedMotion={reducedMotion} />
      <SaveTheDate reducedMotion={reducedMotion} />
      <RsvpSection reducedMotion={reducedMotion} />
      <FinalThankYou reducedMotion={reducedMotion} />
    </div>
  );
}
