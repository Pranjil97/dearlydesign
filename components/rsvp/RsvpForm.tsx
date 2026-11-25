"use client";

import { useCallback, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AttendanceChoice, TextAreaField, TextField } from "@/components/form";
import { easings } from "@/lib/animations";
import { RSVP_COPY } from "@/lib/constants/rsvp";
import { submitRsvp } from "@/lib/rsvp/submitRsvp";
import type {
  Attendance,
  RsvpFieldErrors,
  RsvpFormValues,
  RsvpSuccessResponse,
} from "@/lib/rsvp/types";
import { validateRsvpForm } from "@/lib/rsvp/validation";

const INITIAL: RsvpFormValues = {
  fullName: "",
  phone: "",
  attendance: "",
  guestCount: "1",
  dietary: "",
  message: "",
};

type RsvpFormProps = {
  reducedMotion?: boolean;
  onSuccess: (result: RsvpSuccessResponse) => void;
};

export function RsvpForm({ reducedMotion = false, onSuccess }: RsvpFormProps) {
  const [values, setValues] = useState<RsvpFormValues>(INITIAL);
  const [errors, setErrors] = useState<RsvpFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = useCallback(
    <K extends keyof RsvpFormValues>(key: K, value: RsvpFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setFormError(null);
    const validated = validateRsvpForm(values);
    if (!validated.ok) {
      setErrors(validated.fieldErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const result = await submitRsvp(validated.payload);
      if (!result.ok) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      onSuccess(result);
    } catch {
      setFormError(
        "We could not send your RSVP right now. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-xl flex-col gap-6"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -16, filter: "blur(4px)" }
      }
      transition={{
        duration: reducedMotion ? 0.2 : 0.7,
        ease: easings.cinematicOut,
      }}
    >
      <p className="rounded-none border border-champagne/25 bg-wine/40 px-4 py-3 text-sm text-ivory/70">
        {RSVP_COPY.demoNotice}
      </p>

      <TextField
        id="fullName"
        name="fullName"
        label={RSVP_COPY.fields.fullName}
        placeholder={RSVP_COPY.placeholders.fullName}
        autoComplete="name"
        value={values.fullName}
        onChange={(e) => update("fullName", e.target.value)}
        error={errors.fullName}
        disabled={submitting}
        required
      />

      <TextField
        id="phone"
        name="phone"
        type="tel"
        inputMode="numeric"
        label={RSVP_COPY.fields.phone}
        placeholder={RSVP_COPY.placeholders.phone}
        autoComplete="tel"
        value={values.phone}
        onChange={(e) => update("phone", e.target.value)}
        error={errors.phone}
        disabled={submitting}
        required
      />

      <AttendanceChoice
        value={values.attendance}
        onChange={(value: Attendance) => update("attendance", value)}
        error={errors.attendance}
        disabled={submitting}
      />

      <AnimatePresence initial={false}>
        {values.attendance === "accept" ? (
          <motion.div
            key="guest-count"
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, height: 0 }
            }
            transition={{ duration: reducedMotion ? 0.15 : 0.35 }}
            className="overflow-hidden"
          >
            <TextField
              id="guestCount"
              name="guestCount"
              type="number"
              min={1}
              max={20}
              label={RSVP_COPY.fields.guestCount}
              placeholder={RSVP_COPY.placeholders.guestCount}
              value={values.guestCount}
              onChange={(e) => update("guestCount", e.target.value)}
              error={errors.guestCount}
              disabled={submitting}
              required
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <TextField
        id="dietary"
        name="dietary"
        label={RSVP_COPY.fields.dietary}
        placeholder={RSVP_COPY.placeholders.dietary}
        value={values.dietary}
        onChange={(e) => update("dietary", e.target.value)}
        optional
        disabled={submitting}
      />

      <TextAreaField
        id="message"
        name="message"
        label={RSVP_COPY.fields.message}
        placeholder={RSVP_COPY.placeholders.message}
        value={values.message}
        onChange={(e) => update("message", e.target.value)}
        optional
        disabled={submitting}
        rows={4}
      />

      {formError ? (
        <p role="alert" className="text-sm text-[#E8B4B8]">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 min-h-12 border border-champagne bg-champagne/10 px-6 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-champagne transition-colors hover:bg-champagne/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? RSVP_COPY.submitting : RSVP_COPY.submit}
      </button>
    </motion.form>
  );
}
