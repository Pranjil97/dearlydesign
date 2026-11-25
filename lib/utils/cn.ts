type ClassValue = string | false | null | undefined;

/**
 * Lightweight className joiner — keeps the foundation free of extra deps.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
