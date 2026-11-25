import type {
  Attendance,
  RsvpFieldErrors,
  RsvpFormValues,
  RsvpPayload,
} from "./types";

/** Normalize Indian mobile input to a 10-digit number when possible. */
export function normalizeIndianMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidIndianMobile(raw: string): boolean {
  const normalized = normalizeIndianMobile(raw);
  return /^[6-9]\d{9}$/.test(normalized);
}

export function validateRsvpForm(
  values: RsvpFormValues,
): { ok: true; payload: RsvpPayload } | { ok: false; fieldErrors: RsvpFieldErrors } {
  const fieldErrors: RsvpFieldErrors = {};

  const fullName = values.fullName.trim();
  if (!fullName) {
    fieldErrors.fullName = "Please enter your full name.";
  } else if (fullName.length < 2) {
    fieldErrors.fullName = "Name must be at least 2 characters.";
  }

  const phone = values.phone.trim();
  if (!phone) {
    fieldErrors.phone = "Please enter your phone number.";
  } else if (!isValidIndianMobile(phone)) {
    fieldErrors.phone =
      "Enter a valid Indian mobile number (10 digits starting with 6–9).";
  }

  if (values.attendance !== "accept" && values.attendance !== "decline") {
    fieldErrors.attendance = "Please select whether you will attend.";
  }

  let guestCount: number | undefined;
  if (values.attendance === "accept") {
    const parsed = Number.parseInt(values.guestCount, 10);
    if (!values.guestCount.trim() || Number.isNaN(parsed)) {
      fieldErrors.guestCount = "Please enter the number of guests.";
    } else if (parsed < 1 || parsed > 20) {
      fieldErrors.guestCount = "Guest count must be between 1 and 20.";
    } else {
      guestCount = parsed;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  const payload: RsvpPayload = {
    fullName,
    phone: normalizeIndianMobile(phone),
    attendance: values.attendance as Attendance,
    dietary: values.dietary.trim() || undefined,
    message: values.message.trim() || undefined,
  };

  if (values.attendance === "accept" && guestCount !== undefined) {
    payload.guestCount = guestCount;
  }

  return { ok: true, payload };
}
