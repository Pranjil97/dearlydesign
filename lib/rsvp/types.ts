export type Attendance = "accept" | "decline";

export type RsvpPayload = {
  fullName: string;
  phone: string;
  attendance: Attendance;
  guestCount?: number;
  dietary?: string;
  message?: string;
};

export type RsvpFormValues = {
  fullName: string;
  phone: string;
  attendance: Attendance | "";
  guestCount: string;
  dietary: string;
  message: string;
};

export type RsvpFieldErrors = Partial<
  Record<keyof RsvpFormValues, string>
>;

export type RsvpSuccessResponse = {
  ok: true;
  mode: "demo" | "live";
  guestName: string;
  attendance: Attendance;
  message: string;
};

export type RsvpErrorResponse = {
  ok: false;
  mode?: "demo" | "live";
  message: string;
  fieldErrors?: RsvpFieldErrors;
};

export type RsvpApiResponse = RsvpSuccessResponse | RsvpErrorResponse;
