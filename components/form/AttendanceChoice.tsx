"use client";

import { cn } from "@/lib/utils/cn";
import type { Attendance } from "@/lib/rsvp/types";
import { RSVP_COPY } from "@/lib/constants/rsvp";
import { FieldShell } from "./Field";

type AttendanceChoiceProps = {
  value: Attendance | "";
  onChange: (value: Attendance) => void;
  error?: string;
  disabled?: boolean;
};

const OPTIONS: { value: Attendance; label: string }[] = [
  { value: "accept", label: RSVP_COPY.acceptLabel },
  { value: "decline", label: RSVP_COPY.declineLabel },
];

export function AttendanceChoice({
  value,
  onChange,
  error,
  disabled,
}: AttendanceChoiceProps) {
  return (
    <FieldShell
      id="attendance"
      label={RSVP_COPY.fields.attendance}
      error={error}
      htmlFor={false}
    >
      <div
        role="radiogroup"
        aria-labelledby="attendance-label"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "attendance-error" : undefined}
        className="grid gap-3 sm:grid-cols-2"
      >
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-12 border px-4 py-3 font-heading text-base tracking-wide transition-colors",
                selected
                  ? "border-champagne bg-champagne/15 text-ivory"
                  : "border-champagne/30 bg-transparent text-ivory/80 hover:border-champagne/60",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}
