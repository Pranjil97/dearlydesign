"use client";

import type { ReactNode } from "react";
import { MusicProvider } from "@/components/music";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Client-side provider tree for App Router.
 * Keep browser-only concerns here so layouts/pages can stay Server Components.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SmoothScrollProvider>
      <MusicProvider>{children}</MusicProvider>
    </SmoothScrollProvider>
  );
}
