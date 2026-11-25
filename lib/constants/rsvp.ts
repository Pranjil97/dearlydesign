/**
 * RSVP copy and integration settings.
 *
 * DEMO MODE: submissions are simulated by `/api/rsvp` and are NOT persisted.
 * Set `RSVP_DEMO_MODE` to false and point the route handler at a real backend
 * when you are ready to store guest responses.
 */
export const RSVP_DEMO_MODE = true;

export const RSVP_API_PATH = "/api/rsvp";

export const RSVP_COPY = {
  eyebrow: "RSVP",
  title: "We Would Love To Celebrate With You",
  subtitle: "Kindly share your response so we may prepare for your presence.",
  demoNotice:
    "Demo mode is active — responses are simulated and not saved to a database.",
  submit: "Send RSVP",
  submitting: "Sending…",
  acceptLabel: "Joyfully Accept",
  declineLabel: "Regretfully Decline",
  fields: {
    fullName: "Full name",
    phone: "Phone number",
    attendance: "Will you attend?",
    guestCount: "Number of guests",
    dietary: "Dietary preferences",
    message: "Personal message",
  },
  placeholders: {
    fullName: "Your full name",
    phone: "10-digit Indian mobile number",
    guestCount: "Including yourself",
    dietary: "Vegetarian, allergies, etc. (optional)",
    message: "A note for the couple (optional)",
  },
  confirmation: {
    acceptTitle: "We cannot wait to celebrate with you",
    declineTitle: "Thank you for letting us know",
    acceptBody:
      "Your joyful acceptance means the world to us. We look forward to sharing this beautiful day with you, {name}.",
    declineBody:
      "We will miss you, {name}. Thank you for taking a moment to respond — you remain in our hearts.",
    demoBadge: "Demo confirmation — not stored",
  },
} as const;
