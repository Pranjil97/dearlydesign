"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type Particle = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
};

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    const seed = (id * 17) % 100;
    return {
      id,
      left: `${(seed * 1.37) % 100}%`,
      size: 1.5 + (id % 4) * 0.6,
      duration: 10 + (id % 7) * 1.8,
      delay: (id % 9) * 0.7,
      opacity: 0.18 + (id % 5) * 0.08,
      drift: ((id % 2 === 0 ? 1 : -1) * (8 + (id % 5) * 4)) / 1,
    };
  });
}

type GoldParticlesProps = {
  count?: number;
};

export function GoldParticles({ count = 28 }: GoldParticlesProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const particles = useMemo(() => createParticles(count), [count]);

  if (prefersReducedMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        {particles.slice(0, 10).map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-champagne"
            style={{
              left: particle.left,
              top: `${20 + ((particle.id * 13) % 60)}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity * 0.7,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-champagne"
          style={{
            left: particle.left,
            bottom: "-4%",
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px color-mix(in srgb, var(--champagne) 50%, transparent)`,
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, particle.drift, 0],
            opacity: [0, particle.opacity, particle.opacity * 0.4, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
