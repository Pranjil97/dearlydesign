/**
 * Central wedding schedule configuration.
 * Replace placeholders with real dates, venues, and map links.
 *
 * Ceremony datetime / timezone live in `@/config/wedding`.
 */
import {
  getWeddingLocalIso,
  getWeddingTargetMs,
  IMAGE_PATHS,
  WEDDING,
} from "@/config/wedding";

/** Shared festive photo for Mehendi / Haldi / Sangeet until unique shots exist. */
const PRE_WEDDING_IMAGE = IMAGE_PATHS.galleryCelebration;

/** ISO-8601 wedding datetime derived from the central config (UTC instant). */
export const WEDDING_COUNTDOWN_DATE = new Date(
  getWeddingTargetMs(WEDDING),
).toISOString();

/** Venue-local wall time string for reference / debugging. */
export const WEDDING_LOCAL_DATETIME = getWeddingLocalIso(WEDDING);

export type WeddingEventId =
  | "mehendi"
  | "haldi"
  | "sangeet"
  | "ceremony"
  | "reception";

export type WeddingEvent = {
  id: WeddingEventId;
  title: string;
  description: string;
  details: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  venueAddress: string;
  /** Google Maps destination URL — replace with a real maps link */
  mapsUrl: string;
  image: string;
  aspect: "portrait" | "landscape" | "wide";
};

export const WEDDING_EVENTS: WeddingEvent[] = [
  {
    id: "mehendi",
    title: "Mehendi",
    description:
      "An evening of intricate henna, music, and the soft glow of celebration.",
    details:
      "Join us as we adorn the bride with henna and gather in laughter, song, and the warmth of family. Traditional sweets and festive attire welcomed.",
    dateLabel: "[Mehendi Date]",
    timeLabel: "[Start Time]",
    venueName: "[Mehendi Venue Name]",
    venueAddress: "[Mehendi Venue Address]",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mehendi+Venue+Placeholder",
    image: PRE_WEDDING_IMAGE,
    aspect: "portrait",
  },
  {
    id: "haldi",
    title: "Haldi",
    description:
      "A radiant morning ritual of turmeric, blessings, and golden light.",
    details:
      "Celebrate this joyful ceremony of purification and blessings. Expect vibrant hues, playful moments, and cherished family traditions.",
    dateLabel: "[Haldi Date]",
    timeLabel: "[Start Time]",
    venueName: "[Haldi Venue Name]",
    venueAddress: "[Haldi Venue Address]",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Haldi+Venue+Placeholder",
    image: PRE_WEDDING_IMAGE,
    aspect: "portrait",
  },
  {
    id: "sangeet",
    title: "Sangeet",
    description:
      "A night of music, dance, and stories shared beneath champagne light.",
    details:
      "An evening performance of family dances, live music, and celebratory cheer. Come ready to dance and celebrate love in motion.",
    dateLabel: "[Sangeet Date]",
    timeLabel: "[Start Time]",
    venueName: "[Sangeet Venue Name]",
    venueAddress: "[Sangeet Venue Address]",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sangeet+Venue+Placeholder",
    image: PRE_WEDDING_IMAGE,
    aspect: "portrait",
  },
  {
    id: "ceremony",
    title: "Wedding Ceremony",
    description:
      "Sacred vows, timeless rituals, and the beginning of forever.",
    details:
      "Witness the sacred union as two families become one. Please arrive early to be seated before the ceremony begins.",
    dateLabel: "[Ceremony Date]",
    timeLabel: "[Start Time]",
    venueName: WEDDING.venue,
    venueAddress: WEDDING.venueAddress,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${WEDDING.venue} ${WEDDING.location}`)}`,
    image: IMAGE_PATHS.ceremony,
    aspect: "wide",
  },
  {
    id: "reception",
    title: "Reception",
    description:
      "An elegant evening of dining, dancing, and heartfelt celebration.",
    details:
      "Raise a glass as we celebrate the newlyweds. Dinner, dancing, and joyful conversation await under a night of gold and ivory.",
    dateLabel: "[Reception Date]",
    timeLabel: "[Start Time]",
    venueName: WEDDING.venue,
    venueAddress: WEDDING.venueAddress,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${WEDDING.venue} ${WEDDING.location}`)}`,
    image: IMAGE_PATHS.reception,
    aspect: "landscape",
  },
];

export const COUNTDOWN_COPY = {
  eyebrow: WEDDING.countdown.eyebrow,
  title: WEDDING.countdown.title,
  weddingDayTitle: WEDDING.countdown.weddingDayTitle,
  weddingDayBody: WEDDING.countdown.weddingDayBody,
  completeTitle: WEDDING.countdown.completeTitle,
  completeBody: WEDDING.countdown.completeBody,
} as const;

export const CELEBRATIONS_COPY = {
  eyebrow: "Wedding Celebrations",
  title: "Five chapters of joy",
  subtitle: "Each gathering is a distinct moment in our celebration.",
  expandLabel: "Event details",
  collapseLabel: "Show less",
  directionsLabel: "Get Directions",
} as const;
