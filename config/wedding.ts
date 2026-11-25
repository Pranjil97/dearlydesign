/**
 * Central wedding configuration — edit this file to update names, date,
 * venue, and related copy across the entire experience.
 *
 * Do not invent real personal details here; keep placeholders until ready.
 */

export const WEDDING = {
  // Demo placeholders — replace with the real couple details when ready.
  bride: "Anaya",
  groom: "Kabir",

  /**
   * Wedding ceremony local wall-clock time at the venue.
   * Combined with `timeZone` for countdown accuracy.
   */
  dateTime: {
    year: 2027,
    month: 12,
    day: 15,
    hour: 18,
    minute: 0,
    second: 0,
  },

  /** IANA timezone for the wedding venue (e.g. Asia/Kolkata). */
  timeZone: "Asia/Kolkata",

  venue: "The Grand Pavilion",
  venueAddress: "12 Celebration Avenue",
  location: "Mumbai, India",

  eyebrow: "Together with their families",
  subtitle: "Beginning a beautiful journey",
  dateLabel: "Wedding Date",
  venueHint: "A celebration of love, light & legacy",

  story: {
    eyebrow: "Our Story",
    title: "Every Love Story Has A Beginning",
    body: "Two hearts found their rhythm in shared laughter, long conversations, and the kind of love that feels like coming home. This chapter is only the beginning of a lifetime written together.",
  },
  beginning: {
    eyebrow: "The Beginning",
    title: "Where forever quietly began",
    body: "In a moment suspended between laughter and light, two lives turned toward the same horizon.",
  },
  journey: {
    eyebrow: "Wedding Gallery",
    title: "Moments that became memory",
  },
  saveTheDate: {
    eyebrow: "Save The Date",
    title: "Join us as we begin forever",
    cta: "We cannot wait to celebrate with you",
  },
  countdown: {
    eyebrow: "Countdown",
    title: "The Celebration Begins In",
    weddingDayTitle: "Today We Become One",
    weddingDayBody:
      "The day has arrived — surrounded by love, family, and the promise of forever.",
    completeTitle: "A Celebration Remembered",
    completeBody:
      "The vows have been spoken and the celebration lives on in every heart that joined us.",
  },
  thankYou: {
    eyebrow: "With gratitude",
    title: "Your Presence Is Our Greatest Gift",
  },
  envelope: {
    brand: "The Wedding Experience",
    inviteLine: "You are cordially invited",
    celebrationLine: "A celebration of love",
    openLabel: "Open Invitation",
  },
} as const;

export type WeddingConfig = typeof WEDDING;

/** Couple display string used across envelope, hero, RSVP, thank-you, etc. */
export function getCoupleNames(
  config: Pick<WeddingConfig, "bride" | "groom"> = WEDDING,
): string {
  return `${config.bride} & ${config.groom}`;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Local ISO-like stamp without offset: YYYY-MM-DDTHH:mm:ss */
export function getWeddingLocalIso(
  config: Pick<WeddingConfig, "dateTime"> = WEDDING,
): string {
  const { year, month, day, hour, minute, second } = config.dateTime;
  return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;
}

/**
 * Offset (ms) of `timeZone` relative to UTC at the given instant:
 * local = utc + offset  ⇒  utc = local - offset
 */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  const hour = map.hour === "24" ? 0 : Number(map.hour);
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    hour,
    Number(map.minute),
    Number(map.second),
  );

  return asUtc - date.getTime();
}

/**
 * Convert a venue-local wall time into a UTC epoch ms, respecting DST.
 */
export function getWeddingTargetMs(
  config: Pick<WeddingConfig, "dateTime" | "timeZone"> = WEDDING,
): number {
  const localIso = getWeddingLocalIso(config);
  const guess = new Date(`${localIso}Z`);
  const offset1 = getTimeZoneOffsetMs(guess, config.timeZone);
  let utcMs = guess.getTime() - offset1;
  const offset2 = getTimeZoneOffsetMs(new Date(utcMs), config.timeZone);
  utcMs = guess.getTime() - offset2;
  return utcMs;
}

/** Formatted date label for hero / save-the-date / thank-you. */
export function getWeddingDateLabel(
  config: Pick<WeddingConfig, "dateTime" | "timeZone"> = WEDDING,
): string {
  const target = new Date(getWeddingTargetMs(config));
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: config.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(target);
}

/** Optional time label in venue timezone. */
export function getWeddingTimeLabel(
  config: Pick<WeddingConfig, "dateTime" | "timeZone"> = WEDDING,
): string {
  const target = new Date(getWeddingTargetMs(config));
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: config.timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(target);
}

/** YYYY-MM-DD calendar key in the venue timezone. */
export function getCalendarDayKey(ms: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(ms));

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return `${map.year}-${map.month}-${map.day}`;
}

export type CountdownPhase = "upcoming" | "weddingDay" | "complete";

export function getCountdownPhase(
  nowMs: number = Date.now(),
  config: Pick<WeddingConfig, "dateTime" | "timeZone"> = WEDDING,
): CountdownPhase {
  const weddingDay = getCalendarDayKey(
    getWeddingTargetMs(config),
    config.timeZone,
  );
  const today = getCalendarDayKey(nowMs, config.timeZone);

  if (today < weddingDay) return "upcoming";
  if (today === weddingDay) return "weddingDay";
  return "complete";
}

/** Image paths used across the experience (real files only). */
export const IMAGE_PATHS = {
  heroPortrait: "/images/hero/wedding-hero.jpg",
  floralLeft: "/images/hero/floral-left.svg",
  floralRight: "/images/hero/floral-right.svg",
  floralBgLeft: "/images/hero/floral-bg-left.svg",
  floralBgRight: "/images/hero/floral-bg-right.svg",
  storyEditorial: "/images/story/couple-story.jpg",
  beginningBg: "/images/gallery/wedding-portrait.jpg",
  galleryPortrait: "/images/gallery/wedding-portrait.jpg",
  galleryCelebration: "/images/gallery/wedding-celebration.jpg",
  invitationDetail: "/images/details/wedding-invitation.jpg",
  venue: "/images/venue/wedding-venue.jpg",
  ceremony: "/images/events/wedding-mandap.jpg",
  reception: "/images/events/reception-dinner.jpg",
} as const;

export type GalleryAspect = "portrait" | "landscape" | "wide";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  aspect: GalleryAspect;
};

/**
 * Premium gallery — only real downloaded photos present in /public/images.
 * SVG placeholders are intentionally excluded.
 */
export const WEDDING_GALLERY: GalleryItem[] = [
  {
    id: "01",
    src: IMAGE_PATHS.heroPortrait,
    alt: "Couple portrait",
    caption: "The first glance",
    aspect: "portrait",
  },
  {
    id: "02",
    src: IMAGE_PATHS.storyEditorial,
    alt: "Couple story portrait",
    caption: "Written in light",
    aspect: "landscape",
  },
  {
    id: "03",
    src: IMAGE_PATHS.galleryPortrait,
    alt: "Wedding portrait",
    caption: "Quiet devotion",
    aspect: "portrait",
  },
  {
    id: "04",
    src: IMAGE_PATHS.galleryCelebration,
    alt: "Celebration moment",
    caption: "Joy in bloom",
    aspect: "landscape",
  },
  {
    id: "05",
    src: IMAGE_PATHS.ceremony,
    alt: "Wedding ceremony setting",
    caption: "Sacred vows",
    aspect: "wide",
  },
  {
    id: "06",
    src: IMAGE_PATHS.reception,
    alt: "Reception celebration",
    caption: "Evening gold",
    aspect: "landscape",
  },
  {
    id: "07",
    src: IMAGE_PATHS.venue,
    alt: "Wedding venue",
    caption: "Where we gather",
    aspect: "wide",
  },
  {
    id: "08",
    src: IMAGE_PATHS.invitationDetail,
    alt: "Invitation detail",
    caption: "The invitation",
    aspect: "portrait",
  },
];

/** @deprecated Prefer WEDDING_GALLERY — kept for transitional imports. */
export const JOURNEY_GALLERY = WEDDING_GALLERY;
