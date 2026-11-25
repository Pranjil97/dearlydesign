import { NextResponse } from "next/server";
import { RSVP_DEMO_MODE } from "@/lib/constants/rsvp";
import type {
  RsvpApiResponse,
  RsvpFieldErrors,
  RsvpPayload,
} from "@/lib/rsvp/types";
import { isValidIndianMobile, normalizeIndianMobile } from "@/lib/rsvp/validation";

function badRequest(message: string, fieldErrors?: RsvpFieldErrors) {
  const body: RsvpApiResponse = {
    ok: false,
    mode: RSVP_DEMO_MODE ? "demo" : "live",
    message,
    fieldErrors,
  };
  return NextResponse.json(body, { status: 400 });
}

/**
 * RSVP endpoint.
 *
 * DEMO MODE (default): simulates a successful response after a short delay.
 * Responses are NOT persisted. Replace the demo branch with your database /
 * CRM / spreadsheet integration when ready for production.
 */
export async function POST(request: Request) {
  let body: Partial<RsvpPayload>;

  try {
    body = (await request.json()) as Partial<RsvpPayload>;
  } catch {
    return badRequest("Invalid JSON payload.");
  }

  const fullName = body.fullName?.trim() ?? "";
  const phoneRaw = body.phone?.trim() ?? "";
  const attendance = body.attendance;

  if (!fullName || fullName.length < 2) {
    return badRequest("Please enter your full name.", {
      fullName: "Please enter your full name.",
    });
  }

  if (!isValidIndianMobile(phoneRaw)) {
    return badRequest("Invalid phone number.", {
      phone: "Enter a valid Indian mobile number.",
    });
  }

  if (attendance !== "accept" && attendance !== "decline") {
    return badRequest("Attendance selection is required.", {
      attendance: "Please select whether you will attend.",
    });
  }

  if (attendance === "accept") {
    const count = body.guestCount;
    if (
      typeof count !== "number" ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 20
    ) {
      return badRequest("Guest count is required when accepting.", {
        guestCount: "Guest count must be between 1 and 20.",
      });
    }
  }

  // Simulate network latency for a realistic demo UX.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (RSVP_DEMO_MODE) {
    const response: RsvpApiResponse = {
      ok: true,
      mode: "demo",
      guestName: fullName,
      attendance,
      message:
        "Demo mode: RSVP received in simulation only. Connect a real backend to persist guest responses.",
    };
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "X-RSVP-Mode": "demo",
      },
    });
  }

  // --- LIVE INTEGRATION POINT -----------------------------------------------
  // Persist the payload with normalizeIndianMobile(phoneRaw), then return:
  // { ok: true, mode: "live", guestName: fullName, attendance, message: "..." }
  //
  // Example:
  // await db.rsvp.create({ data: { ...body, phone: normalizeIndianMobile(phoneRaw) } })
  // ---------------------------------------------------------------------------

  void normalizeIndianMobile;

  return NextResponse.json(
    {
      ok: false,
      mode: "live",
      message:
        "Live RSVP storage is not configured yet. Enable demo mode or connect a backend.",
    } satisfies RsvpApiResponse,
    { status: 501 },
  );
}
