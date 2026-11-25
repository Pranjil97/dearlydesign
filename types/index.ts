export type SectionId =
  | "hero"
  | "invitation"
  | "story"
  | "beginning"
  | "journey"
  | "countdown"
  | "events"
  | "save-the-date"
  | "rsvp"
  | "thank-you"
  | "gallery"
  | "footer";

export type NavItem = {
  label: string;
  href: string;
  sectionId?: SectionId;
};
