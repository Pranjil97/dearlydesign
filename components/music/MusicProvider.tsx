"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MUSIC } from "@/lib/constants/music";

export type MusicStatus =
  | "idle"
  | "ready"
  | "playing"
  | "paused"
  | "unavailable";

type MusicContextValue = {
  status: MusicStatus;
  isPlaying: boolean;
  hasStarted: boolean;
  /** Call from a user gesture (Open Invitation) to start from 0:00. */
  playFromStart: () => Promise<void>;
  toggle: () => Promise<void>;
  pause: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

type MusicProviderProps = {
  children: ReactNode;
};

/**
 * Owns a single global HTMLAudioElement for the wedding theme.
 * Playback never starts on load — only via playFromStart() from a click.
 */
export function MusicProvider({ children }: MusicProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<MusicStatus>("idle");
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.src = MUSIC.src;
    audioRef.current = audio;

    const onCanPlay = () => {
      setStatus((prev) =>
        prev === "playing" || prev === "paused" ? prev : "ready",
      );
    };
    const onError = () => setStatus("unavailable");
    const onPlay = () => setStatus("playing");
    const onPause = () =>
      setStatus((prev) => (prev === "unavailable" ? prev : "paused"));

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.load();

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  const playFromStart = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasStarted(true);

    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      // Autoplay / missing file — keep UI usable; mark unavailable only on hard fail.
      if (!audio.src || audio.error) {
        setStatus("unavailable");
      } else {
        setStatus("paused");
      }
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || status === "unavailable") return;

    try {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      await audio.play();
    } catch {
      setStatus("unavailable");
    }
  }, [status]);

  const value = useMemo<MusicContextValue>(
    () => ({
      status,
      isPlaying: status === "playing",
      hasStarted,
      playFromStart,
      toggle,
      pause,
    }),
    [status, hasStarted, playFromStart, toggle, pause],
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return ctx;
}
