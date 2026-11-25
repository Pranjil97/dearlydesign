import { RSVP_API_PATH } from "@/lib/constants/rsvp";
import type { RsvpApiResponse, RsvpPayload } from "./types";

/**
 * Client helper for RSVP submission.
 * Swap `RSVP_API_PATH` / route handler internals when connecting a real backend.
 */
export async function submitRsvp(
  payload: RsvpPayload,
): Promise<RsvpApiResponse> {
  const response = await fetch(RSVP_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: RsvpApiResponse;
  try {
    data = (await response.json()) as RsvpApiResponse;
  } catch {
    return {
      ok: false,
      message: "We could not read the server response. Please try again.",
    };
  }

  if (!response.ok && data.ok !== false) {
    return {
      ok: false,
      message: "Something went wrong while sending your RSVP. Please try again.",
    };
  }

  return data;
}
