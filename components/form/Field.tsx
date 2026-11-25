"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
  /** When false, render a non-label heading (e.g. for radiogroups). */
  htmlFor?: boolean;
};

export function FieldShell({
  id,
  label,
  error,
  optional,
  children,
  className,
  htmlFor = true,
}: FieldShellProps) {
  const errorId = `${id}-error`;
  const labelClass =
    "text-[0.65rem] font-medium uppercase tracking-[0.28em] text-champagne/90";

  const labelContent = (
    <>
      {label}
      {optional ? (
        <span className="ml-2 normal-case tracking-normal text-ivory/45">
          (optional)
        </span>
      ) : (
        <span className="sr-only"> (required)</span>
      )}
    </>
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {htmlFor ? (
        <label htmlFor={id} className={labelClass}>
          {labelContent}
        </label>
      ) : (
        <span id={`${id}-label`} className={labelClass}>
          {labelContent}
        </span>
      )}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-[#E8B4B8]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full min-h-12 rounded-none border border-champagne/30 bg-ivory/95 px-4 py-3 font-body text-base text-burgundy placeholder:text-burgundy/40 outline-none transition-colors focus:border-champagne focus:ring-1 focus:ring-champagne/50";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  optional?: boolean;
};

export function TextField({
  id,
  label,
  error,
  optional,
  className,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell id={fieldId} label={label} error={error} optional={optional}>
      <input
        id={fieldId}
        className={cn(controlClass, className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  optional?: boolean;
};

export function TextAreaField({
  id,
  label,
  error,
  optional,
  className,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell id={fieldId} label={label} error={error} optional={optional}>
      <textarea
        id={fieldId}
        className={cn(controlClass, "min-h-28 resize-y", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
    </FieldShell>
  );
}
