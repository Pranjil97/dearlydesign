"use client";

import { useEffect, useState } from "react";
import {
  getCalendarDayKey,
  getCountdownPhase,
  getWeddingTargetMs,
  type CountdownPhase,
  WEDDING,
} from "@/config/wedding";

export type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  phase: CountdownPhase;
  /** True when the wedding calendar day has fully passed. */
  complete: boolean;
};

function getUnits(targetMs: number, nowMs: number) {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function buildValue(nowMs: number): CountdownValue {
  const targetMs = getWeddingTargetMs(WEDDING);
  const phase = getCountdownPhase(nowMs, WEDDING);
  const units = getUnits(targetMs, nowMs);

  return {
    ...units,
    phase,
    complete: phase === "complete",
  };
}

function isSame(a: CountdownValue, b: CountdownValue): boolean {
  return (
    a.days === b.days &&
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    a.seconds === b.seconds &&
    a.phase === b.phase &&
    a.complete === b.complete
  );
}

/**
 * Live countdown against the central wedding datetime + venue timezone.
 * Ticks once per second; only re-renders when units or phase change.
 */
export function useCountdown(): CountdownValue {
  const [value, setValue] = useState<CountdownValue>(() =>
    buildValue(Date.now()),
  );

  useEffect(() => {
    // Sync immediately on mount / config-driven remount.
    setValue(buildValue(Date.now()));

    const id = window.setInterval(() => {
      const next = buildValue(Date.now());
      setValue((prev) => (isSame(prev, next) ? prev : next));
    }, 1000);

    return () => window.clearInterval(id);
  }, [
    WEDDING.dateTime.year,
    WEDDING.dateTime.month,
    WEDDING.dateTime.day,
    WEDDING.dateTime.hour,
    WEDDING.dateTime.minute,
    WEDDING.dateTime.second,
    WEDDING.timeZone,
  ]);

  return value;
}

/** Expose helpers for tests / debugging without duplicating logic. */
export { getCalendarDayKey, getWeddingTargetMs };
